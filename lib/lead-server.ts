import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { isZipInArea } from "@/content/service-areas";
import { leadSchema, type Lead } from "./lead-schema";
import type { LeadResult } from "./lead-submit";

type Result = { body: LeadResult; status: number };
type Pending = {
  fingerprint: string;
  expires: number;
  promise: Promise<Result>;
};
// Single-process protections. Use an atomic shared store at the edge before scaling out.
const requests = new Map<string, { count: number; expires: number }>();
const submissions = new Map<string, Pending>();
const RATE_WINDOW = 15 * 60 * 1000;
const RATE_MAX = 30;
const IDEMPOTENCY_WINDOW = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 5000;
const MAX_BYTES = 16_384;
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const fail = (error: string, status: number): Result => ({
  body: { ok: false, error },
  status,
});

function prune(now: number) {
  for (const [key, entry] of requests)
    if (entry.expires <= now) requests.delete(key);
  for (const [key, entry] of submissions)
    if (entry.expires <= now) submissions.delete(key);
}

function rateAllowed(request: Request, now: number): boolean {
  // Only opt into a header that your ingress overwrites; never trust arbitrary forwarded headers.
  const header = process.env.LEAD_TRUSTED_IP_HEADER;
  const client = header
    ? (request.headers.get(header)?.slice(0, 128) ?? "unknown")
    : "shared";
  const key = hash(client);
  const entry = requests.get(key);
  if (!entry) {
    if (requests.size >= MAX_ENTRIES) return false;
    requests.set(key, { count: 1, expires: now + RATE_WINDOW });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_MAX;
}

async function readJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BYTES)
    throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const parts: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, 10_000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      parts.push(value);
    }
    if (timedOut) throw new DOMException("Request timeout", "TimeoutError");
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function allowedOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients are still validated and rate limited.
  const allowed = [new URL(request.url).origin];
  if (process.env.NEXT_PUBLIC_SITE_URL)
    allowed.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
  return allowed.includes(origin);
}

async function deliver(lead: Lead, key: string): Promise<Result> {
  const id = randomUUID();
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (process.env.LEAD_MODE !== "live") {
    console.info(JSON.stringify({ event: "lead_demo", id }));
    return { body: { ok: true, mode: "demo", id }, status: 200 };
  }
  if (!endpoint || process.env.CONTENT_APPROVED !== "true")
    return fail(
      "Quote delivery is not configured yet. Please try again later.",
      503,
    );
  let url: URL;
  try {
    url = new URL(endpoint);
    const forbiddenHost = "happylightsmiami.com";
    const host = url.hostname.replace(/\.$/, "");
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      host === forbiddenHost ||
      host.endsWith(`.${forbiddenHost}`)
    )
      throw new Error();
  } catch {
    return fail(
      "Quote delivery is not configured yet. Please try again later.",
      503,
    );
  }
  // Exclude the honeypot and compute service coverage server-side.
  const { website: _honeypot, ...details } = lead;
  void _honeypot;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": key,
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        id,
        ...details,
        inArea: isZipInArea(lead.zip),
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
      redirect: "error",
      cache: "no-store",
    });
    await response.body?.cancel();
    if (!response.ok) {
      console.warn(
        JSON.stringify({
          event: "lead_delivery_failure",
          id,
          status: response.status,
        }),
      );
      return fail("We could not deliver your request. Please try again.", 502);
    }
    console.info(JSON.stringify({ event: "lead_delivered", id }));
    return { body: { ok: true, mode: "live", id }, status: 200 };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      ["TimeoutError", "AbortError"].includes(error.name);
    console.warn(
      JSON.stringify({
        event: "lead_delivery_failure",
        id,
        reason: timedOut ? "timeout" : "network",
      }),
    );
    return fail(
      "We could not confirm delivery. Please retry with the same request.",
      timedOut ? 504 : 502,
    );
  }
}

export async function handleLead(request: Request): Promise<Response> {
  const headers = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const respond = (result: Result) =>
    Response.json(result.body, {
      status: result.status,
      headers: {
        ...headers,
        ...(result.status === 429 ? { "Retry-After": "900" } : {}),
      },
    });
  const now = Date.now();
  prune(now);
  if (!allowedOrigin(request))
    return respond(fail("This request origin is not allowed.", 403));
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return respond(fail("Send the request as JSON.", 415));
  if (!rateAllowed(request, now))
    return respond(
      fail("Too many requests. Please wait before trying again.", 429),
    );
  const key = request.headers.get("idempotency-key");
  if (
    !key ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      key,
    )
  )
    return respond(fail("A valid request key is required.", 400));
  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return respond(fail("The request took too long. Please try again.", 408));
    }
    return respond(
      fail(
        error instanceof RangeError
          ? "Request is too large."
          : "Invalid request body.",
        error instanceof RangeError ? 413 : 400,
      ),
    );
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      fields[String(issue.path[0])] ??= issue.message;
    return respond({
      body: {
        ok: false,
        error: "Please check the highlighted answers.",
        fields,
      },
      status: 400,
    });
  }
  if (parsed.data.website)
    return respond(fail("Unable to accept this request.", 400));
  const fingerprint = hash(JSON.stringify(parsed.data));
  const previous = submissions.get(key);
  if (previous) {
    if (previous.fingerprint !== fingerprint)
      return respond(
        fail("This request changed. Please use a new request key.", 409),
      );
    return respond(await previous.promise);
  }
  if (submissions.size >= MAX_ENTRIES)
    return respond(fail("Please try again shortly.", 503));
  // Insert the pending promise before awaiting, so simultaneous retries share one delivery.
  const promise = deliver(parsed.data, key);
  submissions.set(key, {
    fingerprint,
    expires: now + IDEMPOTENCY_WINDOW,
    promise,
  });
  const result = await promise;
  if (!result.body.ok) submissions.delete(key);
  return respond(result);
}
