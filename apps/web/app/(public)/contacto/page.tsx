import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { getSettings } from "@/features/content/data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="// contacto" title="Hablemos de tu proceso." body="Contame contexto, restricciones y objetivo. Empresa/rol es opcional." />
      <section className="mx-auto grid max-w-[1360px] gap-8 px-5 pb-28 md:grid-cols-[1fr_0.65fr] md:px-10">
        <ContactForm locale="es" />
        <aside className="technical-card h-fit p-6">
          <p className="tech-label mb-4">{"// canales"}</p>
          <a className="block text-2xl font-display font-bold text-mint" href={`mailto:${settings.public_email}`}>{settings.public_email}</a>
          <p className="mt-6 leading-7 text-[color:var(--muted)]">{settings.location}</p>
        </aside>
      </section>
    </PublicShell>
  );
}
