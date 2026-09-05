import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

const globalForDb = globalThis as unknown as {
  sql?: postgres.Sql;
};

export const sql =
  globalForDb.sql ??
  postgres(env.DATABASE_URL ?? "postgres://portfolio:portfolio_dev_password@localhost:5432/portfolio", {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db = drizzle(sql, { schema });
