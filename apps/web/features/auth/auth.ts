import argon2 from "argon2";
import { and, eq, gt, isNull, lt, or } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db/client";
import { adminSessions, adminUsers, auditLogs } from "@/lib/db/schema";
import { hmac, randomToken } from "@/lib/security/crypto";
import { clientIpHash, requestId } from "@/lib/security/request";

export const sessionCookieName = "__Host-session";
export const csrfCookieName = "__Host-csrf";

const idleMs = 30 * 60 * 1000;
const absoluteMs = 8 * 60 * 60 * 1000;

export async function hashPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;
  const tokenHash = hmac(token);
  const now = new Date();
  const rows = await db
    .select({ session: adminSessions, user: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminUsers.id, adminSessions.userId))
    .where(
      and(
        eq(adminSessions.tokenHash, tokenHash),
        isNull(adminSessions.revokedAt),
        gt(adminSessions.expiresAt, now),
        gt(adminSessions.idleExpiresAt, now),
        eq(adminUsers.status, "active"),
      ),
    )
    .limit(1);
  const found = rows[0];
  if (!found) return null;
  if (Date.now() - found.session.lastSeenAt.getTime() > 5 * 60 * 1000) {
    await db
      .update(adminSessions)
      .set({ lastSeenAt: now, idleExpiresAt: new Date(Date.now() + idleMs) })
      .where(eq(adminSessions.id, found.session.id));
  }
  return found;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createSession(userId: string) {
  const token = randomToken(32);
  const csrf = randomToken(32);
  const h = await headers();
  const ua = (h.get("user-agent") ?? "unknown").slice(0, 160);
  await db.insert(adminSessions).values({
    userId,
    tokenHash: hmac(token),
    csrfHash: hmac(csrf),
    expiresAt: new Date(Date.now() + absoluteMs),
    idleExpiresAt: new Date(Date.now() + idleMs),
    ipPrefixHash: await clientIpHash(),
    userAgentSummary: ua,
  });
  return { token, csrf };
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return;
  await db.update(adminSessions).set({ revokedAt: new Date() }).where(eq(adminSessions.tokenHash, hmac(token)));
}

export async function assertCsrf() {
  const cookieStore = await cookies();
  const h = await headers();
  const csrf = cookieStore.get(csrfCookieName)?.value;
  const csrfHeader = h.get("x-csrf-token");
  const session = await getSession();
  if (!csrf || !csrfHeader || csrf !== csrfHeader || !session || hmac(csrf) !== session.session.csrfHash) {
    throw new Error("Invalid CSRF token");
  }
  return session;
}

export async function audit(action: string, entityType: string, result: string, entityId?: string, changesRedacted?: unknown, actorUserId?: string | null) {
  await db.insert(auditLogs).values({
    actorUserId: actorUserId ?? null,
    action,
    entityType,
    entityId,
    result,
    requestId: await requestId(),
    changesRedacted,
  });
}

export async function cleanupExpiredSessions() {
  await db
    .update(adminSessions)
    .set({ revokedAt: new Date() })
    .where(or(lt(adminSessions.expiresAt, new Date()), lt(adminSessions.idleExpiresAt, new Date())));
}
