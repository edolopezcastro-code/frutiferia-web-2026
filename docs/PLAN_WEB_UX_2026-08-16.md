# Plan — Web fácil y bonita: ruta corta al producto (WUX) · 2026-08-16

> **Cómo se usa:** cada PROMPT del §4 se pega tal cual en una sesión nueva con el modelo
> indicado. Los pasos de Eduardo (§5) toman minutos. Estado de los sprints en la tabla §3;
> el siguiente sprint se propone en Sami. Este archivo vive en el repo del tema
> (`~/Desktop/frutiferia-theme/docs/`, carpeta que Shopify ignora al desplegar) porque el
> 60% del trabajo es del tema; los otros repos referencian este doc.

---

## 1. Contexto y origen

Eduardo (2026-08-16): "la web no quedó fácil e intuitiva; si soy cliente B2C cuesta llegar
a los productos; quiero que quede bonita, moderna, alineada con el OS; que para B2C, B2B y
wellness sea súper fácil comprar, cotizar, armar el menú y entrar a su cuenta; todo conectado
con Frutiferia-OS; plan acotado y con sprints en paralelo".

**Lo que medimos en vivo (2026-08-16, `frutiferia.com`):**

| Síntoma | Dato duro |
|---|---|
| Los productos están lejos | Móvil 375×812: primer producto a **3.169 px** de scroll (~4 pantallas); primeras categorías a **3.747 px**. Escritorio 1440×900: en `/collections/frutas-deliciosas` el primer producto parte en **y = 1.076 px** (bajo el pliegue). |
| ~~El escritorio se ve apretado~~ **✅ RESUELTO 2026-08-17** | El carrito "dockeado" ocupaba el **25 % del ancho en TODAS las páginas** (contenido útil 1.080 px de 1.440). `dock_cart_drawer: false` pusheado (`77dc0e7`) y **verificado en vivo**: `main` 1.080 → **1.440 px**, la grilla de colección pasó de 4 a 5 columnas, el drawer abre como panel flotante con overlay. |
| Demasiado chrome | Barra despacho 40 px + header **191 px** + tira "¿Primer pedido?" 75 px = **306 px** antes del contenido (en móvil la tira mide 180 px). |
| Nadie sabe dónde está la tienda | 9 ítems de menú + botón. La entrada a productos se llama **"Vitrinea"**. "Por Mayor" duplica el catálogo B2B en Shopify compitiendo con el cotizador. |
| El cupón grita 5 veces | PRIMERA15 en barra, tira, pill del hero, popup a los 10 s (encima del hero) y newsletter. |
| No parece la misma marca | Tienda: Montserrat + logo viejo "FRUTIFERIA.COM" en mayúscula. Cotizador/Menú/Wellness: Georgia + Inter + logo 2026 minúscula. OS: Inter Tight. Tres CTAs distintos (`#2DB87F`, `#17845A`, gradiente); Bienestar en el magenta viejo `#D6457D` (canon `#B82883`); B2B en violeta muerto `#7C3AED` (canon `#2525C1`). Wellness es un callejón sin salida (0 links de vuelta, sin logo, sin móvil). |

**Lo que YA existe y se aprovecha (no se reconstruye):** hero editorial `fru-hero`, `audience-doors`,
`tokens-frutiferia.css` sincronizado con el rebranding del OS, quick-add en la grilla (`enable_quick_add`),
búsqueda predictiva viva, mega menú de Canopy **construido y sin usar** (0 bloques), sticky ATC en la ficha,
delivery-picker en carrito, cuenta Shopify + extensión de beneficios, cotizador maduro (COT-13),
menú semanal con handoff al carrito e identidad firmada, edge fns de leads/wellness/menú, panel
"Funnel Web 3.0" en el OS. Diagnóstico completo y referentes en §7.

---

## 2. Decisiones por defecto (veta aquí)

Si no dices nada, se ejecuta la columna "Default". Cada prompt las lee de aquí.

| # | Decisión | Default | Alternativa | Por qué |
|---|---|---|---|---|
| D-1 | ~~**Tipografía pública única · Georgia + Inter**~~ → **REVOCADA 2026-08-17 por Eduardo.** Ahora: **Inter Tight (títulos) + Inter (texto)**, el par exacto del OS (`frutiferia-so/src/index.css`: `--font-display: 'Inter Tight'`, `h1..h6 { letter-spacing: -0.018em }`). Ambas self-hosted y variables. | Georgia + Inter (lo que decía este plan). | El default original copiaba a los **satélites**; Eduardo, viendo la home en su iPhone: *"las letras no son bonitas, modernas, difieren de lo que hemos estado construyendo en Frutiferia-OS"*. El patrón a copiar era el **producto**, no los satélites: la serif hacía ver la tienda de otra época al lado del OS — que ya había sacado Space Grotesk por ese mismo motivo. Georgia sigue vigente en la skill `frutiferia-style` para piezas EDITORIALES (carruseles, PPT, documentos): es otro medio. ⚠️ **Deuda abierta**: WUX-5 alineó cotizador, wellness y menú a Georgia; hay que decidir si se mueven a Inter Tight (ver §5 G-9). |
| D-2 | **Menú de 5 entradas** | **Comprar ▾** (mega menú con fotos) · **Arma tu menú** · **Negocios** · **Oficinas** · **Recetas**. "Vitrinea", "Conócenos", "Blog" salen del header (van a footer / mega menú). | Mantener 9 ítems. | Un solo verbo para B2C ("Comprar") y una puerta por público. |
| D-3 | ~~**Carrito des-dockeado**~~ **✅ HECHO 2026-08-17 (`77dc0e7`)** | Drawer flotante normal. **NO era gate humano**: `config/settings_data.json` SÍ se despliega por git push (ver §7.D). | — | Recuperó el 25 % del ancho en escritorio. |
| D-4 | **"Por Mayor" en Shopify** | Sale del header. Vive en la landing Negocios como "Catálogo mayorista (referencia)" + en el mega menú de Negocios. **No se borra nada.** El camino B2B es el cotizador (OS). | Mantener "Por Mayor" en el header. | Dos caminos B2B confunden y sólo uno llega al OS. |
| D-5 | **Cupón PRIMERA15** | Se queda en: pill del hero + barra superior (copy unido: "Despacho gratis sobre $50.000 · 15 % en tu 1er pedido con PRIMERA15") + newsletter del footer. La **tira "¿Primer pedido?" se elimina** y el **popup pasa a exit-intent** (ya no salta a los 10 s sobre el hero). | Mantener tira y popup por tiempo. | 5 menciones → 3; el popup por tiempo tapaba el hero. |
| D-6 | **Orden de la home** | Hero compacto → **selector "Compro para: mi casa · mi negocio · mi equipo"** (tira de 1 fila) → **6 tiles de categoría con foto** → Ofertas de la semana (quick-add) → FrutiMenu → confianza → testimonios → banda Negocios → 7 años → recetas → newsletter. | Orden actual. | Producto visible en la 1ª pantalla de escritorio y ≤ 2 pantallas en móvil. |
| D-7 | ~~**Logo** del OS sin ".com"~~ **🔴 REVOCADA 2026-08-19 por Eduardo** ("el logo NO ES EL OFICIAL, está raro") | El logo es el **arte oficial del Drive** `4.6 BRANDING Y PLANTILLAS/Logo 2026/Logo-Horizontal-Morado.png` vectorizado 1:1: isotipo + **`frutiferia.com`**, morado oficial **`#A531EB`**, **sin barra divisoria**. Mismo archivo byte a byte en las 4 superficies. | — | El default original salió mal por partida triple (ver §7.I). |
| D-8 | **Bienestar mientras no haya DNS** | Todos los CTAs de Bienestar apuntan a `cotiza.frutiferia.com/bienestar` (portal vivo) y al formulario del tema. Cuando `wellness.frutiferia.com` resuelva (gate G-31), se cambian los 3 links listados en WUX-6. | Esperar el DNS para tocar Bienestar. | Hoy `wellness.frutiferia.com` da HTTP 000 (verificado 2026-08-16). |
| D-9 | **"Comprar ahora" (dynamic checkout) en la ficha** | **Apagado.** | Encendido. | Salta el carrito → sin día de reparto (el delivery-picker bloquea el checkout sólo desde el carrito), sin upsell, sin barra de despacho gratis. Y son dos botones verdes iguales. |
| D-10 | **Botón primario y CTA** | Botón primario sólido **verde `#17845A`** (AA 4,7:1 con texto blanco), hover `#248F57`. Gradiente `--grad-cta` (menta→verde) **sólo** en CTAs de hero (texto ≥ 18 px bold). Igual en las 4 superficies. | Menta plana `#2DB87F` en todo. | Menta plana + blanco da 2,5:1 (reprueba AA). El cotizador ya lo había corregido; el fix nunca se propagó. |
| D-11 | **Colores de canal en satélites** | Bienestar `#B82883` (ink `#9A196A`) · B2B `#2525C1` (ink `#1616A2`) · B2C `#097090`, iguales al OS y al tema. | Dejarlos como están. | Hoy cotizador y wellness usan hex muertos. |
| D-12 | **Fotos de tiles** | Se usan las imágenes de colección que ya tiene Shopify (las 29 tienen imagen); si alguna es "producto sobre blanco" y no luce, fallback a foto de producto de la colección. Eduardo puede reemplazar después desde el admin. | Esperar fotos nuevas. | No bloquear el sprint por fotos. |

**Preguntas batcheadas (responde sólo si vetas):**
1. ¿OK con Georgia+Inter en la tienda (D-1)? — *si dices "no", WUX-4 deja Montserrat y WUX-5 lleva los satélites a Montserrat.*
2. ¿OK con sacar "Por Mayor" del header (D-4) y apagar "Comprar ahora" (D-9)?
3. ¿Logo sin ".com" (D-7)?

---

## 3. Sprints

Tres **carriles en paralelo** (repos/archivos distintos) + un cierre. Puedes abrir **3 sesiones hoy
mismo: WUX-1, WUX-3 y WUX-5**. Cuando una termine, corre la siguiente de su carril.

| Carril | Sprint | Modelo | Qué hace | Repos / archivos que TOCA | Estado |
|---|---|---|---|---|---|
| 🟣 A · Llegar al producto | **WUX-1** Home "ruta corta" | Opus | Nueva sección de **6 tiles de categoría con foto**, selector de público en 1 fila, hero compacto, reorden de la home (D-6). Métrica: tiles visibles sin scroll en escritorio; primer producto ≤ 1.600 px en móvil. | tema: `templates/index.json`, `sections/fru-hero.liquid`, `sections/audience-doors.liquid`, **nuevos** `sections/fru-category-tiles.liquid` + `assets/fru-category-tiles.css` | ✅ (2026-08-17, en vivo) · escritorio 849 px ✓; móvil 929 px → **749 px cuando WUX-2 borre la tira de 180 px** |
| 🟣 A | **WUX-2** Header de 1 fila + mega menú + menú de 5 | Sonnet | Header ≤ 120 px, logo SVG 2026, tira "¿Primer pedido?" fuera, barra superior con copy unido, **mega menú "Comprar" con fotos** (bloque `columns` de Canopy), menú de 5 en el admin (Claude por navegador). | tema: `sections/header-group.json`, `sections/header.liquid`, **nuevo** `assets/frutiferia-logo.svg`; admin Shopify → Navegación (`menu-frutiferia`, `footer-ayuda`) | ✅ (2026-08-17, en vivo) · escritorio 191→**73 px** (meta ≤120 ✓), móvil 115→**107 px** (meta ≤110 ✓) · **cascada de WUX-1 cerrada**: primer tile móvil 929→**681 px** (meta ≤750 ✓), primer producto móvil 1.661→**1.473 px** (meta ≤1.600 ✓, calza con la proyección). |
| 🟢 B · Comprar rápido | **WUX-3** Colección, ficha y carrito de compra rápida | Sonnet | Grilla arriba (banner sin foto, promo-tile fuera, descripción abajo), tarjeta limpia (sin "Frutiferia SPA" ni "1.0 kg", quick-add sólido), ficha sin "Comprar ahora" (D-9) + desvío B2B de 1 línea, drawer con link a carrito, popup a exit-intent (D-5), `/collections` como landing "Comprar". | tema: `templates/collection.json`, `templates/product.json`, `templates/cart.json`, `templates/list-collections.json`, `sections/overlay-group.json`, `snippets/product-card.liquid` (+ su css), `sections/main-collection-banner.liquid` sólo si hace falta | ✅ (2026-08-17, en vivo) · primer producto en `/collections/frutas-deliciosas` 1.076 px → **446 px** escritorio (meta ≤620 ✓) / **396 px** móvil (meta ≤700 ✓). Pendiente para WUX-4: reemplazar el `#17845A` literal del quick-add por `--fru-verde-800` cuando exista el token. |
| 🟢 B | **WUX-4** Capa de marca del tema | Opus | `fru-brand.css` cargado DESPUÉS de `main.css`: Georgia+Inter (D-1) self-hosted, botón primario `#17845A` (D-10), radios/sombras/focus de tokens, footer con las 4 superficies + WhatsApp por canal, `es.json` a tuteo ("Tu carrito", "Agregar"), token `--fru-verde-800`. | tema: **nuevo** `assets/fru-brand.css.liquid`, `assets/inter-variable.woff2`, `layout/theme.liquid`, `assets/tokens-frutiferia.css`, `assets/quick-add.css`, `sections/footer-group.json`, `sections/footer.liquid`, `locales/es.json` | ✅ (2026-08-17, en vivo) · h2 Georgia + body/nav/tarjeta Inter ✓; `.btn--primary` `#17845A` en los 3 esquemas de color, pastilla, **4,68:1** ✓; hover corregido a `#136E4B` (**6,25:1**) porque el `#248F57` de D-10 aclaraba y caía a 4,08:1; footer con 5 columnas y las 4 superficies; **61** strings de `es.json` a tuteo, 0 formas de usted en 5 pasadas. `theme check` 48/33/10 = base exacta. |
| 🔵 C · Satélites + OS | **WUX-5** Satélites alineados | Sonnet | Cotizador, Wellness y Menú con el mismo logo SVG, D-10, D-11, header/footer con cross-links a las 4 superficies, wellness con móvil, charts del menú con tokens del OS. | `frutiferia-cotizador`, `frutiferia-wellness`, `mi-menu-semanal` (3 repos, Vercel + Lovable) | ✅ (2026-08-17, en vivo las 3) · el menú semanal quedó publicado por Eduardo (fuente + logo oficial, verificado en vivo el 2026-08-19) |
| 🔵 C | **WUX-6** Puentes con el OS + línea base | Sonnet | Línea base de medición (funnel RPC + Shopify Analytics), smoke de los 6 puentes web→OS, landings B2B/Bienestar/FrutiMenu con CTAs correctos (D-4, D-8), 3 links a cambiar cuando haya DNS wellness. | `frutiferia-so` (lectura + panel), tema: `templates/page.b2b.json`, `page.bienestar.json`, `page.frutimenu.json` | ✅ (2026-08-17, en vivo) · 6/6 puentes vivos, línea base cargada en §8, `Web3FunnelCard` confirmado sano, link a Bienestar agregado y deployado en la extensión de cuenta |
| ⚪ Cierre | **WUX-7** QA integral | Sonnet | En prod: 12 rutas 200, medidas de scroll/header, matriz de cross-links, contraste AA, voseo (3 pasadas), PSI móvil. Entrega lista de fixes por carril. | ninguno (read-only) | ✅✅ ABSORBIDO y EJECUTADO por BELLA-10 de `docs/PLAN_WEB_BELLA_2026-08-27.md` el 2026-08-28 (§6 de ese plan) — los 12 puntos se corrieron en vivo contra producción con un cliente CDP casero (getComputedStyle real). Resultado: WUX-1..6 pasan limpio (tipografía 2 archivos exactos, logo sin regresión, header en meta, sin "usted"/voseo, JSON-LD con dirección/geo correctos, footer 5 columnas, cross-links confirmados en ambas direcciones incl. wellness.frutiferia.com que ya resuelve DNS). Único hallazgo no-BELLA: warning de consola de `shop_events_listener` en `/collections/frutas-deliciosas` (Shopify, no del tema). |

**Regla dura para las 2 sesiones del tema en paralelo (A y B):** cada una commitea **sólo los archivos
de su fila** (`git add <archivo>`, nunca `-A`), hace `git pull --rebase` antes de cada push, y recuerda
que **push = deploy en vivo**. Si el puerto 9292 de `theme dev` está ocupado, usa `--port 9293`.

---

## 4. Prompts listos para pegar

### PROMPT WUX-1 — Home "ruta corta al producto" (Opus)

```
Sesión WUX-1 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md, repo del tema
Shopify frutiferia-web-2026 (clon local ~/Desktop/frutiferia-theme, rama main, repo-first:
`git pull --rebase` antes de editar y antes de cada push; PUSH = DEPLOY EN VIVO).
Activa las skills: edu-sprints, frutiferia-ux-ui, anthropic-skills:frutiferia-style, frontend-design.
Lee §1, §2 (defaults D-1, D-5, D-6, D-12) y §7 del plan antes de tocar nada. Otra sesión (WUX-3)
puede estar editando EN PARALELO templates/collection|product|cart|list-collections.json,
overlay-group.json y snippets/product-card.liquid: NO toques esos archivos. Sólo commitea los tuyos.

Objetivo: que un cliente B2C vea categorías y productos sin buscar. Hoy (medido 2026-08-16):
móvil 375×812 → primer producto a 3.169 px, categorías a 3.747 px; escritorio 1440×900 → nada
de producto en el primer pliegue. Meta: en escritorio los 6 tiles de categoría visibles sin
scroll (top ≤ 850 px con el header actual de 191 px); en móvil primer tile ≤ 750 px y primer
producto ≤ 1.600 px.

Tareas:
1. Nueva sección `sections/fru-category-tiles.liquid` + `assets/fru-category-tiles.css`
   (cárgalo desde la sección con `{{ 'fru-category-tiles.css' | asset_url | stylesheet_tag }}`).
   6 bloques `tile` (collection picker + label opcional + eyebrow opcional). Grilla 2 columnas
   en móvil (tile ~172 px alto), 3×2 o 6×1 en escritorio (elige la que dé mejor con foto). Foto:
   `block.settings.collection.image` con fallback a `collection.products.first.featured_image`
   (D-12); imagen con `sizes`/`srcset` responsivos y `loading="lazy"` salvo los 2 primeros.
   Título en `var(--font-display)` (D-1; si Eduardo veta D-1, cambia a `inherit`), tamaño 20-24 px,
   contador "N productos" en `--text-caption`. Radio `--radius`, sombra `--shadow-md`, hover
   translateY(-2px) + `--shadow-lg` con `--dur-micro`, respeta `prefers-reduced-motion`. Enlace
   "Ver todo el catálogo →" bajo la grilla → /collections/catalogo-completo. Schema: heading
   (default "¿Qué necesitas hoy?"), subheading, `color_scheme`, `full_width`; preset con las 6
   colecciones: frutas-deliciosas, verduras-frescas, despensa, snacks, frutipack, ofertas.
   Ojo Canopy: settings `type:"url"` NO aceptan `default`; labels ≤ 70 chars; richtext SIEMPRE
   envuelto en <p>; un error de schema tumba el upload del tema ENTERO (theme dev lo nombra).
2. `sections/audience-doors.liquid`: agrega un setting `layout` (select: `editorial` = lo actual,
   `strip` = nuevo). En `strip`: UNA fila de 3 pastillas grandes ("Para mi casa" → #tiles /
   "Para mi negocio" → https://cotiza.frutiferia.com / "Para mi equipo" → /pages/bienestar), altura
   ≤ 72 px escritorio y ≤ 120 px móvil (3 pastillas en fila, texto 14-15 px), colores de canal por
   `--pill-*` (relleno) y `--pill-*-ink` (texto), la de negocio en sólido (es la que trae caja).
   No borres el layout editorial (rollback barato).
3. `sections/fru-hero.liquid`: setting `compact` (checkbox). En compacto: min-height ≤ 60vh
   escritorio, foto móvil ≤ 220 px, mismo H1/CTA. Mantén preload/fetchpriority/altura fija
   (LCP y CLS ya están bien — no los rompas).
4. `templates/index.json` (D-6): orden = fru_hero (compact:true) → audience_doors (layout:strip)
   → fru_category_tiles (nuevo, id `fru_category_tiles`) → featured-collection (Ofertas, deja el
   carousel y verifica que el quick-add "+ Carrito" se ve) → frutimenu_promo → icons
   (3721924b-…) → testimonials_JERNA6 → b2b_band → media_with_text_VAd4Hi → featured_blog_recetas
   → newsletter_WXJigB → scrolling_banner_ArEtdk → recently_viewed_home. `collection-list`
   ("¿Qué buscas?") queda `disabled: true` (rollback), NO borrada. Recuerda el comentario `/* */`
   al inicio del JSON: consérvalo.
5. NO toques header-group.json (tira/promo strip = WUX-2) ni overlay-group.json (popup = WUX-3).

Verificación (obligatoria antes de push):
- `cd ~/Desktop/frutiferia-theme && shopify theme check` → 0 errores.
- `cd ~/Desktop/frutiferia-theme && shopify theme dev --store=frutiferia-spa.myshopify.com`
  (en background; NUNCA con `| head`; si 9292 está ocupado, `--port 9293`) → `curl -s -o /dev/null
  -w "%{http_code}" http://127.0.0.1:9292/` = 200 y sin "Failed to Upload Theme Files".
- Abre el preview del tema en el Browser pane (preview_start {url:"http://127.0.0.1:9292"}) a
  375×812 y 1440×900 y mide con getBoundingClientRect (el pane está oculto: scroll por JS, no
  por gesto; el layout SÍ se calcula) el `top` del primer tile y del primer `.card--product`.
  Reporta las 4 cifras contra la meta. Screenshot de ambas vistas.
- Contraste AA de los textos sobre las fotos/tiles (calcúlalo, no lo estimes).
Cierre: commits self-contained (1: sección tiles, 2: doors strip + hero compact, 3: index.json)
+ `git pull --rebase` + push → verifica en https://frutiferia.com con curl (grep del id
`fru_category_tiles`) → actualiza §3 (estado) y §6 (registro) de este plan → `tion_cerrar`/
`tion_log_sesion` → cierra con "Lo que tienes que hacer tú" (QA en iPhone: cuántos scrolls hasta
ver productos; y si algún tile se ve mal, qué colección necesita mejor foto).
```

### PROMPT WUX-2 — Header de una fila + mega menú "Comprar" + menú de 5 (Sonnet)

```
Sesión WUX-2 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md, repo del tema
Shopify frutiferia-web-2026 (clon ~/Desktop/frutiferia-theme, main, repo-first, `git pull --rebase`
antes de editar/pushear; PUSH = DEPLOY). Corre DESPUÉS de WUX-1. Activa: edu-sprints,
frutiferia-ux-ui, frutiferia-style. Lee §2 (D-2, D-4, D-5, D-7) y §7 del plan. Otra sesión (WUX-4)
puede estar tocando theme.liquid, footer-group.json, es.json, tokens y fru-brand.css: NO los
toques. Tus archivos: sections/header-group.json, sections/header.liquid,
sections/free-shipping-bar.liquid, assets/frutiferia-logo.svg (nuevo).

Hoy: header 191 px escritorio / 115 móvil, 9 ítems + botón, entrada a la tienda llamada
"Vitrinea", tira "¿Primer pedido?" de 75/180 px, mega menú de Canopy construido y sin usar
(0 bloques en header-group.json). Meta: header ≤ 120 px escritorio y ≤ 110 móvil, 5 entradas,
mega menú "Comprar" con fotos, logo 2026.

Tareas:
1. Logo (D-7): exporta el logo del OS a SVG estático `assets/frutiferia-logo.svg` (isotipo +
   wordmark minúscula, morado #671D90) desde
   `Frutiferia/Sistemas/frutiferia-so/src/components/brand/{FrutiferiaMark,FrutiferiaWordmark}.tsx`
   (viewBox 64×64 y 109.96×20; los brillos son huecos evenodd — consérvalos). Si el cotizador
   ya tiene `public/brand/frutiferia-logo.svg` (lo crea WUX-5), copia ESE archivo byte a byte
   para que sea el mismo en las 4 superficies. En `sections/header.liquid` agrega al schema un
   checkbox `use_svg_logo` (default true) y, si está activo, renderiza el SVG inline
   (`{{ 'frutiferia-logo.svg' | inline_asset_content }}`; si el filtro no existe en esta versión
   de Liquid, `<img src="{{ 'frutiferia-logo.svg' | asset_url }}">`) con alto 36-40 px, en vez
   del `logo` image_picker. Mantén el image_picker como fallback.
2. Header de una fila: revisa el schema de `logo_position` y las variantes de layout de Canopy
   7.2.2; elige la que deje logo + menú + buscador + cuenta + carrito en UNA fila en escritorio.
   Si no existe variante inline, usa `minimise_search_desktop: true` y ajusta CSS mínimo en
   header.liquid. Mantén `enable_sticky: true`; evalúa `hide_menu` (si el menú se esconde al
   bajar y el header queda de 1 fila, déjalo). `menu_featured_link`: "Ofertas de la semana" si
   queda como ítem de primer nivel, si no, vacío (hoy dice "Sale": muerto).
3. header-group.json (D-5): elimina la sección `promo_strip_QLcH46` del grupo (rollback = git).
   En `free-shipping-bar` cambia el copy a "🚚 Despacho gratis sobre $50.000 · Mié y Sáb · 15 %
   en tu 1er pedido con PRIMERA15" (ajusta `copy_empty`; que quepa en 1 línea en móvil o
   recorta a "Despacho gratis sobre $50.000 · 15 % con PRIMERA15").
4. Menú de 5 (D-2, D-4) en el admin: Shopify → Contenido/Navegación → "Menú Frutiferia" (handle
   `menu-frutiferia`). Hazlo tú por el navegador de Eduardo (Chrome MCP, precedente S1.1 del
   plan web 2026: la página de Navegación SÍ es automatizable, el Theme Editor NO). Estructura:
   - Comprar → /collections  · hijos: Frutas → /collections/frutas-deliciosas · Verduras →
     /collections/verduras-frescas · Despensa → /collections/despensa · Snacks → /collections/snacks
     · Proteínas vegetales → /collections/proteinas-vegetales-y-alimentos-veganos · Legumbres →
     /collections/legumbres · Aceitunas y condimentos → /collections/aceitunas · Packs →
     /collections/frutipack · Ofertas de la semana → /collections/ofertas · Efecto $990 →
     /collections/990 · Todo el catálogo → /collections/catalogo-completo
   - Arma tu menú → /pages/frutimenu
   - Negocios → /pages/proveedor-restaurantes · hijos: Cotizar online → https://cotiza.frutiferia.com
     · Catálogo mayorista → /collections/por-mayor · Hablar con Francisco →
     https://wa.me/56993261147
   - Oficinas → /pages/bienestar
   - Recetas → /blogs/recetas
   "Conócenos" y "Vida saludable" van al menú `footer-ayuda` (agrégalos ahí). Si el navegador no
   te deja, entrega la lista EXACTA arriba en "Lo que tienes que hacer tú" (10 min de Eduardo).
5. Mega menú: en header-group.json agrega un bloque `columns` para "Comprar" (lee en el schema
   de header.liquid cómo se asocia el bloque al ítem — por título del link), con
   `collection_images` "standard", promo1 = Ofertas de la semana (imagen de la colección
   `ofertas`, link /collections/ofertas), promo2 = "Arma tu menú" (link /pages/frutimenu). Y un
   bloque para "Negocios" con promo1 → cotizador. Sin badges. Un solo nivel de columnas.
6. NO toques index.json, overlay-group.json, footer-group.json, theme.liquid, tokens, es.json.

Verificación: `shopify theme check` 0 errores; `theme dev` + curl 200; en el Browser pane a
1440×900 y 375×812 mide la altura del header (`.shopify-section` del header) y confirma ≤ 120/110;
fuerza la clase abierta del mega menú por JS y screenshot; curl a https://frutiferia.com y grep de
los 5 títulos del menú tras el cambio en admin (el menú es contenido admin: se ve en vivo al
instante, no necesita push). Cierre: commits (1: logo, 2: header layout + strip, 3: mega menú)
+ push + verificación en prod + §3/§6 + Tion + "Lo que tienes que hacer tú".
```

### PROMPT WUX-3 — Colección, ficha y carrito de compra rápida (Sonnet)

```
Sesión WUX-3 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md, repo del tema
Shopify frutiferia-web-2026 (clon ~/Desktop/frutiferia-theme, main, repo-first, `git pull --rebase`
antes de editar/pushear; PUSH = DEPLOY). Activa: edu-sprints, frutiferia-ux-ui, frutiferia-style.
Lee §2 (D-3, D-5, D-9, D-10) y §7. Corre EN PARALELO con WUX-1 (que edita index.json, fru-hero,
audience-doors y crea fru-category-tiles): NO toques esos archivos. Tus archivos:
templates/collection.json, templates/product.json, templates/cart.json,
templates/list-collections.json, sections/overlay-group.json, snippets/product-card.liquid (+ su
css en assets/), sections/main-collection-banner.liquid SÓLO si hace falta.

Hoy (medido): en /collections/frutas-deliciosas el primer producto parte en y=1.076 px (1440×900);
la tarjeta muestra "Frutiferia SPA" y "1.0 kg" (ruido); un promo-tile "Ofertas especiales" ocupa
la posición 1 de la grilla; la ficha tiene dos botones verdes iguales (Añadir + Comprar ahora); el
popup salta a los 10 s sobre el hero. Meta: primer producto ≤ 620 px escritorio / ≤ 700 px móvil
(con el header actual), tarjeta limpia, un solo botón primario.

Tareas:
1. `templates/collection.json`: `collection-banner` → `show_image: false`, `use_product_image:
   false`; si el schema de main-collection-banner permite ocultar la descripción
   (`show_description`/similar), ocúltala y agrega al final del template una sección `rich-text`
   o `collapsible` que muestre `collection.description` (SEO intacto); si no permite, deja la
   descripción pero recórtala visualmente con CSS `line-clamp: 2` + "leer más". Saca el bloque
   `image_promotion_kqxbRA` de `collection-products` (rollback = git). `products_per_page: 36`,
   `card_size` "medium" en escritorio y "small" en móvil, `filters_open_lg: false` (los filtros
   como botón/drawer, la grilla usa todo el ancho), `frutimenu_cta_collection` pasa DEBAJO de la
   grilla. Mantén filtros/orden.
2. `snippets/product-card.liquid`: (a) vendor: no mostrarlo si `product.vendor == shop.name`
   (hoy sale "Frutiferia SPA"); (b) peso: no mostrar la línea de peso en la tarjeta (el título ya
   dice el formato "(kg)"/"(5 kg)"); (c) el quick-add "+ Carrito" hereda `.btn--primary` sólido
   (D-10: color = `--fru-verde-800` `#17845A` si el token ya existe en tokens-frutiferia.css — lo
   agrega WUX-4 —, si no, usa `#17845A` literal con comentario `/* TODO token */`), altura ≥ 40 px,
   texto "Agregar"; (d) precio con `tabular-nums`. NO toques el swap de imagen por variante ni el
   lazy nativo (FRUTI3-16).
3. `templates/product.json`: bloque `buy-buttons` → `enable_dynamic_checkout: false` (D-9);
   `msg_envio` → colores del bloque a tokens (fondo `#F4F0F7`, texto `#248F57`) en vez de
   #e8f5e9/#2e7d32; agrega un bloque `richtext` justo después de `buy-buttons`: "<p>¿Compras
   para un negocio? <a href="https://cotiza.frutiferia.com">Cotiza por mayor →</a></p>" (1 línea,
   14 px, `--text-muted`). Sticky ATC ya está on: no lo toques.
4. `sections/overlay-group.json`: `cart-drawer` → `show_cart_page_link: true`; `pop-up-welcome`
   → `trigger: "exit"` (D-5), mantiene guests-only y `dismiss_days: 30`. NO cambies los promoted
   products.
5. `templates/list-collections.json`: título "Comprar" (H1 "Toda la tienda"), `card_size:
   "large"`, descripción `<p>Elige una categoría o busca arriba.</p>` (richtext SIEMPRE en <p>).
   Esta página es el destino del ítem "Comprar" del menú (WUX-2).
6. `templates/cart.json`: nada estructural; sólo verifica que `frutimenu_cta_cart` y
   `upsell_ofertas` sigan y que el delivery-picker se renderice (setting `show_delivery_picker`
   está true).
7. (D-3 ya está hecho: el carrito se des-ancló el 2026-08-17 en `77dc0e7`. NO lo pidas como gate
   y NO toques `config/settings_data.json` — si necesitas cambiar un ajuste ahí, lee §7.D primero.)
   Sí conviene que revises si con el ancho nuevo (1.440 px, 5 columnas de 184 px) las tarjetas
   quedaron chicas: `card_size` "medium" en escritorio es parte de tu tarea 1.

Verificación: `shopify theme check` 0 errores; `theme dev` + curl 200 en /collections/frutas-
deliciosas, /products/platanos, /cart, /collections; Browser pane: mide `top` del primer
`.card--product` en 1440×900 y 375×812; clic en "Agregar" de una tarjeta y confirma con
`fetch('/cart.js')` que `item_count` subió; en la ficha confirma que NO hay botón dynamic checkout
y sí el link "Cotiza por mayor"; screenshot de colección y ficha. Cierre: commits (1: colección +
tarjeta, 2: ficha, 3: overlays + list-collections) + `git pull --rebase` + push + prod check + §3/§6
+ Tion + "Lo que tienes que hacer tú" (des-dockear carrito: Tienda online → Temas →
frutiferia-web-2026/main → Personalizar → Configuración del tema → Carrito → desmarcar "anclar/dock
cart drawer" → Guardar; 2 min).
```

### PROMPT WUX-4 — Capa de marca del tema (Opus)

```
Sesión WUX-4 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md, repo del tema
Shopify frutiferia-web-2026 (clon ~/Desktop/frutiferia-theme, main, repo-first, `git pull --rebase`
antes de editar/pushear; PUSH = DEPLOY). Corre DESPUÉS de WUX-3. Activa: edu-sprints,
frutiferia-ux-ui, frutiferia-style, frontend-design. Lee §2 (D-1, D-5, D-7, D-10) y §7. WUX-2 puede
estar tocando header-group.json/header.liquid/free-shipping-bar: NO los toques. Tus archivos:
assets/fru-brand.css (nuevo), assets/inter-*.woff2 (nuevos), layout/theme.liquid,
assets/tokens-frutiferia.css, sections/footer-group.json, locales/es.json.

Contexto: la tienda renderiza Montserrat/Avenir (settings del editor, editor-owned) mientras
cotizador/menú/wellness ya viven en Georgia + Inter; el botón primario es menta plana (2,5:1);
el footer no enlaza a las otras superficies; los strings heredados de Canopy tratan de usted
("Su carrito esta vacío") mientras las secciones propias tutean.

Tareas:
1. `assets/tokens-frutiferia.css`: agrega `--fru-verde-800: #17845A` y `--color-cta-solid:
   var(--fru-verde-800)`; `--on-cta` sigue blanco. No cambies nada más de la Capa 3 (canal).
2. `assets/fru-brand.css` (nuevo), cargado en `layout/theme.liquid` INMEDIATAMENTE DESPUÉS de
   `main.css` (hoy tokens va antes y pierde). Contenido: (a) `@font-face` Inter 400/500/600/700
   self-hosted (copia los woff2 de `Frutiferia/Sistemas/frutiferia-cotizador/src/fonts/`) +
   preload del 400 y 600 en theme.liquid; (b) D-1: `body, .rte, .btn, input, select {font-family:
   var(--font-body)}` y `h1,h2,h3,.h0,.h1,.h2,.h3,.section__heading,.card__title? — revisa los
   selectores reales de Canopy — {font-family: var(--font-display); letter-spacing: -0.01em}`;
   títulos de tarjeta de producto y navegación quedan en Inter (legibilidad chica); (c) D-10:
   `.btn--primary` fondo `--color-cta-solid`, hover `#248F57`, radio `--radius-pill` en botones
   de acción, focus visible 2 px `--color-primary`; el `--grad-cta` sólo lo usan hero/CTAs
   grandes (no lo pises); (d) tarjetas/paneles: `--radius`, `--shadow-md`, borde `--border`;
   (e) enlaces `--color-primary` con subrayado en hover. Prueba que el override NO rompa el
   header sticky ni el drawer. Si Eduardo vetó D-1 (mira §2), omite (b) y deja el resto.
3. `sections/footer-group.json`: columna "Comprar" (menú `footer-comprar`, ya existe) · columna
   "Frutiferia para…" con 4 links: Hogares → /collections · Negocios (cotizador) →
   https://cotiza.frutiferia.com · Menú semanal → /pages/frutimenu · Oficinas → /pages/bienestar ·
   columna "Ayuda" (`footer-ayuda`) · bloque de contacto: "Hogares: WhatsApp Mora +56 9 6609 3891
   · Negocios y oficinas: Francisco +56 9 9326 1147" (links wa.me). Newsletter del footer se queda
   (es la 3ª y última mención de PRIMERA15, D-5). Verifica que la banda de confianza siga
   oculta en la landing B2B (`hide_on_b2b`).
4. `locales/es.json`: tuteo consistente — "Su carrito"→"Tu carrito", "Su carrito esta vacío"→"Tu
   carrito está vacío", "Añadir al carrito"→"Agregar al carrito", "+ Carrito"→"Agregar",
   "Inténtelo nuevamente"→"Inténtalo de nuevo", y barre TODAS las formas de usted (grep de
   "Su ", "usted", "Inténtelo", "puede " en el archivo, mínimo 3 pasadas — el grep BSD calla con
   bytes raros). NO toques claves que sean placeholders de Shopify checkout.
5. Entrega en "Lo que tienes que hacer tú" el checklist OPCIONAL del editor (3 min): si quiere
   dejar el editor coherente con el CSS: Tipografía → Encabezados: Georgia; Cuerpo: Inter
   (ambos están en la librería de Shopify); Tarjetas de producto → ocultar proveedor y peso.

Verificación: `shopify theme check` 0; `theme dev` + curl 200 en /, /collections/frutas-
deliciosas, /products/platanos, /cart, /pages/proveedor-restaurantes; Browser pane: confirma
`getComputedStyle` de un h2 (Georgia) y del body (Inter), del `.btn--primary` (#17845A) y screenshot
home+ficha en escritorio y móvil; contraste calculado botón/tinta ≥ 4,5:1. Cierre: commits (1:
tokens+fru-brand.css+fuentes, 2: footer, 3: es.json) + `git pull --rebase` + push + prod check
(curl grep de `fru-brand.css` en el HTML de https://frutiferia.com) + §3/§6 + Tion + "Lo que tienes
que hacer tú".
```

### PROMPT WUX-5 — Satélites alineados: cotizador, wellness, menú (Sonnet)

```
Sesión WUX-5 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md. Tres repos:
- frutiferia-cotizador: Mi unidad/Frutiferia/Sistemas/frutiferia-cotizador (Vercel autodeploy en push a main)
- frutiferia-wellness: Mi unidad/Frutiferia/Sistemas/frutiferia-wellness (Vercel; DNS wellness.frutiferia.com AÚN NO resuelve)
- mi-menu-semanal: ~/Desktop/mi-menu-semanal (Lovable: push NO despliega, Eduardo aprieta Publish)
Repo-first en los tres: `git pull --rebase` antes de editar; `git add` por archivo (los repos
viven en Drive: NUNCA `-A`). Activa: edu-sprints, frutiferia-ux-ui, frutiferia-style, frutimenu
(para el menú). Lee §2 (D-1, D-7, D-10, D-11) y §7. Ninguna otra sesión toca estos repos.

Hallazgos (matriz §7.C): wellness usa Bienestar `#D6457D` y CTA menta 2,5:1; cotizador y wellness
tienen `b2b: #7C3AED` (violeta muerto); tres CTAs distintos; wellness sin logo, sin link a la
tienda, sin móvil; menú con `--chart-*` de shadcn; logos PNG distintos por repo.

Tareas (mismo orden en los 3 repos donde aplique):
1. Logo (D-7): exporta UNA vez el SVG del OS
   (`Frutiferia/Sistemas/frutiferia-so/src/components/brand/{FrutiferiaMark,FrutiferiaWordmark}.tsx`
   → `frutiferia-logo.svg` isotipo + wordmark minúscula #671D90, y `frutiferia-logo-blanco.svg`)
   a `frutiferia-cotizador/public/brand/`; copia byte a byte a `frutiferia-wellness/public/brand/`
   y `mi-menu-semanal/public/brand/`. Reemplaza los PNG del header en los 3 (`Header.tsx` del
   cotizador y wellness, `Logo.tsx` del menú). Alto 32-36 px, alt "Frutiferia".
2. Tokens (D-10, D-11): en `tailwind.config.ts` de cotizador y wellness: `rosa` → 900 `#9A196A`
   / 500 `#B82883` / 050 `#F8E7F1`; `b2b` → `#2525C1`; `cta` → `#17845A` (wellness) — el
   cotizador ya lo tiene; agrega `verde: {800:'#17845A', 700:'#248F57'}`. En wellness también
   `index.html` theme-color y `src/index.css` (hex en duro). En el menú (`src/styles.css`, Tailwind
   v4): `--chart-1..4` = `#7B22AA / #0E79A0 / #A06D0E / #1D865A` (OS), `--radius: 1rem` (16 px como
   tema y cotizador; revisa que las escalas calc no rompan chips), CTA de botones chicos →
   `#17845A` sólido; el gradiente se queda SOLO en el hero. NO toques lógica ni motor.
3. Chrome común: header con logo → https://frutiferia.com; footer en los 3 con la misma línea:
   "Frutiferia · Tienda (frutiferia.com) · Cotizador B2B (cotiza.frutiferia.com) · Menú semanal
   (menu.frutiferia.com) · Bienestar (/pages/bienestar de la tienda mientras no haya DNS, D-8) ·
   WhatsApp: Mora +56 9 6609 3891 (hogares) / Francisco +56 9 9326 1147 (negocios y oficinas)".
   Wellness: `Header.tsx` con logo + link "Tienda", `Footer.tsx` con la nav, y en móvil una barra
   inferior sticky con el CTA "Cotiza tu programa" (safe-area). Cotizador: la ruta `/bienestar`
   toma los nuevos hex de rosa. Menú: el footer sólo cuando NO está embebido (ya se oculta con
   `data-app-chrome`).
4. NO cambies textos de negocio, precios ni el motor de ninguno.

Verificación por repo: `npx tsc --noEmit` + tests (`npx vitest run` en cotizador ≥ 106/106; wellness
los que tenga; menú `bun run` o `npm run` según package.json) + build; preview local en el Browser
pane a 375 y 1440 con screenshot de header/footer/hero de cada uno; grep de que ya no queda
`#D6457D`, `#7C3AED`, `#2DB87F` como fondo de botón (salvo gradiente de hero) en `src/`. Cierre:
1 commit por repo (o 2 si el menú se separa en tokens vs chrome) + push; cotizador/wellness:
verifica el deploy de Vercel con curl al bundle (grep del hex nuevo); menú: **Publish en Lovable =
gate de Eduardo** (deja el marcador a grepear en el bundle de prod). §3/§6 + Tion + "Lo que tienes
que hacer tú" (Publish Lovable 1 min; DNS wellness G-31 5 min si quiere que Bienestar tenga casa).
```

### PROMPT WUX-6 — Puentes con el OS + línea base de medición (Sonnet)

```
Sesión WUX-6 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md. Repos:
frutiferia-so (Mi unidad/Frutiferia/Sistemas/frutiferia-so O ~/Desktop/frutiferia-so — usa el clon
que esté en `main` y limpio; si ambos están en otra rama con cambios ajenos, NO cambies de rama:
`git worktree add ~/Desktop/frutiferia-so-wux main`) y el tema (~/Desktop/frutiferia-theme, main;
tus únicos archivos ahí: templates/page.b2b.json, page.bienestar.json, page.frutimenu.json).
Activa: edu-sprints, frutiferia-os, frutiferia-ux-ui. Lee §2 (D-4, D-8) y §7. Corre después de
WUX-5 (o en paralelo si no vas a tocar los satélites).

Objetivo: que "todo conectado con el OS" sea verificado, no supuesto, y dejar una línea base para
medir el rediseño.

Tareas:
1. Línea base (registra en §8 de este plan, con fecha): (a) `select get_web3_funnel_metrics(30)`
   en prod (por Mgmt API si tienes, si no SQL inline para Eduardo); (b) Shopify Analytics últimos
   30 días: sesiones, tasa de conversión, % sesiones con "agregar al carrito", % que llegan al
   checkout, ticket promedio (léelo por el navegador de Eduardo en admin.shopify.com/store/
   frutiferia-spa/analytics o pídeselo en "Lo que tienes que hacer tú"). Estas cifras se comparan
   30 días después de que A y B estén en vivo.
2. Smoke de los 6 puentes web→OS (sin crear datos falsos: usa preflight/deny-path):
   `b2b-lead-intake` (OPTIONS 200 + POST vacío 400), `b2c-welcome-intake` (idem),
   `cotizador-api` action catalog (200, 362±), `delivery-availability` (200 con `dates` no vacío),
   `https://frutiferia.com/apps/fruti-identity` (200 `{"authenticated":false}`),
   `menu-subscriber-intake` (401/503 sin secret = fail-closed). Lo que esté muerto, arréglalo y
   redeploya (`npx supabase functions deploy <fn> --project-ref ykvexpxvlivcqamqsafe`).
3. Landings del tema (D-4, D-8): `page.b2b.json` — CTA primario a https://cotiza.frutiferia.com,
   sección `productos_b2b` (colección `por-mayor`) etiquetada "Catálogo mayorista de referencia —
   los precios finales van en tu cotización"; el form `contacto_b2b` sigue con `crm_source`
   correcto (edge fn b2b-lead-intake). `page.bienestar.json` — CTA "Cotiza tu programa" →
   https://cotiza.frutiferia.com/bienestar y "Ya tengo programa" al mismo portal; el form
   `contacto_wellness` con `crm_endpoint` de `b2b-lead-intake` y `crm_source='web-wellness'`
   (verifica que exista; si no, cabléalo igual que en page.b2b.json). Deja en el §8 del plan la
   lista de los 3 links exactos que cambian a `https://wellness.frutiferia.com` cuando G-31 cierre.
   `page.frutimenu.json` — confirma `embed_url` https://menu.frutiferia.com/?embed=1 y
   `height_mobile` ≥ 720.
4. OS: en `/crm` el `Web3FunnelCard` debe seguir pintando tras cualquier cambio; si el RPC falla,
   arréglalo. NO agregues métricas nuevas salvo que sean gratis (una fila).
5. Extensión de cuenta (`frutiferia-account-extension`, sólo lectura): confirma que
   `BenefitsPanel.jsx` enlaza a tienda + cotizador + menú; si falta Bienestar, agrégalo apuntando
   a /pages/bienestar (D-8) y deploya con `shopify app deploy` SÓLO si la CLI ya está autenticada;
   si no, déjalo como gate.

Verificación: curls con códigos esperados (tabla en el registro); `shopify theme check` 0 + `theme
dev` + curl 200 de las 3 landings; tsc/build del OS si tocaste código. Cierre: commits por repo +
push (tema = deploy; OS = push a main o a la rama que corresponda si el clon estaba en feature —
dilo explícito) + §3/§6/§8 + Tion + "Lo que tienes que hacer tú".
```

### PROMPT WUX-7 — QA integral en producción (Sonnet)

```
Sesión WUX-7 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md — QA integral en
producción. READ-ONLY: no edites ningún repo, no pushees nada. WUX-1..6 están ✅ en §3.
Activa: edu-sprints. Lee §2 (decisiones vigentes), §3, §6 y sobre todo §7.G y §7.H (trampas).

⚠️ DOS TRAMPAS QUE INVALIDAN EL QA SI NO LAS RESPETAS — léelas antes de medir nada:

  1. `curl` PELADO A frutiferia.com/ TE MIENTE. Shopify cachea SOLO la home y sirve una
     variante VIEJA según el User-Agent: con el UA por defecto de curl salió HTML pre-WUX-2
     el 100% de las veces; con UA de Chrome, el nuevo el 100%. Las demás rutas no tienen ese
     problema. ⇒ SIEMPRE manda UA de navegador:
       curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
     Mejor aún: mide en el Browser pane con getComputedStyle / document.fonts, no por HTML.
     NUNCA concluyas "el deploy no llegó" desde un curl pelado.
  2. EL GREP DE BSD SE CALLA. Varios de estos HTML/CSS los trata como binarios y `grep -o`
     devuelve VACÍO sin avisar (pasó con el CSS de menu.frutiferia.com). Para contar o buscar
     en HTML/CSS/JSON usa python3 con encoding utf-8, no grep.

QUÉ CAMBIÓ DESPUÉS DE QUE SE ESCRIBIÓ ESTE PLAN (verifica contra esto, no contra el texto viejo):
  · D-1 REVOCADA. Las 5 superficies van en Inter Tight (títulos) + Inter (texto), tracking
    -0.018em, ambas self-hosted y variables. Georgia quedó SOLO para correos y PDF.
  · D-10: botón primario #17845A en reposo, hover #136E4B (NO #248F57: ese aclaraba y caía a
    4,08:1). En la banda morada (color-scheme--2) el botón es BLANCO por diseño.
  · Dirección: 6 1/2 Oriente 212, Viña del Mar. geo -33.021603, -71.542363.

1. RUTAS (con UA de navegador, reporta código y tiempo): https://frutiferia.com/ , /collections,
   /collections/frutas-deliciosas, /products/platanos, /cart, /pages/frutimenu,
   /pages/proveedor-restaurantes, /pages/bienestar, /blogs/recetas, /pages/conocenos,
   /pages/conversemos, https://cotiza.frutiferia.com, https://cotiza.frutiferia.com/bienestar,
   https://menu.frutiferia.com, https://wellness.frutiferia.com (puede dar 000: G-5 abierto, sólo
   repórtalo). Ojo: cotiza.frutiferia.com da 403 a curl (protección de Vercel) — mídelo por navegador.

2. TIPOGRAFÍA — la meta es que las 5 se vean iguales. En el Browser pane, por superficie:
   document.fonts cargadas + getComputedStyle de un h1/h2 y del body.
   PASA si: títulos "Inter Tight", cuerpo "Inter", letter-spacing ≈ -0.018em, y NINGUNA
   superficie carga Georgia ni Montserrat ni Figtree. En la tienda deben bajar EXACTAMENTE 2
   archivos de fuente (inter-variable + inter-tight-variable): si aparece un tercero, es una
   regresión (se quitaron los preloads muertos que bajaban 58 KB sin usarse).
   Excepción legítima, NO la reportes como falla: los correos del menú semanal y su exportación
   a PDF siguen en Georgia a propósito.

3. LOGO — es lo que más ojo necesita. En las 4 superficies públicas: el isotipo tiene que tener
   sus DOS BRILLOS visibles (son huecos, no manchas). Chequeo duro: el path del isotipo mide
   3.029 caracteres (cuerpo 1.722 + brillos 1.307) y el wordmark 7.386, y van en UN SOLO <path>.
   Si ves dos paths de 1.722 y 1.307 separados, la manzana está PLANA (bug de WUX-2, ya corregido
   en el tema: verifica que no reapareció). Compara los 4 archivos entre sí: deben ser idénticos.

4. MEDIDAS (Browser pane, prod, 375×812 y 1440×900, getBoundingClientRect): alto del header,
   `top` del primer tile de categoría y del primer .card--product en home y en
   /collections/frutas-deliciosas; ¿existe body.cart-drawer-docked? Compara con las metas de §3
   (móvil: tile ≤750, producto ≤1.600 · escritorio: tile ≤850, producto en colección ≤620,
   header ≤120). Reporta el delta, no sólo pasa/falla.

5. CONTRASTE AA calculado (no estimado), con la fórmula WCAG:
   · botón primario en reposo (#17845A sobre blanco, esperado 4,68) y en hover (#136E4B, 6,25)
   · el botón DENTRO de la banda morada: blanco sobre #671D90 (esperado 9,74) — y el borde del
     botón contra la banda, mínimo 3:1 (WCAG 1.4.11)
   · anillo de foco: en fondo claro debe ser morado; dentro de la banda morada debe ser BLANCO
     (si sale morado sobre morado = 1:1, es falla grave de accesibilidad)
   · pills de canal (--pill-*-ink sobre su fondo) y enlaces del footer
   ⚠️ getComputedStyle(btn).backgroundColor NO sirve para el botón: Canopy lo pinta con un
   degradado que se desliza y esa propiedad devuelve el color de HOVER. Lee --btn-bg-color.

6. TARJETAS: en /collections las tarjetas de colección deben seguir siendo CÍRCULOS (border-radius
   50%); si salen cuadradas es regresión. En la grilla de producto: sin proveedor y sin línea de
   peso, y el quick-add en #17845A.

7. TEXTOS — tuteo. Con python3 (no grep), sobre el HTML servido de home, colección, ficha, carrito
   y las 3 landings: busca usted, Su carrito, Inténtelo, Añadir, Recogida, Cesta, Provincia,
   y formas verbales de 3ª persona (Seleccione, Corrija, Introduzca, Tenga, Cree, Ha olvidado).
   Esperado: CERO. Además: 3 pasadas distintas por voseo argentino (vos, tenés, podés, querés).

8. DIRECCIÓN Y FICHA DE NEGOCIO: que "Maravillar" no aparezca en NINGUNA superficie, que la
   dirección diga 6 1/2 Oriente 212 en footer, Conócenos y Contacto, y que el JSON-LD de
   LocalBusiness de la home traiga streetAddress correcto y geo -33.021603 / -71.542363.

9. FOOTER: 5 columnas (Frutiferia con contacto · Comprar · Frutiferia para… · Ayuda · Newsletter),
   los 4 links de superficies vivos (uno de ellos externo al cotizador), los 2 WhatsApp correctos
   (Mora +56 9 6609 3891 hogares · Francisco +56 9 9326 1147 negocios), y la banda de confianza
   OCULTA en /pages/proveedor-restaurantes y visible en el resto.

10. CROSS-LINKS: matriz de qué superficie enlaza a cuál. Meta: cada satélite enlaza a la tienda y
    la tienda a los 3.

11. PSI móvil de la home (API de PageSpeed; si da 429 dilo y usa Lighthouse del Browser).
    Reporta LCP/CLS y si alguna fuente bloquea el render.

12. CONSOLA: read_console_messages con errores en home, colección, ficha y carrito.

ENTREGA: tabla PASA/FALLA por ítem con el valor MEDIDO (no "ok"), lista de fixes priorizada,
cada uno con carril (A/B/C) y archivo probable. Distingue REGRESIÓN (algo que funcionaba y se
rompió) de PENDIENTE conocido (G-5 DNS wellness). Actualiza §3/§6 del plan con una línea y cierra
con "Lo que tienes que hacer tú" en fácil, sin jerga: qué mirar en el iPhone en 5 minutos.
```

---

## 5. Pasos de Eduardo (gates humanos) — ordenados por impacto

| # | Paso | Tiempo | Por qué importa | Cuándo |
|---|---|---|---|---|
| ~~G-1~~ | ~~Des-dockear el carrito en el editor~~ **✅ HECHO por Claude el 2026-08-17** (commit `77dc0e7`, verificado en vivo). No requiere nada de Eduardo. | — | Devolvió el 25 % del ancho en escritorio. | ✅ |
| G-2 | Leer §2 y vetar lo que no te guste (D-1 tipografía, D-4 Por Mayor, D-7 logo sin .com, D-9 Comprar ahora). | 5 min | Sin veto, se ejecuta el default. | Antes de abrir WUX-1/3/5. |
| ~~G-3~~ | ~~Menú de navegación...~~ **✅ HECHO por Claude el 2026-08-17** (por el navegador de Eduardo, Chrome MCP): `menu-frutiferia` reconstruido a 5 (Comprar/Arma tu menú/Negocios/Oficinas/Recetas) y `footer-ayuda` con Conócenos + Vida saludable. Verificado en vivo por curl. No requirió nada de Eduardo. | — | — | ✅ |
| ~~G-4~~ | ~~Publish en Lovable (menú semanal)~~ **✅ HECHO por Eduardo el 2026-08-18.** Verificado en vivo: `menu.frutiferia.com` sirve `InterTight.woff2` y su CSS trae 0 Georgia. | — | — | ✅ |
| G-5 | DNS `wellness.frutiferia.com` (GoDaddy: CNAME `wellness` → `cname.vercel-dns.com`) + agregar el dominio al proyecto `frutiferia-wellness` en Vercel (G-31 del plan wellness). | 5 min | Bienestar deja de vivir "prestado" en el cotizador. No bloquea nada. | Cuando puedas. |
| G-6 | QA en iPhone real después de cada carril: abrir frutiferia.com, contar scrolls hasta ver productos, tocar "Agregar" en una tarjeta, abrir el carrito, entrar a Comprar → Frutas. Mandar 1 mensaje con lo que se vea raro. | 5 min ×3 | Lo que no se ve en el preview oculto de Claude. | Tras WUX-2, WUX-4, WUX-5. |
| ~~G-7~~ | ~~(Opcional) Editor → Tipografía + Tarjetas de producto~~ **✅ CERRADO 2026-08-17 por Claude, sin gate humano** (commit `2fa6c74`). Proveedor y peso ocultos por `settings_data.json`. La parte de tipografía **no se podía hacer**: Georgia no existe en la librería de fuentes de Shopify (`georgia_n4`/`georgia_n7` tumban el upload) y poner Inter duplicaba la fuente (77 KB de más). En cambio se quitaron los preloads de las fuentes del editor, que se descargaban sin usarse. | — | — | ✅ |
| ~~G-8~~ | ~~(Opcional) Si algún tile de categoría luce mal, cambiar la imagen de esa colección en el admin.~~ **✅ CERRADO 2026-08-17 por Claude, sin gate humano** (la página de Colecciones del admin SÍ es automatizable, igual que Navegación): `Ofertas de la Semana` → `72418.jpg` (mezcla de fruta) y `Packs`/`frutipack` → `364.jpg` (mezcla densa fruta+verdura). Las 6 quedaron parejas. | — | — | Hecho. |
| ~~G-9~~ | ~~Decidir la tipografía de los 3 satélites~~ **✅ RESUELTO 2026-08-17: Eduardo dijo *"sí, que todo se vea igual, moderno"*.** Los 3 pasaron a Inter Tight (commits `794dde1` cotizador, `d1cee38` wellness, `69df8b1` menú). Cotizador y Bienestar verificados EN VIVO. | — | — | ✅ |
| G-8b | **Fotografiar una canasta FrutiPack de verdad** (una armada, sobre mesa, luz natural) y subirla como imagen de la colección `frutipack`. | 15 min | Los 9 productos de FrutiPack **no tienen foto**: son banners gráficos con el nombre y el precio ("CANASTA GRANDIOSA $23.990"). Hoy el tile usa una mezcla de fruta y verdura — honesta, pero genérica. Una foto de la canasta real vende el producto, no la categoría. | Cuando armes una. |

---

## 6. Registro

| Fecha | Sesión | Qué quedó | Commits |
|---|---|---|---|
| 2026-08-16 | Fable 5 (plan) | Auditoría en vivo (medidas de scroll/header/dock), inventario del tema (Canopy 7.2.2), matriz de consistencia de las 5 superficies, brief de referentes, plan WUX-1..7 con prompts. Sin código. | `e7ca051` |
| 2026-08-17 | Fable 5 | **G-1 cerrado sin gate humano:** `dock_cart_drawer` → `false`. Descubrimiento que cambia el plan: **`config/settings_data.json` SÍ se despliega por git push** (§7.D) — el gate manual del editor no era necesario. Verificado en vivo: `main` 1.080→1.440 px, colección 4→5 columnas, drawer flotante con overlay + scroll-lock OK, 0 desborde horizontal, 9 rutas en 200. | `77dc0e7` |
| 2026-08-17 | Opus 5 (**WUX-1**) | Sección nueva `fru-category-tiles` (6 tiles con foto, contador y salida al catálogo), ajuste `layout: strip` en `audience-doors` (3 pastillas en 1 fila, 70/82 px) y checkbox `compact` en `fru-hero` (384 px escritorio / foto móvil 170 px). Home reordenada (D-6); `collection-list` queda `disabled` justo detrás de los tiles (rollback de 2 toggles). Medido con getBoundingClientRect — **escritorio 1440×900: primer tile 849 px (meta ≤850 ✓), primer producto 1.496 px · móvil 375×812: primer tile 929 px, primer producto 1.661 px**. `theme check` sin offenses nuevas (48/33/10 errores, idénticas a la base: los 10 son `LiquidHTMLSyntaxError` de archivos Canopy de stock). Verificado en vivo en frutiferia.com. **3 hallazgos**: (a) `section.id` dentro de una plantilla NO es la llave del JSON sino `template--<n>__<key>` con un número que Shopify regenera → cualquier ancla a `#<key>` nace muerta; se resolvió con un ajuste `anchor_id` propio (`#tiles`). (b) Fijar el `min-height` del grid del hero no lo encoge: con `height:auto` manda la FOTO, que se dibuja a su proporción natural (400 px). (c) El texto sobre la foto con degradado morado pasaba AA pero teñía la comida — se movió a placa blanca (ver §7.E). | `28f8b42`, `06123df`, `1dc1ad9` |
| 2026-08-17 | Opus 5 (WUX-1, cierre) | **G-8 cerrado por navegador, sin gate humano.** Cambiadas por el admin las 2 fotos de colección que desentonaban: `ofertas` → `72418.jpg`, `frutipack` → `364.jpg`. Gate nuevo G-8b: no existe ninguna foto real de una canasta FrutiPack (sus 9 productos son banners de precio, no fotos). ⚠️ Trampa nueva: al reemplazar la imagen de una colección, **Shopify conserva el nombre de archivo viejo en el CDN** y solo sube el `?v=` — `frutipack` sigue sirviendo `FrutiPackWeb.jpg` aunque el contenido ya es `364.jpg`. Verificar por `?v=` o por píxeles, nunca por nombre de archivo. | (sin código) |
| 2026-08-17 | Sonnet 5 (**WUX-3**) | Colección: banner sin foto ni descripción larga (la descripción se movió a un `<details>` "Sobre esta categoría" al final del template, vía sección `custom-liquid` — SEO intacto, colapsada por defecto), fuera el bloque `image_promotion_kqxbRA` de la posición 1, `products_per_page` 36, `card_size` medium en escritorio, filtros como drawer (`filters_open_lg` false), FrutiMenu CTA bajo la grilla. Tarjeta: vendor oculto cuando `product.vendor == shop.name`, línea de peso eliminada, quick-add sólido D-10 (`#17845A`/hover `#248F57`, 40 px, texto "Agregar" vía `locales/es.json`), precio `tabular-nums`. Ficha: `enable_dynamic_checkout` false (D-9, un solo botón), `msg_envio` a tokens de marca, bloque nuevo "¿Compras para un negocio? Cotiza por mayor" bajo `buy-buttons` (como sección `custom-liquid`, no `richtext` — el richtext de Shopify sanitiza y rechaza el atributo `style` que pedía el spec). Overlays: `cart-drawer` con link a "Ver carrito", `pop-up-welcome` a `trigger: exit` (D-5). `/collections` (`list-collections.json`) como landing "Toda la tienda", `card_size` large — es el destino del ítem "Comprar" del menú (WUX-2). **Medido con getBoundingClientRect en `/collections/frutas-deliciosas`: primer producto 1.076 px → escritorio 1440×900 = 446 px (meta ≤620 ✓), móvil 375×812 = 396 px (meta ≤700 ✓).** `theme check` sin offenses nuevas (48/33/10, idénticas a la base). Verificado en vivo en frutiferia.com: `Agregar` sube `item_count` del carrito, ficha sin botón de dynamic checkout y con el link "Cotiza por mayor", drawer sirve "Ver carrito", popup con `data-trigger="exit"`. **1 hallazgo:** el bloque `richtext` de Shopify (a diferencia de `custom-liquid`) sanitiza el HTML y descarta atributos como `style` — cualquier prompt futuro que pida texto con color/tamaño inline en una ficha debe usar `custom-liquid`, no `richtext`. **1 nota para WUX-4:** el quick-add usa `#17845A` literal en `assets/quick-add.css` (comentario `TODO token`) porque `--fru-verde-800` todavía no existe en `tokens-frutiferia.css`. **1 observación sin resolver (no bloquea):** en la ficha, el bloque nuevo "Cotiza por mayor" queda justo debajo de un mensaje ya existente ("¿Compras para un negocio? Cotiza online o escríbele a Francisco", del delivery-picker) — mensaje casi duplicado; no estaba en el alcance de esta sesión tocarlo. | `e118d0a`, `8b4d6f9`, `0b37667` |
| 2026-08-17 | Sonnet 5 (**WUX-2**) | Logo 2026: un solo SVG (`assets/frutiferia-logo.svg`, isotipo + wordmark, morado #671D90) vectorizado a mano desde los paths de `FrutiferiaMark`/`FrutiferiaWordmark` del OS (no existía aún `public/brand/frutiferia-logo.svg` en el cotizador para copiar byte a byte). Checkbox `use_svg_logo` (default on) con `inline_asset_content` y fallback a `<img>`. Header de una fila (D-2): `header__grid` a `flex-wrap:nowrap` + reorden logo·menú·buscador·cuenta/carrito. **Hallazgo:** `minimise_search_desktop` de Canopy solo colapsa la búsqueda a ícono cuando el logo está **centrado** (`logo_position: top-center`) — con logo a la izquierda no tiene CSS propio y la barra de búsqueda completa (494 px) se queda en la fila y aplasta el menú a 261 px, cortando 3 de los 5 ítems. Se resolvió ocultando `.header__search--collapsible-desktop` en CSS propio; el ícono de búsqueda de `.header__icons` (ya enlaza a `routes.search_url`) queda como entrada. Se borró `promo_strip_QLcH46` y la barra de despacho suma el cupón en 1 línea (D-5): `"Despacho gratis sobre {threshold} · 15% con PRIMERA15"`. Menú de 5 reconstruido por el navegador de Eduardo (Chrome MCP) en `menu-frutiferia`: se reaprovecharon los links existentes (`Vitrinea`→`Comprar`, `Por Mayor`→`Negocios` con sus 3 hijos reescritos, `Blog`→`Recetas`, `Bienestar`→`Oficinas`) en vez de recrearlos, y se anidó "Cotizar online" bajo "Negocios" con la reordenación por teclado del editor de menús (`Space` levanta el ítem, flechas lo mueven, `Space` lo suelta). `Conócenos` y `Vida saludable` migraron a `footer-ayuda`. Mega menú: bloques `columns` de Canopy (0 usados hasta ahora) para "Comprar" (11 colecciones con imagen `standard` + promos "Ofertas de la semana" con la foto real de la colección `ofertas` y "Arma tu menú") y "Negocios" (3 links + promo "Cotiza online" → cotiza.frutiferia.com), sin badges, un solo nivel. **Medido con getBoundingClientRect: escritorio 1440×900 header 191→73 px (meta ≤120 ✓), primer tile 849→567 px, primer producto 1.496→1.304 px · móvil 375×812 header 115→107 px (meta ≤110 ✓), primer tile 929→681 px (meta ≤750 ✓), primer producto 1.661→1.473 px (meta ≤1.600 ✓, calza con la proyección de §7.E).** `theme check` sin offenses nuevas (48/33/10, idénticas a la base; se corrigió en el camino un `ImgWidthAndHeight` propio agregando `width` al `<img>` de fallback). Verificado en vivo: menú de 5 confirmado por curl a frutiferia.com al instante (contenido de admin); el HTML del tema confirmado 3 veces independientes — `shopify theme pull` directo del tema en vivo (#154491715749, idéntico a los commits salvo que el default `use_svg_logo: true` del schema no necesita estar explícito), el preview local (`theme dev`) y `?preview_theme_id=154491715749` en producción — pero la página pública `frutiferia.com` sin parámetros quedó sirviendo una versión en caché de Shopify (no de Cloudflare, que marca `DYNAMIC`) varios minutos después del push; no bloquea el cierre, se aclara sola. **2 sesiones concurrentes en el mismo working dir** durante este sprint (WUX-3 iterando `templates/product.json` en vivo): un `theme dev` local falló una vez con "Failed to Upload Theme Files" por un `style=` inválido en un bloque `custom-liquid` ajeno, se resolvió solo en segundos; no se tocó nada fuera de los archivos propios de esta sesión. | `e731f18`, `7ad3a0c`, `7b2b967` |

| 2026-08-17 | Opus 5 (**WUX-4**) | **Capa de marca del tema.** `assets/fru-brand.css.liquid` cargado justo después de `main.css`; Inter **variable** self-hosted (un woff2 de 47 KB, eje wght 100–900, el mismo archivo del cotizador por sha256) + preload; D-1 aplicado pisando las **tres** custom properties de Canopy (`--heading-font-family` → Georgia, `--body-font-family` y `--navigation-font-family` → Inter), con navegación y `.card__title` en Inter a propósito; D-10 con `--fru-verde-800` (#17845A) y radio pastilla; footer de 5 columnas con "Frutiferia para…" (Hogares · cotizador · Menú semanal · Oficinas) y contacto por público (Mora / Francisco); `locales/es.json` con **61** strings a tuteo. `theme check` **48/33/10 = base exacta, 0 offenses nuevas**. Verificado en el tema vivo por `shopify theme pull` (`fru-brand.css.liquid` byte a byte idéntico al commit, `es.json` idéntico en contenido) y en 4 rutas de producción. **6 hallazgos, 5 de ellos correcciones a la propia spec:** (a) el hover `#248F57` que pedía D-10 **ACLARA** el botón y cae a **4,08:1** — reprueba AA justo al pasar el mouse; se oscurece a `--fru-verde-900` #136E4B (6,25:1) y ahora el contraste mejora en hover. (b) `.btn--primary` **no usa `background-color`**: es un degradado de 300 % que se desliza con `background-position`; por eso se pisan las variables y no `background`, y por eso **`getComputedStyle(btn).backgroundColor` devuelve el color de HOVER**, no el de reposo — cualquier QA que verifique el botón por ahí se engaña. (c) `hide_on_b2b` **no existe** en el tema: el guard real está en `sections/icons-with-text.liquid:11-18` y va por `page.template_suffix == 'b2b'` (intacto, verificado: 0 apariciones de la banda en `/pages/proveedor-restaurantes`). (d) el richtext de Shopify **rechaza el upload entero** ante cualquier atributo que no sea `href` — un `class=` en un `<p>` tumba el archivo con "No se permite el atributo"; amplía el hallazgo de WUX-3, que era sólo sobre `style=`. (e) `footer.liquid` tenía **`max_blocks: 4`** y el footer ya usaba 4: la 5ª columna no se habría visto y Shopify no avisa (subido a 6). (f) el `@font-face` con ruta relativa resolvía una URL **sin el `?v=`** del CDN, distinta a la del preload, y la fuente se descargaba **dos veces** (medido 2 × 48 KB); por eso el archivo es `.css.liquid` y el `src` sale del mismo `asset_url` — ahora 1 sola descarga (`transferSize: 0` en la segunda). **3 regresiones detectadas y corregidas antes de commitear**, todas por especificidad/proximidad: las 12 tarjetas circulares de `/collections` se volvían cuadradas (`coll_card_image_ratio` está en `circle`) → `:not(.card__media--circle)`; en la banda morada (`color-scheme--2`, viva en la home y en la landing B2B) el botón blanco de diseño pasaba a verde a **2,08:1** y el foco/enlaces morados quedaban a **1:1, invisibles** → excepción de esquema y variables `--fru-focus`/`--fru-link`; y fijar `--btn-border-radius` a pastilla habría metido un `margin-inline-end` de **−10.003 px** en el buscador y el newsletter (Canopy lo suma en un `calc()` de solape) → el radio se pinta directo y se devuelve el compuesto a los botones pegados a un input. **1 nota (corregida después, ver la fila siguiente):** el navegador reportaba **Figtree** como fuente de cuerpo mientras `settings_data.json` decía `avenir_next_n5`. En su momento se anotó como "el repo va atrasado respecto del editor". **Es falso:** repo y tema vivo son idénticos (0 claves distintas, verificado con `theme pull`); lo que pasa es que **Shopify resuelve el handle `avenir_next_n5` a `figtree_n5`** — sustituyó Avenir Next por Figtree en su librería. | `1ecf743`, `5d36550`, `2b5f1b6` |
| 2026-08-17 | Sonnet 5 (**WUX-5**) | **Los 3 satélites alineados a D-7/D-10/D-11.** Logo: exportado UNA vez desde `frutiferia-so/src/components/brand/{FrutiferiaMark,FrutiferiaWordmark}.tsx` (paths extraídos por script, no a mano) a `frutiferia-logo.svg`/`-blanco.svg` (isotipo · regla · wordmark, #671D90), copiado byte a byte a los 3 `public/brand/` (checksums idénticos verificados) y cableado en Header/Verificar.tsx (cotizador), Header.tsx (wellness) y Logo.tsx (menú); PNGs viejos borrados donde quedaron huérfanos. Tokens D-10/D-11 en cotizador y wellness: `rosa` 900/700/500/050 → `#9A196A`/`#A92177`/`#B82883`/`#F8E7F1` (antes `#D6457D` muerto), `b2b` → `#2525C1` (antes `#7C3AED`), `cta` wellness → `#17845A` (antes menta plana `#2DB87F`, 2,5:1), `verde-800` agregado. Menú (`styles.css`, Tailwind v4/oklch): `--chart-1..4` a los 4 colores de canal del OS, `--radius` 12→16 px, nuevo token `--cta`/`bg-cta` #17845A aplicado a los 9 CTAs "chicos" (wizard ×3, resultado, error/404 ×2, ShoppingList, LeadForm, BundleCard) — el gradiente `--grad-cta` se queda SOLO en el hero de `routes/index.tsx`. Chrome común: footer con la MISMA línea de cross-links (Tienda · Cotizador B2B · Menú semanal · Bienestar → `cotiza.frutiferia.com/bienestar` mientras no haya DNS (D-8) · WhatsApp Mora/Francisco) en los 3; wellness suma `Header.tsx` con link "Tienda" y una barra inferior sticky móvil "Cotiza tu programa" (safe-area) vivendo en `Footer.tsx` (wellness no tiene layout compartido: las 5 páginas montan `<Header/>`/`<Footer/>` sueltas). **Verificado por repo:** `tsc --noEmit` limpio × 3, tests **113/113** (cotizador, meta ≥106 ✓) / **30/30** (wellness) / **30/30** (menú, motor propio) — los 3 en verde, build OK × 3, grep sin `#D6457D`/`#7C3AED`/`#2DB87F` como fondo de botón en ninguno, preview local 375/1440 con logo y colores nuevos confirmados a ojo. Cotizador: deploy de Vercel verificado por curl al bundle de prod (`cotiza.frutiferia.com`, mismo hash de CSS que el build local, byte a byte idéntico) — `184 40 131`/`154 25 106` (rgb de `#B82883`/`#9A196A`) presentes, `#D6457D` ausente. Wellness: push confirmado, deploy de Vercel no verificable por curl porque `wellness.frutiferia.com` no resuelve (D-8, gate G-31 de Eduardo) y no hay URL `.vercel.app` conocida para probar sin el dashboard. **1 gate silencioso resuelto sin preguntar** (bajo riesgo, reversible): D-11 no define `rosa-700` (solo ink 900 y main 500) — se interpoló el punto medio matemático entre ambos (`#A92177`) para conservar el patrón hover/active de los 3 botones que ya usaban ese stop, en vez de inventar un valor a ciegas o colapsarlo con 900. `git status` limpio al empezar salvo un commit ya subido por otra sesión en cotizador (`5d6f388`, RUT/Razón Social) — no se tocó ninguno de sus archivos. | `a57593c` (cotizador), `d5b8a90` (wellness), `d654065` (menú) |
| 2026-08-17 | Sonnet 5 (**WUX-6**) | **Puentes con el OS verificados y línea base cargada (§8).** Smoke de los 6 puentes web→OS: **los 6 vivos y sanos**, ninguno necesitó fix/redeploy — `b2b-lead-intake` y `b2c-welcome-intake` responden `422 invalid_input`/`invalid_email` en vez del `400` que anotaba el plan (validación correcta, solo difiere el código HTTP, no bloquea), `cotizador-api` catalog devuelve 354 productos (vs "362±" del plan, dentro de la variación normal del catálogo), `delivery-availability` con 4 fechas, `fruti-identity` exacto `{"authenticated":false}`, `menu-subscriber-intake` 401 fail-closed sin secret. Línea base: `get_web3_funnel_metrics(30)` corrida en prod vía `npx supabase db query --linked` y Shopify Analytics 30 días leído del admin de Eduardo (Chrome) — ambos en §8. `Web3FunnelCard`: confirmado que la RPC responde bien (no estaba caída); el componente ya tiene degradación graceful documentada (`FRUTI3-21`: si el RPC falla, `data` queda `undefined` y la card renderiza `null` sin crashear ni mostrar error — mismo patrón que `B2CFunnelSection`) — no hizo falta tocar código. Landings (D-4, D-8): `page.b2b.json` — `productos_b2b` ahora etiquetado "Catálogo mayorista de referencia — los precios finales van en tu cotización" (antes "Productos disponibles por mayor", sin el disclaimer); `contacto_b2b` ya tenía `crm_source`/`crm_endpoint` correctos, sin cambios. `page.bienestar.json` — el CTA primario del hero apuntaba a WhatsApp en vez del portal: cambiado a "Cotiza tu programa" → `cotiza.frutiferia.com/bienestar` (igual que el secundario "Ya tengo programa, entrar", D-8); `contacto_wellness` ya tenía `crm_endpoint`/`crm_source='web-wellness'` correctos. `page.frutimenu.json` — ya cumplía (`embed_url` y `height_mobile: 720` correctos), sin cambios. **3 links exactos a `cotiza.frutiferia.com/bienestar`** localizados por grep en los 4 repos (detalle en §8) para cambiar cuando cierre G-31. Extensión de cuenta (`frutiferia-account-extension`, sólo lectura confirmó que faltaba): `BenefitsPanel.jsx` no tenía ningún CTA a Bienestar en el panel wellness — agregado botón "Conoce el programa" → `/pages/bienestar`; CLI ya autenticada (`shopify app info` corrió sin login interactivo) → **deployado con `shopify app deploy --allow-updates`**, versión `frutiferia-account-extension-5` liberada a usuarios. `theme check` **46/33/10, 0 offenses nuevas** (idéntico a la base post-WUX-4). **1 hallazgo:** sesión concurrente detectada en `frutiferia-theme` al abrir (otra sesión editando `snippets/structured-data-header.liquid`, coordenadas `geo` del schema — el "pendiente" que WUX-4 había dejado abierto); no se tocó ese archivo, y esa sesión commiteó y pusheó su propio fix (`c001b2e`) durante esta sesión sin conflicto porque los archivos no se solapaban. También se encontró y se incluye en el commit de este archivo una edición previa sin commitear de la sesión de cierre de WUX-5 (fila §3 y registro de WUX-5) que llevaba ~7h en el working tree — contenido verificado como correcto y coherente con el estado real de los 3 satélites, se dejó pasar junto con los cambios de esta sesión. | `b530d08` (tema), `ff85e02` (account-extension) |
| 2026-08-17 | Opus 5 (**WUX-4**, cierre) | **G-7 cerrado y dirección unificada.** (1) Tarjetas de producto: `card_show_vendor` y `card_show_weight` a `false` por `settings_data.json` (diff de 2 líneas dentro de `current`, presets intactos) — la mitad del gate que sí se podía hacer. (2) **Georgia NO existe en la librería de fuentes de Shopify**: `georgia_n7` y `georgia_n4` devuelven `'…' is not a valid font handle` y **tumban el upload entero**. El gate G-7 daba por supuesto que estaba; no está. Inter sí existe (`inter_n4/n5/n6` válidos) pero ponerla en el editor es **contraproducente**: Shopify sirve su propia Inter con el mismo nombre de familia que la self-hosted y el navegador baja las dos — medido, `inter_n5` (38 KB) + `inter_n6` (38 KB) **encima** de `inter-variable` (47 KB). Se dejaron los 3 handles como estaban. (3) **Hallazgo que sí valió**: como `fru-brand.css` pisa las tres familias, las fuentes del editor no las usa ni un carácter — pero los dos `<link rel="preload">` de `theme.liquid` **forzaban igual la descarga**. El navegador se bajaba `montserrat_n7` (19 KB) y `figtree_n5` (39 KB) para no pintarlos nunca. Preloads eliminados ⇒ la tienda carga **UNA sola fuente** (verificado: `document.fonts` sólo trae `Inter 100 900`) y `theme check` baja a **46/33/10, dos advertencias MENOS que la base**. (4) **Dirección unificada**: la tienda decía dos direcciones distintas — 4 sitios con "Maravillar 2017" (incluido el `streetAddress` de LocalBusiness que lee Google) y el footer con "6 1/2 oriente" sin número. Eduardo confirmó **6 1/2 Oriente 212, Viña del Mar** (que es lo que ya decía la ficha de la tienda en Shopify). Corregidos los 5 lugares. ⚠️ **Pendiente**: las coordenadas `geo` del schema (`-33.0245, -71.5518`) apuntan a la dirección vieja y **no se tocaron** — hay que verificarlas en Maps. | `f8d3f91`, `2fa6c74` |

| 2026-08-17 | Opus 5 (**WUX-4/5b**, cierre por feedback de Eduardo) | **Las 5 superficies quedan con la misma cara.** Dos correcciones que salieron de que Eduardo abriera la home en su iPhone. **(1) El logo estaba plano.** Los 3 paths ya eran byte a byte los oficiales del OS, pero WUX-2 los armó como dos `<path>` hermanos dentro de un `<g fill-rule="evenodd">`. `evenodd` perfora entre subpaths del MISMO path, no entre paths hermanos: los dos brillos se pintaban morado sólido sobre cuerpo morado y desaparecían. Ahora va en un solo path, idéntico a los 3 satélites (verificado: isotipo 3.029 chars, wordmark 7.386, byte a byte contra `public/brand/` del cotizador). ⚠️ **Trampa nueva y muda**: un comentario XML dentro del `.svg` hace que `inline_asset_content` devuelva VACÍO y el logo desaparezca entero del header — sin error, sin fallback al `<img>`, sin nada en `theme check` ni en los logs. Probado A/B (§7.H). **(2) D-1 revocada**: la web pasa de Georgia a **Inter Tight**, el canon del OS, con su mismo tracking (`-0.018em`). Se pisa `--font-display` y no sólo `--heading-font-family`, porque las secciones propias leen ese token directo. Inter Tight self-hosted y variable (44 KB) en las 4 superficies. **Los 3 satélites también** (WUX-5b): Georgia desaparece del CSS compilado en los tres builds (0 ocurrencias). NO se tocaron los dos lugares donde Georgia sí corresponde: las plantillas de correo del menú (en un correo no se carga fuente propia) y su exportación a PDF. `theme check` 46/33/10, sin offenses nuevas. **Estado en vivo**: tienda ✓, cotizador ✓, Bienestar ✓; el menú semanal quedó publicado por Eduardo el 2026-08-18 (G-4 ✅, verificado en vivo) y wellness.frutiferia.com sigue sin DNS (G-5, se ve en otra sesión). | `0980219`, `b681b2c`, `154eaa9` + `794dde1`/`d1cee38`/`69df8b1` en los satélites |
| 2026-08-19 | Fable 5 (feedback de Eduardo) | **El logo no era el oficial** — y la causa era la premisa de §7.H: el wordmark del OS es un derivado, no el logo de marca. Se reemplazó por el arte del Drive vectorizado 1:1 (IoU 99,52 % supermuestreado), morado oficial `#A531EB`, sin la barra divisoria inventada, con `.com`. **Las 4 superficies quedan byte a byte iguales** (`shasum` verificado). Vivo y verificado en frutiferia.com (15 s) y cotiza.frutiferia.com. D-7 revocada, §7.I nueva. | tema `59552aa` · cotizador `7c11dff` · wellness `8f0bf7e` · menú `6a04ed9` |
---

## 7. Diagnóstico y referentes (para las sesiones)

### 7.A Cómo está armada la home hoy (`templates/index.json`, keys exactas)
`fru_hero` (600 px) → `audience_doors` (548 px; bloques `door_hogares`/`door_negocios`/`door_bienestar`)
→ `business_logos` [disabled] → `frutimenu_promo` (674 px, `media-with-text`) → `3721924b-…` (icons)
→ `featured-collection` (Ofertas, 12, carousel) → `collection-list` ("¿Qué buscas?", 6 círculos)
→ `b2b_band` → `testimonials_JERNA6` → `media_with_text_VAd4Hi` → `featured_blog_recetas` →
`newsletter_WXJigB` → `scrolling_banner_ArEtdk` → `video_9nrWpD` [disabled] → `recently_viewed_home`
→ `slideshow` [disabled]. Header-group: `free-shipping-bar` → `header` → `promo_strip_QLcH46`.
Header hoy: `menu: menu-frutiferia`, `enable_sticky: true`, `hide_menu: true`, `logo_position:
top-left`, `logo_width: 230`, `enable_search: true` (no minimizado), CTA "Conversemos" (Mora),
`menu_featured_link: "Sale"` (muerto), **0 bloques de mega menú** (Canopy trae `columns` y
`sidebar` con 3 promos + 3 badges cada uno).
Ajustes editor-owned (NO sincronizan por git; gate Eduardo): `config/settings_data.json` →
`dock_cart_drawer: true`, `heading_font: montserrat_n7`, `body_font: avenir_next_n5`,
`enable_quick_add: true`, `card_show_vendor/weight`, colores.
Colección: `collection-banner` con imagen + descripción larga → primer producto a 1.076 px;
bloque `image_promotion_kqxbRA` en posición 1; `card_size: small`; filtros abiertos en escritorio.
Ficha: sticky ATC on, `enable_dynamic_checkout: true`, `msg_envio` verde fuera de tokens.
Overlays: `cart-drawer` (`show_cart_page_link: false`, promoted products), `pop-up-welcome`
(`trigger: delay` 10 s; existe `exit`).
Colecciones vivas con imagen (29): frutas-deliciosas 50 · verduras-frescas 117 · despensa 43 ·
snacks 43 · proteinas-vegetales… 53 · legumbres 12 · aceitunas 8 · condimentos 14 · frutipack 9 ·
ofertas **102** · 990 24 · mercado-pyme 9 · por-mayor 147 (+7 "-por-mayor") · catalogo-completo 431.

### 7.B Referentes (2026-08-16/17)

**Qué significa "moderna y bonita" hoy en fresco/grocery (dirección para WUX-1/3/4):**
1. **La foto manda, el chrome desaparece.** Header de una fila, mucho blanco, la fruta como color
   (no fondos morados grandes; el morado va en tipografía, líneas y pastillas). Overlay ≤ 45 %
   y direccional (regla del hero actual).
2. **Producto en la primera pantalla.** Tiles de categoría grandes con foto (no círculos chicos)
   y una fila de productos con quick-add antes de cualquier storytelling.
3. **Tipografía grande y editorial** para títulos + sans limpia para todo lo demás; tarjetas sin
   ruido (sin vendor, sin peso, precio con formato claro).
4. **Compra en 1 gesto** desde la grilla: botón sólido "Agregar" o stepper +/- en la tarjeta,
   barra sticky del carrito en móvil, drawer flotante (no dockeado).
5. **Un solo camino por público** y visible arriba: hogar → comprar; negocio → cotizar; oficina →
   programa. Los tres accesibles en el primer pliegue, sin marear al B2C.
6. **Motion sutil**: hover translateY(-2 px)/sombra, reveal 90 ms; nada que retrase el LCP.
7. **Recompra fácil**: "lo de siempre" / "comprar de nuevo" a un clic desde cuenta y correo.

**Patrones observados en sitios reales durante esta sesión (verificados por fetch):**
- Ricardo Valdés (`ricardovaldes.cl`, B2B/B2C V Región): **stepper +/- y "Agregar al carro" en la
  tarjeta**, unidad explícita "(Kg)/(Unidad)" — sencillo y rápido; débil en filtros y jerarquía.
- Santiago Natural (`santiagonatural.cl`, Shopify): 3 columnas, badges Oferta/Agotado, ratings en
  tarjeta, foto colorida sobre neutro; **sin stepper ni "por kg" explícito** (antipatrón a evitar).
- Abel & Cole (`abelandcole.co.uk`): cajas con **precio + porciones + rating en la tarjeta** y un
  solo botón "Add" (aplica a FrutiPack/Bienestar).
- Oddbox (`oddbox.co.uk`): flujo de 3 pasos, tipografía grande, mucho aire, skip/pausa desde la
  cuenta (aplica al menú semanal/recurrencia).
- REKKI (`rekki.com`): pedido B2B "sin formularios de cuenta", chat con el proveedor, precios al
  pedir, "lo que otros chefs piden" (nuestro cotizador ya tiene portada por lo más pedido; falta
  el chat = botón Francisco).
- Jumbo/Uber Eats bloquean el fetch (403/JS-only); Fruna sin certificado válido — no evaluados.

**Antipatrones a evitar (vistos en la propia tienda y en locales):** carrito dockeado que roba
ancho · cupón repetido 5 veces · popup por tiempo sobre el hero · descripción SEO larga ANTES de la
grilla · vendor/peso en la tarjeta · "por mayor" y "cotizador" como dos caminos B2B en el mismo menú.

⚠️ **No queda nada pendiente en esta sección.** El agente que iba a ampliar el brief con
referentes internacionales (Picnic, Crisp, Rohlik, Good Eggs, Jow…) **se cortó sin entregar**;
no lo esperes. Todo lo de arriba viene de sitios que sí se abrieron y verificaron, y fue
suficiente para WUX-1..6. Si alguna sesión futura quiere más referentes, que los investigue
de nuevo en vez de buscar un entregable que no existe.

### 7.C Matriz de consistencia (2026-08-16)

| Superficie | Primario | CTA | Canal B2B / Bienestar | Fuente | Radio | Header | Cross-links |
|---|---|---|---|---|---|---|---|
| OS (norte) | `#681D91` | = primario | `#2525C1` / `#B82883` | Inter Tight + Inter | 6/10 px | riel oscuro | n/a |
| Tienda | `#671D90` | menta `#2DB87F` + `--grad-cta` | pills OK (`#2525C1`/`#B82883`) | **Montserrat/Avenir** (editor) | 16/8 | 2 filas, 191 px | hub |
| Cotizador | `#671D90` | **`#17845A`** | **`#7C3AED`** / **`#D6457D`** (viejos) | Georgia + Inter | 16/8/20 | 1 fila h-16, logo PNG | → tienda |
| Wellness | `#671D90` (sin uso) | **`#2DB87F`** | `#7C3AED` / `#D6457D` | Georgia + Inter | 16/8/20 | sin logo, 2 links | **ninguno** |
| Menú | `#671D90` (oklch) | gradiente | — (charts shadcn) | Georgia + Inter | **12 px** | logo PNG, 0 links | → tienda |
| Ext. cuenta | Polaris | Polaris | tone enum | Shopify | Shopify | n/a | → tienda + cotizador + menú |

Gaps completos y file:line en la sesión de origen (memoria `project_web_ux_2026_08`).

### 7.D 🔑 `config/settings_data.json` SÍ se despliega por git push (verificado 2026-08-17)

La creencia heredada era: *"`settings_data.json` es editor-owned y NO sincroniza por git push;
todo ajuste de tema es gate manual de Eduardo"* (venía de FRUTI3-7, donde un push de colores no
se aplicó). **Es falsa como regla general.** Prueba de esta sesión: se cambió UNA línea
(`current.dock_cart_drawer` true→false), `git push origin main` a las 11:00:29Z, y **en menos de
20 s** el HTML de `https://frutiferia.com` ya no traía la clase `cart-drawer-docked`.

Lo que sí sigue siendo cierto y hay que respetar:
- **El Theme Editor NO es automatizable** (panel de settings en skeleton permanente). Eso no
  cambió; lo que cambia es que **no hace falta el editor**: se edita el JSON y se pushea.
- **El editor escribe de vuelta al repo** (commits "Update from Shopify for theme
  frutiferia-web-2026/main"). ⇒ **`git pull --rebase` SIEMPRE antes de tocar el archivo**, o
  revertirás ajustes que Eduardo hizo a mano.
- Editar **sólo la clave dentro de `current`**. Las mismas claves aparecen en `presets`
  (`Canopy`/`Cedar`/`Willow`): tocarlas no hace nada y ensucia el diff.
- **No reformatear el archivo** (nada de round-trip con `json.dumps`): editar la línea exacta y
  conservar el comentario `/* … */` de la cabecera. Diff de una línea = reversible con `git revert`.
- Verificar SIEMPRE en el HTML público con `curl` (no en el preview del editor).

**Corolario para el plan:** varios "gates de Eduardo" heredados de planes anteriores
(pase de colores, tarjetas de producto, tipografía del editor) probablemente tampoco lo son.
Antes de escribir "esto lo hace Eduardo a mano", **intenta el push y verifica con curl**.

### 7.E 📏 Presupuesto de píxeles de la home (medido 2026-08-17, tras WUX-1)

Lo que ocupa cada cosa antes del primer producto. Sirve para saber a quién cobrarle
los píxeles que falten, en vez de adivinar.

| Bloque | Escritorio 1440×900 | Móvil 375×812 | Dueño |
|---|---|---|---|
| Barra de despacho | 40 px | 34 px | WUX-2 |
| Header | 191 px | 115 px | WUX-2 (meta ≤120/110) |
| **Tira "¿Primer pedido?"** | **75 px** | **180 px** | **WUX-2 (se borra, D-5)** |
| Hero compacto | 384 px | 458 px | WUX-1 ✅ |
| Tira de público | 70 px | 82 px | WUX-1 ✅ |
| Título "¿Qué necesitas hoy?" | 89 px | 60 px | WUX-1 ✅ |
| **→ primer tile** | **849 px** (meta ≤850 ✓) | **929 px** (meta ≤750) | |
| Grilla de tiles + "ver todo" | 542 px (2 filas) | 732 px (3 filas) | WUX-1 ✅ |
| **→ primer producto** | **1.496 px** | **1.661 px** (meta ≤1.600) | |

**Las dos metas de móvil las cierra WUX-2, no WUX-1.** La tira "¿Primer pedido?" pesa
180 px de los 329 px de chrome móvil. Descontándola: primer tile **749 px** (meta ≤750 ✓)
y primer producto **1.481 px** (meta ≤1.600 ✓). El hero ya se recortó todo lo que se podía
sin romper los targets táctiles (CTA 48 px, enlace 44 px). Si tras WUX-2 la medida no da,
el siguiente recorte disponible es el alto del tile móvil (172 → 150 px, −66 px).

### 7.F 🍎 El texto NO va encima de la foto de comida

WUX-1 construyó primero los tiles con el texto sobre la foto y un degradado morado de
scrim. **Pasaba AA con holgura** (blanco sobre el peor fondo posible daba 6,95:1) y aun
así estaba mal: el morado teñía la frutilla, el repollo y los frutos secos. Es el mismo
error del carrusel de junio 2026 y contradice la dirección de marca — *"el morado va en
tipografía, líneas y pastillas; no fondos morados grandes"* (§7.B, punto 1).

**Regla para WUX-3/4/5 y para cualquier pieza futura:** sobre foto de comida no va scrim
morado. El texto va en placa blanca (o fuera de la foto) y el morado se queda en la
tipografía. Beneficio lateral que vale por sí solo: el contraste deja de depender de qué
foto suba Eduardo. Título `#671D90` sobre blanco = 9,74:1; contador `#6E6E6E` = 5,10:1,
pase lo que pase con la imagen de la colección.

### 7.G 🎨 Cuatro trampas del tema que ya costaron sangre (WUX-4, 2026-08-17)

Para WUX-5, WUX-6, WUX-7 y cualquier sesión futura que toque CSS del tema.

**1. El botón primario NO tiene `background-color`.** Canopy lo pinta con un degradado
de 300 % de ancho anclado a la derecha, y el hover sólo mueve `background-position`:

```css
background: rgb(var(--btn-bg-hover-color))
            linear-gradient(104deg, rgb(var(--btn-bg-hover-color)) 60%,
                                     rgb(var(--btn-bg-color)) 60%, … 100%)
            no-repeat 100% 100%;
background-size: 300% 100%;
.btn--primary:hover { background-position: 0 100%; }
```

Dos consecuencias: (a) para cambiar el color se pisan **las dos variables**, nunca
`background` — pisarlo mata la animación; (b) **`getComputedStyle(btn).backgroundColor`
devuelve el color de HOVER**, porque es la capa base. Verificar el botón por ahí da un
falso negativo. Lo correcto es leer `--btn-bg-color` o mirar píxeles.

**2. Las custom properties se resuelven por PROXIMIDAD, no por cascada.** Cada sección
vive dentro de un `.color-scheme--N` que redefine `--btn-bg-color`. Un `:root` en tu CSS
**nunca** le gana, ni con `!important`: no es un problema de especificidad sino de qué
ancestro está más cerca. La solución es declarar la variable **sobre el propio elemento**
(`.btn--primary { --btn-bg-color: … }`), que es lo más cerca que se puede estar.

⚠️ Y cuidado con pasarse: `color-scheme--2` es la **banda morada** (`#671D90`, viva en la
home y en la landing B2B) y ahí el botón está diseñado **blanco** a propósito. Forzarle el
verde lo deja en 2,08:1 contra el fondo y casi desaparece. Foco y enlaces morados dentro de
esa banda quedan a **1:1**. Por eso `fru-brand.css.liquid` usa `--fru-focus` y `--fru-link`,
que el esquema 2 redefine.

**3. Nunca fijes `--btn-border-radius` global.** `main.css` lo mete en
`calc((var(--input-border-radius) + var(--btn-border-radius)) * -1)` para solapar un input
con su botón. Con `9999px` ese margen se va a **−10.003 px** y revienta el buscador y el
newsletter. Si quieres pastilla, píntala directo y devuélvele el radio compuesto a
`.input-with-button > .btn`.

**4. El richtext de Shopify rechaza el archivo entero por un atributo.** WUX-3 documentó
que descartaba `style=`. Es peor: **cualquier atributo que no sea `href`** hace fallar el
upload con «El parámetro "text" no es válido. No se permite el atributo …». Un `class=` en
un `<p>` basta. ⇒ El CSS de un bloque richtext tiene que enganchar **por estructura**
(`.footer-block__text ul`), nunca por clase. Y `list-style: none` no borra la viñeta:
`main.css` la dibuja con `.rte ul li::before` (un círculo de 0.5em), hay que apagar el
pseudo-elemento aparte.

**Bonus — verificar en producción:** tras el push, `frutiferia.com/` puede seguir sirviendo
HTML cacheado por Shopify varios minutos (ya pasó en WUX-2). Las rutas internas
(`/cart`, `/products/…`, `/collections`) se actualizan al instante. La prueba **autoritativa**
no es el curl a la home sino `shopify theme pull --theme <id vivo> --only <archivo>` y
comparar con el commit.

### 7.H 🍎 Dos trampas del logo SVG (WUX-4, 2026-08-17)

**1. `fill-rule="evenodd"` NO perfora entre paths hermanos.** El isotipo son dos piezas:
el cuerpo y los dos brillos. En el componente del OS van en UN solo path
(`<path d={BODY + SPARKS} />`) y por eso los brillos son HUECOS: el isotipo funciona
sobre cualquier fondo sin saber cuál es. WUX-2 los separó en dos `<path>` dentro de un
`<g fill-rule="evenodd">` — y ahí `evenodd` ya no hace nada entre ellos: los brillos se
pintan como manchas moradas sólidas sobre un cuerpo morado, invisibles, y la manzana
queda **plana**. Lo cazó Eduardo mirando la home en su teléfono. Regla: el isotipo va
siempre en un solo path.

**2. Un comentario XML dentro del .svg rompe `inline_asset_content`.** El filtro devuelve
**vacío** y —lo peor— el logo desaparece entero del header: no hay error, no salta el
fallback a `<img>`, no aparece nada en `theme check` ni en los logs de `theme dev`.
Probado A/B en el preview: con el comentario, `logo__link` sale **0** veces en el HTML;
sin él, **1**. ⇒ Los SVG que se inyecten con `inline_asset_content` van **sin comentarios**;
la explicación se pone en el `.liquid` que los llama o en el commit.

---

### 7.I 🔴 El logo del OS NO es el logo oficial (2026-08-19, lo cazó Eduardo otra vez)

7.H arregló el ARMADO del SVG, pero el arte de partida ya estaba mal. Eduardo:
*"el logo de la web NO ES EL OFICIAL, está raro"*. Comparado contra el arte del Drive,
lo que estaba en vivo tenía **tres** diferencias, no una:

| | Estaba | Oficial |
|---|---|---|
| Barra divisoria `\|` entre isotipo y palabra | **sí** (`<rect x="38" y="4" width="1" height="20">`) | **no existe** — la inventó WUX-2 |
| Wordmark | otra tipografía, mucho más pesada, **sin `.com`** | geométrica ligera, **`frutiferia.com`** |
| Color | `#671D90` (morado institucional del OS) | **`#A531EB`** (el arte no tiene otro color) |

**La causa raíz es una premisa falsa que 7.H daba por buena:** *"la fuente de verdad son
`frutiferia-so/src/components/brand/*.tsx`"*. **No lo es.** El `FrutiferiaMark` (la manzana)
sí coincide con el oficial, pero el `FrutiferiaWordmark` del OS es un **derivado**: otra
letra y sin `.com`. Un logo institucional para la UI interna no es el logo de la marca.

**La fuente de verdad es el arte del Drive:**
`Frutiferia/4. MARKETING Y COMUNICACIONES/4.6 BRANDING Y PLANTILLAS/Logo 2026/`
(`Logo-Horizontal-Morado.png` = lockup · `-Blanco` = negativo · `Logo-Manzana-*` = isotipo ·
`Logo-Horizontal-Letras-*` = sólo wordmark). **No hay variante sin `.com`.**

**Cómo se regenera** (no hay potrace ni ImageMagick en este Mac; el script vive en el
scratchpad de la sesión y se puede rehacer con numpy+PIL): marching squares sobre el canal
alpha → RDP con `eps=0.8` → **un solo path** `fill-rule="evenodd"`. Los brillos salen solos
como contornos interiores porque **en el arte oficial son transparentes** (el PNG no tiene
un solo píxel blanco — eso confirma la regla de 7.H desde el origen).
**Verificación obligatoria: rasterizar el resultado con supermuestreo ×4 y medir IoU contra
la máscara original.** Sin supermuestreo el número miente (da ~98,4 % por el borde de un
píxel del rasterizador, no por el trazo). Resultado aceptado: **99,52 %** (637 puntos,
8,7 KB — más liviano que el SVG malo que reemplaza).

**Tamaño:** el lockup oficial es **5,86:1** (el falso era 4,7:1), así que a la misma altura
es ~25 % más ancho. Verificado sin desborde ni recortes a 375 / 1200 / 1440 px; en el header
va a 38 px de alto (223 px de ancho ≈ los 230 px que el logo original ocupaba antes de WUX-2).
Los 3 satélites lo dimensionan con `h-8/h-9 w-auto`, así que el cambio de proporción es
inocuo ahí.

## 8. Línea base y medición (la llena WUX-6)

| Métrica | Antes (fecha) | Después (+30 d) |
|---|---|---|
| Móvil: y del primer producto en home | 3.169 px (2026-08-16) | |
| Móvil: y de la primera categoría | 3.747 px (2026-08-16) | |
| Escritorio: y del primer producto en colección | 1.076 px (2026-08-16) | 1.028 px (2026-08-17, tras des-anclar) |
| Escritorio: ancho útil de contenido | 1.080 px de 1.440 (2026-08-16) | **1.440 px** ✅ (2026-08-17) |
| Escritorio: columnas y ancho de tarjeta en colección | 4 × 224 px | 5 × 184 px ⚠️ *revisar en WUX-3: `card_size` medium* |
| Header (escritorio / móvil) | 191 / 115 px (2026-08-16) | 73 / 107 px ✅ (2026-08-17, WUX-2) |
| Shopify Analytics 30 d (18 jul–17 ago 2026): sesiones · conversión · % ATC · % checkout · ticket | **3.802 sesiones · 2,39% conversión · 9,36% ATC (356) · 3,52% checkout (134) · $55.454 ticket promedio** (2026-08-17, admin Shopify → Informes) | |
| `get_web3_funnel_metrics(30)` (2026-08-17): leads web por canal · cotizaciones portal · reorder | **leads:** cotizador 2 (0 conv.) · mi_frutimenu 14 (2 conv.) · otro 24 (2 conv.) · shopify_newsletter 283 (41 conv.) — **cotizaciones:** 2 creadas, 2 enviadas, 0 convertidas — **reorder:** 383/415 pedidos de la ventana (92,3%) — **automatizaciones:** 463 enviadas — **cuenta (CTA-15):** 60 vistas del panel, 23 clientes, 0 con portal, 0 con wellness | |
| Links a cambiar a `wellness.frutiferia.com` cuando resuelva (G-31) | **3 exactos** (2026-08-17): (1) tema `templates/page.bienestar.json` → `hero_wellness.button_hero` (botones 1 y 2) · (2) `frutiferia-wellness/src/components/Footer.tsx:57` (link "Bienestar", auto-referencia) · (3) `mi-menu-semanal/src/routes/__root.tsx:198` (link "Bienestar" del footer). El de `frutiferia-cotizador/src/components/LogisticsFooter.tsx` usa una ruta relativa `/bienestar` de sí mismo — no cambia. | |
