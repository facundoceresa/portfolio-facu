import Link from "next/link";
import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { CaseDetailLayout } from "@/components/case-detail-layout";
import { getCaseBySlug, getPublishedCases, getPublishedProjects, getSettings } from "@/features/content/data";
import { contentBlockSchema } from "@/features/content/schemas";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCaseBySlug("es", slug);
  if (!item) {
    return { title: "Caso no encontrado", robots: { index: false, follow: false } };
  }
  const title = item.translation.seoTitle || item.translation.title;
  const description = item.translation.seoDescription || item.translation.dek;
  return {
    title,
    description,
    alternates: { canonical: `/casos/${item.translation.slug}` },
    openGraph: {
      title,
      description,
      url: `/casos/${item.translation.slug}`,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CaseDetailPage({ params }: Props) {
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
