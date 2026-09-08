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
import { SignalSwarm } from "@/components/signal-swarm";
import { BrandIcon } from "@/components/brand-icon";

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
    { kicker: "operación", title: "Sistemas internos", body: "Paneles, permisos, auditoría y reportes para equipos que trabajan dentro del proceso." },
    { kicker: "datos", title: "Integraciones ERP", body: "Lecturas controladas, sincronizaciones y límites claros alrededor de la base oficial." },
    { kicker: "flujo", title: "Automatización", body: "Tareas repetibles convertidas en procesos observables con fallback humano." },
    { kicker: "entrega", title: "Producto técnico", body: "MVPs y herramientas publicables con tests, despliegue y documentación operativa." },
  ],
  en: [
    { kicker: "ops", title: "Internal systems", body: "Dashboards, permissions, audit trails and reports for teams working inside the process." },
    { kicker: "data", title: "ERP integrations", body: "Controlled reads, synchronization and clear boundaries around the official database." },
    { kicker: "flow", title: "Automation", body: "Repeatable tasks turned into observable processes with human fallback." },
    { kicker: "ship", title: "Technical product", body: "MVPs and publishable tools with tests, deployment and operational documentation." },
  ],
};
const aiPrinciples = {
  es: [
    ["trazabilidad", "prompts, decisiones, versiones y riesgos quedan visibles"],
    ["fallback humano", "el flujo vuelve a una persona cuando el error cuesta"],
    ["datos propios", "PII y contratos definen qué herramienta puede intervenir"],
    ["medición", "si no mejora una operación real, no se publica como logro"],
  ],
  en: [
    ["traceability", "prompts, decisions, versions and risks stay visible"],
    ["human fallback", "the flow returns to a person when mistakes are expensive"],
    ["owned data", "PII and contracts define which tool may intervene"],
    ["measurement", "if it does not improve real operations, it is not shipped as a win"],
  ],
};

type HeroCopy = (typeof copy)["es"]["hero"];

export function HomePage({ locale, settings, projects }: { locale: Locale; settings: Record<string, string>; projects: ProjectRow[] }) {
  const t = copy[locale];
  const availability = locale === "es" ? settings.availability_es : settings.availability_en;
  const contact = getPublicContact(settings);
  const projectLabels = locale === "es"
    ? { view: "ver caso", repo: "repo", demo: "demo", metric: "resultado" }
    : { view: "view case", repo: "repo", demo: "demo", metric: "outcome" };
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
              <h1 className="hero-boot hero-boot-delay-1 display-title max-w-5xl text-[clamp(3.1rem,11vw,9.4rem)]">
                FACUNDO
                <br />
                <span className="text-glow-strong">CERESA</span>
              </h1>
            </div>
            <div className="max-w-[52rem]">
              <p className="hero-boot hero-boot-delay-2 mb-5 max-w-2xl text-lg leading-8 text-tone-green">{t.hero.terminal}</p>
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
                <HeroLayerRows locale={locale} />
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
          {projects.length ? projects.map((project, index) => <ProjectFeature key={project.project.id} project={project} index={index} locale={locale} labels={projectLabels} />) : <DraftEmptyState text={t.work.empty} locale={locale} />}
        </div>
      </section>
      <section id="perfil" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.34)] py-24">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:grid-cols-[0.85fr_1fr] md:px-10">
          <div>
            <p className="tech-label mb-4">{locale === "es" ? "perfil" : "profile"}</p>
            <h2 className="display-title text-[clamp(2.4rem,5vw,5.4rem)]">{renderAccentTitle(locale === "es" ? "Software cerca del proceso." : "Software close to the process.")}</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-tone-muted">
              {locale === "es"
                ? "Trabajo mejor cuando el problema cruza operación, datos e integración: entender cómo se mueve el negocio, modelarlo bien y dejar una herramienta que alguien pueda usar todos los días."
                : "My best work sits where operations, data and integration meet: understanding how the business moves, modeling it well and leaving behind a tool people can use every day."}
            </p>
            <a className="hard-button hard-button-secondary mt-8" href="/facundo-ceresa-cv.md" download>
              {locale === "es" ? "descargar cv técnico" : "download technical cv"}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="capability-grid">
            {capabilityCards[locale].map((item, index) => (
              <ScrollReveal key={item.title} className="capability-item" delay={index * 45} hover="surface" variant={index % 2 ? "slide-right" : "slide-left"}>
                <p className="capability-kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      <section id="stack" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.42)] py-24">
        <SectionIntro eyebrow={t.stack.eyebrow} title={t.stack.title} body={t.stack.body} />
        <div className="stack-board mx-auto mt-12 max-w-[1360px] px-5 md:px-10">
          {stackLayers.map((layer, index) => (
            <ScrollReveal key={layer.key} className="stack-board-row" delay={index * 55} hover="surface" variant={index % 2 ? "slide-right" : "slide-left"}>
              <span className="stack-board-index">{layer.key}</span>
              <h3>{layer.title}</h3>
              <div>
                {layer.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section id="metodo" className="py-24">
        <SectionIntro eyebrow={t.method.eyebrow} title={t.method.title} />
        <div className="process-trace mx-auto mt-12 max-w-[1360px] px-5 md:px-10">
          {methodSteps.map((step, index) => (
            <ScrollReveal key={step.title} className="process-step" delay={index * 70} hover="surface" variant="trace">
              <span className="process-node"><Check size={14} aria-hidden="true" /></span>
              <div>
                <p>{String(index + 1).padStart(2, "0")}</p>
                <h3>{locale === "es" ? step.title : step.enTitle}</h3>
                <span>{locale === "es" ? step.body : step.enBody}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section id="ia" className="border-y border-[color:var(--line)] bg-[rgba(10,21,33,0.38)] py-24">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 md:grid-cols-[0.8fr_1fr] md:px-10">
          <div>
            <p className="tech-label mb-4">{t.ai.eyebrow}</p>
            <h2 className="display-title text-[clamp(2.4rem,5vw,5.6rem)]">{renderAccentTitle(t.ai.title)}</h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-tone-green">{t.ai.body}</p>
          </div>
          <div className="ai-system">
            <ScrollReveal variant="compress">
              <SignalSwarm locale={locale} />
            </ScrollReveal>
            <div className="ai-ledger">
              {aiPrinciples[locale].map(([title, body], index) => (
                <ScrollReveal key={title} className="ai-ledger-row" delay={index * 55} hover="surface" variant={index % 2 ? "slide-right" : "slide-left"}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="contacto" className="px-5 py-28 text-center md:px-10">
        <p className="tech-label mb-4">{t.contact.eyebrow}</p>
        <h2 className="display-title mx-auto max-w-3xl text-[clamp(2.8rem,7vw,6rem)]">{renderAccentTitle(t.contact.title)}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-tone-green">{t.contact.body}</p>
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
    <div className="hero-boot hero-boot-delay-2 hero-manifesto border-l border-l-[color:var(--glow)] p-6">
      <p className="tech-label mb-4">{hero.kicker}</p>
      <h2 className="mb-4 font-display text-3xl font-bold text-[color:var(--fog)]">{hero.title}</h2>
      <p className="leading-7 text-[color:var(--muted)]">{hero.body}</p>
      <HeroTerminal summary={hero.terminal} />
    </div>
  );
}

function HeroLayerRows({ locale }: { locale: Locale }) {
  return (
    <div className="hero-layer-console grid gap-2 font-mono text-xs text-[color:var(--dim)]" aria-label={locale === "es" ? "Capas técnicas principales" : "Main technical layers"}>
      {stackLayers.map((layer, index) => (
        <div
          key={layer.key}
          className={`hero-layer-row ${rowOffsets[index]}`}
        >
          <span className="font-bold text-[color:var(--glow)]">0{index + 1}</span>
          <span className="uppercase text-[color:var(--glow)]">{layer.title}</span>
          <span className="hidden text-[color:var(--muted)] sm:inline">{layer.tools.slice(0, 3).join(" · ")}</span>
          <span className="ml-auto font-bold text-[color:var(--glow)]">{locale === "es" ? "estable" : "stable"}</span>
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
        <h2 className="display-title max-w-3xl text-[clamp(2.8rem,6vw,6rem)]">{renderAccentTitle(title)}</h2>
        {body ? <p className="mt-5 max-w-xl leading-7 text-tone-muted">{body}</p> : null}
      </div>
      {action}
    </ScrollReveal>
  );
}

function renderAccentTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="text-glow-soft">{last}</span>
    </>
  );
}

function ProjectFeature({
  project,
  index,
  locale,
  labels,
}: {
  project: ProjectRow;
  index: number;
  locale: Locale;
  labels: { view: string; repo: string; demo: string; metric: string };
}) {
  const href = `${getRoute(locale, "cases")}/${project.translation.slug}`;
  const meta = readProjectMeta(project.translation.body);
  const screenshot = meta.screenshots[0];
  return (
    <ScrollReveal as="article" className="project-feature relative md:min-h-[520px]" delay={Math.min(index, 3) * 65} hover="card" variant={index % 2 ? "slide-right" : "slide-left"}>
      <div className={`project-feature-panel blueprint-panel min-h-[300px] overflow-hidden p-5 md:w-[64%] ${index % 2 ? "md:ml-auto" : ""}`}>
        <div className="relative z-10 flex justify-between font-mono text-xs uppercase text-[color:var(--glow)]">
          <span>{project.translation.category}</span>
          <span className="text-5xl font-bold text-[rgba(115,255,184,0.22)]">0{index + 1}</span>
        </div>
        {screenshot ? <ProjectScreenshotFrame screenshot={screenshot} priority={index === 0} /> : <BlueprintVisual index={index} />}
      </div>
      <div className={`project-feature-card bg-mint p-6 text-[color:var(--surface)] shadow-[8px_8px_0_rgba(115,255,184,0.18)] md:absolute md:top-40 md:w-[45%] ${index % 2 ? "md:left-8" : "md:right-8"}`}>
        <p className="mb-4 font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em]">{locale === "es" ? "caso" : "case"} · 0{index + 1}</p>
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
        {project.project.metricValue ? (
          <div className="project-feature-metric">
            <p>{labels.metric}</p>
            <strong>{project.project.metricValue}</strong>
            {project.project.metricLabelKey ? <span>{project.project.metricLabelKey}</span> : null}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={href} className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
            {labels.view} <ArrowUpRight size={15} />
          </Link>
          {project.project.repoUrl ? (
            <a href={project.project.repoUrl} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
              {labels.repo} <BrandIcon kind="github" />
            </a>
          ) : null}
          {project.project.liveUrl ? (
            <a href={project.project.liveUrl} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em]">
              {labels.demo} <ArrowUpRight size={15} />
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
        <p className="tech-label mb-4">{locale === "es" ? "contenido en revisión" : "content under review"}</p>
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
