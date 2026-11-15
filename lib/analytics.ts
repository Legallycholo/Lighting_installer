import { hasAttributionConsent } from "./attribution";

export type AnalyticsEvent =
  | "quote_start"
  | "zip_result"
  | "step_complete"
  | "submit_success"
  | "submit_failure"
  | "call_click"
  | "text_click";

/**
 * First-party integration hook only. No analytics SDK or remote destination is loaded.
 * An approved project-owned integration may listen to `glow:analytics` after opt-in.
 * Never pass ZIPs, contact values, free text, or click IDs into event details.
 */
export function trackEvent(
  event: AnalyticsEvent,
  detail: { step?: number; inArea?: boolean; mode?: "demo" | "live" } = {},
): void {
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" ||
    !hasAttributionConsent()
  )
    return;
  window.dispatchEvent(
    new CustomEvent("glow:analytics", { detail: { event, ...detail } }),
  );
}
