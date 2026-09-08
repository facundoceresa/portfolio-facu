import { PublicShell } from "@/components/public-shell";
import { PageHeader } from "@/components/page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Locale } from "@/features/content/schemas";
import { getPublicContact } from "@/features/content/public-contact";
import { Clock, Database, Mail, ShieldCheck } from "lucide-react";

export function LegalPage({ locale, settings, kind }: { locale: Locale; settings: Record<string, string>; kind: "privacy" | "terms" }) {
  const contact = getPublicContact(settings);
  const title = locale === "es" ? (kind === "privacy" ? "Politica de privacidad" : "Terminos de uso") : kind === "privacy" ? "Privacy policy" : "Terms of use";
  const intro =
    locale === "es"
      ? kind === "privacy"
        ? "Qué datos guarda este portfolio, para qué se usan y cómo pedir cambios o eliminación."
        : "Condiciones simples para usar este portfolio, sus demos publicas y el formulario de contacto."
      : kind === "privacy"
        ? "What this portfolio stores, how that data is used, and how to request changes or deletion."
        : "Simple terms for using this portfolio, its public demos, and the contact form.";
  const sections = kind === "privacy" ? privacySections(locale) : termsSections(locale);
  return (
    <PublicShell locale={locale} settings={settings}>
      <PageHeader eyebrow={locale === "es" ? `legal / ${kind === "privacy" ? "privacidad" : "terminos"}` : `legal / ${kind}`} title={title} body={intro} variant="read" />
      <article className="legal-page mx-auto max-w-[1360px] px-5 pb-28 md:px-10">
        <ScrollReveal className="legal-updated">
          <span className="pulse-dot h-2 w-2 bg-mint" aria-hidden="true" />
          {locale === "es" ? "ultima actualizacion · 2026-08" : "last update · 2026-08"}
        </ScrollReveal>
        <div className="legal-sections">
          {sections.map((section, index) => (
            <ScrollReveal key={section.title} as="section" className="legal-section" delay={Math.min(index, 4) * 45}>
              <div className="legal-section-heading">
                <p className="tech-label">{`${locale === "es" ? "sección" : "section"} ${String(index + 1).padStart(2, "0")}`}</p>
                <h2 className="display-title text-[clamp(2rem,4vw,3rem)]">{section.title}</h2>
                <span>{locale === "es" ? "seccion" : "section"}</span>
              </div>
              <div className="legal-section-grid">
                <p>{section.body}</p>
                <aside className="legal-summary">
                  <div className="legal-summary-icon">{section.icon}</div>
                  <div>
                    <p className="tech-label">{locale === "es" ? "resumen" : "summary"}</p>
                    <ul>
                      {section.summary.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="legal-contact signal-panel" hover="surface">
          <h2 className="display-title text-[clamp(1.8rem,4vw,2.6rem)] text-mint">
            {locale === "es" ? "Dudas sobre tus datos?" : "Questions about your data?"}
          </h2>
          <p>{locale === "es" ? "Escribime directo. Sin formularios de tickets ni bots intermedios." : "Write directly. No ticket forms or bots in the middle."}</p>
          <a className="hard-button hard-button-primary" href={contact.mailHref}>
            {contact.email}
          </a>
        </ScrollReveal>
      </article>
    </PublicShell>
  );
}

function privacySections(locale: Locale) {
  if (locale === "es") {
    return [
      {
        title: "Datos que recolecto",
        body: "Solo lo que envias voluntariamente en el formulario de contacto: nombre, email, empresa o rol, alcance, presupuesto estimado y mensaje. Tambien se guarda el idioma elegido, el consentimiento, el resultado antispam y una huella tecnica de idempotencia.",
        summary: ["nombre y email", "empresa opcional", "mensaje del formulario", "control antispam"],
        icon: <Database size={16} aria-hidden="true" />,
      },
      {
        title: "Para que se usan",
        body: "Exclusivamente para responder tu consulta, evaluar si el proyecto tiene sentido para ambas partes y mantener trazabilidad minima de la conversacion. No vendo, alquilo ni comparto datos con terceros con fines publicitarios.",
        summary: ["responder consultas", "presupuestar trabajo", "mantener registro contractual"],
        icon: <ShieldCheck size={16} aria-hidden="true" />,
      },
      {
        title: "Cookies y analitica",
        body: "Este sitio no usa cookies publicitarias ni rastreo cross-site. Puede guardar una preferencia local de idioma en tu navegador, que podes borrar cuando quieras.",
        summary: ["localStorage: idioma", "sin cookies de terceros", "sin fingerprinting"],
        icon: <ShieldCheck size={16} aria-hidden="true" />,
      },
      {
        title: "Conservacion",
        body: "Los mensajes de contacto se conservan hasta 24 meses. Si el proyecto avanza, la documentacion asociada se guarda segun obligaciones fiscales, contractuales y operativas.",
        summary: ["mensajes: 24 meses", "contratos: segun obligacion", "borrado bajo pedido"],
        icon: <Clock size={16} aria-hidden="true" />,
      },
      {
        title: "Tus derechos",
        body: "Podes pedir acceso, rectificacion o eliminacion de tus datos escribiendo al email publico del portfolio. Respondo sin intermediarios y con el mismo canal por el que llego la consulta.",
        summary: ["acceso", "rectificacion", "eliminacion", "portabilidad"],
        icon: <Mail size={16} aria-hidden="true" />,
      },
    ];
  }

  return [
    {
      title: "Data I collect",
      body: "Only what you voluntarily send through the contact form: name, email, company or role, scope, estimated budget, and message. The selected language, consent, anti-spam result, and an idempotency fingerprint are also stored.",
      summary: ["name and email", "optional company", "form message", "anti-spam check"],
      icon: <Database size={16} aria-hidden="true" />,
    },
    {
      title: "How it is used",
      body: "Exclusively to answer your inquiry, evaluate whether the project makes sense for both sides, and keep minimal traceability of the conversation. I do not sell, rent, or share data with third parties for advertising.",
      summary: ["answer inquiries", "estimate work", "keep contractual records"],
      icon: <ShieldCheck size={16} aria-hidden="true" />,
    },
    {
      title: "Cookies and analytics",
      body: "This site does not use advertising cookies or cross-site tracking. It may store a local language preference in your browser, which you can remove at any time.",
      summary: ["localStorage: language", "no third-party cookies", "no fingerprinting"],
      icon: <ShieldCheck size={16} aria-hidden="true" />,
    },
    {
      title: "Retention",
      body: "Contact messages are retained for up to 24 months. If the project moves forward, associated documentation is stored according to fiscal, contractual, and operational obligations.",
      summary: ["messages: 24 months", "contracts: per obligation", "deletion on request"],
      icon: <Clock size={16} aria-hidden="true" />,
    },
    {
      title: "Your rights",
      body: "You can request access, correction, or deletion of your data by writing to the public portfolio email. I reply directly through the same channel that received the inquiry.",
      summary: ["access", "correction", "deletion", "portability"],
      icon: <Mail size={16} aria-hidden="true" />,
    },
  ];
}

function termsSections(locale: Locale) {
  if (locale === "es") {
    return [
      {
        title: "Uso del sitio",
        body: "El portfolio muestra proyectos, capturas, repositorios y demos publicas con fines profesionales. No concede licencia para copiar marcas, contenido, codigo privado ni material no publicado.",
        summary: ["uso informativo", "contenido profesional", "sin licencia implicita"],
        icon: <ShieldCheck size={16} aria-hidden="true" />,
      },
      {
        title: "Demos y enlaces",
        body: "Algunas demos viven en dominios externos y pueden cambiar, pausarse o retirarse. Los repositorios publicos conservan sus propias licencias y condiciones.",
        summary: ["demos externas", "repositorios publicos", "estado variable"],
        icon: <Database size={16} aria-hidden="true" />,
      },
      {
        title: "Contacto",
        body: "Enviar un mensaje no crea una relacion contractual. Cualquier trabajo profesional requiere alcance, condiciones y aprobacion explicita por escrito.",
        summary: ["sin contrato automatico", "alcance escrito", "aprobacion explicita"],
        icon: <Mail size={16} aria-hidden="true" />,
      },
    ];
  }

  return [
    {
      title: "Site usage",
      body: "The portfolio shows projects, screenshots, repositories, and public demos for professional purposes. It does not grant a license to copy brands, content, private code, or unpublished material.",
      summary: ["informational use", "professional content", "no implied license"],
      icon: <ShieldCheck size={16} aria-hidden="true" />,
    },
    {
      title: "Demos and links",
      body: "Some demos live on external domains and may change, pause, or be removed. Public repositories keep their own licenses and conditions.",
      summary: ["external demos", "public repositories", "variable state"],
      icon: <Database size={16} aria-hidden="true" />,
    },
    {
      title: "Contact",
      body: "Sending a message does not create a contractual relationship. Any professional work requires scope, terms, and explicit written approval.",
      summary: ["no automatic contract", "written scope", "explicit approval"],
      icon: <Mail size={16} aria-hidden="true" />,
    },
  ];
}
