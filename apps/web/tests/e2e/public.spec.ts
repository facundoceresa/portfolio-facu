import { expect, test } from "@playwright/test";

test("public navigation and case 404 work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /FACUNDO/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /terminal de perfil/i })).toContainText("$ whoami");
  await expect(page.getByRole("link", { name: /github/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /github/i }).first()).toHaveAttribute("href", "https://github.com/facundoceresa");
  await expect(page.getByRole("link", { name: /linkedin/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /email/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /Peluqueria Agenda/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Consulta Stock General/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Calculadora Materiales Anclaflex/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sector 07 Control/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /repo/i }).first()).toHaveAttribute("href", "https://github.com/facundoceresa/peluqueria-agenda");
  await expect(page.getByRole("link", { name: /repo/i }).nth(1)).toHaveAttribute("href", "https://github.com/facundoceresa/consulta-stock-general");
  await expect(page.getByRole("link", { name: /repo/i }).nth(2)).toHaveAttribute("href", "https://github.com/facundoceresa/calculadora-materiales-anclaflex");
  await expect(page.getByRole("link", { name: /repo/i }).nth(3)).toHaveAttribute("href", "https://github.com/facundoceresa/sector07-control");
  await expect(page.getByRole("link", { name: /demo/i }).first()).toHaveAttribute("href", "https://stock.anclauruguay.com");
  await expect(page.getByRole("link", { name: /demo/i }).nth(1)).toHaveAttribute("href", "https://calculadora.anclauruguay.com");
  await expect(page.getByRole("heading", { name: /Software cerca del proceso/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /descargar cv técnico/i })).toHaveAttribute("href", "/facundo-ceresa-cv.md");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: /admin/i })).toHaveCount(0);
  await page.getByRole("link", { name: /ver caso/i }).first().click();
  await expect(page).toHaveURL(/\/casos\/peluqueria-agenda$/);
  await expect(page.getByRole("heading", { name: /Qué soluciona/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Repositorio en GitHub/i })).toHaveAttribute("href", "https://github.com/facundoceresa/peluqueria-agenda");
  await page.goto("/casos/consulta-stock-general");
  await expect(page.getByRole("heading", { name: /Consulta Stock General/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Stack técnico/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Repositorio en GitHub/i })).toHaveAttribute("href", "https://github.com/facundoceresa/consulta-stock-general");
  await page.goto("/casos/calculadora-materiales-anclaflex");
  await expect(page.getByRole("heading", { name: /Calculadora Materiales Anclaflex/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Stack técnico/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Repositorio en GitHub/i })).toHaveAttribute("href", "https://github.com/facundoceresa/calculadora-materiales-anclaflex");
  await page.goto("/casos/sector07-control");
  await expect(page.getByRole("heading", { name: /Sector 07 Control/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Stack técnico/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Repositorio en GitHub/i })).toHaveAttribute("href", "https://github.com/facundoceresa/sector07-control");
  await expect(page.getByRole("navigation", { name: /secciones/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Qué soluciona/i })).toHaveAttribute("href", "#que-soluciona");
  await expect(page.getByRole("link", { name: /abrir captura: Tablero operativo/i }).first()).toHaveAttribute("href", "/work/sector07-control/tablero-operativo-desktop.png");
  await expect(page.getByRole("link", { name: /Peluqueria Agenda/i })).toHaveAttribute("href", "/casos/peluqueria-agenda");
  await page.goto("/casos");
  await expect(page.getByRole("link", { name: /Ver caso Peluqueria Agenda/i })).toBeVisible();
  await expect(page.getByRole("img", { name: /Consulta Stock General en modo interno/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /demo/i }).first()).toHaveAttribute("href", "https://stock.anclauruguay.com");
  await page.goto("/casos/consulta-stock-general");
  await expect(page.getByRole("link", { name: /ver demo/i })).toHaveAttribute("href", "https://stock.anclauruguay.com");
  await page.goto("/contacto");
  await expect(page.getByRole("link", { name: "hola@ceresa.dev" })).toHaveAttribute("href", "mailto:hola@ceresa.dev");
  await expect(page.getByRole("link", { name: "github" })).toHaveAttribute("href", "https://github.com/facundoceresa");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "stack" }).click();
  await expect(page).toHaveURL(/\/stack$/);
  await page.goto("/casos/no-existe");
  await expect(page.getByText(/ruta no encontrada/i)).toBeVisible();
});

test("mobile navigation exposes localized active state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/cases");
  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile primary" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: /cases/i })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(mobileNav).toBeHidden();
});

test("seo routes expose case metadata and share assets", async ({ page }) => {
  await page.goto("/casos/sector07-control");
  await expect(page).toHaveTitle(/Sector 07 Control - portfolio Facundo Ceresa/);
  await expect(page.locator("meta[property='og:title']")).toHaveAttribute("content", "Sector 07 Control - portfolio Facundo Ceresa");
  await expect(page.locator("meta[name='twitter:card']")).toHaveAttribute("content", "summary_large_image");

  const sitemap = await page.request.get("/sitemap.xml");
  await expect(sitemap).toBeOK();
  const xml = await sitemap.text();
  expect(xml).toContain("/casos/sector07-control");
  expect(xml).toContain("/en/cases/sector07-control");

  const og = await page.request.get("/opengraph-image");
  await expect(og).toBeOK();
  expect(og.headers()["content-type"]).toContain("image/png");
});
