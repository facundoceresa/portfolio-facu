import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAdminSettings } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdminPage();
  const rows = await listAdminSettings();
  return <AdminShell><section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">ajustes allowlisted</h2><AdminTable rows={rows.map((r) => ({ key: r.key, value: r.value, updatedAt: r.updatedAt.toISOString() }))} /></section></AdminShell>;
}
