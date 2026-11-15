/**
 * Homepage copy and section data. PLACEHOLDER copy shaped to match the
 * reference composition. All strings live here, never in components.
 */
import { site } from "./site";

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  location: string;
};

export const hero = {
  headline: [
    { pre: "A ", em: "beautifully", post: " lit home," },
    { pre: "without any of the work.", em: "", post: "" },
  ],
  sub: "We handle every detail of your Christmas lighting — from the first design to the final takedown.",
  guaranteeStrong: site.repairPromise.short,
  guaranteeRest: site.repairPromise.long,
  fine: ["Free consultation", "Real human answers", "No obligation"],
  video: {
    poster: "/media/hero-reel-poster.svg",
    // Add project-owned AV1/H.264 files here when supplied (see ASSET-TODO.md).
    sources: [] as Array<{ src: string; type: string }>,
    playLabel: "Play video",
    pauseLabel: "Pause video",
    placeholderLabel: "Illustration · project photography coming soon",
    width: 780,
    height: 1040,
    ariaLabel:
      "Illustration of a home decorated with warm holiday lights at twilight",
  },
  plaque: {
    figure: `${site.stats.repairHours} hr`,
    label: "maintenance guarantee",
    text: "Unlimited repairs, all season.",
  },
  trust: [
    `${site.stats.insurance} insured`,
    `In business since ${site.foundedYear}`,
    `${site.stats.homesServed} homes lit`,
    "Dedicated project manager",
    "Unlimited repairs, all season",
  ],
};

export const comparison = {
  heading: {
    pre: "Our goal is ",
    em: "simple.",
    post: " Hire us — and it's taken care of.",
  },
  sub: "It sounds obvious. It's not how it usually goes. Most people have never hired anyone for this — and the ones who have usually tell us the same story.",
  bad: {
    label: "How it usually goes",
    title: "You hire someone, then you manage them.",
    points: [
      "A strand goes dark the week before Christmas and nobody answers.",
      "The crew that shows up is a landscaping crew.",
      "January arrives and the takedown is suddenly your problem.",
      "Storage is a corner of your garage, eleven months a year.",
    ],
  },
  connector: "instead",
  good: {
    label: "How it goes here",
    title: "You hire us, then you forget about it.",
    stages: [
      {
        title: "Design",
        text: "Mapped to your roofline, palms, columns and hedges. You approve it before we order a bulb.",
      },
      {
        title: "Installation",
        text: "Usually one to two days, on the date we committed to.",
      },
      {
        title: "Repairs",
        text: `Unlimited, and included. Anything that goes dark is fixed within ${site.stats.repairHours} hours — even if a landscaper cut the wire.`,
      },
      {
        title: "Takedown",
        text: "After New Year's, on our schedule, not yours — and it all stays with us until next season.",
      },
    ],
  },
  close: {
    text: "One flat price for the whole season. One project manager who answers the phone. ",
    strong: "Nothing left on your side.",
  },
};

export const gallery = {
  heading: {
    pre: `${site.stats.homesServed} South Florida homes. Here are a `,
    em: "few.",
    post: "",
  },
  sub: "Illustrative lighting concepts. Project photography will be added before launch.",
  items: [
    {
      src: "/media/gallery-1.svg",
      width: 1180,
      height: 885,
      alt: "Placeholder: mature oaks wrapped in warm white lights at night",
      location: "Coral Gables",
    },
    {
      src: "/media/gallery-2.svg",
      width: 760,
      height: 570,
      alt: "Placeholder: a home with a path-lit driveway and wrapped palms",
      location: "Pinecrest",
    },
    {
      src: "/media/gallery-3.svg",
      width: 760,
      height: 570,
      alt: "Placeholder: a home at dusk with a warm-white roofline",
      location: "Weston",
    },
    {
      src: "/media/gallery-4.svg",
      width: 675,
      height: 900,
      alt: "Placeholder: a twilight colonnade wrapped in warm white lights",
      location: "Coral Gables",
    },
    {
      src: "/media/gallery-5.svg",
      width: 760,
      height: 570,
      alt: "Placeholder: poolside palms wrapped in warm white lights",
      location: "Kendall",
    },
    {
      src: "/media/gallery-6.svg",
      width: 760,
      height: 427,
      alt: "Placeholder: lit topiary and hedges at dusk",
      location: "Gables by the Sea",
    },
  ] satisfies GalleryItem[],
  claim: {
    text: "Preview gallery — these are original illustrations, not completed installations. ",
    strong: "Your project photography belongs here.",
  },
  stats: [
    { n: site.stats.homesServed, l: "Homes lit" },
    { n: site.stats.rating, l: `${site.stats.reviewPlatform} rating` },
    { n: String(site.foundedYear), l: "Lighting South Florida since" },
    { n: site.stats.returnRate, l: "Come back every year" },
  ],
  areasLabel: "Where we work",
};

export const process = {
  heading: {
    pre: "What actually happens when you ",
    em: "reach out.",
    post: "",
  },
  sub: "A designer, options built around your budget, and a date we commit to.",
  steps: [
    {
      title: "You get in touch",
      text: `Call us or send the form. A real designer picks it up — not a call center, not a chatbot. ${site.hours.daysLabel}, ${site.hours.timeLabel}.`,
      tag: "Free · no obligation",
    },
    {
      title: "We learn what you want",
      text: "What you picture for the house, and what you want to spend. We design to both. Usually we do this virtually because it's faster, and we come out in person when the house calls for it.",
      tag: "Virtual or on-site",
    },
    {
      title: "You get options and a price",
      text: "More than one way to light the house, each one priced. Whichever you pick, it's one flat price for the whole season.",
      tag: "One flat price",
    },
    {
      title: "You book, we set your date",
      text: `${site.stats.depositPercent}% to book, the rest on install day. Your date is locked when you sign — installs run ${site.season.installWindow}, and the earlier you book the more of the calendar is still open.`,
      tag: `${site.stats.depositPercent}% to book`,
    },
  ],
};

export const pricing = {
  heading: "What our customers actually spend.",
  sub: "Not a number we made up — what real homes paid us last season.",
  low: site.pricing.seasonLow,
  high: site.pricing.seasonHigh,
  seasonLabel: "per season · everything included",
  gauge: {
    /** Percent positions along the track */
    fillStart: 30,
    fillWidth: 34,
    mostLabel: "most homes",
    mostAt: 47,
    tail: "estates →",
  },
  typical: {
    pre: "About ",
    typical: site.pricing.typical,
    mid: " for a typical single-family home. Larger homes and fuller displays run higher — a few every season past ",
    estate: site.pricing.estateFloor,
    post: ".",
  },
  value: {
    label: "What that number actually buys",
    title: "One less thing to think about.",
    text: {
      pre: "Design, install, unlimited repairs, the takedown and the storage — ",
      strong: "all in that one price",
      post: ", nothing added later. You make one call in the fall, and we carry the whole season straight through January.",
    },
  },
};

export const closing = {
  eyebrow: site.season.bookingEyebrow,
  heading: { pre: "Hand off the lights. ", em: "Enjoy", post: " the season." },
  sub: "One call gets it designed, installed, kept lit, taken down, and stored. You never touch a bulb.",
  callPrefix: "or call ",
  proof: [
    { b: site.stats.rating, text: ` on ${site.stats.reviewPlatform}` },
    { b: site.stats.insurance, text: " insured" },
    { pre: "Lighting South Florida since ", b: String(site.foundedYear) },
  ],
};

export const footer = {
  blurb: `Done-for-you Christmas lighting across ${site.serviceSummary}. Designed, installed, maintained, and stored — all season, all on us.`,
  contactLabel: "Get in touch",
  exploreLabel: "Explore",
  areasLabel: "Where we work",
  explore: [
    { label: "Get a quote", href: "/christmas-light-quote" },
    { label: "Read our reviews", href: site.reviewUrl, external: true },
    { label: "Privacy policy", href: "/privacy-policy" },
  ],
  zipCheck: "Not sure? Check your ZIP →",
};

export const nav = {
  links: [
    { label: "How it works", hash: "#how-it-works" },
    { label: "Gallery", hash: "#gallery" },
    { label: "Reviews", hash: "#reviews" },
    { label: "FAQ", hash: "#faq" },
  ],
};
