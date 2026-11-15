import { site } from "@/content/site";
import { faqItems } from "@/content/faq";
import { contentApproved } from "./metadata";

/** No unverified business claims are emitted into search metadata. */
export function buildStructuredData() {
  if (!contentApproved || !site.seo.structuredDataReady) return null;
  const url = site.seo.canonicalBase;
  const businessId = `${url}/#business`;
  const placeId = `${url}/#place`;
  const address = {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
  const graph: Record<string, unknown>[] = [
    {
      "@type": ["LocalBusiness", "Organization"],
      "@id": businessId,
      name: site.name,
      legalName: site.legalName,
      url,
      logo: new URL(site.logo.src, url).href,
      telephone: site.phone.e164,
      email: site.email,
      address,
      location: { "@id": placeId },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: site.hours.days,
          opens: site.hours.opens,
          closes: site.hours.closes,
        },
      ],
      sameAs: Object.values(site.social).filter(Boolean),
    },
    {
      "@type": "Place",
      "@id": placeId,
      name: site.name,
      address,
      geo: { "@type": "GeoCoordinates", ...site.seo.geo },
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: site.name,
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": `${url}/#webpage`,
      url,
      name: site.seo.title,
      description: site.seo.description,
      isPartOf: { "@id": `${url}/#website` },
    },
  ];
  if (site.seo.faqSchema)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
            .map((segment) =>
              typeof segment === "string" ? segment : segment.b,
            )
            .join(""),
        },
      })),
    });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
