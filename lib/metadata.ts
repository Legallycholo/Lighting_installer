import type { Metadata } from "next";
import { site } from "@/content/site";

export const contentApproved = process.env.CONTENT_APPROVED === "true";
export const indexable = contentApproved && site.seo.indexable;

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(site.seo.canonicalBase),
    alternates: { canonical: path },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: site.name,
      url: path,
      locale: site.seo.locale,
      images: [
        { url: site.seo.ogImage, width: 1200, height: 630, alt: site.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.seo.ogImage],
    },
  };
}

export const rootMetadata: Metadata = {
  ...pageMetadata(site.seo.title, site.seo.description, "/"),
  title: { default: site.seo.title, template: site.seo.titleTemplate },
  applicationName: site.shortName,
  icons: { icon: [{ url: "/media/logo.svg", type: "image/svg+xml" }] },
};
