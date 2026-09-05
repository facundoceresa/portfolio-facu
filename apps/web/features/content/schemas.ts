import { z } from "zod";

export const localeSchema = z.enum(["es", "en"]);
export type Locale = z.infer<typeof localeSchema>;

export const contentStatusSchema = z.enum(["draft", "review", "published", "archived"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const projectKindSchema = z.enum(["production", "prototype", "personal", "concept"]);

export const safeUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "mailto:";
  }, "Only https and mailto URLs are allowed");

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), level: z.union([z.literal(2), z.literal(3), z.literal(4)]), text: z.string().min(1).max(180) }),
  z.object({ type: z.literal("paragraph"), markdown: z.string().min(1).max(4000) }),
  z.object({ type: z.literal("list"), ordered: z.boolean().default(false), items: z.array(z.string().min(1).max(600)).min(1).max(20) }),
  z.object({
    type: z.literal("image"),
    src: z.string().trim().min(1).max(300).regex(/^\/[a-z0-9/_-]+(?:\.[a-z0-9]+)?$/i),
    alt: z.string().trim().min(1).max(240),
    caption: z.string().trim().max(240).optional(),
    width: z.number().int().min(1).max(5000),
    height: z.number().int().min(1).max(12000),
  }),
  z.object({ type: z.literal("quote"), text: z.string().min(1).max(1200), attribution: z.string().max(160).optional() }),
  z.object({ type: z.literal("code"), language: z.enum(["ts", "tsx", "js", "sql", "bash", "powershell", "yaml", "json", "text"]), code: z.string().min(1).max(6000), caption: z.string().max(180).optional() }),
  z.object({ type: z.literal("metric"), value: z.string().min(1).max(40), label: z.string().min(1).max(120), evidence: z.string().max(300).optional() }),
  z.object({ type: z.literal("callout"), tone: z.enum(["note", "warning", "decision"]), text: z.string().min(1).max(1200) }),
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const adminProjectSchema = z.object({
  status: contentStatusSchema,
  kind: projectKindSchema,
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  metricValue: z.string().max(80).optional().nullable(),
  metricLabelKey: z.string().max(120).optional().nullable(),
  repoUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  liveUrl: safeUrlSchema.optional().nullable().or(z.literal("")),
  evidenceNote: z.string().max(500).optional().nullable(),
  translations: z.array(z.object({
    locale: localeSchema,
    slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(3).max(140),
    summary: z.string().trim().min(20).max(500),
    category: z.string().trim().min(2).max(80),
    role: z.string().trim().max(120).optional().nullable(),
  })).length(2),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export const adminCaseSchema = z.object({
  status: contentStatusSchema,
  sortOrder: z.coerce.number().int().min(0).default(0),
  readTimeMinutes: z.coerce.number().int().min(1).max(60).default(6),
  resultValue: z.string().max(80).optional().nullable(),
  resultVerified: z.boolean().default(false),
  translations: z.array(z.object({
    locale: localeSchema,
    slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(3).max(160),
    dek: z.string().trim().min(20).max(600),
    category: z.string().trim().min(2).max(80),
    periodLabel: z.string().trim().max(80).optional().nullable(),
    resultLabel: z.string().trim().max(140).optional().nullable(),
    contentBlocks: z.array(contentBlockSchema).min(1).max(80),
  })).length(2),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});
