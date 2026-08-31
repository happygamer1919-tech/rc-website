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

  function applyFilter(btn) {
    var want = btn.getAttribute('data-filter');
    filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    var shown = 0;
    projects.forEach(function (card) {
      var match = want === 'all' || card.getAttribute('data-cat') === want;
      card.hidden = !match;
      if (match) shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown !== 0;
  }

  filters.forEach(function (btn, i) {
    btn.addEventListener('click', function () { applyFilter(btn); });

    // Arrow keys move between tabs, Home/End jump to the ends. Tab still
    // reaches them; this just makes the group behave the way a tab group should.
    btn.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = filters[(i + 1) % filters.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = filters[(i - 1 + filters.length) % filters.length];
      else if (e.key === 'Home') next = filters[0];
      else if (e.key === 'End') next = filters[filters.length - 1];
      if (!next) return;
      e.preventDefault();
      next.focus();
      applyFilter(next);
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
    var header = document.querySelector('.header');
    var offset = header ? header.getBoundingClientRect().height : 72;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
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
    e.preventDefault();

    var bad = checks.filter(function (f) { return !validate(f); });
    if (bad.length) { bad[0].input.focus(); return; }

    // No endpoint key at build time: validate, then say so. Never post.
    if (form.getAttribute('data-armed') !== '1') {
      status.hidden = false;
      status.textContent = form.getAttribute('data-demo');
      status.style.color = '#5A5A5A';
      return;
    }

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

  /* --- phase 2 ------------------------------------------------------------ */

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 3. sticky header: shadow + compression past 40px.
     Passive listener, rAF-throttled. It reads scroll, never alters it. */
  (function () {
    var header = document.querySelector('.header');
    if (!header) return;
    var panel = document.getElementById('mobile-panel');
    var ticking = false;
    function sync() {
      var scrolled = window.pageYOffset > 40;
      header.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
      if (panel) panel.style.top = header.getBoundingClientRect().height + 'px';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sync);
    }, { passive: true });
    sync();
  })();

  /* 2. scroll reveal. IntersectionObserver only: no scroll listener, no scroll
     mutation, unobserved the moment it fires so it never repeats. */
  (function () {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-revealed');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    nodes.forEach(function (n) { io.observe(n); });
  })();

  /* 4. marquee keyboard focus. The pause and the colour restore are pure CSS;
     this exists only to undo a side effect of tabbing. An overflow:hidden box
     is still a scroll container, so the browser scrolls it sideways to reveal
     a focused tile. That keeps the focus ring visible, which is what we want,
     but the offset must not survive after focus leaves or the -50% seam lands
     in the wrong place. Nothing here reads or writes page scroll. */
  (function () {
    var viewport = document.querySelector('.marquee__viewport');
    if (!viewport) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    viewport.addEventListener('focusout', function (e) {
      // Under reduced motion the track does not move and the box is a plain
      // horizontal scroll region the reader drives. Their position is theirs.
      if (reduced.matches) return;
      if (e.relatedTarget && viewport.contains(e.relatedTarget)) return;
      viewport.scrollLeft = 0;
    });
  })();

  /* 5. lead capture modal */
  (function () {
    var modal = document.getElementById('lead-modal');
    if (!modal) return;

    var KEY = 'rc-lead-shown';
    var panel = modal.querySelector('.modal__panel');
    var closeBtn = document.getElementById('lead-modal-close');
    var leadForm = document.getElementById('lead-form');
    var leadStatus = document.getElementById('lead-status');
    var phone = document.getElementById('lead-phone');
    var phoneErr = document.getElementById('lead-phone-err');
    var lastFocus = null;
    var timer = null;
    var open = false;

    function seen() {
      try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
    }
    function markSeen() {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode */ }
    }

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(
        'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) {
        // The honeypot is off-screen and tabindex=-1, but still matches the
        // input selector. It must never receive focus.
        if (el.closest('.honeypot')) return false;
        if (el.getAttribute('tabindex') === '-1') return false;
        return true;
      });
    }

    function openModal() {
      if (open || seen()) return;
      markSeen();
      teardownTriggers();
      lastFocus = document.activeElement;
      modal.hidden = false;
      open = true;
      // The page keeps its scroll position and is never locked mid-gesture;
      // the overlay simply covers it.
      (phone || closeBtn).focus();
    }

    function closeModal() {
      if (!open) return;
      modal.hidden = true;
      open = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    modal.addEventListener('mousedown', function (e) { if (e.target === modal) closeModal(); });
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* Triggers: 30s, 50% depth, or (desktop) pointer exiting through the top.
       The scroll trigger is a passive read of position. It never intervenes. */
    function onScrollDepth() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (max > 0 && window.pageYOffset / max >= 0.5) openModal();
    }
    function onExitIntent(e) {
      if (e.clientY <= 0 && !e.relatedTarget) openModal();
    }
    function teardownTriggers() {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScrollDepth);
      document.removeEventListener('mouseout', onExitIntent);
    }

    if (!seen()) {
      timer = setTimeout(openModal, 30000);
      window.addEventListener('scroll', onScrollDepth, { passive: true });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mouseout', onExitIntent);
      }
    }

    // Suppress permanently once the main form has been submitted.
    var mainForm = document.getElementById('quote-form');
    if (mainForm) {
      mainForm.addEventListener('submit', function () { markSeen(); teardownTriggers(); });
    }

    /* Same validation rule and same demo-mode contract as the main form. */
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var good = phone.value.replace(/\D/g, '').length >= 8;
      phoneErr.hidden = good;
      phone.setAttribute('aria-invalid', good ? 'false' : 'true');
      if (!good) { phone.focus(); return; }

      if (leadForm.getAttribute('data-armed') !== '1') {
        leadStatus.hidden = false;
        leadStatus.textContent = leadForm.getAttribute('data-demo');
        leadStatus.style.color = '#5A5A5A';
        return;
      }
      var button = leadForm.querySelector('button[type="submit"]');
      button.disabled = true;
      leadStatus.hidden = false;
      leadStatus.textContent = '…';
      fetch(leadForm.action, { method: 'POST', body: new FormData(leadForm) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.success) throw new Error('rejected');
          leadForm.reset();
          leadStatus.textContent = leadForm.getAttribute('data-ok');
        })
        .catch(function () { leadStatus.textContent = leadForm.getAttribute('data-fail'); })
        .then(function () { button.disabled = false; leadStatus.style.color = '#B23C08'; });
    });
  })();
})();
