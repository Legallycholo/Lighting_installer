/**
 * Business identity, contact details, season, claims and SEO values.
 *
 * EVERY value here is a PLACEHOLDER until the project owner supplies real
 * business data. Nothing in this file belongs to the reference business.
 * Keep `seo.indexable` false until copy, assets and facts are final.
 */

export type Phone = {
  /** Human-readable, e.g. "(305) 555-0100" */
  display: string;
  /** E.164, used for tel:/sms: links and schema, e.g. "+13055550100" */
  e164: string;
};

export type Address = {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type Hours = {
  /** Shown in the footer, e.g. "Monday–Saturday" */
  daysLabel: string;
  /** Shown in the footer, e.g. "8am – 7pm" */
  timeLabel: string;
  /** schema.org dayOfWeek values */
  days: Array<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  >;
  opens: string;
  closes: string;
};

const canonicalBase =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const site = {
  /** PLACEHOLDER business identity */
  name: "Glow & Garland Lighting Co.",
  shortName: "Glow & Garland",
  /** Two-line word mark used beside the footer logo */
  wordmark: ["Glow & Garland", "Lighting Co."] as const,
  legalName: "Glow & Garland Lighting Co. LLC",
  foundedYear: 2019,

  logo: {
    src: "/media/logo.svg",
    width: 160,
    height: 160,
    alt: "Glow & Garland Lighting Co.",
  },

  /** PLACEHOLDER 555 numbers — replace with project-owned numbers */
  phone: { display: "(305) 555-0100", e164: "+13055550100" } satisfies Phone,
  smsPhone: { display: "(305) 555-0100", e164: "+13055550100" } satisfies Phone,
  /** Optional call-tracking number. Leave null until the owner supplies their own account. */
  trackingPhone: null as Phone | null,
  /** PLACEHOLDER — plain text in the legal row, never linked */
  altLine: "Alt. line (305) 555-0199",

  email: "hello@example.com",
  address: {
    street: "123 Placeholder Ave, Suite 100",
    city: "Miami",
    region: "FL",
    postalCode: "33101",
    country: "US",
  } satisfies Address,
  hours: {
    daysLabel: "Monday–Saturday",
    timeLabel: "8am – 7pm",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "19:00",
  } satisfies Hours,
  /** Empty strings hide the matching social button. */
  social: {
    instagram: "",
    facebook: "",
  },
  /** External review profile. Empty string hides the review links. */
  reviewUrl: "",

  season: {
    year: 2026,
    announcementLead: "Now booking the 2026 season.",
    announcementTail: "Install dates fill by early October.",
    /** Used in copy: "installs run <installWindow>" */
    installWindow: "September through December 13",
    installDeadline: "December 13",
    bookingEyebrow: "Now booking the 2026 season",
  },

  cta: {
    quote: "Get Free Design Help",
    call: "Call",
    text: "Text",
    checkZip: "Check my area",
  },

  /** PLACEHOLDER claims. Replace with verified figures before indexing. */
  stats: {
    rating: "5.0",
    ratingValue: 5,
    reviewCount: 50,
    reviewPlatform: "Google",
    ratingRank: "#1 in Miami-Dade",
    insurance: "$1M",
    homesServed: "1,000+",
    returnRate: "70%",
    repairHours: 48,
    depositPercent: 25,
    returnDiscount: 20,
    lastSeasonHomes: "600",
    lastSeasonRequests: "178",
    sameDayRate: "89%",
    designerResponse: "usually within 30 minutes",
  },

  /** PLACEHOLDER pricing. All figures in USD. */
  pricing: {
    seasonLow: 1500,
    seasonHigh: 3000,
    typical: 2000,
    estateFloor: 10000,
    startingAt: 1750,
  },

  repairPromise: {
    short: "Plus Unlimited Repairs.",
    long: "We come back even if a landscaper cut a wire, in 48 hours max.",
  },

  serviceSummary: "Miami-Dade and parts of Broward",

  seo: {
    title:
      "Christmas Light Installation in Miami — Glow & Garland Lighting Co.",
    titleTemplate: "%s — Glow & Garland Lighting Co.",
    description:
      "Done-for-you Christmas lighting: design, installation, unlimited repairs, takedown and storage for one flat seasonal price.",
    canonicalBase,
    ogImage: "/media/og.png",
    /** Flip to true only when copy, assets and business facts are final. */
    indexable: process.env.NEXT_PUBLIC_INDEXABLE === "true",
    /** Emit LocalBusiness/Organization JSON-LD only when the values are accurate. */
    structuredDataReady: process.env.NEXT_PUBLIC_STRUCTURED_DATA === "true",
    /** Emit FAQPage JSON-LD (only questions rendered on the page). */
    faqSchema: process.env.NEXT_PUBLIC_FAQ_SCHEMA === "true",
    locale: "en_US",
    geo: { latitude: 25.7617, longitude: -80.1918 },
  },

  legal: {
    copyrightHolder: "Glow & Garland Lighting Co.",
    licenseLine: "Licensed & insured in Florida.",
  },

  attribution: {
    enabled: process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true",
    /** Days to retain first/last-touch attribution in localStorage */
    retentionDays: 90,
    /** If true, nothing is stored until setAttributionConsent(true) is called. */
    requireConsent: true,
  },
} as const;

export type Site = typeof site;

export const telHref = (p: Phone) => `tel:${p.e164}`;
export const smsHref = (p: Phone) => `sms:${p.e164}`;
