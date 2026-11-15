import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { indexable } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return ["/", "/christmas-light-quote", "/privacy-policy"].map((path) => ({
    url: new URL(path, site.seo.canonicalBase).href,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
