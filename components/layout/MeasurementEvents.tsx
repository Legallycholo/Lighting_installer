"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

/** Optional first-party hooks; both modules default to disabled without consent. */
export function MeasurementEvents() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution();
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href");
      if (href?.startsWith("tel:")) trackEvent("call_click");
      if (href?.startsWith("sms:")) trackEvent("text_click");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);
  return null;
}
