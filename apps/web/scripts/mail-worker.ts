import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const [{ processEmailQueue }, { sql }] = await Promise.all([import("@/lib/mail/smtp"), import("@/lib/db/client")]);

try {
  const result = await processEmailQueue(20);
  console.log(JSON.stringify(result));
} finally {
  await sql.end();
}
