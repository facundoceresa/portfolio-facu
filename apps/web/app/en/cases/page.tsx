import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { CasesList } from "@/app/(public)/casos/page";
import { getPublishedCases, getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const [settings, cases] = await Promise.all([getSettings(), getPublishedCases("en")]);
  return (
    <PublicShell locale="en" settings={settings}>
      <PageHeader eyebrow="// cases" title="Real cases, no fiction." body="Technical detail is published only when evidence and complete translation exist." />
      <CasesList locale="en" cases={cases} />
    </PublicShell>
  );
}
