import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { CaseDetailLayout } from "@/components/case-detail-layout";
import { getCaseBySlug, getPublishedCases, getPublishedProjects, getSettings } from "@/features/content/data";
import { contentBlockSchema } from "@/features/content/schemas";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
