# RISE360LATAM — Landing Page

Landing page de una sola página para conseguir reservas de clase de prueba gratis por WhatsApp. HTML/CSS/JS puro (sin frameworks ni build), pensada para cargar rápido y funcionar perfecto en celular.

## Estructura de archivos

```
index.html          -> Toda la página (secciones, textos, links)
css/styles.css       -> Diseño (colores negro/rojo/blanco, tipografía, layout)
js/main.js            -> Menú móvil, FAQ, tracking de clics WhatsApp
assets/
  hero/               -> Video o foto principal (fondo del inicio)
  gallery/             -> Fotos/video del club (entrenadores, ring, sacos, parqueo, duchas)
  programas/           -> Foto de cada programa
  testimonios/         -> Fotos de alumnos
```

## 1. Agregar fotos y videos reales

Ahora mismo cada foto/video muestra un **placeholder** con el nombre del archivo que espera. Solo agrega tus archivos reales con ese mismo nombre dentro de `assets/` y aparecerán automáticamente (no hay que tocar código):

| Sección | Archivo esperado |
|---|---|
| Inicio (hero) | `assets/hero/hero.mp4` (video) y/o `assets/hero/hero-poster.jpg` |
| Galería | `assets/gallery/entrenadores.jpg`, `ring.jpg`, `sacos.jpg`, `clase.jpg`, `parqueo.jpg`, `duchas.jpg` |
| (opcional, más impacto) | Puedes reemplazar cualquier `.jpg` de galería por un `.mp4` del mismo nombre editando el `<img>` por `<video autoplay muted loop playsinline>` en `index.html` |
| Programas | `assets/programas/principiantes.jpg`, `acondicionamiento.jpg`, `ninos-jovenes.jpg`, `competidores.jpg`, `fines-semana.jpg` |
| Testimonios | `assets/testimonios/alumno-1.jpg`, `alumno-2.jpg`, `alumno-3.jpg` |

Recomendado: fotos en formato `.jpg` o `.webp`, máximo ~300-500KB cada una (usa [squoosh.app](https://squoosh.app) para comprimir sin perder calidad). El video del hero idealmente menos de 8-10MB, en formato `.mp4`.

## 2. Reemplazar testimonios de ejemplo

En `index.html`, busca la sección `<!-- ============ TESTIMONIOS ============ -->`. Los textos entre corchetes `[Nombre del alumno]` y `[Escribe aquí...]` son placeholders — reemplázalos con reseñas y nombres reales antes de publicar. No publiques testimonios inventados.

## 3. Horarios

Ya están los horarios reales del club (lunes a viernes, sábados, domingos) en la sección `<!-- ============ HORARIOS ============ -->`. Si cambian, edita los `<span>` dentro de cada `.schedule-times`.

## 4. Configurar Meta Pixel (Meta Ads)

En `index.html`, dentro de `<head>`, busca:

```js
fbq('init', 'YOUR_PIXEL_ID');
```

y el `<noscript>` con `id=YOUR_PIXEL_ID`. Reemplaza `YOUR_PIXEL_ID` (dos lugares) por tu ID real del Pixel (lo obtienes en Meta Events Manager).

Cada botón de "Reservar clase gratis" ya envía automáticamente el evento estándar `Contact` al hacer clic — útil para optimizar campañas de Meta Ads hacia gente con intención real de reservar.

## 5. Configurar Google Analytics 4

En `index.html`, dentro de `<head>`, busca las dos apariciones de:

```
G-XXXXXXXXXX
```

y reemplázalas por tu ID de medición de GA4 (Admin → Flujos de datos → tu sitio web).

Cada clic en un botón de WhatsApp también envía un evento `whatsapp_click` a GA4, con una etiqueta según la sección (`hero`, `flotante`, `plan-60`, `condicion-fisica`, etc.) para ver qué botones convierten mejor.

## 6. Número de WhatsApp

El número usado es **+503 7525-6546**. Si cambia, reemplaza `50375256546` en todos los enlaces `https://wa.me/50375256546?...` dentro de `index.html` (son 16 en total).

## 7. Ver la página localmente

No necesita instalación. Dos opciones:

**Opción A — Doble clic:** abre `index.html` directamente en el navegador (funciona, aunque algunos navegadores restringen un poco el `file://`).

**Opción B — Servidor local (recomendado):**
```bash
py -m http.server 8090
```
y abre `http://localhost:8090` en el navegador.

## 8. Publicar el sitio

Cualquier hosting estático funciona (no requiere backend ni base de datos): Netlify, Vercel, GitHub Pages, o el hosting que ya tengas. Solo sube toda la carpeta del proyecto.

## Checklist antes de publicar

- [ ] Fotos y video reales agregados en `assets/`
- [ ] Testimonios reales (no los de ejemplo)
- [ ] Meta Pixel ID configurado
- [ ] Google Analytics 4 ID configurado
- [ ] Número de WhatsApp verificado
- [ ] Probado en un celular real (no solo en la computadora)
