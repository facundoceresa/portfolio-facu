# Plan de accion para publicar el portfolio

Fecha: 2026-09-05

## Objetivo

Convertir el portfolio en una V1 publica que funcione como sitio personal y tambien como repositorio demostrable: casos reales, buena experiencia de lectura, SEO basico, controles de seguridad y validacion automatizada.

## Tandas de implementacion

### Tanda 1 - Repositorio publico y seguridad base - completada

- Inicializar repositorio Git local.
- Crear repositorio publico en GitHub.
- Asegurar `.gitignore`, `.dockerignore` y `.gitleaks.toml`.
- Documentar desarrollo, validacion, produccion y manejo de secretos.
- Ejecutar escaneo de secretos antes del primer push.

Commit: `e90a5e0`

### Tanda 2 - Copy final y conversion - completada

- Corregir copy publico en espanol con tildes.
- Exponer `liveUrl` como CTA de demo/app donde exista.
- Mantener repo y caso como acciones secundarias claras.

Commit: `3c70d67`

### Tanda 3 - Indice de casos y paginas de caso - completada

- Enriquecer `/casos` con screenshots, stack chips, metricas y links.
- Agregar ficha superior en cada caso: rol/problema/stack/resultado/repo/demo.
- Agregar navegacion de caso: volver, siguiente caso y enlaces internos.

Commit: `328c7be`

### Tanda 4 - SEO, Open Graph y sitemap - completada

- Agregar metadata por caso en ES/EN.
- Generar sitemap dinamico con slugs de casos.
- Agregar imagen Open Graph publica y metadata social.

Commit: `c1ac6a8`

### Tanda 5 - Navegacion publica y seccion de perfil - completada

- Ocultar entrada admin del footer por defecto.
- Mejorar labels y estado activo de navegacion mobile ES/EN.
- Agregar bloque de perfil/capacidades y CV tecnico descargable.

Commit: `b50bb68`

### Tanda 6 - Capturas navegables y QA ampliado - completada

- Ampliar e2e para demos, indice de casos, metadata y navegacion.
- Ampliar accesibilidad a home, contacto, indice y casos.
- Ampliar visual regression a indice/caso o smoke screenshots.
- Permitir abrir capturas de caso en tamano completo desde cada figura.
- Ejecutar lint, typecheck, tests, build, e2e, a11y, visual y secret scan.

Commit: `c7edbd3`

### Tanda 7 - Repo demostrable y documentacion publica - en curso

- Mejorar README publico con capturas, arquitectura y casos publicados.
- Actualizar documentacion operativa con resultados de validacion recientes.

### Tanda 8 - Admin operativo - pendiente

- Crear usuario admin `facundo@ceresa.dev`.
- Validar login local sin exponer credenciales en Git.

## Regla de push

Cada dos mejoras/agregados terminados se valida, se escanean secretos, se commitea y se pushea a GitHub.
