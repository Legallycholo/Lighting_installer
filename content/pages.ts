import { site } from "./site";

type TextSection = { title: string; body: string };
export const privacy = {
  title: "Privacy & your information",
  description:
    "How this website handles quote requests and optional campaign attribution.",
  eyebrow: "Privacy policy · preview draft",
  intro:
    "This policy describes the current preview. The project owner must confirm the final business contact, service providers, and retention schedule before accepting live enquiries.",
  sections: [
    {
      title: "Information you choose to provide",
      body: "The quote form asks for your name, phone number, property address, ZIP code, property type, building height, budget, and permission to contact you. Email and notes are optional. Avoid including payment details or sensitive information in notes.",
    },
    {
      title: "What happens in this preview",
      body: "Demo requests are validated by this website but are not sent to a business or CRM. A demo confirmation is not a booking and does not request a callback. Contact fields are held in the open page and are cleared by a refresh; they are not stored in your browser's local storage.",
    },
    {
      title: "When live delivery is enabled",
      body: "The information in a quote request is sent through this website's server to the project owner's configured service provider so the business can respond. No request is sent to the reference business. The final policy must identify the responsible business and its providers before launch.",
    },
    {
      title: "Optional campaign measurement",
      body: `Campaign attribution is disabled by default. If enabled and you separately opt in, approved campaign tags and advertising click identifiers are stored in your browser for up to ${site.attribution.retentionDays} days. They may accompany a quote request. No browsing history or referrer path is collected. Contact permission does not grant campaign measurement permission.`,
    },
    {
      title: "Technical safeguards and retention",
      body: "The server uses temporary request counters and request fingerprints to limit abuse and duplicate delivery. It does not log contact details. Hosting providers may separately process standard access logs. Live business records and their retention schedule must be documented by the project owner before launch.",
    },
    {
      title: "Your choices",
      body: "You can leave the form without submitting, skip optional fields, and decline optional campaign measurement. Clearing this site's browser data removes locally stored campaign attribution. Contact the business using its verified contact details after launch to ask about live records or withdraw permission for future contact.",
    },
    {
      title: "Contact details",
      body: "The name, address, email, and telephone currently displayed on this preview are placeholders. Do not use them to send privacy requests. The project owner must replace them with a verified contact before publishing.",
    },
  ] satisfies TextSection[],
  home: "Back to home",
};

export const thankYou = {
  title: "Your next step, made simple.",
  description: "Quote request help and next steps.",
  eyebrow: "Thanks for stopping by",
  body: "If the quote form showed a delivery confirmation, the team has your details. Opening this page alone does not submit a request or confirm a booking.",
  demo: "This is a preview. Demo requests are not sent to a business, and no callback has been scheduled.",
  quote: "Start a quote",
  home: "Back to home",
};

export const notFound = {
  title: "This light is a little off course.",
  description: "The page you are looking for could not be found.",
  eyebrow: "404 · Page not found",
  body: "That page may have moved. Head home or start a quote, and we'll get you back on track.",
  home: "Back to home",
  quote: "Start a quote",
};
