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
    nav: { home: "inicio", stack: "stack", cases: "casos", contact: "contacto", cta: "hablemos" },
    hero: {
      kicker: "// core_manifesto",
      title: "Software con criterio.",
      body: "No solo escribo código. Diseño los procesos que el código automatiza. Trabajo donde el negocio y la arquitectura se encuentran.",
      terminal: "Full-stack dev especializado en integraciones críticas, arquitecturas ERP, automatización de procesos e IA aplicada con responsabilidad técnica.",
      work: "ver trabajo",
      talk: "iniciar_conversacion()",
    },
    work: {
      eyebrow: "// trabajo_seleccionado",
      title: "proyectos_",
      body: "Casos donde el software cambió el proceso, no al revés. Los registros reales se publican desde el panel cuando tienen evidencia.",
      empty: "Sin proyectos publicados todavía. Los borradores reales quedan ocultos hasta revisión.",
      all: "todos los casos",
    },
    stack: {
      eyebrow: "// stack_ecosystem",
      title: "capas que se hablan.",
      body: "No colecciono tecnologías. Elijo herramientas que resuelven el problema y saben comunicarse entre sí.",
    },
    method: {
      eyebrow: "// metodo",
      title: "observar·modelar automatizar·sostener",
    },
    ai: {
      eyebrow: "// postura_ia",
      title: "IA con criterio, no por moda.",
      body: "Uso IA donde reemplaza reglas rígidas por juicio acotado, con auditoría, fallback humano y trazabilidad.",
    },
    contact: {
      eyebrow: "// contacto",
      title: "hablemos de tu proceso.",
      body: "Si tenés un sistema que duele, un proceso que se rompe o una integración que nadie quiere tocar, mandame un mensaje.",
      submit: "enviar_mensaje()",
    },
  },
  en: {
    nav: { home: "home", stack: "stack", cases: "cases", contact: "contact", cta: "talk" },
    hero: {
      kicker: "// core_manifesto",
      title: "Software with judgement.",
      body: "I do not just write code. I design the processes that code automates, where business and architecture meet.",
      terminal: "Full-stack developer focused on critical integrations, ERP architectures, process automation and responsible applied AI.",
      work: "see work",
      talk: "start_conversation()",
    },
    work: {
      eyebrow: "// selected_work",
      title: "projects_",
      body: "Cases where software changed the process, not the other way around. Real records are published from the panel once evidence exists.",
      empty: "No published projects yet. Real drafts stay hidden until review.",
      all: "all cases",
    },
    stack: {
      eyebrow: "// stack_ecosystem",
      title: "layers that talk.",
      body: "I do not collect technologies. I choose tools that solve the problem and communicate well.",
    },
    method: {
      eyebrow: "// method",
      title: "observe·model automate·sustain",
    },
    ai: {
      eyebrow: "// ai_stance",
      title: "AI with judgement, not hype.",
      body: "I use AI where it replaces rigid rules with bounded judgement, auditability, human fallback and traceability.",
    },
    contact: {
      eyebrow: "// contact",
      title: "let's talk about your process.",
      body: "If a system hurts, a process breaks, or an integration keeps getting avoided, send me the context.",
      submit: "send_message()",
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
  { title: "observar", enTitle: "observe", body: "Antes de escribir código, entiendo el proceso real." },
  { title: "modelar", enTitle: "model", body: "Diseño el sistema en capas y contrato los bordes." },
  { title: "automatizar", enTitle: "automate", body: "Convierto decisiones repetibles en flujos operables." },
  { title: "sostener", enTitle: "sustain", body: "Dejo logs, backups, runbooks y puntos de control." },
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
