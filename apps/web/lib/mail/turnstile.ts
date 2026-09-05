import { env } from "@/lib/env";

type TurnstileResult = { success: boolean; "error-codes"?: string[] };

export async function verifyTurnstile(token: string, ip?: string | null) {
  if (process.env.NODE_ENV !== "production" && token === "dev-turnstile-token") {
    return { ok: true as const, outcome: "success" as const };
  }
  if (!env.TURNSTILE_SECRET_KEY) {
    return { ok: false as const, outcome: "error" as const };
  }
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET_KEY);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  if (!response.ok) return { ok: false as const, outcome: "error" as const };
  const result = (await response.json()) as TurnstileResult;
  return result.success ? { ok: true as const, outcome: "success" as const } : { ok: false as const, outcome: "fail" as const };
}
