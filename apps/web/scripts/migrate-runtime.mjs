import { readFileSync } from "node:fs";
import postgres from "postgres";

function fromFile(name) {
  const file = process.env[`${name}_FILE`];
  return file ? readFileSync(file, "utf8").trim() : process.env[name];
}

const databaseUrl = fromFile("DATABASE_URL");
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const sql = postgres(databaseUrl, { max: 1 });
try {
  const migration = readFileSync(new URL("../drizzle/0000_initial.sql", import.meta.url), "utf8");
  await sql.unsafe(migration);
  console.log("migration applied");
} finally {
  await sql.end();
}
