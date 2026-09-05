import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { getSettings } from "@/features/content/data";
import { StackBody } from "@/app/(public)/stack/page";

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const settings = await getSettings();
  return (
    <PublicShell locale="en" settings={settings}>
      <PageHeader eyebrow="// stack" title="Machines that build machines." body="Technical layers for turning real processes into operable, measurable and maintainable systems." />
      <StackBody locale="en" />
    </PublicShell>
  );
}
