import { db } from "@/lib/db/client";
import { caseStudies, caseTranslations } from "@/lib/db/schema";
import { adminCaseSchema } from "@/features/content/schemas";
import { assertCsrf, audit, requireSession } from "@/features/auth/auth";
import { assertOrigin, jsonError } from "@/lib/security/request";

export async function GET() {
  const session = await requireSession();
  const rows = await db.select().from(caseStudies).limit(200);
  await audit("list", "case_study", "success", undefined, undefined, session.user.id);
  return Response.json({ ok: true, rows });
}

export async function POST(request: Request) {
  try {
    await assertOrigin();
    const session = await assertCsrf();
    const parsed = adminCaseSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", 400);
    const data = parsed.data;
    const [created] = await db.transaction(async (tx) => {
      const rows = await tx.insert(caseStudies).values({
        status: data.status,
        sortOrder: data.sortOrder,
        readTimeMinutes: data.readTimeMinutes,
        resultValue: data.resultValue || null,
        resultVerified: data.resultVerified,
        publishedAt: data.status === "published" ? new Date() : null,
      }).returning({ id: caseStudies.id });
      await tx.insert(caseTranslations).values(data.translations.map((t) => ({ ...t, caseId: rows[0].id })));
      return rows;
    });
    await audit("create", "case_study", "success", created.id, { fields: Object.keys(data) }, session.user.id);
    return Response.json({ ok: true, id: created.id }, { status: 201 });
  } catch {
    return jsonError("UNAVAILABLE", 503);
  }
}
