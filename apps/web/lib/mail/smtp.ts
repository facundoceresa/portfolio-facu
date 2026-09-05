import nodemailer from "nodemailer";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { contactMessages, emailDeliveries } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

function configured() {
  return Boolean(env.SMTP_HOST && env.SMTP_FROM && env.CONTACT_TO);
}

export async function processEmailQueue(limit = 5) {
  if (!configured()) {
    logger.warn({ event: "smtp_not_configured" }, "SMTP not configured");
    return { sent: 0, failed: 0 };
  }
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER && env.SMTP_PASSWORD ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
  });
  const rows = await db
    .select({ delivery: emailDeliveries, message: contactMessages })
    .from(emailDeliveries)
    .innerJoin(contactMessages, eq(contactMessages.id, emailDeliveries.contactMessageId))
    .where(and(eq(emailDeliveries.status, "pending"), lte(emailDeliveries.nextAttemptAt, new Date())))
    .limit(limit);
  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.CONTACT_TO,
        subject: `Nuevo contacto portfolio ${row.message.id}`,
        text: [
          `ID: ${row.message.id}`,
          `Nombre: ${row.message.name}`,
          `Email: ${row.message.emailNormalized}`,
          `Empresa/rol: ${row.message.companyRole ?? "-"}`,
          `Alcance: ${row.message.scope}`,
          `Presupuesto: ${row.message.budget}`,
          "",
          row.message.message,
        ].join("\n"),
      });
      await db.update(emailDeliveries).set({ status: "sent", sentAt: new Date(), updatedAt: new Date() }).where(eq(emailDeliveries.id, row.delivery.id));
      sent += 1;
    } catch (error) {
      const attempts = row.delivery.attemptCount + 1;
      await db
        .update(emailDeliveries)
        .set({
          status: attempts >= 5 ? "dead" : "pending",
          attemptCount: attempts,
          nextAttemptAt: new Date(Date.now() + Math.min(60, attempts * attempts) * 60 * 1000),
          lastErrorCode: error instanceof Error ? error.name : "SMTP_ERROR",
          updatedAt: new Date(),
        })
        .where(eq(emailDeliveries.id, row.delivery.id));
      logger.warn({ event: "smtp_failed", deliveryId: row.delivery.id }, "SMTP delivery failed");
      failed += 1;
    }
  }
  return { sent, failed };
}
