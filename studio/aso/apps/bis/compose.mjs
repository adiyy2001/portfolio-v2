import { card, esc, glue, phone, statusBar, styleOf } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { avatar, chromeStops, colors as c, cover, holoStops, rimStops, sparkle, sparkleDefs, starPath, tones } from './art.mjs';
import { icons, logo, renderScreen, screenOrder, sized, stub, t, waveBars } from './screens.mjs';

const W = { appstore: 440, play: 360 };
const H = { appstore: 956, play: 640 };

const chromeBody = 'linear-gradient(135deg,#FFFFFF 0%,#C5CCD8 16%,#7E8798 34%,#F4F6FA 50%,#A3ABBB 66%,#EEF1F5 82%,#7F889A 100%)';

const css = `
.bh{font-family:'Modak',sans-serif;font-weight:400;line-height:.98;letter-spacing:.005em;color:${c.atrament};text-shadow:0 3px 0 rgba(255,255,255,.9)}
.bh .chr{color:transparent;text-shadow:none;white-space:nowrap}
.b-ground{position:absolute;left:0;top:0;overflow:hidden}
.b-layer{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.b-chrome{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;z-index:20}
.b-phone{box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 30px 50px -24px rgba(17,18,23,.55),0 0 0 1px rgba(17,18,23,.25)}
.b-phone .kit-phone__glass{background:${c.chromJasny};box-shadow:0 0 0 2.5px ${c.atrament}}
.b-phone .kit-phone__btn{background:linear-gradient(180deg,#F4F6FA,#7E8798)}
.b-cardscr{background:${c.chromJasny};box-shadow:0 0 0 2px ${c.atrament}}
.b-rim{position:absolute;background:${chromeBody};box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 26px 44px -22px rgba(17,18,23,.55),0 0 0 1px rgba(17,18,23,.22)}
.b-sticker{position:absolute;border-radius:50%;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.12),0 14px 22px -12px rgba(17,18,23,.55)}
.b-sticker > .b-coverbox,.b-sticker > span{position:absolute;overflow:hidden;border-radius:50%}
.b-gloss{position:absolute;inset:0;border-radius:inherit;background:radial-gradient(70% 55% at 32% 22%,rgba(255,255,255,.75),rgba(255,255,255,.12) 55%,rgba(255,255,255,0) 70%),linear-gradient(135deg,rgba(255,138,208,.0) 40%,rgba(114,239,255,.28) 60%,rgba(215,255,99,.0) 80%);pointer-events:none}
.b-pill{position:absolute;display:flex;align-items:center;gap:8px;padding:0 16px;border-radius:999px;white-space:nowrap;font-family:'Quicksand',sans-serif;font-weight:700;color:${c.atrament};box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.12),0 12px 20px -12px rgba(17,18,23,.5)}
.b-trade{position:absolute;border-radius:18px;padding:8px;background:linear-gradient(125deg,#FF8AD0 0%,#FFC7A0 22%,#D7FF63 42%,#72EFFF 62%,#FFFFFF 72%,#FF8AD0 100%);box-shadow:0 0 0 2px ${c.atrament},0 20px 30px -16px rgba(17,18,23,.6)}
.b-trade__in{border-radius:12px;background:#fff;padding:8px 8px 10px;box-shadow:inset 0 0 0 1px rgba(17,18,23,.1)}
.b-trade__name{margin-top:7px;font-family:'Quicksand',sans-serif;font-weight:700;color:${c.atrament};line-height:1.1;white-space:nowrap}
.b-trade__meta{font-family:'Quicksand',sans-serif;font-weight:600;color:${c.grafit};line-height:1.25;white-space:nowrap}
.b-notif{position:absolute;border-radius:30px;padding:4px;background:${chromeBody};box-shadow:0 0 0 1.5px ${c.atrament},0 28px 40px -20px rgba(17,18,23,.6)}
.b-notif__in{border-radius:26px;padding:14px 16px 16px;background:rgba(255,255,255,.94);font-family:'Quicksand',sans-serif;color:${c.atrament}}
.b-tile{position:absolute;display:flex;flex-direction:column;justify-content:center;border-radius:26px;background:linear-gradient(135deg,#FF8AD0,#FFC7A0 38%,#D7FF63 66%,#72EFFF);box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.14),0 16px 24px -14px rgba(17,18,23,.55);font-family:'Quicksand',sans-serif;color:${c.atrament}}
.b-tile--going{background:${c.limonka};box-shadow:0 0 0 2.5px ${c.atrament},0 0 0 5px #fff,0 16px 24px -14px rgba(17,18,23,.55)}
.b-tile__d{font-family:'Modak',sans-serif;line-height:.9}
.b-tile__m{font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.b-tile__a{font-weight:700;line-height:1.1;white-space:nowrap}
.b-bubble{position:absolute;display:flex;flex-direction:column;align-items:center;gap:4px}
.b-bubble__ring{border-radius:50%;padding:4px;background:${chromeBody};box-shadow:0 0 0 1.5px ${c.atrament},0 14px 22px -12px rgba(17,18,23,.55)}
.b-bubble__ring svg{display:block;border-radius:50%}
.b-bubble__name{padding:2px 10px;border-radius:999px;background:#fff;font-family:'Quicksand',sans-serif;font-weight:700;color:${c.atrament};box-shadow:0 0 0 1px rgba(17,18,23,.12)}
.b-bubble__name--going{background:${c.limonka}}
`;

const lastGlue = value => {
  const at = value.lastIndexOf(' ');
  if (at < 0 || value.slice(at + 1).includes('\u00a0')) return value;
  return `${value.slice(0, at)}\u00a0${value.slice(at + 1)}`;
};

const accented = (value, accent, lang, { last = true } = {}) => {
  const plain = last ? lastGlue(glue(value, lang)) : glue(value, lang);
  if (!accent) return esc(plain);
  const flat = plain.replace(/\u00a0/g, ' ');
  const at = flat.indexOf(accent);
  if (at < 0) throw new Error(`bis: accent "${accent}" not in "${value}"`);
  const words = plain.slice(at, at + accent.length).split(/([ \u00a0])/);
  const marked = words.map(part => (/^[ \u00a0]$/.test(part) || part === '' ? part : `<span class="chr" data-chrome>${esc(part)}</span>`)).join('');
  return `${esc(plain.slice(0, at))}${marked}${esc(plain.slice(at + accent.length))}`;
};

const headline = ({ slot, lang, x, y, w, size, align = 'left', name }) =>
  `<div class="kit-headline bh" data-box="headline" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width: w, 'font-size': size, 'text-align': align })}">${accented(slot.headline, slot.accent, lang)}</div>`;

const chromeScript = () => `<script>(${chromeText.toString()})();</script>`;

function chromeText() {
  window.wzReady = (async () => {
    await document.fonts.ready;
    const NS = 'http://www.w3.org/2000/svg';
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;font-family:Modak;font-size:100px;line-height:3;white-space:nowrap';
    probe.innerHTML = '<span>Hx</span><span style="display:inline-block;width:0;height:0;vertical-align:baseline"></span>';
    document.body.appendChild(probe);
    const range = document.createRange();
    range.selectNodeContents(probe.firstChild.firstChild);
    const tr = range.getClientRects()[0];
    const pb = probe.lastChild.getBoundingClientRect();
    const ratio = (pb.bottom - tr.top) / tr.height;
    probe.remove();
    const svg = document.getElementById('chrome');
    const spans = [...document.querySelectorAll('[data-chrome]')];
    if (spans.length === 0) console.error('no chrome words in the frame');
    const defs = document.createElementNS(NS, 'defs');
    svg.appendChild(defs);
    let n = 0;
    const words = [];
    for (const span of spans) {
      const size = parseFloat(getComputedStyle(span).fontSize);
      const walker = document.createTreeWalker(span, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const re = /[^\s ]+/g;
        let m = re.exec(node.data);
        while (m) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          const rect = [...r.getClientRects()].find(item => item.width > 0);
          if (rect) words.push({ word: m[0], x: rect.left, top: rect.top, right: rect.right, base: rect.top + ratio * rect.height, size, spark: span.hasAttribute('data-nospark') ? 0 : 1 });
          m = re.exec(node.data);
        }
      }
    }
    const make = (tag, attrs, parent) => {
      const el = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      parent.appendChild(el);
      return el;
    };
    const stops = window.wzChromeStops;
    for (const w of words) {
      n += 1;
      const id = `chr${n}`;
      const top = w.base - 0.7 * w.size;
      const bottom = w.base + 0.12 * w.size;
      defs.insertAdjacentHTML('beforeend', `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${top}" x2="0" y2="${bottom}">${stops}</linearGradient>`);
      const g = make('g', {}, svg);
      const common = { x: w.x, y: w.base, 'font-family': 'Modak', 'font-size': w.size };
      make('text', { ...common, y: w.base + w.size * 0.075, fill: '#3B4250' }, g).textContent = w.word;
      make('text', { ...common, y: w.base + w.size * 0.075, fill: 'none', stroke: '#111217', 'stroke-width': w.size * 0.1, 'stroke-linejoin': 'round' }, g).textContent = w.word;
      make('text', { ...common, fill: 'none', stroke: '#111217', 'stroke-width': w.size * 0.1, 'stroke-linejoin': 'round' }, g).textContent = w.word;
      make('text', { ...common, fill: `url(#${id})` }, g).textContent = w.word;
    }
    const last = words.filter(w => w.spark).slice(-1)[0];
    const star = (x, y, r) => {
      const k = r * 0.16;
      make('circle', { cx: x, cy: y, r: r * 0.6, fill: 'url(#chr-glow)' }, svg);
      make('path', { d: `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`, fill: '#FFFFFF', stroke: '#111217', 'stroke-width': r * 0.07 }, svg);
    };
    defs.insertAdjacentHTML('beforeend', '<radialGradient id="chr-glow"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>');
    if (last) star(last.right - last.size * 0.08, last.base - last.size * 0.66, last.size * 0.26);
  })();
}

const blob = (x, y, r, color, opacity = 0.75) => ({ x, y, r, color, opacity });

const ground = (w, h, blobs, id) => {
  const b = blobs
    .map((item, i) => `<radialGradient id="${id}-b${i}"><stop offset="0" stop-color="${item.color}" stop-opacity="${item.opacity}"/><stop offset=".6" stop-color="${item.color}" stop-opacity="${item.opacity * 0.45}"/><stop offset="1" stop-color="${item.color}" stop-opacity="0"/></radialGradient>`)
    .join('');
  const circles = blobs.map((item, i) => `<circle cx="${item.x}" cy="${item.y}" r="${item.r}" fill="url(#${id}-b${i})"/>`).join('');
  return `<svg class="b-ground" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><linearGradient id="${id}-s" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#F7F9FC"/><stop offset=".55" stop-color="#E3E8EF"/><stop offset="1" stop-color="#D4DAE3"/></linearGradient><filter id="${id}-br" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.003 0.7" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 .62"/></filter><filter id="${id}-dk" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.55" numOctaves="1" seed="4"/><feColorMatrix values="0 0 0 0 .23  0 0 0 0 .26  0 0 0 0 .31  0 0 0 -1 .55"/></filter>${b}</defs><rect width="${w}" height="${h}" fill="url(#${id}-s)"/><rect width="${w}" height="${h}" filter="url(#${id}-br)" opacity=".55"/><rect width="${w}" height="${h}" filter="url(#${id}-dk)" opacity=".12"/>${circles}</svg>`;
};

const layer = (w, h, inner, defs = '') => `<svg class="b-layer" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs>${defs}</defs>${inner}</svg>`;

const sparkles = (w, h, list, id) => layer(w, h, list.map(([x, y, r, o = 1]) => sparkle({ x, y, r, id, opacity: o })).join(''), sparkleDefs(id));

const device = (store, { ui, lang, screenId, width, x, y, rotate = 0, name }) => {
  const screen = renderScreen(screenId, ui, { lang, store });
  if (store === 'appstore') {
    return phone({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: 'b-phone', body: chromeBody, statusColor: c.atrament });
  }
  const h = (844 * width) / 390;
  const pad = 5;
  const radius = 16 * (width / 390) * 1.6;
  const rim = `<div class="b-rim" style="${styleOf({ left: x - pad, top: y - pad, width: width + pad * 2, height: h + pad * 2, 'border-radius': radius + pad, transform: rotate ? `rotate(${rotate}deg)` : undefined })}"></div>`;
  return rim + card({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: 'b-cardscr', statusColor: c.atrament, radius: 16 });
};

const sticker = ({ id, x, y, s, rot = 0, name, inner }) => {
  const border = Math.max(4, s * 0.05);
  const content = inner ?? `<span class="b-coverbox" style="${styleOf({ left: border, top: border, width: s - border * 2, height: s - border * 2, 'border-radius': '50%' })}">${cover(id, { size: s - border * 2 })}</span>`;
  return `<div class="b-sticker" data-box="fg" data-name="${esc(name ?? `sticker-${id}`)}" style="${styleOf({ left: x, top: y, width: s, height: s, transform: rot ? `rotate(${rot}deg)` : undefined })}">${content}<span class="b-gloss" style="${styleOf({ left: border, top: border, width: s - border * 2, height: s - border * 2 })}"></span></div>`;
};

const pill = ({ x, y, text: label, size, name, background = c.limonka, icon = '' }) =>
  `<div class="b-pill" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, height: size * 2.4, 'font-size': size, background })}">${icon}${label}</div>`;

const tradeCard = (ui, item, lang, { x, y, w, rot, name }) => {
  const a = ui.artists[item.artist];
  const v = ui.venues[item.venue];
  const k = w / 168;
  const inner = w - 16 - 16;
  return `<div class="b-trade" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width: w, transform: `rotate(${rot}deg)`, padding: 8 * k, 'border-radius': 18 * k })}"><div class="b-trade__in" style="${styleOf({ padding: `${8 * k}px ${8 * k}px ${10 * k}px`, 'border-radius': 12 * k })}"><span class="b-coverbox" style="${styleOf({ display: 'block', width: inner * (k < 1 ? 1 : 1) - 0, height: inner, 'border-radius': 10 * k })}">${cover(item.artist, { size: inner })}</span><div class="b-trade__name" style="${styleOf({ 'font-size': 16 * k })}">${esc(a.name)}</div><div class="b-trade__meta" style="${styleOf({ 'font-size': 11.5 * k })}">${esc(a.genre)}</div><div class="b-trade__meta" style="${styleOf({ 'font-size': 11.5 * k, color: c.atrament, 'font-weight': '700', 'margin-top': 2 * k })}">${t(item.when, lang)} · ${esc(v.name)}</div></div><span class="b-gloss" style="border-radius:inherit"></span></div>`;
};

const notification = (ui, lang, { x, y, w, size, name }) => {
  const n = ui.koncert.notification;
  return `<div class="b-notif" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, width: w, 'border-radius': size * 2, padding: size * 0.28 })}"><div class="b-notif__in" style="${styleOf({ 'border-radius': size * 1.75, padding: `${size * 0.9}px ${size}px ${size}px` })}"><div style="display:flex;align-items:center;gap:${size * 0.5}px">${logo(size * 1.6)}<span style="${styleOf({ 'font-weight': '700', 'font-size': size * 0.9 })}">${esc(n.app)}</span><span style="${styleOf({ 'margin-left': 'auto', 'font-weight': '600', 'font-size': size * 0.82, color: c.grafit })}">${t(n.time, lang)}</span></div><div style="${styleOf({ 'margin-top': size * 0.6, 'font-weight': '700', 'font-size': size * 1.12, 'line-height': '1.22', 'text-wrap': 'balance' })}">${t(n.title, lang)}</div><div style="${styleOf({ 'margin-top': size * 0.35, 'font-weight': '600', 'font-size': size * 0.9, 'line-height': '1.3', color: c.grafit })}">${t(n.body, lang)}</div></div></div>`;
};

const bellSticker = ({ x, y, s, rot = 0 }) =>
  sticker({
    id: 'bell',
    x,
    y,
    s,
    rot,
    name: 'bell',
    inner: `<span style="${styleOf({ left: s * 0.05, top: s * 0.05, width: s * 0.9, height: s * 0.9, background: chromeBody, display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'box-shadow': `inset 0 0 0 1.5px ${c.atrament}` })}"><span style="${styleOf({ display: 'flex', 'align-items': 'center', 'justify-content': 'center', width: s * 0.62, height: s * 0.62, 'border-radius': '50%', background: c.limonka, color: c.atrament, 'box-shadow': `0 0 0 1.5px ${c.atrament}` })}">${sized(icons.bell, s * 0.36)}</span></span>`,
  });

const playSticker = ({ x, y, s, rot = 0 }) =>
  sticker({
    id: 'play',
    x,
    y,
    s,
    rot,
    name: 'play',
    inner: `<span style="${styleOf({ left: s * 0.05, top: s * 0.05, width: s * 0.9, height: s * 0.9, background: chromeBody, display: 'flex', 'align-items': 'center', 'justify-content': 'center', 'box-shadow': `inset 0 0 0 1.5px ${c.atrament}` })}"><span style="${styleOf({ display: 'flex', 'align-items': 'center', 'justify-content': 'center', width: s * 0.64, height: s * 0.64, 'border-radius': '50%', background: c.atrament, color: c.limonka })}">${sized(icons.play, s * 0.34)}</span></span>`,
  });

const orbit = (ui, lang, { cx, cy, rx, ry, rot, size, angles, label }) => {
  const people = ui.znajomi.people;
  const z = ui.znajomi;
  const rad = (rot * Math.PI) / 180;
  return people
    .map((p, i) => {
      const a = (angles[i] * Math.PI) / 180;
      const ex = rx * Math.cos(a);
      const ey = ry * Math.sin(a);
      const px = cx + ex * Math.cos(rad) - ey * Math.sin(rad);
      const py = cy + ex * Math.sin(rad) + ey * Math.cos(rad);
      const s = size * (p.state === 'going' ? 1 : 0.84);
      const ring = s + 8;
      return `<div class="b-bubble" data-box="fg" data-name="friend-${i}" style="${styleOf({ left: px - (ring + 24) / 2, top: py - ring / 2, width: ring + 24 })}"><span class="b-bubble__ring">${avatar(p.shape, p.tone, s)}</span><span class="b-bubble__name${p.state === 'going' ? ' b-bubble__name--going' : ''}" style="${styleOf({ 'font-size': label })}">${esc(p.name)}</span></div>`;
    })
    .join('');
};

const orbitRing = (w, h, { cx, cy, rx, ry, rot }, half) => {
  const id = `orb${half}`;
  const path = half === 'front' ? `M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}` : `M${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}`;
  return layer(w, h, `<g transform="rotate(${rot} ${cx} ${cy})"><path d="${path}" fill="none" stroke="${c.atrament}" stroke-width="${half === 'front' ? 9 : 8}" opacity=".9"/><path d="${path}" fill="none" stroke="url(#${id})" stroke-width="${half === 'front' ? 6 : 5}"/></g>`, `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">${holoStops}</linearGradient>`);
};

const tiles = (ui, lang, { x, y, size, gap, offsets, months }) => {
  const k = ui.kalendarz;
  const picks = k.marks.filter(m => [15, 17, 22, 23, 30].includes(m.day));
  return picks
    .map((m, i) => {
      const a = ui.artists[m.artist];
      return `<div class="b-tile${m.going ? ' b-tile--going' : ''}" data-box="fg" data-name="tile-${m.day}" style="${styleOf({ left: x + (offsets[i] ?? 0), top: y + i * (size * 0.78 + gap), width: size * 1.28, height: size * 0.78, padding: `0 ${size * 0.14}px`, 'border-radius': size * 0.24 })}"><div style="display:flex;align-items:baseline;gap:${size * 0.06}px"><span class="b-tile__d" style="${styleOf({ 'font-size': size * 0.42 })}">${m.day}</span><span class="b-tile__m" style="${styleOf({ 'font-size': size * 0.12 })}">${esc(months)}</span>${m.going ? `<span style="${styleOf({ 'margin-left': 'auto', display: 'flex' })}">${sized(icons.ticket, size * 0.2)}</span>` : ''}</div><div class="b-tile__a" style="${styleOf({ 'font-size': size * 0.13 })}">${esc(a.name)}</div></div>`;
    })
    .join('');
};

const stubs = (ui, lang, list, scale) =>
  list
    .map(({ i, x, y, rot }) => {
      const item = ui.kolekcja.tickets[i];
      return `<div data-box="fg" data-name="stub-${i}" style="${styleOf({ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${scale})`, 'transform-origin': '0 0' })}">${stub(ui, item, i, lang, { width: 150, size: 46 })}</div>`;
    })
    .join('');

const waveBand = (w, h, { y, height, count, x0 = 0, x1 = w }) => {
  const bars = waveBars(count, 9);
  const step = (x1 - x0) / count;
  const bw = step * 0.56;
  return layer(
    w,
    h,
    bars
      .map((v, i) => {
        const bh = Math.max(bw, v * height);
        const x = x0 + i * step + (step - bw) / 2;
        return `<rect x="${x.toFixed(1)}" y="${(y - bh / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="url(#wv)" stroke="${c.atrament}" stroke-width="1.5"/>`;
      })
      .join(''),
    `<linearGradient id="wv" x1="0" y1="0" x2="0" y2="1">${chromeStops}</linearGradient>`,
  );
};

const L = {
  appstore: {
    wokolicy: {
      h: { x: 26, y: 50, w: 388, size: 48, align: 'center' },
      d: { width: 272, x: 120, y: 236, rotate: 7 },
      blobs: [blob(40, 300, 210, c.roz), blob(430, 560, 230, c.cyjan), blob(120, 920, 220, c.limonka, 0.6), blob(400, 40, 160, c.brzoskwinia, 0.7)],
      stickers: [
        { id: 'mira', x: 14, y: 290, s: 136, rot: -10 },
        { id: 'brokat', x: 316, y: 206, s: 108, rot: 10 },
        { id: 'lisie', x: 24, y: 650, s: 116, rot: 7 },
      ],
      pill: { x: 236, y: 862, size: 15, key: 'week' },
      sparks: [[110, 270, 16], [404, 400, 12], [182, 905, 13], [418, 760, 18], [30, 520, 10]],
    },
    odkrywaj: {
      h: { x: 26, y: 790, w: 388, size: 48 },
      d: { width: 250, x: 18, y: 64, rotate: -6 },
      blobs: [blob(420, 220, 230, c.cyjan), blob(20, 620, 220, c.brzoskwinia), blob(360, 700, 200, c.roz, 0.6)],
      cards: [
        { k: 'card', x: 236, y: 84, w: 156, rot: 8 },
        { k: 0, x: 264, y: 318, w: 150, rot: 15 },
        { k: 1, x: 222, y: 540, w: 150, rot: -5 },
      ],
      sparks: [[214, 100, 16], [412, 290, 12], [410, 760, 15], [34, 690, 11]],
    },
    koncert: {
      h: { x: 26, y: 50, w: 388, size: 48 },
      d: { width: 266, x: 160, y: 232, rotate: 5 },
      blobs: [blob(30, 520, 230, c.limonka, 0.6), blob(420, 330, 200, c.roz), blob(250, 950, 230, c.cyjan, 0.7)],
      bell: { x: 30, y: 262, s: 118, rot: -12 },
      cover: { id: 'szklane', x: 40, y: 724, s: 128, rot: 8 },
      notif: { x: 14, y: 500, w: 318, size: 15 },
      sparks: [[166, 300, 14], [30, 450, 10], [330, 900, 16], [412, 560, 11], [60, 840, 13]],
    },
    znajomi: {
      h: { x: 26, y: 50, w: 388, size: 48, align: 'center' },
      d: { width: 246, x: 97, y: 214, rotate: 0 },
      ring: { cx: 220, cy: 496, rx: 166, ry: 132, rot: -10 },
      orbit: { size: 62, label: 14, angles: [208, 332, 150, 30, 112, 68] },
      blobs: [blob(30, 360, 220, c.cyjan), blob(420, 380, 220, c.brzoskwinia), blob(220, 900, 260, c.roz, 0.55)],
      sparks: [[60, 250, 13], [384, 240, 15], [404, 870, 12], [40, 860, 16], [70, 470, 10]],
    },
    kalendarz: {
      h: { x: 26, y: 50, w: 388, size: 48, align: 'right' },
      d: { width: 268, x: 12, y: 236, rotate: -4 },
      tiles: { x: 284, y: 236, size: 112, gap: 22, offsets: [0, -16, 4, -12, 2] },
      blobs: [blob(400, 420, 230, c.limonka, 0.6), blob(40, 220, 200, c.roz), blob(380, 900, 230, c.cyjan, 0.7)],
      sparks: [[262, 220, 14], [420, 900, 13], [150, 920, 12], [30, 210, 10]],
    },
    kolekcja: {
      h: { x: 26, y: 50, w: 388, size: 48, align: 'center' },
      d: { width: 236, x: 102, y: 600, rotate: 0 },
      stubs: { scale: 0.86, list: [{ i: 0, x: 20, y: 222, rot: -9 }, { i: 1, x: 158, y: 206, rot: 5 }, { i: 2, x: 292, y: 232, rot: 10 }, { i: 3, x: 22, y: 400, rot: 6 }, { i: 5, x: 160, y: 380, rot: -4 }, { i: 4, x: 294, y: 408, rot: -8 }] },
      badge: { x: 210, y: 572, size: 15 },
      blobs: [blob(60, 260, 200, c.limonka, 0.6), blob(420, 300, 210, c.roz), blob(220, 900, 260, c.cyjan, 0.7)],
      sparks: [[140, 216, 14], [420, 400, 12], [30, 640, 15], [70, 900, 11], [400, 880, 13]],
    },
    podglad: {
      h: { x: 26, y: 50, w: 388, size: 48 },
      d: { width: 262, x: 160, y: 236, rotate: -5 },
      wave: { y: 600, height: 230, count: 22 },
      play: { x: 20, y: 270, s: 132, rot: -8 },
      pill: { x: 30, y: 850, size: 16, key: 'playsHere' },
      blobs: [blob(400, 260, 220, c.roz), blob(40, 760, 220, c.cyjan), blob(420, 920, 200, c.limonka, 0.6)],
      sparks: [[150, 260, 14], [414, 520, 12], [30, 500, 11], [400, 900, 15]],
    },
  },
  play: {
    wokolicy: {
      h: { x: 20, y: 24, w: 320, size: 37, align: 'center' },
      d: { width: 196, x: 104, y: 150, rotate: 6 },
      blobs: [blob(30, 220, 160, c.roz), blob(360, 380, 170, c.cyjan), blob(90, 620, 160, c.limonka, 0.6)],
      stickers: [
        { id: 'mira', x: 10, y: 176, s: 100, rot: -10 },
        { id: 'brokat', x: 266, y: 128, s: 82, rot: 10 },
        { id: 'lisie', x: 18, y: 440, s: 88, rot: 7 },
      ],
      pill: { x: 196, y: 586, size: 12, key: 'week' },
      sparks: [[90, 160, 11], [340, 300, 9], [140, 610, 10], [338, 520, 13]],
    },
    odkrywaj: {
      h: { x: 20, y: 536, w: 320, size: 37 },
      d: { width: 182, x: 14, y: 30, rotate: -6 },
      blobs: [blob(340, 140, 170, c.cyjan), blob(20, 420, 160, c.brzoskwinia), blob(300, 480, 150, c.roz, 0.6)],
      cards: [
        { k: 'card', x: 196, y: 28, w: 116, rot: 8 },
        { k: 0, x: 226, y: 196, w: 110, rot: 15 },
        { k: 1, x: 194, y: 356, w: 110, rot: -5 },
      ],
      sparks: [[180, 40, 11], [344, 190, 9], [340, 500, 11], [24, 500, 8]],
    },
    koncert: {
      h: { x: 20, y: 24, w: 320, size: 37 },
      d: { width: 190, x: 150, y: 150, rotate: 5 },
      blobs: [blob(20, 380, 170, c.limonka, 0.6), blob(350, 230, 150, c.roz), blob(200, 640, 170, c.cyjan, 0.7)],
      bell: { x: 24, y: 170, s: 88, rot: -12 },
      cover: { id: 'szklane', x: 24, y: 500, s: 92, rot: 8 },
      notif: { x: 10, y: 350, w: 246, size: 11.5 },
      sparks: [[150, 200, 10], [24, 320, 8], [300, 610, 12], [344, 420, 8]],
    },
    znajomi: {
      h: { x: 20, y: 24, w: 320, size: 37, align: 'center' },
      d: { width: 176, x: 92, y: 140, rotate: 0 },
      ring: { cx: 180, cy: 334, rx: 134, ry: 100, rot: -10 },
      orbit: { size: 46, label: 11, angles: [208, 332, 150, 30, 112, 68] },
      blobs: [blob(20, 240, 160, c.cyjan), blob(350, 260, 160, c.brzoskwinia), blob(180, 620, 190, c.roz, 0.55)],
      sparks: [[50, 160, 10], [314, 150, 11], [334, 600, 9], [30, 600, 11]],
    },
    kalendarz: {
      h: { x: 20, y: 24, w: 320, size: 37, align: 'right' },
      d: { width: 190, x: 10, y: 150, rotate: -4 },
      tiles: { x: 226, y: 150, size: 84, gap: 13, offsets: [0, -12, 4, -8, 2] },
      blobs: [blob(330, 300, 170, c.limonka, 0.6), blob(30, 150, 150, c.roz), blob(310, 620, 170, c.cyjan, 0.7)],
      sparks: [[204, 140, 10], [344, 610, 9], [120, 610, 9], [24, 150, 8]],
    },
    kolekcja: {
      h: { x: 20, y: 24, w: 320, size: 37, align: 'center' },
      d: { width: 166, x: 97, y: 420, rotate: 0 },
      stubs: { scale: 0.68, list: [{ i: 0, x: 14, y: 140, rot: -9 }, { i: 1, x: 128, y: 128, rot: 5 }, { i: 2, x: 240, y: 146, rot: 10 }, { i: 3, x: 16, y: 272, rot: 6 }, { i: 5, x: 128, y: 258, rot: -4 }, { i: 4, x: 240, y: 278, rot: -8 }] },
      badge: { x: 160, y: 396, size: 11.5 },
      blobs: [blob(40, 170, 150, c.limonka, 0.6), blob(350, 200, 150, c.roz), blob(180, 620, 190, c.cyjan, 0.7)],
      sparks: [[110, 136, 10], [344, 280, 9], [20, 430, 11], [60, 610, 9]],
    },
    podglad: {
      h: { x: 20, y: 24, w: 320, size: 37 },
      d: { width: 186, x: 148, y: 150, rotate: -5 },
      wave: { y: 400, height: 160, count: 18 },
      play: { x: 16, y: 170, s: 98, rot: -8 },
      pill: { x: 20, y: 580, size: 12, key: 'playsHere' },
      blobs: [blob(330, 170, 160, c.roz), blob(30, 500, 160, c.cyjan), blob(340, 620, 150, c.limonka, 0.6)],
      sparks: [[130, 160, 10], [344, 360, 9], [24, 350, 8], [320, 610, 11]],
    },
  },
};

const compose = (app, store, lang, slotIndex, variant) => {
  const copy = app.copy[lang];
  const ui = copy.ui;
  const notes = copy.notes;
  const slot = variant === 'b' ? copy.variantB : copy.slots[slotIndex];
  const screenId = slot.screen;
  const n = variant === 'b' ? 'b' : String(slotIndex + 1);
  const spec = L[store][screenId];
  const w = W[store];
  const h = H[store];
  const id = `${store}${n}`;
  const back = [];
  const parts = [];
  const front = [];
  const dev = (d, sid = screenId) => device(store, { ui, lang, screenId: sid, ...d, name: `device-${n}` });

  if (screenId === 'wokolicy') {
    parts.push(dev(spec.d));
    spec.stickers.forEach(s => front.push(sticker(s)));
    front.push(pill({ ...spec.pill, text: `${sized(icons.pin, spec.pill.size * 1.2)}${t(notes[spec.pill.key], lang)}`, name: 'week' }));
  } else if (screenId === 'odkrywaj') {
    parts.push(dev(spec.d));
    const o = ui.odkrywaj;
    spec.cards.forEach((cd, i) => {
      const item = cd.k === 'card' ? { artist: o.card.artist, venue: o.card.venue, when: o.card.when.split(',')[0] } : o.deck[cd.k];
      front.push(tradeCard(ui, item, lang, { ...cd, name: `trade-${i}` }));
    });
  } else if (screenId === 'koncert') {
    parts.push(dev(spec.d));
    front.push(bellSticker(spec.bell));
    front.push(sticker(spec.cover));
    front.push(notification(ui, lang, { ...spec.notif, name: 'notification' }));
  } else if (screenId === 'znajomi') {
    back.push(orbitRing(w, h, spec.ring, 'back'));
    parts.push(dev(spec.d));
    front.push(orbitRing(w, h, spec.ring, 'front'));
    front.push(orbit(ui, lang, { ...spec.ring, ...spec.orbit }));
  } else if (screenId === 'kalendarz') {
    parts.push(dev(spec.d));
    front.push(tiles(ui, lang, { ...spec.tiles, months: ui.wokolicy.list[0].month }));
  } else if (screenId === 'kolekcja') {
    back.push(stubs(ui, lang, spec.stubs.list, spec.stubs.scale));
    parts.push(dev(spec.d));
    front.push(pill({ ...spec.badge, text: `${sized(icons.sticker, spec.badge.size * 1.3)}${t(notes.collectionCount, lang)}`, name: 'count', background: 'linear-gradient(115deg,#FF8AD0,#FFC7A0 34%,#D7FF63 64%,#72EFFF)' }));
  } else if (screenId === 'podglad') {
    back.push(waveBand(w, h, spec.wave));
    parts.push(dev(spec.d));
    front.push(playSticker(spec.play));
    front.push(pill({ ...spec.pill, text: `${sized(icons.calendar, spec.pill.size * 1.2)}${t(notes[spec.pill.key], lang)}`, name: 'plays' }));
  }

  return [ground(w, h, spec.blobs, id), back.join(''), parts.join(''), front.join(''), sparkles(w, h, spec.sparks, `${id}s`), headline({ slot, lang, ...spec.h, name: `headline-${n}` }), `<svg class="b-chrome" id="chrome" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"></svg>`, `<script>window.wzChromeStops=${JSON.stringify(chromeStops)};</script>`, chromeScript()].join('');
};

const featureBody = (app, lang) => {
  const copy = app.copy[lang];
  const w = 512;
  const h = 250;
  const blobs = [blob(0, 0, 150, c.roz), blob(512, 250, 160, c.cyjan), blob(500, 10, 110, c.limonka, 0.6), blob(10, 250, 120, c.brzoskwinia)];
  const disc = layer(w, h, `<circle cx="258" cy="125" r="48" fill="url(#fd)" stroke="${c.atrament}" stroke-width="2"/><circle cx="258" cy="125" r="48" fill="url(#fg)"/><path d="${starPath(258, 125, 40, 0.26)}" fill="url(#fc)" stroke="${c.atrament}" stroke-width="2.2"/>`, `<linearGradient id="fd" x1="0" y1="0" x2="1" y2="1">${holoStops}</linearGradient><radialGradient id="fg" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".5" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">${chromeStops}</linearGradient>`);
  const stickers = [sticker({ id: 'mira', x: 404, y: 150, s: 56, rot: 10, name: 'f-mira' }), sticker({ id: 'brokat', x: 448, y: 46, s: 46, rot: -8, name: 'f-brokat' })];
  return `${ground(w, h, blobs, 'fg')}${disc}${stickers.join('')}${sparkles(w, h, [[200, 60, 9], [318, 196, 8], [30, 40, 7], [482, 128, 7]], 'fgs')}
<div class="kit-headline bh fg-name" data-box="headline" data-name="feature-name" style="left:30px;top:70px;width:166px;font-size:104px;text-align:center"><span class="chr" data-chrome>Bis</span></div>
<div class="kit-headline bh fg-h" data-box="headline" data-name="feature-tagline" style="left:318px;top:84px;width:146px;font-size:17.5px">${accented(copy.feature.headline, copy.feature.accent, lang).replace('data-chrome', 'data-chrome data-nospark')}</div>
<svg class="b-chrome" id="chrome" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"></svg><script>window.wzChromeStops=${JSON.stringify(chromeStops)};</script>${chromeScript()}`;
};

const featureCss = `
.fg-name{line-height:1}
.fg-h{line-height:1.02}
`;

export const iconSvg = (layerName = 'full', size = 1024) => {
  const bg = `<defs><linearGradient id="is" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#F8FAFC"/><stop offset=".6" stop-color="#E1E6ED"/><stop offset="1" stop-color="#CDD4DE"/></linearGradient><linearGradient id="ih" x1="0" y1="0" x2="1" y2="1">${holoStops}</linearGradient><radialGradient id="ig" cx="36%" cy="30%" r="72%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity=".15"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#is)"/><circle cx="512" cy="512" r="330" fill="url(#ih)"/><circle cx="512" cy="512" r="330" fill="url(#ig)"/><circle cx="512" cy="512" r="330" fill="none" stroke="${c.atrament}" stroke-width="10"/>`;
  const fg = `<defs><linearGradient id="ic" x1="0" y1="0" x2="0" y2="1">${chromeStops}</linearGradient><radialGradient id="iw"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs><path d="${starPath(512, 536, 290, 0.27)}" fill="${c.grafit}"/><path d="${starPath(512, 512, 290, 0.27)}" fill="url(#ic)" stroke="${c.atrament}" stroke-width="18" stroke-linejoin="round"/><circle cx="742" cy="290" r="76" fill="url(#iw)"/><path d="${starPath(742, 290, 66, 0.22)}" fill="#FFFFFF" stroke="${c.atrament}" stroke-width="7"/>`;
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
    list.push({ id: `feature-${lang}`, store: 'feature', lang, width: 512, height: 250, scale: 2, css: css + featureCss, body: featureBody(app, lang), outputs: [{ slot: 'feature', frame: 0 }] });
  }
  return list;
};

export const sheets = app =>
  ['pl', 'en'].map(lang => {
    const ui = app.copy[lang].ui;
    const phones = screenOrder.map((sid, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px rgba(17,18,23,.25)"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: c.atrament })}${renderScreen(sid, ui, { lang, store: 'appstore' })}</div></div>`).join('');
    return { id: `ui-${lang}`, lang, width: 20 + screenOrder.length * 410, height: 884, scale: 1, css, body: phones, background: '#C9CFD8' };
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });

export { tones };
