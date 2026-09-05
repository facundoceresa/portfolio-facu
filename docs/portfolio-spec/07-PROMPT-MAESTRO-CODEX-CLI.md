# Prompt maestro para Codex CLI

Copiar desde “INICIO DEL PROMPT” hasta “FIN DEL PROMPT”. Colocar antes esta carpeta dentro del repositorio como `docs/portfolio-spec/`.

---

## INICIO DEL PROMPT

Quiero que construyas de punta a punta mi portfolio full-stack autohospedado.

Referencia visual pública obligatoria:  
https://core-composition.lovable.app/

Especificación local obligatoria:

- `docs/portfolio-spec/00-README.md`
- `docs/portfolio-spec/01-AUDITORIA-DISENO-Y-FUNCIONES.md`
- `docs/portfolio-spec/02-PRD.md`
- `docs/portfolio-spec/03-ALCANCE-Y-CRITERIOS-DE-ACEPTACION.md`
- `docs/portfolio-spec/04-STACK-Y-ARQUITECTURA.md`
- `docs/portfolio-spec/05-MODELO-DE-DATOS-Y-API.md`
- `docs/portfolio-spec/06-POLITICAS-DE-SEGURIDAD.md`

### 1. Uso obligatorio de skills

1. Descubre las skills instaladas y lee completamente sus `SKILL.md` antes de actuar.
2. Usa primero `$clone-site` para inspeccionar y reconstruir la referencia pública: páginas, estados, responsive, tokens, tipografías, espaciado, fondos, animaciones e interacciones.
3. Usa después `$ui-ux-pro-max` para auditar fidelidad, responsive, accesibilidad, jerarquía, microinteracciones y consistencia.
4. Registra en el plan las acciones requeridas por ambas skills y cumple sus flujos de verificación.
5. Si alguna de estas dos skills no está instalada o no puede leerse, detente antes de escribir código e informa exactamente cuál falta. No la simules ni la sustituyas silenciosamente.

### 2. Resultado esperado

Recrea la app visualmente 1:1, pero no copies su código ni sus fallas. El sitio final debe ser una aplicación real con:

- Frontend público bilingüe.
- PostgreSQL.
- Panel administrativo real.
- CRUD de proyectos, casos, medios, mensajes y contenido fijo.
- Formulario de contacto persistente y protegido.
- Autenticación y sesiones reales.
- Docker Compose seguro.
- Cloudflare Tunnel como única entrada pública.
- CI/CD seguro a GHCR.
- Backups, health checks, logs y runbooks.

No termines después de generar un plan, un mockup o un frontend estático. Implementa, prueba y documenta el producto completo dentro del alcance.

### 3. Fuentes de verdad y precedencia

1. Seguridad y protección de datos: `06-POLITICAS-DE-SEGURIDAD.md`.
2. Requisitos y criterios: PRD, alcance y modelo de datos.
3. Apariencia: sitio Lovable observado en vivo.
4. Contenido personal definitivo: datos reales proporcionados en el repo o por mí.

Si la referencia contradice seguridad, accesibilidad, datos reales o requisitos, conserva el lenguaje visual y corrige el comportamiento.

### 4. Hallazgos de la referencia que debes corregir

- El panel demo acepta cualquier credencial: eliminar completamente ese bypass.
- `/casos/[slug]` cambia URL/metadata pero muestra el índice: implementar detalle real y 404.
- El formulario no tiene pipeline backend real.
- Hay estadísticas, proyectos y resultados ficticios: no publicarlos.
- GitHub/LinkedIn apuntan a `#`: usar settings reales o dejar CTA no publicado.
- Aparecen Buenos Aires/Argentina: debe ser Montevideo, Uruguay.
- “No respondo a reclutadores” contradice el objetivo del portfolio: reescribir de forma profesional para aceptar oportunidades técnicas relevantes.
- Q1/Q2 2026 se vuelve obsoleto: administrar disponibilidad desde settings.
- Empresa/rol es inconsistente entre formulario y privacidad: hacerlo opcional.
- Quitar el badge y toda dependencia de Lovable.

### 5. Fidelidad visual no negociable

Conservar:

- Fondo `#0d1b2a`, superficies `#0a1521`, mint `#2dd4a8`, glow `#73ffb8`, fog `#e6fff5` y bordes mint de baja opacidad.
- Space Grotesk para display, DM Sans para cuerpo y JetBrains Mono para interfaz técnica.
- Retícula blueprint, header sticky translúcido, composición editorial asimétrica, tarjetas técnicas, líneas y sombras duras.
- Lenguaje `//`, numeración, underscores, terminal y cursores.
- Hero de gran escala, manifesto lateral, CTAs y ritmo vertical.
- Animaciones sutiles de entrada/hover/pulso/cursor con `prefers-reduced-motion`.

No conviertas el diseño en una plantilla SaaS, glassmorphism genérico, landing con gradients morados, cards redondeadas o estética AI genérica.

Captura baselines propios de la referencia y ejecuta visual regression en:

- 1440×900
- 1366×768
- 1024×768
- 768×1024
- 390×844
- 360×800

Objetivo: ≤5% de diferencia global con máscaras para animaciones; elementos principales dentro de ±4 px donde el responsive no exija otra composición.

### 6. Stack fijado

- Node.js 24 LTS.
- Next.js 16.3.3 o un parche de seguridad posterior compatible dentro de 16.x; nunca una versión anterior vulnerable.
- React soportado por esa versión de Next.js.
- TypeScript estricto.
- Tailwind CSS 4 + variables/CSS propio.
- Motion para React solo donde aporte.
- PostgreSQL 18 en minor vigente.
- Drizzle ORM y migraciones revisadas.
- Zod.
- Pino con redacción.
- Sharp para imágenes.
- SMTP/Nodemailer.
- pnpm con lockfile congelado.
- Vitest, Testing Library, Playwright, axe y Lighthouse CI.

Arquitectura: monolito modular Next.js. No crear API NestJS separada, Redis, Kubernetes ni page builder salvo que una restricción técnica real lo haga imprescindible; en ese caso escribe un ADR antes.

### 7. Rutas requeridas

Públicas ES:

- `/`
- `/stack`
- `/casos`
- `/casos/[slug]`
- `/contacto`
- `/privacidad`
- `/terminos`

Públicas EN equivalentes bajo `/en`.

Admin:

- `/admin`
- `/admin/proyectos`
- `/admin/casos`
- `/admin/medios`
- `/admin/mensajes`
- `/admin/ajustes`
- `/admin/auditoria` si el alcance lo permite; si no, integrar auditoría en ajustes.

Sistema:

- `/api/contact`
- `/api/health/live`
- `/api/health/ready`
- APIs/actions admin protegidas.

### 8. Administración sin perder el diseño

El layout se define en código. La DB administra contenido, traducciones, orden, publicación y settings allowlisted.

No construyas un page builder. No guardes JSX, MDX ejecutable, HTML crudo, scripts o estilos arbitrarios. Los casos usan Markdown seguro/bloques allowlisted.

Implementa estados `draft`, `review`, `published`, `archived`, preview protegido, soft delete, redirects al cambiar slug y audit log. Los seeds ficticios deben quedar en `draft`; producción comienza sin logros inventados.

### 9. Contacto

Implementa nombre, email, empresa/rol opcional, alcance, presupuesto, mensaje y consentimiento. Comparte esquema Zod cliente/servidor.

Obligatorio:

- Turnstile con validación server-side.
- Honeypot y tiempo mínimo.
- Rate limit.
- Idempotencia.
- Persistir antes de SMTP.
- Cola/retry simple persistida en PostgreSQL.
- Mensaje visible en panel aunque SMTP falle.
- Logs sin email ni cuerpo.
- Estados accesibles y traducidos.

No implementes adjuntos en MVP.

### 10. Autenticación y seguridad

Cumple íntegramente `06-POLITICAS-DE-SEGURIDAD.md`. En particular:

- Sin registro público ni demo login.
- Argon2id con parámetros OWASP como piso.
- Sesión opaca de 256 bits, hash en DB, revocable y rotada.
- Cookie `__Host-`, Secure, HttpOnly, SameSite Strict.
- Idle 30 min y absoluto 8 h.
- CSRF + Origin/Host en mutaciones.
- Rate limit/cooldown de login.
- Cloudflare Access delante de `/admin/*` y `/api/admin/*`, sin reemplazar auth propia.
- CSP nonceada en enforcement, sin `unsafe-eval`.
- Headers de seguridad probados.
- Markdown seguro y sin HTML.
- Uploads solo JPEG/PNG/WebP/AVIF, firma real, re-encode, EXIF eliminado, nombre aleatorio y almacenamiento fuera de webroot.
- PII y secretos redactados.
- Baseline OWASP ASVS 5.0 L2.

### 11. Docker y servidor

Crea `Dockerfile`, `compose.yaml` y `compose.dev.yaml`.

Servicios: `web`, `db`, `cloudflared`, `migrate` one-shot y perfil/job `backup`.

Producción:

- Cero `ports:` publicados al host.
- Redes `edge` y `backend`; DB solo backend.
- cloudflared solo edge y solo llega a web.
- Non-root, `read_only`, `tmpfs`, `cap_drop: ALL`, `no-new-privileges`, límites, healthchecks y logs rotados.
- Nada privileged, host network, Docker socket, mounts amplios o tag `latest`.
- Secrets mediante archivos Compose `/run/secrets`; `.env.example` contiene solo nombres/valores no sensibles de ejemplo.
- Ingress del tunnel termina en catch-all 404.

Crea runbooks exactos para:

- Bootstrap de Linux/Docker rootless.
- Firewall y segmentación doméstica.
- Cloudflare Tunnel/Access/Turnstile sin guardar tokens.
- Crear admin desde entrada segura.
- Deploy por digest.
- Migración.
- Backup cifrado.
- Restore en host limpio.
- Rollback.
- Rotación de secrets e incidente.

### 12. GitHub/CI

Crea workflows y documentación para:

- Lint, typecheck, tests, build, E2E, axe y visual regression.
- CodeQL, dependency review, secret scan y scan de imagen.
- SBOM y artifact attestation.
- Publicación GHCR.
- Deploy solo como promoción manual de digest; no conectes un runner con Docker socket al servidor doméstico.

GitHub Actions:

- `permissions: contents: read` por defecto.
- Permisos mínimos por job.
- Acciones fijadas por SHA completo con comentario de versión.
- No `pull_request_target` con secrets.
- Dependabot para npm, Docker y Actions.
- Documenta ruleset de `main`, status checks, no force push/deletion y CODEOWNERS.

### 13. Método de ejecución

1. Inspecciona repo y preserva cambios existentes/no relacionados.
2. Lee todas las specs y skills.
3. Audita la referencia con `$clone-site` en todas las rutas/estados accesibles.
4. Crea un plan por fases y mantenlo actualizado.
5. Escribe ADRs para decisiones que cambien lo fijado.
6. Implementa primero un vertical slice real: Inicio + DB + un proyecto + auth + panel mínimo.
7. Completa resto de rutas y CRUDs.
8. Aplica seguridad e infraestructura desde el inicio, no al final.
9. Ejecuta pruebas y corrige fallas.
10. Usa `$ui-ux-pro-max` para QA final e itera hasta cumplir los umbrales.
11. Verifica build y arranque desde checkout limpio con Docker.
12. No desplegar a Internet ni modificar Cloudflare/GitHub externo sin mi autorización explícita; deja configuración y runbooks listos.

### 14. Calidad y pruebas mínimas

- Unit: schemas, políticas, servicios y render de bloques.
- Integration: DB, sesiones, publicación, redirects, contacto, queue y media.
- E2E: navegación, locale, detalle/404, contacto, login/logout, CRUD/publish, preview y permisos.
- Security: CSRF, origin, rate limits, cookies, headers, cache, upload adversarial, XSS Markdown y noindex.
- Visual: todas las resoluciones.
- A11y: axe sin critical/serious; teclado y foco.
- Performance: Lighthouse y presupuestos; objetivo Core Web Vitals del PRD.
- Operations: migration, health, backup/restore y rollback.

No deshabilites tests ni bajes thresholds para “hacer verde” CI. Corrige la causa o documenta un bloqueo real.

### 15. Datos y placeholders

No inventes datos personales, URLs, métricas, clientes ni logros. Si faltan:

- Usa placeholders claramente marcados solo en desarrollo.
- Mantén el registro `draft`.
- Agrega una checklist en `docs/CONTENT-TODO.md`.
- No lo muestres en producción.

Proyectos reales candidatos que puedes preparar como borradores, sin inventar resultados:

- FOG/iPXE/Sysprep para imagen corporativa.
- Automatizaciones PowerShell, BitLocker, OCS y AD.
- Consulta de stock y calculadora de materiales conectadas a ERP.
- Integraciones/middleware de pedidos y facturación con SQL Server.
- N8N autohospedado con Docker y Cloudflare.
- OCS/Zabbix para inventario y monitoreo.

### 16. Entrega final

Al finalizar informa:

- Qué quedó implementado.
- Diferencias intencionales frente a Lovable.
- Resultados de tests, visual diff, axe, Lighthouse y scans.
- Arquitectura y digest/versión construida.
- Migraciones y seeds.
- Pasos pendientes que requieren mis credenciales o decisiones.
- Comandos exactos de desarrollo, build, backup, restore y deploy.
- Riesgos o excepciones aún abiertas.

No afirmes que algo está listo si no lo ejecutaste o verificaste.

## FIN DEL PROMPT
