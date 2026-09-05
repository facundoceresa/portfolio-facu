# ADR 0001 - Monolito modular Next.js

## Estado

Aceptada.

## Decision

Usar Next.js 16.3.3 como monolito modular con Route Handlers, Server Components y PostgreSQL mediante Drizzle.

## Consecuencias

- Menos servicios, menos superficie operativa y despliegue simple para homelab.
- La API admin queda dentro de la misma imagen que el frontend.
- Si aparece un segundo cliente o carga independiente, se evaluara extraer API en otro ADR.
