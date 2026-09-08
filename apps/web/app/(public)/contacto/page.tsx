import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BrandIcon } from "@/components/brand-icon";
import { getSettings } from "@/features/content/data";
import { getPublicContact } from "@/features/content/public-contact";
import { Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  const contact = getPublicContact(settings);
  return (
    <PublicShell locale="es" settings={settings}>
      <PageHeader eyebrow="contacto" title="Hablemos de tu sistema" body="Un objetivo claro y el contexto actual alcanzan para iniciar una conversación útil." variant="contact" />
      <section className="contact-page-grid mx-auto grid max-w-[1360px] gap-6 px-5 pb-16 md:grid-cols-[minmax(0,1fr)_17rem] md:px-10">
        <ScrollReveal>
          <ContactForm locale="es" />
        </ScrollReveal>
        <ScrollReveal as="aside" className="contact-side h-fit" delay={50}>
          <ContactChannel icon={<Mail size={18} />} label="email" value={contact.email} href={contact.mailHref} />
          <ContactChannel icon={<BrandIcon kind="github" />} label="github" value="@facundoceresa" href={contact.githubHref} />
          <div className="contact-side-card">
            <div className="contact-side-icon"><MapPin size={17} aria-hidden="true" /></div>
            <div>
              <p className="tech-label">disponibilidad</p>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">{contact.location}</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--dim)]">{settings.availability_es}</p>
            </div>
          </div>
          <div className="contact-side-note">
            <p className="tech-label">criterio de contacto</p>
            <p>Prioridad para sistemas internos, integraciones, automatización y producto técnico.</p>
          </div>
        </ScrollReveal>
      </section>
    </PublicShell>
  );
}

function ContactChannel({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href: string }) {
  return (
    <a className="contact-side-card contact-side-link" href={href} rel="noopener noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
      <div className="contact-side-icon">{icon}</div>
      <div>
        <span className="tech-label">{label}</span>
        <strong>{value}</strong>
      </div>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
