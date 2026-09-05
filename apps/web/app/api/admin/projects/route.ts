import { db } from "@/lib/db/client";
import { projects, projectTranslations } from "@/lib/db/schema";
import { adminProjectSchema } from "@/features/content/schemas";
import { assertCsrf, audit, requireSession } from "@/features/auth/auth";
import { assertOrigin, jsonError } from "@/lib/security/request";

export async function GET() {
  const session = await requireSession();
  const rows = await db.select().from(projects).limit(200);
  await audit("list", "project", "success", undefined, undefined, session.user.id);
  return Response.json({ ok: true, rows });
}

export async function POST(request: Request) {
  try {
    await assertOrigin();
    const session = await assertCsrf();
    const parsed = adminProjectSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", 400);
    const data = parsed.data;
    const [created] = await db.transaction(async (tx) => {
      const rows = await tx.insert(projects).values({
        status: data.status,
        kind: data.kind,
        featured: data.featured,
        sortOrder: data.sortOrder,
        metricValue: data.metricValue || null,
        metricLabelKey: data.metricLabelKey || null,
        repoUrl: data.repoUrl || null,
        liveUrl: data.liveUrl || null,
        evidenceNote: data.evidenceNote || null,
        publishedAt: data.status === "published" ? new Date() : null,
      }).returning({ id: projects.id });
      await tx.insert(projectTranslations).values(data.translations.map((t) => ({ ...t, projectId: rows[0].id })));
      return rows;
    });
    await audit("create", "project", "success", created.id, { fields: Object.keys(data) }, session.user.id);
    return Response.json({ ok: true, id: created.id }, { status: 201 });
  } catch {
    return jsonError("UNAVAILABLE", 503);
  }
}
