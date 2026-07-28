/*
 * catalogo-b2b.js
 * ------------------------------------------------------------
 * Entrega el catalogo mayorista a cambio del correo, y manda el
 * lead al CRM por la misma edge function del formulario de
 * cotizacion (b2b-lead-intake).
 *
 * El payload se arma con las MISMAS etiquetas que lee la edge
 * function ("Nombre", "Correo electronico", "Nombre de tu negocio",
 * "Mensaje"). Si se renombran aca, el lead entra sin datos.
 *
 * Regla: el catalogo se entrega SIEMPRE, aunque el POST al CRM
 * falle. Un problema nuestro no puede costarle la descarga al
 * prospecto.
 * ------------------------------------------------------------
 */
(function () {
  'use strict';

  var cfgEl = document.getElementById('fru-catalogo-config');
  var form = document.getElementById('fru-catalogo-form');
  var done = document.getElementById('fru-catalogo-done');
  var link = document.getElementById('fru-catalogo-link');
  if (!cfgEl || !form || !done || !link) return;

  var cfg;
  try {
    cfg = JSON.parse(cfgEl.textContent);
  } catch (e) {
    return;
  }
  if (!cfg || !cfg.catalogUrl) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function entregar() {
    form.hidden = true;
    done.hidden = false;
    try {
      window.open(cfg.catalogUrl, '_blank', 'noopener');
    } catch (e) {
      /* si el navegador bloquea la ventana, el boton visible resuelve */
    }
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    // honeypot: se entrega igual para no darle señal al bot, pero no se registra
    if (val('fru-cat-hp')) {
      entregar();
      return;
    }

    var nombre = val('fru-cat-nombre');
    var email = val('fru-cat-email');
    var negocio = val('fru-cat-negocio');

    // la edge function exige nombre + (correo o telefono); aca siempre pedimos correo
    if (!nombre || !email) {
      if (typeof form.reportValidity === 'function') form.reportValidity();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando…';
    }

    var payload = {
      source: cfg.source || 'web-b2b-catalogo',
      page: window.location.pathname,
      url: window.location.href,
      submitted_at: new Date().toISOString(),
      fields: {
        'Nombre': nombre,
        'Correo electrónico': email,
        'Nombre de tu negocio': negocio,
        'Mensaje': 'Descargó el catálogo mayorista desde la landing B2B.'
      }
    };

    if (!cfg.endpoint) {
      entregar();
      return;
    }

    fetch(cfg.endpoint, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .catch(function () {})
      .then(function () {
        entregar();
      });
  });
})();
