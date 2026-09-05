import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { getRoute, oppositeLocale } from "@/lib/i18n/routes";
import type { Locale } from "@/features/content/schemas";
import { PublicNav } from "@/components/public-nav";

type PublicShellProps = {
  locale: Locale;
  settings: Record<string, string>;
  children: ReactNode;
};

export function PublicShell({ locale, settings, children }: PublicShellProps) {
  const other = oppositeLocale(locale);
  const configuredEmail = settings.public_email?.trim();
  const publicEmail = configuredEmail && !configuredEmail.endsWith(".local") ? configuredEmail : "hola@ceresa.dev";
  return (
    <div className="min-h-dvh text-fog">
      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(13,27,42,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex h-[var(--header-height)] max-w-[1360px] items-center justify-between px-5 md:px-10">
          <Link href={getRoute(locale, "home")} className="group flex items-center gap-3" aria-label="Facundo Ceresa home">
            <span className="grid h-7 w-7 place-items-center bg-mint text-[color:var(--surface)] shadow-[4px_4px_0_rgba(115,255,184,0.22)]">
              <span className="h-3 w-3 border border-[color:var(--surface)]" />
            </span>
            <span className="hidden font-mono text-xs font-bold tracking-[0.12em] text-[color:var(--glow)] sm:inline">
              facundo.ceresa
            </span>
          </Link>
          <PublicNav locale={locale} />
          <div className="flex items-center gap-2">
            <Link
              className="hidden min-h-11 items-center px-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--glow)] md:inline-flex"
              href={getRoute(other, "home")}
              hrefLang={other}
            >
              {locale}/{other}
            </Link>
            <Link className="hard-button hard-button-primary px-3 py-2 text-[0.65rem]" href={getRoute(locale, "contact")}>
              {locale === "es" ? "hablemos" : "talk"}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t border-[color:var(--line)] bg-[rgba(10,21,33,0.72)]">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-5 py-8 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--dim)] md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span>© 2026 facundo ceresa</span>
            <span>{settings.location}</span>
            <span>todos los sistemas ok</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={getRoute(locale, "privacy")}>{locale === "es" ? "privacidad" : "privacy"}</Link>
            <Link href={getRoute(locale, "terms")}>{locale === "es" ? "terminos" : "terms"}</Link>
            <Link href="/admin">admin ↗</Link>
            <a href={`mailto:${publicEmail}`}>email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
