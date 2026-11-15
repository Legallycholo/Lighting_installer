import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { indexable } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return indexable
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/thank-you"],
        },
        sitemap: `${site.seo.canonicalBase}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
