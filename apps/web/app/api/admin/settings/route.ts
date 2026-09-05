import { z } from "zod";
import { assertCsrf, audit, requireSession } from "@/features/auth/auth";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { defaultSettings } from "@/features/content/defaults";
import { assertOrigin, jsonError } from "@/lib/security/request";

const keys = Object.keys(defaultSettings) as [keyof typeof defaultSettings, ...Array<keyof typeof defaultSettings>];
const schema = z.object({
  key: z.enum(keys),
  value: z.string().max(500),
});

export async function GET() {
  await requireSession();
  return Response.json({ ok: true, rows: await db.select().from(siteSettings) });
}

export async function PATCH(request: Request) {
  await assertOrigin();
  const session = await assertCsrf();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return jsonError("VALIDATION_ERROR", 400);
  await db
    .insert(siteSettings)
    .values({ key: parsed.data.key, value: parsed.data.value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: parsed.data.value, updatedAt: new Date() } });
  await audit("update", "site_setting", "success", parsed.data.key, { changed: true }, session.user.id);
  return Response.json({ ok: true });
}
