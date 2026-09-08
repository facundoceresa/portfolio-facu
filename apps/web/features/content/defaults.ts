import type { ContentBlock, Locale } from "@/features/content/schemas";

export const defaultSettings = {
  public_email: "contacto@pendiente.local",
  github_url: "",
  linkedin_url: "",
  location: "Montevideo · Uruguay",
  availability_es: "Disponible para oportunidades técnicas relevantes",
  availability_en: "Available for relevant technical opportunities",
  admin_footer_link: "false",
};

export const copy = {
  es: {
    nav: { home: "inicio", stack: "stack", cases: "casos", contact: "contacto", cta: "contactar" },
    hero: {
      kicker: "perfil técnico",
      title: "Software operativo.",
      body: "Construyo herramientas donde operación, datos e integración tienen que convivir sin romper el trabajo diario.",
      terminal: "Full-stack dev enfocado en integraciones ERP, automatización, sistemas internos e IA aplicada con trazabilidad.",
      work: "ver trabajo",
      talk: "contactar",
    },
    work: {
      eyebrow: "trabajo seleccionado",
      title: "proyectos con evidencia",
      body: "Casos publicados con capturas, métricas y contexto técnico suficiente para entender qué problema resolvió cada sistema.",
      empty: "Sin proyectos publicados todavía. Los borradores reales quedan ocultos hasta revisión.",
      all: "todos los casos",
    },
    stack: {
      eyebrow: "stack técnico",
      title: "capas que se conectan",
      body: "Herramientas elegidas por interoperabilidad, mantenibilidad y claridad operativa.",
    },
    method: {
      eyebrow: "método",
      title: "entender, modelar, automatizar, sostener",
    },
    ai: {
      eyebrow: "IA aplicada",
      title: "automatización con límites claros",
      body: "Uso IA cuando aporta decisión acotada, auditoría y fallback humano. Si no mejora el proceso real, no entra al sistema.",
    },
    contact: {
      eyebrow: "contacto",
      title: "contame qué sistema querés mover",
      body: "Un mensaje breve con objetivo, contexto y restricciones alcanza para evaluar el siguiente paso.",
      submit: "enviar mensaje",
    },
  },
  en: {
    nav: { home: "home", stack: "stack", cases: "cases", contact: "contact", cta: "talk" },
    hero: {
      kicker: "technical profile",
      title: "Operational software.",
      body: "I build tools where operations, data and integration need to coexist without breaking daily work.",
      terminal: "Full-stack developer focused on ERP integrations, automation, internal systems and traceable applied AI.",
      work: "see work",
      talk: "contact",
    },
    work: {
      eyebrow: "selected work",
      title: "evidence-led projects",
      body: "Published cases with screenshots, metrics and enough technical context to understand which problem each system solved.",
      empty: "No published projects yet. Real drafts stay hidden until review.",
      all: "all cases",
    },
    stack: {
      eyebrow: "technical stack",
      title: "connected layers",
      body: "Tools selected for interoperability, maintainability and operational clarity.",
    },
    method: {
      eyebrow: "method",
      title: "understand, model, automate, sustain",
    },
    ai: {
      eyebrow: "applied AI",
      title: "automation with clear boundaries",
      body: "I use AI when it brings bounded decisions, auditability and human fallback. If it does not improve the real process, it does not enter the system.",
    },
    contact: {
      eyebrow: "contact",
      title: "tell me which system needs to move",
      body: "A short message with goals, context and constraints is enough to evaluate the next step.",
      submit: "send message",
    },
  },
} satisfies Record<Locale, unknown>;

export const stackLayers = [
  { key: "frontend", title: "frontend", tools: ["react", "next", "typescript", "a11y"] },
  { key: "backend", title: "backend", tools: ["node", "drizzle", "postgres", "queues"] },
  { key: "data", title: "data & ia", tools: ["sql", "etl", "llm ops", "audit"] },
  { key: "infra", title: "infra", tools: ["docker", "cloudflare", "ci/cd", "linux"] },
];

export const methodSteps = [
  {
    title: "relevar",
    enTitle: "map",
    body: "Primero identifico actores, datos, excepciones y puntos donde el proceso falla.",
    enBody: "I first map actors, data, exceptions and the points where the process fails.",
  },
  {
    title: "diseñar",
    enTitle: "design",
    body: "Defino límites, contratos y flujos antes de convertirlos en pantallas o jobs.",
    enBody: "I define boundaries, contracts and flows before turning them into screens or jobs.",
  },
  {
    title: "construir",
    enTitle: "build",
    body: "Implemento lo mínimo publicable con trazabilidad, permisos y validaciones reales.",
    enBody: "I ship the smallest useful version with traceability, permissions and real validation.",
  },
  {
    title: "operar",
    enTitle: "operate",
    body: "Dejo logs, backups, runbooks y puntos de control para sostener el sistema.",
    enBody: "I leave logs, backups, runbooks and checkpoints so the system can be operated.",
  },
];

export const draftProjectCandidates = [
  "FOG/iPXE/Sysprep para imagen corporativa",
  "Automatizaciones PowerShell, BitLocker, OCS y AD",
  "Consulta de stock y calculadora de materiales conectadas a ERP",
  "Integraciones/middleware de pedidos y facturación con SQL Server",
  "N8N autohospedado con Docker y Cloudflare",
  "OCS/Zabbix para inventario y monitoreo",
];

export const legalBlocks = (locale: Locale): ContentBlock[] => [
  {
    type: "paragraph",
    markdown:
      locale === "es"
        ? "Este documento describe el tratamiento real de datos del portfolio: mensajes de contacto, controles antispam, logs técnicos mínimos y cookies estrictamente necesarias."
        : "This document describes the portfolio's actual data processing: contact messages, anti-spam controls, minimal technical logs and strictly necessary cookies.",
  },
];
