import { NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { contactMessages, emailDeliveries } from "@/lib/db/schema";
import { contactSchema } from "@/features/contact/schemas";
import { assertOrigin, clientIpHash, jsonError } from "@/lib/security/request";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { hmac } from "@/lib/security/crypto";
import { verifyTurnstile } from "@/lib/mail/turnstile";
import { processEmailQueue } from "@/lib/mail/smtp";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await assertOrigin();
    const ipHash = (await clientIpHash()) ?? "unknown";
    const limited = await checkRateLimit("contact", ipHash, 4, 60 * 60 * 1000);
    if (!limited.allowed) return jsonError("RATE_LIMITED", 429);
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("VALIDATION_ERROR", 400);
    const data = parsed.data;
    if (Date.now() - data.startedAt < 3000 || data.honeypot) return jsonError("VALIDATION_ERROR", 400);
    const turnstile = await verifyTurnstile(data.turnstileToken);
    if (!turnstile.ok) return jsonError("VALIDATION_ERROR", 400);
    const idempotencyHash = hmac(`${data.idempotencyKey}:${data.email}:${data.message.slice(0, 80)}`);
    const retentionUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 730);
    await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(contactMessages)
        .values({
          idempotencyHash,
          name: data.name,
          emailNormalized: data.email,
          companyRole: data.companyRole || null,
          scope: data.scope,
          budget: data.budget,
          message: data.message,
          locale: data.locale,
          consentAt: new Date(),
          turnstileOutcome: turnstile.outcome,
          sourceIpHash: ipHash,
          retentionUntil,
        })
        .onConflictDoNothing({ target: contactMessages.idempotencyHash })
        .returning({ id: contactMessages.id });
      if (inserted[0]) {
        await tx.insert(emailDeliveries).values({ contactMessageId: inserted[0].id });
      }
    });
    processEmailQueue(1).catch(() => logger.warn({ event: "smtp_background_failed" }, "Background SMTP processing failed"));
    return Response.json({ ok: true, message: data.locale === "es" ? "Mensaje recibido" : "Message received" });
  } catch {
    return jsonError("UNAVAILABLE", 503);
  }
}
