# Plan de accion para publicar el portfolio

Fecha: 2026-09-05

## Objetivo

Convertir el portfolio en una V1 publica que funcione como sitio personal y tambien como repositorio demostrable: casos reales, buena experiencia de lectura, SEO basico, controles de seguridad y validacion automatizada.

## Tandas de implementacion

### Tanda 1 - Repositorio publico y seguridad base

- Inicializar repositorio Git local.
- Crear repositorio publico en GitHub.
- Asegurar `.gitignore`, `.dockerignore` y `.gitleaks.toml`.
- Documentar desarrollo, validacion, produccion y manejo de secretos.
- Ejecutar escaneo de secretos antes del primer push.

### Tanda 2 - Copy final y conversion

- Corregir copy publico en espanol con tildes.
- Exponer `liveUrl` como CTA de demo/app donde exista.
- Mantener repo y caso como acciones secundarias claras.

### Tanda 3 - Indice de casos y paginas de caso

- Enriquecer `/casos` con screenshots, stack chips, metricas y links.
- Agregar ficha superior en cada caso: rol/problema/stack/resultado/repo/demo.
- Agregar navegacion de caso: volver, siguiente caso y enlaces internos.

### Tanda 4 - SEO, Open Graph y sitemap

- Agregar metadata por caso en ES/EN.
- Generar sitemap dinamico con slugs de casos.
- Agregar imagen Open Graph publica y metadata social.

### Tanda 5 - Tests y QA final

- Ampliar e2e para demos, indice de casos, metadata y navegacion.
- Ampliar accesibilidad a home, contacto, indice y casos.
- Ampliar visual regression a indice/caso o smoke screenshots.
- Ejecutar lint, typecheck, tests, build, e2e, a11y, visual y secret scan.

### Tanda 6 - Admin operativo

- Crear usuario admin `facundo@ceresa.dev`.
- Validar login local sin exponer credenciales en Git.

## Regla de push

Cada dos mejoras/agregados terminados se valida, se escanean secretos, se commitea y se pushea a GitHub.
