import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAdminMessages } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  await requireAdminPage();
  const rows = await listAdminMessages();
  return <AdminShell><section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">mensajes</h2><AdminTable rows={rows.map((r) => ({ id: r.id, name: r.name, email: r.emailNormalized, status: r.status, scope: r.scope, createdAt: r.createdAt.toISOString() }))} /></section></AdminShell>;
}
