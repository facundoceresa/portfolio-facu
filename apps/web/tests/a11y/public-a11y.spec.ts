import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/", "/casos", "/casos/sector07-control", "/contacto"] as const) {
  test(`${route} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    const blocking = result.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
    expect(blocking).toEqual([]);
  });
}
