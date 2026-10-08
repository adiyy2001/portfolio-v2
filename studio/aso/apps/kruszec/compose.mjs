import { card, esc, glue, phone, statusBar, styleOf } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { budgetList, budgetSafe, colors as c, decimal, gaugeSvg, head as screenHead, icons, money, renderScreen, renderTablet, ringSvg, screenOrder, t, TABLET } from './screens.mjs';
import { seriesFor, shape } from './series.mjs';

const css = `
.kh{font-family:'Instrument Serif',serif;font-weight:400;line-height:1.02;letter-spacing:-.008em;color:${c.platyna}}
.kh em{font-style:italic;color:${c.szalwia}}
.k-ground{position:absolute;left:0;top:0;overflow:hidden}
.k-layer{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.k-phone{box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 0 0 1px rgba(0,0,0,.6),0 40px 80px -30px rgba(0,0,0,.85),0 0 60px -10px rgba(143,212,182,.08)}
.k-phone .kit-phone__glass{background:${c.glebia}}
.k-phone .kit-phone__btn{background:#2A303A}
.k-cardscr{background:${c.glebia};box-shadow:0 0 0 1px rgba(255,255,255,.16),0 34px 70px -30px rgba(0,0,0,.9)}
.k-tab-dev{position:absolute;background:#1B1F27;box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 0 0 1px rgba(0,0,0,.6),0 60px 120px -40px rgba(0,0,0,.9)}
.k-tab-dev__glass{position:absolute;overflow:hidden;background:${c.glebia}}
.k-tab-dev__cam{position:absolute;width:10px;height:10px;border-radius:50%;background:#0B0D11;box-shadow:0 0 0 1px rgba(255,255,255,.06)}
.kg{position:absolute;background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.05) 55%,rgba(255,255,255,.07));border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 40px 70px -30px rgba(0,0,0,.75);-webkit-backdrop-filter:blur(18px) saturate(118%);backdrop-filter:blur(18px) saturate(118%);color:${c.tekst};font-family:'Manrope',sans-serif;font-variant-numeric:tabular-nums lining-nums}
.kg__k{font-weight:600;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${c.tekst2}}
.kg__num{font-family:'Instrument Serif',serif;font-weight:400;line-height:1;letter-spacing:-.01em;color:${c.platyna};white-space:nowrap}
.kg__sub{color:${c.tekst2};line-height:1.35}
.k-pill{position:absolute;display:flex;align-items:center;gap:8px;padding:0 14px;border-radius:999px;white-space:nowrap;font-weight:600}
.k-pill i{display:block;flex:none;border-radius:50%}
.k-tag2{position:absolute;white-space:nowrap;line-height:1.3}
.k-tag2__name{display:flex;align-items:center;gap:.5em;font-weight:600}
.k-tag2 i{display:block;flex:none;border-radius:50%}
.k-tag2__num{margin-top:.2em;padding-left:1.1em;display:flex;gap:.35em;align-items:baseline}
.k-tag2__num b{font-weight:700;color:${c.tekst}}
.k-tag2__num span{font-weight:500;color:${c.tekst2}}
.k-soft{filter:blur(var(--blur,2px)) brightness(.82) saturate(.9)}
.k-mark{position:absolute;font-family:'Manrope',sans-serif;font-weight:600;color:${c.tekst2};white-space:nowrap}
`;

const W = { appstore: 440, play: 360, ipad: 1032 };
const H = { appstore: 956, play: 640, ipad: 1376 };

const accented = (value, accent, lang) => {
  const body = esc(glue(value, lang));
  if (!accent) return body;
  const a = esc(glue(accent, lang));
  const at = body.indexOf(a);
  return at < 0 ? body : `${body.slice(0, at)}<em>${a}</em>${body.slice(at + a.length)}`;
};

const headline = ({ slot, lang, x, y, w, size, align = 'left', name }) =>
  `<div class="kit-headline kh" data-box="headline" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width: w, 'font-size': size, 'text-align': align })}">${accented(slot.headline, slot.accent, lang)}</div>`;

const ground = (w, h, glows = []) => {
  const layers = [...glows.map(g => `radial-gradient(${g.rx ?? g.r}px ${g.ry ?? g.r}px at ${g.x}px ${g.y}px, ${g.color} 0, transparent 100%)`), `radial-gradient(${w * 1.1}px ${h * 0.7}px at ${w * 0.5}px ${h * 0.08}px, #121C33 0, rgba(18,28,51,0) 100%)`, `linear-gradient(180deg, #0C1324 0%, ${c.glebia} 60%, #080D1A 100%)`];
  return `<div class="k-ground" style="${styleOf({ width: w, height: h, background: layers.join(',') })}"></div>`;
};

const sage = a => `rgba(143,212,182,${a})`;
const ice = a => `rgba(184,203,230,${a})`;

const layer = (w, h, inner, id = '') => `<svg class="k-layer"${id ? ` id="${id}"` : ''} width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${inner}</svg>`;

const tabletGeometry = width => {
  const bezel = width * 0.032;
  const inner = width - bezel * 2;
  const scale = inner / TABLET.width;
  const innerHeight = TABLET.height * scale;
  return { bezel, scale, width, height: innerHeight + bezel * 2, inner, innerHeight };
};

const tablet = ({ screen, width, x, y, name, rotate = 0, className = '', style = {} }) => {
  const g = tabletGeometry(width);
  const radius = width * 0.05;
  return `<div class="k-tab-dev ${className}" data-box="device" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width, height: g.height, 'border-radius': radius, transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style })}"><div class="k-tab-dev__glass" style="${styleOf({ left: g.bezel, top: g.bezel, width: g.inner, height: g.innerHeight, 'border-radius': radius - g.bezel * 0.6 })}"><div style="${styleOf({ position: 'absolute', left: 0, top: 0, width: TABLET.width, height: TABLET.height, transform: `scale(${g.scale})`, 'transform-origin': '0 0' })}">${screen}</div></div><span class="k-tab-dev__cam" style="${styleOf({ left: g.width / 2 - 5, top: g.bezel / 2 - 5 })}"></span></div>`;
};

const device = (store, { ui, lang, screenId, width, x, y, rotate = 0, name, soft, extraClass = '' }) => {
  const style = soft ? `--blur:${soft}px` : '';
  const cls = `${soft ? 'k-soft ' : ''}${extraClass}`;
  if (store === 'ipad') {
    return tablet({ screen: renderTablet(screenId, ui, { lang }), width, x, y, rotate, name, className: cls, style: soft ? { '--blur': `${soft}px` } : {} });
  }
  const screen = renderScreen(screenId, ui, { lang, store });
  const html =
    store === 'appstore'
      ? phone({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: `k-phone ${cls}`, body: '#1B1F27', statusColor: c.tekst })
      : card({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: `k-cardscr ${cls}`, statusColor: c.tekst, radius: 16 });
  return style ? html.replace('style="', `style="${style};`) : html;
};

const glassCard = ({ x, y, w, h, r = 24, inner, name, style = {} }) =>
  `<div class="kg" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width: w, height: h, 'border-radius': r, ...style })}">${inner}</div>`;

const outerScript = cfg => `<script>(${outerLine.toString()})(${JSON.stringify(cfg)});</script>`;

function outerLine(cfg) {
  window.wzReady = (async () => {
    await document.fonts.ready;
    const a = document.querySelector('[data-chart="a"]');
    const b = document.querySelector('[data-chart="b"]');
    if (!a || !b) throw new Error('chart markers missing');
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    const ax = ra.left + ra.width / 2;
    const ay = ra.top + ra.height / 2;
    const bx = rb.left + rb.width / 2;
    const by = rb.top + rb.height / 2;
    const ia = Number(a.getAttribute('data-i'));
    const ib = Number(b.getAttribute('data-i'));
    const va = Number(a.getAttribute('data-v'));
    const vb = Number(b.getAttribute('data-v'));
    const X = i => ax + ((i - ia) * (bx - ax)) / (ib - ia);
    const Y = v => ay + ((v - va) * (by - ay)) / (vb - va);
    const pts = cfg.values.slice(0, ia + 1).map((v, i) => [X(i), Y(v)]);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const svg = document.getElementById('outer');
    const NS = 'http://www.w3.org/2000/svg';
    const x0 = pts[0][0];
    const x1 = pts[pts.length - 1][0];
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `<linearGradient id="og" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset="0" stop-color="${cfg.color}" stop-opacity="0"/><stop offset=".35" stop-color="${cfg.color}" stop-opacity=".75"/><stop offset="1" stop-color="${cfg.color}" stop-opacity="1"/></linearGradient><filter id="ob" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="${cfg.blur}"/></filter>`;
    svg.appendChild(defs);
    const glow = document.createElementNS(NS, 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('fill', 'none');
    glow.setAttribute('stroke', 'url(#og)');
    glow.setAttribute('stroke-width', String(cfg.width * 3));
    glow.setAttribute('stroke-opacity', '.5');
    glow.setAttribute('filter', 'url(#ob)');
    svg.appendChild(glow);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#og)');
    path.setAttribute('stroke-width', String(cfg.width));
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    const label = document.getElementById('outer-label');
    if (label) {
      let k = 0;
      while (k < ia && X(k) - label.offsetWidth / 2 < cfg.labelGap) k += 1;
      label.style.left = `${X(k) - label.offsetWidth / 2}px`;
      label.style.top = `${Y(cfg.values[k]) - cfg.labelGap - label.offsetHeight}px`;
    }
    if (x0 > cfg.maxStart) console.error(`outer line starts at ${x0.toFixed(1)}, expected at most ${cfg.maxStart}`);
  })();
}

const outerParts = (store, ui, lang, { width, blur, labelGap, maxStart, size }) => {
  const values = seriesFor(ui.majatek.total);
  const notes = { pl: 'od 2021', en: 'since 2021' };
  return {
    layer: layer(W[store], H[store], '', 'outer'),
    label: `<div id="outer-label" class="k-mark" style="${styleOf({ left: 0, top: 0, 'font-size': size })}">${esc(notes[lang])}</div>`,
    script: outerScript({ values, width, blur, color: c.szalwia, labelGap, maxStart }),
  };
};

const worthChip = (notes, ui, lang, { x, r, y, size }) =>
  `<div class="kg" data-box="fg" data-name="worth" style="${styleOf({ left: x, right: r, top: y, padding: `${size * 0.7}px ${size * 0.9}px`, 'border-radius': size * 0.8 })}"><div class="kg__k" style="${styleOf({ 'font-size': size * 0.55 })}">${t(notes.chartLabel, lang)}</div><div class="kg__num" style="${styleOf({ 'font-size': size * 2.2, 'margin-top': size * 0.3 })}">${money(ui.majatek.total, lang)}</div><div class="kg__sub" style="${styleOf({ 'font-size': size * 0.6, 'margin-top': size * 0.3 })}">${t(notes.sample, lang)}</div></div>`;

const safeCard = (notes, ui, lang, { x, y, w, h, size, name }) =>
  glassCard({
    x,
    y,
    w,
    h,
    name,
    r: size * 0.42,
    inner: `<div style="${styleOf({ padding: `${size * 0.36}px ${size * 0.4}px` })}"><div class="kg__k" style="${styleOf({ 'font-size': size * 0.2 })}">${t(notes.safeCard, lang)}</div><div class="kg__num" style="${styleOf({ 'font-size': size, 'margin-top': size * 0.16 })}">${money(ui.budzet.safe, lang)}</div><div class="kg__sub" style="${styleOf({ 'font-size': size * 0.22, 'margin-top': size * 0.18 })}">${t(notes.safeSub, lang)}</div></div>`,
  });

const gaugeCard = (notes, ui, lang, { x, y, w, h, size, name }) => {
  const p = ui.poduszka;
  const g = size;
  return glassCard({
    x,
    y,
    w,
    h,
    name,
    r: g * 0.12,
    inner: `<div style="${styleOf({ padding: `${g * 0.09}px ${g * 0.1}px 0` })}"><div class="kg__k" style="${styleOf({ 'font-size': g * 0.052 })}">${t(notes.gaugeTitle, lang)}</div></div><div style="${styleOf({ position: 'relative', width: g, height: g * 0.8, margin: `${g * 0.03}px auto 0` })}">${gaugeSvg({ months: p.months, target: p.target, size: g, stroke: g * 0.055, id: `gc${Math.round(g)}` })}<div style="${styleOf({ position: 'absolute', left: 0, right: 0, top: g * 0.27, 'text-align': 'center' })}"><div class="kg__num" style="${styleOf({ 'font-size': g * 0.3 })}">${decimal(p.months, lang)}</div><div class="kg__sub" style="${styleOf({ 'font-size': g * 0.06, 'margin-top': g * 0.02 })}">${t(notes.gaugeUnit, lang)}</div><div style="${styleOf({ 'font-size': g * 0.054, 'margin-top': g * 0.035, color: c.tekst, 'font-weight': '600' })}">${t(notes.gaugeOf, lang)}</div></div></div>`,
  });
};

const ringBack = (ui, { cx, cy, r, stroke }) => {
  const size = 2 * r + stroke;
  return `<div style="${styleOf({ position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, filter: `drop-shadow(0 0 ${stroke * 0.8}px rgba(143,212,182,.18))` })}">${ringSvg({ items: ui.alokacja.items, size, stroke, id: 'big', gap: 0.02 })}</div>`;
};

const ringPills = (ui, lang, { size, at }) =>
  ui.alokacja.items
    .map((item, i) => {
      const [x, y, side] = at[i];
      const tone = { szalwia: c.szalwia, lod: c.lod, platyna: c.platyna }[item.tone];
      return `<div class="kg k-tag2" data-box="fg" data-name="pill-${i}" style="${styleOf({ [side === 'r' ? 'right' : 'left']: x, top: y, 'font-size': size, padding: `${size * 0.62}px ${size * 0.95}px`, 'border-radius': size * 1.1 })}"><div class="k-tag2__name"><i style="${styleOf({ width: size * 0.6, height: size * 0.6, background: tone })}"></i>${t(item.name, lang)}</div><div class="k-tag2__num"><b>${item.share}%</b><span>/ ${item.target}%</span></div></div>`;
    })
    .join('');

const timeline = (ui, lang, notes, { x0, x1, y, h, dot, size, todayX }) => {
  const g = ui.cel;
  const past = g.deposits;
  const futureCount = Math.round((g.target - g.saved) / g.monthly);
  const pastStep = (todayX - x0) / (past.length + 0.5);
  const futureStep = (x1 - todayX) / (futureCount + 0.5);
  const band = `<div class="kg" style="${styleOf({ left: x0 - 60, top: y - h / 2, width: x1 - x0 + 120, height: h, 'border-radius': h / 2, 'box-shadow': 'inset 0 1px 0 rgba(255,255,255,.12)' })}"></div>`;
  const dots = [];
  past.forEach((d, i) => {
    const x = x0 + pastStep * (i + 0.5);
    const r = dot * (0.8 + (0.35 * d.v) / Math.max(...past.map(item => item.v)));
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y}" r="${(r + dot * 0.7).toFixed(1)}" fill="${sage(0.16)}"/><circle cx="${x.toFixed(1)}" cy="${y}" r="${r.toFixed(1)}" fill="${c.szalwia}"/><text x="${x.toFixed(1)}" y="${(y + h / 2 + size * 1.5).toFixed(1)}" text-anchor="middle" font-family="Manrope" font-size="${size}" font-weight="500" fill="${c.tekst2}">${esc(d.m)}</text>`);
  });
  for (let i = 0; i < futureCount; i += 1) {
    const x = todayX + futureStep * (i + 0.5);
    dots.push(`<circle cx="${x.toFixed(1)}" cy="${y}" r="${(dot * 0.6).toFixed(1)}" fill="none" stroke="${ice(0.55)}" stroke-width="${(dot * 0.2).toFixed(2)}"/>`);
  }
  dots.push(`<line x1="${todayX.toFixed(1)}" x2="${todayX.toFixed(1)}" y1="${y - h / 2 + 6}" y2="${y + h / 2 - 6}" stroke="${c.platyna}" stroke-width="1.2" stroke-dasharray="2 3"/>`);
  const title = `<div class="k-mark" data-box="fg" data-name="timeline-title" style="${styleOf({ left: Math.max(x0, 0) + size, top: y - h / 2 - size * 2.6, 'font-size': size * 1.05, color: c.tekst })}">${t(notes.timelineTitle, lang)}</div>`;
  return { band, dots: dots.join(''), title, endX: todayX + futureStep * (futureCount - 0.5) };
};

const flag = (notes, ui, lang, { x, r, y, size, name }) =>
  `<div class="kg" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, right: r, top: y, padding: `${size * 0.55}px ${size * 0.75}px`, 'border-radius': size * 0.9 })}"><div class="kg__k" style="${styleOf({ 'font-size': size * 0.72 })}">${t(ui.cel.title, lang)}</div><div class="kg__num" style="${styleOf({ 'font-size': size * 2, 'margin-top': size * 0.3 })}">${money(ui.cel.target, lang)}</div><div class="kg__sub" style="${styleOf({ 'font-size': size * 0.82, 'margin-top': size * 0.25 })}">${t(notes.timelineEnd, lang)}</div></div>`;

const accountChips = (ui, lang, { x, y, gap, size, w, offsets }) => {
  const items = ui.konta.groups.flatMap(g => g.items).filter((_, i) => [0, 1, 2, 3, 5].includes(i));
  return items
    .map((item, i) => {
      const h = size * 3.3;
      return `<div class="kg" data-box="fg" data-name="acct-${i}" style="${styleOf({ left: x + (offsets[i] ?? 0), top: y + i * (h + gap), width: w, height: h, 'border-radius': size * 1.1, display: 'flex', 'align-items': 'center', gap: size * 0.7, padding: `0 ${size}px 0 ${size * 0.6}px` })}"><span style="${styleOf({ display: 'flex', 'align-items': 'center', 'justify-content': 'center', flex: 'none', width: size * 2.1, height: size * 2.1, 'border-radius': size * 0.7, background: 'rgba(255,255,255,.08)', color: c.lod })}">${icons[item.icon].replace('<svg ', `<svg width="${size * 1.2}" height="${size * 1.2}" `)}</span><span style="${styleOf({ flex: '1', 'min-width': 0 })}"><span style="${styleOf({ display: 'block', 'font-weight': '600', 'font-size': size, 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' })}">${t(item.name, lang)}</span><span style="${styleOf({ display: 'block', 'font-size': size * 0.8, color: c.tekst2, 'white-space': 'nowrap' })}">${money(item.value, lang)}</span></span></div>`;
    })
    .join('');
};

const budgetPanel = (ui, lang, { x, y, w, h, rows, big, name }) => {
  const b = ui.budzet;
  const scale = w / 390;
  const shown = rows ? b.categories.slice(0, rows) : b.categories;
  return glassCard({
    x,
    y,
    w,
    h,
    name,
    r: 34 * scale,
    style: { overflow: 'hidden' },
    inner: `<div style="${styleOf({ width: 390, transform: `scale(${scale})`, 'transform-origin': '0 0', 'padding-top': 8, 'font-size': 15, 'line-height': '1.3', 'font-weight': '500' })}">${screenHead(b.title, ui, lang, b.date)}<div class="k-pad" style="margin-top:16px">${budgetSafe(ui, lang, { big })}</div><div class="k-pad" style="margin-top:18px"><div class="k-between" style="padding:0 4px 8px"><span class="k-kicker">${t(b.spentLabel, lang)}</span><span class="k-muted">${money(shown.reduce((s, item) => s + item.spent, 0), lang)} / ${money(shown.reduce((s, item) => s + item.limit, 0), lang)}</span></div>${budgetList(ui, lang, { rows })}</div></div>`,
  });
};

const L = {
  appstore: {
    head: 56,
    majatek: { h: { x: 30, y: 62, w: 384 }, d: { width: 300, x: 120, y: 270 }, glow: { x: 200, y: 560, r: 300 }, line: { width: 2.6, blur: 5, labelGap: 14, maxStart: 30, size: 13 } },
    budzet: { h: { x: 30, y: 62, w: 380 }, panel: { x: 22, y: 232, w: 396, h: 690, big: 72 }, glow: { x: 300, y: 420, r: 300 } },
    poduszka: { h: { x: 30, y: 62, w: 370 }, d: { width: 268, x: 150, y: 270, soft: 2.4 }, card: { x: 26, y: 400, w: 300, h: 372, size: 270 }, glow: { x: 180, y: 600, r: 300 } },
    alokacja: { h: { x: 40, y: 58, w: 360, align: 'center' }, d: { width: 236, x: 102, y: 330 }, ring: { cx: 220, cy: 578, r: 182, stroke: 22 }, pills: { size: 10.5, at: [[6, 614, 'r'], [6, 478], [14, 276]] }, glow: { x: 220, y: 580, r: 260 } },
    cel: { h: { x: 30, y: 62, w: 370 }, d: { width: 236, x: 30, y: 424 }, tl: { x0: 6, x1: 430, y: 336, h: 70, dot: 7, size: 12, todayX: 170 }, flag: { anchor: 'end', y: 452, size: 13 }, glow: { x: 160, y: 600, r: 260 } },
    raport: { h: { x: 30, y: 62, w: 384 }, back: { width: 230, x: 18, y: 300, rotate: -7, soft: 1.2 }, front: { width: 254, x: 166, y: 330, rotate: 4 }, glow: { x: 280, y: 620, r: 260 } },
    konta: { h: { x: 30, y: 62, w: 370 }, d: { width: 262, x: 186, y: 300 }, chips: { x: 14, y: 412, gap: 14, size: 12.5, w: 216, offsets: [0, 8, 0, 10, 4] }, glow: { x: 160, y: 560, r: 260 } },
  },
  play: {
    head: 34,
    majatek: { h: { x: 24, y: 34, w: 300 }, d: { width: 214, x: 106, y: 150 }, glow: { x: 170, y: 360, r: 220 }, line: { width: 2, blur: 4, labelGap: 10, maxStart: 40, size: 11 } },
    budzet: { h: { x: 24, y: 34, w: 312 }, panel: { x: 16, y: 126, w: 328, h: 496, rows: 4, big: 64 }, glow: { x: 250, y: 300, r: 220 } },
    poduszka: { h: { x: 24, y: 34, w: 312 }, d: { width: 190, x: 152, y: 140, soft: 2 }, card: { x: 22, y: 230, w: 230, h: 288, size: 206 }, glow: { x: 140, y: 380, r: 220 } },
    alokacja: { h: { x: 30, y: 30, w: 300, align: 'center' }, d: { width: 168, x: 96, y: 178 }, ring: { cx: 180, cy: 360, r: 146, stroke: 18 }, pills: { size: 9.5, at: [[6, 388, 'r'], [4, 278], [8, 126]] }, glow: { x: 180, y: 360, r: 200 } },
    cel: { h: { x: 24, y: 34, w: 312 }, d: { width: 176, x: 22, y: 262 }, tl: { x0: 6, x1: 352, y: 196, h: 56, dot: 5.5, size: 10, todayX: 150 }, flag: { anchor: 'end', y: 292, size: 10.5 }, glow: { x: 140, y: 380, r: 200 } },
    raport: { h: { x: 24, y: 34, w: 312 }, back: { width: 170, x: 14, y: 150, rotate: -7, soft: 1 }, front: { width: 190, x: 152, y: 168, rotate: 4 }, glow: { x: 240, y: 420, r: 200 } },
    konta: { h: { x: 24, y: 34, w: 312 }, d: { width: 190, x: 166, y: 150 }, chips: { x: 8, y: 252, gap: 10, size: 10, w: 170, offsets: [0, 6, 0, 8, 3] }, glow: { x: 140, y: 380, r: 200 } },
  },
  ipad: {
    head: 104,
    majatek: { h: { x: 72, y: 96, w: 820 }, d: { width: 840, x: -40, y: 400 }, chip: { r: 22, y: 610, size: 26 }, glow: { x: 420, y: 860, r: 620 }, line: { width: 4, blur: 8, labelGap: 22, maxStart: 90, size: 22 } },
    budzet: { h: { x: 72, y: 1104, w: 880 }, d: { width: 760, x: -150, y: 70, soft: 0.6 }, card: { x: 560, y: 600, w: 420, h: 360, size: 112 }, glow: { x: 760, y: 760, r: 520 } },
    poduszka: { h: { x: 72, y: 96, w: 880 }, d: { width: 760, x: 236, y: 380, soft: 3.2 }, card: { x: 96, y: 520, w: 560, h: 700, size: 500 }, glow: { x: 400, y: 900, r: 600 } },
    alokacja: { h: { x: 96, y: 86, w: 840, align: 'center' }, d: { width: 560, x: 236, y: 420 }, ring: { cx: 516, cy: 790, r: 446, stroke: 40 }, pills: { size: 22, at: [[24, 900, 'r'], [20, 560], [40, 296]] }, glow: { x: 516, y: 790, r: 600 } },
    cel: { h: { x: 72, y: 96, w: 880 }, d: { width: 600, x: 390, y: 360 }, tl: { x0: 20, x1: 1010, y: 1000, h: 116, dot: 12, size: 20, todayX: 370 }, flag: { x: 690, y: 1110, size: 21 }, glow: { x: 220, y: 1000, r: 420 } },
    raport: { h: { x: 72, y: 96, w: 880 }, d: { width: 820, x: 106, y: 360, rotate: 3 }, glow: { x: 760, y: 900, r: 500 } },
  },
};

const compose = (app, store, lang, slotIndex, variant) => {
  const copy = app.copy[lang];
  const ui = copy.ui;
  const notes = copy.notes;
  const slot = variant === 'b' ? copy.variantB : copy.slots[slotIndex];
  const screenId = slot.screen;
  const n = variant === 'b' ? 'b' : String(slotIndex + 1);
  const S = L[store];
  const spec = S[screenId];
  const w = W[store];
  const h = H[store];
  const parts = [];
  const back = [];
  const front = [];
  const glows = [{ ...spec.glow, color: sage(0.12) }];
  let script = '';
  const head = headline({ slot, lang, ...spec.h, size: spec.h.size ?? S.head, name: `headline-${n}` });
  const dev = (d, id = screenId, name = `device-${n}`) => device(store, { ui, lang, screenId: id, ...d, name });

  if (screenId === 'majatek') {
    parts.push(dev(spec.d));
    const o = outerParts(store, ui, lang, spec.line);
    front.push(o.layer, o.label);
    if (spec.chip) front.push(worthChip(notes, ui, lang, spec.chip));
    script = o.script;
  } else if (screenId === 'budzet' && spec.panel) {
    front.push(budgetPanel(ui, lang, { ...spec.panel, name: 'budget-panel' }));
  } else if (screenId === 'budzet') {
    parts.push(dev(spec.d));
    front.push(safeCard(notes, ui, lang, { ...spec.card, name: 'safe' }));
  } else if (screenId === 'poduszka') {
    parts.push(dev(spec.d));
    front.push(gaugeCard(notes, ui, lang, { ...spec.card, name: 'gauge' }));
  } else if (screenId === 'alokacja') {
    back.push(ringBack(ui, spec.ring));
    parts.push(dev(spec.d));
    front.push(ringPills(ui, lang, spec.pills));
    glows.push({ x: spec.ring.cx, y: spec.ring.cy, r: spec.ring.r * 0.9, color: ice(0.05) });
  } else if (screenId === 'cel') {
    const tl = timeline(ui, lang, notes, spec.tl);
    back.push(tl.band, layer(w, h, tl.dots), tl.title);
    parts.push(dev(spec.d));
    front.push(layer(w, h, `<line x1="${tl.endX.toFixed(1)}" x2="${tl.endX.toFixed(1)}" y1="${spec.tl.y + spec.tl.dot}" y2="${spec.flag.y}" stroke="${c.platyna}" stroke-opacity=".6" stroke-width="1.2"/><circle cx="${tl.endX.toFixed(1)}" cy="${spec.tl.y}" r="${spec.tl.dot * 0.75}" fill="${c.platyna}"/>`));
    const flagAt = spec.flag.anchor === 'end' ? { r: Math.max(8, w - tl.endX - spec.tl.dot * 2.5) } : { x: spec.flag.x };
    front.push(flag(notes, ui, lang, { ...spec.flag, ...flagAt, name: 'goal' }));
  } else if (screenId === 'raport') {
    if (store === 'ipad') {
      parts.push(dev(spec.d, 'raport'));
    } else {
      parts.push(dev(spec.back, 'konta', `device-${n}-back`));
      parts.push(dev(spec.front, 'raport'));
    }
  } else if (screenId === 'konta') {
    parts.push(dev(spec.d));
    front.push(accountChips(ui, lang, spec.chips));
  }

  return [ground(w, h, glows), back.join(''), parts.join(''), front.join(''), head, script].join('');
};

const featureBody = (app, lang) => {
  const copy = app.copy[lang];
  const values = shape;
  const w = 512;
  const hgt = 250;
  const x0 = -6;
  const x1 = 470;
  const yTop = 92;
  const yBot = 196;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const X = i => x0 + ((x1 - x0) * i) / (values.length - 1);
  const Y = v => yBot - ((yBot - yTop) * (v - min)) / (max - min);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join(' ');
  const end = [X(values.length - 1), Y(values[values.length - 1])];
  const grid = [0.25, 0.5, 0.75].map(f => `<line x1="0" x2="${w}" y1="${(yTop + (yBot - yTop) * f).toFixed(1)}" y2="${(yTop + (yBot - yTop) * f).toFixed(1)}" stroke="rgba(255,255,255,.05)"/>`).join('');
  const art = `<defs><linearGradient id="fl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.szalwia}" stop-opacity=".1"/><stop offset=".4" stop-color="${c.szalwia}" stop-opacity=".8"/><stop offset="1" stop-color="${c.szalwia}"/></linearGradient><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.szalwia}" stop-opacity=".14"/><stop offset="1" stop-color="${c.szalwia}" stop-opacity="0"/></linearGradient><filter id="fb" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>${grid}<path d="${d} L${x1} ${hgt} L${x0} ${hgt} Z" fill="url(#fa)"/><path d="${d}" fill="none" stroke="url(#fl)" stroke-width="7" stroke-opacity=".5" filter="url(#fb)"/><path d="${d}" fill="none" stroke="url(#fl)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="11" fill="${sage(0.18)}"/><circle cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="4.5" fill="${c.szalwia}"/>`;
  const note = copy.notes.sample;
  return `${ground(w, hgt, [{ x: 330, y: 120, rx: 260, ry: 150, color: sage(0.13) }])}${layer(w, hgt, art)}
<div class="fg-text" data-box="fg" data-name="feature-text" style="left:56px;top:56px;width:150px"><div class="fg-name" data-box="headline" data-name="feature-name">Kruszec</div><div class="kh fg-h" data-box="headline" data-name="feature-tagline">${accented(copy.feature.headline, copy.feature.accent, lang)}</div></div>
<div class="kg fg-chip" data-box="fg" data-name="feature-chip" style="right:58px;top:${(end[1] + 44).toFixed(1)}px"><b>${money(copy.ui.majatek.total, lang)}</b><span>${esc(note)}</span></div>`;
};

const featureCss = `
.fg-text{position:absolute}
.fg-name{position:relative;font-family:'Instrument Serif',serif;font-size:46px;line-height:1;letter-spacing:-.01em;color:${c.tekst}}
.fg-h{position:relative;margin-top:8px;font-size:21px;line-height:1.05;text-wrap:balance;hyphens:none}
.fg-chip{display:flex;flex-direction:column;align-items:flex-end;gap:2px;padding:7px 11px 8px;border-radius:12px}
.fg-chip b{font-family:'Manrope',sans-serif;font-weight:700;font-size:13px;color:${c.tekst};white-space:nowrap}
.fg-chip span{font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${c.tekst2};white-space:nowrap}
`;

export const iconSvg = (layerName = 'full', size = 1024) => {
  const values = shape.filter((_, i) => i % 2 === 0 || i === shape.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const X = i => 300 + (424 * i) / (values.length - 1);
  const Y = v => 606 - (150 * (v - min)) / (max - min);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const end = [X(values.length - 1), Y(values[values.length - 1])];
  const bg = `<defs><radialGradient id="ib" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#18264A"/><stop offset=".55" stop-color="#0F1730"/><stop offset="1" stop-color="${c.glebia}"/></radialGradient><radialGradient id="ig" cx="56%" cy="56%" r="40%"><stop offset="0" stop-color="${c.szalwia}" stop-opacity=".22"/><stop offset="1" stop-color="${c.szalwia}" stop-opacity="0"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#ib)"/><rect width="1024" height="1024" fill="url(#ig)"/>`;
  const fg = `<defs><linearGradient id="ifg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".2"/><stop offset=".55" stop-color="#FFFFFF" stop-opacity=".07"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".11"/></linearGradient><linearGradient id="ie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".5"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".12"/></linearGradient><filter id="il" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="14"/></filter></defs><rect x="232" y="232" width="560" height="560" rx="132" fill="url(#ifg)" stroke="url(#ie)" stroke-width="5"/><path d="${d}" fill="none" stroke="${c.szalwia}" stroke-width="30" stroke-opacity=".45" filter="url(#il)"/><path d="${d}" fill="none" stroke="${c.szalwia}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="22" fill="${c.platyna}"/>`;
  const content = layerName === 'background' ? bg : layerName === 'foreground' ? fg : bg + fg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${content}</svg>`;
};

export const jobs = app => {
  const list = [];
  for (const lang of ['pl', 'en']) {
    for (const store of ['appstore', 'play']) {
      const spec = stores[store].css;
      for (let i = 0; i < 6; i += 1) {
        const slot = String(i + 1).padStart(2, '0');
        list.push({ id: `${store}-${lang}-${slot}`, store, lang, width: W[store], height: H[store], scale: spec.scale, css, body: compose(app, store, lang, i), outputs: [{ slot, frame: 0 }] });
      }
      list.push({ id: `${store}-${lang}-01b`, store, lang, variant: 'b', width: W[store], height: H[store], scale: spec.scale, css, body: compose(app, store, lang, 0, 'b'), outputs: [{ slot: '01', variant: 'b', frame: 0 }] });
    }
    for (let i = 0; i < 6; i += 1) {
      const slot = String(i + 1).padStart(2, '0');
      list.push({ id: `ipad-${lang}-${slot}`, store: 'ipad', lang, width: W.ipad, height: H.ipad, scale: stores.ipad.css.scale, css, body: compose(app, 'ipad', lang, i), outputs: [{ slot, frame: 0 }] });
    }
    list.push({ id: `feature-${lang}`, store: 'feature', lang, width: 512, height: 250, scale: 2, css: css + featureCss, body: featureBody(app, lang), outputs: [{ slot: 'feature', frame: 0 }] });
  }
  return list;
};

export const sheets = app =>
  ['pl', 'en'].flatMap(lang => {
    const ui = app.copy[lang].ui;
    const phones = screenOrder
      .map((id, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px rgba(255,255,255,.2)"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: c.tekst })}${renderScreen(id, ui, { lang, store: 'appstore' })}</div></div>`)
      .join('');
    const tabletIds = ['majatek', 'budzet', 'poduszka', 'alokacja', 'cel', 'raport'];
    const tablets = tabletIds.map((id, i) => `<div style="position:absolute;left:${20 + i * 1052}px;top:20px;width:1032px;height:1376px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px rgba(255,255,255,.2)">${renderTablet(id, ui, { lang })}</div>`).join('');
    return [
      { id: `ui-${lang}`, lang, width: 20 + screenOrder.length * 410, height: 884, scale: 1, css, body: phones, background: '#05080F' },
      { id: `tablet-${lang}`, lang, width: 20 + tabletIds.length * 1052, height: 1416, scale: 0.5, css, body: tablets, background: '#05080F' },
    ];
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });

