export type FaqItem = {
  id: string;
  question: string;
  /** Plain text with optional <b> emphasis segments */
  answer: Array<string | { b: string }>;
};

/** PLACEHOLDER copy shaped like the reference. Replace with the owner's real answers. */
export const faqItems: FaqItem[] = [
  {
    id: "own",
    question: "Do I own the lights?",
    answer: [
      "No — and that's the point. It's a rental, so the lights stay ours: maintaining them, replacing what fails, and storing them off-season are our job, not yours. Your first season is full price. ",
      { b: "Every season after, you come back at 20% off." },
      " It's a big reason most of our customers are still with us years later.",
    ],
  },
  {
    id: "out",
    question: "What if a light goes out?",
    answer: [
      "We fix it ",
      { b: "within 48 hours, as many times as it takes." },
      " Repairs are unlimited and already in your price, so there's never a repair bill — not for South Florida weather, and not even when a landscaper cuts a wire.",
    ],
  },
  {
    id: "schedule",
    question: "Can I still get on this year's schedule?",
    answer: [
      "Usually — but the good dates go early. We install from September through ",
      { b: "December 13" },
      ", in the order people book. We don't promise a blanket date like Thanksgiving; we set a date with you and meet it. The earlier you book, the more of the calendar is still open.",
    ],
  },
  {
    id: "payment",
    question: "How does payment work?",
    answer: [
      "Job approval and a ",
      { b: "25% deposit" },
      " gets you on the schedule. The final balance is due the day of the install.",
    ],
  },
  {
    id: "after",
    question: "What happens after the holidays?",
    answer: [
      "After New Year's we come take everything down, on our schedule, and store it until next season. You don't box a thing, and nothing comes back to your garage.",
    ],
  },
  {
    id: "area",
    question: "Do you cover my area?",
    answer: [
      "All of Miami-Dade and parts of Broward — Weston and Pembroke Pines included. Not sure we reach you? Call and ask.",
    ],
  },
];

export const faqSection = {
  heading: ["Good ", "questions."] as const,
  sub: "The honest answers, before you ever pick up the phone.",
};
