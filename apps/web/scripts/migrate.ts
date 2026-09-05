import { readFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import postgres from "postgres";

nextEnv.loadEnvConfig(process.cwd());
const { requireEnv } = await import("@/lib/env");

const sql = postgres(requireEnv("DATABASE_URL"), { max: 1 });
const migrationPath = path.join(process.cwd(), "drizzle", "0000_initial.sql");

try {
  const migration = await readFile(migrationPath, "utf8");
  await sql.unsafe(migration);
  console.log("migration applied: drizzle/0000_initial.sql");
} finally {
  await sql.end();
}
