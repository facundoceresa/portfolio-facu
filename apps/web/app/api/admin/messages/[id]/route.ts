import { eq } from "drizzle-orm";
import { z } from "zod";
import { assertCsrf, audit } from "@/features/auth/auth";
import { db } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";
import { assertOrigin, jsonError } from "@/lib/security/request";

const schema = z.object({ status: z.enum(["new", "read", "replied", "archived", "spam"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await assertOrigin();
  const session = await assertCsrf();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("VALIDATION_ERROR", 400);
  const { id } = await params;
  await db.update(contactMessages).set({ status: parsed.data.status, updatedAt: new Date() }).where(eq(contactMessages.id, id));
  await audit("update_status", "contact_message", "success", id, { status: parsed.data.status }, session.user.id);
  return Response.json({ ok: true });
}
