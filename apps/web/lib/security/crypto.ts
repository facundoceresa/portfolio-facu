import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env, requireEnv } from "@/lib/env";

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmac(value: string, secret = env.SESSION_SECRET ?? "development-session-secret-with-32-bytes-minimum") {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function hmacIp(value: string) {
  return createHmac("sha256", requireEnv("IP_HASH_SECRET")).update(value).digest("hex");
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
