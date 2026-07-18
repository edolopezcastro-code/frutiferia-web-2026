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
 */
if (!customElements.get('delivery-picker')) {
  var CACHE_TTL_MS = 10 * 60 * 1000;
  var cache = null; // { at, dates, zones, window } — compartido entre instancias
  var MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function cartUpdateUrl() {
    return (window.theme && theme.routes && theme.routes.cartUpdate) || '/cart/update.js';
  }

  class DeliveryPicker extends HTMLElement {
    constructor() {
      super();
      this.dateSelect = this.querySelector('.js-delivery-date');
      this.zoneSelect = this.querySelector('.js-delivery-zone');
      this.error = this.querySelector('.js-delivery-error');
      this.url = this.getAttribute('data-availability-url') || '';
      this.selectedDate = this.getAttribute('data-selected-date') || '';
      this.selectedZone = this.getAttribute('data-selected-zone') || '';
      this.window = this.getAttribute('data-window') || '12:00-16:00';
      this.formId = this.getAttribute('data-form') || 'cart';
      this.touched = false;
      this.loaded = false;
      this.loading = false; // fetch de disponibilidad en curso → bloquear entretanto
      this.saving = false;  // POST /cart/update.js en curso → mantener express bloqueado
      this.hasOptions = false; // hay al menos un día Y una zona seleccionables
      this.onChange = this.handleChange.bind(this);
      this.onSubmit = this.handleSubmit.bind(this);
    }

    connectedCallback() {
      if (this.dateSelect) this.dateSelect.addEventListener('change', this.onChange);
      if (this.zoneSelect) this.zoneSelect.addEventListener('change', this.onChange);
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
      if (this.form) this.form.removeEventListener('submit', this.onSubmit);
      if (this.btnObserver) this.btnObserver.disconnect();
    }

    /**
     * El carrito de Canopy re-habilita el botón de checkout una vez, tarde en la
     * hidratación (después de nuestro primer gate), dejándolo clickeable pese a
     * faltar día/zona. Observamos su atributo `disabled` y re-aplicamos el gate
     * cuando algo lo cambia — así el estado visual siempre refleja la intención,
     * sin polling. gate() solo escribe cuando el estado DEBE cambiar, así que el
     * observer converge en un ciclo (no hay loop). Se engancha una sola vez, el
     * primer gate() en que el botón ya existe en el DOM.
     */
    observeCheckout(btn) {
      if (this.btnObserver || !btn || typeof MutationObserver === 'undefined') return;
      this.btnObserver = new MutationObserver(() => this.gate());
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
      const nDates = this.renderDates(data.dates);
      this.renderZones(data.zones);
      this.loaded = true;
      // Sin días O sin zonas seleccionables (blackout, o todas las fechas cayeron
      // por el filtro de "hoy/pasado") NO se puede EXIGIR elegir de una lista
      // vacía → fail-open, si no el cliente queda bloqueado para siempre.
      this.hasOptions = nDates > 0 && Array.isArray(data.zones) && data.zones.length > 0;
      if (!this.hasOptions) this.showNoOptionsHint();
      this.gate();
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

    /** "Hoy" en America/Santiago (YYYY-MM-DD) para descartar fechas caducas de caché. */
    santiagoToday() {
      try {
        return new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
        }).format(new Date());
      } catch (e) {
        return '';
      }
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
        this.save();
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
        this.save();
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
      // Mientras el POST no confirme, el carrito server-side aún no tiene la fecha
      // → mantener bloqueado el checkout express (Shop Pay lee el carrito, NO el
      // form). El botón nativo es seguro: envía los <select> inline con el form.
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

    /** Botón de checkout asociado a este form (drawer usa form="...", la página lo anida). */
    checkoutButton() {
      return (
        document.querySelector('button[name="checkout"][form="' + this.formId + '"]') ||
        (this.form && this.form.querySelector('button[name="checkout"]:not([form])')) ||
        null
      );
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

      const btn = this.checkoutButton();
      if (btn) {
        this.observeCheckout(btn);
        if (block && !btn.disabled) {
          btn.disabled = true;
          btn.dataset.deliveryDisabled = '1';
        } else if (!block && btn.dataset.deliveryDisabled) {
          btn.disabled = false;
          delete btn.dataset.deliveryDisabled;
        }
      }

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
