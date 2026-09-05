import { headers } from "next/headers";
import { env } from "@/lib/env";
import { hmacIp } from "@/lib/security/crypto";

export async function requestId() {
  const h = await headers();
  return h.get("x-request-id") ?? crypto.randomUUID();
}

export async function clientIpHash() {
  const h = await headers();
  const raw = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    return hmacIp(raw);
  } catch {
    return null;
  }
}

export async function assertOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  const allowed = new URL(env.APP_ORIGIN);
  if (origin && origin !== env.APP_ORIGIN) {
    throw new Error("Invalid origin");
  }
  if (host && host !== allowed.host && process.env.NODE_ENV === "production") {
    throw new Error("Invalid host");
  }
}

export function jsonError(code: string, status = 400) {
  return Response.json({ ok: false, code }, { status });
}
