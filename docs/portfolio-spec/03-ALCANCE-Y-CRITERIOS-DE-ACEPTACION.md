# Alcance y criterios de aceptación

## 1. Alcance incluido

### Experiencia pública

- Réplica responsive de Inicio, Stack, Casos, detalle de caso, Contacto, Privacidad y Términos.
- Español e inglés.
- Animaciones, hover, estados activos y reduced motion.
- Metadata, sitemap, robots, OG y datos estructurados.
- Páginas 404 y error coherentes con el diseño.
- Enlaces reales y sin badge/dependencias de Lovable.

### Backend

- PostgreSQL y migraciones versionadas.
- CRUD de proyectos y casos.
- Contenido estructurado de páginas.
- Biblioteca de imágenes segura.
- Formulario de contacto con persistencia y notificación SMTP.
- Bandeja de mensajes.
- Autenticación, sesiones y auditoría.
- Endpoints de salud.

### Panel

- Login real.
- Dashboard con información real.
- Gestión de proyectos, casos, medios, mensajes y ajustes.
- Preview de borradores.
- UI consistente con la referencia.

### Infraestructura

- Dockerfile multi-stage.
- `compose.yaml` de producción y override de desarrollo.
- PostgreSQL y `cloudflared` en redes separadas.
- Configuración sin publicación de puertos al host.
- Secrets, health checks, límites de recursos y hardening.
- Scripts/runbooks de bootstrap, migración, deploy, rollback, backup y restore.

### Repositorio y CI

- Lint, typecheck, unit, integration, E2E, accessibility, visual regression y build.
- Escaneo de dependencias, secretos, código e imagen.
- Build de imagen y publicación a GHCR por digest.
- Reglas y documentación de seguridad de GitHub.

## 2. Fuera de alcance del MVP

- Comentarios públicos.
- Registro o cuentas de visitantes.
- Newsletter.
- Chat en tiempo real.
- CRM externo.
- Adjuntos en el formulario de contacto.
- Editor visual libre o drag-and-drop de páginas.
- Ejecución de HTML/MDX/JavaScript arbitrario.
- Kubernetes, service mesh o microservicios.
- Alta disponibilidad multi-host.
- Aplicación móvil nativa.
- Almacenamiento S3 obligatorio; puede añadirse después.
- Analítica invasiva, publicidad o tracking cross-site.

## 3. Entregables esperados del repositorio

```text
portfolio/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       ├── public/
│       └── tests/
├── packages/
│   ├── db/
│   ├── schemas/
│   ├── ui/
│   └── config/
├── infra/
│   ├── cloudflare/
│   ├── docker/
│   ├── scripts/
│   └── systemd/
├── docs/
│   ├── adr/
│   ├── operations/
│   ├── security/
│   └── visual-baseline/
├── .github/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── dependabot.yml
├── compose.yaml
├── compose.dev.yaml
├── Dockerfile
├── .env.example
├── SECURITY.md
└── README.md
```

Se permite una estructura equivalente si Codex justifica la diferencia en un ADR.

## 4. Criterios de aceptación por área

### CA-VIS — Fidelidad visual

- Se utilizan capturas propias de la referencia como baseline, sin incorporarlas al sitio final.
- Las seis resoluciones definidas en la auditoría tienen snapshots de referencia y resultado.
- La diferencia visual global es ≤ 5% después de enmascarar cursores, timestamps y animaciones.
- Elementos principales no difieren más de 4 px en posición/tamaño en desktop y tablet, salvo adaptación responsive documentada.
- Paleta, fuentes, pesos, tracking, bordes, fondos y glow coinciden con los tokens observados.
- No aparecen componentes de apariencia genérica ajenos al sistema visual.
- No queda el badge de Lovable.

### CA-RESP — Responsive

- No hay overflow horizontal en `360`, `390`, `768`, `1024`, `1366` y `1440 px`.
- Header y navegación móvil son operables por teclado/touch.
- H1 usa escala fluida sin cortar nombre ni invadir el manifiesto.
- Cards y formulario conservan orden lógico al apilarse.
- Áreas táctiles tienen al menos 44×44 px cuando corresponde.

### CA-A11Y — Accesibilidad

- `axe` sin violaciones críticas o serias en rutas principales.
- Todo input tiene label, nombre, autocomplete aplicable y error asociado.
- Un lector de pantalla recibe confirmación y error del formulario.
- Modales atrapan foco, cierran con Escape y devuelven foco al disparador.
- No se depende solo del color para estados.
- Reduced motion funciona y no rompe el layout.

### CA-PUB — Contenido público

- Solo se muestran registros `published`.
- Slug inexistente devuelve 404, no el índice.
- Cambio de idioma conserva página y entidad equivalente.
- Metadata y OG son correctos y no contienen texto demo.
- Links externos reales abren de manera segura; no existen `href="#"`.
- Ubicación y disponibilidad coinciden con settings reales.

### CA-CON — Contacto

- Esquema de validación compartido cliente/servidor.
- Turnstile se valida en servidor; un token ausente, inválido, vencido o reutilizado falla.
- Honeypot, timing y rate limit funcionan.
- Reenvío por doble click o retry no duplica mensajes.
- El mensaje se guarda antes de intentar SMTP.
- Fallo SMTP crea evento/estado de entrega fallida, sin perder el lead.
- No se registra el cuerpo completo ni email en logs operativos.
- Pruebas cubren éxito, validación, spam, rate limit, DB caída y SMTP caída.

### CA-AUTH — Panel y sesiones

- No existe bypass demo ni credencial hardcodeada.
- `/admin/*` y `/api/admin/*` están bloqueadas sin sesión válida aun si se evita Cloudflare.
- En producción, Cloudflare Access bloquea antes de llegar a la app.
- Password almacenada únicamente como Argon2id.
- Cookie `__Host-` con `Secure`, `HttpOnly`, `SameSite=Strict` y `Path=/`.
- Rotación tras login y revocación tras logout.
- Idle timeout de 30 minutos y máximo absoluto de 8 horas, configurables.
- Mutaciones admin requieren CSRF y validación de origen.
- Intentos fallidos tienen rate limit y auditoría sin secretos.

### CA-CMS — Administración

- CRUDs persisten en DB y sobreviven reinicios.
- Publicar exige traducción y campos obligatorios.
- Preview no indexable y protegido.
- El orden de proyectos/casos se refleja en público.
- Eliminación es recuperable durante una ventana definida.
- Audit log registra mutaciones.
- Dashboard no muestra cifras ficticias.

### CA-MEDIA — Archivos

- Se rechaza extensión, MIME/firma o tamaño no permitido.
- Nombre de almacenamiento aleatorio; nombre del usuario solo como metadata saneada.
- EXIF eliminado y contenido re-encodeado.
- SVG y documentos están deshabilitados en MVP.
- Archivo fuera del webroot y entrega por handler controlado.
- No puede borrarse definitivamente un medio aún referenciado sin resolver dependencias.

### CA-DATA — Base de datos

- Migración desde cero y upgrade desde versión anterior probados.
- Constraints, índices y claves foráneas definidos.
- Todos los timestamps en UTC.
- Slugs únicos por tipo/locale según diseño.
- Seeds de producción no publican contenido ficticio.
- Backup cifrado se restaura en un entorno limpio.

### CA-SEC — Seguridad

- Cumplimiento de checklist en `06-POLITICAS-DE-SEGURIDAD.md`.
- CI sin findings críticos/altos no aceptados.
- CSP en modo enforcement, sin `unsafe-eval` y con excepciones mínimas documentadas.
- Headers verificados mediante test automatizado.
- No hay secretos en imagen, capas, repo, logs ni bundle cliente.
- Dependencias y base image fijadas y con actualización automatizada.

### CA-OPS — Operación

- Ningún servicio publica `ports:` hacia `0.0.0.0` en producción.
- PostgreSQL solo está en red interna.
- `cloudflared` solo alcanza el servicio web, no la DB.
- Contenedores corren sin privilegios, sin Docker socket y con filesystem read-only cuando es viable.
- Health checks y reinicios funcionan.
- Deploy y rollback se ejecutan desde runbook.
- Se conoce y documenta el digest desplegado.

## 5. Definition of Done global

Una funcionalidad solo está “done” si:

1. Cumple comportamiento y diseño.
2. Tiene validación y manejo de errores.
3. Tiene pruebas adecuadas.
4. Es accesible.
5. No introduce riesgos críticos/altos.
6. Está documentada si afecta operación o arquitectura.
7. Funciona en Docker limpio.
8. No depende de mocks en producción.

## 6. Gates de lanzamiento

### Gate 1 — Código

- Lint, typecheck, tests y build verdes.
- Review de cambios sensibles.
- Lockfile comprometido.

### Gate 2 — Seguridad

- Escaneos verdes.
- Secrets configurados fuera de Git.
- Cloudflare Access y WAF/rate limits activos.
- Admin inaccesible sin doble autorización.

### Gate 3 — Datos

- Contenido real aprobado.
- Backups activos.
- Restore ensayado.

### Gate 4 — Producción

- Tunnel saludable.
- No existen port forwards en router.
- DNS/TLS/headers correctos.
- Formularios y notificaciones probados con un mensaje de prueba identificado.
- Rollback probado.

## 7. Riesgos principales

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Exponer la red doméstica | Muy alto | Tunnel outbound-only, firewall deny inbound, VLAN/segmentación, mínimos permisos |
| Compromiso del panel | Alto | Access + auth propia + sesiones/CSRF/rate limit + logs |
| Pérdida de DB/medios | Alto | Backups 3-2-1, cifrado, restore probado |
| Publicar contenido ficticio | Alto reputacional | Draft por defecto, revisión humana y métricas verificables |
| Subidas maliciosas | Alto | Solo imágenes, firma real, re-encode, fuera del webroot |
| Actualización vulnerable | Alto | Dependabot, escaneos, imágenes por digest, rollback |
| Alcance excesivo | Medio | Monolito modular, MVP cerrado, sin page builder/Kubernetes |
| Animaciones degradan rendimiento | Medio | Motion reducido, lazy loading y presupuestos de JS |
| Cloudflare/ISP caído | Medio | Página estática de contingencia opcional y runbook; aceptar SLA de homelab |
