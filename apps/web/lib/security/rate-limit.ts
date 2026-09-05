import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";
import { hmac } from "@/lib/security/crypto";

export async function checkRateLimit(bucket: string, identity: string, limit: number, windowMs: number) {
  const key = `${bucket}:${hmac(identity)}`;
  const now = new Date();
  const existing = await db.select().from(rateLimits).where(eq(rateLimits.key, key)).limit(1);
  const row = existing[0];
  if (!row || row.resetAt <= now) {
    await db
      .insert(rateLimits)
      .values({ key, bucket, count: 1, resetAt: new Date(Date.now() + windowMs) })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: { count: 1, resetAt: new Date(Date.now() + windowMs), updatedAt: now },
      });
    return { allowed: true, remaining: limit - 1 };
  }
  if (row.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: row.resetAt };
  }
  await db.update(rateLimits).set({ count: row.count + 1, updatedAt: now }).where(eq(rateLimits.key, key));
  return { allowed: true, remaining: limit - row.count - 1 };
}
