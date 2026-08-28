/* global theme */
/*
 * delivery-picker — selector de día + zona de reparto a domicilio (B2C web).
 *
 * Reemplaza la app IdentixWeb. Dos campos (día + zona/horario). Rellena las
 * fechas desde la edge fn delivery-availability (calculadas en hora de Santiago)
 * y guarda la elección como cart attributes 'Fecha de Entrega' (ISO) + 'Horario'
 * ('Zona [12:00-16:00]') vía /cart/update.js, igual que cart-note.js. BLOQUEA el
 * checkout hasta que haya día Y zona, igual que IdentixWeb: deshabilita el botón
 * nativo (name="checkout") + el submit del form Y neutraliza los botones de pago
 * express (Shop Pay/Apple Pay/PayPal de content_for_additional_checkout_buttons),
 * que NO son un <button name=checkout> y saltarían el submit del form. El estado
 * se rehidrata desde data-selected-* en cada re-render del drawer (que reescribe
 * el Liquid con cart.attributes frescos).
 *
 * BELLA-5 (2026-08-27) — del carro al pago se caía el 61,7%, con "Pagar"
 * deshabilitado de nacimiento porque los DOS selects venían vacíos. Ahora:
 *   · el DÍA se preselecciona solo (primera fecha cuyo corte no haya pasado);
 *   · la ZONA se preselecciona si la recordamos (localStorage), si la ciudad de
 *     la dirección del cliente logueado calza, o si sólo hay una opción. NO se
 *     inventa una zona al azar: la zona ordena la ruta de reparto real;
 *   · con día+zona el picker se COLAPSA a una línea ("Sábado 29 ago · Viña —
 *     cambiar") para que la comida y el botón Pagar manden en el drawer;
 *   · se publica la próxima entrega ("Pide antes del … → llega el …") en los
 *     nodos .js-next-delivery (cabecera del drawer). El corte es 22:00 del día
 *     anterior (dato de negocio, Eduardo 2026-08-27); la edge fn NO expone
 *     cutoff, sólo `dates`, así que las fechas las manda la API y la hora del
 *     corte la pone esta constante.
 * El gate inert sobre .dynamic-cart-btns se MANTIENE intacto mientras falte
 * día o zona: los botones express saltan el submit del form.
 */
if (!customElements.get('delivery-picker')) {
  var CACHE_TTL_MS = 10 * 60 * 1000;
  var cache = null; // { at, dates, zones, window } — compartido entre instancias
  var MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MONTHS_ABBR_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var ZONE_STORAGE_KEY = 'fru-delivery-zone';
  // Corte real de pedidos: 22:00 del día ANTERIOR a la entrega (Eduardo 2026-08-27).
  var CUTOFF_MINUTES = 22 * 60;

  function cartUpdateUrl() {
    return (window.theme && theme.routes && theme.routes.cartUpdate) || '/cart/update.js';
  }

  /** Normaliza para comparar nombres de zona/ciudad ("Viña del Mar" ≈ "vina del mar"). */
  function fold(str) {
    return (str || '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  class DeliveryPicker extends HTMLElement {
    constructor() {
      super();
      this.dateSelect = this.querySelector('.js-delivery-date');
      this.zoneSelect = this.querySelector('.js-delivery-zone');
      this.error = this.querySelector('.js-delivery-error');
      this.fields = this.querySelector('.js-delivery-fields');
      this.summaryBtn = this.querySelector('.js-delivery-summary');
      this.summaryText = this.querySelector('.js-delivery-summary-text');
      this.url = this.getAttribute('data-availability-url') || '';
      this.selectedDate = this.getAttribute('data-selected-date') || '';
      this.selectedZone = this.getAttribute('data-selected-zone') || '';
      this.customerCity = this.getAttribute('data-customer-city') || '';
      this.window = this.getAttribute('data-window') || '12:00-16:00';
      this.formId = this.getAttribute('data-form') || 'cart';
      this.touched = false;
      this.loaded = false;
      this.loading = false; // fetch de disponibilidad en curso → bloquear entretanto
      this.saving = false;  // POST /cart/update.js en curso → mantener express bloqueado
      this.hasOptions = false; // hay al menos un día Y una zona seleccionables
      this.pendingSave = false; // cambios de estado hechos por el propio picker, sin POST aún
      this.expanded = false; // el cliente pidió "cambiar" → no volver a colapsar
      this.observed = null;
      this.onChange = this.handleChange.bind(this);
      this.onSubmit = this.handleSubmit.bind(this);
      this.onExpand = this.expand.bind(this);
    }

    connectedCallback() {
      if (this.dateSelect) this.dateSelect.addEventListener('change', this.onChange);
      if (this.zoneSelect) this.zoneSelect.addEventListener('change', this.onChange);
      if (this.summaryBtn) this.summaryBtn.addEventListener('click', this.onExpand);
      this.form = document.getElementById(this.formId);
      if (this.form) this.form.addEventListener('submit', this.onSubmit);
      this.loading = true;
      // Bloquea desde el primer frame — antes de que resuelva la disponibilidad —
      // para cerrar la ventana en que el botón server-rendered queda clickeable sin
      // día/zona. rAF corre tras el parse, cuando el botón ya existe en el DOM.
      if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(() => this.gate());
      this.loadData();
    }

    disconnectedCallback() {
      if (this.dateSelect) this.dateSelect.removeEventListener('change', this.onChange);
      if (this.zoneSelect) this.zoneSelect.removeEventListener('change', this.onChange);
      if (this.summaryBtn) this.summaryBtn.removeEventListener('click', this.onExpand);
      if (this.form) this.form.removeEventListener('submit', this.onSubmit);
      if (this.btnObserver) this.btnObserver.disconnect();
    }

    /**
     * El carrito de Canopy re-habilita el botón de checkout una vez, tarde en la
     * hidratación (después de nuestro primer gate), dejándolo clickeable pese a
     * faltar día/zona. Observamos su atributo `disabled` y re-aplicamos el gate
     * cuando algo lo cambia — así el estado visual siempre refleja la intención,
     * sin polling. gate() solo escribe cuando el estado DEBE cambiar, así que el
     * observer converge en un ciclo (no hay loop). Un solo MutationObserver cubre
     * todos los botones de checkout del mismo form (BELLA-5 sumó la barra fija de
     * /cart móvil, que es un segundo <button name="checkout">).
     */
    observeCheckout(btn) {
      if (!btn || typeof MutationObserver === 'undefined') return;
      if (!this.btnObserver) {
        this.observed = new Set();
        this.btnObserver = new MutationObserver(() => this.gate());
      }
      if (this.observed.has(btn)) return;
      this.observed.add(btn);
      this.btnObserver.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
    }

    async loadData() {
      let data = null;
      if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
        data = cache;
      } else if (this.url) {
        // Timeout duro: un fetch colgado (CSP/red) NO debe dejar el checkout
        // bloqueado para siempre; a los 8s abortamos y caemos a fail-open.
        const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), 8000) : null;
        try {
          const res = await fetch(this.url, {
            headers: { Accept: 'application/json' },
            signal: ctrl ? ctrl.signal : undefined,
          });
          const json = await res.json();
          if (json && json.success && Array.isArray(json.dates)) {
            data = { at: Date.now(), dates: json.dates, zones: json.zones || [], window: json.window || this.window };
            cache = data;
          }
        } catch (e) {
          console.warn('[delivery-picker] no se pudo cargar disponibilidad', e);
        } finally {
          if (timer) clearTimeout(timer);
        }
      }
      this.loading = false;
      if (!data) {
        // Outage / blackout total / CSP: no dejamos el <select> pegado en
        // "Cargando días…" (se ve roto) → mensaje claro + WhatsApp. loaded queda
        // false ⇒ fail-open (no se puede exigir elegir de una lista vacía).
        this.showLoadError();
        this.gate();
        return;
      }
      this.window = data.window || this.window;
      this.next = this.nextDelivery(data.dates);
      const nDates = this.renderDates(data.dates);
      this.renderZones(data.zones);
      this.loaded = true;
      // Sin días O sin zonas seleccionables (blackout, o todas las fechas cayeron
      // por el filtro de "hoy/pasado") NO se puede EXIGIR elegir de una lista
      // vacía → fail-open, si no el cliente queda bloqueado para siempre.
      this.hasOptions = nDates > 0 && Array.isArray(data.zones) && data.zones.length > 0;
      if (!this.hasOptions) this.showNoOptionsHint();
      this.applyDefaults();
      this.publishNextDelivery();
      this.renderCollapsed();
      this.gate();
      this.flushSave();
    }

    showNoOptionsHint() {
      const hint = this.querySelector('.js-delivery-hint');
      if (hint) {
        hint.innerHTML =
          '<small>Escríbenos por WhatsApp para coordinar la fecha de entrega de tu pedido.</small>';
      }
    }

    /** Falla de carga: reemplaza el placeholder "Cargando días…" para no parecer colgado. */
    showLoadError() {
      if (this.dateSelect && !this.selectedDate && this.dateSelect.options[0]) {
        this.dateSelect.options[0].textContent = 'No pudimos cargar los días';
      }
      this.showNoOptionsHint();
    }

    /**
     * "Ahora" en America/Santiago: { date: 'YYYY-MM-DD', minutes: h*60+m }.
     * NUNCA usar Date local a secas para decidir el día: entre 20:00 y 23:59 CLT
     * el UTC ya está en el día siguiente (f/fecha_servidor_utc_vs_santiago).
     */
    santiagoNow() {
      try {
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Santiago',
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: false, hourCycle: 'h23',
        }).formatToParts(new Date());
        const get = (type) => {
          const found = parts.find((p) => p.type === type);
          return found ? found.value : '';
        };
        let hour = parseInt(get('hour'), 10);
        if (!isFinite(hour) || hour === 24) hour = 0;
        const minute = parseInt(get('minute'), 10) || 0;
        return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: hour * 60 + minute };
      } catch (e) {
        return { date: '', minutes: -1 };
      }
    }

    /** "Hoy" en America/Santiago (YYYY-MM-DD) para descartar fechas caducas de caché. */
    santiagoToday() {
      return this.santiagoNow().date;
    }

    /**
     * Aritmética de calendario sobre el ISO, con Date construida por COMPONENTES
     * (no `new Date('2026-08-29')`, que se parsea como UTC y retrocede un día en
     * Chile). El resultado no depende de la zona del navegador.
     */
    shiftDate(iso, days) {
      const p = (iso || '').split('-');
      if (p.length !== 3) return '';
      const dt = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) + days);
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${dt.getFullYear()}-${mm}-${dd}`;
    }

    weekdayName(iso) {
      const p = (iso || '').split('-');
      if (p.length !== 3) return '';
      const dt = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
      return DAYS_ES[dt.getDay()] || '';
    }

    /**
     * Próxima entrega alcanzable: la primera fecha de la API cuyo corte (22:00 del
     * día anterior, hora de Santiago) todavía no haya pasado. Sólo decide el TEXTO
     * de cabecera y el día por defecto; las opciones del <select> las manda la API.
     */
    nextDelivery(dates) {
      const now = this.santiagoNow();
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        if (!d || !d.date) continue;
        if (now.date && d.date <= now.date) continue;
        const cutoff = this.shiftDate(d.date, -1);
        if (now.date) {
          if (cutoff < now.date) continue;
          if (cutoff === now.date && now.minutes >= CUTOFF_MINUTES) continue;
        }
        return {
          date: d.date,
          label: this.dateLabel(d),
          cutoffDate: cutoff,
          cutoffToday: !!now.date && cutoff === now.date,
          cutoffDay: this.weekdayName(cutoff),
        };
      }
      return null;
    }

    /** "Pide hoy antes de las 22:00 → llega el sábado 29 de agosto" en .js-next-delivery. */
    publishNextDelivery() {
      const nodes = document.querySelectorAll('.js-next-delivery');
      if (!nodes.length) return;
      if (!this.next) {
        nodes.forEach((n) => { n.hidden = true; });
        return;
      }
      const when = this.next.cutoffToday
        ? 'Pide hoy antes de las 22:00'
        : `Pide antes del ${this.next.cutoffDay} a las 22:00`;
      const text = `${when} → llega el ${(this.next.label || '').toLowerCase()}`;
      nodes.forEach((n) => {
        n.textContent = text;
        n.hidden = false;
      });
    }

    renderDates(dates) {
      if (!this.dateSelect) return 0;
      const today = this.santiagoToday();
      const frag = document.createDocumentFragment();
      frag.appendChild(this.opt('', 'Elige un día'));
      let valid = false;
      let count = 0;
      dates.forEach((d) => {
        // Descarta fechas de "hoy"/pasadas: la caché (30 min server + 10 min JS)
        // puede cruzar medianoche y ofrecer un día ya no válido (comparación ISO).
        if (d.date && today && d.date <= today) return;
        const o = this.opt(d.date, this.dateLabel(d));
        if (d.date === this.selectedDate) {
          o.selected = true;
          valid = true;
        }
        frag.appendChild(o);
        count++;
      });
      this.dateSelect.innerHTML = '';
      this.dateSelect.appendChild(frag);
      // Si la fecha guardada caducó / quedó bloqueada, limpiar.
      if (this.selectedDate && !valid) {
        this.selectedDate = '';
        this.dateSelect.value = '';
        this.pendingSave = true;
      }
      return count;
    }

    renderZones(zones) {
      if (!this.zoneSelect) return;
      const frag = document.createDocumentFragment();
      frag.appendChild(this.opt('', 'Zona y horario'));
      let valid = false;
      zones.forEach((z) => {
        const value = `${z} [${this.window}]`; // formato que parsea OS: 'Zona [HH:MM-HH:MM]'
        const o = this.opt(value, `${z} (${this.window})`);
        o.dataset.zone = z;
        if (value === this.selectedZone) {
          o.selected = true;
          valid = true;
        }
        frag.appendChild(o);
      });
      this.zoneSelect.innerHTML = '';
      this.zoneSelect.appendChild(frag);
      if (this.selectedZone && !valid) {
        this.selectedZone = '';
        this.zoneSelect.value = '';
        this.pendingSave = true;
      }
    }

    /** Opciones reales (descarta el placeholder de value ''). */
    realOptions(select) {
      if (!select) return [];
      return Array.prototype.filter.call(select.options, (o) => o.value !== '');
    }

    rememberedZone() {
      try {
        return window.localStorage.getItem(ZONE_STORAGE_KEY) || '';
      } catch (e) {
        return '';
      }
    }

    rememberZone(name) {
      try {
        if (name) window.localStorage.setItem(ZONE_STORAGE_KEY, name);
      } catch (e) {
        /* Safari privado / storage bloqueado: la memoria es un lujo, no un requisito. */
      }
    }

    /**
     * Preselección. El DÍA siempre (la próxima entrega alcanzable, o la primera de
     * la lista): elegir día no tiene costo para nadie y es lo que desbloquea el
     * botón. La ZONA sólo cuando hay evidencia — la zona ordena la ruta física del
     * reparto y adivinarla mandaría la caja a otra comuna.
     */
    applyDefaults() {
      if (!this.selectedDate && this.dateSelect) {
        const opts = this.realOptions(this.dateSelect);
        let pick = null;
        if (this.next) pick = opts.filter((o) => o.value === this.next.date)[0] || null;
        if (!pick) pick = opts[0] || null;
        if (pick) {
          pick.selected = true;
          this.dateSelect.value = pick.value;
          this.selectedDate = pick.value;
          this.pendingSave = true;
        }
      }

      if (!this.selectedZone && this.zoneSelect) {
        const opts = this.realOptions(this.zoneSelect);
        const remembered = fold(this.rememberedZone());
        const city = fold(this.customerCity);
        let pick = null;
        if (remembered) pick = opts.filter((o) => fold(o.dataset.zone) === remembered)[0] || null;
        if (!pick && city) pick = opts.filter((o) => fold(o.dataset.zone) === city)[0] || null;
        if (!pick && opts.length === 1) pick = opts[0];
        if (pick) {
          pick.selected = true;
          this.zoneSelect.value = pick.value;
          this.selectedZone = pick.value;
          this.pendingSave = true;
        }
      }
    }

    zoneName(value) {
      return (value || '').split(' [')[0];
    }

    /** "Sábado 29 ago" para la línea colapsada. */
    dateShort(iso) {
      const p = (iso || '').split('-');
      if (p.length !== 3) return iso || '';
      const day = parseInt(p[2], 10);
      const month = MONTHS_ABBR_ES[parseInt(p[1], 10) - 1] || '';
      const weekday = this.weekdayName(iso);
      const cap = weekday ? weekday.charAt(0).toUpperCase() + weekday.slice(1) : '';
      return `${cap} ${day} ${month}`.trim();
    }

    /**
     * Con día Y zona ya elegidos el picker se colapsa a una línea: el drawer abre
     * con la comida y el botón Pagar, no con dos formularios. "cambiar" reabre los
     * selects y ya no vuelven a colapsarse en esa sesión.
     */
    renderCollapsed() {
      if (!this.fields || !this.summaryBtn) return;
      const collapse = this.isComplete() && !this.expanded;
      if (collapse && this.summaryText) {
        this.summaryText.textContent = `${this.dateShort(this.selectedDate)} · ${this.zoneName(this.selectedZone)}`;
      }
      this.fields.hidden = collapse;
      this.summaryBtn.hidden = !collapse;
      this.summaryBtn.setAttribute('aria-expanded', collapse ? 'false' : 'true');
      this.classList.toggle('delivery-picker--collapsed', collapse);
    }

    expand() {
      this.expanded = true;
      this.renderCollapsed();
      if (this.dateSelect) {
        try {
          this.dateSelect.focus();
        } catch (e) {
          /* noop */
        }
      }
    }

    opt(value, text) {
      const o = document.createElement('option');
      o.value = value;
      o.textContent = text;
      return o;
    }

    dateLabel(d) {
      // "2026-06-27" → "Sábado 27 de junio"
      const p = (d.date || '').split('-');
      if (p.length !== 3) return d.dayLabel || d.date || '';
      const day = parseInt(p[2], 10);
      const monthName = MONTHS_ES[parseInt(p[1], 10) - 1] || '';
      return `${d.dayLabel || ''} ${day} de ${monthName}`;
    }

    handleChange() {
      this.touched = true;
      this.selectedDate = this.dateSelect ? this.dateSelect.value : '';
      this.selectedZone = this.zoneSelect ? this.zoneSelect.value : '';
      this.rememberZone(this.zoneName(this.selectedZone));
      this.renderCollapsed();
      this.pendingSave = true;
      this.flushSave();
    }

    /**
     * Un solo POST por tanda de cambios (la preselección toca día y zona juntos).
     * Mientras el POST no confirme, el carrito server-side aún no tiene la fecha
     * → mantener bloqueado el checkout express (Shop Pay lee el carrito, NO el
     * form). El botón nativo es seguro: envía los <select> inline con el form.
     */
    flushSave() {
      if (!this.pendingSave) return;
      this.pendingSave = false;
      this.saving = true;
      this.gate();
      this.save().finally(() => {
        this.saving = false;
        this.gate();
      });
    }

    save() {
      const attributes = {
        'Fecha de Entrega': this.selectedDate || '',
        'Horario': this.selectedZone || '',
      };
      return fetch(cartUpdateUrl(), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes }),
      }).catch((e) => console.warn('[delivery-picker] no se pudo guardar', e));
    }

    isComplete() {
      return !!(this.selectedDate && this.selectedZone);
    }

    /**
     * ¿Debe bloquearse el checkout? Se exige día+zona mientras carga la
     * disponibilidad (loading) o, una vez cargada, si hay opciones reales. En
     * outage (loaded=false, sin opciones) NO se exige → fail-open.
     */
    shouldBlock() {
      const enforce = this.loading || (this.loaded && this.hasOptions);
      return enforce && !this.isComplete();
    }

    /**
     * Botones de checkout asociados a este form. En el drawer y en /cart hay uno
     * en el resumen; /cart móvil suma el de la barra fija inferior (BELLA-5), que
     * también apunta al form por atributo `form`.
     */
    checkoutButtons() {
      const list = [];
      document
        .querySelectorAll('button[name="checkout"][form="' + this.formId + '"]')
        .forEach((b) => list.push(b));
      if (this.form) {
        this.form.querySelectorAll('button[name="checkout"]:not([form])').forEach((b) => {
          if (list.indexOf(b) === -1) list.push(b);
        });
      }
      return list;
    }

    /** El botón que vive junto al resumen — ancla para localizar los express. */
    checkoutButton() {
      const btns = this.checkoutButtons();
      const scoped = btns.filter((b) =>
        b.closest('.cart-drawer__checkout-buttons, #cart, .cart__summary')
      );
      return scoped[0] || btns[0] || null;
    }

    /**
     * Contenedor de los botones de pago express (Shop Pay/Apple Pay/PayPal), que
     * Canopy renderiza junto al botón de checkout como `.dynamic-cart-btns`. Se
     * localiza por proximidad al botón nativo para no gatear el del otro carrito
     * (página y drawer coexisten en el DOM de /cart).
     */
    expressButtons() {
      const btn = this.checkoutButton();
      // Ancla por el botón nativo; si no existe (ej. show_checkout_button=false),
      // cae al contenedor de checkout más cercano al propio picker.
      const scope =
        (btn && btn.closest('.cart-drawer__checkout-buttons, #cart, .cart__summary')) ||
        this.closest('.cart-drawer__checkout-buttons, #cart, .cart__summary') ||
        (btn && btn.parentElement);
      return scope ? scope.querySelector('.dynamic-cart-btns') : null;
    }

    gate() {
      const block = this.shouldBlock();

      this.checkoutButtons().forEach((btn) => {
        this.observeCheckout(btn);
        if (block && !btn.disabled) {
          btn.disabled = true;
          btn.dataset.deliveryDisabled = '1';
        } else if (!block && btn.dataset.deliveryDisabled) {
          btn.disabled = false;
          delete btn.dataset.deliveryDisabled;
        }
      });

      // Express (Shop Pay/Apple Pay/PayPal): NO es <button name=checkout> y salta
      // el submit del form. Se neutraliza con `inert` (bloquea mouse Y teclado y lo
      // saca del árbol de accesibilidad — pointer-events por sí solo no frena el
      // teclado). Se mantiene bloqueado también mientras `saving`, hasta que el
      // POST del carrito confirme la fecha (Shop Pay lee el carrito server-side).
      const expressBlock = block || this.saving;
      const express = this.expressButtons();
      if (express) {
        if (expressBlock) {
          express.setAttribute('data-delivery-blocked', '1');
          express.inert = true;
        } else if (express.hasAttribute('data-delivery-blocked')) {
          express.removeAttribute('data-delivery-blocked');
          express.inert = false;
        }
      }

      // Muestra la instrucción apenas hay opciones cargadas y falta elegir (no
      // durante el parpadeo de carga), aunque el cliente no haya tocado nada aún.
      if (this.error) this.error.hidden = !(block && this.loaded);
    }

    handleSubmit(evt) {
      if (this.shouldBlock()) {
        evt.preventDefault();
        this.touched = true;
        this.expanded = true;
        this.renderCollapsed();
        if (this.error) this.error.hidden = false;
        try {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
          /* noop */
        }
      }
    }
  }

  customElements.define('delivery-picker', DeliveryPicker);
}
