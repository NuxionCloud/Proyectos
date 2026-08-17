# Bocatitos · Web oficial

Web del restaurante **Bocatitos** (Sevilla · Av. Sánchez Pizjuán 6).
Tres pilares de negocio: **Desayunos** (solo local), **Tapas** (domicilio), **Street Food** (domicilio).

> Build estático con Astro 4. Sin backend, sin base de datos, sin CMS.
> Contenido editable en Markdown/MDX dentro de `src/content/`.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 4.16 (output: static) |
| Estilos | Tailwind CSS 3.4 + CSS vars (tokens) |
| Animación | GSAP (hero) · CSS keyframes (resto) |
| Tipografía | Archivo Black · Bebas Neue · Inter (Google Fonts) |
| Contenido | Astro Content Collections (Markdown/MDX + Zod) |
| i18n | (pendiente fase posterior) 5 idiomas: ES · IT · FR · EN · DE |
| Lint/format | Prettier + prettier-plugin-astro + prettier-plugin-tailwindcss |
| Deploy | Cualquier static host (Hostinger recomendado, Vercel/Netlify/GitHub Pages compatibles) |

---

## Instalación

Requisitos: **Node 18.17+** y **npm 9+**.

```bash
cd _app
npm install
```

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321` |
| `npm run build` | Type-check + build estático en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para validar el build |
| `npm run check` | Type-check Astro/TS sin compilar |
| `npm run format` | Formatea todo con Prettier |

---

## Estructura

```
_app/
├── public/                    # estáticos servidos tal cual (favicon, og.jpg…)
├── src/
│   ├── assets/images/         # imágenes optimizadas por Astro
│   ├── components/
│   │   ├── layout/            # TopBar, Header, Footer, Marquee
│   │   ├── hero/              # Hero + sub-componentes
│   │   ├── menu/              # MenuTabs, DishCard, DishGrid
│   │   ├── ui/                # Button, Sticker, Stamp
│   │   └── sections/          # About, Categories, Featured, IG, Location
│   ├── content/
│   │   ├── config.ts          # Schema Zod de platos y settings
│   │   ├── desayunos/         # 1 archivo .md por plato
│   │   ├── tapas/
│   │   ├── street-food/
│   │   └── settings/local.json  # dirección, horarios, contacto
│   ├── layouts/
│   │   └── BaseLayout.astro   # head, OG, schema.org, fuentes
│   ├── lib/                   # utilidades TS (time, instagram…)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── carta.astro
│   │   ├── carta/[categoria].astro
│   │   ├── pedidos.astro      # recepción de pedidos a domicilio
│   │   ├── reservas.astro     # reservas (+ WhatsApp)
│   │   └── 404.astro
│   └── styles/
│       ├── tokens.css         # paleta, tipografía, espaciado, motion
│       ├── global.css         # reset + base + tailwind layers
│       └── animations.css     # keyframes reutilizables
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## Sistema de diseño

**Hilo de marca** (todo el chrome): negro `#0A0A0A` + rojo `#E63027` + amarillo `#FFB800`.

**Sub-paletas por categoría** (definen secciones, cards, hover states):

| Categoría | Color principal | Acento | Uso |
|---|---|---|---|
| Desayuno | Verde oscuro `#2D4A2B` | Amarillo `#FFB800` | Solo consumo en local |
| Tapas | Terracota `#C8553D` *(propuesta — confirmar)* | Crema `#F4E4C1` | Domicilio |
| Street food | Amarillo `#FFB800` | Negro `#0A0A0A` | Domicilio |

Tokens en `src/styles/tokens.css`. Tailwind las expone como `bg-desayuno`, `text-tapas-accent`, etc.

---

## Cómo añadir/editar un plato

1. Crea un archivo `src/content/<categoria>/<slug>.md`.
2. Frontmatter mínimo:

   ```yaml
   ---
   nombre: "SANJI"
   descripcion: "Doble smash, queso cheddar, bacon, salsa Sanji."
   precio: 9.50
   imagen: "/images/sanji.jpg"
   categoria: "street-food"
   destacado: true
   alergenos: ["gluten", "lactosa", "huevo"]
   picante: 1
   ---
   ```

3. El plato aparece automáticamente en `/carta` y en `/carta/street-food`.
4. Para ocultarlo sin borrar: `disponible: false`.

---

## Editar datos del local

Edita `src/content/settings/local.json` (dirección, horarios, teléfono, redes).
Los cambios se reflejan en footer, página `/local` y schema.org.

---

## Deploy

El build genera HTML estático en `dist/`. Compatible con cualquier host estático:

- **Hostinger** (infra Nuxion habitual): sube `dist/` por FTP o configura auto-deploy GitHub → carpeta pública del dominio.
- **Vercel/Netlify**: detección automática Astro, sin config extra.
- **GitHub Pages**: añadir `base: '/<repo>/'` en `astro.config.mjs` si el sitio cuelga de subpath.

---

## Roadmap

- [x] **Fase 1** · Setup (Astro + Tailwind + tokens + estructura)
- [ ] **Fase 2** · BaseLayout + TopBar + Header + Footer
- [ ] **Fase 3** · Hero (mockup `bocatitos-agresivo.html`)
- [ ] **Fase 4** · Resto secciones home (about, categories, featured, IG, time-based, location)
- [ ] **Fase 5** · Páginas internas (carta, pedidos, reservas, 404)
- [ ] **Fase 6** · i18n 5 idiomas (ES/IT/FR/EN/DE)
- [ ] **Fase 7** · Optimización (Lighthouse audit, sitemap, schemas)
- [ ] **Fase 8** · Deploy

---

## Pendiente de validación con cliente

- Color definitivo para **Tapas** (propuesta actual: terracota `#C8553D`)
- Fotos profesionales de plato/local/ambiente (ahora placeholders)
- Logo vectorial SVG (ahora wordmark `BOCATITOS.`)
- Token Instagram Basic Display API (para grid IG en vivo)
- Dominio definitivo (`bocatitos.es` u otro)
