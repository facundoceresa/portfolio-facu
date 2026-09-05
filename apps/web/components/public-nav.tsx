"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getRoute } from "@/lib/i18n/routes";
import type { Locale } from "@/features/content/schemas";

const keys = ["home", "stack", "cases", "contact"] as const;

export function PublicNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const labels = {
    es: { home: "inicio", stack: "stack", cases: "casos", contact: "contacto", open: "Abrir menú", close: "Cerrar menú", nav: "Principal", mobile: "Principal móvil" },
    en: { home: "home", stack: "stack", cases: "cases", contact: "contact", open: "Open menu", close: "Close menu", nav: "Primary", mobile: "Mobile primary" },
  };
  const label = (key: (typeof keys)[number]) => labels[locale][key];

  return (
    <>
      <nav className="hidden gap-1 md:flex" aria-label={labels[locale].nav}>
        {keys.map((key) => {
          const href = getRoute(locale, key);
          const active = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`min-h-11 px-3 py-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                active ? "text-mint" : "text-[color:var(--dim)] hover:text-[color:var(--glow)]"
              }`}
            >
              {label(key)}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center border border-[color:var(--line)] text-[color:var(--glow)] md:hidden"
        aria-label={open ? labels[locale].close : labels[locale].open}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[var(--header-height)] border-b border-[color:var(--line)] bg-[rgba(10,21,33,0.98)] px-5 py-5 md:hidden">
          <nav className="grid gap-2" aria-label={labels[locale].mobile}>
            {keys.map((key, index) => {
              const href = getRoute(locale, key);
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center justify-between border px-4 font-mono text-xs font-bold uppercase tracking-[0.16em] ${
                    active
                      ? "border-[color:var(--mint)] bg-[rgba(45,212,168,0.12)] text-mint"
                      : "border-[color:var(--line)] text-[color:var(--glow)]"
                  }`}
                >
                  <span>{label(key)}</span>
                  <span>0{index + 1}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
