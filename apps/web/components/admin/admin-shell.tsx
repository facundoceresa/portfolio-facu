import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/admin/logout-button";

const nav = [
  ["/admin", "dashboard"],
  ["/admin/proyectos", "proyectos"],
  ["/admin/casos", "casos"],
  ["/admin/medios", "medios"],
  ["/admin/mensajes", "mensajes"],
  ["/admin/ajustes", "ajustes"],
  ["/admin/auditoria", "auditoria"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[color:var(--background)] text-[color:var(--fog)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[color:var(--line)] bg-[rgba(10,21,33,0.88)] p-5 lg:block">
        <Link href="/admin" className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-mint">facu_admin</Link>
        <nav className="mt-10 grid gap-2">
          {nav.map(([href, label], index) => (
            <Link key={href} href={href} className="flex min-h-11 items-center justify-between border border-[color:var(--line)] px-3 font-mono text-xs uppercase tracking-[0.13em] text-[color:var(--dim)] hover:text-[color:var(--glow)]">
              <span>{label}</span>
              <span>0{index + 1}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="px-5 py-8 lg:ml-64 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="tech-label">{"// panel"}</p>
            <h1 className="font-display text-4xl font-bold uppercase text-mint">operacion</h1>
          </div>
          <LogoutButton />
        </div>
        {children}
      </main>
    </div>
  );
}
