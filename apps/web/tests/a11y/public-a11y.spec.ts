import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
  expect(blocking).toEqual([]);
});
