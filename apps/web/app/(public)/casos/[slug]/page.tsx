import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { CaseDetailLayout } from "@/components/case-detail-layout";
import { getCaseBySlug, getPublishedCases, getPublishedProjects, getSettings } from "@/features/content/data";
import { contentBlockSchema } from "@/features/content/schemas";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, item, cases, projects] = await Promise.all([getSettings(), getCaseBySlug("es", slug), getPublishedCases("es"), getPublishedProjects("es")]);
  if (!item) {
    return (
      <PublicShell locale="es" settings={settings}>
        <main className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center px-5 py-20 text-center">
          <div>
            <p className="tech-label mb-5">{"// 404 · caso"}</p>
            <h1 className="display-title text-[clamp(4rem,13vw,10rem)] text-mint">ruta no encontrada</h1>
            <p className="mx-auto mt-6 max-w-xl text-[color:var(--muted)]">El caso no existe o todavía no fue publicado.</p>
            <Link className="hard-button hard-button-primary mt-8" href="/casos">
              volver_casos()
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }
  const blocks = contentBlockSchema.array().parse(item.translation.contentBlocks);
  return (
    <PublicShell locale="es" settings={settings}>
      <CaseDetailLayout locale="es" item={item} blocks={blocks} cases={cases} projects={projects} />
    </PublicShell>
  );
}
