# Políticas rígidas de seguridad para producción

## 1. Alcance y estándar

Estas políticas son requisitos de lanzamiento, no recomendaciones opcionales. Aplican a la aplicación, repositorio GitHub, imágenes, Docker, servidor Linux, Cloudflare, datos, backups y operación.

Baseline: OWASP ASVS 5.0 nivel 2 adaptado a un portfolio público con un panel administrativo y tratamiento de datos de contacto.

## 2. Modelo de amenazas resumido

### Activos

- Credencial y sesiones admin.
- Mensajes y emails de visitantes.
- Contenido y reputación pública.
- Base de datos y medios.
- Secrets de SMTP, DB, Cloudflare y sesión.
- Host doméstico y resto de la red local.
- Integridad de imágenes publicadas desde GHCR.

### Adversarios y fallas relevantes

- Bots de spam y credential stuffing.
- XSS/CSRF/inyección por formulario, Markdown o panel.
- Subidas maliciosas y path traversal.
- Dependencia o GitHub Action comprometida.
- Escape de contenedor o abuso del Docker socket.
- Acceso lateral desde el servidor hacia equipos domésticos.
- Pérdida física, disco fallando o borrado accidental.
- Configuración incorrecta de Tunnel/Access que exponga admin/origin.

## 3. Principios obligatorios

- Denegar por defecto.
- Mínimo privilegio.
- Dos barreras independientes para admin.
- Ningún secreto en Git, imagen, logs o cliente.
- Ningún puerto entrante desde Internet.
- Contenido activo cargado desde admin está prohibido.
- Backups sin restore probado no cuentan como backups.
- Automatizar controles repetibles; documentar excepciones con fecha de expiración.

## 4. Seguridad de aplicación

### 4.1 Autenticación

- Sin registro público.
- Email administrador normalizado y único.
- Password mínima de 16 caracteres; aceptar passphrases largas y gestores de contraseñas.
- Hash Argon2id como mínimo `m=19456 KiB`, `t=2`, `p=1`; calibrar hacia arriba para 100–500 ms en el servidor sin bajar del mínimo OWASP.
- Salt único gestionado por biblioteca mantenida.
- Pepper opcional guardado como secret separado de DB.
- Comparación constante provista por la biblioteca.
- Rate limit por identidad e IP/prefijo: ventana corta, backoff y lock temporal; no bloqueo permanente explotable.
- Mensaje de error genérico para usuario/contraseña.
- Registrar resultado, request ID y timestamp, nunca password.
- Reautenticación para cambiar password, exportar mensajes o revocar sesiones globales.
- Producción exige MFA en la identidad usada por Cloudflare Access. Si Access no la garantiza, habilitar TOTP en app antes de lanzar.

### 4.2 Sesiones

- Token aleatorio criptográfico de al menos 256 bits.
- Guardar solo hash del token en DB.
- Cookie `__Host-session` con `Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/` y sin `Domain`.
- Rotar al iniciar sesión y después de una reautenticación.
- Idle 30 minutos; absoluto 8 horas; ambos server-side.
- Actualizar `last_seen` de forma acotada para evitar una escritura por request.
- Logout revoca servidor y limpia cookie.
- Cambio de password revoca todas las sesiones.
- No usar session IDs en URL, localStorage ni respuestas JSON.
- `Cache-Control: no-store` en auth/admin.

### 4.3 Autorización

- Toda ruta, Server Action y API admin comprueba sesión y permiso en servidor.
- Ocultar un botón no es autorización.
- Consultas por ID siempre incluyen scope/autorización; evitar IDOR.
- Preview requiere sesión o token opaco corto, de un solo propósito, revocable y no indexable.
- `/admin/*` y `/api/admin/*` se protegen también con Cloudflare Access.

### 4.4 CSRF y origen

- Mutaciones con cookie de sesión requieren token CSRF sincronizado o mecanismo equivalente robusto del framework.
- Verificar `Origin`/`Host` contra allowlist exacta.
- Rechazar content types inesperados.
- `SameSite` es defensa adicional, no reemplazo del token.
- GET/HEAD nunca mutan estado.
- Token CSRF nunca en URL ni logs.

### 4.5 Validación e inyección

- Zod server-side en todos los inputs, incluyendo params, query, headers relevantes y variables de settings.
- Límites de longitud, arrays, nesting y tamaño de body antes de operaciones costosas.
- ORM parametrizado; SQL raw solo con parámetros y review.
- No interpolar input en shell, rutas, templates de email o consultas.
- URLs externas solo `https:`/`mailto:` según campo; bloquear esquemas activos y credenciales embebidas.
- Redirects internos por rutas allowlisted.
- Normalizar Unicode donde afecte unicidad, slug o email.
- Errores públicos sin stack, SQL, path o dependencia.

### 4.6 XSS y contenido

- React escaping por defecto.
- Prohibido `dangerouslySetInnerHTML` salvo wrapper único con sanitización probada.
- Markdown sin HTML crudo.
- No MDX, JSX, scripts, handlers, iframes ni estilos cargados desde DB.
- Links Markdown validan esquema y agregan `rel="noopener noreferrer"` si abren otra pestaña.
- Mermaid solo si se renderiza en servidor con configuración segura; preferir SVG/PNG derivado y sanitizado.
- CSP en enforcement con nonce por request. No `unsafe-eval`; evitar `unsafe-inline` fuera de estilos justificados por nonce/hash.
- Turnstile y fuentes/medios agregan únicamente orígenes mínimos documentados.

### 4.7 Headers

Mínimos en producción:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
Content-Security-Policy: política nonceada específica del proyecto
```

- Agregar `preload` a HSTS solo después de verificar que todos los subdominios soportan HTTPS permanentemente.
- CSP se prueba primero en Report-Only y luego pasa a enforcement antes del lanzamiento.
- No duplicar headers contradictorios entre Cloudflare y Next.js.

### 4.8 Contacto y abuso

- Turnstile obligatorio y validado server-side. La validación cliente no tiene valor de seguridad.
- Honeypot, tiempo mínimo y rate limit por HMAC de IP/prefijo.
- No almacenar token Turnstile.
- Body máximo pequeño antes de parsear.
- Idempotency key derivada de nonce del formulario + sesión anónima/ventana, sin guardar secreto plano.
- Limitar longitud de email templates y escapar contenido.
- No reflejar mensaje enviado en HTML sin escape.
- Notificación por SMTP no incluye datos en asunto salvo identificador; minimizar PII en previsualizaciones.
- Respuesta pública no revela clasificación de spam ni estado SMTP.

### 4.9 Uploads

- MVP acepta solo JPEG, PNG, WebP y AVIF.
- Máximo recomendado: 10 MiB por archivo y dimensiones máximas razonables, por ejemplo 12000×12000 antes de decodificar de forma protegida.
- Validar extensión, MIME declarado, magic bytes y decodificación.
- Nombre aleatorio generado por servidor; nunca concatenar nombre original a path.
- Guardar temporal en `tmpfs` con cuota.
- Re-encode con Sharp y eliminar metadata/EXIF.
- Guardar fuera del webroot.
- Servir derivados por ID/handler con `nosniff` y Content-Type controlado.
- SVG, PDF, ZIP, HTML y ejecutables deshabilitados en MVP.
- Solo admin autorizado puede subir.
- Registrar hash, tamaño, dimensiones y resultado, no bytes.

### 4.10 Datos, privacidad y logs

- Minimización: no guardar IP plana; usar HMAC rotado solo si se necesita abuso/idempotencia.
- Encriptar backups; secretos no se incluyen en dumps.
- Redactar headers `authorization`, `cookie`, `set-cookie`, passwords, tokens, emails y cuerpos.
- Los audit diffs excluyen campos PII o los marcan como “changed”.
- Logs normales 30 días; audit admin 12 meses; mensajes 24 meses por defecto.
- Acceso/exportación de mensajes requiere reauth y evento de auditoría.
- No enviar PII a analítica.
- Actualizar política de privacidad con Cloudflare, Turnstile, SMTP y retención reales.

## 5. Cloudflare y exposición

### 5.1 Tunnel

- Única entrada pública: Cloudflare Tunnel administrado.
- Prohibido port forwarding 80/443/3000/5432 en el router.
- Firewall host default deny inbound.
- `cloudflared` realiza salida al puerto requerido por Cloudflare; limitar egreso cuando sea operativo.
- Ingress termina con regla catch-all `http_status:404`.
- El hostname público apunta únicamente al servicio `web` de la red `edge`.
- No configurar origins por IP LAN amplia ni Docker socket.
- Token/credencial de tunnel como secret read-only, con rotación tras sospecha.

### 5.2 Access

- Aplicación path-scoped para `example.com/admin/*` y `example.com/api/admin/*`, o subdominio admin dedicado.
- Política allowlist solo para la identidad de Facundo.
- MFA exigido en el IdP.
- Session duration corta y revisión de eventos.
- La app sigue validando su propia sesión; Access no reemplaza auth interna.
- Health público devuelve solo `ok`; readiness detallado se restringe.

### 5.3 Edge

- TLS “Full (strict)” si hay TLS de origen; con Tunnel al servicio HTTP interno, confiar solo dentro de la red Docker aislada.
- WAF/rate limit para `/api/contact`, `/admin` y login.
- Turnstile secret validado en servidor.
- Cache bypass para admin, API, preview y respuestas con cookies/PII.
- Cache solo de assets y páginas públicas seguras.
- Ocultar email administrativo de reglas públicas cuando sea posible.

## 6. Docker y Compose

### 6.1 Host Docker

- Preferir Docker rootless. Si no es viable, usar `userns-remap` y documentar por qué.
- Solo el usuario de despliegue controla Docker; pertenecer al grupo `docker` equivale prácticamente a root.
- Docker API/socket nunca expuesto por TCP ni montado en contenedores.
- Mantener seccomp y AppArmor por defecto o perfiles más restrictivos; nunca `unconfined` sin excepción aprobada.
- Actualizaciones de Docker/Compose dentro de ventana controlada.

### 6.2 Imágenes

- Base oficial mínima y soportada, fijada por digest.
- Multi-stage; herramientas de build ausentes en runtime.
- Usuario no root con UID/GID definidos.
- Sin shell/package manager si una imagen distroless compatible resulta operable; priorizar debug seguro si no.
- `.dockerignore` excluye `.git`, `.env*`, backups, tests con secretos, docs privados y node_modules.
- Ningún secret mediante `ARG`, `ENV`, `COPY` o capas.
- SBOM, scan y attestation antes de producción.
- Tag de release inmutable más digest; deploy por digest.

### 6.3 Servicios

Requisitos en Compose:

```yaml
read_only: true
init: true
cap_drop:
  - ALL
security_opt:
  - no-new-privileges:true
tmpfs:
  - /tmp:rw,noexec,nosuid,nodev,size=64m
```

Adaptar solo si una dependencia demuestra incompatibilidad. Además:

- `user` no root.
- `pids_limit`, memory/CPU y ulimits razonables.
- `restart: unless-stopped` para servicios persistentes.
- Healthcheck con timeout y retries.
- Redes `edge` y `backend`; `backend.internal: true` cuando sea compatible con necesidades de egreso.
- DB sin `ports` y con volumen exclusivo.
- Media con acceso RW solo en `web`; derivados/backup con permisos mínimos.
- Secrets Compose montados desde `/run/secrets`; cada servicio recibe solo los suyos.
- No `privileged`, `pid: host`, `ipc: host`, `network_mode: host`, devices o mounts amplios.
- No auto-update ciego con Watchtower.

## 7. Servidor Linux y red doméstica

### 7.1 Sistema

- Distribución LTS soportada y mínima.
- Parches de seguridad automáticos con ventana y reinicio planificado.
- Usuario de deploy separado; login root SSH deshabilitado.
- SSH solo desde LAN/VPN administrativo, con claves, sin password.
- UFW/nftables: inbound deny; permitir solo administración desde subnet/VPN definida.
- No exponer Cockpit, Portainer, DB UI ni paneles de monitoreo a Internet.
- AppArmor activo; Secure Boot si el hardware lo soporta.
- Hora sincronizada; zona operativa puede ser UTC.
- Disco con SMART y alertas de espacio/inodos.
- Logs con rotación y cuotas.

### 7.2 Segmentación

- Ideal: servidor en VLAN/segmento propio.
- Bloquear conexiones iniciadas desde el servidor hacia PCs, móviles, NAS e IoT domésticos salvo destinos explícitos.
- Permitir solo DNS/NTP, actualizaciones, GHCR/GitHub, SMTP, Cloudflare y backup según necesidad.
- No montar carpetas personales del host en contenedores.
- Si no hay VLAN, aplicar firewall host y del router para reducir movimiento lateral.

### 7.3 Acceso físico y recuperación

- BIOS/UEFI con boot externo restringido cuando sea práctico.
- LUKS recomendado si el equipo puede desbloquearse operativamente después de reinicios; documentar tradeoff de disponibilidad.
- Secrets con permisos `0400` propiedad del usuario de deploy.
- Recovery codes/MFA guardados fuera del servidor.

## 8. GitHub y cadena de suministro

### 8.1 Cuenta y repositorio

- MFA/passkey en GitHub.
- Repositorio privado durante desarrollo; hacerlo público solo después de revisar historia y secretos.
- `main` protegida mediante ruleset: PR obligatorio, status checks, conversaciones resueltas, bloquear force push y deletion.
- Aplicar ruleset también a administradores si el plan lo permite.
- `CODEOWNERS` para `.github/`, `infra/`, auth, DB y security.
- Commits/tags de release firmados cuando sea viable.
- Push protection/secret scanning habilitado según disponibilidad del plan.

### 8.2 Actions

- `permissions: contents: read` por defecto; elevar por job al mínimo.
- Acciones de terceros fijadas por SHA completo, con comentario de versión.
- Dependabot actualiza npm, Docker y GitHub Actions.
- No ejecutar código de PR no confiable con secretos.
- Evitar `pull_request_target`; si es imprescindible, diseño específico y review de seguridad.
- Environments para producción con aprobación manual.
- Secrets solo en GitHub Environments cuando el workflow realmente los necesita.
- Preferir `GITHUB_TOKEN` de corto alcance y OIDC/attestations; evitar PAT largos.
- No imprimir contexts completos ni activar debug con secrets.
- Retención de artifacts mínima.

### 8.3 Gates

- Lockfile integrity/frozen install.
- Lint, typecheck, tests, build.
- CodeQL/SAST.
- Dependency review y Dependabot.
- Secret scan.
- Scan de imagen y filesystem.
- SBOM.
- Artifact attestation.
- Bloquear release por vulnerabilidades críticas/altas explotables; excepción escrita con owner, mitigación y fecha de vencimiento.

### 8.4 Despliegue

- Prohibido un runner autohospedado con acceso al Docker socket del servidor de producción.
- GitHub construye y publica imagen; el servidor hace pull por digest aprobado.
- Verificar attestation antes de ejecutar.
- Deployment registra commit, digest, migración, hora y resultado.

## 9. Base de datos

- Usuario DB exclusivo de aplicación, sin superuser ni creación de roles/db.
- Usuario separado para migraciones con privilegios acotados.
- Passwords desde secrets.
- Escuchar solo en red Docker interna.
- `pg_hba.conf` restrictivo.
- Queries parametrizadas y timeouts.
- Backups con `pg_dump`/herramienta equivalente consistente; verificar exit code y tamaño.
- Minor updates regulares.
- No conectar herramientas de administración desde Internet.

## 10. Backups

- Regla 3-2-1: datos activos + copia local separada + copia cifrada off-site.
- DB diario; medios/config semanal o según cambios.
- Cifrado antes de salir del host con restic o herramienta equivalente.
- Credencial de backup con permiso solo sobre destino dedicado.
- Retención sugerida: 7 diarios, 4 semanales, 6 mensuales.
- Verificación automática y restore de prueba mensual/trimestral.
- Backups no contienen secrets salvo archivo cifrado separado con procedimiento explícito.
- Alertar si antigüedad del último backup válido supera 26 h.
- RPO 24 h, RTO 4 h.

## 11. Gestión de vulnerabilidades y parches

- Dependabot semanal y seguridad inmediata.
- Revisar advisories de Next.js; usar como mínimo `16.3.3` o parche posterior seguro de la rama activa.
- Node solo LTS soportado; no Node 20 EOL.
- PostgreSQL siempre en minor actual de la major elegida.
- Imagen base rebuild al menos semanal aunque el código no cambie.
- Parches críticos: evaluar y desplegar dentro de 24–72 h según exposición.
- Mantener digest anterior y backup predeploy.

## 12. Monitoreo e incidentes

Alertar por:

- Múltiples fallos de login.
- Aumento de 5xx.
- Cola SMTP en dead state.
- Tunnel desconectado.
- DB no ready.
- Disco >80% y >90%.
- Backup vencido/fallido.
- Reinicios repetidos de contenedores.

Runbook de incidente:

1. Contener: deshabilitar hostname/Access o detener `cloudflared` si hay compromiso activo.
2. Preservar logs relevantes sin copiar PII innecesaria.
3. Rotar secrets afectados: sesiones, DB, SMTP, tunnel, GitHub.
4. Revocar todas las sesiones.
5. Identificar commit/digest y vector.
6. Restaurar desde imagen/datos conocidos.
7. Verificar integridad, pruebas y controles.
8. Documentar causa, impacto, corrección y prevención.

## 13. Checklist de go-live

### Aplicación

- [ ] No existe login demo/bypass.
- [ ] Slugs inexistentes retornan 404.
- [ ] CSP enforcement y headers pasan tests.
- [ ] CSRF/origin/rate limits/Turnstile probados.
- [ ] Uploads adversariales rechazados.
- [ ] Logs no contienen PII/secrets.
- [ ] Contenido y métricas reales aprobados.

### GitHub

- [ ] Ruleset activo.
- [ ] Actions con permisos mínimos y SHA completo.
- [ ] Dependabot, dependency review, CodeQL y secret scanning configurados.
- [ ] Imagen escaneada, SBOM y attestation generados.

### Docker/host

- [ ] Sin puertos publicados.
- [ ] Sin Docker socket/privileged/host network.
- [ ] Non-root, no-new-privileges, cap drop y read-only verificados.
- [ ] Firewall deny inbound y SSH restringido.
- [ ] Segmentación de red aplicada.

### Cloudflare

- [ ] Tunnel único y saludable.
- [ ] Catch-all 404.
- [ ] Access protege admin y API admin con MFA.
- [ ] Cache bypass para datos privados.
- [ ] Rate limits y Turnstile activos.

### Recuperación

- [ ] Backup cifrado reciente.
- [ ] Restore probado en host limpio.
- [ ] Rollback probado al digest anterior.
- [ ] Credenciales de recuperación guardadas fuera del servidor.

## 14. Fuentes normativas y técnicas

- [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP: almacenamiento de contraseñas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP: gestión de sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP: prevención de CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP: file uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Next.js: Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy)
- [Next.js: security release de agosto de 2026](https://nextjs.org/blog/august-2026-security-release)
- [Cloudflare Tunnel outbound-only](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
- [Cloudflare Access policies](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)
- [Cloudflare Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Docker rootless](https://docs.docker.com/engine/security/rootless/)
- [Docker Compose secrets](https://docs.docker.com/compose/how-tos/use-secrets/)
- [Docker Compose service hardening options](https://docs.docker.com/reference/compose-file/services/)
- [Docker seccomp](https://docs.docker.com/engine/security/seccomp/)
- [Docker AppArmor](https://docs.docker.com/engine/security/apparmor/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub supply-chain best practices](https://docs.github.com/en/code-security/tutorials/implement-supply-chain-best-practices/securing-code)
- [GitHub artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)
