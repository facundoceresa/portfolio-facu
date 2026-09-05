import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminCounts, listAudit } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdminPage();
  const [counts, audit] = await Promise.all([adminCounts(), listAudit()]);
  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(counts).map(([key, value]) => <div key={key} className="technical-card p-5"><p className="tech-label">{key}</p><strong className="mt-4 block font-display text-5xl text-mint">{value}</strong></div>)}
      </div>
      <section className="mt-8 technical-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase text-mint">actividad reciente</h2>
          <Link className="font-mono text-xs uppercase text-[color:var(--glow)]" href="/admin/auditoria">ver todo</Link>
        </div>
        <AdminTable rows={audit.slice(0, 8).map((row) => ({ accion: row.action, entidad: row.entityType, resultado: row.result, fecha: row.createdAt.toISOString() }))} />
      </section>
    </AdminShell>
  );
}

export function AdminTable({ rows }: { rows: Array<Record<string, unknown>> }) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  if (!rows.length) return <p className="text-[color:var(--muted)]">Sin registros.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse font-mono text-xs">
        <thead>
          <tr>{headers.map((header) => <th key={header} className="border border-[color:var(--line)] p-3 text-left uppercase text-mint">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{headers.map((header) => <td key={header} className="border border-[color:var(--line)] p-3 text-[color:var(--muted)]">{String(row[header] ?? "")}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
