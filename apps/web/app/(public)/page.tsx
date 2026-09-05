import { PublicShell } from "@/components/public-shell";
import { HomePage } from "@/components/home/home-page";
import { getPublishedProjects, getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [settings, projects] = await Promise.all([getSettings(), getPublishedProjects("es", true)]);
  return (
    <PublicShell locale="es" settings={settings}>
      <HomePage locale="es" settings={settings} projects={projects} />
    </PublicShell>
  );
}
