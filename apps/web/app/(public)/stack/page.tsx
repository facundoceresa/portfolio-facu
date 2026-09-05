import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { stackLayers } from "@/features/content/defaults";
import { getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const settings = await getSettings();
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="// stack" title="Maquinas que construyen maquinas." body="Capas tecnicas para convertir procesos reales en sistemas operables, medibles y mantenibles." />
      <StackBody locale="es" />
    </PublicShell>
  );
}

export function StackBody({ locale }: { locale: "es" | "en" }) {
  return (
    <section className="mx-auto grid max-w-[1360px] gap-5 px-5 pb-28 md:px-10">
      {stackLayers.map((layer, index) => (
        <article key={layer.key} className="technical-card grid gap-8 p-6 md:grid-cols-[12rem_1fr] md:p-8">
          <div className="font-mono text-mint">0{index + 1}</div>
          <div>
            <h2 className="font-display text-4xl font-bold uppercase text-[color:var(--glow)]">{layer.title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[color:var(--muted)]">
              {locale === "es" ? "Herramientas seleccionadas por interoperabilidad, trazabilidad y operación sencilla." : "Tools selected for interoperability, traceability and simple operation."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {layer.tools.map((tool) => <span key={tool} className="border border-[color:var(--line)] px-3 py-2 font-mono text-xs uppercase text-[color:var(--dim)]">{tool}</span>)}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
