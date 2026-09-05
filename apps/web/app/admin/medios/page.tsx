import { AdminShell } from "@/components/admin/admin-shell";
import { AdminTable } from "@/app/admin/page";
import { listAdminMedia } from "@/features/admin/content-admin";
import { requireAdminPage } from "@/lib/admin/require-admin-page";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdminPage();
  const rows = await listAdminMedia();
  return <AdminShell><section className="technical-card p-5"><h2 className="mb-4 font-display text-2xl font-bold uppercase text-mint">medios</h2><AdminTable rows={rows.map((r) => ({ id: r.id, mime: r.detectedMime, width: r.width, height: r.height, status: r.status }))} /></section></AdminShell>;
}
