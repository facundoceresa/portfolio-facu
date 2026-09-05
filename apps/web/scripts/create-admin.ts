import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { eq } from "drizzle-orm";

nextEnv.loadEnvConfig(process.cwd());
const [{ db, sql }, { adminUsers, siteSettings }, { hashPassword }, { defaultSettings }] = await Promise.all([
  import("@/lib/db/client"),
  import("@/lib/db/schema"),
  import("@/features/auth/auth"),
  import("@/features/content/defaults"),
]);

async function readPassword() {
  if (process.env.ADMIN_PASSWORD_FILE) {
    return (await readFile(process.env.ADMIN_PASSWORD_FILE, "utf8")).trim();
  }
  const rl = createInterface({ input, output });
  const password = await rl.question("Admin password (16+ chars): ");
  rl.close();
  return password.trim();
}

try {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (!email) throw new Error("Set ADMIN_EMAIL");
  const password = await readPassword();
  if (password.length < 16) throw new Error("Password must be at least 16 characters");
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existing.length) throw new Error("Admin already exists");
  await db.insert(adminUsers).values({ email, displayName: "Facundo Ceresa", passwordHash: await hashPassword(password) });
  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.insert(siteSettings).values({ key, value }).onConflictDoNothing();
  }
  console.log("admin created");
} finally {
  await sql.end();
}
