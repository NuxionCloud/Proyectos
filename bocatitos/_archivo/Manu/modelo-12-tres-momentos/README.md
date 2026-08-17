# Bocatitos · Modelo 12 — "Tres momentos, un solo sabor"

Rediseño web de **Bocatitos Street Food** (Sevilla). Sitio **100% estático**: HTML + CSS + JS,
sin build ni dependencias de Node. Todo lo necesario está en esta carpeta.

## Contenido

- `index.html` — portada (hero con vídeo).
- `concepto.html`, `desayuno.html`, `tapas.html`, `streetfood.html`, `local.html`, `redes.html`, `resenas.html` — páginas interiores.
- `assets/`
  - `styles.css` — estilos.
  - `app.js` — interacciones (menú, scroll, etc.).
  - `i18n.js` — textos y traducciones (ES/EN).
  - `logo.png`, `favicon.svg`, `favicon.png` — identidad.
  - `hero-poster.jpg` — póster del vídeo.
  - `hero-video.mp4` / `hero-video-720p-backup.mp4` — vídeo de cabecera.

## Cómo abrirlo en otro PC

Como las rutas usan barras `/` para navegar entre secciones, conviene servirlo por HTTP
(abrir el `index.html` directo con doble clic funciona, pero la navegación queda más limpia con un servidor local):

```bash
# Opción 1 — Python (ya viene en la mayoría de equipos)
python -m http.server 8000
# luego abre http://localhost:8000

# Opción 2 — Node
npx serve .
```

Para **publicarlo**, sube el contenido de esta carpeta a cualquier hosting estático
(Netlify, Vercel, GitHub Pages, EasyPanel con un `serve`, etc.). No requiere backend.

> Las fuentes (Poppins, Fraunces, Inter) se cargan desde Google Fonts, por lo que se necesita
> conexión a internet la primera vez para verlas con la tipografía correcta.
