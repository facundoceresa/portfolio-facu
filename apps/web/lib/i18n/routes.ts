import type { Locale } from "@/features/content/schemas";

export const locales: Locale[] = ["es", "en"];

export const routeMap = {
  es: {
    home: "/",
    stack: "/stack",
    cases: "/casos",
    contact: "/contacto",
    privacy: "/privacidad",
    terms: "/terminos",
  },
  en: {
    home: "/en",
    stack: "/en/stack",
    cases: "/en/cases",
    contact: "/en/contact",
    privacy: "/en/privacy",
    terms: "/en/terms",
  },
} as const;

export function oppositeLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function getRoute(locale: Locale, key: keyof typeof routeMap.es) {
  return routeMap[locale][key];
}

export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "es";
}
