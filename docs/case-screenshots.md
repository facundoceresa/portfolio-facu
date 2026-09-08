# Capturas reales de casos

Para que los casos se vean más sólidos, conviene reemplazar o ampliar las imágenes actuales con capturas reales de producción.

## Dónde guardar archivos

Usá estas carpetas públicas:

- `apps/web/public/work/peluqueria-agenda/`
- `apps/web/public/work/consulta-stock-general/`
- `apps/web/public/work/calculadora-materiales-anclaflex/`
- `apps/web/public/work/sector07-control/`

## Tamaños recomendados

- Desktop: `1440x1000` o `1600x1000`.
- Mobile: `390x844`.
- Exportar como PNG si hay mucho texto de UI.
- Evitar capturas borrosas, muy oscuras o recortadas antes de que se entienda la pantalla.

## Qué capturar

Cada caso debería tener al menos:

- Una pantalla principal donde se entienda el producto.
- Una pantalla con datos/resultado operativo.
- Una pantalla mobile si la experiencia pública o de uso real depende del teléfono.

## Cómo referenciarlas

Las imágenes de cada proyecto se cargan desde el JSON `body.screenshots` de `projectTranslations`.
En desarrollo, esos datos salen de:

```text
apps/web/scripts/seed-dev.ts
```

Para producción, cargarlas desde el panel/admin manteniendo rutas públicas con este formato:

```text
/work/nombre-del-caso/archivo.png
```

El layout ya prioriza la primera captura como imagen principal del caso y como evidencia en el listado.
