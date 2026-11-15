import { z } from "zod";
import { quoteContent } from "@/content/quote";
import { normalizePhone } from "./phone";

const fields = quoteContent.contact.fields;
export const contactSchema = z.object({
  name: z.string().trim().min(2, fields.name.error).max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((value) => normalizePhone(value) !== null, fields.phone.error)
    .transform((value) => normalizePhone(value)!),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.union([z.literal(""), z.email(fields.email.error)]))
    .default(""),
  address: z.string().trim().min(8, fields.address.error).max(300),
  notes: z.string().trim().max(2000).default(""),
  consent: z.literal(true, { error: quoteContent.contact.consentError }),
});

export const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;
const campaignValue = z
  .string()
  .max(200)
  .regex(/^[a-zA-Z0-9._~ -]+$/);
const attributionTouch = z
  .object({
    capturedAt: z.iso.datetime(),
    values: z
      .object(
        Object.fromEntries(
          attributionKeys.map((key) => [key, campaignValue.optional()]),
        ) as Record<
          (typeof attributionKeys)[number],
          z.ZodOptional<typeof campaignValue>
        >,
      )
      .strict(),
  })
  .strict();
export const attributionSchema = z
  .object({
    consent: z.literal(true),
    first: attributionTouch,
    last: attributionTouch,
  })
  .strict();
export type Attribution = z.infer<typeof attributionSchema>;

export const leadSchema = contactSchema.extend({
  zip: z.string().regex(/^\d{5}$/, "Enter a five-digit ZIP code."),
  propertyType: z.enum(["residential", "commercial"]),
  stories: z.enum(["1", "2", "3plus"]),
  budget: z.enum(["tier1", "tier2", "tier3", "unsure"]),
  website: z.string().max(200).default(""),
  attribution: attributionSchema.optional(),
});
export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
