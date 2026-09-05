# Verification Log

Fecha local: 2026-09-05, America/Montevideo.

## Runtime local verificado

- Dev server: `http://localhost:3000`.
- Docker standalone verificado: `http://127.0.0.1:3005`.
- Postgres local de prueba: contenedor `portfolio-facu-db-test`, Postgres 18.1, expuesto en `127.0.0.1:55432`.
- Imagen local final: `portfolio-facu-web:local`, image id `sha256:d29262fcb256ac9347d826be3d07e33710ff62382d434172b17740fbff8716f3`.

## Comandos en verde

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter web test:integration
pnpm build
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:e2e
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:a11y
WEB_BASE_URL=http://127.0.0.1:3000 pnpm --filter web test:visual
docker run --rm -v "$PWD":/repo ghcr.io/gitleaks/gitleaks:latest detect --source=/repo --redact -v
docker compose -f compose.yaml -f compose.dev.yaml config --quiet
WEB_IMAGE_DIGEST=ghcr.io/example/portfolio@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa APP_ORIGIN=https://portfolio.example docker compose -f compose.yaml config --quiet
docker build -t portfolio-facu-web:local .
curl -fsS http://127.0.0.1:3005/api/health/ready
docker run --rm -v /home/fceresa/projects/portfolio-facu:/src:ro zricethezav/gitleaks:v8.30.0 detect --source=/src --no-git --config=/src/.gitleaks.toml --redact --verbose
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock:ro aquasec/trivy:0.67.2 image --severity HIGH,CRITICAL --exit-code 1 --ignore-unfixed portfolio-facu-web:local
pnpm audit --prod --audit-level high
CHROME_PATH=/home/fceresa/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome pnpm --filter web exec lhci autorun --collect.url=http://127.0.0.1:3005/ --collect.numberOfRuns=1 --collect.settings.chromeFlags='--no-sandbox --headless=new'
```

## Resultados medidos

- Unit/integration: 3 archivos, 5 tests, verde.
- E2E publico: 3 tests, verde.
- Axe: 0 violaciones serious/critical en `/`, `/casos`, `/casos/sector07-control` y `/contacto`.
- Visual regression local: 10 snapshots, verde en home responsive, indice de casos desktop/mobile y detalle Sector 07 desktop/mobile.
- Build Next.js 16: 17 paginas generadas y rutas dinamicas compiladas correctamente.
- Sitemap: incluye rutas ES/EN de los 4 casos publicados.
- Open Graph: `/opengraph-image` responde `image/png`.
- Gitleaks fuente/historial local: no leaks found.
- Motion QA 2026-09-01: hero revalidado contra referencia con Playwright. Se restauró consola en `// core_manifesto` (`~/ceresa`, `$ whoami`, cursor `blink`) y matriz de capas bajo el hero. Se removieron reveals de hero/secciones/cards, `scroll-timeline` y drift del watermark porque Lovable los computa estáticos; quedan vivos `blink`, `pulse`, `scanline` y `marquee`. Hover alineado a `150ms cubic-bezier(0.4, 0, 0.2, 1)`: manifiesto `translate: -2px -2px`, filas `translate: -4px`, botón primario sin desplazamiento y glow doble.
- Lovable parity pass 2026-09-01: se recuperaron los icon buttons `github/linkedin/email` bajo los CTA del hero, el bloque de contacto `hola@ceresa.dev / linkedin / github`, el link `admin ↗` del footer y los iconos de flecha en CTA. La terminal de `// core_manifesto` ahora hidrata correctamente, se autotypea en ~2.5 s y permite click/teclado para avanzar o reiniciar. Se agregó `allowedDevOrigins` para `127.0.0.1`/`localhost`, WebSocket local en CSP dev y `devIndicators: false` para que localhost no muestre el indicador visual de Next.
- Lighthouse standalone: performance `0.97`, accessibility `1.00`, best-practices `1.00`, SEO `1.00`, FCP `0.8 s`, LCP `2.6 s`, CLS `0`, TBT `50 ms`.
- Contacto: POST válido devuelve `200`, persiste 1 mensaje y deja 1 entrega `pending` cuando SMTP no está configurado.
- Admin: login real con Argon2id verificado por Playwright; `/admin` sin sesión redirige a `/admin/login` y responde con `x-robots-tag: noindex, nofollow`.
- Docker runtime: usuario `1001(nextjs)`, Node `v24.14.0`, `npm`/`npx` removidos del runner.
- Trivy imagen: 0 HIGH/CRITICAL con `--ignore-unfixed`.
- Gitleaks fuente: no leaks found con `.gitleaks.toml`.
- Audit runtime: `pnpm audit --prod --audit-level high` sin vulnerabilidades conocidas.

## Excepciones abiertas

- `pnpm audit --audit-level high` completo sigue reportando `extract-zip <=2.0.1` vía `@lhci/cli > lighthouse > puppeteer-core > @puppeteer/browsers`. Npm no publica versión parcheada de `extract-zip`; no afecta runtime production y queda limitado a tooling dev/LHCI.
- Diff visual contra Lovable no llega al umbral de 5%: `9.02%`, `10.70%`, `10.78%`, `8.48%`, `10.79%`, `11.45%`. La mayor divergencia proviene de no publicar los 4 casos ficticios de Lovable, lo que reduce la altura local de escritorio de ~8448 px a ~4336 px; hero/sociales/terminal/contacto reclamados fueron corregidos y revalidados. Los mapas están en `docs/design-references/core-composition/diff-local-vs-reference-*.png`.
- CodeQL, Dependency Review, attestation y publicación GHCR están configurados en GitHub Actions, pero no se ejecutaron localmente.
- Cloudflare Tunnel, Access, Turnstile real, SMTP real y GHCR deploy por digest requieren credenciales/autorización externa.
