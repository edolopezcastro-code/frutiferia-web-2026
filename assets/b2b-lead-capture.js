/*
 * b2b-lead-capture.js
 * ------------------------------------------------------------
 * Captura los leads del formulario de cotizacion B2B y los envia
 * a una edge function de Frutiferia-OS (CRM B2B), SIN bloquear el
 * envio nativo de Shopify (que queda como respaldo + notificacion).
 *
 * Activacion: la seccion contact-form empuja una config a
 * window.FrutiLeadCapture cuando tiene un endpoint configurado.
 *   window.FrutiLeadCapture.push({ formId, endpoint, source });
 *
 * El payload se arma leyendo el <label> de cada campo (es-CL,
 * estable porque lo controlamos en el JSON de la pagina), asi no
 * dependemos de los "name" generados por Shopify.
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  function fieldLabel(form, el) {
    if (el.id) {
      var lbl = form.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      if (lbl && lbl.textContent.trim()) return lbl.textContent.trim();
    }
    return el.getAttribute('name') || el.id || '';
  }

  function collectFields(form) {
    var out = {};
    var els = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.name || el.type === 'hidden' || el.type === 'submit' || el.type === 'button') continue;
      // honeypot anti-spam: si trae algo, se ignora el lead
      if (el.name === 'contact[b2b-hp]') {
        if (el.value) return null;
        continue;
      }
      var label = fieldLabel(form, el);
      if (!label) continue;
      out[label] = el.value;
    }
    return out;
  }

  function send(cfg, form) {
    var fields = collectFields(form);
    if (fields === null) return; // honeypot disparado
    var payload = {
      source: cfg.source || 'web-b2b',
      page: window.location.pathname,
      url: window.location.href,
      submitted_at: new Date().toISOString(),
      fields: fields
    };
    try {
      // keepalive: sobrevive a la navegacion del submit nativo de Shopify
      fetch(cfg.endpoint, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {
      /* fail-soft: nunca rompemos el envio nativo */
    }
  }

  function wire(cfg) {
    if (!cfg || !cfg.formId || !cfg.endpoint) return;
    var form = document.getElementById(cfg.formId);
    if (!form || form.dataset.frutiWired) return;
    form.dataset.frutiWired = '1';
    form.addEventListener('submit', function () {
      send(cfg, form);
      // no preventDefault: dejamos que Shopify procese y notifique igual
    });
  }

  var queue = window.FrutiLeadCapture || [];
  window.FrutiLeadCapture = { push: wire };
  for (var i = 0; i < queue.length; i++) wire(queue[i]);
})();
