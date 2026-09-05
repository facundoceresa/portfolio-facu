import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  caseStudies,
  caseTranslations,
  contentEntries,
  contentTranslations,
  projects,
  projectTranslations,
  siteSettings,
} from "@/lib/db/schema";
import { defaultSettings } from "@/features/content/defaults";
import type { Locale } from "@/features/content/schemas";

export async function getSettings() {
  const rows = await db.select().from(siteSettings);
  return { ...defaultSettings, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
}

export async function getPublishedProjects(locale: Locale, featuredOnly = false) {
  return db
    .select({ project: projects, translation: projectTranslations })
    .from(projects)
    .innerJoin(projectTranslations, eq(projectTranslations.projectId, projects.id))
    .where(
      and(
        eq(projects.status, "published"),
        isNull(projects.deletedAt),
        eq(projectTranslations.locale, locale),
        featuredOnly ? eq(projects.featured, true) : undefined,
      ),
    )
    .orderBy(asc(projects.sortOrder), desc(projects.publishedAt));
}

export async function getPublishedCases(locale: Locale) {
  return db
    .select({ caseStudy: caseStudies, translation: caseTranslations })
    .from(caseStudies)
    .innerJoin(caseTranslations, eq(caseTranslations.caseId, caseStudies.id))
    .where(and(eq(caseStudies.status, "published"), isNull(caseStudies.deletedAt), eq(caseTranslations.locale, locale)))
    .orderBy(asc(caseStudies.sortOrder), desc(caseStudies.publishedAt));
}

export async function getCaseBySlug(locale: Locale, slug: string) {
  const [row] = await db
    .select({ caseStudy: caseStudies, translation: caseTranslations })
    .from(caseStudies)
    .innerJoin(caseTranslations, eq(caseTranslations.caseId, caseStudies.id))
    .where(
      and(
        eq(caseStudies.status, "published"),
        isNull(caseStudies.deletedAt),
        eq(caseTranslations.locale, locale),
        eq(caseTranslations.slug, slug),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function getContentEntry<T>(key: string, locale: Locale) {
  const [row] = await db
    .select({ entry: contentEntries, translation: contentTranslations })
    .from(contentEntries)
    .innerJoin(contentTranslations, eq(contentTranslations.entryId, contentEntries.id))
    .where(and(eq(contentEntries.key, key), eq(contentTranslations.locale, locale), eq(contentEntries.status, "published")))
    .limit(1);
  return (row?.translation.payload as T | undefined) ?? null;
}
