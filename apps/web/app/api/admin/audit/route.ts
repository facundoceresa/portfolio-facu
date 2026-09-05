import { requireSession } from "@/features/auth/auth";
import { listAudit } from "@/features/admin/content-admin";

export async function GET() {
  await requireSession();
  return Response.json({ ok: true, rows: await listAudit() });
}
