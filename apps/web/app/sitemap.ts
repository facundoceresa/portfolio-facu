import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/features/content/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.APP_ORIGIN ?? "http://localhost:3000";
  const routes = ["", "/stack", "/casos", "/contacto", "/privacidad", "/terminos", "/en", "/en/stack", "/en/cases", "/en/contact", "/en/privacy", "/en/terms"];
  const [esCases, enCases] = await Promise.all([getPublishedCases("es"), getPublishedCases("en")]);
  const staticRoutes = routes.map((route) => ({
    url: `${origin}${route}`,
    lastModified: new Date("2026-09-05"),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
  const caseRoutes = [
    ...esCases.map((item) => ({ route: `/casos/${item.translation.slug}`, updatedAt: item.caseStudy.updatedAt })),
    ...enCases.map((item) => ({ route: `/en/cases/${item.translation.slug}`, updatedAt: item.caseStudy.updatedAt })),
  ].map((item) => ({
    url: `${origin}${item.route}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));
  return [...staticRoutes, ...caseRoutes];
}
