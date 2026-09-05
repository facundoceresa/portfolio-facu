import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const referenceUrl = "https://core-composition.lovable.app/";
const outDir = path.join(root, "docs", "design-references", "core-composition");
const researchDir = path.join(root, "docs", "research");
const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
];

const routes = ["/", "/stack", "/casos", "/contacto", "/privacidad", "/terminos", "/admin"];

async function extractPage(page) {
  return page.evaluate(() => {
    const props = [
      "fontSize",
      "fontWeight",
      "fontFamily",
      "lineHeight",
      "letterSpacing",
      "color",
      "backgroundColor",
      "backgroundImage",
      "padding",
      "margin",
      "display",
      "gridTemplateColumns",
      "gap",
      "border",
      "borderRadius",
      "boxShadow",
      "position",
      "top",
      "zIndex",
      "opacity",
      "transform",
      "transition",
      "backdropFilter",
    ];
    const pickStyles = (el) => {
      const cs = getComputedStyle(el);
      return Object.fromEntries(
        props
          .map((prop) => [prop, cs[prop]])
          .filter(([, value]) => value && value !== "none" && value !== "normal" && value !== "0px" && value !== "rgba(0, 0, 0, 0)")
      );
    };
    const elements = [...document.querySelectorAll("header, main > *, footer, section, article, form, nav")];
    const colors = new Map();
    const fonts = new Map();
    for (const el of [...document.querySelectorAll("*")].slice(0, 700)) {
      const cs = getComputedStyle(el);
      [cs.color, cs.backgroundColor, cs.borderColor].forEach((value) => {
        if (value && value !== "rgba(0, 0, 0, 0)") colors.set(value, (colors.get(value) || 0) + 1);
      });
      if (cs.fontFamily) fonts.set(cs.fontFamily, (fonts.get(cs.fontFamily) || 0) + 1);
    }
    return {
      url: location.href,
      title: document.title,
      lang: document.documentElement.lang,
      height: document.documentElement.scrollHeight,
      body: pickStyles(document.body),
      header: document.querySelector("header") ? pickStyles(document.querySelector("header")) : null,
      sections: elements.map((el, index) => ({
        index,
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: String(el.className || "").slice(0, 220),
        text: el.textContent?.replace(/\s+/g, " ").trim().slice(0, 900),
        rect: el.getBoundingClientRect().toJSON(),
        styles: pickStyles(el),
      })),
      links: [...document.querySelectorAll("a")].map((a) => ({
        text: a.textContent?.replace(/\s+/g, " ").trim(),
        href: a.href,
        target: a.target,
      })),
      buttons: [...document.querySelectorAll("button")].map((button) => ({
        text: button.textContent?.replace(/\s+/g, " ").trim(),
        type: button.type,
        styles: pickStyles(button),
      })),
      forms: [...document.querySelectorAll("form")].map((form) => ({
        action: form.action,
        method: form.method,
        fields: [...form.querySelectorAll("input,textarea,select")].map((field) => ({
          tag: field.tagName.toLowerCase(),
          name: field.getAttribute("name"),
          type: field.getAttribute("type"),
          placeholder: field.getAttribute("placeholder"),
          required: field.hasAttribute("required"),
        })),
      })),
      assets: {
        images: [...document.querySelectorAll("img")].map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })),
        backgrounds: [...document.querySelectorAll("*")]
          .map((el) => ({ bg: getComputedStyle(el).backgroundImage, className: String(el.className || "").slice(0, 120) }))
          .filter((item) => item.bg && item.bg !== "none"),
        svgCount: document.querySelectorAll("svg").length,
        favicons: [...document.querySelectorAll('link[rel*="icon"]')].map((link) => link.href),
      },
      colors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40),
      fonts: [...fonts.entries()].sort((a, b) => b[1] - a[1]),
    };
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(researchDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const report = {
    referenceUrl,
    generatedAt: new Date().toISOString(),
    toolNote: "chrome-devtools MCP target closed; Playwright local automation used for clone-website browser sweep.",
    routes: {},
    viewportScreenshots: [],
  };

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(referenceUrl, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outDir, `home-${viewport.name}.png`), fullPage: true });
    report.viewportScreenshots.push(`docs/design-references/core-composition/home-${viewport.name}.png`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of routes) {
    const url = new URL(route, referenceUrl).toString();
    await page.goto(url, { waitUntil: "networkidle" });
    report.routes[route] = await extractPage(page);
    await page.screenshot({ path: path.join(outDir, `route-${route === "/" ? "home" : route.replaceAll("/", "_")}-1440x900.png`), fullPage: true });
  }

  await page.goto(referenceUrl, { waitUntil: "networkidle" });
  const behaviorSamples = [];
  for (const y of [0, 120, 600, 1200, 2400, 4200, 6400]) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(250);
    behaviorSamples.push({
      scrollY: y,
      header: await page.evaluate(() => {
        const header = document.querySelector("header");
        if (!header) return null;
        const cs = getComputedStyle(header);
        return {
          rect: header.getBoundingClientRect().toJSON(),
          backgroundColor: cs.backgroundColor,
          backdropFilter: cs.backdropFilter,
          borderBottom: cs.borderBottom,
          boxShadow: cs.boxShadow,
          transform: cs.transform,
          transition: cs.transition,
        };
      }),
    });
  }
  report.behaviorSamples = behaviorSamples;

  await writeFile(path.join(researchDir, "reference-extraction.json"), JSON.stringify(report, null, 2));
  await writeFile(
    path.join(researchDir, "BEHAVIORS.md"),
    [
      "# Reference Behaviors",
      "",
      `Source: ${referenceUrl}`,
      "",
      "Browser automation: Playwright local. `chrome-devtools` MCP was detected but returned `Target closed`.",
      "",
      "## Scroll Samples",
      "",
      ...behaviorSamples.map((sample) => `- y=${sample.scrollY}: header=${JSON.stringify(sample.header)}`),
      "",
      "## Required follow-up",
      "",
      "- Re-run visual comparison against implementation at all six specified viewports.",
      "- Mask cursor/flicker animations before enforcing the 5% global threshold.",
      "- Validate hover/click states after implementation with Playwright E2E.",
    ].join("\n")
  );
  await writeFile(
    path.join(researchDir, "PAGE_TOPOLOGY.md"),
    [
      "# Reference Page Topology",
      "",
      `Source: ${referenceUrl}`,
      "",
      "The live extraction is stored in `docs/research/reference-extraction.json`.",
      "",
      "## Public Routes Observed",
      "",
      ...routes.map((route) => `- \`${route}\``),
      "",
      "## Home Sections",
      "",
      ...(report.routes["/"]?.sections || []).map((section) => `- ${section.index}: ${section.tag} ${section.id ? `#${section.id}` : ""} ${section.text ? `- ${section.text.slice(0, 180)}` : ""}`),
    ].join("\n")
  );
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
