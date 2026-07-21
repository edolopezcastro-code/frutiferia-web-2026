/* global theme, debounce */
/*
 * factura-fields — captura de datos de facturación B2B en el carrito (compra de
 * empresa). Toggle revela RUT Empresa/Razón Social/Giro/Email Facturación +
 * setea attributes[Documento]='Factura'; viajan como note_attributes igual que
 * delivery-picker. Se guarda vía /cart/update.js en cada cambio (debounced en
 * los inputs de texto) para que el estado sobreviva un re-render del drawer o
 * un reload sin haber llegado a pagar — mismo motivo que delivery-picker.js
 * necesita el fetch en vez de confiar solo en el submit nativo del form.
 * Toggle OFF limpia los 5 attributes en el carrito (value: '' los remueve,
 * como en delivery-picker) y deshabilita los inputs para que tampoco viajen
 * si el form nativo se envía antes de que el fetch de limpieza confirme.
 * La validación de RUT (módulo 11) es solo visual — NO bloquea el checkout.
 */
if (!customElements.get('factura-fields')) {
  function cartUpdateUrl() {
    return (window.theme && theme.routes && theme.routes.cartUpdate) || '/cart/update.js';
  }

  function cleanRut(value) {
    return (value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  }

  function formatRut(value) {
    const clean = cleanRut(value);
    if (clean.length < 2) return clean;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return `${body}-${dv}`;
  }

  function computeDv(body) {
    let sum = 0;
    let mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    if (res === 11) return '0';
    if (res === 10) return 'K';
    return String(res);
  }

  function isValidRut(value) {
    const clean = cleanRut(value);
    if (clean.length < 2) return false;
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    if (!/^\d+$/.test(body)) return false;
    return computeDv(body) === dv;
  }

  class FacturaFields extends HTMLElement {
    constructor() {
      super();
      this.toggle = this.querySelector('.js-factura-toggle');
      this.panel = this.querySelector('.factura-fields__panel');
      this.documento = this.querySelector('.js-factura-documento');
      this.rutInput = this.querySelector('.js-factura-rut');
      this.rutError = this.querySelector('.js-factura-rut-error');
      this.razonInput = this.querySelector('.js-factura-razon');
      this.giroInput = this.querySelector('.js-factura-giro');
      this.emailInput = this.querySelector('.js-factura-email');
      this.textFields = [this.razonInput, this.giroInput, this.emailInput].filter(Boolean);
      this.allFields = [this.documento, this.rutInput, this.razonInput, this.giroInput, this.emailInput].filter(Boolean);

      this.debouncedSave = debounce(this.save.bind(this), 400);
      this.onToggle = this.handleToggle.bind(this);
      this.onRutInput = this.handleRutInput.bind(this);
      this.onFieldInput = this.handleFieldInput.bind(this);
    }

    connectedCallback() {
      if (this.toggle) this.toggle.addEventListener('change', this.onToggle);
      if (this.rutInput) this.rutInput.addEventListener('input', this.onRutInput);
      this.textFields.forEach((el) => el.addEventListener('input', this.onFieldInput));
      this.applyState(!!(this.toggle && this.toggle.checked), { skipSave: true });
    }

    disconnectedCallback() {
      if (this.toggle) this.toggle.removeEventListener('change', this.onToggle);
      if (this.rutInput) this.rutInput.removeEventListener('input', this.onRutInput);
      this.textFields.forEach((el) => el.removeEventListener('input', this.onFieldInput));
    }

    applyState(on, opts) {
      const options = opts || {};
      if (this.panel) this.panel.hidden = !on;
      this.allFields.forEach((el) => { el.disabled = !on; });
      if (this.documento) this.documento.value = on ? 'Factura' : '';
      if (!on) {
        [this.rutInput, this.razonInput, this.giroInput, this.emailInput].forEach((el) => {
          if (el) el.value = '';
        });
        if (this.rutError) this.rutError.hidden = true;
        if (this.rutInput) this.rutInput.classList.remove('is-invalid');
      }
      if (!options.skipSave) this.debouncedSave();
    }

    handleToggle() {
      this.applyState(this.toggle.checked);
    }

    handleRutInput() {
      const atEnd = this.rutInput.selectionEnd === this.rutInput.value.length;
      this.rutInput.value = formatRut(this.rutInput.value);
      if (atEnd) this.rutInput.setSelectionRange(this.rutInput.value.length, this.rutInput.value.length);

      const valid = this.rutInput.value === '' || isValidRut(this.rutInput.value);
      if (this.rutError) this.rutError.hidden = valid;
      this.rutInput.classList.toggle('is-invalid', !valid);
      this.debouncedSave();
    }

    handleFieldInput() {
      this.debouncedSave();
    }

    save() {
      if (!this.toggle) return;
      const on = this.toggle.checked;
      const attributes = {
        Documento: on ? 'Factura' : '',
        'RUT Empresa': on && this.rutInput ? this.rutInput.value : '',
        'Razón Social': on && this.razonInput ? this.razonInput.value : '',
        Giro: on && this.giroInput ? this.giroInput.value : '',
        'Email Facturación': on && this.emailInput ? this.emailInput.value : '',
      };
      fetch(cartUpdateUrl(), {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes }),
      }).catch((e) => console.warn('[factura-fields] no se pudo guardar', e));
    }
  }

  customElements.define('factura-fields', FacturaFields);
}
