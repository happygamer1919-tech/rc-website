/* Rapid Construct — filters, hamburger, anchor scroll, form validation.
   No animation, no dependencies. Portfolio filters switch instantly. */
(function () {
  'use strict';

  /* --- hamburger ---------------------------------------------------------- */
  var toggle = document.getElementById('menu-toggle');
  var panel = document.getElementById('mobile-panel');

  function setHidden(el, hide) {
    if (hide) el.setAttribute('hidden', ''); else el.removeAttribute('hidden');
  }

  function setMenu(open) {
    panel.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', toggle.getAttribute(open ? 'data-label-close' : 'data-label-open'));
    // NB: `.hidden` does not reflect to the attribute on SVGElement (it is not
    // an HTMLElement), so toggle the attribute itself or the icons never swap.
    setHidden(toggle.querySelector('.icon-menu'), open);
    setHidden(toggle.querySelector('.icon-close'), !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(panel.getAttribute('data-open') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && panel.getAttribute('data-open') === 'true') setMenu(false);
    });
  }

  /* --- portfolio filters --------------------------------------------------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var projects = Array.prototype.slice.call(document.querySelectorAll('.project'));
  var emptyMsg = document.getElementById('portfolio-empty');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      projects.forEach(function (card) {
        var match = want === 'all' || card.getAttribute('data-cat') === want;
        card.hidden = !match;
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown !== 0;
    });
  });

  /* --- anchor scroll, offset for the 72px sticky header -------------------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* --- form validation, name and phone only -------------------------------- */
  var form = document.getElementById('quote-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var checks = [
    { input: form.querySelector('#f-name'), error: document.getElementById('e-name'), ok: function (v) { return v.trim().length >= 2; } },
    { input: form.querySelector('#f-phone'), error: document.getElementById('e-phone'), ok: function (v) { return (v.replace(/\D/g, '').length >= 8); } },
    { input: form.querySelector('#f-consent'), error: document.getElementById('e-consent'), ok: null },
  ];

  function validate(field) {
    var el = field.input;
    var good = field.ok ? field.ok(el.value) : el.checked;
    field.error.hidden = good;
    el.setAttribute('aria-invalid', good ? 'false' : 'true');
    return good;
  }

  checks.forEach(function (f) {
    f.input.addEventListener('blur', function () { validate(f); });
    f.input.addEventListener('input', function () { if (f.error.hidden === false) validate(f); });
  });

  form.addEventListener('submit', function (e) {
    var bad = checks.filter(function (f) { return !validate(f); });
    if (bad.length) { e.preventDefault(); bad[0].input.focus(); return; }

    e.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.hidden = false;
    status.textContent = '…';

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success) {
          form.reset();
          status.textContent = form.getAttribute('data-ok') || '✓';
          status.style.color = '#B23C08';
        } else {
          throw new Error('rejected');
        }
      })
      .catch(function () {
        status.textContent = form.getAttribute('data-fail') || '✕';
        status.style.color = '#B23C08';
      })
      .then(function () { button.disabled = false; });
  });
})();
