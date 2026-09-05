import { NextResponse } from "next/server";
import { assertCsrf, audit, csrfCookieName, revokeCurrentSession, sessionCookieName } from "@/features/auth/auth";
import { assertOrigin } from "@/lib/security/request";

export async function POST() {
  await assertOrigin();
  const session = await assertCsrf();
  await revokeCurrentSession();
  await audit("logout", "admin_session", "success", undefined, undefined, session.user.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(sessionCookieName);
  response.cookies.delete(csrfCookieName);
  return response;
}
