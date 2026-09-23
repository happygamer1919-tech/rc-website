/* Rapid Construct: filters, hamburger, anchor scroll, form validation.
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
      if (window.innerWidth > 1100 && panel.getAttribute('data-open') === 'true') setMenu(false); // W14-15: the header collapses at 1100px
    });
  }

  /* --- W14-06 catalog mega-menu ------------------------------------------- */
  /* Present only when content/catalog.json has categories. The toggle opens it
     on click, never on hover. A parent row's subcategories open on hover only
     where hover exists and the viewport is wider than 768px; everywhere, the
     row's chevron button opens the same list, which below 768px is a drill-down
     over the parent list. No animation, and no handler touches scrolling. */
  (function () {
    var btn = document.getElementById('catalog-toggle');
    var sheet = document.getElementById('catalog-panel');
    if (!btn || !sheet) return;
    /* W19-D10. The sheet is also what a short viewport wider than 768px gets (a
       phone held sideways), so "mobile" is the sheet, not the width, and the
       hover flyout needs the height to hold it. Same queries as src/styles.css. */
    var flyout = window.matchMedia('(hover: hover) and (min-width: 769px) and (min-height: 501px)');
    var mobile = window.matchMedia('(max-width: 768px), (min-width: 769px) and (max-height: 500px)');
    var top = sheet.querySelectorAll('.catalog__list--top > .catalog__row');
    var parents = sheet.querySelectorAll('.catalog__list--top > .catalog__row--parent');

    function closeSubs(except) {
      Array.prototype.forEach.call(parents, function (row) {
        if (row === except) return;
        row.classList.remove('is-active');
        row.querySelector('.catalog__expand').setAttribute('aria-expanded', 'false');
        row.querySelector('.catalog__sub').setAttribute('hidden', '');
      });
    }
    function openSub(row) {
      closeSubs(row);
      row.hoverOpened = false;
      row.classList.add('is-active');
      row.querySelector('.catalog__expand').setAttribute('aria-expanded', 'true');
      row.querySelector('.catalog__sub').removeAttribute('hidden');
    }
    function isOpen() { return !sheet.hasAttribute('hidden'); }
    function setOpen(open) {
      if (open) {
        var burger = document.getElementById('mobile-panel');
        var burgerBtn = document.getElementById('menu-toggle');
        if (burger && burgerBtn && burger.getAttribute('data-open') === 'true') burgerBtn.click();
        sheet.removeAttribute('hidden');
      } else {
        sheet.setAttribute('hidden', '');
        closeSubs(null);
      }
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (mobile.matches) document.body.style.overflow = open ? 'hidden' : '';
    }

    btn.addEventListener('click', function () { setOpen(!isOpen()); });
    document.addEventListener('click', function (e) {
      if (isOpen() && !e.target.closest('.catalog')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); }
    });
    var burgerBtn = document.getElementById('menu-toggle');
    if (burgerBtn) burgerBtn.addEventListener('click', function () { if (isOpen()) setOpen(false); });
    window.addEventListener('resize', function () { if (isOpen()) setOpen(false); });

    Array.prototype.forEach.call(top, function (row) {
      row.addEventListener('mouseenter', function () {
        if (!flyout.matches) return;
        if (row.classList.contains('catalog__row--parent')) {
          if (row.querySelector('.catalog__sub').hasAttribute('hidden')) { openSub(row); row.hoverOpened = true; }
        } else {
          closeSubs(null);
        }
      });
    });
    Array.prototype.forEach.call(parents, function (row) {
      var expand = row.querySelector('.catalog__expand');
      var backBtn = row.querySelector('.catalog__back');
      /* W19-D3. A mouse cannot reach the chevron without entering its row, so on
         a hover screen the list is already open when the click lands, and a plain
         toggle closed what the visitor was asking to see. The first click on a
         list that hover opened keeps it open; from then on the chevron toggles as
         before. Keyboard (the pointer elsewhere), touch and the phone drill-down
         never set the flag, so they toggle exactly as they did. */
      expand.addEventListener('click', function () {
        if (row.querySelector('.catalog__sub').hasAttribute('hidden')) {
          openSub(row);
          if (mobile.matches) backBtn.focus();
        } else if (row.hoverOpened) {
          row.hoverOpened = false;
        } else {
          closeSubs(null);
        }
      });
      backBtn.addEventListener('click', function () { closeSubs(null); expand.focus(); });
    });
  })();

  /* --- W15-02 Servicii dropdown (RC-126) ---------------------------------- */
  /* The same model as the catalog menu above: a button, click to open, never on
     hover. One level, so there is no drill-down and no back button. Opening
     either menu closes the other, and the burger closes both. No animation, and
     no handler touches scrolling. */
  (function () {
    var btn = document.getElementById('svcmenu-toggle');
    var sheet = document.getElementById('svcmenu-panel');
    if (!btn || !sheet) return;
    function isOpen() { return !sheet.hasAttribute('hidden'); }
    function setOpen(open) {
      if (open) {
        var cat = document.getElementById('catalog-panel');
        var catBtn = document.getElementById('catalog-toggle');
        if (cat && catBtn && !cat.hasAttribute('hidden')) catBtn.click();
        sheet.removeAttribute('hidden');
      } else {
        sheet.setAttribute('hidden', '');
      }
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(!isOpen()); });
    document.addEventListener('click', function (e) {
      if (isOpen() && !e.target.closest('.svcmenu')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); }
    });
    var catToggle = document.getElementById('catalog-toggle');
    if (catToggle) catToggle.addEventListener('click', function () { if (isOpen()) setOpen(false); });
    var burgerBtn = document.getElementById('menu-toggle');
    if (burgerBtn) burgerBtn.addEventListener('click', function () { if (isOpen()) setOpen(false); });
    window.addEventListener('resize', function () { if (isOpen()) setOpen(false); });
  })();

  /* --- W14-09 before/after slider ------------------------------------------- */
  /* Present only when content/before-after.json has projects. Pointer down
     anywhere on the frame jumps the divider there and a drag follows it; hover
     alone does nothing. Arrow keys on the handle move it 5 points, Home and End
     go to the ends. The arrow buttons show the previous or next project and wrap
     at both ends. The compare frame is touch-action: pan-y, so a vertical swipe
     still scrolls: no handler here calls preventDefault on a scroll gesture. */
  (function () {
    var root = document.querySelector('[data-ba]');
    if (!root) return;
    var items = root.querySelectorAll('[data-ba-item]');

    function set(compare, value) {
      var v = Math.max(0, Math.min(100, value));
      v = Math.round(v * 10) / 10;
      compare.style.setProperty('--position', v + '%');
      compare.querySelector('.ba__handle').setAttribute('aria-valuenow', String(Math.round(v)));
    }
    /* 0 is a real position. `|| 50` read it as missing and snapped the divider
       back to the middle on the next key press; caught by the acceptance test. */
    function current(compare) {
      var v = parseFloat(compare.style.getPropertyValue('--position'));
      return isNaN(v) ? 50 : v;
    }

    Array.prototype.forEach.call(items, function (item) {
      var compare = item.querySelector('.ba__compare');
      var handle = compare.querySelector('.ba__handle');
      var dragging = null;
      function fromEvent(e) {
        var r = compare.getBoundingClientRect();
        set(compare, ((e.clientX - r.left) / r.width) * 100);
      }
      compare.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        dragging = e.pointerId;
        compare.setPointerCapture(e.pointerId);
        fromEvent(e);
      });
      compare.addEventListener('pointermove', function (e) {
        if (dragging === e.pointerId) fromEvent(e);
      });
      function end(e) {
        if (dragging !== e.pointerId) return;
        dragging = null;
        if (compare.hasPointerCapture(e.pointerId)) compare.releasePointerCapture(e.pointerId);
      }
      compare.addEventListener('pointerup', end);
      compare.addEventListener('pointercancel', end);
      handle.addEventListener('keydown', function (e) {
        var step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
        if (step !== undefined) { e.preventDefault(); set(compare, current(compare) + step); }
        else if (e.key === 'Home') { e.preventDefault(); set(compare, 0); }
        else if (e.key === 'End') { e.preventDefault(); set(compare, 100); }
      });
    });

    function show(delta) {
      var at = 0;
      Array.prototype.forEach.call(items, function (item, i) { if (!item.hasAttribute('hidden')) at = i; });
      var next = (at + delta + items.length) % items.length;
      Array.prototype.forEach.call(items, function (item, i) {
        if (i === next) item.removeAttribute('hidden'); else item.setAttribute('hidden', '');
      });
    }
    var prev = root.querySelector('[data-ba-prev]');
    var nextBtn = root.querySelector('[data-ba-next]');
    if (prev) prev.addEventListener('click', function () { show(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(1); });
  })();

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

  /* --- W21-04 (RC-149), product card CTA ---------------------------------- */
  /* A category page's quote form carries a hidden `serviciu` field naming the
     category. A product card's button names the product instead, so the lead
     says which one it is about. Capture phase, so the value is set before the
     anchor scroll below moves the page. The button is a link to #oferta, so
     W19-D6's popup suppression treats it like any other quote button.

     AMENDED (W24-04): the selector is `a[data-product]`, not `[data-product]`.
     The W24-04 card carries the product on three elements, so the lead line can
     name it and two products that share a name are still told apart: the button,
     the price and the price-on-request slot. Only the button navigates, so only
     the button should set the field; a click on the price would otherwise arm the
     form for a product the visitor never asked about. */
  (function () {
    var quote = document.getElementById('quote-form');
    if (!quote) return;
    var field = quote.querySelector('input[name="serviciu"]');
    if (!field) return;
    document.addEventListener('click', function (e) {
      var cta = e.target.closest && e.target.closest('a[data-product]');
      if (!cta) return;
      field.value = cta.getAttribute('data-product');
    }, true);
  })();

  /* --- W24-09, the phone reveal on a catalogue grid ------------------------ */
  /* Below 768px a catalogue grid shows the first `data-prod-step` cards and one
     button that reveals that many more per press. Placi ceramice is 88 cards
     deep and ran the page past 33,000px at 390; nothing about that is navigable.

     THIS CODE NEVER HIDES ANYTHING BY ITSELF. It adds `.prod--folded`, and the
     only rule that acts on that class lives inside a max-width: 768px query in
     styles.css. So the desktop grid cannot regress from here however wrong a
     width test in JS might be, and with JS off nothing is folded at all: every
     card shows, which is the no-dependency behaviour the card asks for.

     The step is read off the markup (`data-prod-step`), so the number lives in
     build.js once and the gate can assert the rendered count against the number
     the page itself states.

     matchMedia, not innerWidth: a rotation or a resized window past the
     breakpoint re-runs `apply`, so a phone turned landscape is not left with
     seventy-six cards folded behind a button CSS has just stopped painting.
     The revealed count is kept across those changes, so a visitor who pressed
     three times and rotated does not lose what they had opened. */
  (function () {
    var grids = document.querySelectorAll('[data-prod-grid]');
    if (!grids.length) return;
    var mq = window.matchMedia('(max-width: 768px)');

    Array.prototype.forEach.call(grids, function (grid) {
      var cards = grid.querySelectorAll('[data-product-card]');
      var step = parseInt(grid.getAttribute('data-prod-step'), 10);
      if (!step || step < 1 || cards.length <= step) return;
      var wrap = grid.parentNode.querySelector('[data-prod-more]');
      var button = wrap && wrap.querySelector('[data-prod-more-btn]');
      if (!wrap || !button) return;
      var shown = step;

      /* W25-19. The fold counts the cards a FILTER is showing, not every card in
         the grid. On a filtered grid the two disagree: with Profnastil selected,
         eight cards are on the page and counting positions in the full list would
         fold seven of them behind a button that says there are more. `visible()`
         is the whole fix, and on every unfiltered grid it returns the full list,
         so the catalogue pages behave exactly as they did. */
      function visible() {
        var out = [];
        for (var k = 0; k < cards.length; k++) {
          if (!cards[k].classList.contains('roof--off')) out.push(cards[k]);
        }
        return out;
      }

      function apply() {
        /* Above the breakpoint every card is unfolded and the button is put back
           behind `hidden`, so the accessibility tree matches what is painted:
           CSS alone would leave a control that is invisible but still focusable. */
        var folding = mq.matches;
        var list = visible();
        /* A card the filter has hidden must not keep a fold class: rotating past
           the breakpoint would then paint it and the count would be wrong. */
        for (var j = 0; j < cards.length; j++) cards[j].classList.remove('prod--folded');
        for (var i = 0; i < list.length; i++) {
          if (folding && i >= shown) list[i].classList.add('prod--folded');
        }
        wrap.hidden = !folding || shown >= list.length;
      }

      /* The filter below dispatches this after every press. The revealed count
         resets, because "show 9 more" of a list the visitor has just changed is
         a count about the old list. */
      grid.addEventListener('rc:filtered', function () { shown = step; apply(); });

      button.addEventListener('click', function () {
        var first = shown;
        var list = visible();
        shown = Math.min(shown + step, list.length);
        apply();
        /* Focus the first card revealed by THIS press. Without it a keyboard or
           screen reader visitor presses the button, the button vanishes on the
           last press, and focus falls back to the body at the top of the page. */
        if (list[first]) {
          list[first].setAttribute('tabindex', '-1');
          list[first].focus();
        }
      });

      apply();
      if (mq.addEventListener) mq.addEventListener('change', apply);
      else if (mq.addListener) mq.addListener(apply); // Safari below 14
    });
  })();

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
      status.style.color = '#57534E';
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
    /* W27-FIX-14 (owner instruction W27-R-20, "make them appear instant along with the
       smoothness appearance at the time of scrolling"). The observer's margin reaches a quarter
       of the viewport BELOW the fold, so an element is revealed before it scrolls into view
       rather than after a tenth of it has: at a normal scrolling pace the reveal has finished by
       the time the element is on screen, and at a fast pace it is caught mid-fade, which is the
       smoothness the owner asked to keep. Still one IntersectionObserver, still once, still no
       scroll handler (docs/CLAUDE.md section 1). */
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-revealed');
        obs.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 25% 0px' });
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

    /* Suppress permanently once the visitor has asked for the main form, not only
       once they have submitted it (W19-D6). The form sits past 50% depth on both
       homepages, so a jump to it crossed the depth trigger and the popup opened
       over the form on arrival. A click on any link to #oferta, or focus entering
       the form, is now the same signal a submit is. Capture phase, so the
       triggers are down before the anchor scroll above has moved the page. */
    function suppress() { markSeen(); teardownTriggers(); }
    var mainForm = document.getElementById('quote-form');
    if (mainForm) {
      mainForm.addEventListener('submit', suppress);
      mainForm.addEventListener('focusin', suppress);
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a[href="#oferta"]')) suppress();
    }, true);

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
        leadStatus.style.color = '#57534E';
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

  /* --- W25-19, the roofing filter ------------------------------------------ */
  /* A plain client-side script, as the dispatch specifies. There is no library
     and no dependency, which is the site's standing rule.

     IT ONLY EVER ADDS AND REMOVES A CLASS. `.roof--off` is declared once in
     styles.css and the grid is the only thing that acts on it, so a bug here
     cannot change a layout, only which cards are painted. With no JS the bar is
     still readable, every button shows its own count, and every card shows,
     which is the honest state: "Toate" is what the page is without the script.

     THE HASH SELECTS A FILTER. `mat-<slug>` is the id of the button itself, so
     /servicii/acoperisuri/#mat-profnastil lands on the control and opens it. That
     is what the eight redirect pages at /catalog/materiale-acoperis/* aim at, and
     it is why the id is on the button rather than on a wrapper: the browser does
     the scrolling and this does the selecting, and neither has to know about the
     other.

     THE FOLD IS TOLD. Pressing a filter dispatches `rc:filtered` on the grid, and
     the phone-reveal block above resets its count and recounts from the cards
     that are actually showing. Nothing here touches `.prod--folded`. */
  (function () {
    var bar = document.querySelector('[data-roof-bar]');
    var grid = document.querySelector('[data-roof-grid]');
    if (!bar || !grid) return;
    var buttons = bar.querySelectorAll('[data-roof-filter]');
    var cards = grid.querySelectorAll('[data-product-card]');
    var status = document.querySelector('[data-roof-status]');
    var template = status ? status.getAttribute('data-roof-showing') : null;
    if (!buttons.length || !cards.length) return;

    function groupsOf(card) {
      return (card.getAttribute('data-roof-groups') || '').split(' ').filter(Boolean);
    }

    /* W26-05. The Compara tables filter with the cards, on the same attribute and
       the same class. They sit OUTSIDE the grid, so they are looked up separately;
       what they are not is a special case in the rule. */
    var tables = document.querySelectorAll('[data-roof-table]');

    function select(name, focus) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var on = name === 'toate' || groupsOf(cards[i]).indexOf(name) > -1;
        cards[i].classList.toggle('roof--off', !on);
        if (on) shown++;
      }
      for (var t = 0; t < tables.length; t++) {
        tables[t].classList.toggle('roof--off', !(name === 'toate' || groupsOf(tables[t]).indexOf(name) > -1));
      }
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].setAttribute('aria-pressed', buttons[j].getAttribute('data-roof-filter') === name ? 'true' : 'false');
      }
      if (status && template) status.textContent = template.replace('{n}', String(shown));
      /* Dispatched even when nothing moved, because the fold's count depends on
         the visible list and not on whether this call changed it. */
      grid.dispatchEvent(new CustomEvent('rc:filtered'));
      if (focus) {
        var btn = bar.querySelector('[data-roof-filter="' + name + '"]');
        if (btn) btn.focus();
      }
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-roof-filter]');
      if (!btn || !bar.contains(btn)) return;
      select(btn.getAttribute('data-roof-filter'), false);
    });

    function fromHash() {
      var h = (location.hash || '').replace(/^#/, '');
      if (h.indexOf('mat-') !== 0) return;
      var name = h.slice(4);
      if (!bar.querySelector('[data-roof-filter="' + name + '"]')) return;
      select(name, false);
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();
  })();

  /* W26-12, ruling W26-R14: the gallery lightbox. One per gallery, opened by any
     element carrying data-gal-open="<its id>", at data-gal-index.

     THE TRACK IS A SCROLLER. A swipe is the browser's own scroll of a scroll-snap
     track, so no touch handler exists and nothing here can capture or delay a
     gesture (docs/CLAUDE.md section 1). The one scroll listener is passive and only
     reads which slide is showing. Buttons and arrow keys scroll the same track,
     smoothly unless reduced motion is on, when they jump.

     A DIALOG: focus goes to the close button on open, Tab stays inside, Escape and
     the close button shut it, and focus returns to what opened it. The page is not
     scroll-locked, matching the lead modal: the lightbox covers it, opaque. */
  (function () {
    var boxes = document.querySelectorAll('[data-gal-box]');
    if (!boxes.length) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    Array.prototype.forEach.call(boxes, function (box) {
      var id = box.id;
      var track = box.querySelector('.lbx__track');
      var slides = box.querySelectorAll('.lbx__slide');
      var count = box.querySelector('.lbx__count');
      var closeBtn = box.querySelector('.lbx__close');
      var prevBtn = box.querySelector('.lbx__nav--prev');
      var nextBtn = box.querySelector('.lbx__nav--next');
      var open = false, index = 0, lastFocus = null;

      function update() {
        count.textContent = (index + 1) + ' / ' + slides.length;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
      }
      function go(i, instant) {
        index = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: slides[index].offsetLeft, behavior: (instant || reduced.matches) ? 'auto' : 'smooth' });
        update();
      }
      function focusables() {
        return Array.prototype.filter.call(box.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'), function (el) {
          return !el.disabled;
        });
      }
      /* Focus returns to the element that OPENED it, not to whatever held focus: a
         pointer click on a card does not always focus the card, and returning focus
         to the page body strands a keyboard user at the top of the document. */
      function openAt(i, opener) {
        lastFocus = opener || document.activeElement;
        box.hidden = false;
        open = true;
        go(i, true);
        closeBtn.focus();
      }
      function close() {
        if (!open) return;
        box.hidden = true;
        open = false;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }

      document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-gal-open]');
        if (!t || t.getAttribute('data-gal-open') !== id) return;
        e.preventDefault();
        openAt(Number(t.getAttribute('data-gal-index')) || 0, t);
      });
      closeBtn.addEventListener('click', close);
      prevBtn.addEventListener('click', function () { go(index - 1); });
      nextBtn.addEventListener('click', function () { go(index + 1); });
      /* The index is read once scrolling has SETTLED, not on every frame: during a
         smooth scroll the track passes every slide in between, and an index taken
         mid-flight sent the next key press from the wrong slide. */
      var settle = null;
      track.addEventListener('scroll', function () {
        if (settle) clearTimeout(settle);
        settle = setTimeout(function () {
          var w = track.clientWidth;
          if (!w) return;
          var i = Math.round(track.scrollLeft / w);
          if (i !== index && i >= 0 && i < slides.length) { index = i; update(); }
        }, 120);
      }, { passive: true });
      box.addEventListener('keydown', function (e) {
        if (!open) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); return; }
        if (e.key === 'Home') { e.preventDefault(); go(0); return; }
        if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); return; }
        if (e.key !== 'Tab') return;
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  })();
})();
