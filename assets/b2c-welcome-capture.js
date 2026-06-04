/*
 * b2c-welcome-capture.js
 * ------------------------------------------------------------
 * Captura el email de los formularios de newsletter/popup y lo
 * envia a la edge function `b2c-welcome-intake` de Frutiferia-OS
 * (CRM B2C + correo de bienvenida PRIMERA20), SIN bloquear el envio
 * nativo de Shopify (que sigue creando el suscriptor).
 *
 * Activacion: el snippet newsletter-signup empuja config por form:
 *   window.FrutiB2CCapture.push({ formId, endpoint });
 *
 * Solo manda el email (los forms de newsletter son email-only) +
 * un honeypot anti-spam. keepalive sobrevive a la navegacion del
 * submit nativo. Fail-soft: nunca rompe el envio de Shopify.
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  function send(cfg, form) {
    var emailEl = form.querySelector('input[type="email"]');
    if (!emailEl || !emailEl.value) return;
    var hpEl = form.querySelector('[name="contact[b2c-hp]"]');
    var payload = {
      email: emailEl.value,
      hp: hpEl ? hpEl.value : '',
      page: window.location.pathname,
      url: window.location.href,
      submitted_at: new Date().toISOString()
    };
    try {
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
    if (!form || form.dataset.frutiB2cWired) return;
    form.dataset.frutiB2cWired = '1';
    form.addEventListener('submit', function () {
      send(cfg, form);
      // sin preventDefault: dejamos que Shopify procese el alta normal
    });
  }

  var queue = window.FrutiB2CCapture || [];
  window.FrutiB2CCapture = { push: wire };
  for (var i = 0; i < queue.length; i++) wire(queue[i]);
})();
