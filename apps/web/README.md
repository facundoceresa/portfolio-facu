# Web app

Aplicacion publica y panel admin del portfolio de Facundo Ceresa.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- PostgreSQL con Drizzle ORM
- Playwright, Axe y Vitest para validacion
- Auth admin con sesiones opacas, Argon2id, CSRF y rate limiting

## Desarrollo local

Desde la raiz del monorepo:

```bash
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env
pnpm --filter web db:migrate
pnpm --filter web db:seed:dev
pnpm dev
```

La app queda en `http://localhost:3000`.

## Validacion

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:e2e
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:a11y
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:visual
```

## Seguridad

No guardar secretos en settings, seed, capturas ni archivos versionados. Usar `.env` local o los archivos `secrets/*` indicados por `compose.yaml`.

## Rutas principales

- `/`: home publica.
- `/casos`: indice de casos publicados.
- `/casos/[slug]`: detalle con capturas, stack, resultado, repo y demo.
- `/contacto`: formulario publico.
- `/admin`: panel privado, no indexable.
