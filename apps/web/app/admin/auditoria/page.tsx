import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAudit } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  await requireAdminPage();
  const rows = await listAudit();
  return <AdminShell><section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">auditoria</h2><AdminTable rows={rows.map((r) => ({ action: r.action, entity: r.entityType, result: r.result, createdAt: r.createdAt.toISOString() }))} /></section></AdminShell>;
}
