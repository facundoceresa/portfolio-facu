import { eq } from "drizzle-orm";
import { assertCsrf, audit } from "@/features/auth/auth";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { assertOrigin } from "@/lib/security/request";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await assertOrigin();
  const session = await assertCsrf();
  const { id } = await params;
  await db.update(mediaAssets).set({ status: "trashed", deletedAt: new Date(), updatedAt: new Date() }).where(eq(mediaAssets.id, id));
  await audit("trash", "media_asset", "success", id, { soft: true }, session.user.id);
  return Response.json({ ok: true });
}
