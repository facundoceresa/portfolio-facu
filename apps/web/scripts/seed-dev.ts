import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const [
  { db, sql: client },
  { caseStudies, caseTranslations, projects, projectTranslations, siteSettings },
  { defaultSettings, draftProjectCandidates },
  { and, eq, sql },
] = await Promise.all([import("@/lib/db/client"), import("@/lib/db/schema"), import("@/features/content/defaults"), import("drizzle-orm")]);

const peluqueriaProjectId = "11111111-1111-4111-8111-111111111111";
const peluqueriaCaseId = "22222222-2222-4222-8222-222222222222";
const peluqueriaPublishedAt = new Date("2026-09-03T12:00:00.000Z");
const peluqueriaRepoUrl = "https://github.com/facundoceresa/peluqueria-agenda";
const peluqueriaShots = [
  {
    src: "/work/peluqueria-agenda/panel-dashboard.png",
    alt: "Dashboard privado de peluqueria-agenda con agenda, metricas y gestion operativa del salon",
    width: 1440,
    height: 1324,
  },
  {
    src: "/work/peluqueria-agenda/booking-publico.png",
    alt: "Booking publico responsive de peluqueria-agenda para elegir servicio, profesional y horario",
    width: 1440,
    height: 3637,
  },
  {
    src: "/work/peluqueria-agenda/landing-ramonas.png",
    alt: "Landing publica RAMONAS conectada al flujo de reserva online",
    width: 1440,
    height: 8106,
  },
];
const peluqueriaStack = ["next.js", "nestjs", "typescript", "prisma", "postgres", "redis", "docker", "cloudflare"];

const consultaStockProjectId = "44444444-4444-4444-8444-444444444444";
const consultaStockCaseId = "55555555-5555-4555-8555-555555555555";
const consultaStockPublishedAt = new Date("2026-09-04T12:00:00.000Z");
const consultaStockRepoUrl = "https://github.com/facundoceresa/consulta-stock-general";
const consultaStockLiveUrl = "https://stock.anclauruguay.com";
const consultaStockShots = [
  {
    src: "/work/consulta-stock-general/internal-desktop.png",
    alt: "Consulta Stock General en modo interno de escritorio con busqueda por producto o familia",
    width: 1440,
    height: 900,
  },
  {
    src: "/work/consulta-stock-general/external-login-mobile.png",
    alt: "Acceso mobile autenticado de Consulta Stock General para consultar stock en vivo",
    width: 390,
    height: 844,
  },
  {
    src: "/work/consulta-stock-general/external-login-desktop.png",
    alt: "Pantalla de acceso externo de Consulta Stock General en escritorio",
    width: 1440,
    height: 900,
  },
];
const consultaStockStack = ["next.js", "nestjs", "typescript", "postgres", "sql server", "mssql", "docker", "cloudflare"];

const calculadoraProjectId = "66666666-6666-4666-8666-666666666666";
const calculadoraCaseId = "77777777-7777-4777-8777-777777777777";
const calculadoraPublishedAt = new Date("2026-09-04T13:00:00.000Z");
const calculadoraRepoUrl = "https://github.com/facundoceresa/calculadora-materiales-anclaflex";
const calculadoraLiveUrl = "https://calculadora.anclauruguay.com";
const calculadoraShots = [
  {
    src: "/work/calculadora-materiales-anclaflex/calculadora-publica-desktop.png",
    alt: "Calculadora publica Anclaflex para ingresar metros cuadrados y seleccionar productos o sistemas",
    width: 1440,
    height: 1100,
  },
  {
    src: "/work/calculadora-materiales-anclaflex/resultado-calculo-desktop.png",
    alt: "Resultado de calculo Anclaflex con desglose por mano, envases, costos y descarga PDF",
    width: 1440,
    height: 1267,
  },
  {
    src: "/work/calculadora-materiales-anclaflex/calculadora-publica-mobile.png",
    alt: "Calculadora de materiales Anclaflex en vista mobile",
    width: 390,
    height: 1694,
  },
];
const calculadoraStack = ["next.js", "nestjs", "typescript", "postgres", "zod", "pg", "playwright", "docker", "cloudflare"];

const sector07ProjectId = "88888888-8888-4888-8888-888888888888";
const sector07CaseId = "99999999-9999-4999-8999-999999999999";
const sector07PublishedAt = new Date("2026-09-04T14:00:00.000Z");
const sector07RepoUrl = "https://github.com/facundoceresa/sector07-control";
const sector07Shots = [
  {
    src: "/work/sector07-control/tablero-operativo-desktop.png",
    alt: "Tablero operativo Sector 07 Control con pedidos, items, estados, cantidades y sincronizacion ERP",
    width: 1440,
    height: 1100,
  },
  {
    src: "/work/sector07-control/filtros-operativos-desktop.png",
    alt: "Sector 07 Control con busqueda operativa por cliente, nota de pedido, producto u observacion",
    width: 1440,
    height: 1100,
  },
  {
    src: "/work/sector07-control/tablero-operativo-mobile.png",
    alt: "Sector 07 Control en viewport reducido manteniendo la mesa operativa desktop-first",
    width: 1392,
    height: 3013,
  },
];
const sector07Stack = ["react", "vite", "express", "typescript", "postgres", "sql server", "mssql", "ws", "docker"];

try {
  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
  }
  await db
    .insert(projects)
    .values({
      id: peluqueriaProjectId,
      status: "published",
      kind: "production",
      featured: true,
      sortOrder: 1,
      metricValue: "21 tests",
      metricLabelKey: "suite UI + API validada",
      repoUrl: peluqueriaRepoUrl,
      evidenceNote: "Proyecto local verificado con suite UI + API, booking publico, panel por roles y Cloudflare Tunnel documentado.",
      publishedAt: peluqueriaPublishedAt,
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        status: "published",
        kind: "production",
        featured: true,
        sortOrder: 1,
        metricValue: "21 tests",
        metricLabelKey: "suite UI + API validada",
        repoUrl: peluqueriaRepoUrl,
        evidenceNote: "Proyecto local verificado con suite UI + API, booking publico, panel por roles y Cloudflare Tunnel documentado.",
        publishedAt: peluqueriaPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(projectTranslations)
    .values([
      {
        projectId: peluqueriaProjectId,
        locale: "es",
        slug: "peluqueria-agenda",
        title: "Peluqueria Agenda",
        summary:
          "Sistema full-stack para operar un salon: agenda privada por roles, clientes, servicios, profesionales, booking publico, confirmacion por email y reportes operativos.",
        category: "producto operativo",
        role: "Arquitectura, frontend, backend, permisos, booking e infraestructura local",
        body: { screenshots: peluqueriaShots, stack: peluqueriaStack },
        seoTitle: "Peluqueria Agenda - portfolio Facundo Ceresa",
        seoDescription: "Sistema full-stack para salon con agenda, booking publico, roles, reportes, email y despliegue Docker/Cloudflare.",
      },
      {
        projectId: peluqueriaProjectId,
        locale: "en",
        slug: "salon-scheduler",
        title: "Salon Scheduler",
        summary:
          "Full-stack operating system for a salon: private role-based agenda, clients, services, staff, public booking, email confirmation and operational reports.",
        category: "operational product",
        role: "Architecture, frontend, backend, permissions, booking and local infrastructure",
        body: { screenshots: peluqueriaShots, stack: peluqueriaStack },
        seoTitle: "Salon Scheduler - Facundo Ceresa portfolio",
        seoDescription: "Full-stack salon system with agenda, public booking, roles, reporting, email and Docker/Cloudflare deployment.",
      },
    ])
    .onConflictDoUpdate({
      target: [projectTranslations.projectId, projectTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        summary: sql`excluded.summary`,
        category: sql`excluded.category`,
        role: sql`excluded.role`,
        body: sql`excluded.body`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(caseStudies)
    .values({
      id: peluqueriaCaseId,
      status: "published",
      sortOrder: 1,
      readTimeMinutes: 7,
      resultValue: "21 tests",
      resultVerified: true,
      publishedAt: peluqueriaPublishedAt,
    })
    .onConflictDoUpdate({
      target: caseStudies.id,
      set: {
        status: "published",
        sortOrder: 1,
        readTimeMinutes: 7,
        resultValue: "21 tests",
        resultVerified: true,
        publishedAt: peluqueriaPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(caseTranslations)
    .values([
      {
        caseId: peluqueriaCaseId,
        locale: "es",
        slug: "peluqueria-agenda",
        title: "Peluqueria Agenda",
        dek:
          "Un MVP privado para que un salon gestione turnos, clientes, equipo y reportes, con booking publico conectado al flujo real de confirmacion y cancelacion por email.",
        category: "agenda + booking",
        periodLabel: "MVP local autohospedado",
        resultLabel: "Suite UI + API en verde",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "El problema era convertir una operacion de salon en un sistema trazable: recepcion necesita cargar y mover turnos rapido, profesionales necesitan ver solo su agenda, administracion necesita reportes y el cliente final necesita reservar sin depender de mensajes manuales.",
          },
          {
            type: "heading",
            level: 2,
            text: "Que soluciona",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Agenda privada con roles reales para admin, recepcionista y estilista.",
              "Alta, edicion, reprogramacion, reasignacion, cancelacion y operaciones masivas sobre turnos.",
              "Bloqueos de agenda por profesional, filtros operativos y validacion de disponibilidad real.",
              "Booking publico responsive con seleccion de servicio, profesional y horario.",
              "Confirmacion o cancelacion por email mediante links dedicados y vencimiento controlado.",
              "Reportes diarios, semanales y mensuales para leer ocupacion e ingresos sin exportaciones manuales.",
              "Landing publica RAMONAS conectada al flujo de reserva.",
            ],
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/panel-dashboard.png",
            alt: "Dashboard privado de peluqueria-agenda con metricas, agenda y navegacion operativa",
            caption: "Panel privado: agenda, metricas y operacion diaria desde un solo entorno.",
            width: 1440,
            height: 1324,
          },
          {
            type: "heading",
            level: 2,
            text: "Stack tecnico",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Frontend: Next.js 15, App Router, TypeScript, Tailwind, TanStack Query y componentes shadcn-style.",
              "Backend: NestJS 11 con autenticacion JWT, permisos por rol y modulos de agenda, clientes, servicios, staff, settings y reportes.",
              "Datos: PostgreSQL con Prisma, seed de usuarios/negocio y Redis para soporte operativo.",
              "Infra: Docker Compose, servicios separados para web privada, booking publico, API, worker, DB, Redis y Cloudflare Tunnel.",
              "Calidad: suite UI + API con Playwright/pytest y escenarios por rol.",
            ],
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/booking-publico.png",
            alt: "Booking publico de peluqueria-agenda con pasos para servicio, profesional, horario y datos del cliente",
            caption: "Booking publico: flujo mobile-first para reservar sin intervencion manual.",
            width: 1440,
            height: 3637,
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/landing-ramonas.png",
            alt: "Landing RAMONAS con hero, portfolio visual y llamada a reserva",
            caption: "Landing RAMONAS: entrada publica al negocio y al sistema de reservas.",
            width: 1440,
            height: 8106,
          },
          {
            type: "metric",
            value: "21 passed",
            label: "Validacion completa UI + API documentada para flujos criticos y permisos por rol.",
            evidence: "AGENTS.md de peluqueria-agenda, verificacion local 2026-05-25.",
          },
          {
            type: "paragraph",
            markdown: `[Repositorio en GitHub](${peluqueriaRepoUrl})`,
          },
        ],
      },
      {
        caseId: peluqueriaCaseId,
        locale: "en",
        slug: "salon-scheduler",
        title: "Salon Scheduler",
        dek:
          "A private MVP for running salon appointments, clients, staff and reports, with a public booking flow connected to email confirmation and cancellation.",
        category: "agenda + booking",
        periodLabel: "Self-hosted local MVP",
        resultLabel: "UI + API suite passing",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "The goal was to turn salon operations into a traceable system: reception needs fast appointment changes, professionals need their own agenda, admins need reports, and clients need to book without manual message coordination.",
          },
          {
            type: "heading",
            level: 2,
            text: "What it solves",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Private agenda with real admin, receptionist and stylist roles.",
              "Create, edit, reschedule, reassign, cancel and bulk-operate appointments.",
              "Staff availability blocks, operational filters and real availability validation.",
              "Responsive public booking for service, professional and time selection.",
              "Email confirmation or cancellation through dedicated expiring links.",
              "Daily, weekly and monthly reporting for occupancy and revenue.",
              "Public RAMONAS landing connected to the booking flow.",
            ],
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/panel-dashboard.png",
            alt: "Private salon scheduler dashboard with metrics, agenda and operational navigation",
            caption: "Private panel: daily agenda, metrics and operations in one environment.",
            width: 1440,
            height: 1324,
          },
          {
            type: "heading",
            level: 2,
            text: "Technical stack",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Frontend: Next.js 15, App Router, TypeScript, Tailwind, TanStack Query and shadcn-style components.",
              "Backend: NestJS 11 with JWT authentication, role permissions and agenda, clients, services, staff, settings and reports modules.",
              "Data: PostgreSQL with Prisma, seeded users/business data and Redis support.",
              "Infra: Docker Compose, separated private web, public booking, API, worker, DB, Redis and Cloudflare Tunnel services.",
              "Quality: UI + API suite with Playwright/pytest and role-based scenarios.",
            ],
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/booking-publico.png",
            alt: "Public booking flow for choosing service, staff member, time and client data",
            caption: "Public booking: mobile-first reservation flow without manual coordination.",
            width: 1440,
            height: 3637,
          },
          {
            type: "image",
            src: "/work/peluqueria-agenda/landing-ramonas.png",
            alt: "RAMONAS landing page with hero, visual portfolio and booking call to action",
            caption: "RAMONAS landing: public entry point for the business and booking system.",
            width: 1440,
            height: 8106,
          },
          {
            type: "metric",
            value: "21 passed",
            label: "Full UI + API validation documented for critical flows and role permissions.",
            evidence: "peluqueria-agenda AGENTS.md, local verification 2026-05-25.",
          },
          {
            type: "paragraph",
            markdown: `[GitHub repository](${peluqueriaRepoUrl})`,
          },
        ],
      },
    ])
    .onConflictDoUpdate({
      target: [caseTranslations.caseId, caseTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        dek: sql`excluded.dek`,
        category: sql`excluded.category`,
        periodLabel: sql`excluded.period_label`,
        resultLabel: sql`excluded.result_label`,
        contentBlocks: sql`excluded.content_blocks`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
  });
  await db
    .insert(projects)
    .values({
      id: consultaStockProjectId,
      status: "published",
      kind: "production",
      featured: true,
      sortOrder: 2,
      metricValue: "14.183",
      metricLabelKey: "productos catalogados",
      repoUrl: consultaStockRepoUrl,
      liveUrl: consultaStockLiveUrl,
      evidenceNote: "Deploy validado el 2026-07-07: 14.183 productos, 19 familias, tunnel publico y health checks OK.",
      publishedAt: consultaStockPublishedAt,
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        status: "published",
        kind: "production",
        featured: true,
        sortOrder: 2,
        metricValue: "14.183",
        metricLabelKey: "productos catalogados",
        repoUrl: consultaStockRepoUrl,
        liveUrl: consultaStockLiveUrl,
        evidenceNote: "Deploy validado el 2026-07-07: 14.183 productos, 19 familias, tunnel publico y health checks OK.",
        publishedAt: consultaStockPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(projectTranslations)
    .values([
      {
        projectId: consultaStockProjectId,
        locale: "es",
        slug: "consulta-stock-general",
        title: "Consulta Stock General",
        summary:
          "Consulta web de stock en vivo para ERP: una superficie interna LAN y otra externa mobile-first, con catalogo local, familias manuales, autenticacion externa y lecturas controladas a SQL Server.",
        category: "integracion ERP",
        role: "Arquitectura full-stack, API NestJS, frontends Next.js, seguridad de exposicion y despliegue Docker/Cloudflare",
        body: { screenshots: consultaStockShots, stack: consultaStockStack },
        seoTitle: "Consulta Stock General - portfolio Facundo Ceresa",
        seoDescription: "Consulta de stock en vivo para ERP con Next.js, NestJS, PostgreSQL, SQL Server, Docker y Cloudflare Tunnel.",
      },
      {
        projectId: consultaStockProjectId,
        locale: "en",
        slug: "general-stock-lookup",
        title: "General Stock Lookup",
        summary:
          "Live ERP stock lookup product with an internal LAN surface and an external mobile-first surface, backed by a local catalog, manual families, external auth and controlled SQL Server reads.",
        category: "ERP integration",
        role: "Full-stack architecture, NestJS API, Next.js frontends, exposure hardening and Docker/Cloudflare deployment",
        body: { screenshots: consultaStockShots, stack: consultaStockStack },
        seoTitle: "General Stock Lookup - Facundo Ceresa portfolio",
        seoDescription: "Live ERP stock lookup with Next.js, NestJS, PostgreSQL, SQL Server, Docker and Cloudflare Tunnel.",
      },
    ])
    .onConflictDoUpdate({
      target: [projectTranslations.projectId, projectTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        summary: sql`excluded.summary`,
        category: sql`excluded.category`,
        role: sql`excluded.role`,
        body: sql`excluded.body`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(caseStudies)
    .values({
      id: consultaStockCaseId,
      status: "published",
      sortOrder: 2,
      readTimeMinutes: 8,
      resultValue: "14.183",
      resultVerified: true,
      publishedAt: consultaStockPublishedAt,
    })
    .onConflictDoUpdate({
      target: caseStudies.id,
      set: {
        status: "published",
        sortOrder: 2,
        readTimeMinutes: 8,
        resultValue: "14.183",
        resultVerified: true,
        publishedAt: consultaStockPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(caseTranslations)
    .values([
      {
        caseId: consultaStockCaseId,
        locale: "es",
        slug: "consulta-stock-general",
        title: "Consulta Stock General",
        dek:
          "Una consulta web de stock en vivo para reemplazar la dependencia operativa del ERP de escritorio, con acceso interno sin login, acceso externo autenticado y lecturas controladas al SQL Server del ERP.",
        category: "stock ERP",
        periodLabel: "Producto operativo desplegado",
        resultLabel: "Productos restaurados y consultables",
        seoTitle: "Consulta Stock General - portfolio Facundo Ceresa",
        seoDescription: "Caso de integracion ERP para consultar stock en vivo desde interfaces web internas y externas.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "El problema era que la consulta de stock dependia demasiado del contexto operativo del ERP: escritorio, red, VPN y conocimiento interno. El proyecto concentra esa lectura en una API propia y ofrece dos superficies web segun el contexto de uso.",
          },
          {
            type: "heading",
            level: 2,
            text: "Que soluciona",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Consulta stock vivo desde SQL Server en modo read-only, sin replicar existencias en PostgreSQL.",
              "Catalogo local en PostgreSQL, reducido a productos disponibles para Uruguay e importado desde planilla operativa.",
              "Busqueda mixta de productos y familias desde 4 caracteres, con sugerencias limitadas y prioridad moderada para familias.",
              "Familias manuales con reglas explicitas, por prefijo y por coincidencia parcial para agrupar articulos reales del ERP.",
              "Superficie interna LAN sin login de usuario, protegida por proxy server-side y token interno entre frontend y API.",
              "Superficie externa mobile-first con usuario, contrasena, sesion por cookie HTTP-only y publicacion via Cloudflare Tunnel.",
              "API central que evita SQL libre o filtros arbitrarios y controla todas las consultas al ERP.",
              "Consultas por familia en batches para evitar el limite de 2100 parametros de SQL Server.",
              "Exposicion endurecida: API y frente externo en loopback, frente interno por allowlist LAN/VPN y dominio publico solo por tunnel.",
            ],
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/internal-desktop.png",
            alt: "Interfaz interna de Consulta Stock General para buscar producto o familia",
            caption: "Frente interno: busqueda de producto o familia para operadores dentro de la red.",
            width: 1440,
            height: 900,
          },
          {
            type: "heading",
            level: 2,
            text: "Stack tecnico",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Frontend interno y externo: Next.js 15, React 19 y TypeScript.",
              "Backend: NestJS con modulos de autenticacion, catalogo, stock, health y refresh manual de familias.",
              "Datos propios: PostgreSQL 16 para catalogo, familias manuales, usuarios, sesiones y auditoria.",
              "Integracion ERP: SQL Server mediante driver mssql, con consultas read-only a tablas y vistas controladas.",
              "Infraestructura: Docker Compose, firewall DOCKER-USER, systemd, Cloudflare Tunnel y despliegue por script ops/deploy.sh.",
              "Calidad operativa: health checks, restore validado, importadores de catalogo y tests de API/operaciones.",
            ],
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/external-login-mobile.png",
            alt: "Login mobile de Consulta Stock General para acceso externo autenticado",
            caption: "Frente externo: acceso mobile-first para consulta segura fuera de la LAN.",
            width: 390,
            height: 844,
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/external-login-desktop.png",
            alt: "Login externo de Consulta Stock General en escritorio",
            caption: "La misma superficie externa mantiene una lectura clara tambien en escritorio.",
            width: 1440,
            height: 900,
          },
          {
            type: "metric",
            value: "14.183",
            label: "Productos en catalog_products tras restore validado en el servidor flexservice.",
            evidence: "docs/deploy-status-2026-07-07.md del repositorio privado.",
          },
          {
            type: "metric",
            value: "19",
            label: "Familias manuales activas reconstruidas en PostgreSQL para consultas agrupadas.",
            evidence: "docs/project-context.md y docs/deploy-status-2026-07-07.md.",
          },
          {
            type: "paragraph",
            markdown: `[Repositorio en GitHub](${consultaStockRepoUrl}) · [Aplicacion publicada](${consultaStockLiveUrl})`,
          },
        ],
      },
      {
        caseId: consultaStockCaseId,
        locale: "en",
        slug: "general-stock-lookup",
        title: "General Stock Lookup",
        dek:
          "A live stock lookup product that reduces dependency on the desktop ERP, with an internal no-login surface, an authenticated external surface and controlled reads against the ERP SQL Server.",
        category: "ERP stock",
        periodLabel: "Deployed operational product",
        resultLabel: "Restored and queryable products",
        seoTitle: "General Stock Lookup - Facundo Ceresa portfolio",
        seoDescription: "ERP integration case study for live stock lookup through internal and external web interfaces.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "The problem was that stock visibility depended too much on the ERP operating context: desktop access, network constraints, VPN and internal know-how. The project concentrates reads in a dedicated API and exposes two web surfaces for different usage contexts.",
          },
          {
            type: "heading",
            level: 2,
            text: "What it solves",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Live read-only stock lookup from SQL Server, without replicating stock quantities into PostgreSQL.",
              "Local PostgreSQL catalog reduced to Uruguay products and imported from the operational spreadsheet.",
              "Mixed product and family search from 4 characters, with bounded suggestions and moderate family priority.",
              "Manual families with explicit, prefix and partial-match rules to group real ERP items.",
              "Internal LAN surface without user login, protected by a server-side proxy and internal frontend-to-API token.",
              "External mobile-first surface with username/password login, HTTP-only session cookie and Cloudflare Tunnel publication.",
              "Central API that prevents free SQL or arbitrary filters and controls every ERP query.",
              "Family queries split into batches to avoid SQL Server's 2100-parameter limit.",
              "Hardened exposure: API and external frontend on loopback, internal frontend behind LAN/VPN allowlist and public domain only through the tunnel.",
            ],
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/internal-desktop.png",
            alt: "Internal General Stock Lookup interface for product or family search",
            caption: "Internal frontend: product or family lookup for operators inside the network.",
            width: 1440,
            height: 900,
          },
          {
            type: "heading",
            level: 2,
            text: "Technical stack",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Internal and external frontends: Next.js 15, React 19 and TypeScript.",
              "Backend: NestJS modules for auth, catalog, stock, health and manual family refresh.",
              "Owned data: PostgreSQL 16 for catalog, manual families, users, sessions and audit data.",
              "ERP integration: SQL Server through the mssql driver, with read-only controlled table/view queries.",
              "Infrastructure: Docker Compose, DOCKER-USER firewall, systemd, Cloudflare Tunnel and ops/deploy.sh deployment script.",
              "Operational quality: health checks, validated restore, catalog importers and API/ops tests.",
            ],
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/external-login-mobile.png",
            alt: "Mobile login for authenticated external General Stock Lookup access",
            caption: "External frontend: mobile-first access for secure lookup outside the LAN.",
            width: 390,
            height: 844,
          },
          {
            type: "image",
            src: "/work/consulta-stock-general/external-login-desktop.png",
            alt: "External General Stock Lookup login on desktop",
            caption: "The external surface keeps the same focused flow on desktop.",
            width: 1440,
            height: 900,
          },
          {
            type: "metric",
            value: "14,183",
            label: "Products in catalog_products after the validated restore on the flexservice server.",
            evidence: "docs/deploy-status-2026-07-07.md from the private repository.",
          },
          {
            type: "metric",
            value: "19",
            label: "Active manual families rebuilt in PostgreSQL for grouped stock queries.",
            evidence: "docs/project-context.md and docs/deploy-status-2026-07-07.md.",
          },
          {
            type: "paragraph",
            markdown: `[GitHub repository](${consultaStockRepoUrl}) · [Published app](${consultaStockLiveUrl})`,
          },
        ],
      },
    ])
    .onConflictDoUpdate({
      target: [caseTranslations.caseId, caseTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        dek: sql`excluded.dek`,
        category: sql`excluded.category`,
        periodLabel: sql`excluded.period_label`,
        resultLabel: sql`excluded.result_label`,
        contentBlocks: sql`excluded.content_blocks`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(projects)
    .values({
      id: calculadoraProjectId,
      status: "published",
      kind: "production",
      featured: true,
      sortOrder: 3,
      metricValue: "3 apps",
      metricLabelKey: "API + publico + admin",
      repoUrl: calculadoraRepoUrl,
      liveUrl: calculadoraLiveUrl,
      evidenceNote: "Proyecto desplegado y validado el 2026-07-16: calculo publico, PDF, API ready y admin LAN operativos.",
      publishedAt: calculadoraPublishedAt,
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        status: "published",
        kind: "production",
        featured: true,
        sortOrder: 3,
        metricValue: "3 apps",
        metricLabelKey: "API + publico + admin",
        repoUrl: calculadoraRepoUrl,
        liveUrl: calculadoraLiveUrl,
        evidenceNote: "Proyecto desplegado y validado el 2026-07-16: calculo publico, PDF, API ready y admin LAN operativos.",
        publishedAt: calculadoraPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(projectTranslations)
    .values([
      {
        projectId: calculadoraProjectId,
        locale: "es",
        slug: "calculadora-materiales-anclaflex",
        title: "Calculadora Materiales Anclaflex",
        summary:
          "Cotizador web para estimar materiales, envases y costos de sistemas Anclaflex por metro cuadrado, con panel administrativo, snapshots inmutables y PDF descargable.",
        category: "cotizador tecnico",
        role: "Arquitectura full-stack, motor de calculo, API, frontend publico, admin, PDF e infraestructura Docker/Cloudflare",
        body: { screenshots: calculadoraShots, stack: calculadoraStack },
        seoTitle: "Calculadora Materiales Anclaflex - portfolio Facundo Ceresa",
        seoDescription: "Cotizador full-stack para materiales Anclaflex con Next.js, NestJS, PostgreSQL, PDF y panel administrativo.",
      },
      {
        projectId: calculadoraProjectId,
        locale: "en",
        slug: "anclaflex-material-calculator",
        title: "Anclaflex Material Calculator",
        summary:
          "Web estimator for Anclaflex systems that calculates materials, packages and costs by square meter, with an admin panel, immutable snapshots and downloadable PDFs.",
        category: "technical estimator",
        role: "Full-stack architecture, calculation engine, API, public frontend, admin, PDF and Docker/Cloudflare infrastructure",
        body: { screenshots: calculadoraShots, stack: calculadoraStack },
        seoTitle: "Anclaflex Material Calculator - Facundo Ceresa portfolio",
        seoDescription: "Full-stack material estimator for Anclaflex with Next.js, NestJS, PostgreSQL, PDF and admin panel.",
      },
    ])
    .onConflictDoUpdate({
      target: [projectTranslations.projectId, projectTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        summary: sql`excluded.summary`,
        category: sql`excluded.category`,
        role: sql`excluded.role`,
        body: sql`excluded.body`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(caseStudies)
    .values({
      id: calculadoraCaseId,
      status: "published",
      sortOrder: 3,
      readTimeMinutes: 8,
      resultValue: "PDF A4",
      resultVerified: true,
      publishedAt: calculadoraPublishedAt,
    })
    .onConflictDoUpdate({
      target: caseStudies.id,
      set: {
        status: "published",
        sortOrder: 3,
        readTimeMinutes: 8,
        resultValue: "PDF A4",
        resultVerified: true,
        publishedAt: calculadoraPublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(caseTranslations)
    .values([
      {
        caseId: calculadoraCaseId,
        locale: "es",
        slug: "calculadora-materiales-anclaflex",
        title: "Calculadora Materiales Anclaflex",
        dek:
          "Un cotizador publico para convertir metros cuadrados en cantidades, envases y costos estimados, con un motor de calculo backend, presupuestos persistidos como snapshot y PDF descargable.",
        category: "cotizador tecnico",
        periodLabel: "MVP operativo desplegado",
        resultLabel: "Presupuesto PDF desde snapshot",
        seoTitle: "Calculadora Materiales Anclaflex - portfolio Facundo Ceresa",
        seoDescription: "Caso full-stack para calcular materiales, envases, costos y PDFs de presupuestos Anclaflex.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "El problema era llevar una estimacion tecnica de materiales a un flujo web confiable: el usuario ingresa superficie, selecciona productos o sistemas, y recibe cantidades por mano, envases completos y costos sin depender de planillas ni calculos manuales.",
          },
          {
            type: "heading",
            level: 2,
            text: "Que soluciona",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Calcula materiales y costos desde metros cuadrados, productos individuales o sistemas compuestos.",
              "Expande sistemas en componentes obligatorios y opcionales con multiplicadores y presentaciones preferidas.",
              "Consolida productos repetidos antes de calcular envases, evitando duplicar consumo cuando un producto aparece por varias vias.",
              "Calcula consumo por mano, total requerido, cantidad de envases completos y costo por presentacion.",
              "Genera presupuestos persistidos con snapshot inmutable para que el PDF conserve precios y datos del momento del calculo.",
              "Permite descargar PDF A4 generado por backend con Playwright Core y Chromium.",
              "Incluye panel administrativo para productos, sistemas, empresa, configuracion PDF, auditoria y carga de imagenes.",
              "Separa web publica, web admin y API para aplicar reglas distintas de exposicion, CORS, cookies y Cloudflare.",
            ],
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/calculadora-publica-desktop.png",
            alt: "Calculadora publica Anclaflex para cargar area y seleccionar producto o sistema",
            caption: "Calculadora publica: entrada clara para superficie, producto o sistema y ayuda contextual.",
            width: 1440,
            height: 1100,
          },
          {
            type: "heading",
            level: 2,
            text: "Stack tecnico",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Monorepo Node 20 con apps/api, apps/web-public, apps/web-admin y packages/shared.",
              "Backend NestJS con PostgreSQL mediante pg, SQL parametrizado, Helmet, CORS, requestId y health checks.",
              "Motor de calculo en TypeScript puro: expansion de sistemas, manos, consolidacion, envases, costos y snapshots.",
              "Frontends Next.js 15 y React 19 con Tailwind, React Hook Form, Zod y componentes propios.",
              "Autenticacion administrativa con Argon2, cookie HttpOnly/SameSite, sesiones hasheadas y CSRF en mutaciones.",
              "PDF backend con Playwright Core + Chromium a partir del snapshot persistido, no desde captura de pantalla.",
              "Infraestructura Docker Compose con PostgreSQL 16-alpine, volumenes persistentes, Cloudflare Tunnel y admin por LAN.",
            ],
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/resultado-calculo-desktop.png",
            alt: "Resultado Anclaflex con materiales calculados, envases, costos y descarga PDF",
            caption: "Resultado: desglose por mano, envases completos, costos y PDF listo para descargar.",
            width: 1440,
            height: 1267,
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/calculadora-publica-mobile.png",
            alt: "Calculadora publica Anclaflex responsive en mobile",
            caption: "Vista mobile: el mismo flujo de cotizacion adaptado para consulta rapida.",
            width: 390,
            height: 1694,
          },
          {
            type: "metric",
            value: "3 apps",
            label: "API NestJS, web publica y panel administrativo desplegados como servicios separados.",
            evidence: "README.md y DOCS/PROJECT_STATUS.md del repositorio privado.",
          },
          {
            type: "metric",
            value: "PDF A4",
            label: "PDF generado desde snapshot persistido y validado con cabecera %PDF- en produccion.",
            evidence: "DOCS/PROJECT_STATUS.md, validacion actualizada el 2026-07-16.",
          },
          {
            type: "paragraph",
            markdown: `[Repositorio en GitHub](${calculadoraRepoUrl}) · [Aplicacion publicada](${calculadoraLiveUrl})`,
          },
        ],
      },
      {
        caseId: calculadoraCaseId,
        locale: "en",
        slug: "anclaflex-material-calculator",
        title: "Anclaflex Material Calculator",
        dek:
          "A public estimator that turns square meters into material quantities, full packages and estimated costs, backed by a server-side calculation engine, persisted budget snapshots and downloadable PDFs.",
        category: "technical estimator",
        periodLabel: "Deployed operational MVP",
        resultLabel: "PDF budget from snapshot",
        seoTitle: "Anclaflex Material Calculator - Facundo Ceresa portfolio",
        seoDescription: "Full-stack case study for calculating Anclaflex materials, packages, costs and budget PDFs.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "The problem was to move a technical material estimate into a reliable web flow: users enter surface area, choose products or systems, and receive per-coat quantities, full packages and costs without relying on spreadsheets or manual calculations.",
          },
          {
            type: "heading",
            level: 2,
            text: "What it solves",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Calculates materials and costs from square meters, individual products or compound systems.",
              "Expands systems into required and optional components with multipliers and preferred presentations.",
              "Consolidates repeated products before package calculation, avoiding duplicated consumption when a product appears through multiple paths.",
              "Calculates per-coat consumption, total required quantity, complete package count and cost by presentation.",
              "Persists budgets as immutable snapshots so the PDF keeps the prices and data from the calculation moment.",
              "Generates downloadable A4 PDFs on the backend with Playwright Core and Chromium.",
              "Includes an admin panel for products, systems, company data, PDF configuration, audit and image uploads.",
              "Separates public web, admin web and API so exposure, CORS, cookies and Cloudflare rules can differ.",
            ],
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/calculadora-publica-desktop.png",
            alt: "Public Anclaflex calculator for entering area and choosing products or systems",
            caption: "Public calculator: clear input for surface area, product/system selection and contextual help.",
            width: 1440,
            height: 1100,
          },
          {
            type: "heading",
            level: 2,
            text: "Technical stack",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Node 20 monorepo with apps/api, apps/web-public, apps/web-admin and packages/shared.",
              "NestJS backend with PostgreSQL through pg, parameterized SQL, Helmet, CORS, requestId and health checks.",
              "Pure TypeScript calculation engine: system expansion, coats, consolidation, packages, costs and snapshots.",
              "Next.js 15 and React 19 frontends with Tailwind, React Hook Form, Zod and custom components.",
              "Admin authentication with Argon2, HttpOnly/SameSite cookies, hashed sessions and CSRF on mutations.",
              "Backend PDF generation with Playwright Core + Chromium from the persisted snapshot, not from a UI screenshot.",
              "Docker Compose infrastructure with PostgreSQL 16-alpine, persistent volumes, Cloudflare Tunnel and LAN admin.",
            ],
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/resultado-calculo-desktop.png",
            alt: "Anclaflex result view with calculated materials, packages, costs and PDF download",
            caption: "Result view: per-coat breakdown, complete packages, costs and PDF download.",
            width: 1440,
            height: 1267,
          },
          {
            type: "image",
            src: "/work/calculadora-materiales-anclaflex/calculadora-publica-mobile.png",
            alt: "Responsive public Anclaflex calculator on mobile",
            caption: "Mobile view: the same estimation flow adapted for quick lookup.",
            width: 390,
            height: 1694,
          },
          {
            type: "metric",
            value: "3 apps",
            label: "NestJS API, public web and admin panel deployed as separate services.",
            evidence: "README.md and DOCS/PROJECT_STATUS.md from the private repository.",
          },
          {
            type: "metric",
            value: "A4 PDF",
            label: "PDF generated from the persisted snapshot and validated with a %PDF- header in production.",
            evidence: "DOCS/PROJECT_STATUS.md, validation updated on 2026-07-16.",
          },
          {
            type: "paragraph",
            markdown: `[GitHub repository](${calculadoraRepoUrl}) · [Published app](${calculadoraLiveUrl})`,
          },
        ],
      },
    ])
    .onConflictDoUpdate({
      target: [caseTranslations.caseId, caseTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        dek: sql`excluded.dek`,
        category: sql`excluded.category`,
        periodLabel: sql`excluded.period_label`,
        resultLabel: sql`excluded.result_label`,
        contentBlocks: sql`excluded.content_blocks`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(projects)
    .values({
      id: sector07ProjectId,
      status: "published",
      kind: "production",
      featured: true,
      sortOrder: 4,
      metricValue: "499",
      metricLabelKey: "pedidos restaurados",
      repoUrl: sector07RepoUrl,
      evidenceNote: "Despliegue validado el 2026-07-07: 499 pedidos, 924 items, 974 sync runs y hardening LAN/loopback.",
      publishedAt: sector07PublishedAt,
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        status: "published",
        kind: "production",
        featured: true,
        sortOrder: 4,
        metricValue: "499",
        metricLabelKey: "pedidos restaurados",
        repoUrl: sector07RepoUrl,
        liveUrl: null,
        evidenceNote: "Despliegue validado el 2026-07-07: 499 pedidos, 924 items, 974 sync runs y hardening LAN/loopback.",
        publishedAt: sector07PublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(projectTranslations)
    .values([
      {
        projectId: sector07ProjectId,
        locale: "es",
        slug: "sector07-control",
        title: "Sector 07 Control",
        summary:
          "Mesa operativa interna para reemplazar la planilla del sector 07: sincroniza notas de pedido desde ERP en modo lectura, guarda estados propios y permite preparar pedidos por item.",
        category: "operacion interna",
        role: "Arquitectura full-stack, sync ERP, backend Express, frontend React/Vite, tiempo real, PostgreSQL y despliegue Docker/LAN",
        body: { screenshots: sector07Shots, stack: sector07Stack },
        seoTitle: "Sector 07 Control - portfolio Facundo Ceresa",
        seoDescription: "Sistema interno para controlar notas de pedido del sector 07 con ERP read-only, PostgreSQL, React, Express y Docker.",
      },
      {
        projectId: sector07ProjectId,
        locale: "en",
        slug: "sector07-control",
        title: "Sector 07 Control",
        summary:
          "Internal operations board replacing the Sector 07 spreadsheet: it syncs ERP sales orders in read-only mode, stores owned workflow states and lets operators prepare orders by item.",
        category: "internal operations",
        role: "Full-stack architecture, ERP sync, Express backend, React/Vite frontend, realtime events, PostgreSQL and Docker/LAN deployment",
        body: { screenshots: sector07Shots, stack: sector07Stack },
        seoTitle: "Sector 07 Control - Facundo Ceresa portfolio",
        seoDescription: "Internal system for controlling Sector 07 sales orders with read-only ERP, PostgreSQL, React, Express and Docker.",
      },
    ])
    .onConflictDoUpdate({
      target: [projectTranslations.projectId, projectTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        summary: sql`excluded.summary`,
        category: sql`excluded.category`,
        role: sql`excluded.role`,
        body: sql`excluded.body`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  await db
    .insert(caseStudies)
    .values({
      id: sector07CaseId,
      status: "published",
      sortOrder: 4,
      readTimeMinutes: 8,
      resultValue: "499",
      resultVerified: true,
      publishedAt: sector07PublishedAt,
    })
    .onConflictDoUpdate({
      target: caseStudies.id,
      set: {
        status: "published",
        sortOrder: 4,
        readTimeMinutes: 8,
        resultValue: "499",
        resultVerified: true,
        publishedAt: sector07PublishedAt,
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  await db
    .insert(caseTranslations)
    .values([
      {
        caseId: sector07CaseId,
        locale: "es",
        slug: "sector07-control",
        title: "Sector 07 Control",
        dek:
          "Una herramienta interna para que el sector 07 deje de operar pedidos desde una planilla: toma snapshots de notas de pedido del ERP, mantiene estados propios en PostgreSQL y permite preparar cada item con trazabilidad.",
        category: "operacion interna",
        periodLabel: "Sistema interno desplegado",
        resultLabel: "Pedidos ERP restaurados",
        seoTitle: "Sector 07 Control - portfolio Facundo Ceresa",
        seoDescription: "Caso de sistema interno para operar notas de pedido del sector 07 con ERP read-only, React, Express, PostgreSQL y Docker.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "El problema era operativo: el sector 07 necesitaba ver y actualizar la preparacion de notas de pedido sin depender de una planilla manual ni escribir en la base oficial del ERP. La solucion separa lectura ERP, snapshot local y estados propios.",
          },
          {
            type: "heading",
            level: 2,
            text: "Que soluciona",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Reemplaza la planilla manual del sector 07 por una mesa web de pedidos e items.",
              "Lee notas de pedido `NP` del sector `07` desde SQL Server ERP en modo read-only.",
              "Persiste snapshots de cabeceras e items ERP en PostgreSQL propio sin modificar tablas del ERP.",
              "Guarda estado actual e historial de cambios por pedido y por item.",
              "Permite cambiar estado de pedido, estado de item, fecha de entrega, nota operativa, cantidad operativa y borrado logico local.",
              "Sincroniza incrementalmente por cursor `FCRMVH_NROFOR`, trayendo solo notas nuevas.",
              "Incluye actualizacion manual desde UI y soporte de sync automatico configurable por ventana horaria.",
              "Emite eventos en tiempo real por WebSocket y usa polling de respaldo si se corta la conexion.",
              "Expone la API solo en loopback y deja la web interna restringida por allowlist LAN/VPN.",
            ],
          },
          {
            type: "image",
            src: "/work/sector07-control/tablero-operativo-desktop.png",
            alt: "Tablero operativo de Sector 07 Control con notas de pedido e items",
            caption: "Mesa operativa: pedidos visibles, sync ERP, estados por pedido e items editables en una sola pantalla.",
            width: 1440,
            height: 1100,
          },
          {
            type: "heading",
            level: 2,
            text: "Stack tecnico",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Backend: Node.js 20, Express 4, TypeScript 5, Zod, pg, mssql y ws.",
              "Frontend: React 18 con Vite 6, TypeScript y CSS propio optimizado para pantalla fija de operacion.",
              "Base propia: PostgreSQL 16 Alpine para snapshots, estados, historial, corridas de sync y cursor incremental.",
              "ERP: SQL Server ANCURU consultado en modo solo lectura sobre FCRMVH, FCRMVI, VTMCLH y STMPDH.",
              "Infraestructura: Docker Compose con postgres, api y web servida por nginx.",
              "Operaciones: scripts de deploy, restart, logs, stop, backups, restore y firewall persistente.",
              "Seguridad de red: API en 127.0.0.1:4000, web en 8080 con allowlist 192.168.18.0/24 y 172.16.21.0/24.",
            ],
          },
          {
            type: "image",
            src: "/work/sector07-control/filtros-operativos-desktop.png",
            alt: "Busqueda y filtros operativos de Sector 07 Control",
            caption: "Filtros: busqueda por cliente, NP, producto u observacion, mas cliente, estado y fecha.",
            width: 1440,
            height: 1100,
          },
          {
            type: "image",
            src: "/work/sector07-control/tablero-operativo-mobile.png",
            alt: "Sector 07 Control visto en viewport reducido",
            caption: "Viewport reducido: conserva la mesa desktop-first pensada para operacion interna.",
            width: 1392,
            height: 3013,
          },
          {
            type: "metric",
            value: "499",
            label: "Pedidos restaurados en erp_order_header tras migracion al servidor flexservice.",
            evidence: "docs/deploy-status-2026-07-07.md del repositorio privado.",
          },
          {
            type: "metric",
            value: "924",
            label: "Items restaurados en erp_order_item, con 499 estados actuales y 974 corridas de sync registradas.",
            evidence: "docs/deploy-status-2026-07-07.md.",
          },
          {
            type: "paragraph",
            markdown: `[Repositorio en GitHub](${sector07RepoUrl})`,
          },
        ],
      },
      {
        caseId: sector07CaseId,
        locale: "en",
        slug: "sector07-control",
        title: "Sector 07 Control",
        dek:
          "An internal tool that moves Sector 07 order preparation out of a spreadsheet: it snapshots ERP sales orders, stores owned workflow states in PostgreSQL and lets operators track every item.",
        category: "internal operations",
        periodLabel: "Deployed internal system",
        resultLabel: "Restored ERP orders",
        seoTitle: "Sector 07 Control - Facundo Ceresa portfolio",
        seoDescription: "Internal operations case for Sector 07 sales orders with read-only ERP, React, Express, PostgreSQL and Docker.",
        contentBlocks: [
          {
            type: "paragraph",
            markdown:
              "The problem was operational: Sector 07 needed to view and update order preparation without relying on a manual spreadsheet or writing into the official ERP database. The solution separates ERP reads, local snapshots and owned workflow state.",
          },
          {
            type: "heading",
            level: 2,
            text: "What it solves",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Replaces the Sector 07 manual spreadsheet with a web board for orders and items.",
              "Reads `NP` sales orders for sector `07` from ERP SQL Server in read-only mode.",
              "Persists ERP header and item snapshots in owned PostgreSQL without modifying ERP tables.",
              "Stores current state and change history for each order and item.",
              "Supports order status, item status, delivery date, operational notes, local quantity override and local logical delete.",
              "Runs incremental sync by `FCRMVH_NROFOR` cursor, importing only newer orders.",
              "Provides manual UI refresh and optional automatic sync inside a configured time window.",
              "Publishes realtime events through WebSocket and falls back to polling when the connection drops.",
              "Keeps the API on loopback and restricts the internal web surface through LAN/VPN allowlisting.",
            ],
          },
          {
            type: "image",
            src: "/work/sector07-control/tablero-operativo-desktop.png",
            alt: "Sector 07 Control operations board with sales orders and items",
            caption: "Operations board: visible orders, ERP sync, order states and editable items in one screen.",
            width: 1440,
            height: 1100,
          },
          {
            type: "heading",
            level: 2,
            text: "Technical stack",
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Backend: Node.js 20, Express 4, TypeScript 5, Zod, pg, mssql and ws.",
              "Frontend: React 18 with Vite 6, TypeScript and custom CSS optimized for a fixed operations screen.",
              "Owned database: PostgreSQL 16 Alpine for snapshots, states, history, sync runs and incremental cursor.",
              "ERP: ANCURU SQL Server queried read-only over FCRMVH, FCRMVI, VTMCLH and STMPDH.",
              "Infrastructure: Docker Compose with postgres, api and nginx-served web.",
              "Operations: scripts for deploy, restart, logs, stop, backups, restore and persistent firewall.",
              "Network security: API on 127.0.0.1:4000, web on 8080 allowlisted for 192.168.18.0/24 and 172.16.21.0/24.",
            ],
          },
          {
            type: "image",
            src: "/work/sector07-control/filtros-operativos-desktop.png",
            alt: "Sector 07 Control search and operational filters",
            caption: "Filters: search by client, order number, product or note, plus client, status and date.",
            width: 1440,
            height: 1100,
          },
          {
            type: "image",
            src: "/work/sector07-control/tablero-operativo-mobile.png",
            alt: "Sector 07 Control in a reduced viewport",
            caption: "Reduced viewport: keeps the desktop-first board intended for internal operations.",
            width: 1392,
            height: 3013,
          },
          {
            type: "metric",
            value: "499",
            label: "Orders restored in erp_order_header after migration to the flexservice server.",
            evidence: "docs/deploy-status-2026-07-07.md from the private repository.",
          },
          {
            type: "metric",
            value: "924",
            label: "Items restored in erp_order_item, with 499 current states and 974 recorded sync runs.",
            evidence: "docs/deploy-status-2026-07-07.md.",
          },
          {
            type: "paragraph",
            markdown: `[GitHub repository](${sector07RepoUrl})`,
          },
        ],
      },
    ])
    .onConflictDoUpdate({
      target: [caseTranslations.caseId, caseTranslations.locale],
      set: {
        title: sql`excluded.title`,
        slug: sql`excluded.slug`,
        dek: sql`excluded.dek`,
        category: sql`excluded.category`,
        periodLabel: sql`excluded.period_label`,
        resultLabel: sql`excluded.result_label`,
        contentBlocks: sql`excluded.content_blocks`,
        seoTitle: sql`excluded.seo_title`,
        seoDescription: sql`excluded.seo_description`,
      },
    });
  for (const [index, title] of draftProjectCandidates.entries()) {
    const draftSlugEs = `borrador-${index + 1}`;
    const draftSlugEn = `draft-${index + 1}`;
    const [existingDraft] = await db
      .select({ projectId: projectTranslations.projectId })
      .from(projectTranslations)
      .where(and(eq(projectTranslations.locale, "es"), eq(projectTranslations.slug, draftSlugEs)))
      .limit(1);
    const draftValues = {
      status: "draft",
      kind: "production",
      featured: true,
      sortOrder: index + 10,
      evidenceNote: "Borrador candidato: completar evidencia real antes de publicar.",
    } as const;
    const projectId = existingDraft?.projectId;
    if (projectId) {
      await db.update(projects).set({ ...draftValues, updatedAt: new Date() }).where(eq(projects.id, projectId));
    } else {
      const [project] = await db.insert(projects).values(draftValues).returning({ id: projects.id });
      await db.insert(projectTranslations).values([
        { projectId: project.id, locale: "es", slug: draftSlugEs, title, summary: "Borrador de desarrollo. No publicar sin contenido real, evidencias y traduccion revisada.", category: "borrador" },
        { projectId: project.id, locale: "en", slug: draftSlugEn, title: `Draft ${index + 1}`, summary: "Development draft. Do not publish without real content, evidence and reviewed translation.", category: "draft" },
      ]);
    }
  }
  const [existingDraftCase] = await db
    .select({ caseId: caseTranslations.caseId })
    .from(caseTranslations)
    .where(and(eq(caseTranslations.locale, "es"), eq(caseTranslations.slug, "caso-borrador")))
    .limit(1);
  if (existingDraftCase) {
    await db.update(caseStudies).set({ status: "draft", sortOrder: 10, readTimeMinutes: 6, updatedAt: new Date() }).where(eq(caseStudies.id, existingDraftCase.caseId));
  } else {
    const [caseStudy] = await db.insert(caseStudies).values({ status: "draft", sortOrder: 10, readTimeMinutes: 6 }).returning({ id: caseStudies.id });
    await db.insert(caseTranslations).values([
      {
        caseId: caseStudy.id,
        locale: "es",
        slug: "caso-borrador",
        title: "Caso borrador",
        dek: "Caso de desarrollo sin publicar, creado para probar el detalle real y evitar el bug de indice.",
        category: "borrador",
        contentBlocks: [{ type: "paragraph", markdown: "Completar con caso real antes de publicacion." }],
      },
      {
        caseId: caseStudy.id,
        locale: "en",
        slug: "draft-case",
        title: "Draft case",
        dek: "Unpublished development case used to test real detail rendering and avoid the index fallback bug.",
        category: "draft",
        contentBlocks: [{ type: "paragraph", markdown: "Complete with a real case before publication." }],
      },
    ]);
  }
  console.log("development seed updated");
} finally {
  await client.end();
}
