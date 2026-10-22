/* Soft2Cloud site: nav, contact form, tools search. */
(function () {
  'use strict';
  var WA = '923706353528', MAIL = 'info@soft2cloud.com';
  var bar = document.querySelector('.bar'), menu = document.querySelector('.menu');
  if (menu && bar) {
    menu.addEventListener('click', function () {
      var open = bar.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.textContent = open ? 'Close' : 'Menu';
    });
  }
  /* Header shadow/shrink on scroll */
  if (bar) { var onS = function () { bar.classList.toggle('scrolled', window.scrollY > 30); }; window.addEventListener('scroll', onS, { passive: true }); onS(); }

  /* Home hero slider */
  var hs = document.querySelector('.hs');
  if (hs) {
    var slides = [].slice.call(hs.querySelectorAll('.hs-slide')), tabs = [].slice.call(hs.querySelectorAll('.hs-tab')), MS = 7000, i = 0, timer = null, paused = false, hover = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pauseBtn = hs.querySelector('[data-hs=pause]');
    hs.style.setProperty('--hs-ms', MS + 'ms');
    function show(n, focusTab) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i; s.classList.toggle('is-on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true');
        [].forEach.call(s.querySelectorAll('a,button'), function (a) { if (on) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });
        if (on) [].forEach.call(s.querySelectorAll('img[loading=lazy]'), function (im) { im.loading = 'eager'; });
      });
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); var pr = t.querySelector('.hs-prog'); if (pr) { pr.style.animation = 'none'; void pr.offsetWidth; pr.style.animation = ''; } });
      if (focusTab) tabs[i].focus();
      schedule();
    }
    function schedule() { clearTimeout(timer); hs.classList.toggle('paused', paused || hover || reduce); if (!paused && !hover && !reduce) timer = setTimeout(function () { show(i + 1); }, MS); }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { show(k); }); });
    hs.addEventListener('click', function (e) { var b = e.target.closest('[data-hs]'); if (!b) return; var a = b.dataset.hs; if (a === 'prev') show(i - 1); else if (a === 'next') show(i + 1); else { paused = !paused; b.setAttribute('aria-label', paused ? 'Play slides' : 'Pause slides'); b.innerHTML = paused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'; schedule(); } });
    hs.addEventListener('keydown', function (e) { if (!e.target.closest('.hs-tabs')) return; if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, true); } });
    var stage = hs.querySelector('.hs-stage');
    stage.addEventListener('mouseenter', function () { hover = true; schedule(); }); stage.addEventListener('mouseleave', function () { hover = false; schedule(); });
    hs.addEventListener('focusin', function () { hover = true; schedule(); }); hs.addEventListener('focusout', function () { hover = false; schedule(); });
    var x0 = null; stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
    if (reduce && pauseBtn) pauseBtn.hidden = true;
    schedule();
  }
  /* Product page screen slider */
  [].forEach.call(document.querySelectorAll('[data-ps]'), function (ps) {
    var imgs = [].slice.call(ps.querySelectorAll('.ps-img')), dots = [].slice.call(ps.querySelectorAll('.ps-dot')), cap = ps.querySelector('.ps-cap'), k = 0, t = null, hov = false;
    if (imgs.length < 2) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(n) { k = (n + imgs.length) % imgs.length; imgs.forEach(function (im, i) { im.classList.toggle('is-on', i === k); if (i === k) im.loading = 'eager'; }); dots.forEach(function (d, i) { d.setAttribute('aria-pressed', i === k ? 'true' : 'false'); }); if (cap) cap.textContent = dots[k].getAttribute('aria-label'); plan(); }
    function plan() { clearTimeout(t); if (!hov && !reduce) t = setTimeout(function () { go(k + 1); }, 5000); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    ps.addEventListener('mouseenter', function () { hov = true; plan(); }); ps.addEventListener('mouseleave', function () { hov = false; plan(); });
    plan();
  });
  window.S2C = window.S2C || {};
  S2C.toast = function (msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  };
  S2C.copy = function (text) {
    function ok() { S2C.toast('Copied'); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, fallback); } else fallback();
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) {} ta.remove(); }
  };

  /* Contact form → WhatsApp or email, no server needed */
  var f = document.getElementById('cform');
  if (f) {
    var p = new URLSearchParams(location.search), want = p.get('product');
    if (want && f.interest) { for (var i = 0; i < f.interest.options.length; i++) if (f.interest.options[i].value === want) f.interest.selectedIndex = i; }
    function body() {
      return 'Hello Soft2Cloud,\n\nName: ' + f.name.value + '\nBusiness: ' + (f.business.value || '-') + '\nPhone: ' + f.phone.value + '\nInterested in: ' + f.interest.value + '\n\n' + f.message.value;
    }
    function valid() { if (!f.reportValidity()) return false; return true; }
    f.addEventListener('submit', function (e) { e.preventDefault(); if (!valid()) return; window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(body()), '_blank', 'noopener'); });
    var em = document.getElementById('cmail');
    if (em) em.addEventListener('click', function () { if (!valid()) return; location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Enquiry: ' + f.interest.value) + '&body=' + encodeURIComponent(body()); });
  }

  /* Tools index filter */
  var q = document.getElementById('tq');
  if (q) {
    var cards = [].slice.call(document.querySelectorAll('[data-tool-card]')), cats = [].slice.call(document.querySelectorAll('.cat')), chips = [].slice.call(document.querySelectorAll('.chip')), cur = 'all';
    var empty = document.getElementById('tempty');
    function run() {
      var s = q.value.trim().toLowerCase(), n = 0;
      cards.forEach(function (c) {
        var show = (cur === 'all' || c.dataset.cat === cur) && (!s || c.dataset.search.indexOf(s) > -1);
        c.hidden = !show; if (show) n++;
      });
      cats.forEach(function (c) { c.hidden = !c.querySelector('[data-tool-card]:not([hidden])'); });
      if (empty) empty.hidden = n > 0;
    }
    q.addEventListener('input', run);
    chips.forEach(function (ch) { ch.addEventListener('click', function () { cur = ch.dataset.cat; chips.forEach(function (x) { x.setAttribute('aria-pressed', x === ch ? 'true' : 'false'); }); run(); }); });
    var pq = new URLSearchParams(location.search).get('q'); if (pq) { q.value = pq; run(); }
  }
})();
