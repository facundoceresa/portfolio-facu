import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { getSettings } from "@/features/content/data";
import { StackBody } from "@/app/(public)/stack/page";

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const settings = await getSettings();
  return (
    <PublicShell locale="en" settings={settings}>
      <PageHeader eyebrow="stack" title="Production technical layers" body="Technologies selected by how they integrate, operate and hold up after the system stops being a demo." variant="index" />
      <StackBody locale="en" />
    </PublicShell>
  );
}
