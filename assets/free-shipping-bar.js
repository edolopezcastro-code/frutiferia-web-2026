/* ============================================================
   Free Shipping Bar — actualización en vivo del progreso de envío gratis.
   Estrategia: en vez de re-renderizar la sección (que reinicia las
   transiciones), parcheamos el nodo vivo (--progress, mensaje, clases)
   leyendo /cart.js tras cada mutación del carrito. Así la barra "desliza"
   suave y la celebración se dispara una sola vez al cruzar el umbral.
   ============================================================ */
(function () {
  'use strict';

  var CART_MUTATION_RE = /\/cart\/(add|change|update|clear)(\.js)?(\?|$)/i;

  /* --- 1. Detectar mutaciones del carrito una sola vez, globalmente --- */
  function installCartWatcher() {
    if (window.__fbarCartWatcher) return;
    window.__fbarCartWatcher = true;

    var notify = function () {
      // micro-debounce: el tema puede disparar varias llamadas seguidas
      clearTimeout(window.__fbarT);
      window.__fbarT = setTimeout(function () {
        document.dispatchEvent(new CustomEvent('fbar:cart-changed'));
      }, 120);
    };

    // Envolver fetch (Canopy usa fetch para todo el carrito)
    if (window.fetch) {
      var origFetch = window.fetch;
      window.fetch = function () {
        var url = '';
        try { url = (arguments[0] && arguments[0].url) || String(arguments[0] || ''); } catch (e) {}
        var p = origFetch.apply(this, arguments);
        if (CART_MUTATION_RE.test(url)) p.then(notify).catch(function () {});
        return p;
      };
    }

    // Envolver XHR por si algún componente legacy lo usa
    if (window.XMLHttpRequest) {
      var origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url) {
        try { this.__fbarUrl = url; } catch (e) {}
        return origOpen.apply(this, arguments);
      };
      var origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        if (this.__fbarUrl && CART_MUTATION_RE.test(this.__fbarUrl)) {
          this.addEventListener('load', notify);
        }
        return origSend.apply(this, arguments);
      };
    }

    // Eventos custom que algunos temas/apps emiten
    ['cart:updated', 'cart:refresh', 'cart:change'].forEach(function (ev) {
      document.addEventListener(ev, notify);
    });
  }

  /* --- 2. El elemento --- */
  var CONFETTI_COLORS = ['#A531EA', '#2DB87F', '#FFE6A3', '#FFFFFF', '#C56BF2'];

  class FreeShippingBar extends HTMLElement {
    connectedCallback() {
      var cfgEl = this.querySelector('[data-fbar-config]');
      try { this.cfg = JSON.parse(cfgEl.textContent); } catch (e) { this.cfg = {}; }
      this.threshold = parseInt(this.dataset.threshold, 10) || this.cfg.threshold || 0;

      this.bar = this.querySelector('.fbar');
      this.msgEl = this.querySelector('[data-fbar-msg]');
      this.iconEl = this.querySelector('.fbar__icon');
      this.confettiEl = this.querySelector('[data-fbar-confetti]');

      this.fmt = makeFormatter(this.cfg.currency);
      // estado inicial según lo renderizado por el servidor
      this.reached = this.dataset.state === 'done';

      installCartWatcher();
      this._onChange = this.refresh.bind(this);
      document.addEventListener('fbar:cart-changed', this._onChange);
    }

    disconnectedCallback() {
      document.removeEventListener('fbar:cart-changed', this._onChange);
    }

    refresh() {
      var self = this;
      var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      fetch(root + 'cart.js', { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (cart) { self.render(cart.total_price || 0, cart.item_count || 0); })
        .catch(function () {});
    }

    render(totalCents, itemCount) {
      var threshold = this.threshold;
      var pct = threshold > 0 ? Math.min(100, (totalCents * 100) / threshold) : 0;
      var falta = Math.max(0, threshold - totalCents);

      var state = 'progress';
      if (itemCount <= 0) state = 'empty';
      else if (totalCents >= threshold) state = 'done';

      // barra (transición suave por CSS)
      this.bar.style.setProperty('--progress', pct + '%');
      this.bar.classList.remove('fbar--empty', 'fbar--progress', 'fbar--done');
      this.bar.classList.add('fbar--' + state);
      this.dataset.state = state;
      if (this.iconEl) this.iconEl.textContent = state === 'done' ? '🎉' : '🚚';

      // mensaje
      var tpl = state === 'empty' ? this.cfg.copyEmpty
              : state === 'done' ? this.cfg.copyDone
              : this.cfg.copyProgress;
      if (this.msgEl && tpl != null) {
        this.msgEl.innerHTML = fillTemplate(tpl, {
          falta: '<b class="fbar__hero">' + escapeHtml(this.fmt(falta)) + '</b>',
          total: escapeHtml(this.fmt(totalCents)),
          threshold: escapeHtml(this.cfg.thresholdLabel || this.fmt(threshold)),
          days: escapeHtml(this.cfg.days || '')
        });
      }

      // celebración: solo al CRUZAR de no-logrado a logrado
      var nowReached = state === 'done';
      if (nowReached && !this.reached) this.celebrate();
      this.reached = nowReached;
    }

    celebrate() {
      if (!this.bar || !this.confettiEl) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.confettiEl.innerHTML = '';
      for (var i = 0; i < 14; i++) {
        var s = document.createElement('span');
        s.style.left = (5 + Math.random() * 90).toFixed(1) + '%';
        s.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        s.style.setProperty('--dur', (820 + Math.random() * 360).toFixed(0) + 'ms');
        s.style.setProperty('--delay', (Math.random() * 180).toFixed(0) + 'ms');
        this.confettiEl.appendChild(s);
      }
      this.bar.classList.add('is-celebrating');
      var bar = this.bar, confetti = this.confettiEl;
      setTimeout(function () {
        bar.classList.remove('is-celebrating');
        confetti.innerHTML = '';
      }, 1600);
    }
  }

  function fillTemplate(tpl, vars) {
    return tpl.replace(/\{(falta|total|threshold|days)\}/g, function (m, k) {
      return vars[k] != null ? vars[k] : '';
    });
  }

  /* --- helpers --- */
  function makeFormatter(currency) {
    var cur = currency || 'CLP';
    try {
      var nf = new Intl.NumberFormat('es-CL', {
        style: 'currency', currency: cur, maximumFractionDigits: 0
      });
      return function (cents) { return nf.format(Math.round(cents / 100)); };
    } catch (e) {
      return function (cents) {
        return '$' + Math.round(cents / 100).toLocaleString('es-CL');
      };
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* --- registrar --- */
  if ('customElements' in window && !customElements.get('free-shipping-bar')) {
    customElements.define('free-shipping-bar', FreeShippingBar);
  }
})();
