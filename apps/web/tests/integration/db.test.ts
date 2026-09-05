import { describe, expect, test } from "vitest";

describe("database integration", () => {
  test("connects to postgres and has migrated portfolio tables", async () => {
    const nextEnv = await import("@next/env");
    nextEnv.default.loadEnvConfig(process.cwd());
    const { sql } = await import("@/lib/db/client");

    const [{ ok }] = await sql<{ ok: number }[]>`select 1 as ok`;
    expect(ok).toBe(1);

    await expect(sql`select count(*)::int from project`).resolves.toBeTruthy();
    await expect(sql`select count(*)::int from contact_message`).resolves.toBeTruthy();
  });
});
