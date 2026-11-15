/**
 * Review ledger content. PLACEHOLDER sample reviews — replace with real,
 * permissioned reviews before indexing. Never reuse the reference business's
 * customers or quotes.
 */
export type Review = {
  /** Short pull quote, shown in display type with curly quotes added by the component */
  pull: string;
  text: string;
  name: string;
  /** Attribution line, e.g. "Google review · 2025 season" */
  attribution: string;
  verified: boolean;
  /** Shown on mobile where only two reviews render */
  featured: boolean;
};

export const reviews: Review[] = [
  {
    pull: "Sample review — replace me.",
    text: "This is placeholder review text. It is sized to match a typical two-sentence customer review so the ledger layout can be checked before real reviews are supplied.",
    name: "Sample Customer",
    attribution: "Sample review · placeholder",
    verified: false,
    featured: true,
  },
  {
    pull: "Another sample pull quote.",
    text: "Placeholder text roughly the length of a short review. Swap in a real, permissioned review from your review platform.",
    name: "Sample Customer",
    attribution: "Sample review · placeholder",
    verified: false,
    featured: true,
  },
  {
    pull: "A third sample pull quote, slightly longer.",
    text: "One short sentence of placeholder text.",
    name: "Sample Customer",
    attribution: "Sample review · placeholder",
    verified: false,
    featured: false,
  },
  {
    pull: "Fourth sample pull quote.",
    text: "Placeholder text for the fourth review slot in the desktop two-by-two ledger grid.",
    name: "Sample Customer",
    attribution: "Sample review · placeholder",
    verified: false,
    featured: false,
  },
];

export const reviewsSection = {
  heading: ["Fifty reviews. Here are ", "a few."] as const,
  sub: "Sample ledger layout. Verified customer reviews will replace these placeholders before launch.",
  ratingLabel: "out of 5 — sample rating",
  ledgerMeta: ["Google reviews", "#1 in Miami-Dade"] as const,
  readAllLabel: "Read every review on Google",
  record: {
    heading: "Perfect reviews. That doesn't mean nothing goes wrong.",
    paragraphs: {
      intro:
        "Last year we lit more than {homes} homes — and logged {requests} documented maintenance requests.",
      why1: "Because life happens. Landscapers cut wires, bulbs fall off roofs. No matter how careful we are, these lights aren't permanent — they have issues from time to time.",
      still: "Yet every review is still five stars.",
      why2: "Because every one of those {requests} was answered within {hours} hours — {sameDay} of them the same day. Some within the hour.",
      landing: "You hire us for peace of mind. That's what we deliver on.",
    },
    why: "Why?",
    metrics: {
      requests: "maintenance requests",
      hours: "hr",
      response: "response promise",
      sameDay: "same-day repairs",
    },
    signatureNote: "Our words, not a customer's",
  },
};
