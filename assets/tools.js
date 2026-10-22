/* Soft2Cloud free online tools. Each tool page has <div class="tool-app" data-tool="slug"></div>.
   Everything runs in the browser; nothing is uploaded. */
(function () {
  'use strict';
  var T = {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { var n = parseFloat(String(v).replace(/,/g, '')); return isFinite(n) ? n : 0; }
  function fmt(n, d) { if (!isFinite(n)) return '—'; d = d == null ? 2 : d; return Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: d }); }
  function rs(n, d) { return isFinite(n) ? 'Rs ' + fmt(n, d == null ? 0 : d) : '—'; }
  function pct(n) { return isFinite(n) ? fmt(n, 2) + '%' : '—'; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('s2c-' + k)); localStorage.setItem('s2c-' + k, JSON.stringify(v)); } catch (e) { return null; } }
  function toast(m) { if (window.S2C && S2C.toast) S2C.toast(m); }
  function copy(t) { if (window.S2C && S2C.copy) S2C.copy(t); }
  function download(name, blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* Urdu labels for pages with <html lang="ur"> */
  var UR = document.documentElement.lang === 'ur';
  var DICT = {
    'Amount (Rs)': 'رقم (روپے)', 'Sales tax rate (%)': 'سیلز ٹیکس کی شرح (%)', 'Amount is': 'رقم', 'Before tax (add GST)': 'ٹیکس کے بغیر (جی ایس ٹی شامل کریں)', 'Including tax (remove GST)': 'ٹیکس سمیت (جی ایس ٹی نکالیں)',
    'Amount before tax': 'ٹیکس سے پہلے رقم', 'Total with tax': 'ٹیکس سمیت کل رقم',
    'Loan amount (Rs)': 'قرض کی رقم (روپے)', 'Interest / markup rate (% per year)': 'سود / مارک اپ کی شرح (% سالانہ)', 'Tenure': 'مدت', 'Tenure in': 'مدت بحساب', 'Years': 'سال', 'Months': 'مہینے',
    'Monthly instalment (EMI)': 'ماہانہ قسط', 'Total interest': 'کل سود', 'Total payment': 'کل ادائیگی', 'Repayment schedule by year': 'سال بہ سال ادائیگی کا شیڈول', 'Year': 'سال', 'Principal paid': 'اصل رقم ادا', 'Interest paid': 'سود ادا', 'Balance left': 'باقی رقم',
    'Value': 'مقدار', 'Unit': 'یونٹ', 'Marla': 'مرلہ', 'Kanal': 'کنال', 'Acre': 'ایکڑ', 'Square feet': 'مربع فٹ', 'Square yards (gaz)': 'مربع گز', 'Square yards': 'مربع گز', 'Square metres': 'مربع میٹر', 'Hectare': 'ہیکٹر', 'Murabba (25 acres)': 'مربع (25 ایکڑ)', '1 marla equals': '1 مرلہ برابر ہے',
    '225 sq ft (most housing societies, e.g. DHA Lahore)': '225 مربع فٹ (زیادہ تر ہاؤسنگ سوسائٹیاں، جیسے ڈی ایچ اے لاہور)', '250 sq ft (some societies)': '250 مربع فٹ (کچھ سوسائٹیاں)', '272.25 sq ft (revenue / old record)': '272.25 مربع فٹ (ریونیو / پرانا ریکارڈ)',
    'Gold rate, 24k (Rs per tola)': 'سونے کا ریٹ، 24 قیراط (روپے فی تولہ)', 'Karat': 'قیراط', 'Weight': 'وزن', 'Weight in': 'وزن بحساب', 'Tola': 'تولہ', 'Grams': 'گرام', 'Masha': 'ماشہ', 'Ratti': 'رتی', 'Making charges': 'بنوائی', 'Making charged as': 'بنوائی کا حساب', '% of gold value': 'سونے کی قیمت کا %', 'Rs per tola': 'روپے فی تولہ', 'Fixed Rs': 'مقررہ رقم', 'Gold value': 'سونے کی قیمت', 'Total price': 'کل قیمت',
    'Cash in hand (Rs)': 'ہاتھ میں نقدی (روپے)', 'Bank and wallet balances (Rs)': 'بینک اور والٹ بیلنس (روپے)', 'Gold you own': 'آپ کا سونا', 'Gold weight in': 'سونے کا وزن بحساب', 'Gold karat': 'سونے کا قیراط', 'Silver you own (tola)': 'آپ کی چاندی (تولہ)', 'Silver rate (Rs per tola)': 'چاندی کا ریٹ (روپے فی تولہ)', 'Business stock at sale value (Rs)': 'کاروباری مال، فروخت کی قیمت پر (روپے)', 'Money others owe you, likely to be repaid (Rs)': 'دوسروں کے ذمے آپ کی رقم جو ملنے کی امید ہو (روپے)', 'Shares, funds, savings certificates (Rs)': 'شیئرز، فنڈز، بچت سرٹیفکیٹ (روپے)', 'Debts and bills due now (Rs)': 'فوری واجب قرض اور بل (روپے)', 'Nisab rule': 'نصاب کا اصول',
    'Automatic — gold only: 7.5 tola gold; anything else: 52.5 tola silver (Hanafi)': 'Automatic — صرف سونا: 7.5 تولہ سونا؛ باقی سب: 52.5 تولہ چاندی (حنفی)', 'Always silver — 52.5 tola': 'ہمیشہ چاندی — 52.5 تولہ', 'Always gold — 7.5 tola': 'ہمیشہ سونا — 7.5 تولہ',
    'Net zakatable wealth': 'قابلِ زکوٰۃ خالص مال', 'Zakat due (2.5%)': 'واجب زکوٰۃ (2.5%)', 'Enter rates': 'ریٹ لکھیں', 'Today\'s rate': 'آج کا ریٹ', 'Not due': 'واجب نہیں', 'Asset': 'مال', 'Cash and bank': 'نقدی اور بینک', 'Business stock': 'کاروباری مال', 'Money owed to you': 'دوسروں کے ذمے رقم', 'Investments': 'سرمایہ کاری', 'Less debts due now': 'منہا: فوری واجب قرض',
    'Enter the gold rate so your gold is counted.': 'سونے کا ریٹ لکھیں تاکہ آپ کا سونا شمار ہو۔', 'Enter the silver rate so your silver is counted.': 'چاندی کا ریٹ لکھیں تاکہ آپ کی چاندی شمار ہو۔',
    'Enter today\'s gold rate per tola — the nisab is 7.5 tola of gold.': 'آج کا سونے کا فی تولہ ریٹ لکھیں — نصاب 7.5 تولہ سونا ہے۔', 'Enter today\'s silver rate per tola — the nisab is 52.5 tola of silver.': 'آج کا چاندی کا فی تولہ ریٹ لکھیں — نصاب 52.5 تولہ چاندی ہے۔',
    'Rates were filled in automatically from international prices (approximate). Your local sarafa rate may be higher — replace them with today\'s local rate for an exact figure.': 'ریٹ بین الاقوامی قیمت سے خود بھر دیے گئے ہیں (اندازاً)۔ مقامی صرافہ ریٹ زیادہ ہو سکتا ہے — درست حساب کے لیے آج کا مقامی ریٹ لکھیں۔',
    'Your net wealth is below the nisab, so zakat is not due on this calculation.': 'آپ کا خالص مال نصاب سے کم ہے، اس لیے اس حساب سے زکوٰۃ واجب نہیں۔',
    'Enter today\'s 24k rate per tola from your jeweller or the sarafa association.': 'اپنے جیولر یا صرافہ ایسوسی ایشن سے آج کا 24 قیراط فی تولہ ریٹ لکھیں۔'
  };
  var PAT = [
    [/^GST \((.+)\)$/, 'جی ایس ٹی ($1)'], [/^Year (\d+)$/, 'سال $1'], [/^(\d+)k rate per tola$/, '$1 قیراط ریٹ فی تولہ'], [/^(\d+)k rate per gram$/, '$1 قیراط ریٹ فی گرام'],
    [/^Nisab \(7\.5 tola gold\)$/, 'نصاب (7.5 تولہ سونا)'], [/^Nisab \(52\.5 tola silver\)$/, 'نصاب (52.5 تولہ چاندی)'], [/^Gold \(([\d.,]+) tola, (\d+)k\)$/, 'سونا ($1 تولہ، $2 قیراط)'], [/^Silver \(([\d.,]+) tola\)$/, 'چاندی ($1 تولہ)']
  ];
  function L(s) {
    if (!UR || s == null) return s; s = String(s);
    if (DICT.hasOwnProperty(s)) return DICT[s];
    for (var i = 0; i < PAT.length; i++) if (PAT[i][0].test(s)) return s.replace(PAT[i][0], PAT[i][1]);
    return s;
  }

  /* ---------- generic calculator form ---------- */
  function field(f) {
    var id = 'f-' + f.id, cls = 'f' + (f.full ? ' full' : '');
    if (f.type === 'select') return '<label class="' + cls + '">' + esc(L(f.label)) + '<select id="' + id + '" name="' + f.id + '">' + f.options.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(v) === String(f.value) ? ' selected' : '') + '>' + esc(L(l)) + '</option>'; }).join('') + '</select></label>';
    if (f.type === 'check') return '<label class="check' + (f.full ? ' full' : '') + '"><input type="checkbox" id="' + id + '" name="' + f.id + '"' + (f.value ? ' checked' : '') + '> ' + esc(L(f.label)) + '</label>';
    if (f.type === 'textarea') return '<label class="' + cls + '">' + esc(L(f.label)) + '<textarea id="' + id + '" name="' + f.id + '" placeholder="' + esc(f.ph || '') + '">' + esc(f.value || '') + '</textarea></label>';
    var t = f.type || 'number';
    return '<label class="' + cls + '">' + esc(L(f.label)) + '<input id="' + id + '" name="' + f.id + '" type="' + t + '"' + (t === 'number' ? ' inputmode="decimal" step="' + (f.step || 'any') + '"' + (f.min != null ? ' min="' + f.min + '"' : '') : '') + ' value="' + esc(f.value == null ? '' : f.value) + '" placeholder="' + esc(L(f.ph || '')) + '"></label>';
  }
  function calc(el, spec) {
    el.innerHTML = '<div class="fgrid' + (spec.cols === 3 ? ' three' : '') + '">' + spec.fields.map(field).join('') + '</div>' +
      '<div class="result" aria-live="polite"></div><div class="extra"></div>' + (spec.note ? '<p class="note">' + ((UR && spec.noteUr) || spec.note) + '</p>' : '');
    var res = $('.result', el), extra = $('.extra', el);
    function read() {
      var v = {};
      spec.fields.forEach(function (f) { var i = $('#f-' + f.id, el); v[f.id] = f.type === 'check' ? i.checked : (!f.type || f.type === 'number') ? num(i.value) : i.value; });
      return v;
    }
    function run() {
      var out = spec.compute(read(), el) || {};
      res.innerHTML = (out.results || []).map(function (r) { return '<div' + (r[2] ? ' class="big"' : '') + '><span>' + esc(L(r[0])) + '</span><b>' + esc(L(r[1])) + '</b></div>'; }).join('');
      res.hidden = !(out.results && out.results.length);
      extra.innerHTML = out.extra || '';
    }
    el.addEventListener('input', run); el.addEventListener('change', run);
    if (spec.after) spec.after(el, run);
    run();
    return run;
  }
  function table(head, rows, rightFrom) {
    rightFrom = rightFrom == null ? 1 : rightFrom;
    return '<div class="tbl"><table><thead><tr>' + head.map(function (h, i) { return '<th' + (i >= rightFrom ? ' class="r"' : '') + '>' + esc(L(h)) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i >= rightFrom ? ' class="r"' : '') + '>' + esc(L(c)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ================= BUSINESS ================= */
  T['gst-calculator'] = function (el) {
    calc(el, {
      fields: [
        { id: 'amt', label: 'Amount (Rs)', value: 10000 },
        { id: 'rate', label: 'Sales tax rate (%)', value: 18 },
        { id: 'mode', label: 'Amount is', type: 'select', value: 'ex', options: [['ex', 'Before tax (add GST)'], ['inc', 'Including tax (remove GST)']], full: true }
      ],
      compute: function (v) {
        var r = v.rate / 100, net, tax, gross;
        if (v.mode === 'ex') { net = v.amt; tax = net * r; gross = net + tax; } else { gross = v.amt; net = gross / (1 + r); tax = gross - net; }
        return { results: [['Amount before tax', rs(net, 2)], ['GST (' + fmt(v.rate) + '%)', rs(tax, 2)], ['Total with tax', rs(gross, 2), true]] };
      },
      noteUr: 'پاکستان میں زیادہ تر اشیاء پر عام سیلز ٹیکس 18% ہے، مگر کچھ اشیاء اور صوبائی سروسز پر شرح مختلف ہے۔ تازہ شرح ایف بی آر یا صوبائی ریونیو اتھارٹی سے دیکھیں۔',
      note: 'Standard sales tax in Pakistan is 18% on most goods, but some items and provinces (services) use other rates. Check the current rate with FBR or your provincial revenue authority.'
    });
  };
  T['profit-margin-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'cost', label: 'Cost price (Rs)', value: 800 }, { id: 'price', label: 'Selling price (Rs)', value: 1000 }, { id: 'qty', label: 'Units sold (optional)', value: 1 }],
      compute: function (v) {
        var p = v.price - v.cost, m = v.price ? p / v.price * 100 : NaN, mk = v.cost ? p / v.cost * 100 : NaN;
        return { results: [['Profit per unit', rs(p, 2)], ['Profit margin', pct(m), true], ['Markup', pct(mk)], ['Total profit', rs(p * (v.qty || 1), 2)]],
          extra: p < 0 ? '<p class="err">You are selling below cost — a loss of ' + rs(-p, 2) + ' on each unit.</p>' : '' };
      }
    });
  };
  T['discount-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'price', label: 'Original price (Rs)', value: 5000 }, { id: 'd1', label: 'Discount (%)', value: 20 }, { id: 'd2', label: 'Extra discount (%)', value: 0 }, { id: 'tax', label: 'Tax after discount (%)', value: 0 }],
      compute: function (v) {
        var a = v.price * (1 - v.d1 / 100), b = a * (1 - v.d2 / 100), f = b * (1 + v.tax / 100), save = v.price - b, eff = v.price ? save / v.price * 100 : 0;
        return { results: [['Price after discount', rs(b, 2)], ['You save', rs(save, 2)], ['Effective discount', pct(eff)], ['Final price', rs(f, 2), true]] };
      },
      note: 'Two discounts do not add up: 20% + 10% is a 28% total discount, not 30%.'
    });
  };
  T['break-even-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'fixed', label: 'Fixed costs per month (Rs)', value: 300000, full: true, ph: 'Rent, salaries, bills' }, { id: 'price', label: 'Selling price per unit (Rs)', value: 500 }, { id: 'var', label: 'Variable cost per unit (Rs)', value: 300 }, { id: 'target', label: 'Target profit per month (Rs)', value: 100000, full: true }],
      compute: function (v) {
        var cm = v.price - v.var;
        if (cm <= 0) return { results: [], extra: '<p class="err">Selling price must be higher than the variable cost, otherwise you can never break even.</p>' };
        var u = v.fixed / cm, ut = (v.fixed + v.target) / cm;
        return { results: [['Contribution per unit', rs(cm, 2)], ['Break-even units', fmt(Math.ceil(u), 0), true], ['Break-even sales', rs(Math.ceil(u) * v.price)], ['Units for target profit', fmt(Math.ceil(ut), 0)], ['Sales for target profit', rs(Math.ceil(ut) * v.price)], ['Per day (30 days)', fmt(Math.ceil(u / 30), 0) + ' units']] };
      }
    });
  };
  T['selling-price-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'cost', label: 'Cost price (Rs)', value: 1200 }, { id: 'p', label: 'Percentage (%)', value: 25 }, { id: 'mode', label: 'Percentage is', type: 'select', value: 'margin', options: [['margin', 'Profit margin (on selling price)'], ['markup', 'Markup (on cost)']], full: true }, { id: 'tax', label: 'Add sales tax (%)', value: 0 }, { id: 'round', label: 'Round to nearest', type: 'select', value: '10', options: [['1', 'Rs 1'], ['5', 'Rs 5'], ['10', 'Rs 10'], ['50', 'Rs 50'], ['100', 'Rs 100']] }],
      compute: function (v) {
        if (v.mode === 'margin' && v.p >= 100) return { results: [], extra: '<p class="err">A profit margin must be below 100%.</p>' };
        var sp = v.mode === 'margin' ? v.cost / (1 - v.p / 100) : v.cost * (1 + v.p / 100), r = num(v.round) || 1, wt = sp * (1 + v.tax / 100), rd = Math.ceil(wt / r) * r, pr = sp - v.cost;
        return { results: [['Selling price', rs(sp, 2)], ['Profit per unit', rs(pr, 2)], ['Margin', pct(sp ? pr / sp * 100 : 0)], ['Markup', pct(v.cost ? pr / v.cost * 100 : 0)], ['Shelf price (with tax, rounded)', rs(rd), true]] };
      }
    });
  };
  T['percentage-calculator'] = function (el) {
    el.innerHTML = [
      ['a', 'What is', '% of', function (x, y) { return fmt(x / 100 * y, 4); }],
      ['b', '', 'is what % of', function (x, y) { return y ? fmt(x / y * 100, 4) + '%' : '—'; }],
      ['c', 'Change from', 'to', function (x, y) { if (!x) return '—'; var c = (y - x) / Math.abs(x) * 100; return (c >= 0 ? '+' : '') + fmt(c, 4) + '% ' + (c >= 0 ? 'increase' : 'decrease'); }],
      ['d', 'Add', '% to', function (x, y) { return fmt(y * (1 + x / 100), 4); }],
      ['e', 'Subtract', '% from', function (x, y) { return fmt(y * (1 - x / 100), 4); }]
    ].map(function (r) {
      return '<div class="pc" data-k="' + r[0] + '" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)">' + (r[1] ? '<span>' + r[1] + '</span>' : '') +
        '<input class="inp" style="width:110px" inputmode="decimal" type="number" step="any" value="' + (r[0] === 'c' ? 200 : 15) + '" aria-label="First number"><span>' + r[2] + '</span><input class="inp" style="width:130px" inputmode="decimal" type="number" step="any" value="' + (r[0] === 'c' ? 250 : 2000) + '" aria-label="Second number"><span>=</span><b class="o" style="font-family:var(--mono);font-size:1.15rem;color:var(--accent)"></b></div>';
    }).join('');
    var fns = { a: function (x, y) { return fmt(x / 100 * y, 4); }, b: function (x, y) { return y ? fmt(x / y * 100, 4) + '%' : '—'; }, c: function (x, y) { if (!x) return '—'; var c = (y - x) / Math.abs(x) * 100; return (c >= 0 ? '+' : '') + fmt(c, 4) + '% ' + (c >= 0 ? 'increase' : 'decrease'); }, d: function (x, y) { return fmt(y * (1 + x / 100), 4); }, e: function (x, y) { return fmt(y * (1 - x / 100), 4); } };
    function run() { $$('.pc', el).forEach(function (r) { var i = $$('input', r); $('.o', r).textContent = fns[r.dataset.k](num(i[0].value), num(i[1].value)); }); }
    el.addEventListener('input', run); run();
  };

  /* ================= FINANCE ================= */
  T['loan-emi-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'p', label: 'Loan amount (Rs)', value: 2000000 }, { id: 'r', label: 'Interest / markup rate (% per year)', value: 18 }, { id: 'n', label: 'Tenure', value: 5 }, { id: 'u', label: 'Tenure in', type: 'select', value: 'y', options: [['y', 'Years'], ['m', 'Months']] }],
      compute: function (v) {
        var n = Math.round(v.u === 'y' ? v.n * 12 : v.n), i = v.r / 1200;
        if (!n || !v.p) return { results: [] };
        var emi = i ? v.p * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1) : v.p / n, total = emi * n, rows = [], bal = v.p, yi = 0, yp = 0;
        for (var m = 1; m <= n; m++) { var int = bal * i, pr = emi - int; bal -= pr; yi += int; yp += pr; if (m % 12 === 0 || m === n) { rows.push(['Year ' + Math.ceil(m / 12), rs(yp), rs(yi), rs(Math.max(bal, 0))]); yi = 0; yp = 0; } }
        return { results: [['Monthly instalment (EMI)', rs(emi), true], ['Total interest', rs(total - v.p)], ['Total payment', rs(total)], ['Months', fmt(n, 0)]],
          extra: '<h3 style="margin:6px 0 10px">' + L('Repayment schedule by year') + '</h3>' + table(['Year', 'Principal paid', 'Interest paid', 'Balance left'], rows) };
      },
      noteUr: 'بینک پروسیسنگ فیس، انشورنس یا KIBOR سے جڑی بدلتی شرح بھی لگا سکتے ہیں۔ اسے اندازہ سمجھیں اور حتمی شیڈول بینک سے لیں۔',
      note: 'Banks may add processing fees, insurance or use a different calculation (e.g. KIBOR-linked floating rates). Use this as an estimate and confirm the final schedule with your bank.'
    });
  };
  T['compound-interest-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'p', label: 'Starting amount (Rs)', value: 100000 }, { id: 'pmt', label: 'Monthly addition (Rs)', value: 10000 }, { id: 'r', label: 'Annual return (%)', value: 12 }, { id: 'y', label: 'Years', value: 10 }, { id: 'c', label: 'Compounding', type: 'select', value: '12', options: [['1', 'Yearly'], ['2', 'Half-yearly'], ['4', 'Quarterly'], ['12', 'Monthly']], full: true }],
      compute: function (v) {
        var n = num(v.c), mr = Math.pow(1 + v.r / 100 / n, n / 12) - 1, bal = v.p, dep = v.p, rows = [], months = Math.round(v.y * 12);
        if (months > 1200) months = 1200;
        for (var m = 1; m <= months; m++) { bal = bal * (1 + mr) + v.pmt; dep += v.pmt; if (m % 12 === 0 || m === months) rows.push(['Year ' + Math.ceil(m / 12), rs(dep), rs(bal - dep), rs(bal)]); }
        return { results: [['Final amount', rs(bal), true], ['Total you put in', rs(dep)], ['Total growth', rs(bal - dep)]], extra: table(['Year', 'Deposited', 'Growth', 'Balance'], rows) };
      },
      note: 'Returns are assumed constant. Real investments go up and down, and profit may be taxed.'
    });
  };
  T['savings-goal-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'goal', label: 'Goal amount (Rs)', value: 1500000 }, { id: 'have', label: 'Already saved (Rs)', value: 200000 }, { id: 'y', label: 'Years to reach goal', value: 3 }, { id: 'r', label: 'Expected return (% per year)', value: 10 }],
      compute: function (v) {
        var m = Math.round(v.y * 12), i = v.r / 1200; if (!m) return { results: [] };
        var fvHave = v.have * Math.pow(1 + i, m), need = v.goal - fvHave, pmt = need <= 0 ? 0 : (i ? need * i / (Math.pow(1 + i, m) - 1) : need / m);
        return { results: [['Save every month', rs(Math.ceil(pmt)), true], ['Months', fmt(m, 0)], ['Your savings will grow to', rs(fvHave)], ['Total new deposits', rs(pmt * m)]], extra: need <= 0 ? '<p class="warn">Your current savings already reach the goal at this return.</p>' : '' };
      }
    });
  };
  /* Approximate live metal rates in PKR per tola (international spot, not local sarafa rate) */
  var metalRates = null;
  function getMetalRates(cb) {
    if (metalRates) return cb(metalRates);
    var TOLA_G = 11.6638, OZ_G = 31.1034768;
    function j(u) { return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }
    Promise.all([j('https://api.gold-api.com/price/XAU'), j('https://api.gold-api.com/price/XAG'), j('https://open.er-api.com/v6/latest/USD')]).then(function (a) {
      var pkr = a[2] && a[2].rates && a[2].rates.PKR, g = a[0] && +a[0].price, s = a[1] && +a[1].price;
      if (!pkr || !g || !s) throw 0;
      metalRates = { gold: Math.round(g / OZ_G * TOLA_G * pkr), silver: Math.round(s / OZ_G * TOLA_G * pkr) };
      cb(metalRates);
    }).catch(function () { cb(null); });
  }
  T._metalRates = getMetalRates;
  T['zakat-calculator'] = function (el) {
    var auto = { grate: false, srate: false };
    var run = calc(el, {
      fields: [
        { id: 'cash', label: 'Cash in hand (Rs)', value: 0 },
        { id: 'bank', label: 'Bank and wallet balances (Rs)', value: 0 },
        { id: 'gold', label: 'Gold you own', value: 0 },
        { id: 'gu', label: 'Gold weight in', type: 'select', value: 'tola', options: [['tola', 'Tola'], ['g', 'Grams']] },
        { id: 'gk', label: 'Gold karat', type: 'select', value: '22', options: [['24', '24k'], ['22', '22k'], ['21', '21k'], ['18', '18k']] },
        { id: 'grate', label: 'Gold rate, 24k (Rs per tola)', value: '', ph: 'Today\'s rate' },
        { id: 'silver', label: 'Silver you own (tola)', value: 0 },
        { id: 'srate', label: 'Silver rate (Rs per tola)', value: '', ph: 'Today\'s rate' },
        { id: 'stock', label: 'Business stock at sale value (Rs)', value: 0 },
        { id: 'recv', label: 'Money others owe you, likely to be repaid (Rs)', value: 0 },
        { id: 'inv', label: 'Shares, funds, savings certificates (Rs)', value: 0 },
        { id: 'debt', label: 'Debts and bills due now (Rs)', value: 0 },
        { id: 'nisab', label: 'Nisab rule', type: 'select', value: 'auto', full: true, options: [['auto', 'Automatic — gold only: 7.5 tola gold; anything else: 52.5 tola silver (Hanafi)'], ['silver', 'Always silver — 52.5 tola'], ['gold', 'Always gold — 7.5 tola']] }
      ],
      compute: function (v) {
        var gTola = v.gu === 'g' ? v.gold / 11.6638 : v.gold, gVal = gTola * v.grate * num(v.gk) / 24, sVal = v.silver * v.srate;
        var other = v.cash + v.bank + v.stock + v.recv + v.inv;
        var total = other + gVal + sVal, net = total - v.debt;
        var goldOnly = gTola > 0 && !other && !v.silver;
        var basis = v.nisab === 'auto' ? (goldOnly ? 'gold' : 'silver') : v.nisab;
        // gold-only: nisab is 7.5 tola of the same gold, so value it at the same karat
        var nisab = basis === 'gold' ? 7.5 * v.grate * (goldOnly ? num(v.gk) / 24 : 1) : 52.5 * v.srate;
        var msgs = [];
        if (gTola > 0 && !v.grate) msgs.push('Enter the gold rate so your gold is counted.');
        if (v.silver > 0 && !v.srate) msgs.push('Enter the silver rate so your silver is counted.');
        if (!nisab) msgs.push('Enter today\'s ' + basis + ' rate per tola — the nisab is ' + (basis === 'gold' ? '7.5 tola of gold' : '52.5 tola of silver') + '.');
        if (auto.grate || auto.srate) msgs.push('Rates were filled in automatically from international prices (approximate). Your local sarafa rate may be higher — replace them with today\'s local rate for an exact figure.');
        var ready = nisab > 0 && !(gTola > 0 && !v.grate) && !(v.silver > 0 && !v.srate);
        var due = ready && net >= nisab, zakat = due ? net * 0.025 : 0;
        var rows = [['Cash and bank', rs(v.cash + v.bank)], ['Gold (' + fmt(gTola, 3) + ' tola, ' + v.gk + 'k)', v.grate ? rs(gVal) : '—'], ['Silver (' + fmt(v.silver, 3) + ' tola)', v.srate || !v.silver ? rs(sVal) : '—'], ['Business stock', rs(v.stock)], ['Money owed to you', rs(v.recv)], ['Investments', rs(v.inv)], ['Less debts due now', '− ' + rs(v.debt)], ['Net zakatable wealth', rs(net)]];
        return {
          results: [['Net zakatable wealth', rs(net)], ['Nisab (' + (basis === 'gold' ? '7.5 tola gold' : '52.5 tola silver') + ')', nisab ? rs(nisab) : '—'], ['Zakat due (2.5%)', !ready ? 'Enter rates' : due ? rs(zakat) : 'Not due', true]],
          extra: (msgs.length ? '<div class="warn">' + msgs.map(function (m) { return esc(L(m)); }).join('<br>') + '</div>' : '') +
            (ready && !due ? '<p class="note">' + L('Your net wealth is below the nisab, so zakat is not due on this calculation.') + '</p>' : '') +
            (ready && due ? '<p class="note">' + (UR ? 'خالص مال ' + rs(net) + ' پر <b>' + rs(zakat) + '</b> زکوٰۃ واجب ہے۔' : 'Zakat of <b>' + rs(zakat) + '</b> is due on net wealth of ' + rs(net) + '.') + '</p>' : '') +
            table(['Asset', 'Value'], rows)
        };
      },
      after: function (el, run) {
        ['grate', 'srate'].forEach(function (k) { $('#f-' + k, el).addEventListener('input', function () { auto[k] = false; }); });
        getMetalRates(function (r) {
          if (!r) return;
          var g = $('#f-grate', el), s = $('#f-srate', el);
          if (!g.value) { g.value = r.gold; auto.grate = true; }
          if (!s.value) { s.value = r.silver; auto.srate = true; }
          run();
        });
      },
      noteUr: 'زکوٰۃ اس مال پر واجب ہے جس پر ایک قمری سال گزر جائے۔ استعمال کے زیور، کاروباری اثاثوں اور قرض کے بارے میں علماء کی آراء مختلف ہیں — کسی مستند عالم سے تصدیق کر لیں۔ یہ ٹول مدد کے لیے ہے، فتویٰ نہیں۔',
      note: 'Zakat is due on wealth held for one lunar year. Scholars differ on jewellery in use, business assets and loans — please confirm with a scholar you trust. This tool is a helper, not a fatwa.'
    });
  };
  T['committee-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'amt', label: 'Monthly contribution (Rs)', value: 20000 }, { id: 'mem', label: 'Number of members', value: 10, step: 1 }, { id: 'turn', label: 'Your turn (month number)', value: 3, step: 1 }, { id: 'start', label: 'First month', type: 'month', value: today().slice(0, 7) }],
      compute: function (v) {
        var mem = Math.max(1, Math.round(v.mem)), turn = Math.min(Math.max(1, Math.round(v.turn)), mem), pot = v.amt * mem, rows = [], s = (v.start || today().slice(0, 7)).split('-'), y = +s[0], mo = +s[1] - 1;
        for (var k = 1; k <= mem; k++) { var d = new Date(y, mo + k - 1, 1); rows.push([d.toLocaleString('en-US', { month: 'short', year: 'numeric' }), 'Member #' + k + (k === turn ? ' (you)' : ''), rs(v.amt * k), k === turn ? rs(pot) : '']); }
        var paidBefore = v.amt * turn, adv = pot - paidBefore;
        var note = turn < mem ? 'You receive ' + rs(pot) + ' after paying only ' + rs(paidBefore) + ' — like an interest-free loan of ' + rs(adv) + ' that you repay over the next ' + (mem - turn) + ' months.' : 'You get the pot last — this works like saving ' + rs(v.amt) + ' every month.';
        return { results: [['Committee pot', rs(pot), true], ['Duration', mem + ' months'], ['Total you pay', rs(pot)], ['Paid by your turn', rs(paidBefore)]], extra: '<p class="note">' + note + '</p>' + table(['Month', 'Pot goes to', 'You have paid', 'You receive'], rows, 2) };
      }
    });
  };
  T['currency-converter'] = function (el) {
    var CUR = ['PKR', 'USD', 'EUR', 'GBP', 'AED', 'SAR', 'QAR', 'OMR', 'KWD', 'BHD', 'CNY', 'INR', 'TRY', 'CAD', 'AUD', 'JPY', 'MYR'];
    var rates = null;
    calc(el, {
      fields: [{ id: 'amt', label: 'Amount', value: 100 }, { id: 'from', label: 'From', type: 'select', value: 'USD', options: CUR }, { id: 'to', label: 'To', type: 'select', value: 'PKR', options: CUR }, { id: 'manual', label: 'Use my own rate (optional)', value: '', ph: '1 From = ? To' }],
      compute: function (v) {
        var r = v.manual || (rates ? rates.rates[v.to] / rates.rates[v.from] : NaN);
        if (!isFinite(r) || !r) return { results: [], extra: '<p class="note" id="rstate">' + (rates === false ? 'Live rates could not load. Enter your own rate above.' : 'Loading live rates…') + '</p>' };
        return { results: [[fmt(v.amt) + ' ' + v.from, fmt(v.amt * r, 4) + ' ' + v.to, true], ['1 ' + v.from, fmt(r, 6) + ' ' + v.to], ['1 ' + v.to, fmt(1 / r, 6) + ' ' + v.from]],
          extra: '<p class="note">' + (v.manual ? 'Using your own rate.' : 'Mid-market rate, updated ' + esc(new Date(rates.time_last_update_unix * 1000).toLocaleString()) + '. Banks and exchange companies add their own margin.') + '</p>' };
      },
      after: function (el, run) {
        el.insertAdjacentHTML('afterbegin', '<div class="row"><button type="button" class="btn line sm" id="swap">⇄ Swap currencies</button></div>');
        $('#swap', el).addEventListener('click', function () { var a = $('#f-from', el), b = $('#f-to', el), t = a.value; a.value = b.value; b.value = t; run(); });
        fetch('https://open.er-api.com/v6/latest/USD').then(function (r) { return r.json(); }).then(function (j) { rates = j && j.rates ? j : false; run(); }).catch(function () { rates = false; run(); });
      }
    });
  };

  /* ================= DOCUMENTS ================= */
  var ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'],
    TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function w99(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  function w999(n) { var h = Math.floor(n / 100), r = n % 100; return (h ? ONES[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? w99(r) : ''); }
  function words(n, sys) {
    n = Math.floor(n); if (n === 0) return 'Zero'; var out = [];
    if (sys === 'intl') { [[1e12, 'Trillion'], [1e9, 'Billion'], [1e6, 'Million'], [1e3, 'Thousand']].forEach(function (u) { if (n >= u[0]) { out.push(w999(Math.floor(n / u[0])) + ' ' + u[1]); n %= u[0]; } }); }
    else {
      if (n >= 1e11) { out.push(words(Math.floor(n / 1e11), 'pk') + ' Kharab'); n %= 1e11; }
      if (n >= 1e9) { out.push(w99(Math.floor(n / 1e9)) + ' Arab'); n %= 1e9; }
      [[1e7, 'Crore'], [1e5, 'Lakh'], [1e3, 'Thousand']].forEach(function (u) { if (n >= u[0]) { out.push(w99(Math.floor(n / u[0])) + ' ' + u[1]); n %= u[0]; } });
    }
    if (n) out.push(w999(n));
    return out.join(' ');
  }
  function amountWords(a, sys, cur) {
    a = Math.abs(a); var whole = Math.floor(a), p = Math.round((a - whole) * 100); if (p === 100) { whole++; p = 0; }
    cur = cur || 'Rupees';
    return cur + ' ' + words(whole, sys) + (p ? ' and ' + w99(p) + ' Paisa' : '') + ' Only';
  }
  T._words = amountWords;
  T['number-to-words'] = function (el) {
    calc(el, {
      fields: [{ id: 'n', label: 'Amount', value: 1250750.5, full: true }, { id: 'sys', label: 'Number system', type: 'select', value: 'pk', options: [['pk', 'Pakistani (lakh, crore)'], ['intl', 'International (million, billion)']] }, { id: 'cur', label: 'Currency word', type: 'select', value: 'Rupees', options: [['Rupees', 'Rupees'], ['', 'None (just the number)'], ['US Dollars', 'US Dollars'], ['Dirhams', 'Dirhams'], ['Riyals', 'Riyals']] }],
      compute: function (v) {
        if (v.n >= 1e15) return { results: [], extra: '<p class="err">Number is too large.</p>' };
        var t = v.cur ? amountWords(v.n, v.sys, v.cur) : (v.n < 0 ? 'Minus ' : '') + words(Math.abs(v.n), v.sys);
        return { results: [], extra: '<div class="out-text" id="wout">' + esc(t) + '</div><div class="row" style="margin-top:10px"><button type="button" class="btn blue sm" data-copy>Copy text</button><span class="note">Figures: ' + fmt(v.n, 2) + '</span></div>' };
      },
      after: function (el) { el.addEventListener('click', function (e) { if (e.target.closest('[data-copy]')) copy($('#wout', el).textContent); }); }
    });
  };

  /* Invoice / quotation engine */
  function docTool(el, kind) {
    var K = 'doc-' + kind, title = { invoice: 'INVOICE', quotation: 'QUOTATION' }[kind];
    var d = store(K) || { from: 'Your Business Name\nAddress, City\n0300 0000000', to: 'Customer Name\nAddress', no: (kind === 'invoice' ? 'INV-' : 'QT-') + '001', date: today(), due: '', cur: 'Rs', tax: 0, disc: 0, notes: kind === 'invoice' ? 'Thank you for your business.' : 'This quotation is valid for 15 days.', items: [{ d: 'Item or service', q: 1, r: 1000 }] };
    el.innerHTML = '<div class="fgrid no-print">' +
      '<label class="f">From (your business)<textarea name="from" rows="3" style="min-height:90px"></textarea></label>' +
      '<label class="f">' + (kind === 'invoice' ? 'Bill to' : 'Quotation for') + '<textarea name="to" rows="3" style="min-height:90px"></textarea></label>' +
      '<label class="f">' + (kind === 'invoice' ? 'Invoice' : 'Quotation') + ' number<input name="no"></label>' +
      '<label class="f">Date<input name="date" type="date"></label>' +
      '<label class="f">' + (kind === 'invoice' ? 'Due date' : 'Valid until') + '<input name="due" type="date"></label>' +
      '<label class="f">Currency<input name="cur"></label>' +
      '</div><div class="no-print"><h3 style="margin-bottom:8px">Items</h3><div class="items-ed" id="items"></div><button type="button" class="btn line sm" id="add" style="margin-top:8px">+ Add item</button></div>' +
      '<div class="fgrid three no-print"><label class="f">Discount (amount)<input name="disc" type="number" step="any" inputmode="decimal"></label><label class="f">Tax (%)<input name="tax" type="number" step="any" inputmode="decimal"></label><label class="f">Words in<select name="sys"><option value="pk">Lakh / crore</option><option value="intl">Million</option></select></label><label class="f full">Notes / terms<textarea name="notes" style="min-height:70px"></textarea></label></div>' +
      '<div class="row no-print"><button type="button" class="btn blue" id="print">Print / Save as PDF</button><button type="button" class="btn line" id="reset">Start new</button><span class="note">Your draft is saved in this browser only.</span></div>' +
      '<div class="print-area"><div class="doc-preview" id="pv"></div></div>';
    var form = el;
    function setVals() { ['from', 'to', 'no', 'date', 'due', 'cur', 'disc', 'tax', 'notes'].forEach(function (k) { $('[name=' + k + ']', form).value = d[k] == null ? '' : d[k]; }); $('[name=sys]', form).value = d.sys || 'pk'; drawItems(); }
    function drawItems() {
      $('#items', el).innerHTML = d.items.map(function (it, i) { return '<div class="it" data-i="' + i + '"><input class="inp" data-k="d" placeholder="Description" value="' + esc(it.d) + '" aria-label="Description"><input class="inp" data-k="q" type="number" step="any" inputmode="decimal" placeholder="Qty" value="' + esc(it.q) + '" aria-label="Quantity"><input class="inp" data-k="r" type="number" step="any" inputmode="decimal" placeholder="Rate" value="' + esc(it.r) + '" aria-label="Rate"><button type="button" class="x" data-del="' + i + '" aria-label="Remove item">×</button></div>'; }).join('');
    }
    function read() {
      ['from', 'to', 'no', 'date', 'due', 'cur', 'notes', 'sys'].forEach(function (k) { d[k] = $('[name=' + k + ']', form).value; });
      d.disc = num($('[name=disc]', form).value); d.tax = num($('[name=tax]', form).value);
      d.items = $$('#items .it', el).map(function (r) { return { d: $('[data-k=d]', r).value, q: $('[data-k=q]', r).value, r: $('[data-k=r]', r).value }; });
    }
    function money(n) { return esc(d.cur || '') + ' ' + fmt(n, 2); }
    function render() {
      var sub = 0, rows = d.items.map(function (it, i) { var a = num(it.q) * num(it.r); sub += a; return '<tr><td>' + (i + 1) + '</td><td>' + esc(it.d) + '</td><td class="r">' + fmt(num(it.q), 2) + '</td><td class="r">' + fmt(num(it.r), 2) + '</td><td class="r">' + fmt(a, 2) + '</td></tr>'; }).join('');
      var after = sub - d.disc, tax = after * d.tax / 100, total = after + tax;
      $('#pv', el).innerHTML = '<div class="dh"><div style="white-space:pre-line"><b style="font-size:1.1rem">' + esc((d.from || '').split('\n')[0]) + '</b>\n<span class="muted">' + esc((d.from || '').split('\n').slice(1).join('\n')) + '</span></div><div style="text-align:right"><h2>' + title + '</h2><div class="muted">No. ' + esc(d.no) + '<br>Date: ' + esc(d.date) + (d.due ? '<br>' + (kind === 'invoice' ? 'Due' : 'Valid until') + ': ' + esc(d.due) : '') + '</div></div></div>' +
        '<div style="white-space:pre-line;margin-bottom:14px"><span class="muted" style="font-size:.78rem;text-transform:uppercase;letter-spacing:.08em">' + (kind === 'invoice' ? 'Bill to' : 'Prepared for') + '</span>\n<b>' + esc(d.to) + '</b></div>' +
        '<table><thead><tr><th>#</th><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:12px"><table style="width:auto;min-width:260px"><tbody><tr><td>Subtotal</td><td class="r">' + money(sub) + '</td></tr>' + (d.disc ? '<tr><td>Discount</td><td class="r">− ' + money(d.disc) + '</td></tr>' : '') + (d.tax ? '<tr><td>Tax ' + fmt(d.tax) + '%</td><td class="r">' + money(tax) + '</td></tr>' : '') + '<tr><td><b>Total</b></td><td class="r"><b>' + money(total) + '</b></td></tr></tbody></table></div>' +
        '<p class="muted" style="margin-top:10px"><i>' + esc(amountWords(total, d.sys, d.cur === 'Rs' || d.cur === 'PKR' ? 'Rupees' : d.cur)) + '</i></p>' +
        (d.notes ? '<p style="margin-top:16px;white-space:pre-line">' + esc(d.notes) + '</p>' : '') +
        '<p class="muted" style="margin-top:22px;font-size:.75rem">Made with the free invoice tool at soft2cloud.com</p>';
    }
    function sync() { read(); store(K, d); render(); }
    el.addEventListener('input', sync); el.addEventListener('change', sync);
    el.addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]');
      if (del) { read(); d.items.splice(+del.dataset.del, 1); if (!d.items.length) d.items.push({ d: '', q: 1, r: 0 }); drawItems(); sync(); }
    });
    $('#add', el).addEventListener('click', function () { read(); d.items.push({ d: '', q: 1, r: 0 }); drawItems(); sync(); $$('#items [data-k=d]', el).pop().focus(); });
    $('#print', el).addEventListener('click', function () { window.print(); });
    $('#reset', el).addEventListener('click', function () { read(); var m = String(d.no).match(/^(.*?)(\d+)$/); d.no = m ? m[1] + String(+m[2] + 1).padStart(m[2].length, '0') : d.no; d.to = ''; d.items = [{ d: '', q: 1, r: 0 }]; d.date = today(); d.due = ''; d.disc = 0; setVals(); sync(); toast('New ' + kind + ' started — your business details were kept'); });
    setVals(); render();
  }
  T['invoice-generator'] = function (el) { docTool(el, 'invoice'); };
  T['quotation-generator'] = function (el) { docTool(el, 'quotation'); };

  T['receipt-generator'] = function (el) {
    var K = 'doc-receipt', d = store(K) || { biz: 'Your Business Name\nAddress, City · 0300 0000000', no: 'RCPT-001', date: today(), from: '', amt: 5000, for: '', method: 'Cash', by: '', bal: '' };
    el.innerHTML = '<div class="fgrid no-print">' +
      '<label class="f full">Your business<textarea name="biz" style="min-height:70px"></textarea></label>' +
      '<label class="f">Receipt number<input name="no"></label><label class="f">Date<input name="date" type="date"></label>' +
      '<label class="f">Received from<input name="from" placeholder="Customer name"></label><label class="f">Amount (Rs)<input name="amt" type="number" step="any" inputmode="decimal"></label>' +
      '<label class="f">For<input name="for" placeholder="e.g. Advance for hall booking"></label><label class="f">Payment method<select name="method"><option>Cash</option><option>Bank transfer</option><option>Cheque</option><option>JazzCash</option><option>Easypaisa</option><option>Card</option></select></label>' +
      '<label class="f">Balance remaining (optional)<input name="bal" type="number" step="any" inputmode="decimal"></label><label class="f">Received by<input name="by" placeholder="Name / signature"></label></div>' +
      '<div class="row no-print"><button type="button" class="btn blue" id="print">Print / Save as PDF</button></div>' +
      '<div class="print-area"><div class="doc-preview" id="pv"></div></div>';
    var keys = ['biz', 'no', 'date', 'from', 'amt', 'for', 'method', 'by', 'bal'];
    keys.forEach(function (k) { $('[name=' + k + ']', el).value = d[k] == null ? '' : d[k]; });
    function render() {
      keys.forEach(function (k) { d[k] = $('[name=' + k + ']', el).value; }); store(K, d);
      var a = num(d.amt), lines = (d.biz || '').split('\n');
      $('#pv', el).innerHTML = '<div class="dh"><div><b style="font-size:1.1rem">' + esc(lines[0]) + '</b><br><span class="muted" style="white-space:pre-line">' + esc(lines.slice(1).join('\n')) + '</span></div><div style="text-align:right"><h2>RECEIPT</h2><div class="muted">No. ' + esc(d.no) + '<br>' + esc(d.date) + '</div></div></div>' +
        '<p style="line-height:2.1">Received with thanks from <b>' + esc(d.from || '________') + '</b> the sum of <b>Rs ' + fmt(a, 2) + '</b><br><i>(' + esc(amountWords(a, 'pk')) + ')</i><br>for <b>' + esc(d.for || '________') + '</b>, paid by <b>' + esc(d.method) + '</b>.</p>' +
        (d.bal !== '' ? '<p>Balance remaining: <b>Rs ' + fmt(num(d.bal), 2) + '</b></p>' : '') +
        '<div style="display:flex;justify-content:flex-end;margin-top:40px"><div style="text-align:center;border-top:1px solid #152033;padding-top:6px;min-width:200px">' + esc(d.by || 'Received by') + '</div></div>';
    }
    el.addEventListener('input', render); el.addEventListener('change', render);
    $('#print', el).addEventListener('click', function () { window.print(); });
    render();
  };

  T['salary-slip-generator'] = function (el) {
    var K = 'doc-salary', earn = [['basic', 'Basic salary', 50000], ['house', 'House rent', 0], ['medical', 'Medical', 0], ['conv', 'Conveyance', 0], ['ot', 'Overtime / bonus', 0]], ded = [['itax', 'Income tax', 0], ['eobi', 'EOBI', 0], ['pf', 'Provident fund', 0], ['adv', 'Advance / loan', 0], ['absent', 'Absence / other', 0]];
    var d = store(K) || {};
    function g(k, def) { return d[k] == null ? def : d[k]; }
    el.innerHTML = '<div class="fgrid no-print">' +
      '<label class="f full">Company<input name="co" value="' + esc(g('co', 'Your Company Name')) + '"></label>' +
      '<label class="f">Employee name<input name="emp" value="' + esc(g('emp', '')) + '"></label><label class="f">Designation<input name="des" value="' + esc(g('des', '')) + '"></label>' +
      '<label class="f">Employee ID<input name="eid" value="' + esc(g('eid', '')) + '"></label><label class="f">Salary month<input name="mon" type="month" value="' + esc(g('mon', today().slice(0, 7))) + '"></label>' +
      '<label class="f">Days worked<input name="days" type="number" inputmode="numeric" value="' + esc(g('days', '')) + '"></label><label class="f">Paid via<input name="via" value="' + esc(g('via', 'Bank transfer')) + '"></label></div>' +
      '<div class="fgrid no-print"><div style="display:flex;flex-direction:column;gap:10px"><h3>Earnings</h3>' + earn.map(function (e) { return field({ id: e[0], label: e[1], value: g(e[0], e[2]) }); }).join('') + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px"><h3>Deductions</h3>' + ded.map(function (e) { return field({ id: e[0], label: e[1], value: g(e[0], e[2]) }); }).join('') + '</div></div>' +
      '<div class="row no-print"><button type="button" class="btn blue" id="print">Print / Save as PDF</button><span class="note">Income tax depends on the yearly slab announced in the federal budget — enter the amount your accountant gives you.</span></div>' +
      '<div class="print-area"><div class="doc-preview" id="pv"></div></div>';
    function v(k) { var i = $('[name=' + k + ']', el); return i ? i.value : ''; }
    function render() {
      ['co', 'emp', 'des', 'eid', 'mon', 'days', 'via'].concat(earn.map(function (e) { return e[0]; }), ded.map(function (e) { return e[0]; })).forEach(function (k) { d[k] = v(k); }); store(K, d);
      var te = 0, td = 0, mon = d.mon ? new Date(d.mon + '-01T00:00').toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '';
      var er = earn.filter(function (e) { return num(d[e[0]]); }).map(function (e) { te += num(d[e[0]]); return '<tr><td>' + e[1] + '</td><td class="r">' + fmt(num(d[e[0]]), 2) + '</td></tr>'; }).join('');
      var dr = ded.filter(function (e) { return num(d[e[0]]); }).map(function (e) { td += num(d[e[0]]); return '<tr><td>' + e[1] + '</td><td class="r">' + fmt(num(d[e[0]]), 2) + '</td></tr>'; }).join('');
      var net = te - td;
      $('#pv', el).innerHTML = '<div class="dh"><div><b style="font-size:1.15rem">' + esc(d.co) + '</b><br><span class="muted">Salary slip — ' + esc(mon) + '</span></div><div style="text-align:right" class="muted">' + (d.eid ? 'ID: ' + esc(d.eid) + '<br>' : '') + (d.days ? 'Days worked: ' + esc(d.days) + '<br>' : '') + esc(d.via) + '</div></div>' +
        '<p style="margin-bottom:12px"><b>' + esc(d.emp || 'Employee name') + '</b>' + (d.des ? ' · ' + esc(d.des) : '') + '</p>' +
        '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px"><table><thead><tr><th>Earnings</th><th class="r">Rs</th></tr></thead><tbody>' + er + '<tr><td><b>Gross</b></td><td class="r"><b>' + fmt(te, 2) + '</b></td></tr></tbody></table>' +
        '<table><thead><tr><th>Deductions</th><th class="r">Rs</th></tr></thead><tbody>' + (dr || '<tr><td>None</td><td class="r">0</td></tr>') + '<tr><td><b>Total</b></td><td class="r"><b>' + fmt(td, 2) + '</b></td></tr></tbody></table></div>' +
        '<div style="margin-top:16px;padding:12px 14px;background:#e6edfd;border-radius:10px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>Net pay</b><b>Rs ' + fmt(net, 2) + '</b></div>' +
        '<p class="muted" style="margin-top:8px"><i>' + esc(amountWords(net, 'pk')) + '</i></p>' +
        '<div style="display:flex;justify-content:space-between;margin-top:40px;gap:20px"><div style="border-top:1px solid #152033;padding-top:6px;min-width:160px;text-align:center">Employee signature</div><div style="border-top:1px solid #152033;padding-top:6px;min-width:160px;text-align:center">Authorised signature</div></div>';
    }
    el.addEventListener('input', render);
    $('#print', el).addEventListener('click', function () { window.print(); });
    render();
  };

  /* ================= PAKISTAN CONVERTERS ================= */
  T['land-area-converter'] = function (el) {
    calc(el, {
      fields: [{ id: 'v', label: 'Value', value: 1 }, { id: 'u', label: 'Unit', type: 'select', value: 'kanal', options: [['marla', 'Marla'], ['kanal', 'Kanal'], ['acre', 'Acre'], ['sqft', 'Square feet'], ['sqyd', 'Square yards (gaz)'], ['sqm', 'Square metres'], ['hectare', 'Hectare'], ['murabba', 'Murabba (25 acres)']] }, { id: 'basis', label: '1 marla equals', type: 'select', value: '225', options: [['225', '225 sq ft (most housing societies, e.g. DHA Lahore)'], ['250', '250 sq ft (some societies)'], ['272.25', '272.25 sq ft (revenue / old record)']], full: true }],
      compute: function (v) {
        var M = num(v.basis), U = { sqft: 1, sqyd: 9, sqm: 10.7639104, marla: M, kanal: 20 * M, acre: 43560, hectare: 107639.104, murabba: 25 * 43560 }, ft = v.v * U[v.u];
        var list = [['Marla', ft / U.marla], ['Kanal', ft / U.kanal], ['Square feet', ft], ['Square yards', ft / 9], ['Square metres', ft / U.sqm], ['Acre', ft / U.acre], ['Hectare', ft / U.hectare]];
        return { results: list.map(function (r, i) { return [r[0], fmt(r[1], 4), i === 0]; }), extra: '<p class="note">' + (UR ? 'آپ کے مرلے کے حساب سے 1 کنال = 20 مرلہ = ' + fmt(20 * M) + ' مربع فٹ۔ 1 ایکڑ = 43,560 مربع فٹ' + (M === 272.25 ? ' = 8 کنال' : ' (اس مرلے سے تقریباً ' + fmt(43560 / (20 * M), 2) + ' کنال)') + '۔' : '1 kanal = 20 marla = ' + fmt(20 * M) + ' sq ft with your marla size. 1 acre = 43,560 sq ft' + (M === 272.25 ? ' = 8 kanal' : ' (≈ ' + fmt(43560 / (20 * M), 2) + ' kanal at this marla size)') + '.') + '</p>' };
      },
      noteUr: 'مرلے کا سائز ہر جگہ ایک جیسا نہیں۔ اپنی پلاٹ فائل یا رجسٹری میں لکھا سائز ضرور دیکھیں۔',
      note: 'Marla size is not the same everywhere. Always confirm the size written in your plot file or registry.'
    });
  };
  T['gold-price-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'rate', label: 'Gold rate, 24k (Rs per tola)', value: '', ph: 'Today\'s rate' }, { id: 'k', label: 'Karat', type: 'select', value: '22', options: [['24', '24k (99.9%)'], ['22', '22k (91.6%)'], ['21', '21k (87.5%)'], ['18', '18k (75%)']] }, { id: 'w', label: 'Weight', value: 1 }, { id: 'wu', label: 'Weight in', type: 'select', value: 'tola', options: [['tola', 'Tola'], ['g', 'Grams'], ['masha', 'Masha'], ['ratti', 'Ratti']] }, { id: 'mk', label: 'Making charges', value: 0 }, { id: 'mku', label: 'Making charged as', type: 'select', value: 'pct', options: [['pct', '% of gold value'], ['tola', 'Rs per tola'], ['fixed', 'Fixed Rs']] }],
      compute: function (v) {
        var TOLA = 11.6638, g = { tola: TOLA, g: 1, masha: TOLA / 12, ratti: TOLA / 96 }[v.wu] * v.w, tola = g / TOLA, k = num(v.k);
        if (!v.rate) return { results: [['Weight', fmt(g, 3) + ' g · ' + fmt(tola, 4) + ' tola']], extra: '<p class="warn">' + L('Enter today\'s 24k rate per tola from your jeweller or the sarafa association.') + '</p>' };
        var r = v.rate * k / 24, val = r * tola, mk = v.mku === 'pct' ? val * v.mk / 100 : v.mku === 'tola' ? v.mk * tola : v.mk;
        var autoNote = el._autoRate && UR ? '<p class="warn">ریٹ بین الاقوامی قیمت سے خود بھر دیا گیا ہے (اندازاً)۔ مقامی صرافہ ریٹ عموماً زیادہ ہوتا ہے — درست قیمت کے لیے آج کا مقامی ریٹ لکھیں۔</p>' : el._autoRate ? '<p class="warn">The rate was filled in automatically from the international gold price (approximate). Local sarafa rates are often higher — type today\'s local rate for an exact price.</p>' : '';
        return { extra: autoNote, results: [[k + 'k rate per tola', rs(r)], [k + 'k rate per gram', rs(r / TOLA, 2)], ['Weight', fmt(g, 3) + ' g · ' + fmt(tola, 4) + ' tola'], ['Gold value', rs(val)], ['Making charges', rs(mk)], ['Total price', rs(val + mk), true]] };
      },
      after: function (el, run) { $('#f-rate', el).addEventListener('input', function () { el._autoRate = false; }); getMetalRates(function (r) { var g = $('#f-rate', el); if (r && !g.value) { g.value = r.gold; el._autoRate = true; run(); } }); },
      noteUr: '1 تولہ = 11.6638 گرام = 12 ماشہ = 96 رتی۔ جیولر واپس خریدتے وقت کاٹ نکالتے ہیں، اس لیے فروخت کی قیمت عموماً کم ملتی ہے۔',
      note: '1 tola = 11.6638 grams = 12 masha = 96 ratti. Jewellers may deduct for impurity (“kaat”) when buying back, so the resale price is usually lower.'
    });
  };
  T['unit-converter'] = function (el) {
    var C = {
      Length: { m: ['Metre', 1], km: ['Kilometre', 1000], cm: ['Centimetre', .01], mm: ['Millimetre', .001], in: ['Inch', .0254], ft: ['Foot', .3048], yd: ['Yard (gaz)', .9144], mi: ['Mile', 1609.344] },
      Weight: { kg: ['Kilogram', 1], g: ['Gram', .001], maund: ['Maund (40 kg)', 40], ton: ['Tonne', 1000], lb: ['Pound', .45359237], oz: ['Ounce', .028349523], tola: ['Tola', .0116638] },
      Volume: { l: ['Litre', 1], ml: ['Millilitre', .001], gal: ['US gallon', 3.785411784], ukgal: ['UK gallon', 4.54609], cup: ['Cup (US)', .2365882], m3: ['Cubic metre', 1000] },
      Temperature: { c: ['Celsius'], f: ['Fahrenheit'], k: ['Kelvin'] },
      Speed: { kmh: ['km/h', 1], mph: ['mph', 1.609344], ms: ['m/s', 3.6], kn: ['knot', 1.852] }
    };
    el.innerHTML = '<div class="seg" role="group" aria-label="Category">' + Object.keys(C).map(function (k, i) { return '<button type="button" aria-pressed="' + (i ? 'false' : 'true') + '" data-c="' + k + '">' + k + '</button>'; }).join('') + '</div><div class="fgrid three"><label class="f">Value<input id="uv" type="number" step="any" inputmode="decimal" value="1"></label><label class="f">From<select id="uf"></select></label><label class="f">To<select id="ut"></select></label></div><div class="result big" aria-live="polite"></div><div id="uall"></div>';
    var cat = 'Length';
    function opts() { var o = Object.keys(C[cat]).map(function (k) { return '<option value="' + k + '">' + C[cat][k][0] + '</option>'; }).join(''); $('#uf', el).innerHTML = o; $('#ut', el).innerHTML = o; $('#ut', el).selectedIndex = 1; }
    function conv(x, f, t) {
      if (cat === 'Temperature') { var c = f === 'c' ? x : f === 'f' ? (x - 32) * 5 / 9 : x - 273.15; return t === 'c' ? c : t === 'f' ? c * 9 / 5 + 32 : c + 273.15; }
      return x * C[cat][f][1] / C[cat][t][1];
    }
    function run() {
      var x = num($('#uv', el).value), f = $('#uf', el).value, t = $('#ut', el).value;
      $('.result', el).innerHTML = '<div class="big"><span>' + fmt(x, 6) + ' ' + esc(C[cat][f][0]) + ' =</span><b>' + fmt(conv(x, f, t), 6) + ' ' + esc(C[cat][t][0]) + '</b></div>';
      $('#uall', el).innerHTML = table(['Unit', 'Value'], Object.keys(C[cat]).map(function (k) { return [C[cat][k][0], fmt(conv(x, f, k), 6)]; }));
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('[data-c]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); opts(); run(); });
    el.addEventListener('input', run); el.addEventListener('change', run);
    opts(); run();
  };
  T['fuel-cost-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'km', label: 'Distance one way (km)', value: 25 }, { id: 'avg', label: 'Vehicle average (km per litre)', value: 14 }, { id: 'price', label: 'Petrol / diesel price (Rs per litre)', value: 0, ph: 'Current price' }, { id: 'days', label: 'Trips per month', value: 22 }, { id: 'rt', label: 'Return trip (double the distance)', type: 'check', value: true, full: true }, { id: 'share', label: 'Split cost between people', value: 1 }],
      compute: function (v) {
        var d = v.km * (v.rt ? 2 : 1), l = v.avg ? d / v.avg : 0, c = l * v.price, sh = Math.max(1, v.share);
        var r = [['Fuel per trip', fmt(l, 2) + ' L'], ['Cost per trip', rs(c)], ['Per person', rs(c / sh)], ['Monthly fuel', fmt(l * v.days, 1) + ' L'], ['Monthly cost', rs(c * v.days), true]];
        return { results: r, extra: v.price ? '' : '<p class="warn">Enter the current fuel price — it changes every fortnight in Pakistan.</p>' };
      }
    });
  };

  /* ================= DATE ================= */
  function diffYMD(a, b) {
    var y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return [y, m, d];
  }
  function D(s) { var p = String(s).split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  T['age-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'dob', label: 'Date of birth', type: 'date', value: '1995-08-14' }, { id: 'on', label: 'Age on date', type: 'date', value: today() }],
      compute: function (v) {
        var a = D(v.dob), b = D(v.on); if (!a || !b) return { results: [] };
        if (a > b) return { results: [], extra: '<p class="err">Date of birth is after the selected date.</p>' };
        var r = diffYMD(a, b), days = Math.round((b - a) / 864e5), nb = new Date(b.getFullYear(), a.getMonth(), a.getDate()); if (nb <= b) nb = new Date(b.getFullYear() + 1, a.getMonth(), a.getDate());
        var left = Math.round((nb - b) / 864e5);
        return { results: [['Age', r[0] + ' years ' + r[1] + ' months ' + r[2] + ' days', true], ['Total months', fmt(r[0] * 12 + r[1], 0)], ['Total weeks', fmt(Math.floor(days / 7), 0)], ['Total days', fmt(days, 0)], ['Next birthday', left === 0 ? 'Today' : 'in ' + left + ' days'], ['Born on a', a.toLocaleDateString('en-US', { weekday: 'long' })]] };
      }
    });
  };
  T['date-difference-calculator'] = function (el) {
    var d0 = new Date(); d0.setDate(d0.getDate() + 30);
    var end = d0.getFullYear() + '-' + String(d0.getMonth() + 1).padStart(2, '0') + '-' + String(d0.getDate()).padStart(2, '0');
    calc(el, {
      fields: [{ id: 'a', label: 'Start date', type: 'date', value: today() }, { id: 'b', label: 'End date', type: 'date', value: end }, { id: 'inc', label: 'Include the end date', type: 'check', value: false }, { id: 'sat', label: 'Saturday is a holiday', type: 'check', value: true }, { id: 'sun', label: 'Sunday is a holiday', type: 'check', value: true }, { id: 'fri', label: 'Friday is a holiday', type: 'check', value: false }, { id: 'hol', label: 'Other holidays in this period (days)', value: 0, full: true }],
      compute: function (v) {
        var a = D(v.a), b = D(v.b); if (!a || !b) return { results: [] };
        var sw = a > b; if (sw) { var t = a; a = b; b = t; }
        var days = Math.round((b - a) / 864e5) + (v.inc ? 1 : 0), work = 0, off = { 5: v.fri, 6: v.sat, 0: v.sun };
        for (var i = 0; i < days; i++) { var x = new Date(a.getFullYear(), a.getMonth(), a.getDate() + i); if (!off[x.getDay()]) work++; }
        var r = diffYMD(a, v.inc ? new Date(b.getFullYear(), b.getMonth(), b.getDate() + 1) : b);
        return { results: [['Total days', fmt(days, 0), true], ['Working days', fmt(Math.max(work - v.hol, 0), 0)], ['Weeks', fmt(Math.floor(days / 7), 0) + ' weeks ' + days % 7 + ' days'], ['Years, months, days', r[0] + 'y ' + r[1] + 'm ' + r[2] + 'd']], extra: sw ? '<p class="note">The end date was before the start date, so they were swapped.</p>' : '' };
      }
    });
  };

  /* ================= TEXT & WEB ================= */
  T['word-counter'] = function (el) {
    el.innerHTML = '<label class="f">Your text<textarea id="wt" style="min-height:220px" placeholder="Type or paste your text here…"></textarea></label><div class="result" aria-live="polite"></div><div id="wk"></div>';
    var ta = $('#wt', el), saved = store('wc'); if (saved) ta.value = saved;
    function run() {
      var s = ta.value, w = s.trim() ? s.trim().split(/\s+/).length : 0, sen = (s.match(/[^.!?۔\n]+[.!?۔]+/g) || []).length || (s.trim() ? 1 : 0), par = s.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length;
      $('.result', el).innerHTML = [['Words', fmt(w, 0), 1], ['Characters', fmt(s.length, 0)], ['Without spaces', fmt(s.replace(/\s/g, '').length, 0)], ['Sentences', fmt(sen, 0)], ['Paragraphs', fmt(par, 0)], ['Reading time', Math.max(1, Math.ceil(w / 200)) + ' min'], ['Speaking time', Math.max(1, Math.ceil(w / 130)) + ' min']].map(function (r) { return '<div' + (r[2] ? ' class="big"' : '') + '><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
      var f = {}; (s.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []).forEach(function (x) { if (x.length > 3) f[x] = (f[x] || 0) + 1; });
      var top = Object.keys(f).sort(function (a, b) { return f[b] - f[a]; }).slice(0, 8);
      $('#wk', el).innerHTML = top.length ? '<p class="note">Most used words: ' + top.map(function (k) { return '<b>' + esc(k) + '</b> (' + f[k] + ')'; }).join(', ') + '</p>' : '';
      store('wc', s);
    }
    ta.addEventListener('input', run); run();
  };
  T['case-converter'] = function (el) {
    el.innerHTML = '<label class="f">Text<textarea id="ct" placeholder="Type or paste text">soft2cloud makes business software for pakistan</textarea></label><div class="row" id="cb"></div><div class="out-text" id="co" aria-live="polite"></div><div class="row"><button type="button" class="btn blue sm" id="cc">Copy result</button></div>';
    function wordsOf(s) { return s.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean); }
    var M = {
      'UPPER CASE': function (s) { return s.toUpperCase(); }, 'lower case': function (s) { return s.toLowerCase(); },
      'Title Case': function (s) { return s.toLowerCase().replace(/(^|[\s\-(“"'])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }); },
      'Sentence case': function (s) { return s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }); },
      'camelCase': function (s) { return wordsOf(s).map(function (w, i) { w = w.toLowerCase(); return i ? w[0].toUpperCase() + w.slice(1) : w; }).join(''); },
      'snake_case': function (s) { return wordsOf(s).join('_').toLowerCase(); }, 'kebab-case': function (s) { return wordsOf(s).join('-').toLowerCase(); },
      'aLtErNaTe': function (s) { var i = 0; return s.replace(/\p{L}/gu, function (c) { return i++ % 2 ? c.toUpperCase() : c.toLowerCase(); }); }
    };
    var cur = 'Title Case';
    $('#cb', el).innerHTML = '<div class="seg" role="group" aria-label="Case">' + Object.keys(M).map(function (k) { return '<button type="button" data-m="' + esc(k) + '" aria-pressed="' + (k === cur) + '">' + esc(k) + '</button>'; }).join('') + '</div>';
    function run() { $('#co', el).textContent = M[cur]($('#ct', el).value); }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (b) { cur = b.dataset.m; $$('[data-m]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); run(); } if (e.target.id === 'cc') copy($('#co', el).textContent); });
    $('#ct', el).addEventListener('input', run); run();
  };
  T['password-generator'] = function (el) {
    calc(el, {
      fields: [{ id: 'len', label: 'Length', value: 16, step: 1, min: 4 }, { id: 'n', label: 'How many', value: 5, step: 1, min: 1 }, { id: 'up', label: 'Uppercase A–Z', type: 'check', value: true }, { id: 'lo', label: 'Lowercase a–z', type: 'check', value: true }, { id: 'dg', label: 'Numbers 0–9', type: 'check', value: true }, { id: 'sy', label: 'Symbols !@#$…', type: 'check', value: true }, { id: 'sim', label: 'Avoid look-alikes (0 O l 1 I)', type: 'check', value: true, full: true }],
      compute: function (v) {
        var sets = [], len = Math.min(Math.max(4, Math.round(v.len)), 128), n = Math.min(Math.max(1, Math.round(v.n)), 20);
        if (v.up) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); if (v.lo) sets.push('abcdefghijklmnopqrstuvwxyz'); if (v.dg) sets.push('0123456789'); if (v.sy) sets.push('!@#$%^&*()-_=+[]{};:,.?');
        if (v.sim) sets = sets.map(function (s) { return s.replace(/[0Ol1I]/g, ''); });
        if (!sets.length) return { results: [], extra: '<p class="err">Pick at least one character type.</p>' };
        var all = sets.join('');
        function rnd(max) { var a = new Uint32Array(1), lim = Math.floor(4294967296 / max) * max; do { crypto.getRandomValues(a); } while (a[0] >= lim); return a[0] % max; }
        function one() { var p = sets.map(function (s) { return s[rnd(s.length)]; }); while (p.length < len) p.push(all[rnd(all.length)]); for (var i = p.length - 1; i > 0; i--) { var j = rnd(i + 1), t = p[i]; p[i] = p[j]; p[j] = t; } return p.join(''); }
        var bits = Math.round(len * Math.log2(all.length)), str = bits >= 100 ? 'Very strong' : bits >= 70 ? 'Strong' : bits >= 50 ? 'Fair' : 'Weak';
        var list = []; for (var i = 0; i < n; i++) list.push(one());
        return { results: [['Strength', str + ' (' + bits + ' bits)', true]], extra: '<div style="display:flex;flex-direction:column;gap:8px">' + list.map(function (p) { return '<div class="row" style="flex-wrap:nowrap"><code class="out-text" style="flex:1;min-height:0;padding:10px 12px">' + esc(p) + '</code><button type="button" class="btn line sm" data-pw="' + esc(p) + '">Copy</button></div>'; }).join('') + '</div><div class="row" style="margin-top:10px"><button type="button" class="btn blue sm" id="regen">Generate again</button></div>' };
      },
      after: function (el, run) { el.addEventListener('click', function (e) { var b = e.target.closest('[data-pw]'); if (b) copy(b.dataset.pw); if (e.target.id === 'regen') run(); }); },
      note: 'Passwords are created on your device with the browser\'s secure random generator and are never sent anywhere.'
    });
  };
  T['json-formatter'] = function (el) {
    el.innerHTML = '<label class="f">JSON<textarea id="ji" style="min-height:200px;font-family:var(--mono);font-size:.88rem" spellcheck="false">{"company":"Soft2Cloud","products":["VenueDesk","Mart POS"],"city":"Lahore"}</textarea></label><div class="row"><button type="button" class="btn blue sm" data-a="pretty">Format</button><button type="button" class="btn line sm" data-a="min">Minify</button><button type="button" class="btn line sm" data-a="sort">Sort keys</button><select class="inp" id="jind" style="width:auto" aria-label="Indent"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="\t">Tabs</option></select><button type="button" class="btn line sm" data-a="copy">Copy</button></div><div id="jmsg" aria-live="polite"></div><pre class="out-text" id="jo"></pre>';
    function sortK(x) { if (Array.isArray(x)) return x.map(sortK); if (x && typeof x === 'object') { var o = {}; Object.keys(x).sort().forEach(function (k) { o[k] = sortK(x[k]); }); return o; } return x; }
    function go(a) {
      var s = $('#ji', el).value, ind = $('#jind', el).value; ind = ind === '\t' ? '\t' : +ind;
      if (a === 'copy') return copy($('#jo', el).textContent);
      try { var j = JSON.parse(s); if (a === 'sort') j = sortK(j); $('#jo', el).textContent = a === 'min' ? JSON.stringify(j) : JSON.stringify(j, null, ind); $('#jmsg', el).innerHTML = '<p class="note" style="color:var(--ok)">✓ Valid JSON</p>'; }
      catch (e) { var m = String(e.message).match(/position (\d+)/), extra = ''; if (m && !/line \d/.test(e.message)) { var p = +m[1], ln = s.slice(0, p).split('\n'); extra = ' (line ' + ln.length + ', column ' + (ln[ln.length - 1].length + 1) + ')'; } $('#jmsg', el).innerHTML = '<p class="err">Invalid JSON: ' + esc(e.message) + extra + '</p>'; $('#jo', el).textContent = ''; }
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (b) go(b.dataset.a); });
    go('pretty');
  };
  function loadLib(src, test, cb) {
    if (test()) return cb(true);
    var s = document.createElement('script'); s.src = src; s.onload = function () { cb(test()); }; s.onerror = function () { cb(false); }; document.head.appendChild(s);
  }
  T['qr-code-generator'] = function (el) {
    el.innerHTML = '<div class="seg" role="group" aria-label="QR type"><button type="button" data-q="url" aria-pressed="true">Link / text</button><button type="button" data-q="wa" aria-pressed="false">WhatsApp</button><button type="button" data-q="wifi" aria-pressed="false">Wi-Fi</button><button type="button" data-q="tel" aria-pressed="false">Phone</button></div><div class="fgrid" id="qf"></div><div class="fgrid three"><label class="f">Size<select id="qs"><option value="256">256 px</option><option value="512" selected>512 px</option><option value="1024">1024 px</option></select></label><label class="f">Colour<input id="qc" type="color" value="#0f1a2c"></label><label class="f">Error correction<select id="qe"><option value="M">Medium</option><option value="H">High (for printing)</option><option value="L">Low</option></select></label></div><div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center"><div id="qr" style="background:#fff;padding:14px;border-radius:12px;border:1px solid var(--line);width:min(260px,100%)"></div><div style="display:flex;flex-direction:column;gap:8px"><button type="button" class="btn blue" id="qd">Download PNG</button><p class="note" id="qmsg"></p></div></div>';
    var mode = 'url', F = { url: [['t', 'Link or text', 'https://soft2cloud.com']], wa: [['p', 'WhatsApp number (with country code)', '923706353528'], ['m', 'Message (optional)', 'Hello, I want to know more']], wifi: [['s', 'Network name (SSID)', ''], ['k', 'Password', ''], ['e', 'Security (WPA, WEP or none)', 'WPA']], tel: [['p', 'Phone number', '+923706353528']] };
    function drawF() { $('#qf', el).innerHTML = F[mode].map(function (f) { return '<label class="f full">' + f[1] + '<input data-k="' + f[0] + '" value="' + esc(f[2]) + '"></label>'; }).join(''); }
    function val(k) { var i = $('[data-k=' + k + ']', el); return i ? i.value.trim() : ''; }
    function text() {
      if (mode === 'url') return val('t');
      if (mode === 'wa') return 'https://wa.me/' + val('p').replace(/\D/g, '') + (val('m') ? '?text=' + encodeURIComponent(val('m')) : '');
      if (mode === 'wifi') { var e = val('e').toUpperCase(); e = e === 'NONE' ? 'nopass' : e || 'WPA'; function x(s) { return s.replace(/([\\;,:"])/g, '\\$1'); } return 'WIFI:T:' + e + ';S:' + x(val('s')) + ';P:' + x(val('k')) + ';;'; }
      return 'tel:' + val('p').replace(/[^\d+]/g, '');
    }
    var ready = false, t;
    function run() {
      if (!ready) return; var box = $('#qr', el), s = text(); box.innerHTML = '';
      if (!s) { $('#qmsg', el).textContent = 'Enter something to encode.'; return; }
      try { new QRCode(box, { text: s, width: +$('#qs', el).value, height: +$('#qs', el).value, colorDark: $('#qc', el).value, colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel[$('#qe', el).value] }); $$('img,canvas', box).forEach(function (n) { n.style.width = '100%'; n.style.height = 'auto'; if (n.tagName === 'IMG') { n.alt = 'QR code for ' + s; n.setAttribute('width', $('#qs', el).value); n.setAttribute('height', $('#qs', el).value); } }); $('#qmsg', el).textContent = 'Encodes: ' + (s.length > 60 ? s.slice(0, 60) + '…' : s); }
      catch (e) { $('#qmsg', el).textContent = 'Text is too long for a QR code.'; }
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) { mode = b.dataset.q; $$('[data-q]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); drawF(); run(); } });
    el.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 200); }); el.addEventListener('change', run);
    $('#qd', el).addEventListener('click', function () { var c = $('#qr canvas', el); if (!c) return; c.toBlob(function (b) { download('soft2cloud-qr.png', b); }); });
    drawF();
    loadLib('/assets/vendor/qrcode.min.js', function () { return !!window.QRCode; }, function (ok) { ready = ok; if (ok) run(); else $('#qmsg', el).textContent = 'The QR tool could not load. Please refresh the page.'; });
  };
  T['barcode-generator'] = function (el) {
    el.innerHTML = '<div class="fgrid"><label class="f">Barcode value<input id="bv" value="SOFT2CLOUD-001"></label><label class="f">Format<select id="bf"><option value="CODE128">Code 128 (letters + numbers)</option><option value="EAN13">EAN-13 (retail, 12–13 digits)</option><option value="EAN8">EAN-8 (7–8 digits)</option><option value="UPC">UPC-A (11–12 digits)</option><option value="CODE39">Code 39</option><option value="ITF14">ITF-14 (cartons)</option></select></label><label class="f">Bar width<input id="bw" type="number" min="1" max="4" value="2"></label><label class="f">Height<input id="bh" type="number" min="30" max="200" value="80"></label><label class="check full"><input type="checkbox" id="bt" checked> Show text under bars</label></div><div style="background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px;overflow-x:auto"><svg id="bs"></svg></div><p id="bmsg" aria-live="polite"></p><div class="row"><button type="button" class="btn blue" id="bp">Download PNG</button><button type="button" class="btn line" id="bd">Download SVG</button></div>';
    var ready = false;
    function run() {
      if (!ready) return; var m = $('#bmsg', el); m.className = ''; m.textContent = '';
      try { JsBarcode($('#bs', el), $('#bv', el).value, { format: $('#bf', el).value, width: num($('#bw', el).value) || 2, height: num($('#bh', el).value) || 80, displayValue: $('#bt', el).checked, margin: 10, font: 'IBM Plex Mono, monospace', valid: function (ok) { if (!ok) { m.className = 'err'; m.textContent = 'This value is not valid for the chosen format.'; } } }); }
      catch (e) { m.className = 'err'; m.textContent = 'This value is not valid for the chosen format.'; }
    }
    el.addEventListener('input', run); el.addEventListener('change', run);
    $('#bd', el).addEventListener('click', function () { download('barcode.svg', new Blob([new XMLSerializer().serializeToString($('#bs', el))], { type: 'image/svg+xml' })); });
    $('#bp', el).addEventListener('click', function () {
      var svg = $('#bs', el), s = new XMLSerializer().serializeToString(svg), img = new Image(), w = svg.width.baseVal.value, h = svg.height.baseVal.value;
      img.onload = function () { var c = document.createElement('canvas'); c.width = w * 3; c.height = h * 3; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); c.toBlob(function (b) { download('barcode.png', b); }); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
    loadLib('/assets/vendor/JsBarcode.all.min.js', function () { return !!window.JsBarcode; }, function (ok) { ready = ok; if (ok) run(); else $('#bmsg', el).textContent = 'The barcode tool could not load. Please refresh the page.'; });
  };
  T['image-resizer'] = function (el) {
    el.innerHTML = '<label class="f">Choose an image<input type="file" id="if" accept="image/*"></label><p class="note">Your photo stays on your device — nothing is uploaded.</p><div id="ib" hidden><div class="fgrid three"><label class="f">Width (px)<input id="iw" type="number" min="1"></label><label class="f">Height (px)<input id="ih" type="number" min="1"></label><label class="f">Format<select id="it"><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></label><label class="check"><input type="checkbox" id="ik" checked> Keep proportions</label><label class="f">Quality<input id="iq" type="range" min="40" max="100" value="85"></label><label class="f">Quick size<select id="ip"><option value="">Custom</option><option value="0.5">50%</option><option value="0.25">25%</option><option value="1080">Instagram 1080 wide</option><option value="1920">HD 1920 wide</option><option value="600">Passport-ish 600 wide</option></select></label></div><div class="result" aria-live="polite"></div><img id="iv" alt="Resized image preview" width="480" height="360" hidden style="max-height:360px;width:auto;height:auto;border-radius:10px;border:1px solid var(--line)"><div class="row"><button type="button" class="btn blue" id="id">Download</button></div></div>';
    var img = null, name = 'image', blob = null, t;
    $('#if', el).addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return; name = f.name.replace(/\.[^.]+$/, ''); var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () { img = im; img._size = f.size; $('#iw', el).value = im.naturalWidth; $('#ih', el).value = im.naturalHeight; $('#ib', el).hidden = false; run(); };
      im.onerror = function () { toast('That file could not be opened as an image'); };
      im.src = u;
    });
    function ratio() { return img.naturalHeight / img.naturalWidth; }
    el.addEventListener('input', function (e) {
      if (!img) return;
      if (e.target.id === 'iw' && $('#ik', el).checked) $('#ih', el).value = Math.round(num(e.target.value) * ratio());
      if (e.target.id === 'ih' && $('#ik', el).checked) $('#iw', el).value = Math.round(num(e.target.value) / ratio());
      if (e.target.id === 'ip' && e.target.value) { var p = num(e.target.value), w = p <= 1 ? img.naturalWidth * p : p; $('#iw', el).value = Math.round(w); $('#ih', el).value = Math.round(w * ratio()); }
      clearTimeout(t); t = setTimeout(run, 150);
    });
    el.addEventListener('change', function (e) { if (e.target.id === 'it') run(); });
    function run() {
      var w = Math.max(1, Math.min(8000, Math.round(num($('#iw', el).value)))), h = Math.max(1, Math.min(8000, Math.round(num($('#ih', el).value)))), c = document.createElement('canvas'), x = c.getContext('2d'), type = $('#it', el).value;
      c.width = w; c.height = h; if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); } x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, w, h);
      c.toBlob(function (b) { if (!b) return; blob = b; var iv = $('#iv', el); iv.src = URL.createObjectURL(b); iv.setAttribute('width', w); iv.setAttribute('height', h); iv.hidden = false; $('.result', el).innerHTML = '<div><span>Original</span><b>' + img.naturalWidth + '×' + img.naturalHeight + ' · ' + fmt(img._size / 1024, 0) + ' KB</b></div><div class="big"><span>New</span><b>' + w + '×' + h + ' · ' + fmt(b.size / 1024, 0) + ' KB</b></div>'; }, type, num($('#iq', el).value) / 100);
    }
    $('#id', el).addEventListener('click', function () { if (blob) download(name + '-resized.' + { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }[$('#it', el).value], blob); });
  };

  /* ================= NEW PAKISTAN TOOLS ================= */
  /* Salary income tax — slabs: [upper limit, fixed tax at lower limit, rate above lower limit] */
  var TAX_SLABS = {
    '2027': { label: 'Tax year 2027 (July 2026 – June 2027)', surcharge: 0, slabs: [[600000, 0, 0, 0], [1200000, 600000, 0, .01], [2200000, 1200000, 6000, .11], [3200000, 2200000, 116000, .20], [4100000, 3200000, 316000, .25], [5600000, 4100000, 541000, .29], [7000000, 5600000, 976000, .32], [Infinity, 7000000, 1424000, .35]] },
    '2026': { label: 'Tax year 2026 (July 2025 – June 2026)', surcharge: .09, slabs: [[600000, 0, 0, 0], [1200000, 600000, 0, .01], [2200000, 1200000, 6000, .11], [3200000, 2200000, 116000, .23], [4100000, 3200000, 346000, .30], [Infinity, 4100000, 616000, .35]] }
  };
  function salaryTax(income, year) {
    var y = TAX_SLABS[year], tax = 0, slab = null;
    for (var i = 0; i < y.slabs.length; i++) { var s = y.slabs[i]; if (income <= s[0]) { slab = s; tax = s[2] + (income - s[1]) * s[3]; break; } }
    if (income <= 600000) tax = 0;
    var sur = y.surcharge && income > 10000000 ? tax * y.surcharge : 0;
    return { tax: Math.max(0, tax), sur: sur, total: Math.max(0, tax) + sur, slab: slab };
  }
  T._salaryTax = salaryTax;
  T['salary-tax-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'sal', label: 'Salary', value: 150000 }, { id: 'per', label: 'Salary is', type: 'select', value: 'm', options: [['m', 'Per month'], ['y', 'Per year']] }, { id: 'year', label: 'Tax year', type: 'select', value: '2027', options: [['2027', TAX_SLABS['2027'].label], ['2026', TAX_SLABS['2026'].label]], full: true }],
      compute: function (v) {
        var yr = v.per === 'm' ? v.sal * 12 : v.sal, r = salaryTax(yr, v.year), eff = yr ? r.total / yr * 100 : 0;
        var rows = TAX_SLABS[v.year].slabs.map(function (s) { return [(s[1] ? fmt(s[1] + 1, 0) : '0') + ' – ' + (isFinite(s[0]) ? fmt(s[0], 0) : 'above'), s[3] ? fmt(s[3] * 100, 0) + '% above ' + fmt(s[1], 0) + (s[2] ? ' + Rs ' + fmt(s[2], 0) : '') : 'No tax']; });
        return { results: [['Tax per month', rs(r.total / 12), true], ['Tax per year', rs(r.total)], ['Take-home per month', rs((yr - r.total) / 12)], ['Effective tax rate', pct(eff)]].concat(r.sur ? [['Includes surcharge', rs(r.sur)]] : []),
          extra: '<h3 style="margin:6px 0 10px">Salary tax slabs — ' + esc(TAX_SLABS[v.year].label) + '</h3>' + table(['Yearly taxable salary (Rs)', 'Tax'], rows) };
      },
      note: 'For salaried people (salary is more than 75% of taxable income). Taxable salary may differ from gross pay — for example the tax-exempt part of medical allowance. Rates from the Finance Act 2026 as reported; confirm on fbr.gov.pk.'
    });
  };

  /* Electricity bill — NEPRA residential tariff (S.R.O. 279(I)/2026), editable */
  T['electricity-bill-calculator'] = function (el) {
    var NP = [[100, 22.44, 275], [200, 28.91, 300], [300, 33.10, 350], [400, 36.46, 400], [500, 38.95, 500], [600, 40.22, 675], [700, 41.85, 675], [Infinity, 47.20, 675]];
    calc(el, {
      fields: [{ id: 'u', label: 'Units used this month (kWh)', value: 250 }, { id: 'kw', label: 'Sanctioned load (kW)', value: 2 }, { id: 'cat', label: 'Consumer type', type: 'select', value: 'np', full: true, options: [['np', 'Non-protected (used more than 200 units in any of the last 6 months)'], ['p', 'Protected (200 units or less in each of the last 6 months)'], ['l', 'Lifeline (up to 100 units, load under 1 kW)']] }, { id: 'fpa', label: 'Fuel adjustment this month (Rs per unit, + or −)', value: 0 }, { id: 'gst', label: 'Sales tax (%)', value: 18 }],
      compute: function (v) {
        var u = Math.max(0, v.u), energy = 0, fixedRate = 0, how = '', fcs = 0, warn = '';
        if (v.cat === 'l') {
          if (u > 100) warn = 'Lifeline only covers up to 100 units — this month will be billed as protected or non-protected.';
          energy = u * (u <= 50 ? 3.95 : 7.74); how = 'All ' + u + ' units at Rs ' + (u <= 50 ? '3.95' : '7.74');
        } else if (v.cat === 'p') {
          if (u > 200) warn = 'Above 200 units you lose protected status for the next 6 months — this bill is shown at protected rates only for comparison.';
          energy = Math.min(u, 100) * 10.54 + Math.max(0, Math.min(u, 200) - 100) * 13.01 + Math.max(0, u - 200) * 33.10;
          fixedRate = u <= 100 ? 200 : 300; fcs = u * 1.43; how = 'First 100 units at Rs 10.54, next at Rs 13.01';
        } else {
          var s = NP.find(function (x) { return u <= x[0]; }); energy = u * s[1]; fixedRate = s[2]; fcs = u * 3.23;
          how = 'All ' + u + ' units at Rs ' + s[1] + ' (non-protected bills the whole month at one slab rate)';
        }
        var fixed = fixedRate * Math.max(0, v.kw), fpa = u * v.fpa, base = energy + fixed + fcs + fpa, tax = base * v.gst / 100, total = base + tax;
        return { results: [['Estimated bill', rs(total), true], ['Energy charges', rs(energy)], ['Fixed charges', rs(fixed)], ['FC surcharge', rs(fcs)], ['Fuel adjustment', rs(fpa)], ['Sales tax', rs(tax)], ['Average per unit', u ? 'Rs ' + fmt(total / u, 2) : '—']],
          extra: (warn ? '<p class="warn">' + esc(warn) + '</p>' : '') + '<p class="note">' + esc(how) + '.</p>' + (v.cat === 'np' && u > 200 && u <= 210 ? '<p class="warn">Just over 200 units costs much more than 200. Keeping usage at 200 or below for 6 months makes you protected again.</p>' : '') };
      },
      note: 'Estimate based on the NEPRA residential tariff notified in February 2026 (S.R.O. 279(I)/2026). Your real bill can also include quarterly adjustments, income tax for non-filers on large bills, and arrears. Check the latest rates on your company\'s bill (LESCO, IESCO, MEPCO, FESCO, GEPCO, K-Electric…).'
    });
  };

  /* CGPA / GPA */
  T['cgpa-calculator'] = function (el) {
    var G = [['A', 4], ['A-', 3.67], ['B+', 3.33], ['B', 3], ['B-', 2.67], ['C+', 2.33], ['C', 2], ['C-', 1.67], ['D+', 1.33], ['D', 1], ['F', 0]];
    var d = store('cgpa') || { prev: '', prevCr: '', rows: [{ n: 'Course 1', g: 'A', c: 3 }, { n: 'Course 2', g: 'B+', c: 3 }, { n: 'Course 3', g: 'A-', c: 3 }, { n: 'Course 4', g: 'B', c: 2 }] };
    el.innerHTML = '<h3>This semester</h3><div class="items-ed" id="cr"></div><button type="button" class="btn line sm" id="cadd" style="align-self:flex-start">+ Add course</button>' +
      '<div class="fgrid"><label class="f">Previous CGPA (optional)<input id="pc" type="number" step="0.01" min="0" max="4" inputmode="decimal"></label><label class="f">Previous credit hours<input id="pcr" type="number" step="1" min="0" inputmode="numeric"></label></div>' +
      '<div class="result" aria-live="polite"></div><p class="note">Grade points follow the HEC 4.0 scale used by most Pakistani universities. Some universities use slightly different points or grade ranges — check your student handbook.</p>';
    function draw() { $('#cr', el).innerHTML = d.rows.map(function (r, i) { return '<div class="it" data-i="' + i + '"><input class="inp" data-k="n" value="' + esc(r.n) + '" aria-label="Course name"><select class="inp" data-k="g" aria-label="Grade">' + G.map(function (g) { return '<option value="' + g[0] + '"' + (g[0] === r.g ? ' selected' : '') + '>' + g[0] + ' (' + g[1].toFixed(2) + ')</option>'; }).join('') + '</select><input class="inp" data-k="c" type="number" min="0" step="0.5" inputmode="decimal" value="' + esc(r.c) + '" aria-label="Credit hours"><button type="button" class="x" data-del="' + i + '" aria-label="Remove course">×</button></div>'; }).join(''); }
    function read() { d.rows = $$('#cr .it', el).map(function (r) { return { n: $('[data-k=n]', r).value, g: $('[data-k=g]', r).value, c: $('[data-k=c]', r).value }; }); d.prev = $('#pc', el).value; d.prevCr = $('#pcr', el).value; store('cgpa', d); }
    function run() {
      read(); var pts = 0, cr = 0; d.rows.forEach(function (r) { var gp = G.find(function (g) { return g[0] === r.g; })[1], c = num(r.c); pts += gp * c; cr += c; });
      var gpa = cr ? pts / cr : 0, pc = num(d.prev), pcr = num(d.prevCr), cg = (cr + pcr) ? (pts + pc * pcr) / (cr + pcr) : 0;
      $('.result', el).innerHTML = '<div class="big"><span>Semester GPA</span><b>' + gpa.toFixed(2) + '</b></div><div><span>Credit hours</span><b>' + fmt(cr, 1) + '</b></div>' + (pcr ? '<div class="big"><span>New CGPA</span><b>' + cg.toFixed(2) + '</b></div><div><span>Total credit hours</span><b>' + fmt(cr + pcr, 1) + '</b></div>' : '');
    }
    el.addEventListener('input', run); el.addEventListener('change', run);
    el.addEventListener('click', function (e) { var x = e.target.closest('[data-del]'); if (x) { read(); d.rows.splice(+x.dataset.del, 1); if (!d.rows.length) d.rows.push({ n: '', g: 'A', c: 3 }); draw(); run(); } if (e.target.id === 'cadd') { read(); d.rows.push({ n: 'Course ' + (d.rows.length + 1), g: 'A', c: 3 }); draw(); run(); } });
    draw(); $('#pc', el).value = d.prev; $('#pcr', el).value = d.prevCr; run();
  };

  /* Property transfer tax — FBR 236K / 236C + provincial stamp duty, editable */
  T['property-tax-calculator'] = function (el) {
    calc(el, {
      fields: [{ id: 'val', label: 'Property value (Rs) — FBR / DC value, whichever is higher', value: 15000000, full: true }, { id: 'bs', label: 'Buyer is', type: 'select', value: 'f', options: [['f', 'Filer (on the Active Taxpayer List)'], ['n', 'Non-filer']] }, { id: 'ss', label: 'Seller is', type: 'select', value: 'f', options: [['f', 'Filer (on the Active Taxpayer List)'], ['n', 'Non-filer']] }, { id: 'stamp', label: 'Stamp duty (%) — Punjab 1%', value: 1 }, { id: 'other', label: 'Other fees: registration, TMA, society transfer (Rs)', value: 0 }],
      compute: function (v) {
        var buy = v.bs === 'f' ? 1.25 : v.val <= 50e6 ? 10.5 : v.val <= 100e6 ? 14.5 : 18.5, sell = v.ss === 'f' ? 2.75 : 11.5;
        var k = v.val * buy / 100, c = v.val * sell / 100, st = v.val * v.stamp / 100, buyerTotal = k + st + v.other;
        return { results: [['Buyer pays — 236K (' + buy + '%)', rs(k)], ['Stamp duty (' + fmt(v.stamp) + '%)', rs(st)], ['Buyer total', rs(buyerTotal), true], ['Seller pays — 236C (' + sell + '%)', rs(c), true], ['Total government charges', rs(buyerTotal + c)]],
          extra: (v.bs === 'n' || v.ss === 'n' ? '<p class="warn">Non-filers pay several times more. Becoming a filer before the transfer can save ' + rs((v.bs === 'n' ? v.val * (buy - 1.25) / 100 : 0) + (v.ss === 'n' ? v.val * (11.5 - 2.75) / 100 : 0)) + '.</p>' : '') };
      },
      note: 'FBR advance tax rates for tax year 2027 as reported after the Finance Act 2026 (236K buyer, 236C seller). Capital gains tax on the seller is separate. Stamp duty, registration and society fees differ by province and housing society — confirm with the registrar or your society office before paying.'
    });
  };

  /* Rent agreement generator */
  T['rent-agreement-generator'] = function (el) {
    var K = 'doc-rent', F = [['city', 'City', 'Lahore'], ['date', 'Agreement date', today(), 'date'], ['ll', 'Landlord name', ''], ['llid', 'Landlord CNIC', ''], ['llad', 'Landlord address', ''], ['tn', 'Tenant name', ''], ['tnid', 'Tenant CNIC', ''], ['tnad', 'Tenant permanent address', ''], ['prop', 'Property rented (full address)', ''], ['use', 'Use', 'residential', 'sel'], ['start', 'Start date', today(), 'date'], ['months', 'Term (months)', '11', 'number'], ['rent', 'Monthly rent (Rs)', '50000', 'number'], ['due', 'Rent due by (day of month)', '5', 'number'], ['dep', 'Security deposit (Rs)', '100000', 'number'], ['inc', 'Yearly rent increase (%)', '10', 'number'], ['notice', 'Notice period (months)', '1', 'number'], ['w1', 'Witness 1 (name, CNIC)', ''], ['w2', 'Witness 2 (name, CNIC)', '']];
    var d = store(K) || {};
    el.innerHTML = '<div class="fgrid no-print">' + F.map(function (f) { var v = d[f[0]] != null ? d[f[0]] : f[2]; if (f[3] === 'sel') return '<label class="f">' + f[1] + '<select name="' + f[0] + '"><option value="residential"' + (v === 'residential' ? ' selected' : '') + '>Residential (family living)</option><option value="commercial"' + (v === 'commercial' ? ' selected' : '') + '>Commercial (shop / office)</option></select></label>'; return '<label class="f' + (/ad$|prop/.test(f[0]) ? ' full' : '') + '">' + f[1] + '<input name="' + f[0] + '" type="' + (f[3] || 'text') + '" value="' + esc(v) + '"' + (f[3] === 'number' ? ' inputmode="numeric"' : '') + '></label>'; }).join('') + '</div>' +
      '<div class="row no-print"><button type="button" class="btn blue" id="print">Print / Save as PDF</button><span class="note">Print on stamp paper of the right value and sign in front of the witnesses. This is a general template, not legal advice.</span></div><div class="print-area"><div class="doc-preview" id="pv" style="line-height:1.75"></div></div>';
    function g(k) { return $('[name=' + k + ']', el).value; }
    function b(k, alt) { var v = g(k); return '<b>' + esc(v || alt || '__________') + '</b>'; }
    function dt(k) { var x = D(g(k)); return x ? x.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '__________'; }
    function render() {
      F.forEach(function (f) { d[f[0]] = g(f[0]); }); store(K, d);
      var st = D(g('start')), m = Math.max(1, Math.round(num(g('months')))), end = st ? new Date(st.getFullYear(), st.getMonth() + m, st.getDate() - 1) : null, rent = num(g('rent'));
      var cl = [
        'The Landlord hereby lets out to the Tenant the property situated at ' + b('prop') + ' (the “Premises”) for ' + (g('use') === 'commercial' ? 'commercial use as a shop / office' : 'residential use by the Tenant and family only') + '.',
        'The tenancy is for <b>' + m + ' months</b>, starting on <b>' + dt('start') + '</b> and ending on <b>' + (end ? end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '__________') + '</b>. It may be renewed by mutual written consent.',
        'The monthly rent is <b>Rs ' + fmt(rent, 0) + '</b> (' + esc(amountWords(rent, 'pk')) + '), payable in advance on or before the <b>' + esc(g('due') || '5') + '</b> day of each month.',
        'The Tenant has paid a refundable security deposit of <b>Rs ' + fmt(num(g('dep')), 0) + '</b> (' + esc(amountWords(num(g('dep')), 'pk')) + '). It will be returned when the Premises are vacated, after deducting any unpaid rent, utility bills or the cost of damage beyond normal wear and tear. No interest is payable on it.',
        'On renewal, the rent will increase by <b>' + esc(g('inc') || '0') + '%</b> unless agreed otherwise in writing.',
        'The Tenant will pay electricity, gas, water and other utility bills for the tenancy period, and will hand over paid bills on vacating.',
        'The Tenant will keep the Premises clean and in good condition, will not make structural changes, and will not sublet or transfer the Premises without the Landlord’s written permission.',
        'The Landlord is responsible for major structural repairs. Minor day-to-day repairs are the Tenant’s responsibility.',
        'The Tenant will not use the Premises for any illegal or immoral purpose, and will follow the rules of the society / building.',
        'The Landlord may inspect the Premises at a reasonable time after giving prior notice.',
        'Either party may end this agreement by giving <b>' + esc(g('notice') || '1') + ' month(s)</b> written notice. If the Tenant fails to pay rent for two consecutive months, the Landlord may end the tenancy and ask the Tenant to vacate.',
        'The Tenant will register this tenancy with the local police station as required by law, with the Landlord’s help.',
        'At the end of the tenancy, the Tenant will hand over vacant possession of the Premises with all keys and fittings as received.'
      ];
      $('#pv', el).innerHTML = '<h2 style="text-align:center;margin-bottom:6px">TENANCY (RENT) AGREEMENT</h2><p style="text-align:center" class="muted">Made at ' + b('city') + ' on ' + dt('date') + '</p>' +
        '<p><b>Between:</b> ' + b('ll', 'Landlord name') + ', CNIC ' + b('llid') + ', resident of ' + b('llad') + ' (the “Landlord”)</p><p><b>And:</b> ' + b('tn', 'Tenant name') + ', CNIC ' + b('tnid') + ', resident of ' + b('tnad') + ' (the “Tenant”)</p>' +
        '<p>The parties agree as follows:</p><ol style="padding-left:22px">' + cl.map(function (c) { return '<li style="margin-bottom:6px">' + c + '</li>'; }).join('') + '</ol>' +
        '<p style="margin-top:14px">In witness whereof the parties have signed this agreement on the date written above.</p>' +
        '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:30px;margin-top:40px"><div style="border-top:1px solid #152033;padding-top:6px">Landlord: ' + esc(g('ll')) + '</div><div style="border-top:1px solid #152033;padding-top:6px">Tenant: ' + esc(g('tn')) + '</div><div style="border-top:1px solid #152033;padding-top:6px;margin-top:20px">Witness 1: ' + esc(g('w1')) + '</div><div style="border-top:1px solid #152033;padding-top:6px;margin-top:20px">Witness 2: ' + esc(g('w2')) + '</div></div>';
    }
    el.addEventListener('input', render); el.addEventListener('change', render);
    $('#print', el).addEventListener('click', function () { window.print(); });
    render();
  };

  /* boot */
  $$('.tool-app[data-tool]').forEach(function (el) {
    var fn = T[el.dataset.tool];
    if (fn) { try { fn(el); } catch (e) { el.innerHTML = '<p class="err">This tool failed to start. Please refresh the page.</p>'; if (window.console) console.error(e); } }
  });
  window.S2CTools = T;
})();
