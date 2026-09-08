import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { CasesList } from "@/app/(public)/casos/page";
import { getPublishedCases, getPublishedProjects, getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real cases",
  description: "Real full-stack software, ERP integration, automation and internal tooling case studies by Facundo Ceresa.",
  alternates: { canonical: "/en/cases", languages: { es: "/casos", en: "/en/cases" } },
};

export default async function CasesPage() {
  const [settings, cases, projects] = await Promise.all([getSettings(), getPublishedCases("en"), getPublishedProjects("en")]);
  return (
    <PublicShell locale="en" settings={settings}>
      <PageHeader eyebrow="cases" title="Published work with evidence" body="Technical detail, screenshots and outcomes only when there is enough context to support them." variant="showcase" />
      <CasesList locale="en" cases={cases} projects={projects} />
    </PublicShell>
  );
}
