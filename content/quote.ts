/**
 * Quote wizard copy, option values and labels.
 * PLACEHOLDER business values — edit here, never in components.
 */
import { site } from "./site";

export type PropertyType = "residential" | "commercial";
export type Stories = "1" | "2" | "3plus";
export type Budget = "tier1" | "tier2" | "tier3" | "unsure";

export type IllustratedOption<V extends string> = {
  value: V;
  title: string;
  sub: string;
  art: { unlit: string; lit: string; width: number; height: number };
  badge?: string;
};

export type BudgetOption = {
  value: Budget;
  title: string;
  sub: string;
  /** Number of bulb glyphs; 0 renders a question mark */
  bulbs: number;
  pop?: string;
  hint?: string;
};

export const quoteSteps = [
  "Property",
  "Size",
  "Budget",
  "Contact",
  "Review",
] as const;

export const quoteContent = {
  seo: {
    title: "Get a Free Christmas Light Quote",
    description:
      "Four quick questions, then a real designer calls to talk through your goals — usually within 30 minutes. Christmas light installation, done for you.",
  },
  mast: {
    heading: {
      pre: "Four questions, then we can connect you with a ",
      em: "designer.",
      post: "",
    },
    proof: [
      {
        stars: true,
        b: site.stats.rating,
        text: ` on ${site.stats.reviewPlatform} — every review five stars`,
      },
      { b: site.stats.returnRate, text: " come back the next season" },
      { text: "Free — nothing booked until you say so" },
    ],
  },
  noscript: {
    pre: "This quiz needs JavaScript. No problem — call or text ",
    post: " and we'll start your quote on the phone.",
  },
  gate: {
    heading: { pre: "Do we light ", em: "your", post: " street?" },
    sub: "Type your property's ZIP and we'll tell you right now — before you answer a single question.",
    label: "Property ZIP code",
    placeholder: "5 digits",
    errors: {
      empty: "Enter your property's 5-digit ZIP.",
      short: "ZIP codes are 5 digits.",
    },
    inArea: {
      title: "Yes — we light your street.",
      body: "Four quick questions and a designer will call you.",
    },
    outOfArea: {
      title: "That one's outside our usual map.",
      body: "We may still be able to help — call us, or leave your details and we'll check.",
    },
    anywayLabel: "My property is just outside — take my details anyway",
    area: {
      pre: "We install across ",
      strong: site.serviceSummary,
      post: ". Design, install, unlimited repairs, January takedown and off-season storage — one flat price for the whole season.",
    },
  },
  property: {
    eyebrow: "Question 1 of 4",
    title: "What are we lighting up?",
    sub: "Tells us which crew and equipment to send out.",
    options: [
      {
        value: "residential",
        title: "Residential",
        sub: "A home — single family, townhouse, condo with eaves.",
        art: {
          unlit: "/media/quiz-house-unlit.svg",
          lit: "/media/quiz-house-lit.svg",
          width: 560,
          height: 415,
        },
      },
      {
        value: "commercial",
        title: "Commercial",
        sub: "Office, plaza, hotel, HOA common areas, storefront.",
        art: {
          unlit: "/media/quiz-store-unlit.svg",
          lit: "/media/quiz-store-lit.svg",
          width: 560,
          height: 415,
        },
      },
    ] satisfies IllustratedOption<PropertyType>[],
  },
  stories: {
    eyebrow: "Question 2 of 4",
    title: "How tall is the building?",
    sub: "Affects ladder choice — and whether we bring the lift.",
    options: [
      {
        value: "1",
        title: "1 story",
        sub: "Single level. Standard ladders only.",
        art: {
          unlit: "/media/quiz-story1-unlit.svg",
          lit: "/media/quiz-story1-lit.svg",
          width: 560,
          height: 415,
        },
      },
      {
        value: "2",
        title: "2 stories",
        sub: "Two levels. Most Miami homes fit here.",
        art: {
          unlit: "/media/quiz-story2-unlit.svg",
          lit: "/media/quiz-story2-lit.svg",
          width: 560,
          height: 415,
        },
      },
      {
        value: "3plus",
        title: "3+ stories",
        sub: "Tall — we'll bring the lift.",
        badge: "Lift required",
        art: {
          unlit: "/media/quiz-story3-unlit.svg",
          lit: "/media/quiz-story3-lit.svg",
          width: 560,
          height: 415,
        },
      },
    ] satisfies IllustratedOption<Stories>[],
  },
  budget: {
    eyebrow: "Question 3 of 4",
    title: "What's a comfortable budget?",
    options: [
      {
        value: "tier1",
        title: "$1,750–2,500",
        sub: "Smaller home: roofline plus a tree.",
        bulbs: 2,
      },
      {
        value: "tier2",
        title: "$2,500–4,000",
        sub: "Larger home: roofline, trees, plus bushes or driveway.",
        bulbs: 4,
        pop: "Most popular",
      },
      {
        value: "tier3",
        title: "$4,000+",
        sub: "Large property: top to bottom.",
        bulbs: 5,
        hint: "All-out",
      },
      {
        value: "unsure",
        title: "Not sure yet",
        sub: `We'll help, our installs start at $${site.pricing.startingAt.toLocaleString("en-US")}.`,
        bulbs: 0,
      },
    ] satisfies BudgetOption[],
  },
  contact: {
    eyebrow: "Question 4 of 4",
    title: "Where can we reach you?",
    sub: `A real designer calls you — ${site.stats.designerResponse} in business hours — to talk through your goals and how we can help. Free, about 15 minutes.`,
    requiredNote: "Fields marked * are required.",
    fields: {
      name: {
        label: "Your name",
        placeholder: "First and last name",
        error: "Enter your first and last name.",
      },
      phone: {
        label: "Phone number",
        placeholder: "(305) 777-7777",
        error: "Enter a 10-digit US phone number.",
      },
      email: {
        label: "Email (optional)",
        placeholder: "you@example.com",
        error: "That email doesn't look right.",
      },
      address: {
        label: "Property address",
        placeholder: "Street address, city, ZIP",
        error: "Enter the property's street address.",
      },
      notes: {
        summary: "Add a note about the property",
        label: "Anything we should know?",
        placeholder:
          "Big oak in the front yard, HOA paperwork already done, want red & warm white only...",
      },
    },
    /** Consent copy. Have legal counsel confirm this matches your obligations. */
    consent:
      "It's OK to call or text me about my quote. My details may be handled by the business’s service providers to respond to this request. This does not sign me up for marketing messages.",
    consentError: "Please confirm it's OK to call or text you.",
  },
  review: {
    eyebrow: "One last look",
    title: "Everything in order?",
    labels: {
      zip: "ZIP",
      property: "Property",
      stories: "Height",
      budget: "Budget",
      name: "Name",
      phone: "Phone",
      email: "Email",
      address: "Address",
      notes: "Notes",
    },
    editLabel: "Edit",
    promise: {
      title: "A real designer will call you.",
      body: {
        pre: "They'll talk through your goals, ideas, and budget — and get you a quote ",
        strong: `over the phone, ${site.stats.designerResponse}`,
        post: ".",
      },
    },
    guardProof: [
      {
        stars: true,
        b: site.stats.rating,
        text: ` on ${site.stats.reviewPlatform} — every review five stars`,
      },
      { b: site.stats.returnRate, text: " come back the next season" },
      { pre: "Lighting South Florida since ", b: String(site.foundedYear) },
    ],
    say: {
      pre: "Free and no obligation. ",
      strong: "Nothing is booked",
      post: ` until you approve the design and put down the ${site.stats.depositPercent}% deposit that holds your install date. Installs run ${site.season.installWindow}, scheduled by signup order — the mid-November dates go first.`,
    },
    error: {
      title: "We couldn't send that just now.",
      body: {
        pre: "Try again in a moment — or call us directly at ",
        post: " and we'll start the quote on the phone.",
      },
      retry: "Try again",
    },
  },
  footer: {
    back: "Back",
    autoHint: "Pick a card and we move you forward.",
    next: "Next",
    review: "Review my answers",
    submit: "Submit Request",
    submitting: "Sending…",
  },
  done: {
    titlePre: "Got it, ",
    fallbackName: "friend",
    body: {
      pre: "A designer is about to call ",
      post: ` They'll talk through your goals and ideas and how we can help — ${site.stats.designerResponse}.`,
    },
    skyline: {
      src: "/media/quiz-skyline.svg",
      width: 1400,
      height: 547,
      alt: "Placeholder: a painted row of homes and storefronts with every roofline traced in lit gold bulbs.",
    },
    meta: [
      {
        k: "What to expect",
        v: "A friendly 15-minute call. No pressure — just a real conversation about your home and what you're imagining.",
      },
      { k: "Can't wait?", v: "call-or-text" as const },
      { k: "While you wait", v: "gallery-link" as const },
    ],
    hoursLine: `A real person answers ${site.hours.daysLabel}, ${site.hours.timeLabel}.`,
    galleryLink: "See what we lit last season",
    galleryTail: " — real homes, photographed the night we finished.",
  },
};

export const budgetLabel = (b: Budget) =>
  quoteContent.budget.options.find((o) => o.value === b)?.title ?? "";
export const propertyLabel = (p: PropertyType) =>
  quoteContent.property.options.find((o) => o.value === p)?.title ?? "";
export const storiesLabel = (s: Stories) =>
  quoteContent.stories.options.find((o) => o.value === s)?.title ?? "";

/** Interface text kept beside business content for replacement/localization. */
export const wizardUI = {
  progressLabel: "Your quote progress",
  start: "Let's get started",
  select: "Select an option to continue.",
  selectionHint: "Choose an option, then select Next.",
  zipEdit: "Change ZIP",
  optionalEmpty: "Not provided",
  consentLabel: "Contact permission",
  consentValue: "Call and text permission given",
  privacyLabel: "Privacy policy",
  marketingConsent:
    "Allow this site to remember how I found it for 90 days. Optional; this does not affect my quote.",
  validationSummary: "Please check the highlighted fields.",
  honeypotLabel: "Leave this field empty",
  retry: "Try again",
  returnHome: "Back to the homepage",
  continue: "Continue",
  loading: "Preparing your quote…",
  demo: {
    title: "Your preview is complete.",
    body: "This is a demonstration. Your answers were validated, but no quote was sent and no designer will contact you. Real submissions will be available when the business connects its lead service.",
    badge: "Preview only · no request sent",
  },
  realSuccess: {
    title: "Your request is on its way.",
    body: "The team has received your details and will contact you to discuss your lighting plans. Nothing is booked until you approve a design and price.",
  },
  demoNote:
    "Preview site: business details, prices, and service areas are sample content. Use sample contact details to try the form.",
  submitError:
    "We couldn't send your request. Your answers are still here. Please try again or use the contact details below.",
};
