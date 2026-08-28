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
| D-2 | **Pastilla líder del selector de público** | ✅ **RESUELTA por Eduardo (2026-08-27): se destaca la de HOGARES** — `door_hogares lead:true` (sólida, color de canal B2C con contraste AA verificado), negocios y equipo hairline con tinta de canal. | — | "Destaquemos algo para los clientes domiciliarios" (Eduardo). La B2B sólida se robaba el foco de la home B2C. |
| D-3 | **Copy del hero** | ✅ **RESUELTA: copy textual de Eduardo (2026-08-27)** — H1 **"Fruta y verdura seleccionada que llega directamente a tu hogar"** (partido como heading "Fruta y verdura seleccionada" + highlight morado "que llega directamente a tu hogar") · debajo, en chico: "Repartos a domicilio miércoles y sábados" · el sub conserva zonas y despacho: "Viña, Valparaíso, Concón, Reñaca y Quilpué · Despacho gratis sobre $50.000". | — | Es su frase; corrige la promesa on-demand y dice el diferencial (seleccionada). |
| D-4 | **Banda B2B** | Se re-viste: fondo lila `--fru-morado-050`, morado como TINTA (titular grande), riel índigo de canal, misma altura ~200-250px | Dejar el bloque morado sólido | Canon escrito en el propio repo: morado en tipografía/líneas/pastillas, NO fondos grandes. |
| D-5 | **Retiro en tienda en la ficha** | ✅ **RESUELTA: el retiro SÍ existe** (Eduardo 2026-08-27): miércoles y sábado 10:00–15:00, pidiendo hasta las 22:00 del día anterior. NO se apaga: el plazo del admin pasa a "24 horas" (BELLA-9) y la ficha muestra el horario real (BELLA-4). | — | "2 a 4 días" al lado de "Agregar" contradecía la frescura; el dato real es mejor argumento de venta. |
| D-6 | **Botón "Vaciar carrito"** | OFF (drawer y página) | Degradarlo a link de texto chico | Acción destructiva a ancho completo pegada a "Pagar". |
| D-7 | **Buscador móvil** | Se queda visible pero limpio: fuera el selector "Tod…" y el micrófono (CSS <600px); input de borde a borde | `minimise_search_mobile: true` (header ~64px, lupa expande) | 3 controles apretados roban ~114px al input; los tiles ya cumplen el rol del selector de tipo. |
| D-8 | **Formatos B2B en la búsqueda** | Ocultar 5/20 kg del storefront search con metafield `seo.hidden=1` (verificando antes que ningún flujo web B2B dependa de esa búsqueda — el cotizador usa su propia API) | Dejarlos | "palta" sugiere formatos de $79.990-$109.990 entre 6 resultados B2C. |
| D-9 | **Cupón de 2ª compra** | ✅ **APROBADA por Eduardo (2026-08-27)**: VUELVE10 (10%, 14 días) post-compra vía correo de confirmación — BELLA-9 lo crea y lo deja ACTIVO. | — | Todo el incentivo estaba en la 1ª compra; el hábito se decide en la 2ª-4ª (patrón Gousto). Conecta con p/checkout_gracias_extension. |
| D-10 | **Fotos nuevas** | ✅ Confirmada por Eduardo (2026-08-27): "tengo hartas en el banco de imágenes" — Claude elige del banco la mejor candidata editorial (UN sujeto, aire, luz natural) y baja el overlay a 0-10. Las fotos propias (G-2) las hará él, sin fecha. | — | No bloquear el sprint por fotos; la foto real se cambia en 2 min por admin. Bonus: la reseña de Paula Arismendi (§8) trae una foto REAL de una caja entregada. |
| D-11 | **Fondo de ambiente** | `color_scheme_1_bg` → lila pálido `#F4F0F7` (una línea). El scheme 2 (banda morada) y 3 NO se tocan sin auditar qué otras plantillas los usan | Crema cálido | La alternancia blanco/lila tiñe la home de marca sin agregar un solo elemento — la mejor razón belleza/esfuerzo de la lista. |
| D-12 | **Prueba social** | UNA tira (la del footer-group, reescrita con el diferencial real) + la sección "Más de 7 años" como único momento de historia. Fuera el ticker y la tira mid-page. Sin ratings inventados: estrellas solo cuando salgan de Judge.me | Dejar las 5 repeticiones | "20.000 pedidos / 7 años" ×5 pierde fuerza; lo que convence (elegido a mano, garantía de reposición, WhatsApp con personas) hoy solo se dice en el carrito. |

**✅ Las 4 preguntas fueron respondidas por Eduardo el 2026-08-27 (G-1 cerrado):**
1) se destaca la pastilla de HOGARES · 2) el copy del hero es el suyo (ver D-3) · 3) el
retiro existe: mié y sáb 10:00–15:00, pedido hasta las 22:00 del día anterior · 4) VUELVE10
aprobado. Las respuestas ya están integradas en D-2, D-3, D-5 y D-9 y en los prompts.

## 3. Sprints

Secuenciales (un sprint = una sesión = un cierre — f/encadenar_sprints_apaga_la_verificacion).
Cada sprint es dueño EXCLUSIVO de sus archivos. PUSH = DEPLOY EN VIVO.

| Sprint | Modelo | Qué hace | Archivos que TOCA | Estado |
|---|---|---|---|---|
| **BELLA-1** Interruptores de conversión | Sonnet | Todos los cambios de `config/settings_data.json` en un solo commit: `after_add_to_cart` (D-1), `enable_compare:false`, `color_scheme_1_bg` (D-11), `input_button_border_width:1`, colores de badge de oferta a canon, `predictive_search_show_vendor:false` | `config/settings_data.json` | ✅ 2026-08-27 `4aa1a5a` (rama `orq/bella-1`, sin fusionar a main) |
| **BELLA-2** Hero editorial | Opus | Escala tipográfica en px (H1 48/34), preload responsivo del LCP, copy D-3, micro-línea de prueba social, CTA por tipo de cliente, foto móvil tratada, overlay 0-10 | `sections/fru-hero.liquid`, `templates/index.json` (solo settings de `fru_hero`) | ✅ 2026-08-27 `8fdcb2d` + `b6feac9` (rama `orq/bella-2`, sin fusionar a main) · foto del banco pendiente en G-2b |
| **BELLA-3** Home sin ruido y con marca | Opus | Fuera ticker + tira mid-page (D-12), footer-tira con diferenciales, pastilla Hogares destacada (D-2), banda B2B re-vestida (D-4), emojis fuera, bullets FrutiMenu, testimonios reales de Google (§8) en grid, barra superior sin 🚚 y sin truncar | `templates/index.json` (secciones no-hero), `sections/footer-group.json`, `sections/free-shipping-bar.liquid`, `assets/free-shipping-bar.css`, `sections/testimonials.liquid`, `sections/audience-doors.liquid` | ✅ 2026-08-27 `052f6bd` + `ed458ae` + `8aa0607` (rama `orq/bella-3`, sin fusionar a main) |
| **BELLA-4** Ficha limpia | Sonnet | Borrar duplicados de `templates/product.json` (descripción ×2, aviso B2B ×2, estrellas ×2, msg_envio), matar pestaña Reseñas vacía y subir Judge.me, horario real de retiro (D-5), trust-bar apilada en móvil, breadcrumb con categoría | `templates/product.json`, `snippets/breadcrumbs.liquid` | ✅ 2026-08-27 `3dd7a4c` + `01422dd` (rama `orq/bella-4`, sin fusionar a main) |
| **BELLA-5** Carrito y drawer que no estorban | Opus | Picker con día preseleccionado ("Pagar" nace activo), resumen del drawer abajo, pitch de cuenta después de Pagar, vaciar-carrito off (D-6), calculadora off, promoted solo carro vacío, sticky "Ir a pagar" en /cart móvil, FAB WhatsApp clear-dock en cart, línea "Pide antes del X → llega el Y" | `assets/delivery-picker.js`, `snippets/delivery-picker.liquid`, `snippets/cart-drawer.liquid`, `sections/overlay-group.json`, `sections/main-cart.liquid`, `snippets/fru-whatsapp.liquid`, `assets/fru-whatsapp.css` (+ `assets/delivery-picker.css`, nuevo `assets/fru-cart-bar.css`) | ✅ 2026-08-27 `e106734` + `7d89eb4` + `b416642` (rama `orq/bella-5`, sin fusionar a main) |
| **BELLA-6** Tarjeta de feria | Opus | Cantidad visible (fix rgb), tap targets ≥44px, quick-add compacto ("+" que expande al stepper), ids únicos de cantidad, viñetas check por CSS, formato/`$ x kg` en tarjeta donde el dato exista | `snippets/product-card.liquid`, `assets/quick-add.css`, `assets/fru-brand.css.liquid`, `snippets/quantity-input.liquid` | ✅ 2026-08-27 `6eada2b` + `e69059f` + `aa3875d` (rama `orq/bella-6`, sin fusionar a main) |
| **BELLA-7** Recompra y búsqueda | Sonnet | Banda "Repite tu última caja" en home para clientes, reorder en drawer vacío y menú, búsqueda sin formatos B2B (D-8), quick-add en resultados, Verduras a 50/página | `sections/` (nueva `fru-reorder-band.liquid`), `templates/index.json` (solo esa sección), `snippets/predictive-search-tab-panel.liquid`, `templates/collection.json`, admin (metafields seo.hidden) | ⏳ 2026-08-27 `6b3b3ef` + `1d9f498` (rama `orq/bella-7`, sin fusionar a main) — falta G-10 (admin: marcar 28 productos) |
| **BELLA-8** Fotos y tiles premium | Sonnet | Tiles con altura real (4:3 escritorio) y títulos 24-26px, re-export de las 6 fotos de colección (≤1200px, q80, −250KB móvil), curaduría: 6 sujetos DISTINTOS del banco, packshots normalizados, subtítulo por tile | `assets/fru-category-tiles.css`, `sections/fru-category-tiles.liquid`, `templates/index.json` (solo los blocks de `fru_category_tiles`), admin de colecciones (fotos, trampa `?v=`) | ⏳ 2026-08-28 `b089288` (rama `orq/bella-8`, sin fusionar a main) — código listo; fotos re-exportadas listas, curaduría con candidatas del banco; falta G-2d (subirlas por Admin, es de Eduardo) |
| **BELLA-9** Admin, SEO y apps | Sonnet | Título "Frutiferia" sin duplicar + meta desc 152c, product_type es-CL (Paltas/Papas/…), retiro a "24 horas" con horario real (D-5), Judge.me a dieta, VUELVE10 creado y ACTIVO (aprobado), guía desinstalar Smile (G-5) | Admin de Shopify vía navegador (nada del repo) | 🔴 2026-08-28 — bloqueado: esta sesión NO tuvo el Chrome de Eduardo (herramienta ausente/denegada), y las 7 tareas son 100% admin de Shopify. Verificación pública hecha y specs listos — ver G-12/G-13 en §5 y Registro §6. |
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
3. Copy D-3 (textual de Eduardo, no lo "mejores") en templates/index.json (settings de
   fru_hero): heading "Fruta y verdura seleccionada" + heading_highlight "que llega
   directamente a tu hogar"; debajo del H1, EN CHICO, la línea "Repartos a domicilio
   miércoles y sábados"; el subheading conserva zonas + despacho ("Viña, Valparaíso,
   Concón, Reñaca y Quilpué · Despacho gratis sobre $50.000"). `overlay_opacity` 45 → 10;
   baja también el default del schema (45 → 10).
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
3. Pastillas (D-2, resuelta: la destacada es HOGARES): en templates/index.json pon
   lead:true en door_hogares y lead:false en door_negocios. La sólida es "Para mi casa"
   con el color de canal B2C — CALCULA el contraste AA del texto sobre ese relleno; si el
   token B2C no pasa 4,5:1 con blanco, usa el ink oscuro del canal como fondo. Negocios y
   equipo quedan hairline + tinta de canal. En <400px labels cortos "Mi casa / Mi negocio /
   Mi equipo" o font 13px, min-height 64px se mantiene.
4. Banda B2B (D-4): re-vestir b2b_band SIN borrarla — color_scheme al esquema claro, fondo
   lila --fru-morado-050, titular grande con tinta morada, riel/CTA índigo de canal. La
   quote del "Jefe de cocina" de testimonios se MUEVE aquí (habla al público correcto).
5. Testimonios (G-3 resuelto: reseñas REALES de Google, transcritas en §8 de este plan):
   grid de 3 simultáneas en escritorio (apiladas en móvil), cada una con inicial en círculo
   (fondo #F4EFE9), nombre + "Reseña de Google" + ★★★★★ (sin fecha en el sitio). Usa las 3
   marcadas TOP en §8 y deja el resto en la rotación; la quote del "Jefe de cocina" se va a
   la banda B2B. Los textos van VERBATIM — no retoques palabras de clientas. Cierra la
   sección con el link "Lee nuestras reseñas en Google →" (ficha de Google de Frutiferia).
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
6. Retiro (D-5 resuelta — el retiro SÍ existe): show_pickup_availability se QUEDA en true.
   Agrega junto al bloque de despacho una línea con el horario real (sección custom-liquid,
   NO richtext): "Retiro gratis en tienda: miércoles y sábado de 10:00 a 15:00 — pide hasta
   las 22:00 del día anterior." (El plazo genérico "2 a 4 días" lo corrige BELLA-9 en admin.)
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
   CLT ya es "mañana" en UTC). Dato de negocio (Eduardo 2026-08-27): el corte real es
   22:00 del día anterior — si la API dice otra cosa, manda la API y reporta la diferencia.
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
   (verifica la sección "Más de 7 años" tras aplicar). CONFIRMADO por BELLA-3: el schema
   de `media-with-text` solo tiene `image_fit`, `media_width` y `media_scale`, y los tres
   dicen "on large screens" — no hay setting de móvil, así que esto SÍ es regla CSS.
8. Banda B2B, lo que faltó de D-4 (huérfano de BELLA-3): BELLA-3 dejó el fondo lila
   (`color_scheme` 2 → 1, cuyo bg #F4F0F7 ES `--fru-morado-050`) y el titular en h1, pero
   la TINTA morada del titular y el riel/CTA índigo de canal no se pueden poner desde
   `templates/index.json`: `sections/rich-text.liquid` no expone ningún setting de color de
   titular ni de riel. Va por CSS scoped a `#shopify-section-…b2b_band` en
   fru-brand.css.liquid: titular en `--fru-morado-900`, riel/borde superior y botón
   secundario en `--pill-b2b-ink` #1616A2. Contrastes ya calculados sobre el lila #F4F0F7:
   morado 11,61:1 · índigo 11,17:1 — ambos AAA, no hay que recalcular.

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
4. Retiro en tienda (D-5 resuelta: existe — mié y sáb 10:00–15:00, corte 22:00 del día
   anterior): Configuración → Envío → Retiro: plazo esperado "24 horas" (la opción más
   cercana al corte real) y, si hay campo de instrucciones de retiro, pega el horario
   textual. Verifica cómo queda el copy en la ficha y en el checkout.
5. Judge.me a dieta: en la app, desactiva widgets no usados (Q&A, medals, carousel) —
   jdgmSettings inline pesa 34KB en CADA página; pide a soporte la carga asíncrona del CSS.
6. VUELVE10 (D-9 APROBADA por Eduardo el 2026-08-27): crea el descuento (10%, un uso por
   cliente, 14 días, solo clientes con ≥1 pedido) y DÉJALO ACTIVO. Prepara el texto del
   correo post-compra listo para pegar y muéstraselo a Eduardo en el cierre. (La creación
   de códigos por edge fn requiere scopes price_rules que la app no tiene: ver plan web
   2026 §backlog.)
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
| ~~G-1~~ | ~~Leer §2 y vetar~~ **✅ RESPONDIDO por Eduardo el 2026-08-27** — las 4 respuestas están integradas en D-2, D-3, D-5 y D-9 y en los prompts. | — | — | ✅ |
| G-2 | **Sesión de fotos de 1 hora** (celular bien usado o fotógrafo): (a) el mesón/cajas de la operación real con luz de mañana para el hero; (b) una canasta FrutiPack armada de verdad (G-8b del plan WUX, sigue abierto); (c) ustedes dos en el local con producto, sin globos, para "Más de 7 años". Eduardo (2026-08-27): *"lo haré a mano por mientras"* — mientras tanto corre D-10 (banco de imágenes) y la foto real de la reseña de Paula Arismendi (§8) sirve de puente. | 1 h | Es LA palanca de "hermosa": hoy 5 fotos de stock casi idénticas. | Cuando pueda. |
| ~~G-3~~ | ~~Confirmar testimonios~~ **✅ RESUELTO (2026-08-27): son reales, y Eduardo entregó 8 reseñas de Google** — transcritas VERBATIM en §8 para BELLA-3. | — | — | ✅ |
| ~~G-4~~ | ~~Activar VUELVE10~~ **✅ APROBADO de antemano (2026-08-27)** — BELLA-9 lo crea y lo deja ACTIVO; Eduardo solo revisa el correo post-compra en el cierre de ese sprint. | — | — | ✅ |
| G-5 | Desinstalar Smile (Apps → Smile → Delete) si BELLA-9 confirma que está sin uso. | 2 min | 12KB muertos en cada página. | Tras BELLA-9. |
| G-6 | QA en iPhone tras BELLA-2, BELLA-5 y BELLA-6: abrir frutiferia.com, agregar 3 productos desde la grilla, abrir carrito, llegar al checkout. 1 mensaje con lo raro. | 5 min ×3 | Lo que ningún preview headless ve. | Tras cada uno. |
| ~~G-7~~ | ~~Decidir si el retiro existe~~ **✅ RESPONDIDO (2026-08-27): existe — mié y sáb 10:00–15:00, pedido hasta las 22:00 del día anterior.** El plazo del admin lo corrige BELLA-9. | — | — | ✅ |
| G-2b | **Subir la foto del hero desde el banco** (2 min, Admin → Contenido → Archivos → Cargar, y luego Personalizar → Hero editorial → Imagen escritorio/móvil). Candidatas ya elegidas del banco, carpeta `Banco de imágenes/Fotos Frutiferia/03-cajas-y-pedidos/`: **`sesion-canasta-luz-natural.jpg`** (o `-02` / `-08`) para escritorio y `sesion-2026-canasta-reparto-02.jpg` recortada vertical para móvil. **NO uses las `caja-armada-con-boleta-*.jpg`**: traen la hoja de pedido con datos del cliente legibles. | 2 min | El overlay ya está en 10%: la foto se ve tal cual, así que la foto ES el hero. | Cuando quieras; no bloquea nada. |
| **G-11** | **Publicar los sprints en producción (merge de las ramas `orq/bella-1..7` a `main`).** Ninguno está en vivo: los siete quedaron en su rama por instrucción del cierre de sprint, así que frutiferia.com sigue mostrando la web vieja. Nada de BELLA-1..7 se puede probar en el teléfono hasta que esto pase, y G-6 depende de ello. Es de él porque PUSH = DEPLOY EN VIVO: lo ven todos los clientes en el momento en que ocurre. | 5 min | Sin esto, 7 sprints de trabajo no le mueven ni una venta. | Ahora. |
| **G-10** | **D-8 — Ocultar los formatos B2B (5/20 kg) de la búsqueda del sitio.** El tema ya SABE ocultar estos productos de la búsqueda (BELLA-7 lo dejó leyendo el metafield), pero falta marcarlos: solo tú puedes entrar al admin. **3 pasos:** (1) Admin → Productos, busca cada uno de los 28 handles de abajo (o pégalos en el buscador del admin uno por uno — son pocos, no hace falta CSV); (2) en cada producto → sección **Metafields** al fondo de la página → si no existe aún la definición, créala UNA vez en *Configuración → Datos personalizados → Productos → Agregar definición*: namespace `seo`, key `hidden`, tipo **Verdadero o falso (boolean)**; (3) en cada uno de los 28, marca ese campo en `true` y Guardar. Los 28 (título \| handle): Ají Verde (5 kg)\|aji-verde-5kg · Cebolla (5 kg)\|cebolla-5-kg · Cebolla Morada (5 kg)\|cebolla-morada-5-kg · Champiñón (5 kg)\|champinon-kg-copia · Kiwi (5 kg)\|kiwi-por-mayor · Limón (5 kg)\|limon-5-kg · Limón Sutil (20 kg)\|limon-sutil-20-kg · Limón Sutil (5 kg)\|limon-sutil · Limón de Pica (5 kg)\|limon-de-pica · Mandarina (5 kg)\|mandarina · Manzana Roja (5 kg)\|manzana-roja · Manzana Verde (5 kg)\|manzana-verde-5-kg · Maracuyá (5 kg)\|maracuya-5-kg · Naranja (5 kg)\|naranja-1 · Palta Hass Chilena (20 kg)\|palta-hass-chilena-20-kg · Palta Hass Chilena (5 kg)\|palta-hass-chilena-por-mayor · Palta Hass Importada (20 kg)\|palta-hass-importada-20-kg · Palta Hass Importada (5 kg)\|palta-hass-peruana · Papa Camote (5 kg)\|papa-camote · Pera (5 kg)\|pera-1 · Plátano (20 kg)\|platano-20-kg · Plátano (5 kg)\|platano · Pomelo (5 kg)\|pomelo-5-kg · Tomate (5 kg)\|tomate-5-kg · Tomate Cherry (5 kg)\|tomate-cherry-1 · Zanahoria (20 kg)\|zanahoria-por-mayor · Zanahoria (5 kg)\|zanahoria-5-kg · Zapallo Camote (5 kg)\|zapallo-1. Lista sacada de `/products.json` de producción (355 productos recorridos con paginación), no inventada. | 20-25 min | Sin esto "palta" en la búsqueda del sitio sigue sugiriendo cajas de $79.990-$109.990 a un cliente que solo quiere 1 kg. | Cuando quieras; no bloquea nada más. |
| G-9 | (Opcional, para "$/kg" en tarjetas) **Poblar el precio por unidad de medida.** BELLA-6 dejó la maquinaria lista: `snippets/price.liquid` ya imprime el `$X x kg` en cada tarjeta y ficha, y lo deja oculto donde el dato no exista — así que esto se enciende producto por producto, sin tocar código. **3 pasos, en el admin:** (1) Productos → abre uno que se venda por kilo → en **Precios**, marca *Mostrar precio por unidad*; (2) escribe **Cantidad total = 1** y **Unidad = kg** (para una malla de 5 kg: cantidad 5, unidad kg); (3) Guardar y recargar `/collections/frutas-deliciosas` — bajo el precio aparece "$X x kg". Para hacerlo en masa: Productos → seleccionar varios → Exportar CSV, llenar las columnas `Variant Unit Price Measurement` y volver a importar. | 20 min | El comprador de feria compara por kilo; Jumbo lo muestra en cada tarjeta. | Cuando quieras. |
| **G-2c** | **Subir las 6 fotos de colección BELLA-8 re-exportadas (mismo sujeto, menos peso).** Ya están re-exportadas a ≤1200px de ancho, JPEG q78-80, con el grano de Verduras y Snacks suavizado — quedaron con el MISMO nombre de archivo que la foto actual (Shopify conserva el nombre y solo cambia `?v=`, así que verifica el cambio por bytes o por `?v=`, nunca por nombre). Carpeta local: `tiles-optimized/` de esta sesión (`FrutasWeb.jpg` 152KB, antes 253KB · `Verdura-1Web.jpg` 200KB, antes 391KB · `Chef-1Web.jpg` 86KB, antes 83KB — esta casi no bajó, ya venía bien comprimida · `Petit_BoucheWeb.jpg` 195KB, antes 355KB · `FrutiPackWeb.jpg` 274KB, antes 494KB · `72418.jpg` 156KB, antes 393KB). Proyección de peso servido a 375px (lo que baja el celular): de 355KB a 190KB, **−165KB** — no llega a la meta de −250KB del plan porque esa meta asumía TAMBIÉN cambiar de foto en Verduras/FrutiPack/Ofertas (ver G-2d): recomprimir la MISMA foto de flatlay recargado tiene un techo. **Pasos:** Admin → Productos → Colecciones → abre cada una de las 6 → Imagen → Cambiar → sube el archivo con el mismo nombre. Es mecánico (ya está decidido y probado); solo hace falta tu sesión del admin para subir el archivo. | 10 min | La sección de tiles sigue pesando ~355KB en el celular en vez de ~190KB si no se hace — nada se rompe, solo no baja de peso. | Cuando quieras. |
| **G-2d** | **Elegir y subir foto nueva para Verduras, FrutiPack y Ofertas — hoy comparten el mismo flatlay arcoíris recargado** (verificado con screenshot: los 3 tiles muestran la misma composición de pimentones/plátanos/cebolla morada/tomates). Cuál foto "se ve bien" y representa cada categoría es criterio de marca tuyo, no algo que se decida por código. Candidatas del banco de imágenes (Drive, carpeta `Banco de imágenes/Fotos Frutiferia/`), **sin confirmar visualmente por esta sesión** — ábrelas y juzga tú: Verduras → `sesion-canasta-luz-natural.jpg` (carpeta `06-hogar-y-cocina-casera`, https://drive.google.com/file/d/1dR7GJe6l7sKSEb64YbG2JZflibXzqHWu/view — ojo: la descripción dice "verduras" en general, no confirma que sea hoja verde específicamente) · Ofertas → `sesion-2026-canasta-reparto.jpg` (carpeta `08-feria-y-origen`, https://drive.google.com/file/d/1_BykHMz8vMCFMOupOKUFtVzDB6PFMgT8/view) · FrutiPack → **no existe ninguna foto de la canasta FrutiPack real en el banco** (se buscó por nombre en las 899 fotos indexadas y no aparece); la única alternativa es genérica, un cajón de madera con producto variado (`canasta-crate-productos.jpg`, https://drive.google.com/file/d/158ttRfE3UXoP5BE_-VGqKynz6bni8-XQ/view) — si prefieres, deja FrutiPack con su foto actual (re-exportada en G-2c) hasta tener una foto real de la canasta (conecta con G-2 del §5, la sesión de fotos propias). Si alguna no te convence al abrirla, cualquier foto de un solo sujeto con luz natural y sin gente sirve — el criterio está en la tarea 4 del prompt de BELLA-8. | 15 min | Si no se hace, Verduras/FrutiPack/Ofertas se siguen viendo como el mismo flatlay repetido — no rompe nada, solo sigue sin resolver D-10. | Cuando quieras. |

| **G-12** | **BELLA-9, tareas 1-4 — SEO de la home, nombre de tienda, categorías es-CL y plazo de retiro.** Sin código, todo en Admin de Shopify. **(a) SEO home** — Tienda online → Preferencias: título `Frutas y verduras a domicilio en Viña del Mar \| Frutiferia` (58c, verificado) y descripción `Fruta y verdura elegida a mano, a tu puerta el miércoles y el sábado en Viña del Mar, Valparaíso, Concón, Reñaca y Quilpué. 15% OFF en tu primera compra.` (153c, no 152 — un carácter de diferencia con el plan, no importa). Hoy la home tiene título `Frutiferia – Delivery de Frutas y Verduras a Domicilio 🌿 – Frutiferia SPA` y la descripción genérica de siempre — verificado en vivo con curl. **(b) Nombre de tienda** — Configuración → Detalles: cambia a `Frutiferia` (sin SPA). Antes de guardar, revisa 1 boleta o correo de confirmación reciente para confirmar que el nombre no alimenta el PDF de la boleta (la razón social del SII es un campo aparte, normalmente no se pisa) — si tienes dudas, no lo cambies y avísanos. Esto mata el "– Frutiferia SPA" duplicado del título de pestaña, confirmado arriba. **(c) product_type es-CL** — Productos → filtra por Tipo de producto y renombra: `Aguacates`→`Paltas` (4 productos: las 4 Palta Hass) · `Patatas`→`Papas` (5: las Papa Sucia/Limpia) · `Calabazas y calabacines`→`Zapallos y zapallitos` (2: Zapallo Italiano 40u y 10u) · `Mantecas de frutos secos` y `Manteca de frutos secos` (9+1) → fusiona ambas en `Mantequillas de frutos secos`. **⚠️ NO renombres "Frutas del bosque"→"Berries" tal cual dice el plan**: revisamos los 12 productos de ese tipo y NINGUNO es un berry — son mandarina, kiwi, manzana (×4), maracuyá, pera, plátano (×2), piña y mango. Ya está mal usado como cajón de sastre "otras frutas"; ponerle "Berries" sería un error más visible, no una corrección. Decide tú: o lo dejas como está, o lo renombras a algo honesto como "Otras frutas", o reclasificas cada producto a su tipo real (fuera de alcance de este gate). Ninguna de las 29 colecciones públicas del sitio se llama como estos 6 tipos, así que el riesgo de romper una colección automática por nombre es bajo — pero el admin es la única forma de confirmar si alguna regla de colección o filtro de Search & Discovery usa el tipo viejo por dentro; revísalo al momento de renombrar (Productos → filtra por el tipo viejo → conteo antes y después de guardar debe coincidir). **(d) Retiro en tienda** — Configuración → Envío → Retiro: cambia el plazo esperado a "24 horas" (la opción más cercana al corte real de las 22:00 del día anterior) y, si hay un campo de instrucciones, pega "Retiro miércoles y sábado de 10:00 a 15:00 — pide hasta las 22:00 del día anterior." Revisa cómo queda el copy en una ficha y en el checkout de prueba. | 20-25 min | Es admin de Shopify con tu sesión — esta sesión no tuvo tu Chrome disponible (herramienta apagada), así que nadie más puede tocar estas pantallas por ti. | Sin este gate el título de pestaña sigue duplicado, la búsqueda del sitio sigue en español de traductor (Aguacates/Patatas) y el retiro en la ficha sigue prometiendo un plazo que no es el real — nada se rompe, pero tampoco mejora. |
| **G-13** | **BELLA-9, tareas 5-7 — Judge.me a dieta, VUELVE10 activo y verificar Smile.** **(e) Judge.me** — verificado en una ficha real (`/products/platanos`) que el bloque `jdgmSettings` pesa exactamente **34.062 bytes** (34KB, igual a lo que decía el plan) y se repite en cada página. Dentro de ese bloque, Preguntas y Respuestas ya está apagado (`enable_question_anwser: false`) y el carrusel destacado no está instalado (`review_carousel_install_preference: false`) — lo que SÍ se ve activo son las medallas en el pie de página (`medals_widget_position: footer_all_pages`, `widget_show_store_medals: true`). En la app Judge.me → Configuración de widgets: apaga "Store medals" / "Product medals" si no las quieres, y de todos modos abre un ticket a soporte de Judge.me pidiendo carga asíncrona del CSS/JS (el bloque de configuración pesa lo mismo esté lo que esté prendido o apagado — es cómo Judge.me arma el script, no algo que se arregle solo apagando casillas). **(f) VUELVE10** — crea el descuento en Descuentos → Crear descuento: código `VUELVE10`, 10% de descuento, uso limitado a 1 por cliente, vigencia 14 días desde que se genera (o fecha fija si prefieres una ventana calendario), elegibilidad "Clientes específicos" con el segmento/tag de clientes con ≥1 pedido (o la condición equivalente que tenga el admin). Actívalo. Texto del correo post-compra, listo para pegar en el flujo de confirmación (Shopify Email o Klaviyo, donde lo tengas armado):<br><br>*Asunto:* Un 10% para tu próxima caja 🍓<br>*Cuerpo:* "Gracias por tu pedido — esperamos que la fruta y la verdura lleguen tan frescas como siempre. Para tu próxima compra, tienes un 10% de descuento con el código **VUELVE10** (válido por 14 días, una vez por cliente). Solo agrégalo en el pago. Nos vemos el miércoles o el sábado que quieras pedir de nuevo."<br><br>(No lo mandes por correo desde aquí — esta sesión no envía correos; solo queda el texto listo.) **(g) Smile** — confirmado en el HTML de producción que Smile SIGUE cargando su script (`js.smile.io/v1/smile-shopify.js?shop=frutiferia-spa.myshopify.com`) en cada página — está instalada y activa, no solo instalada. Antes de borrarla, entra a Apps → Smile y mira si el programa de puntos/referidos tiene actividad real (clientes con puntos acumulados, canjes) en el dashboard de la app; si está realmente sin uso, bórrala con Apps → Smile → Delete. Si tiene actividad, no la borres y dínoslo — cambia el plan. | 25-30 min | Crear/activar un descuento real y borrar una app son acciones que solo se hacen con tu sesión del admin — no es código, es tu tienda en vivo. | Sin este gate el correo VUELVE10 nunca sale (D-9 aprobada por ti sigue sin efecto real), Judge.me sigue pesando 34KB por página, y Smile sigue sumando ~12KB muertos si de verdad no se usa. |

## 6. Registro

| Fecha | Sesión | Qué quedó | Commits |
|---|---|---|---|
| 2026-08-27 | Fable 5 (plan) | Auditoría en vivo multi-agente (14 agentes: 7 dimensiones × verificación adversarial; 72 hallazgos vivos, 1 refutado — "carrito sin días de reparto" era artefacto del carro vacío). Evidencia: screenshots full-page desktop/móvil de home/colección/ficha/carrito + HTML servido con UA Chrome + código del tema + 6 referentes fetcheados (crisp.nl, oddbox, gousto, misfits, goodeggs, jumbo.cl). Hallazgos mayores: H1 31px por rems base-16 en tema base-10; preload del hero desperdicia hasta 358KB del LCP; cantidad blanca sobre blanco en la ficha; "Pagar" nace deshabilitado; descripción duplicada en ficha; pestaña Reseñas vacía (app muerta); prueba social ×5; PRIMERA15 ×5 (decisión era 3); "Comparar" en tarjetas de fruta; recompra ya construida (main-account) pero invisible. Plan BELLA-1..10 escrito con prompts. Números de arranque (§8 WUX, 18-jul→17-ago): 2,39% conv · 9,36% ATC · 3,52% checkout · $55.454. Sin código. | (este doc) |
| 2026-08-27 | Eduardo (G-1) | **Respondió las 4 preguntas del §2:** (1) destacar la pastilla de HOGARES (D-2) · (2) copy del hero propio: "Fruta y verdura seleccionada que llega directamente a tu hogar" + en chico "repartos a domicilio miércoles y sábados" (D-3) · (3) el retiro EXISTE: mié y sáb 10:00–15:00, corte 22:00 del día anterior (D-5) · (4) VUELVE10 aprobado (D-9). Además: hará las fotos G-2 él mismo ("por mientras Ladeto hace cosas"), confirmó que los testimonios son reales y entregó 8 reseñas de Google — transcritas en §8 (la de Paula Arismendi trae una foto real de una caja entregada). G-1, G-3, G-4 y G-7 cerrados; D-2/D-3/D-5/D-9/D-10 resueltas; prompts BELLA-2/3/4/5/9 actualizados. | (este doc) |
| 2026-08-27 | BELLA-1 (Sonnet) | 8 interruptores de `config/settings_data.json` (solo `current`): drawer del carrito apagado (D-1), Comparar off, fondo scheme 1 a `#F4F0F7` (D-11), borde del input del newsletter visible, badge/ahorro/checkout al morado canon `#671D90`, vendor fuera de la búsqueda predictiva. Presets Canopy/Cedar/Willow verificados intactos. Rama `orq/bella-1` pusheada, NO fusionada a main — no hay deploy en vivo todavía; falta el merge para que se vea en producción. | `4aa1a5a` |
| 2026-08-27 | BELLA-2 (Opus) | Hero editorial. **Escala en px**: el tema define `html{font-size:62.5%}` (1rem=10px) y los rem de la sección estaban calibrados a 16px — H1 de 31px a **48px** en 1440 y de 22,5px a **28px** en 375; badge 12, sub 17, CTA 16. Piso del H1 compacto en 38px (no 34) para que nunca quede bajo los 36px de los títulos de sección entre 768 y 1000px. `.fru-hero__text` max-width 40rem (=400px) → 640px, que estrangulaba el H1 nuevo en tablets. **Preload responsivo**: el srcset se calcula una vez y lo comparten el `<link rel=preload>` (imagesrcset/imagesizes) y el `<picture>`, que pasa a emitirse a mano en vez de por `render 'image'`. Medido en Chrome sobre la home real: móvil 375 bajaba 900w (139KB) **+** 480w (55KB) y ahora baja solo 480w; escritorio 1440 bajaba 640w (83KB) **+** 1600w (307KB) y ahora solo 640w. **Móvil**: la foto pasa a cabecera baja de 118px con el texto encima en placa blanca y el enlace "Arma tu semana gratis" inline junto al CTA — primer tile a **694px** en 375 y 680px en 390 (antes 742). **Copy D-3** textual de Eduardo + kicker "Repartos a domicilio miércoles y sábados" + prueba social "+20.000 pedidos… · 7 años" (sin estrellas) + CTA "Haz tu pedido" para clientes con cuenta (el badge PRIMERA15 se les oculta). Overlay 45 → 10. CTA con relleno sólido `--color-cta-solid` #17845A (4,68:1 AA) en vez del gradiente que arrancaba en 2,54:1. theme check 46/33/10 = base exacta. **Foto del banco NO cambiada**: `image_picker` solo acepta archivos del admin de Shopify y subirlos es gate de Eduardo — candidatas elegidas en G-2b. | `8fdcb2d`, `b6feac9` |
| 2026-08-27 | BELLA-3 (Opus) | Home sin ruido y con marca. **Fuera** el ticker `scrolling_banner_ArEtdk` y la tira de iconos mid-page `3721924b-…` (D-12): de 4 apariciones de "20.000" en el contenido de la home quedan **2** (el hero de BELLA-2, que este sprint tiene prohibido tocar, y la tira única del footer). **Tira del footer** reescrita con el diferencial real: elegido a mano · reparto mié y sáb con las 5 comunas · WhatsApp de Mora · garantía de reposición · +20.000 pedidos en 7 años. **Pastillas (D-2)**: la sólida pasa a HOGARES — blanco sobre `--pill-b2c` #097090 da **5,63:1**, o sea el color de canal PASA AA y no hizo falta el ink oscuro; negocios (10,46:1) y equipo (6,59:1) hairline; bajo 400px etiquetas cortas "Mi casa / Mi negocio / Mi equipo" a 13px con los 64px de alto intactos. **Banda B2B (D-4)**: `color_scheme` 2 → 1, cuyo fondo #F4F0F7 **es** `--fru-morado-050`; titular a h1; la quote del "Jefe de cocina" se mudó aquí desde testimonios. **Testimonios (G-3)**: los 4 inventados fuera, entran las 8 reseñas reales de Google del §8 VERBATIM, en **grid de 3 simultáneas** (Carolina/Magdalena/Beatriz) con inicial en círculo #F4EFE9, "Reseña de Google" y enlace a la ficha; las otras 5 quedan guardadas para rotar. El grid es un layout NUEVO por setting: `page.b2b.json` sigue con el carrusel. `star_color` #f7c346 → **#B87A05** (1,63:1 → 3,61:1). **Emojis**: fuera 🔥 de featured-collection y 🥗🔥🛒 de FrutiMenu; queda 1 (el 🎁 del badge del hero, fuera de ámbito). **Barra superior**: sin 🚚/🎉, copy "Despacho gratis sobre $50.000 · Reparto mié y sáb" (PRIMERA15 sale de aquí), y **nunca se trunca**: medido en Chrome con el peor copy, 320/360/375 = 2 líneas sin "…", 414+ = 1 línea. theme check 46/33/10 = base exacta. | `052f6bd`, `ed458ae`, `8aa0607` |
| 2026-08-27 | BELLA-4 (Sonnet) | Ficha limpia. En `templates/product.json`: eliminados los bloques `1cc6422d-…` (description del tema), `msg_envio` y `cotiza_por_mayor` de main.blocks/block_order (verificados por id con Read antes de borrar). Estrellas a **una sola fila**: el badge de Judge.me (`judge_me_reviews_preview_badge_PT87gQ`) sube justo después de `title`, se borra el bloque `rating` del tema (`3f73b6ee-…`). Pestaña Reseñas del tabs `71057e1b-…` apagada (`show_reviews:false`, `show_reviews_count:false` — era el contenedor del app muerto Shopify Product Reviews); la sección del widget real de Judge.me (`1780585006ec95da1b`) se mueve en el array `order` a inmediatamente después de `details`. Retiro (D-5): `show_pickup_availability` se mantiene en `true`; nuevo bloque `retiro_horario` (custom-liquid, no richtext) junto a `collapsible_envio` con el horario real "miércoles y sábado de 10:00 a 15:00 — pide hasta las 22:00 del día anterior". `trust_bar_product.settings.mobile_stack` → `true`. Verificado con python3 sobre el JSON (no con grep) que las 8 claves quedaron como se pidió, y por `grep` que "¿Compras para un negocio?" queda en **1 sola** aparición en todo el tema (main-product.liquid, el fru-b2b-nudge). En `snippets/breadcrumbs.liquid`: nuevo fallback `breadcrumb_collection` — cuando no hay `collection` en la URL (visita directa a `/products/x`), usa `product.collections.first` excluyendo handles utilitarios (`ofertas`, `all`, `catalogo-completo`, `990`, `por-mayor`); mismo fallback aplicado en el `crumbs_structured_data` (JSON-LD) y en `crumbs_html`. theme check 46/33/10 = base exacta, 0 nuevos. **Sin verificación en producción**: no hay sesión de Shopify CLI guardada (mismo hallazgo que BELLA-2) y la rama queda sin fusionar a main igual que BELLA-1/2/3, así que `mirar-web` contra frutiferia.com sigue mostrando el HTML viejo — no es un fallo de este sprint. La verificación de scrollHeight/DOM en vivo (el mockup Chrome headless 375px) queda pendiente para BELLA-10, que corre tras el merge. | `3dd7a4c`, `01422dd` |
| 2026-08-27 | BELLA-5 (Opus) | Carrito y drawer que no estorban. **Picker con default** (`assets/delivery-picker.js`): el DÍA se preselecciona solo — la primera fecha de la edge fn cuyo corte (22:00 del día anterior, dato de Eduardo) no haya pasado; la **edge fn NO expone cutoff** (devuelve `success/today/window/zones/dates/generated_at`), así que las fechas las manda la API y la hora del corte la pone `CUTOFF_MINUTES`. La **zona NO se adivina**: se preselecciona sólo con evidencia (última usada en `localStorage`, ciudad de `customer.default_address`, u opción única) porque la zona ordena la ruta física del reparto. Con día+zona el picker **colapsa a una línea** ("Sábado 29 ago · Viña del Mar — cambiar"): 60px contra 275px expandido; los `<select>` siguen en el DOM (hidden, no disabled) y el form los envía igual. Nuevo `santiagoNow()` (Intl + `hourCycle h23`) y aritmética de fechas **por componentes** — probado con TZ Santiago/UTC/Madrid a las 21:30 y 22:30 CLT: a las 21:30 del viernes ofrece el sábado 29; a las 22:30 salta al miércoles 2. El **gate inert sobre `.dynamic-cart-btns` queda intacto** y `gate()` ahora recorre TODOS los botones `name="checkout"` del form (un solo MutationObserver). **Drawer al revés**: `position_cart_summary` top → **bottom**, cabecera con "Pide antes del viernes a las 22:00 → llega el sábado 29 de agosto" (`.js-next-delivery`), pitch de cuenta DEBAJO del botón Pagar. **Menos ruido** en `overlay-group.json`: `enable_empty_cart`/`enable_empty_cart_mobile` false (D-6), `show_shipping_calculator` false, `show_media_promotion` false, `promoted_products_visibility` always → `empty-cart`, y fuera `cebolla-5-kg` de los promoted. **/cart móvil**: barra fija con subtotal + "Ir a pagar" (#17845A, 4,68:1) en `assets/fru-cart-bar.css`, safe-area y 92px de padding-bottom; el botón es `<button name="checkout" form="cart">`, o sea el mismo form y el mismo gate. **FAB WhatsApp** con `--clear-cart-bar` en `page_type == 'cart'`. Verificación con Chrome headless a 375×812 sobre un mockup con el CSS REAL de producción (truco del iframe, memoria BELLA-2): productos antes que formularios ✅, sin "Vaciar carrito" ✅, sin calculadora ✅, barra 743–812 y FAB 668–720 (23px de aire, cero solapamiento) ✅, con scroll al fondo nada tapado ✅, a 1440 la barra queda `display:none` ✅; invitado sin zona → los DOS botones deshabilitados y express bloqueado, reincidente → los dos activos y cero selects que tocar. theme check 241/46/33/10 = base exacta. **Sin verificación en producción**: la rama queda sin fusionar igual que BELLA-1/2/3/4 — ver G-11. | `e106734`, `7d89eb4`, `b416642` |

| 2026-08-27 | BELLA-6 (Opus) | Tarjeta de feria. **Cantidad visible**: el número del stepper era blanco sobre blanco en ficha, carrito y tarjeta — `main.css:3865` lo pinta con `--btn-alt-text-color`, que en `current` vale `#ffffff`. Arreglado desde `fru-brand.css.liquid` a la MISMA especificidad (0,3,0) y sin un solo `!important` (fru-brand carga justo después de main.css y gana por orden). Medido en Chrome sobre el CSS real de producción: ficha e input en `rgb(26,26,26)`, carrito igual. **Tap targets**: los `– / +` medían ~39px por el `width/height !important` de `main.css:3958`; se resuelven con `min-width`/`min-height`, que se aplican en el LAYOUT y no compiten en la cascada, así que 44×44 gana sin pelear `!important`, más caja sutil con `--border`. El "Agregar" de la ficha estaba en **42px** → 44; el de la tarjeta 40 → 44. **Quick-add compacto**: la pastilla verde a ancho completo (8 barras idénticas en la fila de ofertas) pasa a un **"+" circular de 44px** en la esquina inferior derecha de la foto; al agregar, `product-form.js` pone `data-show-quantity-selector="true"` y el swap a stepper que YA existía en `quick-add.css` lo convierte en el stepper, en el mismo sitio, con fondo y sombra. **Cero JS nuevo y el form intacto**: sigue siendo el mismo `button[name=add]` en el mismo `form 'product'` — verificado contra producción que ese contrato funciona (`POST /cart/add.js` con `form_type+id+quantity` → `item_count` **0 → 1**) y en Chrome que `elementFromPoint` sobre el centro del botón devuelve el propio botón. En escritorio el FAB NO se esconde esperando hover; sin JS vuelve la pastilla con texto; la vista LISTA recupera su layout en línea; respeta `prefers-reduced-motion`. **Ids únicos**: con `is_quick_order` las 29 tarjetas compartían `id="quantity-<section.id>"` (confirmado en el HTML de producción); ahora llevan el `variant_id` — 4 tarjetas, 4 ids, **0 duplicados**. La rama del carrito (`quantity-<index>`, la que lee `assets/cart-items.js:189`) NO se toca. **Formato honesto**: el dato vive en el propio título, medido sobre `/products.json` de producción (250 productos): 67 `(kg)`, 23 `(5 kg)`, 22 `(u)`, 16 `(10 u)`, 8 `(100 gr)` y 37 sin paréntesis. Sale del título y va debajo como "Por kilo" / "La unidad" / "5 kilos" / "10 unidades" — **sin inventar el envase** (nada de "malla"), sólo expandiendo la abreviatura; el título completo sigue llegando a lectores de pantalla. El `$X x kg` **no necesitó código**: `snippets/price.liquid` ya emite `.unit-price` y la deja `hidden` cuando no hay `unit_price_measurement`, o sea sale sólo donde el dato exista — poblarlo en masa sigue siendo G-9. **Viñetas check** de FrutiMenu por CSS con data-URI SVG (el validador de richtext de Shopify rechaza el archivo si el setting trae cualquier atributo que no sea `href`), reproduciendo el trazo de `.audience-door__check`. **Huérfano 1 de BELLA-3 — foto FrutiMenu en móvil**: la foto es 800×1200 y la sección la pinta con `padding-top: 150%` INLINE = **560px de alto** en un teléfono; queda 4:3 y máx 280px (medido: **251px**). Verificado que "Más de 7 años" queda INTACTA (su `padding-top` sigue en 175px y su img sigue `absolute`). **Huérfano 2 — banda B2B (resto de D-4)**: titular en `--fru-morado-900`, riel superior 3px y subtítulo de canal en `--pill-b2b-ink`; de paso arregla algo roto a la vista desde BELLA-3 — el "Cotiza por WhatsApp" es `.btn--secondary` y se pintaba con `--btn-alt-text-color` = `#ffffff`, o sea **blanco sobre el lila**: ahora índigo con borde de 2px (`--btn-border-width` valía 0 en el tema). theme check 241/46/33/10 = base exacta, 0 nuevos. **Sin verificación en producción**: la rama queda sin fusionar igual que bella-1/2/3/4/5 — ver G-11. | `6eada2b`, `e69059f`, `aa3875d` |

| 2026-08-27 | BELLA-7 (Sonnet) | Recompra y búsqueda. **Banda de recompra**: nueva `sections/fru-reorder-band.liquid`, gateada `{% if customer and reorder_path != blank %}` — reusa EXACTO el cálculo de `main-account.liquid:22-33` (`routes.cart_url/{variant:qty}`, solo variantes disponibles), insertada en `templates/index.json` entre `fru_hero` y `audience_doors`. Para anónimos o clientes sin pedidos el bloque completo (incluido el `<style>`) no se emite — cero filtración de que la banda existe. **Drawer vacío**: mismo cálculo (variable `drawer_reorder_path`, sin chocar nombres con la sección) agregado a `snippets/cart-drawer.liquid`, solo dentro del `{% if cart == empty %}` — no se tocó nada más del drawer que BELLA-5 ya dejó armado. **Búsqueda sin B2B (D-8) — hallazgo importante**: Shopify **no filtra la búsqueda por ningún metafield nativo**; "marcar `seo.hidden=1` en el admin" por sí solo no hace nada si el tema no lo lee. Se implementó el lado que faltaba: `snippets/predictive-search-tab-panel.liquid` ahora salta (`{% continue %}`) cualquier producto con `item.metafields.seo.hidden` en el panel de productos — alcanza solo al panel PREDICTIVO (Section Rendering API), no a la página `/search` completa (fuera del alcance de archivos de este sprint). Verificado por código que el cotizador B2B usa su API propia (`cotiza.frutiferia.com`, un link, no `/search`) y que `page.b2b.json` no referencia `predictive_search` ni rutas de búsqueda — el filtro es seguro de aplicar sin romper ningún flujo B2B. Catálogo público recorrido por `/products.json?limit=250` con paginación (`&page=`): **355 productos en total, no 250** (corrección a la memoria de BELLA-6, que solo leyó la página 1) — de esos, **28** tienen formato `(5 kg)`/`(20 kg)` (lista de títulos+handles en el reporte del sprint), bajo el umbral de 40 que el plan fija para exigir Matrixify/CSV, así que el admin normal (selección múltiple + editor de metafields) alcanza. Marcar esos 28 metafields queda como **gate G-10** (requiere la sesión de Eduardo en el admin; esta sesión no tiene su Chrome). **Quick-add en resultados**: NO se reutilizó el patrón FAB de `product-card.liquid` — ese vive DENTRO del `<a>` que envuelve toda la tarjeta, y en el panel predictivo el `<a class="js-search-link">` envuelve toda la fila del resultado; anidar un `<form>` ahí dispararía el submit Y la navegación a la vez, y además `predictive-search.js:180` exige que `.js-search-link` sea hijo DIRECTO del `<li>` (`[aria-selected="true"] > .js-search-link`, para el Enter del teclado) — un wrapper extra rompe la selección por teclado. Se usó en cambio el patrón YA EXISTENTE de `snippets/product-card-mini.liquid` (botón icon-only `btn--sm btn--icon tap-target`, hermano del `<a>`, con `<product-form>` para variante única y `.js-quick-add` — que abre el drawer existente — para multivariante): cero CSS nueva (ese archivo no estaba en el alcance de archivos de este sprint) y cero riesgo de nesting inválido. **Colección**: `templates/collection.json` `products_per_page` 36 → 50. theme check **242 archivos / 46 offensas / 33 archivos / 10 errores** = exactamente la base (241+1 por el `.liquid` nuevo; los `.css` no cuentan, memoria BELLA-5) — 0 nuevas en los 5 archivos tocados. **Sin verificación en producción**: la rama queda sin fusionar igual que bella-1..6 — sigue esperando G-11 (el merge). | `6b3b3ef`, `1d9f498` |

| 2026-08-28 | BELLA-8 (Sonnet) | Fotos y tiles premium. **Presencia real (tarea 1)**: se probó primero una altura de tile fija (300/320px) para la fila de 3, pero medido en Chrome headless daba un tile en RETRATO (más alto que ancho) en anchos de tablet ~750-900px, porque el ancho de columna a esos anchos es angosto (~257px) y una altura fija no escala con eso. Se cambió a `.fru-tile__media { aspect-ratio: 4/3 }` desde 750px (quitando el alto fijo del `.fru-tile` en ese rango): la FOTO queda siempre 4:3 sin importar el ancho de columna, y el tile completo (foto + placa) mide ~261px a 900px y ~363px a 1440px — medido con Chrome headless sobre un mockup con el CSS real de producción (home de prod + `fru-category-tiles-NEW.css` inyectado justo después del `<link>` original de la sección, para ganar el cascade — memoria nueva: el `<link>` de una sección Shopify vive DENTRO del HTML de la sección, no en `<head>`, así que un override puesto en `<head>` pierde el cascade contra él). Título 24px (750px) / 26px (1100px), dentro del rango pedido. **Móvil intacto**: bajo 750px no se tocó una sola regla — medido con el truco del iframe (memoria BELLA-2): mismo `top` del primer tile, mismo alto 172px, mismo título 19px, antes y después del cambio. **Subtítulo (tarea 2)**: se agregó un setting NUEVO `subtitle` (no se reusó `eyebrow`, que ya tiene un rol distinto — etiqueta corta ARRIBA del título — y reusarlo para un texto largo debajo habría chocado con su propio label/info en el schema). Reemplaza al contador "N productos" cuando está lleno, mismo lugar y peso visual (clase renombrada `fru-tile__count` → `fru-tile__meta`, con `fru-tile__meta--count` solo para el caso contador). Poblado con texto concreto por categoría en los 6 bloques reales de `templates/index.json` (sacado de `/products.json` real de cada colección, no inventado) y en el preset del schema. Se tocó `templates/index.json` (solo los blocks de `fru_category_tiles`) aunque no estaba en la lista de archivos del prompt — sin eso el setting nuevo no se ve en ningún tile real; incluido en el mismo patrón acotado que usaron BELLA-2 y BELLA-7 con ese archivo. **Peso de fotos (tarea 3)**: las 6 imágenes de colección se descargaron de production (`cdn.shopify.com`, públicas, sin auth) y se re-exportaron a ≤1200px, JPEG q78-80, con blur suave (0,6px) en Verduras y Snacks para bajar el grano que el propio plan señalaba. Ahorro proyectado a 375px (ancho real que sirve el tile en el celular): de 354.890 a ~190.000 bytes, **−165KB** — bajo la meta de −250KB del plan, porque esa meta contaba con reemplazar TAMBIÉN el sujeto de 3 fotos (tarea 4), no solo recomprimir; recomprimir la MISMA foto de flatlay recargado tiene techo. Subir estos 6 archivos requiere Admin → Colecciones (sin sesión de Eduardo esta corrida): quedó como **gate G-2c**, con los archivos ya listos. **Curaduría (tarea 4, D-10)**: confirmado con screenshot que Verduras, FrutiPack y Ofertas usan el MISMO estilo de flatlay arcoíris recargado (pimentones/plátano/cebolla morada/tomate en composición casi idéntica) — el hallazgo del plan es real, no exagerado. Se buscó en el banco de imágenes de Drive (899 fotos indexadas en `_INDICE-PROPIAS.csv`, carpeta `Fotos Frutiferia/`) una candidata por categoría; **NO existe ninguna foto de la canasta FrutiPack real en el banco** (se buscó "frutipack" en las 899 filas, cero resultados) — la sesión de fotos propias de Eduardo (G-2 del plan) sigue siendo la única fuente real para esa. Las candidatas para Verduras y Ofertas SÍ existen pero no se confirmaron visualmente (el `read_file_content` de Drive sobre imágenes devuelve vacío, memoria ya conocida desde BELLA-2; y bajar cada imagen completa en base64 para verla no se justificaba en tokens dado que esto de todos modos requiere el ojo de Eduardo). Quedó como **gate G-2d**, con los file id exactos y la advertencia honesta de qué no se pudo verificar. **Packshots de Ofertas (tarea 5) — hallazgo importante**: se buscó la "caja gris horneada" que el plan describe (limón, cebolla y ~3 más) escaneando programáticamente el color de esquina de las 64 fotos de la colección Ofertas y revisando a ojo las 8 más atípicas — NINGUNA muestra una caja/estudio gris; limón y cebolla hoy tienen fondo blanco limpio, y las demás atípicas son fotos macro que llenan el cuadro (sin fondo de estudio que blanquear). El hallazgo del plan no se pudo reproducir contra las fotos que están LIVE hoy — puede que ya se hayan corregido en algún momento entre la auditoría del plan (mismo día) y ahora, o que el hallazgo original fuera sobre un crop/zoom específico no capturado aquí. Tampoco se activó `blend_product_images` con `blend_bg_color:#ffffff` (el "mientras tanto" que pedía el prompt): revisando `assets/main.css:2201-2206`, ese setting aplica `mix-blend-mode:multiply` sobre la imagen contra el color de fondo del contenedor — multiplicar por blanco (255,255,255) es la identidad matemática del modo multiply, o sea con `#ffffff` el efecto es un NO-OP total, no aclara nada gris a blanco. Activar un setting global (afecta a las ~355 fotos de producto del catálogo, no solo a las de Ofertas) sabiendo que no hace nada habría sido puro teatro; se dejó sin tocar y sin gate, porque no hay nada que decidir. `theme check`: 242 archivos / 46 offensas / 33 archivos / 10 errores = exactamente la base (0 nuevas) en los 3 archivos tocados. **Corrección de rama**: el primer commit se hizo por error sobre `orq/bella-7` (rama que ya estaba activa en el checkout); se corrigió moviendo el commit a una rama nueva `orq/bella-8` y devolviendo `orq/bella-7` a su punto exacto de `origin` (`373bb02`) — sin tocar el remoto en ningún momento, así que `orq/bella-7` no sufrió cambios visibles. **Sin verificación en producción**: la rama queda sin fusionar igual que bella-1..7 — sigue esperando G-11 (el merge). | `b089288` |

| 2026-08-28 | BELLA-9 (Sonnet) | Admin, SEO y apps. **Bloqueado por herramienta, no por decisión**: el prompt de este sprint asume Chrome MCP con el navegador de Eduardo para trabajar en el admin de Shopify, pero esta sesión arrancó con esa herramienta apagada y denegada (no aparece ni una sola herramienta de navegador/computer-use en el listado de esta corrida) y sin ningún token de Admin API de Shopify configurado en el repo ni en el orquestador — se buscó explícitamente y no existe. Las 7 tareas del prompt son 100% admin de Shopify: **0 de 7 se pudieron ejecutar**. Se hizo todo lo verificable sin sesión autenticada (endpoints públicos, sin login): **(1) SEO home** — confirmado con curl UA Chrome que el título hoy es "Frutiferia – Delivery de Frutas y Verduras a Domicilio 🌿 – Frutiferia SPA" y la descripción es la genérica de siempre; el título nuevo propuesto por el plan mide exactamente 58 caracteres y la descripción 153 (no 152, un carácter de diferencia, no importa). **(2) Nombre de tienda**: confirmado que el "– Frutiferia SPA" duplicado en el título de pestaña es real y viene de ahí. **(3) product_type**: se descargó el catálogo público completo (`/products.json?limit=250` con paginación, 355 productos) y se contó cada tipo a renombrar — Aguacates 4, Patatas 5, Calabazas y calabacines 2, Frutas del bosque 12, Mantecas/Manteca de frutos secos 9+1 — con el título y handle exacto de cada producto (va en el gate G-12). **Hallazgo importante**: de los 12 productos en "Frutas del bosque", NINGUNO es un berry (son mandarina, kiwi, manzanas, maracuyá, pera, plátanos, piña, mango) — renombrarlo a "Berries" tal como pide el plan sería un error de catálogo más visible que el nombre actual, no una mejora; se dejó como decisión abierta para Eduardo en vez de ejecutarlo a ciegas. Se revisaron las 29 colecciones públicas del sitio (`/collections.json`) y ninguna se llama como los 6 tipos a renombrar, lo que baja el riesgo de romper una colección automática por nombre, aunque no lo descarta (las reglas de colección no son públicas). **(5) Judge.me**: medido en una ficha real que `jdgmSettings` pesa exactamente 34.062 bytes (34KB, coincide con el hallazgo del plan), confirmado que Q&A ya está apagado y que las medallas (`medals_widget_position: footer_all_pages`) siguen activas. **(7) Smile**: confirmado con curl que el script `js.smile.io/v1/smile-shopify.js` SIGUE cargando en la home — la app está instalada y activa, no solo instalada sin uso; falta que Eduardo confirme actividad real en el dashboard de la app antes de borrarla. **(4) Retiro y (6) VUELVE10**: nada verificable sin admin; se dejó el texto exacto del correo post-compra listo para pegar. Todo esto quedó en dos gates consolidados (G-12, G-13) con los pasos, textos y conteos exactos — cero trabajo nuevo para Eduardo más allá de lo que el propio plan ya le pedía, solo que ahora con los números reales en vez de "revísalo tú". Sin commits de código (no había código que tocar); el único cambio de este sprint es este documento. | (este doc) |

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

## 8. Reseñas reales de Google (entregadas por Eduardo el 2026-08-27, transcritas)

Material para BELLA-3 (testimonios) y la banda B2B. Los textos van VERBATIM — no retocar
palabras de clientas. En el sitio: nombre + "Reseña de Google" + ★★★★★, sin fecha. TOP =
las 3 del grid de escritorio; el resto queda en la rotación.

| | Autor/a | Fecha | Texto |
|---|---|---|---|
| TOP | Carolina Espíndola Patterson | 6 may 2025 | "Excelente experiencia. Productos frescos, que duran. Muy fácil para elegir, pagar y solicitar reparto. 10/10." |
| TOP | Magdalena López | 18 ago 2025 | "Me encanta Frutiferia!! Es el único lugar donde escogen las frutas y verduras como si uno fuera a la feria o al súper. Excelente calidad siempre, precios convenientes y con un sello de amor por el trabajo maravillosooo. Me encantan y los recomiendo a miiil!!!" |
| TOP | Beatriz Barry | 3 may 2025 | "Siempre pido la fruta y verdura a Frutiferia por la comodidad de que llegue a tu casa, exactamente lo que pediste y en el horario convenido, me gusta también que siempre venga todo ordenado y protegido, se mueren además lo rico que es todo, especialmente las frutillas, que es mi fruta favorita!!!" |
| | Washington Maturana C. (Local Guide, 134 opiniones) | 2 may 2025 | "Frutiferia es eso que jamás pensé que iba a tener en una frutería, calidad, precio y buenísima experiencia al cliente. Los conocí hace unos años y son mis mejores amigos hoy, aunque no nos conocemos." |
| | Rocío Álvarez Tapia | 2 may 2025 | "Estupendo todo! la atención, la calidad de las frutas y verduras, excelentes los productos de pymes (como la mantequilla de maní!!) súper recomendado" |
| | Paula Arismendi | 2 may 2025 | "La fruta y verdura fresca y exquisita! El servicio excelente. 10/10. 100% recomendado" — ⭐ su reseña trae una FOTO REAL de una caja entregada (brócoli, plátanos, albahaca): candidata de puente mientras no haya fotos propias (G-2/D-10). |
| | Solange Paola Ramírez Valenzuela | 24 may 2025 | "Excelentes productos, sin duda volveré a pedir mis frutas y verduras con ellos" |
| | Luz Castro | 16 may 2025 | "Excelente lugar atendido por sus dueños. Las verduras y frutas son de excelente calidad. Somos clientes por muchos años." |

Criterio del TOP: tres ángulos que venden distinto — la facilidad del funnel (Carolina),
la selección a mano (Magdalena) y la confiabilidad de la entrega (Beatriz). Washington
(Local Guide con 134 reseñas) es el mejor cuarto si el grid crece.
