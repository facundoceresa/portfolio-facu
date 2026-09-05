# Portfolio Facundo Ceresa

Portfolio full-stack autohospedado de Facundo Ceresa. El proyecto muestra casos reales, evidencia visual local, un panel admin protegido y una base de despliegue pensada para publicarse por Cloudflare Tunnel.

## Que incluye

- Home publica con casos destacados y enlaces sociales.
- Paginas de casos con capturas locales, stack tecnico, resultados y repositorios.
- Version en espanol e ingles.
- Formulario de contacto con validacion, consentimiento, honeypot, Turnstile opcional, rate limit e idempotencia.
- Panel admin privado para proyectos, casos, medios, mensajes, ajustes y auditoria.
- CI con lint, typecheck, tests, build, e2e, accesibilidad, visual regression, CodeQL, dependency review y secret scan.

## Desarrollo

```bash
corepack enable pnpm
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env
pnpm --filter web db:migrate
pnpm --filter web db:seed:dev
ADMIN_EMAIL=facundo@example.com pnpm --filter web db:create-admin
pnpm dev
```

## Validación

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm --filter web test:e2e
pnpm --filter web test:a11y
pnpm --filter web test:visual
```

## Secretos

Los archivos `.env`, `.env.*`, `secrets/`, backups, storage local, reportes y caches estan ignorados. Antes de publicar cambios:

```bash
pnpm scan:secrets:no-git
git status --ignored --short
```

En produccion, `compose.yaml` lee secretos desde archivos montados en `/run/secrets`; no se deben commitear valores reales de DB, SMTP, Turnstile, sesion, CSRF, IP hash, Cloudflare ni GitHub.

## Producción

Producción usa `compose.yaml` sin puertos publicados al host. La única entrada pública debe ser Cloudflare Tunnel. Ver `docs/operations/RUNBOOK.md`.
