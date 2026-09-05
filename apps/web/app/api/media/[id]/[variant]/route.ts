import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { env } from "@/lib/env";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; variant: string }> }) {
  const { id, variant } = await params;
  if (variant !== "webp") return Response.json({ ok: false }, { status: 404 });
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(and(eq(mediaAssets.id, id), eq(mediaAssets.status, "ready"), isNull(mediaAssets.deletedAt)))
    .limit(1);
  if (!asset) return Response.json({ ok: false }, { status: 404 });
  const file = await readFile(path.resolve(env.MEDIA_ROOT, "safe", asset.storageKey));
  return new Response(file, {
    headers: {
      "content-type": "image/webp",
      "x-content-type-options": "nosniff",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
