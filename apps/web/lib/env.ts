import { z } from "zod";
import { existsSync, readFileSync } from "node:fs";

function fromFile(name: string) {
  const file = process.env[`${name}_FILE`];
  if (file && existsSync(file)) return readFileSync(file, "utf8").trim();
  return process.env[name];
}

const rawEnv = {
  ...process.env,
  DATABASE_URL: fromFile("DATABASE_URL"),
  SESSION_SECRET: fromFile("SESSION_SECRET"),
  CSRF_SECRET: fromFile("CSRF_SECRET"),
  IP_HASH_SECRET: fromFile("IP_HASH_SECRET"),
  TURNSTILE_SECRET_KEY: fromFile("TURNSTILE_SECRET_KEY"),
  SMTP_PASSWORD: fromFile("SMTP_PASSWORD"),
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  APP_ORIGIN: z.string().url().default("http://localhost:3000"),
  SESSION_SECRET: z.string().min(32).optional(),
  CSRF_SECRET: z.string().min(32).optional(),
  IP_HASH_SECRET: z.string().min(32).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  CONTACT_TO: z.string().email().optional(),
  MEDIA_ROOT: z.string().default("./storage/media"),
});

export const env = envSchema.parse(rawEnv);

export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }
  return value as NonNullable<(typeof env)[K]>;
}
