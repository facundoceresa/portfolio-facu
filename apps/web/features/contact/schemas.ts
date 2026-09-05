import { z } from "zod";

export const contactScopes = [
  "automation",
  "integration",
  "fullstack",
  "infrastructure",
  "technical-review",
] as const;

export const contactBudgets = [
  "undefined",
  "under-1k",
  "1k-5k",
  "5k-15k",
  "over-15k",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  companyRole: z.string().trim().max(120).optional().or(z.literal("")),
  scope: z.enum(contactScopes),
  budget: z.enum(contactBudgets),
  message: z.string().trim().min(20).max(2000),
  consent: z.literal("on").or(z.literal(true)),
  locale: z.enum(["es", "en"]).default("es"),
  startedAt: z.coerce.number().int().positive(),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().min(1),
  idempotencyKey: z.string().min(16).max(120),
});

export type ContactInput = z.infer<typeof contactSchema>;
