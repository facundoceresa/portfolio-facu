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
  const item = await getCaseBySlug("en", slug);
  if (!item) {
    return { title: "Case not found", robots: { index: false, follow: false } };
  }
  const title = item.translation.seoTitle || item.translation.title;
  const description = item.translation.seoDescription || item.translation.dek;
  return {
    title,
    description,
    alternates: { canonical: `/en/cases/${item.translation.slug}` },
    openGraph: {
      title,
      description,
      url: `/en/cases/${item.translation.slug}`,
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
  const [settings, item, cases, projects] = await Promise.all([getSettings(), getCaseBySlug("en", slug), getPublishedCases("en"), getPublishedProjects("en")]);
  if (!item) {
    return (
      <PublicShell locale="en" settings={settings}>
        <main className="grid min-h-[calc(100dvh-var(--header-height))] place-items-center px-5 py-20 text-center">
          <div>
            <p className="tech-label mb-5">{"// 404 · case"}</p>
            <h1 className="display-title text-[clamp(4rem,13vw,10rem)] text-mint">route not found</h1>
            <p className="mx-auto mt-6 max-w-xl text-[color:var(--muted)]">This case does not exist or is not published yet.</p>
            <Link className="hard-button hard-button-primary mt-8" href="/en/cases">
              back_to_cases()
            </Link>
          </div>
        </main>
      </PublicShell>
    );
  }
  const blocks = contentBlockSchema.array().parse(item.translation.contentBlocks);
  return (
    <PublicShell locale="en" settings={settings}>
      <CaseDetailLayout locale="en" item={item} blocks={blocks} cases={cases} projects={projects} />
    </PublicShell>
  );
}
