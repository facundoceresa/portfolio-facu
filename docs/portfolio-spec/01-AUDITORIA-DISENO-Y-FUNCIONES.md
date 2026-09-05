# Auditoría del diseño y de la aplicación de referencia

## 1. Resumen ejecutivo

El portfolio tiene una dirección visual distintiva y adecuada para un perfil técnico: mezcla lenguaje de terminal, planos de arquitectura y composición editorial. La identidad es mucho más valiosa que una plantilla clásica de “developer portfolio”, por lo que debe preservarse con alta fidelidad.

La referencia, sin embargo, funciona principalmente como demo de frontend. El backend, la autenticación, los enlaces, las métricas y parte del contenido no están listos para producción. La réplica debe conservar el diseño y reemplazar la simulación por comportamiento real.

## 2. Inventario de rutas observado

| Ruta | Función actual | Requisito para la reconstrucción |
| --- | --- | --- |
| `/` | Hero, manifiesto, trabajo seleccionado, stack resumido, método, postura sobre IA y CTA | Réplica visual 1:1; contenido administrable por campos estructurados |
| `/stack` | Capas técnicas, herramientas, principios y CTA | Contenido bilingüe administrable; sin page builder |
| `/casos` | Índice de cuatro casos | Datos reales desde PostgreSQL; filtros/orden administrables |
| `/casos/[slug]` | Cambia URL y metadata, pero actualmente vuelve a mostrar el índice | Implementar detalle real de cada caso, 404 y preview de borradores |
| `/contacto` | Formulario con alcance, presupuesto, mensaje y consentimiento | Persistencia, validación, antispam, notificación y estados de envío reales |
| `/privacidad` | Política de privacidad | Ajustarla a la implementación efectiva y normativa aplicable |
| `/terminos` | Términos de uso | Administrable o versionado en código; mantener historial de cambios |
| `/admin` | Login de demostración | Login real, rate limit, sesiones revocables y protección por Cloudflare Access |
| `/admin/proyectos` | CRUD simulado de proyectos | CRUD real, orden, estado y traducciones |
| `/admin/casos` | CRUD simulado de casos | Editor estructurado/Markdown seguro, estados y preview |
| `/admin/medios` | Biblioteca simulada | Subida segura de imágenes, metadatos y eliminación controlada |
| `/admin/ajustes` | Apariencia, notificaciones y seguridad simuladas | Ajustes reales permitidos; no guardar secretos en base de datos sin protección |

Se agregará `/admin/mensajes`, porque el formulario público necesita una bandeja real. También se incluirán `/api/health/live` y `/api/health/ready` para operación.

## 3. Sistema visual relevado

### Paleta

| Token | Valor observado | Uso |
| --- | --- | --- |
| Navy principal | `#0d1b2a` | Fondo general |
| Navy profundo | `#0a1521` | Cards, paneles y footer |
| Mint principal | `#2dd4a8` | Botones, bordes activos y énfasis |
| Mint glow | `#73ffb8` | Brillos, estados y títulos |
| Fog | `#e6fff5` | Texto principal |
| Border mint | `#73ffb81f` | Divisores de baja intensidad |
| Forest | Aproximación visual derivada del secundario `#143528` | Superficies activas y estados |

### Tipografía

| Rol | Familia observada | Tratamiento |
| --- | --- | --- |
| Display | Space Grotesk | Mayúsculas, peso 700, tracking negativo, escala fluida |
| Interfaz y cuerpo | DM Sans | Texto de lectura y navegación |
| Mono/técnica | JetBrains Mono | Labels, botones, comandos, métricas y metadata |

### Rasgos que no deben perderse

- Retícula de blueprint de baja opacidad en fondos.
- Header sticky, translúcido, con blur y borde fino.
- Hero de gran escala con título partido, manifiesto lateral y terminal simulada.
- Cards de borde fino, sombras duras, líneas verticales y esquinas técnicas.
- Etiquetas `//`, numeración `01/`, underscores y cursores parpadeantes.
- Espaciado amplio y composición asimétrica en desktop.
- Botones rectangulares, sin redondeo visual dominante, con tracking mono.
- Glow contenido; nunca convertir la interfaz en un “neón cyberpunk” genérico.
- Microanimaciones de entrada, hover, pulso de estado, cursor y desplazamiento.
- Densidad técnica alta, pero con jerarquía y aire suficiente.

### Medidas observadas en desktop

- Viewport de auditoría: aproximadamente `1363 × 936`.
- Header: `69 px` de alto.
- Hero público: aproximadamente `1192 px` de alto en ese viewport.
- H1: tamaño calculado cercano a `150 px`, `line-height` cercano a `127 px`, peso 700 y tracking aproximado de `-4%`.
- CTA primario: fondo `#2dd4a8`, texto navy, JetBrains Mono 11 px y tracking 0.2 em.
- Página inicial completa: aproximadamente `8443 px` de alto en el viewport auditado.

Estas medidas son referencias, no valores rígidos para todas las pantallas. La implementación debe conservar las relaciones mediante `clamp()`, grid y breakpoints.

## 4. Contenido y secciones observadas

### Inicio

1. Disponibilidad y región.
2. Nombre y manifiesto “Software con criterio”.
3. Terminal con rol y especialización.
4. Proyectos seleccionados.
5. Ecosistema de stack por capas.
6. Método: observar, modelar, automatizar y sostener.
7. Postura de IA responsable.
8. CTA de contacto.

### Stack

- Hero “Máquinas que construyen máquinas”.
- Cuatro capas: interfaz, aplicación, datos e infraestructura.
- Herramientas cotidianas agrupadas.
- Principios de trabajo.
- CTA final.

### Casos

- Índice editorial con número, categoría, fecha, tiempo de lectura, resumen y resultado.
- El diseño sugiere artículos completos, pero las rutas de detalle no renderizan el artículo.

### Contacto

- Nombre.
- Email.
- Empresa/rol.
- Selector de alcance.
- Selector de presupuesto.
- Mensaje hasta 2000 caracteres.
- Consentimiento de privacidad.
- Datos laterales de email, GitHub, LinkedIn y disponibilidad.

### Panel

La demo contiene o anticipa:

- Dashboard con proyectos publicados, vistas, leads y uptime.
- Actividad reciente.
- CRUD de proyectos con título, slug, descripción, stack y estado.
- CRUD de casos con título, slug, tiempo de lectura y estado.
- Biblioteca de medios.
- Ajustes de apariencia, notificaciones y seguridad/2FA.

## 5. Hallazgos funcionales y de contenido

| Prioridad | Hallazgo | Corrección requerida |
| --- | --- | --- |
| Bloqueante | Cualquier credencial abre el panel demo | Eliminar lógica demo; autenticación real y doble barrera con Cloudflare Access |
| Bloqueante | Las rutas de caso cambian URL/metadata pero muestran el índice | Crear página de detalle real, loader por slug, 404 y tests |
| Alta | El formulario no expone una acción/backend real | API validada, persistencia, antispam, notificación y UX de error/reintento |
| Alta | Proyectos y métricas parecen datos ficticios | Migrar solo experiencia comprobable; borradores por defecto; no inventar resultados |
| Alta | Ubicación “Buenos Aires · AR” y footer “Argentina” | Cambiar a Montevideo · Uruguay / remoto |
| Alta | “No respondo a reclutadores” contradice la búsqueda laboral técnica | Reescribir para aceptar oportunidades relevantes y rechazar solo propuestas sin contexto |
| Alta | GitHub y LinkedIn apuntan a `#` | Configurar URLs reales y test de enlaces |
| Alta | Fechas Q1/Q2 2026 quedan obsoletas | Administrar disponibilidad desde settings o usar texto sin vencimiento automático |
| Media | El `lang` inicial puede no coincidir con el contenido visible | El HTML server-rendered debe declarar el locale correcto |
| Media | Inputs sin `name` observado y asociación de labels no garantizada | Labels semánticos, `name`, autocomplete, errores anunciados y foco visible |
| Media | Empresa figura como requerida en formulario, pero la privacidad la llama opcional | Unificar regla y texto; se recomienda opcional |
| Media | Estadísticas del dashboard son simuladas | Conectar a datos reales o no mostrarlas |
| Media | La política afirma una implementación específica de analítica/cookies | Actualizarla después de definir Turnstile, Access, logs y analítica |
| Baja | Enlace Admin visible en el footer público | Se puede conservar por fidelidad, pero debe quedar protegido; preferible ocultarlo en producción pública |
| Baja | Badge “Edit with Lovable” | No debe existir en la reconstrucción |

## 6. Ajuste del contenido al perfil real

La estética comunica un perfil senior de producto/arquitectura, mientras que el contenido demo atribuye proyectos de fintech, SaaS y migraciones que no están verificados. Esa diferencia puede perjudicar la credibilidad en una entrevista.

Los primeros casos reales deberían salir de trabajos demostrables de Facundo, por ejemplo:

- Automatización de imágenes corporativas con FOG, iPXE, Sysprep y `unattend.xml`.
- Automatizaciones de soporte con PowerShell, BitLocker, OCS y Active Directory.
- Consulta de stock y calculadora de materiales conectadas a datos de ERP.
- Integraciones de pedidos/facturación y middleware con SQL Server.
- N8N autohospedado con Docker, Nginx/Cloudflare y automatizaciones.
- Inventario y monitoreo con OCS/Zabbix.

Cada caso debe diferenciar claramente entre producción real, prototipo, proyecto personal y concepto. Las métricas deben tener origen o eliminarse.

## 7. Comportamiento bilingüe

La referencia traduce navegación y contenido entre español e inglés. La nueva aplicación debe:

- Usar español como locale predeterminado.
- Servir inglés en rutas `/en/...` para indexación y enlaces compartibles.
- Mantener las rutas españolas actuales sin prefijo.
- Guardar solo la preferencia de idioma necesaria.
- Administrar ambas traducciones en el mismo registro de contenido.
- Definir `lang`, canonical y `hreflang` correctamente.
- Mostrar fallback editorial visible en el panel cuando falte una traducción, sin mezclar idiomas silenciosamente en producción.

## 8. Criterio de fidelidad

“1:1” significa conservar composición, proporciones, jerarquía, paleta, tipografías, estados, animaciones y responsive. No significa copiar errores, texto falso, código de Lovable, el badge de edición ni dependencias innecesarias.

La verificación final debe comparar capturas de referencia y reconstrucción en `1440×900`, `1366×768`, `1024×768`, `768×1024`, `390×844` y `360×800`, con máscaras para animaciones no determinísticas.
