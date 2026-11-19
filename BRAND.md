# BRAND.md: lo extraído de chandon.com

Extraído el 19/11/2026 del HTML y CSS de `https://www.chandon.com/es-ar`.

## Tipografía
- Familia: **FGrotesk** (pesos 300, 400, 400 italic, 600, 700). Archivos `.woff2` descargados a `public/brand/fonts/` y cargados con `next/font/local` en `app/layout.tsx`.
- **Aviso de licencia:** es la fuente propietaria de la marca. Está bien para esta demostración con el cliente; para producción, confirmar con Moët Hennessy / el equipo de marca que el sitio puede alojarla.

## Colores (únicos valores reales encontrados en el CSS)
| Uso | Hex | Frecuencia en el CSS |
|---|---|---|
| Negro | `#000000` | 12 |
| Crema | `#f0e9dc` | 7 |
| Blanco | `#ffffff` | 6 |
| Dorado | `#d7a663` | 5 |
| Dorado oscuro | `#b48441` | 1 |
| Dorado arena | `#cab183` | 1 |

En el sitio se usó `#0b0b0b` como negro (no negro puro, para dar profundidad), `#f0e9dc` crema y `#d7a663` / `#b48441` como único acento.
Los brillos de fondo por espumante (`accent` en `content/chandon.ts`) son decorativos y se tomaron del color visible de cada etiqueta; **no vienen del CSS** y pueden ajustarse.

## Logo y marca gráfica
- `public/brand/chandon-wordmark.svg`: wordmark oficial, tomado del SVG en línea del header. Se usa como máscara CSS para que tome el color del texto.
- `public/brand/newsletter-logo.svg`: logo vertical con estrella (de la sección newsletter).
- **Estrella de siete puntas:** no se encontró como SVG suelto en el sitio (está en la cápsula de la botella). Se generó una estrella geométrica de 7 puntas (`components/ui/brand.tsx`). Reemplazar por el SVG oficial si el equipo de marca lo provee.

## Imágenes
- Se intentó siempre primero la versión original sin recorte (`/sites/default/files/media/image/<archivo>`); las 52 imágenes salieron en original.
- Las 10 botellas ya venían con transparencia. Se recortó el margen vacío y se eliminó el reflejo claro bajo el vidrio oscuro (`scripts/download-assets.mjs`).
- Todo se convirtió a WebP. `public/media/manifest.json` guarda ancho, alto y color dominante.

## Pendiente / avisos
- No hay videos en el sitio oficial. Slot preparado en `public/media/video/hero.mp4` y `hero-mobile.mp4`; el hero usa `home-hero-1` con zoom lento hasta que existan.
- Sin precios publicados: los botones reservan directo por SevenRooms (5 links reales extraídos de `/es-ar/bodega`). Chef de Cave, 5 Sentidos y Sweeties van por WhatsApp porque el sitio oficial los deja "por contacto".
