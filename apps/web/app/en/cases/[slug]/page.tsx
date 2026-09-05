import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { ContentBlocks } from "@/components/content-blocks";
import { getCaseBySlug, getSettings } from "@/features/content/data";
import { contentBlockSchema } from "@/features/content/schemas";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [settings, item] = await Promise.all([getSettings(), getCaseBySlug("en", slug)]);
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
      <article className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
        <p className="tech-label mb-5">{`// case · ${item.translation.category} · ${item.caseStudy.readTimeMinutes} min`}</p>
        <h1 className="display-title text-[clamp(3rem,8vw,7rem)] text-mint">{item.translation.title}</h1>
        <p className="mt-8 text-xl leading-9 text-[color:var(--muted)]">{item.translation.dek}</p>
        <div className="mt-14 border-t border-[color:var(--line)] pt-10 text-lg leading-8 text-[color:var(--muted)]">
          <ContentBlocks blocks={blocks} />
        </div>
      </article>
    </PublicShell>
  );
}
