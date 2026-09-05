import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { audit, createSession, csrfCookieName, sessionCookieName, verifyPassword } from "@/features/auth/auth";
import { assertOrigin, clientIpHash, jsonError } from "@/lib/security/request";
import { checkRateLimit } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  email: z.string().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(512),
});

export async function POST(request: NextRequest) {
  try {
    await assertOrigin();
    const ipHash = (await clientIpHash()) ?? "unknown";
    const limited = await checkRateLimit("admin-login", ipHash, 5, 15 * 60 * 1000);
    if (!limited.allowed) return jsonError("RATE_LIMITED", 429);
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("INVALID_CREDENTIALS", 401);
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, parsed.data.email)).limit(1);
    if (!user || user.status !== "active" || (user.lockedUntil && user.lockedUntil > new Date())) {
      await audit("login", "admin_user", "failed");
      return jsonError("INVALID_CREDENTIALS", 401);
    }
    const ok = await verifyPassword(user.passwordHash, parsed.data.password);
    if (!ok) {
      await db.update(adminUsers).set({ failedLoginCount: user.failedLoginCount + 1 }).where(eq(adminUsers.id, user.id));
      await audit("login", "admin_user", "failed", user.id);
      return jsonError("INVALID_CREDENTIALS", 401);
    }
    await db.update(adminUsers).set({ failedLoginCount: 0, lockedUntil: null }).where(eq(adminUsers.id, user.id));
    const session = await createSession(user.id);
    await audit("login", "admin_user", "success", user.id, undefined, user.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieName, session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    response.cookies.set(csrfCookieName, session.csrf, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch {
    return jsonError("UNAVAILABLE", 503);
  }
}
