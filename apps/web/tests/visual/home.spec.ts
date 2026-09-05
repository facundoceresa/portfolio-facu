import { expect, test } from "@playwright/test";

const visualPages = [
  {
    name: "home",
    path: "/",
    viewports: [
      [1440, 900],
      [1366, 768],
      [1024, 768],
      [768, 1024],
      [390, 844],
      [360, 800],
    ],
  },
  {
    name: "cases",
    path: "/casos",
    viewports: [
      [1440, 900],
      [390, 844],
    ],
  },
  {
    name: "case-sector07",
    path: "/casos/sector07-control",
    viewports: [
      [1440, 900],
      [390, 844],
    ],
  },
] as const;

for (const visualPage of visualPages) {
  for (const viewport of visualPage.viewports) {
    test(`${visualPage.name} visual smoke ${viewport[0]}x${viewport[1]}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport[0], height: viewport[1] });
      await page.goto(visualPage.path);
      await expect(await page.screenshot({ animations: "disabled", fullPage: true })).toMatchSnapshot(`${visualPage.name}-${viewport[0]}x${viewport[1]}.png`, {
        maxDiffPixelRatio: 0.08,
      });
    });
  }
}
