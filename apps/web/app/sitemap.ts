import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const routes = ["", "/stack", "/casos", "/contacto", "/privacidad", "/terminos", "/en", "/en/stack", "/en/cases", "/en/contact", "/en/privacy", "/en/terms"];
  return routes.map((route) => ({ url: `${origin}${route}`, lastModified: new Date("2026-08-31") }));
}
