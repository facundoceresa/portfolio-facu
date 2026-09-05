import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { ContentBlocks } from "@/components/content-blocks";
import { legalBlocks } from "@/features/content/defaults";
import type { Locale } from "@/features/content/schemas";

export function LegalPage({ locale, settings, kind }: { locale: Locale; settings: Record<string, string>; kind: "privacy" | "terms" }) {
  const title = locale === "es" ? (kind === "privacy" ? "Privacidad" : "Terminos") : kind === "privacy" ? "Privacy" : "Terms";
  return (
    <PublicShell locale={locale} settings={settings}>
      <PageHeader eyebrow={`// ${kind}`} title={title} body={locale === "es" ? "Vigente desde 2026-08-31. Ajustar antes de produccion con proveedor SMTP y dominio definitivos." : "Effective 2026-08-31. Update before production with final SMTP provider and domain."} />
      <article className="mx-auto max-w-4xl px-5 pb-28 text-lg leading-8 text-[color:var(--muted)] md:px-10">
        <ContentBlocks blocks={legalBlocks(locale)} />
      </article>
    </PublicShell>
  );
}
