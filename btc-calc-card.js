/* btc-calc-card v0.4.6 – Bitcoin/sats calculator with spread for Home Assistant (EN/DE) */
const VERSION = '0.4.6';
const SATS = 1e8;
const DEMO = { EUR: 90000, USD: 100000 };
const SYM = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF', JPY: '¥' };

const TR = {
  en: {
    def_title: 'Bitcoin Calculator', demo: 'Demo values – choose entities in the editor', unavailable: 'unavailable',
    none: 'No active currency. Add a price entity in the editor and enable it.',
    hint_check: 'Enter both values: the amount you receive and the purchase amount.', hint_calc: 'Enter both values: the purchase amount and the premium (negative = discount).',
    offer: 'Calculate offer', check: 'Check spread', calc: 'Calculate sats', amount: 'Amount', buy: 'Purchase amount', prem: 'Premium / discount',
    offer_price: 'Offer price', market_price: 'Market price', prem_cur: (s) => `Premium in ${s}`, disc_cur: (s) => `Discount in ${s}`,
    receive: 'You receive', prem_sats: 'Premium in sats', disc_sats: 'Discount in sats', prem_pct: 'Premium in %', disc_pct: 'Discount in %', fair: 'Sats at market price',
    desc: 'Bitcoin/sats calculator with any number of currencies and an optional spread calculator',
    title: 'Title', show_spread: 'Show offer calculator (spread)', entity: 'Price entity (price for 1 BTC)', code: 'Code (e.g. EUR)', symbol: 'Symbol (e.g. €)', active: 'Active',
    currencies: 'Currencies', add: 'Add currency', cur_n: (n) => `Currency ${n}`, remove: 'Remove', move_up: 'Move up', move_down: 'Move down',
  },
  de: {
    def_title: 'Bitcoin Rechner', demo: 'Demowerte – Entitäten im Editor wählen', unavailable: 'nicht verfügbar',
    none: 'Keine aktive Währung. Im Editor eine Preis-Entität hinzufügen und aktivieren.',
    hint_check: 'Beide Beträge eingeben: Menge und Kaufbetrag.', hint_calc: 'Beide Werte eingeben: Kaufbetrag und Aufschlag (negativ = Nachlass).',
    offer: 'Angebot berechnen', check: 'Spread prüfen', calc: 'Sats berechnen', amount: 'Menge', buy: 'Kaufbetrag', prem: 'Aufschlag / Nachlass',
    offer_price: 'Angebotspreis', market_price: 'Marktpreis', prem_cur: (s) => `Aufschlag in ${s}`, disc_cur: (s) => `Abschlag in ${s}`,
    receive: 'Du erhältst', prem_sats: 'Aufschlag in Sats', disc_sats: 'Abschlag in Sats', prem_pct: 'Aufschlag in %', disc_pct: 'Abschlag in %', fair: 'Sats zum Marktpreis',
    desc: 'Bitcoin-/Sats-Rechner mit beliebig vielen Währungen und optionalem Spread-Rechner',
    title: 'Titel', show_spread: 'Angebot berechnen (Spread) anzeigen', entity: 'Preis-Entität (Preis für 1 BTC)', code: 'Kürzel (z. B. EUR)', symbol: 'Symbol (z. B. €)', active: 'Aktiv',
    currencies: 'Währungen', add: 'Währung hinzufügen', cur_n: (n) => `Währung ${n}`, remove: 'Entfernen', move_up: 'Nach oben', move_down: 'Nach unten',
  },
};
const langOf = (h) => (String(h?.language || h?.locale?.language || navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en');
const tr = (l, k, ...a) => {
  const v = (TR[l] || TR.en)[k] ?? TR.en[k] ?? k;
  return typeof v === 'function' ? v(...a) : v;
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v) => {
  const s = String(v ?? '').replace(/\s/g, '').replace(',', '.');
  return s === '' ? NaN : Number(s);
};

const LS = 'btc-calc-card:v1';
const STYLE = `:host{--btc:#f7931a;--hs:1.4rem;--ts:2rem}ha-card{container-type:inline-size;padding:16px;display:flex;flex-direction:column;gap:16px}.t{font-size:var(--ts);font-weight:700;display:flex;justify-content:space-between;align-items:baseline;gap:8px}.demo{font-size:.8rem;font-weight:400;color:var(--secondary-text-color)}.pl{font-size:1.25rem;font-weight:600;color:var(--secondary-text-color);margin-bottom:8px}.pr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.p{min-width:0;padding:10px 12px;border-radius:12px;background:var(--secondary-background-color);border-left:4px solid var(--btc)}.pc{font-size:clamp(1rem,5cqw,var(--hs));font-weight:700;line-height:1.15;white-space:nowrap}.pv{font-size:clamp(.95rem,4.6cqw,var(--hs));font-weight:500;line-height:1.15;margin-top:2px;white-space:nowrap;font-variant-numeric:tabular-nums}.ps{font-size:clamp(.72rem,3.2cqw,.9rem);white-space:nowrap;color:var(--secondary-text-color);margin-top:4px;font-variant-numeric:tabular-nums}.fs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr));gap:12px}.fs.one{grid-template-columns:minmax(0,1fr)}.f{min-width:0;display:flex;flex-direction:column;gap:6px;font-size:1.2rem;font-weight:500;color:var(--primary-text-color)}.b{min-width:0;display:flex;align-items:center;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);padding:0 12px;transition:border-color .15s}.b:focus-within{border-color:var(--btc)}.b input{flex:1;width:0;min-width:0;border:0;outline:0;background:transparent;color:var(--primary-text-color);font:inherit;font-size:1.15rem;font-weight:400;padding:11px 0;font-variant-numeric:tabular-nums}.b input:disabled{opacity:.5}.u,.b select,.cs{color:var(--secondary-text-color);font-size:1rem;font-weight:400}.u{margin-left:6px}.b select,.cs{border:0;background:transparent;font:inherit;font-size:1rem;outline:0;cursor:pointer;margin-left:6px}.cs{border:1px solid var(--divider-color);border-radius:8px;padding:4px 8px;margin:0}.n{font-size:1.1rem;font-weight:400;color:var(--secondary-text-color);min-height:1em;font-variant-numeric:tabular-nums}.sp{border-top:1px solid var(--divider-color);padding-top:14px;display:flex;flex-direction:column;gap:12px}.sh{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:1.15rem;font-weight:600}.seg{display:flex;border:1px solid var(--divider-color);border-radius:10px;overflow:hidden}.seg button{flex:1;padding:9px;border:0;background:transparent;color:var(--secondary-text-color);font:inherit;font-size:.95rem;cursor:pointer}.seg button.on{background:var(--btc);color:#000;font-weight:600}.rs{display:flex;flex-direction:column}.r{display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px dashed var(--divider-color);font-size:1.2rem}.r:last-child{border:0}.r.e{border-bottom:1px solid var(--divider-color);padding-bottom:10px;margin-bottom:4px}.r span{min-width:0;overflow-wrap:anywhere}.r b{flex:none;white-space:nowrap;font-weight:600;font-variant-numeric:tabular-nums;text-align:right}.r b small{display:block;font-size:1rem;font-weight:400;color:var(--secondary-text-color)}.pos{color:var(--error-color)}.neg{color:var(--success-color)}.hint{font-size:.95rem;color:var(--secondary-text-color)}`;

class BtcCalcCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = { src: null, val: '' };
    this._mu = 'sats';
    this._spread = { mode: 'check', cur: '', unit: 'sats', punit: '%', sats: '', amt: '', pct: '' };
    this._act = [];
    this._sig = null;
    this._l = 'en';
    this._grp = '.';
    this._dec = ',';
    this._load();
    const r = this.shadowRoot;
    r.addEventListener('input', (e) => this._onInput(e));
    r.addEventListener('change', (e) => this._onChange(e));
    r.addEventListener('click', (e) => this._onClick(e));
  }

  static getConfigElement() { return document.createElement('btc-calc-card-editor'); }

  static getStubConfig(hass) {
    const cur = [];
    const st = hass?.states || {};
    for (const id of Object.keys(st)) {
      if (cur.length >= 3) break;
      if (!id.startsWith('sensor.')) continue;
      const s = st[id], a = s.attributes || {};
      if (!/btc|bitcoin/i.test(id + ' ' + (a.friendly_name || ''))) continue;
      if (!isFinite(parseFloat(s.state))) continue;
      const u = String(a.unit_of_measurement || '').trim();
      const code = Object.keys(SYM).find((k) => k === u.toUpperCase() || SYM[k] === u);
      if (!code || cur.some((c) => c.code === code)) continue;
      cur.push({ entity: id, code, symbol: SYM[code], active: true });
    }
    return { title: tr(langOf(hass), 'def_title'), show_spread: false, currencies: cur };
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = { show_spread: false, ...config, currencies: (Array.isArray(config.currencies) ? config.currencies : []).map((c) => ({ ...c })) };
    this._sig = null;
    this._refresh();
  }

  set hass(h) {
    const o = this._hass;
    this._hass = h;
    if (o && this._config && o.language === h.language && o.locale?.language === h.locale?.language
      && this._config.currencies.every((c) => !c?.entity || o.states?.[c.entity] === h.states?.[c.entity])) return;
    this._refresh();
  }

  getCardSize() {
    const est = this._config?.show_spread ? 17 : 10;
    return Math.max(est, Math.ceil((this.offsetHeight || 0) / 50));
  }

  getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto' }; }

  _t(k, ...a) { return tr(this._l, k, ...a); }

  _load() {
    try {
      const d = JSON.parse(localStorage.getItem(LS) || 'null');
      if (!d || typeof d !== 'object') return;
      const str = (v) => (typeof v === 'string' ? v : '');
      if (d.state && typeof d.state === 'object') this._state = { src: typeof d.state.src === 'string' ? d.state.src : null, val: str(d.state.val) };
      if (d.mu === 'btc' || d.mu === 'sats') this._mu = d.mu;
      const sp = d.spread || {};
      this._spread = { mode: sp.mode === 'calc' ? 'calc' : 'check', cur: str(sp.cur), unit: sp.unit === 'btc' ? 'btc' : 'sats', punit: sp.punit === 'sats' || sp.punit === 'btc' ? sp.punit : '%', sats: str(sp.sats), amt: str(sp.amt), pct: str(sp.pct) };
      if (d.v !== 2) { this._state = { src: null, val: '' }; this._spread.amt = ''; }
    } catch (e) { /* ignore */ }
  }

  _save() {
    try { localStorage.setItem(LS, JSON.stringify({ v: 2, state: this._state, mu: this._mu, spread: this._spread })); } catch (e) { /* ignore */ }
  }

  /* ---------- Data ---------- */
  _buildAct() {
    const st = this._hass?.states || {};
    const all = this._config.currencies || [];
    const list = all.filter((c) => c && c.active !== false);
    const seen = {};
    const mk = (c, price, demo) => {
      const s = c.entity ? st[c.entity] : null;
      const code = String(c.code || s?.attributes?.unit_of_measurement || '').toUpperCase();
      let key = c.entity || code || 'x';
      seen[key] = (seen[key] || 0) + 1;
      if (seen[key] > 1) key += '#' + seen[key];
      return { key, entity: c.entity || '', code, sym: c.symbol || code || '¤', price, demo };
    };
    if (all.some((c) => c && c.entity)) {
      return list.filter((c) => c.entity).map((c) => {
        const s = st[c.entity];
        const v = s ? parseFloat(s.state) : NaN;
        return mk(c, isFinite(v) && v > 0 ? v : NaN, false);
      });
    }
    const base = list.length ? list : [{ code: 'EUR', symbol: '€' }, { code: 'USD', symbol: '$' }];
    return base.map((c) => mk(c, DEMO[String(c.code || '').toUpperCase()] ?? NaN, true));
  }

  _refresh() {
    if (!this._config) return;
    const h = this._hass;
    this._l = langOf(h);
    try {
      this._loc = h?.locale?.language || h?.language || navigator.language || 'de';
      const nf = new Intl.NumberFormat(this._loc);
      this._dec = nf.formatToParts(1.1).find((p) => p.type === 'decimal').value;
      this._grp = nf.formatToParts(1000000).find((p) => p.type === 'group')?.value || '.';
    } catch (e) { this._loc = 'de'; this._dec = ','; this._grp = '.'; }
    this._act = this._buildAct();
    const sig = JSON.stringify([this._config.title, this._config.show_spread, this._l, this._act.map((x) => [x.entity, x.code, x.sym, x.demo])]);
    if (sig !== this._sig) { this._sig = sig; this._render(); }
    this._update();
  }

  _fmt(n, d) {
    const k = this._loc + '|' + d, c = this._nfc || (this._nfc = {});
    return (c[k] || (c[k] = new Intl.NumberFormat(this._loc, { minimumFractionDigits: d, maximumFractionDigits: d }))).format(n);
  }
  _btc(x) { return x.toFixed(8).replace(/0+$/, '').replace(/\.$/, '').replace('.', this._dec); }
  _sg(n, d) { return (n > 0 ? '+' : n < 0 ? '−' : '') + this._fmt(Math.abs(n), d); }
  _gf(d) {
    const t = String(d ?? '');
    const out = t.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, this._grp || '.');
    return t.startsWith('-') ? '-' + out : out;
  }
  _group(inp, neg) {
    const raw = inp.value, pos = inp.selectionStart ?? raw.length;
    const before = raw.slice(0, pos).replace(/\D/g, '').length;
    const isNeg = neg && raw.trim().startsWith('-');
    const out = this._gf((isNeg ? '-' : '') + raw);
    inp.value = out;
    let np = isNeg && before === 0 ? 1 : 0, cnt = 0;
    if (before > 0) for (let i = 0; i < out.length; i++) { if (/\d/.test(out[i]) && ++cnt === before) { np = i + 1; break; } }
    try { inp.setSelectionRange(np, np); } catch (e) { /* ignore */ }
  }

  _canonF(raw) {
    const t = String(raw ?? ''), di = t.indexOf(this._dec);
    const ip = (di < 0 ? t : t.slice(0, di)).replace(/\D/g, '');
    const fp = di < 0 ? '' : t.slice(di + 1).replace(/\D/g, '');
    return (t.trim().startsWith('-') ? '-' : '') + ip + (di < 0 ? '' : '.' + fp);
  }
  _dispF(c) {
    const t = String(c ?? ''), di = t.indexOf('.');
    const ip = (di < 0 ? t : t.slice(0, di)).replace(/\D/g, '');
    const fp = di < 0 ? '' : t.slice(di + 1).replace(/\D/g, '');
    return (t.startsWith('-') ? '-' : '') + this._gf(ip) + (di < 0 ? '' : this._dec + fp);
  }
  _fixDec(e, inp) {
    if (e.inputType !== 'insertText' || (e.data !== '.' && e.data !== ',') || e.data === this._dec) return;
    const i = (inp.selectionStart || 0) - 1;
    if (i >= 0 && inp.value[i] === e.data) inp.value = inp.value.slice(0, i) + this._dec + inp.value.slice(i + 1);
  }
  _groupDec(inp) {
    const raw = inp.value, pos = inp.selectionStart ?? raw.length, di = raw.indexOf(this._dec);
    const sig = raw.slice(0, pos).replace(/\D/g, '').length + (di >= 0 && pos > di ? 1 : 0);
    const out = this._dispF(this._canonF(raw));
    inp.value = out;
    let np = out.startsWith('-') ? 1 : 0, cnt = 0;
    if (sig > 0) { np = 0; for (let i = 0; i < out.length; i++) { if (/\d/.test(out[i]) || out[i] === this._dec) { if (++cnt === sig) { np = i + 1; break; } } } }
    try { inp.setSelectionRange(np, np); } catch (e) { /* ignore */ }
  }

  /* ---------- Rendering ---------- */
  _render() {
    const c = this._config, act = this._act, mu = this._mu;
    const demo = act.some((x) => x.demo);
    const title = c.title ?? this._t('def_title');
    const head = title || demo ? `<div class="t"><span>${esc(title)}</span>${demo ? `<span class="demo">${esc(this._t('demo'))}</span>` : ''}</div>` : '';
    const body = act.length ? `
      <div><div class="pl">1 BTC =</div><div class="pr">${act.map((x, i) => `<div class="p"><div class="pc">${esc(x.code || x.sym)}</div><div class="pv" data-pv="${i}"></div><div class="ps" data-ps="${i}"></div></div>`).join('')}</div></div>
      <div class="fs one">
        <label class="f">Bitcoin<span class="b"><input data-k="sats" inputmode="${mu === 'btc' ? 'decimal' : 'numeric'}" autocomplete="off" placeholder="0"><select data-u="main"><option value="sats"${mu === 'sats' ? ' selected' : ''}>sats</option><option value="btc"${mu === 'btc' ? ' selected' : ''}>BTC</option></select></span><span class="n" data-btc></span></label>
      </div>
      <div class="fs">
        ${act.map((x) => `<label class="f">${esc(x.code || x.sym)}<span class="b"><input data-k="${esc(x.key)}" inputmode="decimal" autocomplete="off" placeholder="0"><span class="u">${esc(x.sym)}</span></span><span class="n"></span></label>`).join('')}
      </div>
      ${c.show_spread ? `<div class="sp">
        <div class="sh"><span>${esc(this._t('offer'))}</span><select class="cs" data-s="cur">${act.map((x) => `<option value="${esc(x.key)}">${esc(x.code || x.sym)}</option>`).join('')}</select></div>
        <div class="seg"><button type="button" data-m="check">${esc(this._t('check'))}</button><button type="button" data-m="calc">${esc(this._t('calc'))}</button></div>
        <div class="fs sf"></div><div class="hint sn"></div><div class="rs"></div></div>` : ''}`
      : `<div class="hint">${esc(this._t('none'))}</div>`;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card>${head}${body}</ha-card>`;
    this._renderSpreadFields();
  }

  _field(label, key, val, suffix, mode = 'decimal') {
    return `<label class="f">${label}<span class="b"><input data-s="${key}" ${mode ? `inputmode="${mode}"` : ''} autocomplete="off" placeholder="0" value="${esc(val)}">${suffix}</span></label>`;
  }

  _cur() {
    return this._act.find((x) => x.key === this._spread.cur) || this._act[0];
  }

  _renderSpreadFields() {
    const r = this.shadowRoot, sf = r.querySelector('.sf');
    if (!sf) return;
    const s = this._spread, c = this._cur();
    const sym = `<span class="u">${esc(c?.sym)}</span>`;
    if (s.mode === 'check') {
      const unit = `<select data-s="unit"><option value="sats"${s.unit === 'sats' ? ' selected' : ''}>sats</option><option value="btc"${s.unit === 'btc' ? ' selected' : ''}>BTC</option></select>`;
      sf.innerHTML = this._field(esc(this._t('amount')), 'sats', s.unit === 'sats' ? this._gf(s.sats) : s.sats, unit, s.unit === 'sats' ? 'numeric' : 'decimal') + this._field(esc(this._t('buy')), 'amt', this._dispF(s.amt), sym);
    } else {
      const pu = `<select data-s="punit"><option value="%"${s.punit === '%' ? ' selected' : ''}>%</option><option value="sats"${s.punit === 'sats' ? ' selected' : ''}>sats</option><option value="btc"${s.punit === 'btc' ? ' selected' : ''}>BTC</option></select>`;
      sf.innerHTML = this._field(esc(this._t('buy')), 'amt', this._dispF(s.amt), sym) + this._field(esc(this._t('prem')), 'pct', s.punit === 'sats' ? this._gf(s.pct) : s.pct, pu, '');
    }
    r.querySelectorAll('.seg button').forEach((b) => b.classList.toggle('on', b.dataset.m === s.mode));
    const sn = r.querySelector('.sn');
    if (sn) sn.textContent = this._t(s.mode === 'check' ? 'hint_check' : 'hint_calc');
    const sel = r.querySelector('select[data-s="cur"]');
    if (sel) sel.value = c?.key ?? '';
  }

  _update() {
    const r = this.shadowRoot;
    this._act.forEach((x, i) => {
      const pv = r.querySelector(`[data-pv="${i}"]`), ps = r.querySelector(`[data-ps="${i}"]`);
      if (!pv) return;
      const ok = isFinite(x.price);
      pv.textContent = ok ? `${this._fmt(x.price, 2)} ${x.sym}` : this._t('unavailable');
      ps.textContent = ok ? `1 ${x.sym} ≈ ${this._fmt(SATS / x.price, 0)} sats` : '';
    });
    this._calcMain();
    this._calcSpread();
  }

  /* ---------- Calculator ---------- */
  _calcMain() {
    const r = this.shadowRoot, act = this._act, mu = this._mu;
    const inputs = r.querySelectorAll('input[data-k]');
    if (!inputs.length) return;
    const find = (k) => act.find((x) => x.key === k);
    if (this._state.src !== null && this._state.src !== 'sats' && !find(this._state.src)) { this._state = { src: null, val: '' }; this._save(); }
    const { src, val } = this._state;
    const v = num(val);
    let sats = NaN;
    if (src !== null && isFinite(v)) {
      if (src === 'sats') sats = mu === 'btc' ? v * SATS : v;
      else { const c = find(src); if (c && isFinite(c.price)) sats = (v / c.price) * SATS; }
    }
    inputs.forEach((inp) => {
      const k = inp.dataset.k, c = k === 'sats' ? null : find(k);
      if (k === 'sats') inp.setAttribute('inputmode', mu === 'btc' ? 'decimal' : 'numeric');
      else inp.disabled = !c || !isFinite(c.price);
      if (k === src) { const d = k === 'sats' ? (mu === 'sats' ? this._gf(val) : val) : this._dispF(val); if (inp.value !== d) inp.value = d; return; }
      if (!isFinite(sats)) { inp.value = ''; return; }
      if (k === 'sats') inp.value = mu === 'btc' ? this._btc(sats / SATS) : this._gf(String(Math.round(sats)));
      else inp.value = c && isFinite(c.price) ? this._dispF(((sats / SATS) * c.price).toFixed(2)) : '';
    });
    const n = r.querySelector('[data-btc]');
    if (n) n.textContent = isFinite(sats) ? (mu === 'btc' ? `= ${this._fmt(Math.round(sats), 0)} sats` : `= ${this._fmt(sats / SATS, 8)} BTC`) : '';
  }

  _calcSpread() {
    const rs = this.shadowRoot.querySelector('.rs');
    if (!rs) return;
    const s = this._spread, c = this._cur(), t = (k, ...a) => this._t(k, ...a);
    const row = (l, v, cls = '', x = '', sub = '') => `<div class="r${x}"><span>${l}</span><b class="${cls}">${v}${sub ? `<small>${sub}</small>` : ''}</b></div>`;
    rs.innerHTML = '';
    if (!c || !isFinite(c.price)) return;
    const price = c.price, sym = esc(c.sym), amt = num(s.amt);
    const fair = (amt / price) * SATS;
    let got, offer;
    if (s.mode === 'check') {
      got = num(s.sats);
      if (s.unit === 'btc') got *= SATS;
      if (!(got > 0 && amt > 0)) return;
      offer = amt / (got / SATS);
    } else {
      const p = num(s.pct);
      if (!(amt > 0) || !isFinite(p)) return;
      if (s.punit !== '%') { got = fair - (s.punit === 'btc' ? p * SATS : p); if (!(got > 0)) return; offer = amt / (got / SATS); }
      else { if (p <= -100) return; offer = price * (1 + p / 100); got = (amt / offer) * SATS; }
    }
    const prem = (offer / price - 1) * 100, dS = fair - got, dC = amt - (got / SATS) * price;
    const d = prem < 0, cls = prem > 0 ? 'pos' : prem < 0 ? 'neg' : '';
    rs.innerHTML = row(t(d ? 'disc_pct' : 'prem_pct'), `${this._sg(prem, 2)} %`, cls)
      + row(t(d ? 'disc_cur' : 'prem_cur', sym), `${this._sg(dC, 2)} ${sym}`, cls)
      + row(t(d ? 'disc_sats' : 'prem_sats'), `${this._sg(dS, 0)} sats`, cls, ' e')
      + row(t('receive'), `${this._fmt(got, 0)} sats`, '', '', `${this._fmt(got / SATS, 8)} BTC`)
      + row(t('fair'), `${this._fmt(fair, 0)} sats`)
      + row(t('offer_price'), `${this._fmt(offer, 2)} ${sym} / BTC`)
      + row(t('market_price'), `${this._fmt(price, 2)} ${sym} / BTC`);
  }

  /* ---------- Events ---------- */
  _onInput(e) {
    const t = e.target;
    if (t.tagName !== 'INPUT') return;
    if (t.dataset.k !== undefined) {
      const k = t.dataset.k;
      let val;
      if (k === 'sats') { const g = this._mu === 'sats'; if (g) this._group(t, false); val = g ? t.value.replace(/\D/g, '') : t.value; }
      else { this._fixDec(e, t); this._groupDec(t); val = this._canonF(t.value); }
      this._state = { src: k, val };
      this._calcMain();
      this._save();
    } else if (t.dataset.s) {
      const k = t.dataset.s, sp = this._spread;
      const g = (k === 'sats' && sp.unit === 'sats') || (k === 'pct' && sp.punit === 'sats');
      if (g) this._group(t, k === 'pct');
      else if (k === 'amt') { this._fixDec(e, t); this._groupDec(t); }
      sp[k] = g ? t.value.replace(/[^\d-]/g, '') : k === 'amt' ? this._canonF(t.value) : t.value;
      this._calcSpread();
      this._save();
    }
  }

  _onChange(e) {
    const t = e.target;
    if (t.tagName !== 'SELECT') return;
    if (t.dataset.u === 'main') {
      const prev = this._mu, next = t.value;
      if (this._state.src === 'sats') {
        const v = num(this._state.val);
        if (isFinite(v)) {
          const sats = prev === 'btc' ? v * SATS : v;
          this._state.val = next === 'btc' ? this._btc(sats / SATS) : String(Math.round(sats));
        }
      }
      this._mu = next;
      this._calcMain();
      this._save();
    } else if (t.dataset.s === 'unit') { this._spread.unit = t.value; this._spread.sats = ''; this._renderSpreadFields(); this._calcSpread(); this._save(); }
    else if (t.dataset.s === 'punit') { this._spread.punit = t.value; this._spread.pct = ''; this._renderSpreadFields(); this._calcSpread(); this._save(); }
    else if (t.dataset.s === 'cur') { this._spread.cur = t.value; this._renderSpreadFields(); this._calcSpread(); this._save(); }
  }

  _onClick(e) {
    const b = e.target.closest('button[data-m]');
    if (!b) return;
    this._spread.mode = b.dataset.m;
    this._renderSpreadFields();
    this._calcSpread();
    this._save();
  }
}

/* ---------- Editor ---------- */
const ROW_SCHEMA = [
  { name: 'entity', selector: { entity: { domain: ['sensor', 'input_number', 'number'] } } },
  { type: 'grid', name: '', schema: [{ name: 'code', selector: { text: {} } }, { name: 'symbol', selector: { text: {} } }] },
  { name: 'active', selector: { boolean: {} } },
];
const EDITOR_STYLE = `.ed .h{font-weight:600;margin:16px 0 8px}.ed .row{border:1px solid var(--divider-color);border-radius:10px;padding:8px 12px;margin-bottom:12px}.ed .rh{display:flex;justify-content:space-between;align-items:center;font-size:.9rem;color:var(--secondary-text-color)}.ed button{cursor:pointer;font:inherit;color:var(--primary-text-color);background:transparent;border:1px solid var(--divider-color);border-radius:8px;padding:6px 12px}.ed .acts{display:flex;gap:2px}.ed button.del,.ed button.up,.ed button.dn{border:0;padding:4px;--mdc-icon-size:20px}.ed button:disabled{opacity:.3;cursor:default}`;

class BtcCalcCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config, currencies: (Array.isArray(config.currencies) ? config.currencies : []).map((c) => ({ ...c })) };
    if (!this._built) this._build();
    this._sync();
  }

  set hass(h) {
    this._hass = h;
    const l = langOf(h);
    if (this._built && l !== this._lg) { this._lg = l; this._texts(); }
    this.querySelectorAll('ha-form').forEach((f) => { f.hass = h; });
  }

  _lang() { return this._lg || (this._lg = langOf(this._hass)); }
  _lbl() { const l = this._lang(); return (s) => tr(l, s.name); }

  _texts() {
    const l = this._lang();
    this.querySelector('.h').textContent = tr(l, 'currencies');
    this.querySelector('.add').textContent = tr(l, 'add');
    this.querySelector('[data-main]').computeLabel = this._lbl();
    this.querySelectorAll('.rows .row').forEach((row, i) => {
      row.querySelector('[data-rn]').textContent = tr(l, 'cur_n', i + 1);
      row.querySelector('.del').title = tr(l, 'remove');
      row.querySelector('.up').title = tr(l, 'move_up');
      row.querySelector('.dn').title = tr(l, 'move_down');
      row.querySelector('ha-form').computeLabel = this._lbl();
    });
  }

  _fire() {
    const config = { ...this._config, currencies: this._config.currencies.map((c) => ({ ...c })) };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
  }

  _build() {
    this._built = true;
    this.innerHTML = `<style>${EDITOR_STYLE}</style><div class="ed"><ha-form data-main></ha-form><div class="h"></div><div class="rows"></div><button class="add" type="button"></button></div>`;
    const main = this.querySelector('[data-main]');
    main.hass = this._hass;
    main.schema = [{ name: 'title', selector: { text: {} } }, { name: 'show_spread', selector: { boolean: {} } }];
    main.addEventListener('value-changed', (ev) => { ev.stopPropagation(); this._config = { ...this._config, ...ev.detail.value }; this._fire(); });
    this.querySelector('.add').addEventListener('click', () => {
      this._config.currencies.push({ entity: '', code: '', symbol: '', active: true });
      this._buildRows();
      this._fire();
    });
    this._texts();
  }

  _rowData(c) { return { entity: c.entity || '', code: c.code || '', symbol: c.symbol || '', active: c.active !== false }; }

  _sync() {
    this.querySelector('[data-main]').data = { title: this._config.title ?? '', show_spread: !!this._config.show_spread };
    const forms = this.querySelectorAll('.rows ha-form');
    if (forms.length !== this._config.currencies.length) this._buildRows();
    else forms.forEach((f, i) => { f.data = this._rowData(this._config.currencies[i]); });
  }

  _buildRows() {
    const box = this.querySelector('.rows');
    box.innerHTML = '';
    this._config.currencies.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `<div class="rh"><span data-rn></span><span class="acts"><button type="button" class="up"><ha-icon icon="mdi:arrow-up"></ha-icon></button><button type="button" class="dn"><ha-icon icon="mdi:arrow-down"></ha-icon></button><button type="button" class="del"><ha-icon icon="mdi:delete"></ha-icon></button></span></div>`;
      const f = document.createElement('ha-form');
      f.hass = this._hass;
      f.schema = ROW_SCHEMA;
      f.data = this._rowData(c);
      f.addEventListener('value-changed', (ev) => {
        ev.stopPropagation();
        this._config.currencies[i] = { ...this._config.currencies[i], ...ev.detail.value };
        this._fire();
      });
      row.querySelector('.del').addEventListener('click', () => {
        this._config.currencies.splice(i, 1);
        this._buildRows();
        this._fire();
      });
      const move = (d) => {
        const a = this._config.currencies, j = i + d;
        if (j < 0 || j >= a.length) return;
        [a[i], a[j]] = [a[j], a[i]];
        this._buildRows();
        this._fire();
      };
      row.querySelector('.up').disabled = i === 0;
      row.querySelector('.dn').disabled = i === this._config.currencies.length - 1;
      row.querySelector('.up').addEventListener('click', () => move(-1));
      row.querySelector('.dn').addEventListener('click', () => move(1));
      row.appendChild(f);
      box.appendChild(row);
    });
    this._texts();
  }
}

if (!customElements.get('btc-calc-card')) customElements.define('btc-calc-card', BtcCalcCard);
if (!customElements.get('btc-calc-card-editor')) customElements.define('btc-calc-card-editor', BtcCalcCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'btc-calc-card')) window.customCards.push({
  type: 'btc-calc-card',
  name: 'BTC Calc Card',
  preview: true,
  get description() { return tr(langOf(document.querySelector('home-assistant')?.hass), 'desc'); },
});
console.info(`%c BTC-CALC-CARD %c v${VERSION} `, 'background:#f7931a;color:#000;font-weight:700', 'background:#333;color:#fff');
