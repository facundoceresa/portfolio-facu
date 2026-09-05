# PRD — Portfolio full-stack de Facundo Ceresa

## 1. Visión

Construir un portfolio técnico bilingüe que muestre cómo Facundo conecta infraestructura, automatización, datos y desarrollo para resolver procesos reales. Debe funcionar como carta de presentación para oportunidades laborales y clientes, y como demostración técnica del propio sistema que lo sostiene.

El producto debe verse igual a la referencia de Lovable, pero operar como una aplicación real: contenido editable, casos publicables, formulario persistente, panel seguro, SEO, observabilidad, backups y despliegue reproducible.

## 2. Problema

La versión actual tiene una identidad visual fuerte, pero su contenido y funcionalidad son de demostración:

- Casos y métricas no verificados.
- Detalles de casos rotos.
- Formulario sin pipeline real.
- Login que acepta cualquier credencial.
- Panel con datos estáticos.
- Enlaces, ubicación y disponibilidad incorrectos.
- Ausencia de una estrategia segura para autohospedarlo dentro de una red doméstica.

## 3. Objetivos

### Objetivos de producto

- Presentar con claridad el perfil de infraestructura, automatización y desarrollo full-stack de Facundo.
- Convertir visitas de recruiters/clientes en contactos útiles.
- Publicar proyectos y casos técnicos sin editar código.
- Mantener versión española e inglesa.
- Conservar la identidad visual 1:1.

### Objetivos técnicos

- Aplicación reproducible mediante Docker Compose.
- Publicación sin puertos entrantes mediante Cloudflare Tunnel.
- Panel protegido por Cloudflare Access y autenticación de aplicación.
- Contenido y mensajes persistidos en PostgreSQL.
- CI con validaciones de calidad, seguridad y build.
- Backups restaurables y operación documentada.

### No objetivos

- Ser un CMS genérico o un constructor de páginas.
- Permitir registro público de usuarios.
- Incluir ecommerce, pagos, comentarios públicos o chat.
- Convertirse en una plataforma multiusuario/multitenant.
- Ejecutar MDX, HTML o JavaScript arbitrario cargado desde el panel.
- Copiar el código generado por Lovable.

## 4. Usuarios

### Recruiter o líder técnico

Quiere entender rápidamente experiencia, profundidad técnica, proyectos reales, stack, disponibilidad y forma de contacto.

### Cliente o empresa

Quiere validar criterio técnico, ver casos comparables y enviar un problema con contexto suficiente.

### Facundo como administrador

Quiere editar contenido, publicar proyectos/casos, gestionar medios y responder mensajes sin tocar la base de datos ni desplegar una nueva versión por cada cambio editorial.

## 5. Principios de producto

- Evidencia antes que exageración.
- Diseño singular sin sacrificar legibilidad.
- Contenido estructurado antes que page builder.
- Seguridad por capas, no dependencia exclusiva de Cloudflare.
- Métricas reales o ninguna métrica.
- Animación con propósito y alternativa `prefers-reduced-motion`.
- El sistema debe poder mantenerse en una PC vieja sin Kubernetes ni servicios innecesarios.

## 6. Requisitos funcionales públicos

### RF-PUB-01 — Navegación global

- Header sticky con logo/nombre, Inicio, Stack, Casos, Contacto, selector de idioma y CTA.
- Footer con estado, ubicación, idioma, legal, email y redes.
- Estado activo correcto por ruta.
- Menú móvil accesible, cierre por Escape y gestión correcta del foco.

### RF-PUB-02 — Inicio

- Hero fiel a la referencia.
- Disponibilidad y modalidad administrables.
- Manifiesto y terminal simulada con contenido bilingüe.
- Lista ordenada de proyectos destacados publicados.
- Stack resumido, método, postura sobre IA y CTA.
- Todos los bloques se alimentan de contenido estructurado.

### RF-PUB-03 — Stack

- Capas con título, descripción, orden y tecnologías.
- Herramientas agrupadas por categoría.
- Principios profesionales.
- CTA final.
- Edición de datos sin cambiar el layout.

### RF-PUB-04 — Proyectos

- Un proyecto contiene título, slug, resumen, tipo, estado, tecnologías, métricas opcionales, enlaces, orden y traducciones.
- Solo `published` aparece públicamente.
- Un proyecto puede ser destacado en Inicio.
- Los enlaces externos deben marcarse y validarse.
- No se mostrará una métrica si no fue completada y aprobada.

### RF-PUB-05 — Casos de estudio

- Índice con tarjeta editorial idéntica a la referencia.
- Detalle en `/casos/[slug]` y `/en/cases/[slug]`.
- Estructura: contexto, problema, restricciones, rol, arquitectura, decisiones, trade-offs, implementación, resultados, aprendizajes y enlaces.
- Bloques permitidos: párrafo, heading, lista, cita, código, imagen, galería, métrica, callout y diagrama seguro.
- Preview autenticado de borradores mediante token de corta duración.
- 404 real para slugs inexistentes.
- Metadata y OG por caso.

### RF-PUB-06 — Contacto

Campos:

- Nombre: requerido, 2–80 caracteres.
- Email: requerido, normalizado, máximo 254.
- Empresa/rol: opcional, máximo 120.
- Alcance: una opción permitida.
- Presupuesto: una opción permitida o “por definir”.
- Mensaje: requerido, 20–2000 caracteres.
- Consentimiento: requerido.
- Campo honeypot invisible y marca de tiempo mínima.
- Token Turnstile validado en servidor.

Comportamiento:

- Validación cliente y servidor con el mismo esquema.
- Respuesta genérica que no filtre controles internos.
- Guardado idempotente en PostgreSQL.
- Notificación por SMTP después de persistir; si el correo falla, el mensaje sigue visible en el panel.
- Estados accesibles: enviando, enviado, validación, rate limit y error recuperable.
- Sin adjuntos en MVP.

### RF-PUB-07 — Legal y privacidad

- Política de privacidad y términos bilingües.
- Fecha de vigencia visible.
- Describir datos realmente procesados por formulario, Turnstile, Cloudflare, logs y analítica si se habilita.
- Mecanismo de solicitud de acceso, rectificación o eliminación.

### RF-PUB-08 — Idiomas

- Español por defecto sin prefijo.
- Inglés con prefijo `/en`.
- Toggle conserva la página equivalente.
- `lang`, canonical y `hreflang` correctos.
- Contenido bilingüe obligatorio antes de publicar o política explícita de fallback definida en panel.

### RF-PUB-09 — SEO y sharing

- Metadata única por página.
- `sitemap.xml`, `robots.txt`, canonical y OG image.
- JSON-LD de `Person`, `WebSite` y `CreativeWork` donde corresponda.
- Admin, previews y APIs con `noindex`.
- URLs estables y redirecciones 301 al cambiar un slug publicado.

## 7. Requisitos funcionales del panel

### RF-ADM-01 — Autenticación

- Sin registro público ni recuperación automática por email en MVP.
- Cuenta administrador creada mediante comando/seed seguro.
- Password Argon2id.
- Sesiones opacas almacenadas en servidor, revocables y rotadas al iniciar sesión.
- Logout de sesión actual y opción de revocar todas.
- Límite de intentos y cooldown.
- Cloudflare Access obligatorio delante de rutas y APIs admin en producción.

### RF-ADM-02 — Dashboard

- Conteos reales de proyectos, casos, borradores, mensajes no leídos y estado de servicios.
- Actividad reciente desde `audit_log`.
- No mostrar uptime o visitas si no hay una fuente real.
- Accesos rápidos a nuevo proyecto, nuevo caso y mensajes.

### RF-ADM-03 — Proyectos

- Crear, editar, duplicar, archivar y eliminar de forma recuperable.
- Estados: `draft`, `review`, `published`, `archived`.
- Orden manual y selección de destacados.
- Campos ES/EN en una misma edición.
- Slug único, historial de slug y preview.
- Confirmación explícita antes de eliminar/archivar.

### RF-ADM-04 — Casos

- Mismos estados y traducciones que proyectos.
- Editor por bloques o Markdown restringido, nunca MDX ejecutable.
- Reordenamiento de bloques.
- Cálculo sugerido de tiempo de lectura.
- Preview de borrador.
- Publicación con validación de campos requeridos.

### RF-ADM-05 — Medios

- Solo imágenes en MVP: JPEG, PNG, WebP y AVIF.
- Validación de firma real, dimensiones y tamaño.
- Re-encode, eliminación de EXIF y generación de variantes.
- Alt text ES/EN obligatorio para publicar.
- Referencias de uso antes de eliminar.
- Eliminación en dos fases con papelera.

### RF-ADM-06 — Mensajes

- Bandeja: nuevo, leído, respondido, archivado y spam.
- Vista de detalle y metadatos mínimos.
- Búsqueda por nombre/email y filtros por estado/fecha.
- No mostrar IP completa ni secretos de Turnstile.
- Exportación CSV solo mediante acción explícita y auditada.
- Eliminación de acuerdo con retención o solicitud del interesado.

### RF-ADM-07 — Contenido y ajustes

- Datos de perfil, ubicación, disponibilidad, emails y redes.
- Textos de Inicio, Stack, Contacto y legales por campos definidos.
- Apariencia limitada a tokens aprobados; no cambiar la composición.
- Settings operativos no secretos.
- Los secretos se gestionan fuera de la UI mediante archivos de secrets.

### RF-ADM-08 — Auditoría

- Registrar login correcto/fallido sin contraseña, logout, creación, edición, publicación, archivado, borrado y exportación.
- Cada evento: actor, acción, entidad, timestamp, resultado y request ID.
- Redactar PII y nunca guardar cuerpos completos, tokens, cookies o contraseñas.

## 8. Requisitos no funcionales

### Rendimiento

- LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1 en p75 cuando exista suficiente tráfico.
- Lighthouse CI objetivo ≥ 90 Performance y ≥ 95 en Accessibility, Best Practices y SEO en rutas públicas clave.
- JavaScript de cliente limitado; priorizar Server Components y CSS.
- Fuentes autoalojadas y subset cuando la licencia lo permita.

### Accesibilidad

- WCAG 2.2 AA.
- Navegación completa por teclado.
- Foco visible.
- Contraste suficiente aun con opacidades de mint/fog.
- Labels asociados, mensajes de error anunciados y landmarks correctos.
- `prefers-reduced-motion` desactiva transformaciones no esenciales.

### Seguridad

- Baseline OWASP ASVS 5.0 nivel 2 adaptado al producto.
- Todas las mutaciones validadas y autorizadas en servidor.
- CSP con nonce, HSTS y headers definidos en la política.
- Rate limits, Turnstile y límites de tamaño.
- Backups cifrados y restore probado.
- Sin puertos entrantes al servidor desde Internet.

### Disponibilidad y operación

- Reinicio automático de servicios sanos.
- Health checks separados de liveness/readiness.
- Migraciones controladas antes de cambiar tráfico.
- Rollback mediante imagen anterior y migraciones compatibles.
- RPO objetivo 24 h y RTO objetivo 4 h para un portfolio personal.

### Privacidad

- Minimización de datos.
- Sin fingerprinting ni publicidad.
- Retención por defecto de mensajes: 24 meses, configurable.
- Logs de aplicación: 30 días salvo incidentes.
- Preferencia de idioma como única preferencia pública persistente, además de cookies estrictamente necesarias de seguridad.

## 9. Contenido inicial

El seed de desarrollo puede incluir demostraciones marcadas `draft` y nunca publicadas. Producción debe comenzar con:

- Perfil real y ubicación correcta.
- Enlaces verificados.
- Al menos tres proyectos reales.
- Al menos un caso real completo.
- Textos legales actualizados.
- Ninguna métrica inventada.

## 10. Métricas de éxito

- Cero rutas públicas rotas.
- Cero credenciales/demo bypass en producción.
- 100% de contenido publicado con versión ES/EN o excepción explícita.
- Entrega correcta de mensajes y visibilidad en panel aun si SMTP falla.
- Restore exitoso documentado antes del lanzamiento.
- Ausencia de hallazgos críticos/altos en dependencias e imagen al desplegar.
- Diferencia visual dentro del umbral definido en las pruebas de referencia.

## 11. Roadmap

### Fase 0 — Descubrimiento y baseline

- Capturas, tokens, rutas, animaciones y fixtures visuales.
- Confirmación de contenido real.
- Modelo de amenazas.

### Fase 1 — Frontend público

- Réplica 1:1, responsive, i18n, SEO y accesibilidad.

### Fase 2 — Backend y panel

- DB, auth, CRUDs, medios, mensajes y auditoría.

### Fase 3 — Infra y seguridad

- Compose, CI, GHCR, backups, Cloudflare Tunnel/Access y hardening.

### Fase 4 — Verificación y lanzamiento

- Visual regression, E2E, seguridad, restore, runbooks y publicación.

### Fase 2 futura

- Analítica propia o Cloudflare Web Analytics revisada legalmente.
- TOTP adicional en aplicación si no se cubre con el IdP de Access.
- Importación/exportación completa de contenido.
- Webhooks opcionales para notificaciones.
- RSS de casos técnicos.
