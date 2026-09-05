import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  auditLogs,
  caseStudies,
  caseTranslations,
  contactMessages,
  mediaAssets,
  projects,
  projectTranslations,
  siteSettings,
} from "@/lib/db/schema";

export async function adminCounts() {
  const [projectRows, caseRows, messageRows, mediaRows] = await Promise.all([
    db.select({ id: projects.id }).from(projects),
    db.select({ id: caseStudies.id }).from(caseStudies),
    db.select({ id: contactMessages.id }).from(contactMessages),
    db.select({ id: mediaAssets.id }).from(mediaAssets),
  ]);
  return { projects: projectRows.length, cases: caseRows.length, messages: messageRows.length, media: mediaRows.length };
}

export async function listAdminProjects() {
  return db.select({ project: projects, translation: projectTranslations }).from(projects).innerJoin(projectTranslations, eq(projectTranslations.projectId, projects.id));
}

export async function listAdminCases() {
  return db.select({ caseStudy: caseStudies, translation: caseTranslations }).from(caseStudies).innerJoin(caseTranslations, eq(caseTranslations.caseId, caseStudies.id));
}

export async function listAdminMessages() {
  return db.select().from(contactMessages);
}

export async function listAdminMedia() {
  return db.select().from(mediaAssets);
}

export async function listAdminSettings() {
  return db.select().from(siteSettings);
}

export async function listAudit() {
  return db.select().from(auditLogs).orderBy(auditLogs.createdAt);
}
