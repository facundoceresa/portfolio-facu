# Operations Runbook

## Bootstrap Linux/Docker rootless

1. Instalar una distribucion LTS minima.
2. Crear usuario `deploy`.
3. Habilitar SSH con claves, sin login root y sin password.
4. Instalar Docker Engine rootless para `deploy`.
5. Verificar `docker context ls` y `docker compose version`.
6. Activar actualizaciones de seguridad del sistema.

## Firewall y segmentacion domestica

1. Politica inbound deny.
2. Permitir SSH solo desde LAN/VPN administrativa.
3. No crear port forwards 80/443/3000/5432.
4. Si existe VLAN, ubicar el host en segmento dedicado.
5. Bloquear egreso desde el host hacia PCs/NAS/IoT salvo destinos explicitos.

## Cloudflare Tunnel/Access/Turnstile

1. Crear Tunnel en Cloudflare.
2. Guardar token en `secrets/cloudflared_token` con permiso `0400`.
3. Configurar hostname publico hacia `http://web:3000`.
4. Configurar catch-all 404.
5. Crear Access path-scoped para `/admin/*` y `/api/admin/*`.
6. Exigir MFA en el IdP.
7. Crear Turnstile y guardar secret en `secrets/turnstile_secret`.

## Crear admin

```bash
ADMIN_EMAIL=facundo@example.com ADMIN_PASSWORD_FILE=/run/secrets/admin_initial_password pnpm --filter web db:create-admin
```

No pasar contrasenas por argumentos.

## Deploy por digest

1. Ejecutar workflow `release`.
2. Copiar digest GHCR aprobado.
3. En servidor, editar `.env` con `WEB_IMAGE_DIGEST=ghcr.io/owner/repo@sha256:...`.
4. Ejecutar backup.
5. Ejecutar migracion.
6. Levantar servicios.
7. Verificar `/api/health/live` y `/api/health/ready`.

```bash
docker compose --profile backup run --rm backup
docker compose --profile migrate run --rm migrate
docker compose up -d web cloudflared
```

## Backup cifrado

El job incluido crea dump local. Para off-site cifrado usar restic:

```bash
restic backup /var/lib/docker/volumes/portfolio-facu_postgres_data /var/lib/docker/volumes/portfolio-facu_media_data
restic snapshots
restic check
```

## Restore en host limpio

1. Instalar Docker rootless.
2. Recuperar secrets desde custodia externa.
3. Restaurar volumen DB/media desde backup cifrado.
4. Ejecutar `docker compose up -d db`.
5. Restaurar dump con `pg_restore`.
6. Ejecutar migracion y health checks.

## Rollback

1. Mantener digest anterior en `deployments.log`.
2. Ejecutar backup pre-rollback.
3. Cambiar `WEB_IMAGE_DIGEST` al digest anterior.
4. Ejecutar `docker compose up -d web`.
5. Verificar health y rutas publicas.

## Rotacion de secrets e incidente

1. Contener: detener `cloudflared` o deshabilitar hostname.
2. Preservar logs necesarios sin copiar PII innecesaria.
3. Rotar `SESSION_SECRET`, DB, SMTP, Turnstile, Tunnel y GitHub si aplica.
4. Revocar sesiones admin en DB.
5. Restaurar desde digest/datos conocidos.
6. Documentar causa, impacto y prevencion.
