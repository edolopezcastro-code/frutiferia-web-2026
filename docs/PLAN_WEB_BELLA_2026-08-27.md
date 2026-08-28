# Plan — Web BELLA: hermosa de verdad y compra B2C rápida · 2026-08-27

> **Cómo se usa:** cada PROMPT del §4 se pega tal cual en una sesión nueva con el modelo
> indicado. Los pasos de Eduardo (§5) toman minutos. Estado en la tabla §3; el siguiente
> sprint se propone en Sami y el plan corre por el orquestador. Vive en el repo del tema
> (`~/Desktop/frutiferia-theme/docs/`, Shopify ignora `docs/`). **Sucede al plan WUX
> (`PLAN_WEB_UX_2026-08-16.md`) como plan activo de la web** — WUX-1..6 están en vivo;
> WUX-7 (QA) queda ABSORBIDO por BELLA-10.

---

## 1. Contexto y origen

Eduardo (2026-08-27): *"la página principal no está tan bonita; que quede más hermosa.
Y el proceso B2C de compra fácil y rápido — han bajado las ventas."*

**El dato que manda:** conversión online 30 días pre-rediseño (18-jul→17-ago, §8 WUX):
**2,39%** vs 3,17% promedio ene-ago. Abandono de carro **74,7%** (peor que el promedio
mundial 70,2%); del carro al pago se cae el **61,7%**. 76% de las sesiones son móviles.

**Auditoría 2026-08-27 (14 agentes, 72 hallazgos verificados adversarialmente, evidencia
= producción en vivo + código del tema + 6 referentes internacionales fetcheados):**
WUX arregló la ESTRUCTURA (metas de scroll cumplidas) pero quedaron 3 problemas de fondo:

1. **La home no tiene voz.** El H1 del hero mide **31px** en escritorio (¡más chico que
   el H2 de tiles, 36px!) porque `fru-hero.liquid` usa rems calibrados a 16px y Canopy
   define `html{font-size:62.5%}` (1rem=10px). La foto del hero es un flatlay arcoíris de
   stock con velo morado al 45% (el mismo error que f/carrusel_overlay_tenia_la_comida),
   igual en desktop y móvil, y se repite casi idéntica en 3 tiles y FrutiMenu. El color
   ambiente es el gris default de Canopy (#f2f4f3), no el lila de marca; la banda B2B es
   un rectángulo morado sólido de 420px (viola el canon "morado nunca en fondos grandes");
   la única pastilla sólida del selector de público es **"Para mi negocio"** en una home B2C.
2. **Comprar cuesta el doble de gestos.** Canasta de 10 ítems ≈ 28-30 gestos (podrían ser
   ~14): cada "Agregar" abre el drawer completo que hay que cerrar; el drawer abre con los
   FORMULARIOS arriba y la comida abajo; "Pagar" nace deshabilitado (picker día+zona sin
   preselección); "Vaciar carrito" a ancho completo pegado a "Pagar"; en /cart móvil el
   botón Pagar no se ve sin scroll; la cantidad en la ficha es **blanca sobre blanco**
   (invisible); el 52% habitual no tiene recompra visible (existe pero enterrada en /account).
3. **Ruido que ensucia.** La ficha imprime la descripción completa DOS veces (+1 en el DOM),
   dos avisos B2B pegados, dos filas de estrellas, envío gratis 4-5 veces, y la pestaña
   "Reseñas (3)" abre un panel VACÍO (app muerta) con las reseñas reales de Judge.me
   enterradas al fondo. La home repite "20.000 pedidos / 7 años" 5 veces y PRIMERA15 en 5
   lugares (la decisión vigente eran 3). El H1 promete "cuando lo necesitas" y la operación
   reparte miércoles y sábado.

**Base técnica sana** (no hay incendio de performance): JS liviano, 2 fuentes con preload,
JSON-LD válido. Los 2 hoyos: el preload del hero baja una imagen que el `<picture>` nunca
usa (hasta 358KB para pintar el LCP móvil) y los 6 tiles pesan 27-95KB c/u a 380px.

Evidencia completa: hallazgos por dimensión con veredicto en el registro de la sesión
2026-08-27 (§6); screenshots y HTML de referencia se regeneran al correr BELLA-10.

## 2. Decisiones por defecto (veta aquí)

| # | Decisión | Default | Alternativa | Por qué |
|---|---|---|---|---|
| D-1 | **Tras "Agregar al carrito"** | `after_add_to_cart: "nothing"` — el botón confirma (is-success 1,4s) y el contador sube; el drawer solo se abre al tocar el carrito | `drawer_desktop` (drawer solo escritorio) | Hoy CADA agregar abre el drawer completo también en móvil: 2 gestos extra × ítem. El stepper en tarjeta ya existe. |
| D-2 | **Pastilla líder del selector de público** | NINGUNA sólida: 3 píldoras hairline con tinta de canal. ⚠️ Revierte la decisión de jul-2026 ("B2B sólida porque trae caja") — en la HOME B2C con ventas cayendo, el foco vuelve al hogar; Negocios sigue primero en visibilidad de landing y menú | Mantener "Para mi negocio" sólida · o "Para mi casa" sólida | La única pastilla sólida (índigo #2525C1) se roba el foco de la home B2C y parece "opción seleccionada". |
| D-3 | **Copy del hero** | H1 "Fruta y verdura elegida a mano," + highlight morado "en tu puerta miércoles y sábado" · sub "Repartimos en Viña, Valparaíso, Concón, Reñaca y Quilpué. Despacho gratis sobre $50.000." | Dejar el actual | El actual promete on-demand que la operación contradice, y el diferencial real (elegida a mano) no se dice NUNCA en la home. |
| D-4 | **Banda B2B** | Se re-viste: fondo lila `--fru-morado-050`, morado como TINTA (titular grande), riel índigo de canal, misma altura ~200-250px | Dejar el bloque morado sólido | Canon escrito en el propio repo: morado en tipografía/líneas/pastillas, NO fondos grandes. |
| D-5 | **Retiro en tienda en la ficha** | `show_pickup_availability: false` (fuera el bloque "listo en 2 a 4 días") | Corregir el plazo en admin a "24 horas" si el retiro es real (G-7) | "2 a 4 días" al lado de "Agregar" contradice la frescura y el "miércoles y sábado" contiguo. |
| D-6 | **Botón "Vaciar carrito"** | OFF (drawer y página) | Degradarlo a link de texto chico | Acción destructiva a ancho completo pegada a "Pagar". |
| D-7 | **Buscador móvil** | Se queda visible pero limpio: fuera el selector "Tod…" y el micrófono (CSS <600px); input de borde a borde | `minimise_search_mobile: true` (header ~64px, lupa expande) | 3 controles apretados roban ~114px al input; los tiles ya cumplen el rol del selector de tipo. |
| D-8 | **Formatos B2B en la búsqueda** | Ocultar 5/20 kg del storefront search con metafield `seo.hidden=1` (verificando antes que ningún flujo web B2B dependa de esa búsqueda — el cotizador usa su propia API) | Dejarlos | "palta" sugiere formatos de $79.990-$109.990 entre 6 resultados B2C. |
| D-9 | **Cupón de 2ª compra** | Proponer VUELVE10 (10%, 14 días) entregado POST-compra vía correo de confirmación — decisión comercial de Eduardo (G-4), no del tema | No hacer | Todo el incentivo está en la 1ª compra; el hábito se decide en la 2ª-4ª (patrón Gousto). Conecta con p/checkout_gracias_extension. |
| D-10 | **Fotos nuevas** | Mientras no haya foto propia (G-2): Claude elige del banco de imágenes de marca la mejor candidata editorial (UN sujeto, aire, luz natural) y baja el overlay a 0-10 | Esperar la foto real | No bloquear el sprint por fotos; la foto de operación real llega después y se cambia en 2 min por admin. |
| D-11 | **Fondo de ambiente** | `color_scheme_1_bg` → lila pálido `#F4F0F7` (una línea). El scheme 2 (banda morada) y 3 NO se tocan sin auditar qué otras plantillas los usan | Crema cálido | La alternancia blanco/lila tiñe la home de marca sin agregar un solo elemento — la mejor razón belleza/esfuerzo de la lista. |
| D-12 | **Prueba social** | UNA tira (la del footer-group, reescrita con el diferencial real) + la sección "Más de 7 años" como único momento de historia. Fuera el ticker y la tira mid-page. Sin ratings inventados: estrellas solo cuando salgan de Judge.me | Dejar las 5 repeticiones | "20.000 pedidos / 7 años" ×5 pierde fuerza; lo que convence (elegido a mano, garantía de reposición, WhatsApp con personas) hoy solo se dice en el carrito. |

**Preguntas batcheadas (responde solo si vetas):**
1. ¿OK con que ninguna pastilla vaya sólida (D-2, revierte lo de julio)?
2. ¿OK con el copy nuevo del hero (D-3)?
3. ¿El retiro en tienda existe de verdad? (decide D-5 vs G-7)
4. ¿Apruebas VUELVE10 2ª compra (D-9)?

## 3. Sprints

Secuenciales (un sprint = una sesión = un cierre — f/encadenar_sprints_apaga_la_verificacion).
Cada sprint es dueño EXCLUSIVO de sus archivos. PUSH = DEPLOY EN VIVO.

| Sprint | Modelo | Qué hace | Archivos que TOCA | Estado |
|---|---|---|---|---|
| **BELLA-1** Interruptores de conversión | Sonnet | Todos los cambios de `config/settings_data.json` en un solo commit: `after_add_to_cart` (D-1), `enable_compare:false`, `color_scheme_1_bg` (D-11), `input_button_border_width:1`, colores de badge de oferta a canon, `predictive_search_show_vendor:false` | `config/settings_data.json` | ⬜ |
| **BELLA-2** Hero editorial | Opus | Escala tipográfica en px (H1 48/34), preload responsivo del LCP, copy D-3, micro-línea de prueba social, CTA por tipo de cliente, foto móvil tratada, overlay 0-10 | `sections/fru-hero.liquid`, `templates/index.json` (solo settings de `fru_hero`) | ⬜ |
| **BELLA-3** Home sin ruido y con marca | Opus | Fuera ticker + tira mid-page (D-12), footer-tira con diferenciales, pastillas sin lead (D-2), banda B2B re-vestida (D-4), emojis fuera, bullets FrutiMenu, testimonios en grid con atribución, barra superior sin 🚚 y sin truncar | `templates/index.json` (secciones no-hero), `sections/footer-group.json`, `sections/free-shipping-bar.liquid`, `assets/free-shipping-bar.css`, `sections/testimonials.liquid`, `sections/audience-doors.liquid` | ⬜ |
| **BELLA-4** Ficha limpia | Sonnet | Borrar duplicados de `templates/product.json` (descripción ×2, aviso B2B ×2, estrellas ×2, msg_envio), matar pestaña Reseñas vacía y subir Judge.me, pickup off (D-5), trust-bar apilada en móvil, breadcrumb con categoría | `templates/product.json`, `snippets/breadcrumbs.liquid` | ⬜ |
| **BELLA-5** Carrito y drawer que no estorban | Opus | Picker con día preseleccionado ("Pagar" nace activo), resumen del drawer abajo, pitch de cuenta después de Pagar, vaciar-carrito off (D-6), calculadora off, promoted solo carro vacío, sticky "Ir a pagar" en /cart móvil, FAB WhatsApp clear-dock en cart, línea "Pide antes del X → llega el Y" | `assets/delivery-picker.js`, `snippets/delivery-picker.liquid`, `snippets/cart-drawer.liquid`, `sections/overlay-group.json`, `sections/main-cart.liquid`, `snippets/fru-whatsapp.liquid`, `assets/fru-whatsapp.css` | ⬜ |
| **BELLA-6** Tarjeta de feria | Opus | Cantidad visible (fix rgb), tap targets ≥44px, quick-add compacto ("+" que expande al stepper), ids únicos de cantidad, viñetas check por CSS, formato/`$ x kg` en tarjeta donde el dato exista | `snippets/product-card.liquid`, `assets/quick-add.css`, `assets/fru-brand.css.liquid`, `snippets/quantity-input.liquid` | ⬜ |
| **BELLA-7** Recompra y búsqueda | Sonnet | Banda "Repite tu última caja" en home para clientes, reorder en drawer vacío y menú, búsqueda sin formatos B2B (D-8), quick-add en resultados, Verduras a 50/página | `sections/` (nueva `fru-reorder-band.liquid`), `templates/index.json` (solo esa sección), `snippets/predictive-search-tab-panel.liquid`, `templates/collection.json`, admin (metafields seo.hidden) | ⬜ |
| **BELLA-8** Fotos y tiles premium | Sonnet | Tiles con altura real (4:3 escritorio) y títulos 24-26px, re-export de las 6 fotos de colección (≤1200px, q80, −250KB móvil), curaduría: 6 sujetos DISTINTOS del banco, packshots normalizados, subtítulo por tile | `assets/fru-category-tiles.css`, `sections/fru-category-tiles.liquid`, admin de colecciones (fotos, trampa `?v=`) | ⬜ |
| **BELLA-9** Admin, SEO y apps | Sonnet | Título "Frutiferia" sin duplicar + meta desc 152c, product_type es-CL (Paltas/Papas/…), retiro 24h o off (G-7), Judge.me a dieta, propuesta VUELVE10 lista para G-4, guía desinstalar Smile (G-5) | Admin de Shopify vía navegador (nada del repo) | ⬜ |
| **BELLA-10** QA integral + medición | Sonnet | Absorbe WUX-7: 12 rutas, medidas, contraste AA, tuteo, PSI, consola + línea base nueva de Shopify Analytics 30d vs §8 WUX. Entrega lista de fixes por sprint | ninguno (read-only) | ⬜ (tras 1-8) |

## 4. Prompts listos para pegar

### PROMPT BELLA-1 — Interruptores de conversión (Sonnet)

```
Sesión BELLA-1 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema Shopify frutiferia-web-2026 (clon ~/Desktop/frutiferia-theme, main, repo-first:
`git pull --rebase` antes de editar y de pushear; PUSH = DEPLOY EN VIVO). Activa: edu-sprints.
Lee §1 y §2 (D-1, D-11) del plan. Tu ÚNICO archivo: config/settings_data.json — edita SOLO
dentro de `current`, NUNCA los presets Canopy/Cedar/Willow, NO reformatees el JSON, conserva
el comentario /* */ de cabecera (§7.D del plan WUX: este archivo SÍ se despliega por push).

Cambios (todos dentro de `current`):
1. `after_add_to_cart`: "drawer" → "nothing" (D-1).
2. `enable_compare`: true → false (limpia el checkbox "Comparar" de las 21+ tarjetas; el
   template oculto de ~17KB en la ficha NO desaparece con esto — se documenta, no se pelea).
3. `color_scheme_1_bg`: "#f2f4f3" → "#F4F0F7" (D-11 — NO toques scheme 2 ni 3).
4. `input_button_border_width`: 0 → 1 (el input del newsletter deja de ser invisible).
5. Badges de oferta a canon: `sale_label_bg_color` (hoy #6a25b0) → "#671D90"; revisa
   `cart_savings_color` y `checkout_accent_color` y alinéalos al mismo morado canon.
6. `predictive_search_show_vendor`: true → false (fuera "Frutiferia SPA" ×6 en la búsqueda).

Verificación: ANTES de tocar, `git pull --rebase`. Después: commit + push, espera ~30 s y
verifica en PRODUCCIÓN con curl (UA de Chrome SIEMPRE — la home cachea por user-agent:
curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)
Chrome/139.0.0.0 Safari/537.36"): (a) el HTML de / ya no trae `cart-drawer` con
afterAtc:"drawer"; (b) /collections/frutas-deliciosas sin "Comparar"; (c) el scheme 1 pinta
#F4F0F7 (grep del hex en el CSS inline); (d) badge de oferta morado canon. Para contar en
HTML usa python3, no grep (el grep BSD se calla con bytes raros).
Cierre: 1 commit self-contained + §3/§6 del plan + tion_cerrar/tion_log_sesion + "Lo que
tienes que hacer tú" (QA iPhone: agregar 3 productos seguidos desde la grilla — ya no debe
abrirse el carrito cada vez; el contador sube solo).
```

### PROMPT BELLA-2 — Hero editorial (Opus)

```
Sesión BELLA-2 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui, anthropic-skills:frutiferia-style, frontend-design. Lee §1, §2 (D-3, D-10)
y los hallazgos del hero en §6. Tus archivos: sections/fru-hero.liquid y templates/index.json
(SOLO los settings de la sección fru_hero — nada más de index.json).

Contexto duro: assets/main.css define html{font-size:62.5%} → 1rem = 10px EN TODO EL TEMA
(no lo cambies: rompería el sitio). fru-hero.liquid usa rems calibrados a 16px, por eso el
H1 rinde 31px en 1440 y 22,5px en 375 — más chico que el H2 de tiles (36px). El preload del
hero apunta a URLs fijas (1600/900) SIN imagesrcset, distintas de las que el <picture> elige
→ el LCP baja DOS veces (hasta 358KB en móvil).

Tareas:
1. Escala tipográfica en PX (como fru-category-tiles y audience-doors): título compacto
   `clamp(34px, 3.6vw, 48px)`, título base `clamp(28px, 9vw, 60px)` (móvil ≥28px), badge
   12px, sub 16-17px, label de CTA 16px, line-height 1.05-1.1 en el H1. Jerarquía final:
   H1 > títulos de sección (36px) > tiles.
2. Preload responsivo: reemplaza los dos <link rel=preload href=fijo> por preloads con
   imagesrcset/imagesizes IDÉNTICOS al <source> móvil (480/640/900/1200w, sizes 100vw,
   media max-width:767px) y al <img> desktop (640-1920w, sizes "(min-width:768px) 42vw,
   100vw"), fetchpriority="high". El preload y el <picture> deben elegir SIEMPRE la misma URL.
3. Copy D-3 en templates/index.json (settings de fru_hero): heading "Fruta y verdura elegida
   a mano," heading_highlight "en tu puerta miércoles y sábado", subheading con zonas +
   despacho gratis. `overlay_opacity` 45 → 10; baja también el default del schema (45 → 10).
4. Foto (D-10): elige del banco de imágenes de marca (Frutiferia/4. MARKETING…/banco de
   imágenes; ver memoria p/banco_imagenes_stock_frutiferia y f/banco_fotos_datos_clientes_legibles)
   la mejor candidata editorial: UN sujeto, aire, luz natural, sin datos de clientes legibles.
   Súbela por el admin (la página de archivos/tema del admin SÍ es automatizable; el Theme
   Editor NO) o déjala committeada y cambia el setting image_desktop/image_mobile si es
   posible por JSON. Para image_mobile usa un crop VERTICAL distinto. Si nada del banco
   supera la actual, dilo y deja solo el overlay bajado — la foto real es G-2.
5. En móvil <560px: la foto NO puede comerse el pliegue — foto como cabecera baja (~180px)
   con el texto encima en placa blanca, o media oculta con la foto de fondo; el link "Arma
   tu semana gratis" pasa inline junto al CTA. Meta: primer tile ≤ 700px (hoy 741).
6. Micro-línea de prueba social bajo el CTA (setting nuevo, texto editable): "+20.000
   pedidos entregados en la V Región · 7 años". SIN estrellas ni ratings (no existen datos).
7. CTA por cliente: {% if customer %} → "Haz tu pedido" con link a #tiles; invitado → "Pide
   tu primera caja con 15% OFF" (actual). El cupón no se le ofrece a quien ya compró.

Ojo Canopy: un error de schema tumba el upload ENTERO; richtext solo acepta p/ul/li/strong/
em/a (sin class/style/svg); labels ≤70 chars; type "url" no acepta default.
Verificación: shopify theme check (0 errores nuevos sobre base 46/33/10) + theme dev + curl
200; en el Browser pane (o Chrome headless --window-size) mide getComputedStyle del h1 en
1440 y 375 (≥48px / ≥28px) y getBoundingClientRect del primer tile móvil (≤700px); confirma
con python3 sobre el HTML servido que el preload trae imagesrcset y que la URL elegida por
el navegador coincide (network o simulación de srcset). Contraste AA del texto sobre lo que
quede detrás (calcúlalo). Screenshot desktop + móvil.
Cierre: commits (1: escala+preload, 2: copy+foto+social+CTA) + pull --rebase + push + prod
check con UA Chrome + §3/§6 + Tion + "Lo que tienes que hacer tú" (mirar el hero en iPhone;
G-2 foto propia si quiere reemplazar la del banco).
```

### PROMPT BELLA-3 — Home sin ruido y con marca (Opus)

```
Sesión BELLA-3 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Corre DESPUÉS de
BELLA-2. Activa: edu-sprints, frutiferia-ux-ui, frutiferia-style. Lee §2 (D-2, D-4, D-12) y
§6. Tus archivos: templates/index.json (secciones NO-hero), sections/footer-group.json,
sections/free-shipping-bar.liquid, assets/free-shipping-bar.css, sections/testimonials.liquid,
sections/audience-doors.liquid. NO toques fru-hero ni settings_data.json.

Tareas:
1. Ruido fuera (D-12): en templates/index.json ELIMINA del order y de sections:
   `scrolling_banner_ArEtdk` (ticker "20.000 pedidos") y `3721924b-630b-4a60-b724-521fef7aa78e`
   (tira de iconos mid-page). El cierre queda: blog → newsletter → footer (la tira del
   footer-group viaja a todas las páginas). Rollback = git.
2. Tira única con el diferencial (D-12): reescribe los bloques de icons-with-text en
   sections/footer-group.json: "Elegido a mano — revisamos cada caja antes de que salga" ·
   "Reparto mié y sáb — Viña, Valpo, Concón, Reñaca y Quilpué" · "WhatsApp con personas —
   Mora te responde al +56 9 6609 3891" · "Garantía simple — si algo llega mal, lo
   reponemos" · "+20.000 pedidos en 7 años". (Los WhatsApp: Mora hogares, Francisco
   +56 9 9326 1147 negocios — no los mezcles.)
3. Pastillas (D-2): en templates/index.json pon lead:false en door_negocios (ninguna sólida).
   En sections/audience-doors.liquid afina el estado sin lead: hairline + tinta de canal
   legible (contraste AA calculado). En <400px labels cortos "Mi casa / Mi negocio / Mi
   equipo" o font 13px, min-height 64px se mantiene.
4. Banda B2B (D-4): re-vestir b2b_band SIN borrarla — color_scheme al esquema claro, fondo
   lila --fru-morado-050, titular grande con tinta morada, riel/CTA índigo de canal. La
   quote del "Jefe de cocina" de testimonios se MUEVE aquí (habla al público correcto).
5. Testimonios: grid de 3 simultáneas en escritorio (apiladas en móvil), cada una con
   inicial en círculo (fondo #F4EFE9), nombre + comuna. SIN sello "verificado" ni ratings
   mientras no haya fuente real (G-3: Eduardo confirma quotes y permisos). autoplay puede
   quedarse en móvil.
6. Emojis y bullets: fuera "🔥" del título de featured-collection; el richtext de fm_text
   (FrutiMenu) queda sin emojis y sin el doble "lista…lista": "<p>Deja de improvisar a
   última hora. <strong>FrutiMenu</strong> arma tu semana con recetas chilenas y te deja la
   compra lista para pedir.</p><ul><li>Recetas balanceadas, con calorías y proteína por
   plato</li><li>Los ingredientes caen armados a tu carrito</li><li>Gratis, sin registro y
   en 1 minuto</li></ul>" (richtext NO acepta class/style/svg — las viñetas check van por
   CSS en el sprint BELLA-6, no aquí). En frutimenu_promo limita la foto en móvil si la
   sección lo permite por setting; si no, anótalo para BELLA-6 (regla CSS).
7. Barra superior: en sections/free-shipping-bar.liquid elimina el span del emoji (🚚/🎉);
   en assets/free-shipping-bar.css permite 2 líneas en <560px (white-space normal, sin
   ellipsis) — la oferta nunca se trunca. Copy: "Despacho gratis sobre $50.000 · Reparto
   mié y sáb" (PRIMERA15 vive en hero + newsletter + popup: 3 lugares canónicos).

Verificación: theme check 0 nuevos + theme dev + curl 200 en / y 3 rutas; python3 sobre el
HTML de prod (UA Chrome): 0 emojis en home, 1 sola aparición de "20.000", barra en 2 líneas
como máximo sin "…"; screenshot desktop+móvil de: pastillas, banda B2B, testimonios, cierre
de la home. Contraste AA de pastillas y banda (calculado, no estimado).
Cierre: commits (1: index.json, 2: footer+fbar, 3: testimonios+doors) + pull --rebase +
push + prod + §3/§6 + Tion + "Lo que tienes que hacer tú" (G-3 confirmar testimonios).
```

### PROMPT BELLA-4 — Ficha limpia (Sonnet)

```
Sesión BELLA-4 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui. Lee §2 (D-5) y §6. Tus archivos: templates/product.json y
snippets/breadcrumbs.liquid. Nada más.

En templates/product.json (verifica cada id con Read antes de borrar; conserva el comentario
/* */ del JSON):
1. ELIMINA de main.blocks y block_order el bloque '1cc6422d-211f-4764-af07-884ee26ed3d7'
   (type description) — la descripción queda UNA vez, en el collapsible de la sección
   details (el tab '71057e1b-…' ya tiene show_description:true y open_first:true).
2. ELIMINA el bloque 'msg_envio' (el envío ya está en la barra y en la trust-row bajo el
   botón; el CTA sube ~64px y entra al fold móvil).
3. ELIMINA el bloque 'cotiza_por_mayor' (queda el fru-b2b-nudge de main-product.liquid,
   más rico: cotizador + WhatsApp Francisco).
4. Estrellas: deja UNA fila — mueve el app block 'judge_me_reviews_preview_badge_PT87gQ'
   justo después de 'title' y ELIMINA el bloque rating del tema
   ('3f73b6ee-a6b2-40ae-8379-a02a42756d8d'). El badge de Judge.me ancla al widget al click.
5. Pestaña Reseñas vacía: en el bloque tabs '71057e1b-320d-4706-a43a-06d66046c5a7' de
   details pon show_reviews:false y show_reviews_count:false (es el contenedor del app
   MUERTO Shopify Product Reviews). En el array 'order' del template mueve la sección
   '1780585006ec95da1b' (widget Judge.me) INMEDIATAMENTE después de 'details' — las 3
   reseñas reales dejan de estar enterradas bajo dos carruseles.
6. `show_pickup_availability: false` (D-5).
7. Sección trust_bar_product: mobile_stack:true (las 4 señales visibles apiladas; el
   carrusel de a 1 se va).
En snippets/breadcrumbs.liquid (rama product): fallback cuando no hay collection en la URL —
crumb = product.collections.first excluyendo handles utilitarios ('ofertas','all',
'catalogo-completo','990','por-mayor'); mismo fallback en el structured data del snippet.

Verificación: theme check 0 nuevos; theme dev + curl 200 en /products/platanos y 2 fichas
más (una sin colección canónica); python3 sobre el HTML de prod: "Del verde al maduro"
aparece ≤2 veces en el DOM total (1 visible + JSON-LD; hoy 4), 1 solo "¿Compras para un
negocio?", 1 sola fila de estrellas arriba; la ficha móvil se acorta ~1.200px (mide el
scrollHeight antes/después con Chrome headless 375px). Breadcrumb muestra la categoría.
Cierre: commits (1: product.json, 2: breadcrumbs) + pull --rebase + push + prod check +
§3/§6 + Tion + "Lo que tienes que hacer tú" (si vetó D-5: G-7 corregir plazo de retiro en
admin, 2 min).
```

### PROMPT BELLA-5 — Carrito y drawer que no estorban (Opus)

```
Sesión BELLA-5 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui. Lee §2 (D-6) y §6. Tus archivos: assets/delivery-picker.js,
snippets/delivery-picker.liquid, snippets/cart-drawer.liquid, sections/overlay-group.json,
sections/main-cart.liquid, snippets/fru-whatsapp.liquid, assets/fru-whatsapp.css.
El dato: del carro al pago se cae el 61,7%. El drawer abre con formularios arriba (sticky),
"Pagar" DESHABILITADO (2 selects obligatorios sin preselección), "Vaciar carrito" a ancho
completo al lado, calculadora de envío, 2 carruseles y pitch de cuenta — todo antes de la comida.

Tareas:
1. Picker con default (assets/delivery-picker.js): en renderDates, si no hay selección,
   preselecciona la primera fecha disponible (y persiste con el save() existente);
   autoselecciona cuando quede 1 sola opción; recuerda la última zona en localStorage para
   reincidentes. "Pagar" nace ACTIVO (el handleSubmit existente sigue de red de seguridad).
   ⚠️ MANTÉN el gate inert sobre .dynamic-cart-btns mientras falte día/zona: los botones
   express saltan el submit del form (snippets/delivery-picker.liquid:12-13 documenta el
   porqué del bloqueo — léelo entero antes de tocar).
2. Drawer al revés (snippets/cart-drawer.liquid + sections/overlay-group.json): resumen/
   formularios ABAJO (`position_cart_summary: bottom` → drawer__footer): productos primero,
   "Pagar" fijo al fondo. El picker colapsado a 1 línea con el valor elegido ("Miércoles 3
   sep · Viña — cambiar") cuando ya tiene default. Cabecera del drawer con la próxima
   entrega: "Pide antes del [día] [hora] → llega el [día]" calculada CLIENT-SIDE desde la
   respuesta de la edge fn delivery-availability que delivery-picker.js YA consume (tiene
   santiagoToday(); expón el próximo día+cutoff como JSON/evento compartido). NUNCA
   calcules la fecha con Date local a secas: f/fecha_servidor_utc_vs_santiago (20:00-23:59
   CLT ya es "mañana" en UTC).
3. Menos ruido en overlay-group.json: `enable_empty_cart` y `enable_empty_cart_mobile` OFF
   (D-6) · `show_shipping_calculator` false · `promoted_products_visibility` "empty-cart" ·
   `show_media_promotion` false (config muerta que hoy no renderiza — se apaga para que
   nadie la "arregle") · revisa la lista de promoted: formatos HOGAR (fuera cebolla-5-kg).
4. Pitch de cuenta: mueve el bloque account-value-pitch DEBAJO del botón Pagar. El resumen
   sticky queda: subtotal + despacho + Pagar. Nada más.
5. /cart móvil (sections/main-cart.liquid): barra fija inferior solo-móvil con subtotal +
   "Ir a pagar" (#17845A), safe-area-inset, visible desde 1 ítem; padding-bottom en el main
   para no tapar el último ítem.
6. FAB WhatsApp (snippets/fru-whatsapp.liquid): clear-dock también en page_type == 'cart'
   (con la barra nueva del punto 5 es obligatorio).

Verificación: theme check 0 nuevos; theme dev; flujo REAL con Chrome headless o Browser
pane: agregar producto → abrir drawer → "Pagar" habilitado con día preseleccionado →
document.querySelector del orden (productos antes que formularios) → en /cart móvil 375px
la barra "Ir a pagar" visible sin scroll y el FAB no la tapa (mide getBoundingClientRect de
ambos). curl del HTML del drawer: sin "Vaciar carrito", sin calculadora. La línea de cutoff
muestra fecha correcta a las 21:30 de Chile (simula TZ). ⚠️ Los settings de overlay-group.json
se han deployado por push antes (WUX-3: popup a exit) — si algún cambio NO llega a prod en
2 min, repórtalo como gate de editor en vez de reintentar a ciegas.
Cierre: commits (1: picker, 2: drawer+overlay, 3: main-cart+FAB) + pull --rebase + push +
prod + §3/§6 + Tion + "Lo que tienes que hacer tú" (QA iPhone: carro completo hasta el
checkout — contar taps; debe poder pagar sin tocar ningún select).
```

### PROMPT BELLA-6 — Tarjeta de feria (Opus)

```
Sesión BELLA-6 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui, frontend-design. Lee §6. Tus archivos: snippets/product-card.liquid,
assets/quick-add.css, assets/fru-brand.css.liquid, snippets/quantity-input.liquid.

Tareas:
1. CANTIDAD VISIBLE (bug alto): en assets/fru-brand.css.liquid agrega
   `.js .qty-input--combined .qty-input__input { color: rgb(var(--text-color)); }`
   — misma especificidad (0,3,0) que la regla de main.css:3865 que pinta el número con
   --btn-alt-text-color (blanco sobre blanco); fru-brand carga después y gana por orden,
   sin !important. --text-color es tripleta RGB en Canopy: va envuelto en rgb(). Cubre
   ficha, carrito y quick-add (misma clase).
2. Tap targets ≥44px: `.card__quick-add .btn--atc` min-height 40→44px (quick-add.css);
   los `.qty-input__btn` (hoy ~39px por el override de main.css:3958) a min 44×44 con
   padding extendido y caja sutil (borde --border) para que se vean tocables.
3. Quick-add compacto: en la tarjeta, reemplaza la pastilla verde full-width por un botón
   "+" circular verde (44px) anclado a la esquina inferior derecha de la foto que al tocar
   se expande al stepper que YA existe (quantity-input está en la tarjeta). Un solo acento
   verde por tarjeta; la fila de ofertas deja de ser un muro de 8 pastillas. Respeta
   prefers-reduced-motion; fallback sin JS = botón actual. Si el patrón rompe el add de
   Canopy (product-form.js), documenta y deja la pastilla pero al 60% del ancho.
4. Ids únicos: en snippets/quantity-input.liquid, con is_quick_order, id =
   'quantity-' + section.id + '-' + variant_id (las 29 tarjetas hoy comparten id).
5. Formato honesto: bajo el título, línea de formato desde el título mismo ("(kg)"/"(u)"/
   "(5 kg)") reformateada legible — "Por kilo", "La unidad", "Malla 5 kg" — y precio
   normalizado "$X x kg" SOLO donde unit_price o el dato exista (price.liquid ya trae la
   maquinaria); donde no, nada (no inventes). El dato masivo es G-9 (admin), no lo bloquees.
6. Viñetas check FrutiMenu: en fru-brand.css.liquid, regla scoped a la sección
   media-with-text: li::marker/li::before con check morado (data-URI SVG en el CSS — en el
   CSS sí se puede, en richtext no), reproduciendo el patrón de .audience-door__check.
7. Foto FrutiMenu móvil (huérfano de BELLA-3): en fru-brand.css.liquid,
   `@media (max-width:768.98px){ .media-with-text__media img { aspect-ratio:4/3;
   max-height:280px; object-fit:cover } }` scoped para no romper otras media-with-text
   (verifica la sección "Más de 7 años" tras aplicar).

Verificación: theme check 0 nuevos; theme dev; en colección + ficha + carrito: el número de
cantidad se LEE (getComputedStyle color ≠ blanco), targets medidos ≥44px, click en "+"
agrega de verdad (fetch /cart.js item_count sube), 0 regresiones en el swap de imagen por
variante (FRUTI3-16) ni en tarjetas circulares de /collections. Screenshots.
Cierre: commits (1: fixes qty+targets, 2: quick-add compacto, 3: formato+viñetas) + pull
--rebase + push + prod + §3/§6 + Tion + "Lo que tienes que hacer tú" (G-9 si quiere $/kg
masivo: poblar unit price, se explica en 3 pasos).
```

### PROMPT BELLA-7 — Recompra y búsqueda (Sonnet)

```
Sesión BELLA-7 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui. Lee §2 (D-8) y §6. Tus archivos: nueva sections/fru-reorder-band.liquid,
templates/index.json (SOLO insertar esa sección), snippets/predictive-search-tab-panel.liquid,
templates/collection.json, snippets/cart-drawer.liquid (SOLO el estado vacío) + admin de
Shopify por navegador (metafields).
El dato: 52% de clientes habituales sin camino de recompra a la vista. La lógica YA existe:
sections/main-account.liquid:24-31 y 138-171 arma reorder_path con cart permalink
(routes.cart_url/{variant:qty}?utm_medium=reorder) — REÚSALA, no inventes /cart/add en lote.

Tareas:
1. Nueva sección fru-reorder-band.liquid: banda de 1 línea gateada {% if customer %} sobre
   las pastillas de público: "Hola {{ first_name }} — repite tu última caja → " con el
   permalink de main-account (mismo cálculo de variantes disponibles). Si no hay pedidos,
   no renderiza nada. Estilo: hairline, fondo blanco, tinta morada, 56-64px.
   Insértala en templates/index.json entre fru_hero y audience_doors.
2. Drawer vacío: en el estado empty del cart-drawer, para {% if customer %} con pedidos,
   agrega el link "Volver a pedir lo de la última vez →" (mismo permalink). NADA MÁS del
   drawer (BELLA-5 ya lo tocó: pull --rebase y no pises).
3. Búsqueda sin B2B (D-8): via admin por navegador marca seo.hidden=1 en los productos de
   formato 5/20 kg (la página de productos del admin SÍ es automatizable; usa el bulk
   editor o metafields). ANTES verifica que ningún flujo web B2B dependa del search del
   storefront (el cotizador usa cotizador-api propia; /collections/por-mayor NO usa search).
   Si son >40 productos, hazlo por Matrixify/CSV y déjalo listo como gate express.
4. Quick-add en resultados de búsqueda: en snippets/predictive-search-tab-panel.liquid
   (los resultados llegan por Section Rendering API — por eso va ahí, no en la sección)
   renderiza el mismo quick-add de product-card para las sugerencias de producto. Si el
   markup del panel no da el ancho, al menos precio + link directo limpio.
5. templates/collection.json: products_per_page 36 → 50 (Verduras queda en 2 páginas).

Verificación: theme check 0 nuevos; theme dev; con un cliente de prueba logueado (o
simulando customer en el preview del tema) la banda aparece y el permalink arma el carro;
sin login NO aparece nada; búsqueda "palta" ya no sugiere formatos de $79.990+ (python3
sobre el JSON/HTML de la Section Rendering API en prod); /collections/verduras-frescas
pagina a 50. curl UA Chrome a la home: la banda NO sale en el HTML anónimo.
Cierre: commits (1: reorder band+drawer vacío, 2: búsqueda+colección) + pull --rebase +
push + prod + §3/§6 + Tion + "Lo que tienes que hacer tú".
```

### PROMPT BELLA-8 — Fotos y tiles premium (Sonnet)

```
Sesión BELLA-8 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md, repo del
tema (clon ~/Desktop/frutiferia-theme, main, repo-first, PUSH = DEPLOY). Activa: edu-sprints,
frutiferia-ux-ui, frutiferia-style. Lee §2 (D-10) y §6. Tus archivos:
assets/fru-category-tiles.css, sections/fru-category-tiles.liquid + admin de colecciones
por navegador (precedente G-8 del plan WUX: SÍ es automatizable).

Tareas:
1. Tiles con presencia (escritorio): fotos a aspect-ratio 4:3 (o altura 280-320px en la
   fila de 3), título 24-26px. En MÓVIL déjalos compactos (el primer producto ya cumple
   meta de scroll: no la rompas — verifica el top del primer tile tras el cambio).
2. Subtítulo por tile: usa el setting eyebrow que YA existe en el schema (hoy sin uso) o
   agrega `subtitle`: texto concreto por categoría ("Palta, plátano, frutilla y más" /
   "Todo para tu semana" / etc.), reemplaza al contador "N productos" cuando esté lleno.
3. Peso de las fotos: descarga las 6 imágenes de colección actuales, re-exporta a máx
   1200px de ancho JPEG q78-82 SIN grano (el grano infla Petit_Bouche y Verdura de 95KB),
   y resúbelas en Admin → Colecciones. ⚠️ Trampa conocida: Shopify CONSERVA el nombre de
   archivo viejo y solo cambia el ?v= — verifica por ?v= o por bytes, nunca por nombre
   (f/shopify_imagen_coleccion_conserva_nombre). Meta: −250KB móvil en la sección.
4. Curaduría (D-10): hoy 3 de 6 tiles usan el MISMO flatlay arcoíris. Elige del banco de
   imágenes de marca 6 sujetos DISTINTOS (frutillas / hojas verdes / frascos despensa /
   frutos secos / canasta FrutiPack real si existe (G-2b) / oferta), misma luz y fondo,
   sin datos de clientes legibles (f/banco_fotos_datos_clientes_legibles,
   f/banco_categoria_07_no_es_oficina). Súbelas por el admin de colecciones.
5. Packshots de Ofertas: identifica los productos cuya foto trae caja gris horneada
   (limón, cebolla y ~3 más); si puedes re-editarlas rápido (fondo blanco puro), hazlo y
   súbelas por admin de productos; si no, deja la lista exacta como gate G-2c y activa
   mientras tanto blend_product_images con blend_bg_color #ffffff — PERO ese setting vive
   en config/settings_data.json que es archivo de BELLA-1: hazlo en un commit separado,
   con pull --rebase, tocando SOLO esa clave.

Verificación: theme check 0 nuevos; curl UA Chrome + python3: extrae las URLs de los 6
tiles y mide Content-Length total antes/después (meta −250KB); screenshot desktop de la
sección (fotos 4:3, títulos 24-26px, 6 sujetos distintos); top del primer tile móvil ≤
750px sigue OK.
Cierre: commits + pull --rebase + push + prod + §3/§6 + Tion + "Lo que tienes que hacer tú"
(G-2: foto hero de la operación real + FrutiPack real + reemplazo de la foto de globos de
"Más de 7 años" — brief de 3 fotos en fácil, 1 hora de celular bien usada).
```

### PROMPT BELLA-9 — Admin, SEO y apps (Sonnet)

```
Sesión BELLA-9 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md.
SIN CÓDIGO: todo por el admin de Shopify con el navegador de Eduardo (Chrome MCP). El
Theme Editor NO es automatizable; las páginas de Configuración, Productos, Navegación y
Colecciones SÍ. Activa: edu-sprints, seo-fruti. Lee §2 (D-9) y §6.
⚠️ 21 redirects 301 se borraron una vez por un import (p/seo_catalogo_shopify_2026_07):
NO toques redirecciones ni imports masivos sin respaldo previo.

Tareas:
1. SEO de la home: Tienda online → Preferencias (o página de inicio → SEO): título
   "Frutas y verduras a domicilio en Viña del Mar | Frutiferia" (58c) y descripción
   "Fruta y verdura elegida a mano, a tu puerta el miércoles y el sábado en Viña del Mar,
   Valparaíso, Concón, Reñaca y Quilpué. 15% OFF en tu primera compra." (152c).
2. Nombre de la tienda: Configuración → Detalles: "Frutiferia" (sin SPA — la razón social
   sigue en facturación). Esto mata el "– Frutiferia SPA" duplicado del título de pestaña.
   ⚠️ Si el nombre alimenta boletas/correos revisa antes dónde se muestra; si hay duda,
   déjalo y anótalo como gate.
3. product_type es-CL: renombra "Aguacates"→"Paltas", "Patatas"→"Papas", "Calabazas y
   calabacines"→"Zapallos y zapallitos", "Frutas del bosque"→"Berries", fusiona
   "Manteca/Mantecas de frutos secos"→"Mantequillas de frutos secos". ANTES revisa qué
   colecciones automáticas o filtros de Search & Discovery dependen de esos valores
   (Products → filtrar por tipo te da el conteo; si una colección automática usa el tipo,
   actualiza su regla EN EL MISMO momento).
4. Retiro en tienda (si Eduardo NO vetó D-5, la ficha ya no lo muestra; esto limpia el
   checkout): Configuración → Envío → Retiro: plazo "24 horas" o desactivar (G-7 decide).
5. Judge.me a dieta: en la app, desactiva widgets no usados (Q&A, medals, carousel) —
   jdgmSettings inline pesa 34KB en CADA página; pide a soporte la carga asíncrona del CSS.
6. VUELVE10 (D-9): deja CREADO EN BORRADOR el descuento (10%, un uso por cliente, 14 días
   desde emisión, solo clientes con ≥1 pedido) y el texto del correo post-compra listo
   para pegar — pero NO lo actives: G-4 es de Eduardo. (La creación de códigos por edge fn
   requiere scopes price_rules que la app no tiene: ver plan web 2026 §backlog.)
7. Smile: NO desinstales tú. Verifica en Apps si Smile está instalada y sin uso, y deja el
   paso exacto para Eduardo (G-5): Apps → Smile → Delete. Su script muerto pesa ~12KB/página.

Verificación: cada cambio verificado en el momento (curl UA Chrome del título/meta desc en
prod; python3 para contar; screenshot del admin tras cada paso). Los renombres de tipo:
re-consulta el buscador de la tienda y confirma que las colecciones automáticas siguen con
el mismo product count.
Cierre: sin commits (no hay código) + §3/§6 + Tion + "Lo que tienes que hacer tú" (G-4
activar VUELVE10 · G-5 desinstalar Smile · lo que haya quedado gateado).
```

### PROMPT BELLA-10 — QA integral + medición (Sonnet)

```
Sesión BELLA-10 del plan ~/Desktop/frutiferia-theme/docs/PLAN_WEB_BELLA_2026-08-27.md —
QA en producción, READ-ONLY (no edites repos, no pushees). Corre cuando BELLA-1..8 estén ✅.
Absorbe el QA WUX-7 del plan anterior (~/Desktop/frutiferia-theme/docs/PLAN_WEB_UX_2026-08-16.md):
lee su prompt §4 WUX-7 COMPLETO y ejecuta sus 12 puntos (rutas, tipografía, logo con los
DOS brillos, medidas, contraste con la trampa del degradado del botón, tarjetas circulares,
tuteo con python3, dirección/JSON-LD, footer, cross-links, PSI, consola) — con sus DOS
trampas: curl SIEMPRE con UA de Chrome (la home cachea por user-agent) y python3 en vez de
grep. Activa: edu-sprints.

Además, específico de BELLA:
1. Muro de verificación de los 10 sprints: para cada fila ✅ de §3 de este plan, reproduce
   su métrica (H1 ≥48/28px; drawer no se abre al agregar; "Pagar" nace activo con día
   preseleccionado; /cart móvil con barra sticky visible; cantidad legible; targets ≥44px;
   ficha sin duplicados y ~1.200px más corta; home sin emojis, "20.000" ×1, PRIMERA15 ×3;
   tiles 4:3 con 6 sujetos distintos y −250KB; búsqueda sin formatos B2B; banda reorder
   solo para clientes). Reporta el VALOR medido, no "ok".
2. Funnel de humo completo: home → tile → colección → agregar ×3 → drawer → carrito →
   botón Pagar (hasta la URL del checkout, sin comprar). Cuenta los gestos para una
   canasta de 3 y proyecta la de 10 (meta: ~14 para 10 ítems).
3. LÍNEA BASE NUEVA: Shopify Analytics 30 días (por el navegador de Eduardo:
   admin.shopify.com/store/frutiferia-spa/analytics — el rango se cambia con el date-picker,
   paciencia con los clics) → sesiones, conversión, %ATC, %checkout, ticket. Regístralo en
   §7 de este plan junto a la base pre-rediseño (2,39% conv · 9,36% ATC · 3,52% checkout ·
   $55.454, del §8 WUX) y la fecha. La comparación honesta llega +30 días: agenda en el
   cierre la re-medición (~27-sep) como candidata en Sami.
4. PSI móvil de la home (API de PageSpeed; si 429, Lighthouse local con Chrome headless):
   LCP/CLS + confirmación de que el preload del hero calza con el <picture> (una sola
   descarga del LCP en Network).
ENTREGA: tabla PASA/FALLA por ítem con valor medido, regresiones vs pendientes, fixes
priorizados con sprint/archivo. Actualiza §3/§6 de este plan Y marca WUX-7 como ✅
(absorbido) en el plan WUX. Cierre: Tion + "Lo que tienes que hacer tú" (los 5 minutos de
iPhone que valen oro + qué números mirar el 27-sep).
```

## 5. Pasos de Eduardo (gates humanos) — ordenados por impacto

| # | Paso | Tiempo | Por qué importa | Cuándo |
|---|---|---|---|---|
| G-1 | Leer §2 y vetar (las 4 preguntas batcheadas están al final del §2). | 5 min | Sin veto, se ejecuta el default — incluida D-2 que revierte una decisión tuya de julio. | Antes de BELLA-1. |
| G-2 | **Sesión de fotos de 1 hora** (celular bien usado o fotógrafo): (a) el mesón/cajas de la operación real con luz de mañana para el hero; (b) una canasta FrutiPack armada de verdad (G-8b del plan WUX, sigue abierto); (c) ustedes dos en el local con producto, sin globos, para "Más de 7 años". | 1 h | Es LA palanca de "hermosa": hoy 5 fotos de stock casi idénticas. Mientras tanto corre D-10 (banco de imágenes). | Esta semana si se puede. |
| G-3 | Confirmar que las 4 quotes de testimonios son de clientes reales con permiso (Carolina M., Rodrigo P., Macarena S., el jefe de cocina). Si alguna no, mandar 2-3 reales de WhatsApp. | 10 min | Prueba social no verificable es un pasivo; con nombre+comuna real convence. | Antes de BELLA-3. |
| G-4 | Activar VUELVE10 (BELLA-9 lo deja creado en borrador + correo listo). | 5 min | La retención se decide en la 2ª compra; hoy todo el incentivo está en la 1ª. | Tras BELLA-9. |
| G-5 | Desinstalar Smile (Apps → Smile → Delete) si BELLA-9 confirma que está sin uso. | 2 min | 12KB muertos en cada página. | Tras BELLA-9. |
| G-6 | QA en iPhone tras BELLA-2, BELLA-5 y BELLA-6: abrir frutiferia.com, agregar 3 productos desde la grilla, abrir carrito, llegar al checkout. 1 mensaje con lo raro. | 5 min ×3 | Lo que ningún preview headless ve. | Tras cada uno. |
| G-7 | Decidir si el retiro en tienda existe de verdad (pregunta 3 del §2). Si sí: corregir el plazo a 24h en Configuración → Envío → Retiro. | 2 min | "Listo en 2 a 4 días" al lado de "Agregar" espanta. | Cuando puedas. |
| G-9 | (Opcional, para "$/kg" en tarjetas) Poblar precio por unidad de medida en los productos kg — BELLA-6 deja la guía de 3 pasos. | 20 min | El comprador de feria compara por kilo; Jumbo lo muestra en cada tarjeta. | Cuando quieras. |

## 6. Registro

| Fecha | Sesión | Qué quedó | Commits |
|---|---|---|---|
| 2026-08-27 | Fable 5 (plan) | Auditoría en vivo multi-agente (14 agentes: 7 dimensiones × verificación adversarial; 72 hallazgos vivos, 1 refutado — "carrito sin días de reparto" era artefacto del carro vacío). Evidencia: screenshots full-page desktop/móvil de home/colección/ficha/carrito + HTML servido con UA Chrome + código del tema + 6 referentes fetcheados (crisp.nl, oddbox, gousto, misfits, goodeggs, jumbo.cl). Hallazgos mayores: H1 31px por rems base-16 en tema base-10; preload del hero desperdicia hasta 358KB del LCP; cantidad blanca sobre blanco en la ficha; "Pagar" nace deshabilitado; descripción duplicada en ficha; pestaña Reseñas vacía (app muerta); prueba social ×5; PRIMERA15 ×5 (decisión era 3); "Comparar" en tarjetas de fruta; recompra ya construida (main-account) pero invisible. Plan BELLA-1..10 escrito con prompts. Números de arranque (§8 WUX, 18-jul→17-ago): 2,39% conv · 9,36% ATC · 3,52% checkout · $55.454. Sin código. | (este doc) |

## 7. Línea base y medición (la llena BELLA-10)

| Métrica | Pre-rediseño (18-jul→17-ago, §8 WUX) | Al cerrar BELLA (fecha) | +30 días |
|---|---|---|---|
| Conversión tienda online 30d | 2,39% | | |
| % sesiones con agregar al carro | 9,36% | | |
| % sesiones que llegan a checkout | 3,52% | | |
| Ticket promedio | $55.454 | | |
| Gestos para canasta de 10 (medido) | ~28-30 | | meta ~14 |
| H1 hero escritorio / móvil | 31px / 22,5px | | |
| Peso LCP móvil (preload+imagen) | hasta 358KB (doble descarga) | | |
