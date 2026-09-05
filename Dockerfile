# syntax=docker/dockerfile:1.12
FROM docker.io/library/node:24.14.0-bookworm-slim@sha256:4bd6219054c8bebcd26a66bfd8ca0bd6e1024b4b97474c59bb7ee3bbcbef4fe8 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM docker.io/library/node:24.14.0-bookworm-slim@sha256:4bd6219054c8bebcd26a66bfd8ca0bd6e1024b4b97474c59bb7ee3bbcbef4fe8 AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/scripts/migrate-runtime.mjs ./apps/web/scripts/migrate-runtime.mjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/drizzle ./apps/web/drizzle
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
