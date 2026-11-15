import type { LeadInput } from "./lead-schema";

export type LeadResult =
  | { ok: true; mode: "demo" | "live"; id: string }
  | { ok: false; error: string; fields?: Record<string, string> };

/** Keep a key for retries of an unchanged payload; replace it after an edit. */
export async function submitLead(
  payload: LeadInput,
  idempotencyKey: string,
): Promise<LeadResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
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
