import Link from "next/link";
import { ArrowUpRight, Home, SearchX } from "lucide-react";

type NotFoundPanelProps = {
  locale?: "es" | "en";
  context?: "site" | "case";
};

const copy = {
  es: {
    label: "// http 404 · ruta no encontrada",
    title: "Esta pagina no existe (todavia)",
    body: "La URL fue movida, renombrada o todavia no fue publicada.",
    command: "$ router.match(location.pathname)",
    trace: ["-> no matching route", "-> status 404", "-> suggestion: revisa el enlace o volve al inicio_"],
    home: "volver al inicio",
    contact: "reportar enlace roto",
    cards: [
      { label: "home", title: "inicio", href: "/" },
      { label: "tooling", title: "stack", href: "/stack" },
      { label: "case studies", title: "casos", href: "/casos" },
      { label: "let's talk", title: "contacto", href: "/contacto" },
    ],
    caseCards: [
      { label: "case index", title: "casos", href: "/casos" },
      { label: "home", title: "inicio", href: "/" },
      { label: "tooling", title: "stack", href: "/stack" },
    ],
  },
  en: {
    label: "// http 404 · route_not_resolved",
    title: "This page does not exist (yet)",
    body: "The URL was moved, renamed, or has not been published yet.",
    command: "$ router.match(location.pathname)",
    trace: ["-> no matching route", "-> status 404", "-> suggestion: check the link or go back home_"],
    home: "back home",
    contact: "report broken link",
    cards: [
      { label: "home", title: "home", href: "/en" },
      { label: "tooling", title: "stack", href: "/en/stack" },
      { label: "case studies", title: "cases", href: "/en/cases" },
      { label: "let's talk", title: "contact", href: "/en/contact" },
    ],
    caseCards: [
      { label: "case index", title: "cases", href: "/en/cases" },
      { label: "home", title: "home", href: "/en" },
      { label: "tooling", title: "stack", href: "/en/stack" },
    ],
  },
};

export function NotFoundPanel({ locale = "es", context = "site" }: NotFoundPanelProps) {
  const t = copy[locale];
  const cards = context === "case" ? t.caseCards : t.cards;

  return (
    <main className="not-found-screen">
      <section className="not-found-wrap">
        <p className="tech-label">{t.label}</p>
        <h1 className="not-found-code display-title">404</h1>
        <div className="not-found-console signal-panel scanline">
          <div className="not-found-console-icon">
            <SearchX size={22} aria-hidden="true" />
          </div>
          <p className="tech-label">{">_ resolver.trace"}</p>
          <div className="not-found-trace">
            <p>{t.command}</p>
            {t.trace.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <h2 className="display-title text-[clamp(1.75rem,4vw,2.6rem)] text-mint text-glow-soft">{t.title}</h2>
          <p className="not-found-body">{t.body}</p>
          <div className="not-found-actions">
            <Link className="hard-button hard-button-primary" href={cards[0].href}>
              <Home size={15} aria-hidden="true" />
              {t.home}
            </Link>
            <Link className="hard-button hard-button-secondary" href={locale === "es" ? "/contacto" : "/en/contact"}>
              {t.contact}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <nav className="not-found-links" aria-label={locale === "es" ? "Rutas sugeridas" : "Suggested routes"}>
          {cards.map((card) => (
            <Link href={card.href} key={card.href}>
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
