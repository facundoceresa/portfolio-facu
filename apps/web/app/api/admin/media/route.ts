import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { assertCsrf, audit, requireSession } from "@/features/auth/auth";
import { assertOrigin } from "@/lib/security/request";
import { processImage } from "@/lib/media/validate";

export async function GET() {
  const session = await requireSession();
  const rows = await db.select().from(mediaAssets).limit(200);
  await audit("list", "media_asset", "success", undefined, undefined, session.user.id);
  return Response.json({ ok: true, rows });
}

export async function POST(request: Request) {
  await assertOrigin();
  const session = await assertCsrf();
  const form = await request.formData();
  const file = form.get("file");
  const altEs = String(form.get("altEs") ?? "");
  const altEn = String(form.get("altEn") ?? "");
  if (!(file instanceof File) || altEs.length < 2 || altEn.length < 2) {
    return Response.json({ ok: false, code: "VALIDATION_ERROR" }, { status: 400 });
  }
  const processed = await processImage(file);
  const [row] = await db.insert(mediaAssets).values({ ...processed, altEs, altEn, uploadedBy: session.user.id }).returning({ id: mediaAssets.id });
  await audit("upload", "media_asset", "success", row.id, { sizeBytes: processed.sizeBytes }, session.user.id);
  return Response.json({ ok: true, id: row.id }, { status: 201 });
}
