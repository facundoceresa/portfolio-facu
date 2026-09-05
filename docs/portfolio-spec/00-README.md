# Portfolio Facundo Ceresa — paquete de construcción

Fecha de relevamiento: 2026-08-31  
Referencia visual: https://core-composition.lovable.app/

## Objetivo

Reconstruir el portfolio publicado en Lovable con fidelidad visual 1:1, pero convertirlo en una aplicación real, autoadministrable y segura. La aplicación se ejecutará en Docker sobre un servidor Linux doméstico y se publicará exclusivamente mediante Cloudflare Tunnel.

La referencia de Lovable es la especificación visual, no una fuente de código ni de verdad para el contenido. Se debe conservar su identidad gráfica y corregir sus datos de demostración, enlaces rotos, fallas funcionales y riesgos de seguridad.

## Orden recomendado de lectura

1. `01-AUDITORIA-DISENO-Y-FUNCIONES.md`
2. `02-PRD.md`
3. `03-ALCANCE-Y-CRITERIOS-DE-ACEPTACION.md`
4. `04-STACK-Y-ARQUITECTURA.md`
5. `05-MODELO-DE-DATOS-Y-API.md`
6. `06-POLITICAS-DE-SEGURIDAD.md`
7. `07-PROMPT-MAESTRO-CODEX-CLI.md`

## Decisiones ya tomadas

- El diseño debe recrearse, no reinterpretarse.
- Se mantiene la estética navy/menta, retícula técnica, tipografía editorial, lenguaje de terminal, composición asimétrica y animaciones deliberadas.
- Será una aplicación full-stack autohospedada, no un sitio estático.
- El backend será un monolito modular de Next.js con PostgreSQL. Para este tamaño de producto es más seguro y mantenible que separar frontend y API en servicios independientes.
- El contenido se administrará mediante esquemas estructurados. No habrá page builder genérico ni ejecución de componentes arbitrarios desde la base de datos.
- El panel tendrá autenticación real. Se elimina por completo el modo “cualquier credencial abre el panel”.
- El acceso público será por Cloudflare Tunnel; no se abrirán puertos en el router doméstico.
- `/admin/*` y `/api/admin/*` tendrán doble control: Cloudflare Access y autenticación propia de la aplicación.
- Los proyectos, métricas y casos de demostración no se publicarán como experiencia real. Deben reemplazarse por información verificable.
- La ubicación correcta es Montevideo, Uruguay. Las referencias actuales a Buenos Aires/Argentina deben cambiarse.
- El portfolio debe servir tanto para clientes como para recruiters técnicos; se elimina el texto que declara que no se responde a recruiters.

## Trabajo pendiente de Facundo antes de producción

- Confirmar dominio definitivo y correo remitente.
- Proporcionar URL real de GitHub y LinkedIn.
- Seleccionar y redactar los proyectos reales que se publicarán.
- Confirmar qué métricas pueden mostrarse y con qué evidencia.
- Definir proveedor SMTP o correo de recepción.
- Definir destino de backups cifrados fuera del servidor.
- Crear las credenciales y políticas de Cloudflare Access; nunca pegarlas en el repositorio ni en prompts.

## Secuencia de implementación

1. Clonar el diseño público y establecer pruebas de regresión visual.
2. Implementar rutas públicas, i18n, accesibilidad y SEO.
3. Crear modelo de datos, migraciones y contenido semilla en estado borrador.
4. Implementar autenticación, panel y CRUDs.
5. Implementar contacto, Turnstile, almacenamiento y notificaciones.
6. Aplicar hardening de aplicación, contenedores, GitHub y servidor.
7. Ejecutar pruebas funcionales, visuales, de seguridad, backup y restauración.
8. Publicar mediante Cloudflare Tunnel y habilitar Cloudflare Access para el panel.

## Regla de salida

La aplicación no se considera terminada porque “se parece” a Lovable. Debe cumplir simultáneamente fidelidad visual, contenido real, funcionalidad completa, accesibilidad, pruebas y controles de seguridad definidos en este paquete.
