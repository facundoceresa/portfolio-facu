import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ContentBlocks } from "@/components/content-blocks";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { ContentBlock, Locale } from "@/features/content/schemas";
import { getPublishedCases, getPublishedProjects, type getCaseBySlug } from "@/features/content/data";
import { headingId } from "@/features/content/project-meta";

type CaseRow = NonNullable<Awaited<ReturnType<typeof getCaseBySlug>>>;
type ProjectRows = Awaited<ReturnType<typeof getPublishedProjects>>;
type CaseRows = Awaited<ReturnType<typeof getPublishedCases>>;

export function CaseDetailLayout({
  locale,
  item,
  blocks,
  projects,
  cases,
}: {
  locale: Locale;
  item: CaseRow;
  blocks: ContentBlock[];
  projects: ProjectRows;
  cases: CaseRows;
}) {
  const base = locale === "es" ? "/casos" : "/en/cases";
  const labels = {
    back: locale === "es" ? "volver a casos" : "back to cases",
    demo: locale === "es" ? "ver demo" : "view demo",
    repo: locale === "es" ? "repositorio" : "repository",
    next: locale === "es" ? "siguiente caso" : "next case",
    summary: locale === "es" ? "resumen operativo" : "operational summary",
    category: locale === "es" ? "tipo" : "type",
    period: locale === "es" ? "estado" : "status",
    result: locale === "es" ? "resultado" : "result",
    verified: locale === "es" ? "validado" : "verified",
    sections: locale === "es" ? "secciones" : "sections",
  };
  const project = projects.find((candidate) => candidate.project.sortOrder === item.caseStudy.sortOrder);
  const currentIndex = cases.findIndex((candidate) => candidate.caseStudy.id === item.caseStudy.id);
  const nextCase = currentIndex >= 0 && cases.length > 1 ? cases[(currentIndex + 1) % cases.length] : null;
  const headings = blocks.filter((block): block is Extract<ContentBlock, { type: "heading" }> => block.type === "heading" && block.level === 2);
  return (
    <article className="mx-auto max-w-5xl px-5 py-20 md:px-10 md:py-28">
      <p className="hero-boot tech-label mb-5">{`// caso · ${item.translation.category} · ${item.caseStudy.readTimeMinutes} min`}</p>
      <h1 className="hero-boot hero-boot-delay-1 display-title text-[clamp(3rem,8vw,7rem)] text-mint">{item.translation.title}</h1>
      <p className="hero-boot hero-boot-delay-2 mt-8 text-xl leading-9 text-[color:var(--muted)]">{item.translation.dek}</p>

      <section className="case-summary-grid mt-12" aria-label={labels.summary}>
        <SummaryTile label={labels.category} value={item.translation.category} />
        <SummaryTile label={labels.period} value={item.translation.periodLabel ?? project?.project.kind ?? "published"} />
        <SummaryTile
          label={labels.result}
          value={item.caseStudy.resultValue ?? item.translation.resultLabel ?? "published"}
          verified={item.caseStudy.resultVerified ? labels.verified : undefined}
        />
      </section>

      <nav className="case-section-nav mt-8" aria-label={labels.sections}>
        <Link href={base}>{labels.back}</Link>
        {headings.map((heading) => (
          <a key={heading.text} href={`#${headingId(heading.text)}`}>{heading.text}</a>
        ))}
        {project?.project.liveUrl ? <a href={project.project.liveUrl} rel="noopener noreferrer" target="_blank">{labels.demo}<ArrowUpRight size={14} /></a> : null}
        {project?.project.repoUrl ? <a href={project.project.repoUrl} rel="noopener noreferrer" target="_blank">{labels.repo}<ArrowUpRight size={14} /></a> : null}
      </nav>

      <div className="mt-14 border-t border-[color:var(--line)] pt-10 text-lg leading-8 text-[color:var(--muted)]">
        <ContentBlocks blocks={blocks} openImageLabel={locale === "es" ? "abrir captura" : "open capture"} />
      </div>

      {nextCase ? (
        <footer className="mt-16 border-t border-[color:var(--line)] pt-8">
          <p className="tech-label mb-4">{labels.next}</p>
          <Link className="next-case-link flex items-center justify-between gap-6 border border-[color:var(--line)] p-5" href={`${base}/${nextCase.translation.slug}`}>
            <span className="font-display text-2xl font-bold uppercase text-mint">{nextCase.translation.title}</span>
            <ArrowUpRight className="next-case-arrow text-[color:var(--glow)]" size={18} />
          </Link>
        </footer>
      ) : null}
    </article>
  );
}

function SummaryTile({ label, value, verified }: { label: string; value: string; verified?: string }) {
  return (
    <ScrollReveal className="technical-card p-4">
      <p className="tech-label mb-3">{label}</p>
      <div className="flex items-center gap-2">
        <strong className="font-display text-2xl font-bold uppercase text-mint">{value}</strong>
        {verified ? <CheckCircle2 aria-label={verified} className="text-[color:var(--glow)]" size={18} /> : null}
      </div>
    </ScrollReveal>
  );
}
