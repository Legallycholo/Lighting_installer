import type { LeadInput } from "./lead-schema";

export type LeadResult =
  | { ok: true; mode: "demo" | "live"; id: string }
  | { ok: false; error: string; fields?: Record<string, string> };

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Submit a lead to the project's own `/api/leads` route — never directly to a
 * third-party webhook. Keep the same idempotency key for retries of an
 * unchanged payload; replace it after any edit. An optional `signal` lets the
 * caller cancel (for example on unmount); the request also times out on its own.
 */
export async function submitLead(
  payload: LeadInput,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<LeadResult> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    const result: unknown = await response.json();
    if (
      result &&
      typeof result === "object" &&
      "ok" in result &&
      typeof result.ok === "boolean"
    ) {
      return result as LeadResult;
    }
  } catch {
    // The form retains answers; never log the request or contact information.
  }
  return {
    ok: false,
    error: "Your request could not be sent. Please try again.",
  };
}
