import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import { assertCsrf, audit } from "@/features/auth/auth";
import { assertOrigin, jsonError } from "@/lib/security/request";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await assertOrigin();
  const session = await assertCsrf();
  const { id } = await params;
  const body = await request.json();
  const status = ["draft", "review", "published", "archived"].includes(body.status) ? body.status : undefined;
  if (!status) return jsonError("VALIDATION_ERROR", 400);
  await db.update(projects).set({ status, publishedAt: status === "published" ? new Date() : null, updatedAt: new Date() }).where(eq(projects.id, id));
  await audit("update", "project", "success", id, { status }, session.user.id);
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await assertOrigin();
  const session = await assertCsrf();
  const { id } = await params;
  await db.update(projects).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(projects.id, id));
  await audit("delete", "project", "success", id, { soft: true }, session.user.id);
  return Response.json({ ok: true });
}
