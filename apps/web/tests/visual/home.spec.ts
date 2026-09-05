import { expect, test } from "@playwright/test";

for (const viewport of [
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [360, 800],
] as const) {
  test(`home visual smoke ${viewport[0]}x${viewport[1]}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport[0], height: viewport[1] });
    await page.goto("/");
    await expect(await page.screenshot({ animations: "disabled", fullPage: true })).toMatchSnapshot(`home-${viewport[0]}x${viewport[1]}.png`, {
      maxDiffPixelRatio: 0.05,
    });
  });
}
