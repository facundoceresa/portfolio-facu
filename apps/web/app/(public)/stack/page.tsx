import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { stackLayers } from "@/features/content/defaults";
import { getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const settings = await getSettings();
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="stack" title="Capas técnicas en producción" body="Tecnologías elegidas por cómo se integran, se operan y se sostienen cuando el sistema deja de ser demo." variant="index" />
      <StackBody locale="es" />
    </PublicShell>
  );
}

export function StackBody({ locale }: { locale: "es" | "en" }) {
  return (
    <section className="mx-auto grid max-w-[1360px] gap-5 px-5 pb-28 md:px-10">
      {stackLayers.map((layer, index) => (
        <ScrollReveal key={layer.key} as="article" className="stack-layer-row" delay={index * 55} hover="surface" variant={index % 2 ? "slide-right" : "slide-left"}>
          <div className="stack-layer-index">0{index + 1}</div>
          <div>
            <h2 className="stack-layer-title">{layer.title}</h2>
            <p className="stack-layer-copy">
              {locale === "es" ? "Herramientas seleccionadas por interoperabilidad, trazabilidad y operación diaria." : "Tools selected for interoperability, traceability and daily operation."}
            </p>
            <div className="stack-tool-list">
              {layer.tools.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </section>
  );
}
