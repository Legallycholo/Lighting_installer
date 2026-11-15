import { site } from "@/content/site";
import {
  attributionKeys,
  attributionSchema,
  type Attribution,
} from "./lead-schema";

const STORAGE_KEY = "glow:attribution:v1";
const CONSENT_KEY = "glow:attribution-consent:v1";
const enabled = () =>
  site.attribution.enabled &&
  process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true";
const retentionMs = () => site.attribution.retentionDays * 86_400_000;

export function hasAttributionConsent(): boolean {
  if (typeof window === "undefined" || !enabled()) return false;
  try {
    const consent = Number(localStorage.getItem(CONSENT_KEY));
    return consent > 0 && Date.now() - consent < retentionMs();
  } catch {
    return false;
  }
}

/** Explicit, separate marketing measurement consent; never inferred from contact consent. */
export function setAttributionConsent(allowed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (!allowed || !enabled()) {
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(CONSENT_KEY, String(Date.now()));
    captureAttribution();
  } catch {
    /* Storage is optional; private browsers may deny it. */
  }
}

export function readAttribution(): Attribution | undefined {
  if (!hasAttributionConsent()) {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* No storage permission. */
      }
    }
    return undefined;
  }
  try {
    const parsed = attributionSchema.safeParse(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"),
    );
    if (
      !parsed.success ||
      Date.now() - Date.parse(parsed.data.first.capturedAt) >= retentionMs()
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
    return parsed.data;
  } catch {
    return undefined;
  }
}

/** Only approved campaign parameters; no URLs, referrer paths, history, or arbitrary query keys. */
export function captureAttribution(): void {
  if (!hasAttributionConsent()) return;
  const query = new URLSearchParams(window.location.search);
  const values: Attribution["first"]["values"] = {};
  for (const key of attributionKeys) {
    const value = query.get(key);
    if (value && value.length <= 200 && /^[a-zA-Z0-9._~ -]+$/.test(value))
      values[key] = value;
  }
  if (!Object.keys(values).length) return;
  const touch = { capturedAt: new Date().toISOString(), values };
  const existing = readAttribution();
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        consent: true,
        first: existing?.first ?? touch,
        last: touch,
      } satisfies Attribution),
    );
  } catch {
    /* Attribution must never block requesting a quote. */
  }
}
