# Web app

Aplicacion publica y panel admin del portfolio de Facundo Ceresa.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- PostgreSQL con Drizzle ORM
- Playwright, Axe y Vitest para validacion

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
pnpm --filter web test:e2e
pnpm --filter web test:a11y
pnpm --filter web test:visual
```

## Seguridad

No guardar secretos en settings, seed, capturas ni archivos versionados. Usar `.env` local o los archivos `secrets/*` indicados por `compose.yaml`.
