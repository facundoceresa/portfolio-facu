import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { getPublishedCases, getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const [settings, cases] = await Promise.all([getSettings(), getPublishedCases("es")]);
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="// casos" title="Casos reales, sin humo." body="Detalle tecnico publicado solo cuando existe evidencia y traduccion completa." />
      <CasesList locale="es" cases={cases} />
    </PublicShell>
  );
}

export function CasesList({ locale, cases }: { locale: "es" | "en"; cases: Awaited<ReturnType<typeof getPublishedCases>> }) {
  const base = locale === "es" ? "/casos" : "/en/cases";
  if (!cases.length) {
    return (
      <section className="mx-auto max-w-[1360px] px-5 pb-28 md:px-10">
        <div className="technical-card p-8">
          <p className="tech-label mb-4">{"// empty_state"}</p>
          <h2 className="font-display text-3xl font-bold uppercase text-mint">{locale === "es" ? "No hay casos publicados todavia." : "No case studies are published yet."}</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">{locale === "es" ? "Los borradores candidatos existen solo en desarrollo y no se muestran como logros reales." : "Candidate drafts exist only in development and are not shown as real achievements."}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="mx-auto grid max-w-[1360px] gap-4 px-5 pb-28 md:px-10">
      {cases.map((item, index) => (
        <article key={item.caseStudy.id} className="technical-card grid gap-6 p-6 md:grid-cols-[7rem_1fr_auto] md:items-center md:p-8">
          <div className="font-display text-6xl font-bold text-[rgba(115,255,184,0.24)]">0{index + 1}</div>
          <div>
            <p className="tech-label mb-3">{item.translation.category} · {item.caseStudy.readTimeMinutes} min</p>
            <h2 className="font-display text-3xl font-bold uppercase text-mint">{item.translation.title}</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[color:var(--muted)]">{item.translation.dek}</p>
          </div>
          <Link className="hard-button hard-button-secondary" href={`${base}/${item.translation.slug}`}>ver caso <ArrowUpRight size={15} /></Link>
        </article>
      ))}
    </section>
  );
}
