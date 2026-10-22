/* Soft2Cloud site: nav, contact form, tools search. */
(function () {
  'use strict';
  var WA = '923147579355', MAIL = 'info@soft2cloud.com';
  var bar = document.querySelector('.bar'), menu = document.querySelector('.menu');
  if (menu && bar) {
    menu.addEventListener('click', function () {
      var open = bar.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.textContent = open ? 'Close' : 'Menu';
    });
  }
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
