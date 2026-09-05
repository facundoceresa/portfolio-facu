import { requireSession } from "@/features/auth/auth";
import { db } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";

export async function GET() {
  await requireSession();
  const rows = await db.select().from(contactMessages).limit(200);
  return Response.json({ ok: true, rows });
}
