import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Cpu, Database, Mail, Network, ShieldCheck } from "lucide-react";
import type { Locale } from "@/features/content/schemas";
import { copy, draftProjectCandidates, methodSteps, stackLayers } from "@/features/content/defaults";
import { readProjectMeta, type ProjectScreenshot } from "@/features/content/project-meta";
import { getPublicContact } from "@/features/content/public-contact";
import { getRoute } from "@/lib/i18n/routes";
import { HeroTerminal } from "@/components/home/hero-terminal";
import { ScrollReveal } from "@/components/scroll-reveal";

type ProjectRow = {
  project: {
    id: string;
    metricValue: string | null;
    metricLabelKey: string | null;
    kind: string;
    repoUrl: string | null;
    liveUrl: string | null;
  };
  translation: {
    slug: string;
    title: string;
    summary: string;
    category: string;
    body: unknown;
  };
};

const keywords = ["integraciones", "erp", "automatización", "arquitectura", "postgres", "ia responsable", "producto", "infra", "observabilidad", "eventos"];
const rowOffsets = ["md:ml-0", "md:ml-4", "md:ml-8", "md:ml-12"];
const capabilityCards = {
  es: [
    { kicker: "01", title: "Sistemas internos", body: "Paneles, flujos operativos, permisos, auditoría y reportes para equipos que viven dentro del proceso." },
    { kicker: "02", title: "Integraciones ERP", body: "Lecturas controladas, sincronizaciones, snapshots, límites claros y herramientas que no rompen la base oficial." },
    { kicker: "03", title: "Automatización", body: "Tareas repetibles convertidas en procesos observables, con fallback humano cuando el error cuesta." },
    { kicker: "04", title: "Producto técnico", body: "MVPs, demos y herramientas publicables con tests, despliegue y documentación operativa." },
  ],
  en: [
    { kicker: "01", title: "Internal systems", body: "Dashboards, operational flows, permissions, audit trails and reports for teams working inside the process." },
    { kicker: "02", title: "ERP integrations", body: "Controlled reads, synchronization, snapshots, clear boundaries and tools that avoid breaking the official database." },
    { kicker: "03", title: "Automation", body: "Repeatable tasks turned into observable processes, with human fallback where mistakes are expensive." },
    { kicker: "04", title: "Technical product", body: "MVPs, demos and publishable tools with tests, deployment and operational documentation." },
  ],
};

type HeroCopy = (typeof copy)["es"]["hero"];

export function HomePage({ locale, settings, projects }: { locale: Locale; settings: Record<string, string>; projects: ProjectRow[] }) {
  const t = copy[locale];
  const availability = locale === "es" ? settings.availability_es : settings.availability_en;
  const contact = getPublicContact(settings);
  return (
    <>
      <section className="relative overflow-hidden">
        <svg
          aria-hidden="true"
          className="hero-watermark pointer-events-none absolute right-[-5vw] top-[-4rem] h-[22vw] w-[70vw] min-w-[760px]"
          focusable="false"
          viewBox="0 0 900 260"
        >
          <text x="0" y="205" fill="rgba(115,255,184,0.04)" fontFamily="var(--font-display)" fontSize="230" fontWeight="700">
            CERESA
          </text>
        </svg>
        <div className="mx-auto grid min-h-[calc(100dvh-69px)] max-w-[1360px] gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-28">
          <div className="flex flex-col justify-between gap-14">
            <div>
              <p className="hero-boot tech-label mb-6">CERESA · {availability}</p>
              <h1 className="hero-boot hero-boot-delay-1 display-title max-w-5xl text-[clamp(3.1rem,11vw,9.4rem)] text-mint drop-shadow-[0_0_28px_rgba(45,212,168,0.34)]">
                FACUNDO
                <br />
                CERESA
              </h1>
            </div>
            <div className="max-w-[52rem]">
              <p className="hero-boot hero-boot-delay-2 mb-5 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">{t.hero.terminal}</p>
              <div className="hero-boot hero-boot-delay-3 mb-9 flex flex-wrap items-center gap-3">
                <Link className="hard-button hard-button-primary" href="#trabajo">
                  {t.hero.work}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link className="hard-button hard-button-secondary" href={getRoute(locale, "contact")}>
                  {t.hero.talk}
                </Link>
                <div className="social-icon-strip" aria-label={locale === "es" ? "Enlaces sociales" : "Social links"}>
                  <SocialIconLink href={contact.githubHref} label="GitHub" kind="github" />
                  {contact.linkedinHref ? <SocialIconLink href={contact.linkedinHref} label="LinkedIn" kind="linkedin" /> : null}
                  <SocialIconLink href={contact.mailHref} label="Email" kind="mail" />
                </div>
              </div>
              <div className="hero-boot hero-boot-delay-3">
                <HeroLayerRows />
              </div>
            </div>
          </div>
          <aside className="grid content-center gap-8 md:pt-20">
            <HeroManifesto hero={t.hero} />
          </aside>
        </div>
      </section>
      <div aria-hidden="true" className="marquee-rail relative overflow-hidden border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.6)] py-4">
        <div className="animate-marquee flex w-max gap-12 pr-12 font-display text-3xl font-bold uppercase text-[color:var(--mint)]">
          {[...keywords, ...keywords, ...keywords].map((word, index) => (
            <span key={`${word}-${index}`} className="after:ml-12 after:text-mint after:content-['+']">
              {word}
            </span>
          ))}
        </div>
      </div>
      <section id="trabajo" className="relative py-24 md:py-32">
        <SectionIntro
          eyebrow={t.work.eyebrow}
          title={t.work.title}
          body={t.work.body}
          action={
            <Link className="hard-button hard-button-secondary" href={getRoute(locale, "cases")}>
              {t.work.all}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        <div className="mx-auto mt-14 grid max-w-[1360px] gap-24 px-5 md:px-10">
          {projects.length ? projects.map((project, index) => <ProjectFeature key={project.project.id} project={project} index={index} locale={locale} />) : <DraftEmptyState text={t.work.empty} locale={locale} />}
        </div>
      </section>
      <section id="perfil" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.34)] py-24">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:grid-cols-[0.85fr_1fr] md:px-10">
          <div>
            <p className="tech-label mb-4">{locale === "es" ? "// perfil" : "// profile"}</p>
            <h2 className="display-title text-[clamp(2.4rem,5vw,5.4rem)] text-mint">{locale === "es" ? "Software cerca del proceso." : "Software close to the process."}</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
              {locale === "es"
                ? "Trabajo mejor cuando el problema cruza operación, datos e integración: entender cómo se mueve el negocio, modelarlo bien y dejar una herramienta que alguien pueda usar todos los días."
                : "My best work sits where operations, data and integration meet: understanding how the business moves, modeling it well and leaving behind a tool people can use every day."}
            </p>
            <a className="hard-button hard-button-secondary mt-8" href="/facundo-ceresa-cv.md" download>
              {locale === "es" ? "descargar cv técnico" : "download technical cv"}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilityCards[locale].map((item, index) => (
              <ScrollReveal key={item.title} className="technical-card p-5" delay={index * 50}>
                <p className="tech-label mb-3">{item.kicker}</p>
                <h3 className="font-display text-2xl font-bold uppercase text-[color:var(--glow)]">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">{item.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section id="stack" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.42)] py-24">
        <SectionIntro eyebrow={t.stack.eyebrow} title={t.stack.title} body={t.stack.body} />
        <div className="mx-auto mt-12 grid max-w-[1360px] gap-4 px-5 md:grid-cols-4 md:px-10">
          {stackLayers.map((layer, index) => (
            <ScrollReveal key={layer.key} className="technical-card p-5" delay={index * 50}>
              <div className="mb-8 flex items-center justify-between font-mono text-xs text-[color:var(--dim)]">
                <span>0{index + 1}</span>
                <span className="h-2 w-2 animate-[pulse-dot_2s_ease-in-out_infinite] bg-mint" />
              </div>
              <h3 className="mb-5 font-display text-xl font-bold uppercase text-mint">{layer.title}</h3>
              <div className="flex flex-wrap gap-2">
                {layer.tools.map((tool) => <span key={tool} className="border border-[color:var(--line)] px-2 py-1 font-mono text-[0.65rem] uppercase text-[color:var(--dim)]">{tool}</span>)}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section id="metodo" className="py-24">
        <SectionIntro eyebrow={t.method.eyebrow} title={t.method.title} />
        <div className="mx-auto mt-12 grid max-w-[1360px] gap-4 px-5 md:grid-cols-4 md:px-10">
          {methodSteps.map((step, index) => (
            <ScrollReveal key={step.title} className="technical-card p-5" delay={index * 50}>
              <div className="mb-8 flex items-center justify-between font-mono text-xs text-mint">
                <span>0{index + 1}</span>
                <Check size={14} />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-[color:var(--glow)]">{locale === "es" ? step.title : step.enTitle}</h3>
              <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">{step.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section id="ia" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.38)] py-24">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:grid-cols-[0.8fr_1fr] md:px-10">
          <div>
            <p className="tech-label mb-4">{t.ai.eyebrow}</p>
            <h2 className="display-title text-[clamp(2.4rem,5vw,5.6rem)] text-mint">{t.ai.title}</h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[color:var(--muted)]">{t.ai.body}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["trazabilidad", "prompts, decisiones, versiones y riesgo no se pierden en una caja negra"],
              ["fallback humano", "la automatización no reemplaza criterio donde el error cuesta"],
              ["datos propios", "sin enviar PII a herramientas que no tienen contrato claro"],
              ["medición", "si no mejora el proceso real, no se publica como logro"],
            ].map(([title, body]) => (
              <ScrollReveal key={title} className="technical-card p-5">
                <h3 className="tech-label mb-3">{title}</h3>
                <p className="text-sm leading-6 text-[color:var(--muted)]">{body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section id="contacto" className="px-5 py-28 text-center md:px-10">
        <p className="tech-label mb-4">{t.contact.eyebrow}</p>
        <h2 className="display-title mx-auto max-w-3xl text-[clamp(2.8rem,7vw,6rem)] text-[color:var(--glow)]">{t.contact.title}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-[color:var(--muted)]">{t.contact.body}</p>
        <div className="contact-actions">
          <a className="hard-button hard-button-primary contact-action-primary" href={contact.mailHref}>
            <Mail size={16} aria-hidden="true" />
            {contact.email}
          </a>
          {contact.linkedinHref ? (
            <a className="hard-button hard-button-secondary" href={contact.linkedinHref} rel="noopener noreferrer">
              <BrandIcon kind="linkedin" />
              linkedin
            </a>
          ) : null}
          <a className="hard-button hard-button-secondary" href={contact.githubHref} rel="noopener noreferrer">
            <BrandIcon kind="github" />
            github
          </a>
        </div>
      </section>
    </>
  );
}

function HeroManifesto({ hero }: { hero: HeroCopy }) {
  return (
    <div className="hero-boot hero-boot-delay-2 hero-manifesto border-l-4 border-l-[color:var(--glow)] p-6">
      <p className="tech-label mb-4">{hero.kicker}</p>
      <h2 className="mb-4 font-display text-3xl font-bold text-[color:var(--fog)]">{hero.title}</h2>
      <p className="leading-7 text-[color:var(--muted)]">{hero.body}</p>
      <HeroTerminal summary={hero.terminal} />
    </div>
  );
}

function HeroLayerRows() {
  return (
    <div className="hero-layer-console grid gap-2 font-mono text-xs text-[color:var(--dim)]" aria-label="Capas técnicas principales">
      {stackLayers.map((layer, index) => (
        <div
          key={layer.key}
          className={`hero-layer-row ${rowOffsets[index]}`}
        >
          <span className="font-bold text-[color:var(--glow)]">0{index + 1}</span>
          <span className="uppercase text-[color:var(--glow)]">{layer.title}</span>
          <span className="hidden text-[color:var(--muted)] sm:inline">{layer.tools.slice(0, 3).join(" · ")}</span>
          <span className="ml-auto font-bold text-[color:var(--glow)]">↳ ok</span>
        </div>
      ))}
    </div>
  );
}

function SectionIntro({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: React.ReactNode }) {
  return (
    <ScrollReveal className="section-intro mx-auto flex max-w-[1360px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
      <div>
        <p className="tech-label mb-4">{eyebrow}</p>
        <h2 className="display-title max-w-3xl text-[clamp(2.8rem,6vw,6rem)] text-mint">{title}</h2>
        {body ? <p className="mt-5 max-w-xl leading-7 text-[color:var(--muted)]">{body}</p> : null}
      </div>
      {action}
    </ScrollReveal>
  );
}

function ProjectFeature({ project, index, locale }: { project: ProjectRow; index: number; locale: Locale }) {
  const href = `${getRoute(locale, "cases")}/${project.translation.slug}`;
  const meta = readProjectMeta(project.translation.body);
  const screenshot = meta.screenshots[0];
  return (
    <ScrollReveal as="article" className="relative md:min-h-[520px]" delay={Math.min(index, 3) * 60}>
      <div className={`blueprint-panel min-h-[300px] overflow-hidden p-5 md:w-[64%] ${index % 2 ? "md:ml-auto" : ""}`}>
        <div className="relative z-10 flex justify-between font-mono text-xs uppercase text-[color:var(--glow)]">
          <span>{project.translation.category}</span>
          <span className="text-5xl font-bold text-[rgba(115,255,184,0.22)]">0{index + 1}</span>
        </div>
        {screenshot ? <ProjectScreenshotFrame screenshot={screenshot} priority={index === 0} /> : <BlueprintVisual index={index} />}
      </div>
      <div className={`bg-mint p-6 text-[color:var(--surface)] shadow-[8px_8px_0_rgba(115,255,184,0.18)] md:absolute md:top-40 md:w-[45%] ${index % 2 ? "md:left-8" : "md:right-8"}`}>
        <p className="mb-4 font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em]">caso · 0{index + 1}</p>
        <h3 className="font-display text-2xl font-bold leading-none">{project.translation.title}</h3>
        <p className="mt-4 text-sm leading-6">{project.translation.summary}</p>
        {meta.stack.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.stack.slice(0, 6).map((tool) => (
              <span key={tool} className="border border-[rgba(10,21,33,0.34)] px-2 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em]">
                {tool}
              </span>
            ))}
          </div>
        ) : null}
        {project.project.metricValue ? <p className="mt-6 font-display text-4xl font-bold">{project.project.metricValue}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={href} className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
            ver caso <ArrowUpRight size={15} />
          </Link>
          {project.project.repoUrl ? (
            <a href={project.project.repoUrl} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
              repo <BrandIcon kind="github" />
            </a>
          ) : null}
          {project.project.liveUrl ? (
            <a href={project.project.liveUrl} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
              demo <ArrowUpRight size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </ScrollReveal>
  );
}

function DraftEmptyState({ text, locale }: { text: string; locale: Locale }) {
  return (
    <div className="technical-card grid gap-8 p-8 md:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="tech-label mb-4">{"// contenido_en_revision"}</p>
        <h3 className="font-display text-3xl font-bold uppercase text-mint">{text}</h3>
        <Link className="hard-button hard-button-secondary mt-8" href={getRoute(locale, "contact")}>
          conversar contexto
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-2">
        {draftProjectCandidates.map((candidate, index) => (
          <div key={candidate} className="hero-layer-row flex items-center gap-3 p-3 font-mono text-xs uppercase text-[color:var(--dim)]">
            <span className="text-mint">0{index + 1}</span>
            <span>{candidate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialIconLink({ href, label, kind }: { href: string; label: string; kind: "github" | "linkedin" | "mail" }) {
  return (
    <a className="hero-social-link" href={href} aria-label={label} rel="noopener noreferrer">
      {kind === "mail" ? <Mail size={16} aria-hidden="true" /> : <BrandIcon kind={kind} />}
    </a>
  );
}

function BrandIcon({ kind }: { kind: "github" | "linkedin" }) {
  if (kind === "github") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25A9.75 9.75 0 0 0 8.92 21.26c.49.09.67-.21.67-.47v-1.7c-2.73.59-3.31-1.17-3.31-1.17-.45-1.13-1.09-1.43-1.09-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.88 1.5 2.3 1.07 2.86.82.09-.64.34-1.07.62-1.31-2.18-.25-4.47-1.09-4.47-4.85 0-1.07.38-1.95 1.01-2.64-.1-.25-.44-1.25.1-2.6 0 0 .83-.27 2.7 1a9.26 9.26 0 0 1 4.92 0c1.88-1.27 2.7-1 2.7-1 .54 1.35.2 2.35.1 2.6.63.69 1.01 1.57 1.01 2.64 0 3.77-2.3 4.6-4.49 4.85.36.31.67.91.67 1.85v2.74c0 .26.18.57.68.47A9.75 9.75 0 0 0 12 2.25Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 8.75H3.78v10.14h3.16V8.75ZM5.36 3.86a1.83 1.83 0 1 0 0 3.66 1.83 1.83 0 0 0 0-3.66Zm13.86 9.47c0-3.05-1.63-4.47-3.8-4.47a3.28 3.28 0 0 0-2.96 1.63h-.04V8.75H9.39v10.14h3.16v-5.02c0-1.32.25-2.6 1.89-2.6 1.61 0 1.63 1.51 1.63 2.68v4.94h3.15v-5.56Z" />
    </svg>
  );
}

function BlueprintVisual({ index }: { index: number }) {
  const icons = [Network, Database, Cpu, ShieldCheck];
  const Icon = icons[index % icons.length];
  return (
    <div className="grid h-56 place-items-center text-[rgba(115,255,184,0.42)]">
      <div className="relative grid h-36 w-72 max-w-full place-items-center">
        <div className="blueprint-line absolute inset-x-4 top-1/2 h-px bg-[color:var(--line-strong)]" />
        {[0, 1, 2, 3].map((dot) => (
          <span key={dot} className="blueprint-dot absolute h-12 w-12 rounded-full border border-[color:var(--line-strong)]" style={{ left: `${dot * 28}%`, top: "calc(50% - 24px)", animationDelay: `${dot * 160}ms` }} />
        ))}
        <Icon size={64} strokeWidth={1} />
      </div>
    </div>
  );
}

function ProjectScreenshotFrame({ screenshot, priority }: { screenshot: ProjectScreenshot; priority: boolean }) {
  return (
    <div className="project-shot-wrap scanline">
      <div className="project-shot-topbar" aria-hidden="true">
        <span />
        <span />
        <span />
        <strong>runtime_capture.png</strong>
      </div>
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        className="project-shot-image"
        sizes="(min-width: 1024px) 820px, calc(100vw - 40px)"
        priority={priority}
      />
    </div>
  );
}
