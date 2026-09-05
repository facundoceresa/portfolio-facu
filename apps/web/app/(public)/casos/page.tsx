import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { getPublishedCases, getPublishedProjects, getSettings } from "@/features/content/data";
import { readProjectMeta } from "@/features/content/project-meta";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const [settings, cases, projects] = await Promise.all([getSettings(), getPublishedCases("es"), getPublishedProjects("es")]);
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="// casos" title="Casos reales, sin humo." body="Detalle técnico publicado sólo cuando existe evidencia y traducción completa." />
      <CasesList locale="es" cases={cases} projects={projects} />
    </PublicShell>
  );
}

export function CasesList({
  locale,
  cases,
  projects,
}: {
  locale: "es" | "en";
  cases: Awaited<ReturnType<typeof getPublishedCases>>;
  projects: Awaited<ReturnType<typeof getPublishedProjects>>;
}) {
  const base = locale === "es" ? "/casos" : "/en/cases";
  if (!cases.length) {
    return (
      <section className="mx-auto max-w-[1360px] px-5 pb-28 md:px-10">
        <div className="technical-card p-8">
          <p className="tech-label mb-4">{"// empty_state"}</p>
          <h2 className="font-display text-3xl font-bold uppercase text-mint">{locale === "es" ? "No hay casos publicados todavía." : "No case studies are published yet."}</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">{locale === "es" ? "Los borradores candidatos existen solo en desarrollo y no se muestran como logros reales." : "Candidate drafts exist only in development and are not shown as real achievements."}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto grid max-w-[1360px] gap-5 px-5 pb-28 md:px-10">
      {cases.map((item, index) => {
        const project = projects.find((candidate) => candidate.project.sortOrder === item.caseStudy.sortOrder);
        const meta = readProjectMeta(project?.translation.body);
        const screenshot = meta.screenshots[0];
        return (
          <article key={item.caseStudy.id} className="case-index-card technical-card grid gap-6 overflow-hidden p-4 md:grid-cols-[minmax(18rem,0.72fr)_1fr] md:p-5">
            <Link href={`${base}/${item.translation.slug}`} className="case-index-shot scanline" aria-label={`${locale === "es" ? "Ver caso" : "View case"} ${item.translation.title}`}>
              {screenshot ? (
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  width={screenshot.width}
                  height={screenshot.height}
                  className="h-full w-full object-cover object-top"
                  sizes="(min-width: 1024px) 520px, calc(100vw - 40px)"
                />
              ) : (
                <div className="grid h-full place-items-center font-display text-6xl font-bold text-[rgba(115,255,184,0.24)]">0{index + 1}</div>
              )}
            </Link>
            <div className="grid content-between gap-6 p-2 md:p-3">
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="tech-label">{item.translation.category} · {item.caseStudy.readTimeMinutes} min</p>
                  <span className="font-display text-5xl font-bold text-[rgba(115,255,184,0.22)]">0{index + 1}</span>
                </div>
                <h2 className="font-display text-3xl font-bold uppercase text-mint md:text-4xl">{item.translation.title}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[color:var(--muted)]">{item.translation.dek}</p>
                {meta.stack.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {meta.stack.slice(0, 8).map((tool) => (
                      <span key={tool} className="border border-[color:var(--line)] px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[color:var(--dim)]">
                        {tool}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {item.caseStudy.resultValue ? (
                  <span className="border border-[color:var(--line-strong)] px-3 py-2 font-display text-2xl font-bold text-[color:var(--glow)]">
                    {item.caseStudy.resultValue}
                  </span>
                ) : null}
                <Link className="hard-button hard-button-secondary" href={`${base}/${item.translation.slug}`}>{locale === "es" ? "ver caso" : "view case"} <ArrowUpRight size={15} /></Link>
                {project?.project.liveUrl ? (
                  <a className="hard-button hard-button-secondary" href={project.project.liveUrl} rel="noopener noreferrer" target="_blank">
                    demo <ArrowUpRight size={15} />
                  </a>
                ) : null}
                {project?.project.repoUrl ? (
                  <a className="hard-button hard-button-secondary" href={project.project.repoUrl} rel="noopener noreferrer" target="_blank">
                    repo <ArrowUpRight size={15} />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
