# Alikriss – Guía del sitio web

## Estructura del proyecto

```
alikriss-site/
├── index.html              ← Página principal (editar contenido aquí)
├── favicon.ico / manifest.json  ← Íconos del navegador (deben estar en la raíz)
├── sitemap.xml / robots.txt     ← SEO (dominio canónico: alimentoskriss.com, sin www)
├── css/
│   ├── tokens.css          ← Colores, fuentes, variables de diseño
│   ├── base.css            ← Reset, tipografía, botones, animaciones
│   ├── components.css      ← Nav, hero, cards, flip, footer…
│   └── responsive.css      ← Breakpoints (tablet, móvil)
├── js/
│   ├── main.js             ← Nav scroll, reveal al scroll, smooth scroll
│   ├── flip-card.js        ← Tarjeta giratoria genérica del empaque
│   └── testimonials-slider.js ← Carrusel de testimonios (con botón de pausa)
├── data/
│   ├── products.json       ← ⭐ FUENTE DE VERDAD de cada producto
│   └── site.json           ← ⭐ Datos globales de marca (misión, valores, footer)
└── assets/img/
    ├── logo-alikriss.png / .webp          (.webp = la que usa la web)
    ├── logo-alimentos-kriss.png / .webp
    ├── favicon/
    └── productos/
        ├── macarrones-queso-frente.webp       (≈ 700 px de ancho, < 100 KB)
        ├── macarrones-queso-frente-440.webp   (versión pequeña para móvil)
        ├── macarrones-queso-reverso.webp
        ├── macarrones-queso-reverso-440.webp
        └── macarrones-queso-og.jpg            (1200×630 para WhatsApp/redes)
```

---

## ✅ Checklist: Agregar un nuevo producto en ~15 minutos

### Paso 1 — Datos en JSON
Abre `data/products.json` y agrega un objeto nuevo al final del arreglo:

```json
{
  "id": "spaghetti-tomate",
  "slug": "spaghetti-tomate",
  "active": true,
  "name": "Spaghetti con Salsa de Tomate",
  ...
}
```
Copia la estructura del producto existente como plantilla.

### Paso 2 — Imágenes del empaque
Guarda las imágenes en `assets/img/productos/`:
- `spaghetti-tomate-frente.webp`   (frente del empaque)
- `spaghetti-tomate-reverso.webp`  (reverso con nutrición)
- `spaghetti-tomate-og.jpg`        (1200×630px para redes sociales)

Usa **WebP** para frente/reverso (mejor compresión, calidad visual igual).
Exporta a calidad ~80 y ~700 px de ancho: **cada imagen debe pesar menos de 150 KB**.
Crea también la versión `-440.webp` (440 px de ancho) para móviles.

### Paso 3 — Página del producto
Copia `index.html` → `productos/spaghetti-tomate.html` y actualiza:
- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Las imágenes del flip card (dos líneas `src="..."`)
- Textos de hero, features, prepSteps
- JSON-LD del producto

### Paso 4 — Verificar
- [ ] Flip card gira en escritorio y móvil
- [ ] Las imágenes cargan (WebP en Chrome/Firefox/Safari)
- [ ] Meta title y description son únicos para este producto
- [ ] JSON-LD validado en: https://search.google.com/test/rich-results

---

## 🎨 Cambiar colores o fuentes

Todo está en `css/tokens.css`. Solo edita las variables:

```css
:root {
  --gold:      #E6BB4F;   /* ← Cambiar aquí afecta toda la web */
  --font-body: 'Karla', sans-serif;
}
```

---

## 🖼️ Cambiar una imagen del producto

En `index.html`, busca el comentario:
```html
<!-- CAMBIAR IMAGEN FRENTE: solo cambiar src y alt -->
```
Y reemplaza el `src`:
```html
<img src="assets/img/productos/NUEVO-PRODUCTO-frente.webp" alt="...">
```

---

## 📝 Cambiar textos

| Qué cambiar | Dónde está |
|---|---|
| Misión / Visión | `data/site.json` → `"mission"`, `"vision"` |
| Valores de marca | `data/site.json` → `"values"` |
| Testimonios | `data/site.json` → `"testimonials"` |
| Nombre del producto | `data/products.json` → `"name"` |
| Ingredientes / Features | `data/products.json` → `"features"` |
| Pasos de preparación | `data/products.json` → `"prepSteps"` |
| Datos nutricionales | `data/products.json` → `"nutritionChips"` |
| Email / RIF / Dirección | `data/site.json` → `"brand"` |

---

## 🔁 Después de editar CSS o JS

En `index.html`, cambia el sufijo `?v=2026-10` de las hojas de estilo y scripts
(por ejemplo a `?v=2026-11`). Así los navegadores descargan la versión nueva
en vez de usar la guardada en caché.

## 🧩 Íconos

Los íconos son SVG de línea definidos una sola vez al inicio del `<body>`
(bloque «ÍCONOS SVG»). Para usar uno:
`<svg class="icon" aria-hidden="true"><use href="#i-wheat"/></svg>`.
No uses emojis como íconos: se ven distinto en cada teléfono y restan nivel a la marca.

## 🚀 Publicar el sitio

Este sitio es HTML puro — no necesita servidor especial.  
Puedes subirlo a:
- **Netlify** (gratis, drag & drop de la carpeta)
- **Vercel** (gratis, conecta con GitHub)
- **cPanel / Hosting tradicional** (subir carpeta por FTP)

El sitio se publica con **GitHub Pages** (archivo `CNAME` = `alimentoskriss.com`).
- Dominio canónico: `https://alimentoskriss.com/` (sin www). Úsalo igual en canonical, Open Graph, JSON-LD y sitemap.
- En GitHub → Settings → Pages, deja activado **Enforce HTTPS**.
- Tras publicar, prueba la vista previa en WhatsApp y valida en https://search.google.com/test/rich-results

---

## 🔮 Futuro: cuando haya más de 5 productos

Considera migrar a un generador estático:
- **Eleventy** (muy simple, HTML + JSON → páginas automáticas)
- **Astro** (moderno, muy rápido)

Ambos leen el mismo `products.json` y generan una página por producto automáticamente. El diseño no cambia — solo el proceso de build.
