import { card, esc, headline, phone, phoneGeometry, SCREEN, statusBar, styleOf, text } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { burst, character, colors as c, confetti, foodSvg, halftone, halftoneDisc, resetIds, zigzagBand } from './art.mjs';
import { renderScreen, screenOrder } from './screens.mjs';

const fonts = ['400 20px "Bangers"', '500 16px "Figtree"', '700 16px "Figtree"', '800 16px "Figtree"'];

const css = `
.ch{font-family:'Bangers',cursive;font-weight:400;line-height:1.2;letter-spacing:.015em;text-transform:uppercase;color:${c.kontur};padding-top:.08em}
.c-ground{position:absolute;left:0;top:0;overflow:hidden}
.c-layer{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}
.c-phone{box-shadow:0 0 0 3.5px ${c.kontur}}
.c-phone .kit-phone__glass{box-shadow:0 0 0 2.5px ${c.kontur};background:${c.krem}}
.c-phone .kit-phone__btn{background:${c.kontur}}
.c-dev{box-shadow:0 0 0 3px ${c.kontur};background:${c.krem}}
.c-panel{position:absolute;overflow:hidden;border:4px solid ${c.kontur};border-radius:4px}
.c-caption{position:absolute;padding:12px 16px 10px;background:${c.musztarda};border:3.5px solid ${c.kontur}}
.c-sfx{position:absolute;font-family:'Bangers',cursive;line-height:1;letter-spacing:.02em;color:${c.biel};-webkit-text-stroke:0;text-shadow:none;white-space:nowrap}
.c-recipe{position:absolute;background:${c.biel};border:3px solid ${c.kontur};border-radius:10px;font-family:'Figtree',sans-serif;color:${c.kontur}}
.c-times{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Bangers',cursive;line-height:1;color:${c.kontur};text-align:center}
`;

const ground = (W, H, color = c.krem) => `<div class="c-ground" style="${styleOf({ width: W, height: H, background: color })}"></div>`;

const layer = (W, H, inner, id = '') => `<svg class="c-layer"${id ? ` id="${id}"` : ''} width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${inner}</svg>`;

const deviceRect = (store, { width, x, y, rotate = 0 }) => {
  const h = store === 'appstore' ? phoneGeometry(width).height : (SCREEN.height * width) / SCREEN.width;
  const a = (Math.abs(rotate) * Math.PI) / 180;
  const bw = width * Math.cos(a) + h * Math.sin(a);
  const bh = width * Math.sin(a) + h * Math.cos(a);
  return { x: x + width / 2 - bw / 2, y: y + h / 2 - bh / 2, w: bw, h: bh };
};

const grow = (r, m) => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m });

const device = (store, { screen, width, x, y, rotate = 0, name }) =>
  store === 'appstore'
    ? phone({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: 'c-phone', body: c.biel, statusColor: c.kontur })
    : card({ screen, width, x, y, rotate, name, box: 'device', shadow: false, className: 'c-dev', statusColor: c.kontur, radius: 16 });

const bubbleHead = ({ value, lang, x, y, w, size, name, align = 'center' }) => headline({ value, lang, x, y, width: w, size, className: 'ch', name, align });

function pageComic(cfg) {
  window.wzReady = (async () => {
    await Promise.all(cfg.fonts.map(spec => document.fonts.load(spec)));
    await document.fonts.ready;
    const NS = 'http://www.w3.org/2000/svg';
    const layer = document.getElementById('bubbles');
    const problems = [];
    const bubbleRects = [];
    for (const b of cfg.bubbles) {
      const el = document.querySelector(b.q);
      if (!el) throw new Error(`bubble target ${b.q} missing`);
      const range = document.createRange();
      range.selectNodeContents(el);
      const tr = range.getBoundingClientRect();
      const left = tr.left - b.padX;
      const right = tr.right + b.padX;
      const top = tr.top - b.padTop;
      const bottom = tr.bottom + b.padBottom;
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const n = b.n ?? 4;
      const k = Math.pow(2, 1 / n);
      const a = ((right - left) / 2) * k;
      const bb = ((bottom - top) / 2) * k;
      const pt = t => {
        const ct = Math.cos(t);
        const st = Math.sin(t);
        return [cx + a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), cy + bb * Math.sign(st) * Math.pow(Math.abs(st), 2 / n)];
      };
      const fmt = p => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
      let d;
      const steps = 160;
      if (b.tail) {
        const [tx, ty] = b.tail;
        const ang = Math.atan2((ty - cy) / bb, (tx - cx) / a);
        const w = b.tailWidth ?? 0.2;
        const pts = [];
        for (let i = 0; i <= steps; i += 1) pts.push(pt(ang + w + ((2 * Math.PI - 2 * w) * i) / steps));
        const end = pts[pts.length - 1];
        const start = pts[0];
        const bend = b.bend ?? 0.18;
        const mx = (end[0] + tx) / 2 + (ty - end[1]) * bend;
        const my = (end[1] + ty) / 2 - (tx - end[0]) * bend;
        const mx2 = (start[0] + tx) / 2 + (ty - start[1]) * bend * 0.6;
        const my2 = (start[1] + ty) / 2 - (tx - start[0]) * bend * 0.6;
        d = `M${pts.map(fmt).join(' L')} Q${mx.toFixed(2)} ${my.toFixed(2)} ${tx} ${ty} Q${mx2.toFixed(2)} ${my2.toFixed(2)} ${fmt(start)} Z`;
      } else {
        const pts = [];
        for (let i = 0; i < steps; i += 1) pts.push(pt((2 * Math.PI * i) / steps));
        d = `M${pts.map(fmt).join(' L')} Z`;
      }
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('data-box', 'fg');
      g.setAttribute('data-name', `bubble-${b.name}`);
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', b.fill ?? '#FFFFFF');
      path.setAttribute('stroke', '#1A1714');
      path.setAttribute('stroke-width', String(b.stroke ?? 4));
      path.setAttribute('stroke-linejoin', 'round');
      g.appendChild(path);
      layer.appendChild(g);
      const body = { left: cx - a, right: cx + a, top: cy - bb, bottom: cy + bb };
      bubbleRects.push({ name: b.name, r: g.getBoundingClientRect(), body });
    }
    const box = el => el.getBoundingClientRect();
    const hit = (a, b, m = 0) => a.left < b.right + m && a.right > b.left - m && a.top < b.bottom + m && a.bottom > b.top - m;
    const kept = [];
    for (const el of [...document.querySelectorAll('[data-pattern]')]) {
      const r = box(el);
      const clash = bubbleRects.some(b => hit(r, b.r, 8)) || kept.some(k => hit(r, k, 10)) || kept.length >= cfg.count;
      if (clash) el.remove();
      else kept.push(r);
    }
    const devices = [...document.querySelectorAll('[data-box="device"]')].map(box);
    const patterns = [...document.querySelectorAll('[data-pattern]')].map(el => ({ name: el.getAttribute('data-pattern'), r: box(el) }));
    const chars = [...document.querySelectorAll('.c-char')].map(el => ({ name: el.getAttribute('data-name'), r: box(el) }));
    for (const p of patterns) {
      for (const d of devices) if (hit(p.r, d, cfg.margin)) problems.push(`pattern ${p.name} at ${Math.round(p.r.left)},${Math.round(p.r.top)} inside the device margin`);
      for (const b of bubbleRects) if (hit(p.r, b.r, 6)) problems.push(`pattern ${p.name} at ${Math.round(p.r.left)},${Math.round(p.r.top)} touches bubble ${b.name}`);
      for (const ch of chars) if (hit(p.r, ch.r, 2)) problems.push(`pattern ${p.name} at ${Math.round(p.r.left)},${Math.round(p.r.top)} touches ${ch.name}`);
    }
    for (const b of bubbleRects) {
      for (const d of devices) if (!cfg.allowBubbleOverDevice && hit(b.body, d, 6)) problems.push(`bubble ${b.name} overlaps a device`);
      if (b.r.left < 4 || b.r.top < 4 || b.r.right > cfg.W - 4 || b.r.bottom > cfg.H - 4) problems.push(`bubble ${b.name} leaves the frame`);
    }
    for (const ch of chars) for (const d of devices) if (!cfg.overlapChars?.includes(ch.name) && hit(ch.r, d, 4)) problems.push(`character ${ch.name} overlaps a device`);
    if (problems.length > 0) {
      if (cfg.soft) document.body.setAttribute('data-problems', problems.join('; '));
      else console.error(`comic layout: ${problems.join('; ')}`);
    }
  })();
}

const script = cfg => `<script>(${pageComic.toString()})(${JSON.stringify({ ...cfg, soft: process.env.CHOCHLA_SOFT === '1' })});</script>`;

const times = ({ x, y, r, fill, label, sub, size }) =>
  `<div data-box="fg" data-name="times-${esc(label)}" style="${styleOf({ position: 'absolute', left: x - r - 4, top: y - r - 4, width: 2 * r + 8, height: 2 * r + 8 })}">${layer(2 * r + 8, 2 * r + 8, halftoneDisc({ cx: r + 4, cy: r + 4, r, fill }))}<div class="c-times" style="${styleOf({ left: 0, top: 0, width: 2 * r + 8, height: 2 * r + 8 })}"><span style="${styleOf({ 'font-size': size, color: c.kontur, 'padding-top': size * 0.08, background: c.biel, border: `3px solid ${c.kontur}`, 'border-radius': 12, padding: `${size * 0.12}px ${size * 0.18}px ${size * 0.02}px` })}">${esc(label)}</span><span style="${styleOf({ 'margin-top': 6, 'font-family': "'Figtree',sans-serif", 'font-weight': '800', 'font-size': size * 0.26, background: c.kontur, color: c.krem, padding: '3px 8px', 'border-radius': 6, 'white-space': 'nowrap' })}">${esc(sub)}</span></div></div>`;

const recipeCard = ({ x, y, w, h, rotate, title, line, kind, lang, size, name }) =>
  `<div class="c-recipe" data-box="fg" data-name="${name}" style="${styleOf({ left: x, top: y, width: w, height: h, transform: `rotate(${rotate}deg)`, padding: `${size * 0.7}px ${size * 0.75}px` })}"><div style="${styleOf({ display: 'flex', 'justify-content': 'center' })}">${foodSvg(kind, size * 4.2)}</div><div style="${styleOf({ 'margin-top': size * 0.3, 'font-weight': '800', 'font-size': size, 'line-height': '1.15', 'text-wrap': 'balance' })}">${text(title, lang)}</div><div style="${styleOf({ 'margin-top': size * 0.25, 'font-weight': '500', 'font-size': size * 0.78, 'line-height': '1.3', color: c.szary })}">${text(line, lang)}</div></div>`;

const sfx = ({ x, y, value, size, rotate = -8, name }) =>
  `<div class="c-sfx" data-box="fg" data-name="${name}" style="${styleOf({ left: x, top: y, 'font-size': size, transform: `rotate(${rotate}deg)` })}"><svg width="0" height="0" style="position:absolute"></svg><span style="${styleOf({ position: 'relative', 'paint-order': 'stroke fill', '-webkit-text-stroke': `${size * 0.14}px ${c.kontur}` })}">${esc(value)}</span></div>`;

const frames = {
  appstore: {
    W: 440,
    H: 956,
    head: 44,
    margin: 16,
  },
  play: {
    W: 360,
    H: 640,
    head: 29,
    margin: 12,
  },
};

const compose = (app, store, lang, slotIndex, variant) => {
  resetIds();
  const F = frames[store];
  const { W, H, head } = F;
  const play = store === 'play';
  const copy = app.copy[lang];
  const data = copy.ui;
  const notes = copy.notes;
  const slot = variant === 'b' ? copy.variantB : copy.slots[slotIndex];
  const screenId = slot.screen;
  const value = slot.headline;
  const n = variant === 'b' ? 'b' : String(slotIndex + 1);
  const s = play ? W / 440 : 1;
  const screen = renderScreen(screenId, data, { lang, store });
  const parts = [];
  const back = [];
  const front = [];
  const bubbles = [];
  const avoid = [];
  const chars = [];
  let groundColor = c.krem;
  let confettiSpec = { count: play ? 11 : 14, size: play ? [14, 24] : [18, 30] };
  const overlapChars = [];

  const addDevice = spec => {
    const rect = deviceRect(store, spec);
    avoid.push(grow(rect, F.margin));
    return { html: device(store, { ...spec, screen, name: `device-${n}` }), rect };
  };
  const addChar = (kind, spec) => {
    const ch = character(kind, { ...spec, name: `${kind}-${n}` });
    avoid.push(grow(ch.rect, 4));
    chars.push(ch.html);
    return ch;
  };
  const addHead = (spec, zone) => {
    front.push(bubbleHead({ value, lang, ...spec, size: spec.size ?? head, name: `headline-${n}` }));
    if (zone) avoid.push(zone);
  };
  const addBubble = (b, tail) => bubbles.push({ q: `[data-name="headline-${n}"]`, name: n, padX: b.padX ?? 18 * s, padTop: b.padTop ?? 14 * s, padBottom: b.padBottom ?? 10 * s, n: b.n ?? 4, tail, tailWidth: b.tailWidth, bend: b.bend, stroke: play ? 3.2 : 4, fill: b.fill });

  const key = variant === 'b' ? 'b' : screenId;
  let dev;
  if (key === 'tydzien') {
    back.push(layer(W, H, zigzagBand({ x0: -30, y0: H * 0.69, x1: W + 30, y1: H * 0.5, height: 128 * s, teeth: 9 })));
    dev = addDevice(play ? { width: 196, x: 18, y: 214 } : { width: 270, x: 24, y: 322 });
    const tom = addChar('tomato', play ? { x: 238, y: 148, size: 110, point: 200 } : { x: 306, y: 222, size: 132, point: 200 });
    addHead(play ? { x: 36, y: 34, w: 288 } : { x: 40, y: 60, w: 360 }, play ? { x: 0, y: 0, w: W, h: 200 } : { x: 0, y: 0, w: 300, h: 230 });
    addBubble({ padX: 10 * s, n: 6 }, [Math.round(tom.mouth[0] - 4 * s), Math.round(tom.rect.y + 6 * s)]);
  } else if (key === 'zakupy') {
    groundColor = c.biel;
    const gut = 14 * s;
    const split = play ? 208 : 318;
    back.push(`<div class="c-panel" style="${styleOf({ left: gut, top: gut, width: W - 2 * gut, height: split - gut, background: c.roz })}">${layer(W, H, `<defs>${halftone({ id: 'p2', color: c.kontur, step: 10, dot: 2.4, opacity: 0.16 })}</defs><rect width="${W}" height="${H}" fill="url(#p2)"/>`)}</div>`);
    back.push(`<div class="c-panel" style="${styleOf({ left: gut, top: split + gut * 0.7, width: W - 2 * gut, height: H - split - gut * 1.7, background: c.turkus })}">${layer(W, H, `<defs>${halftone({ id: 'p2b', color: c.kontur, step: 10, dot: 2.4, opacity: 0.14 })}</defs><rect width="${W}" height="${H}" fill="url(#p2b)"/>`)}</div>`);
    dev = addDevice(play ? { width: 186, x: 87, y: 238 } : { width: 266, x: 87, y: 356 });
    const list = addChar('list', play ? { x: 24, y: 96, size: 100 } : { x: 34, y: 150, size: 140 });
    addHead(play ? { x: 132, y: 40, w: 190 } : { x: 172, y: 62, w: 214 }, null);
    addBubble({ n: 5, padX: 14 * s }, [Math.round(list.rect.x + list.rect.w * 0.84), Math.round(list.rect.y + list.rect.h * 0.3)]);
    confettiSpec = null;
  } else if (key === 'lodowka') {
    back.push(layer(W, H, `<circle cx="${W / 2}" cy="${play ? 404 : 640}" r="${play ? 158 : 222}" fill="${c.kobalt}" stroke="${c.kontur}" stroke-width="4"/>`));
    dev = addDevice(play ? { width: 186, x: 87, y: 196 } : { width: 220, x: 110, y: 366 });
    const egg = addChar('egg', play ? { x: 2, y: 136, size: 78, point: 20 } : { x: 2, y: 252, size: 104, point: 20 });
    addChar('zucchini', play ? { x: 4, y: 470, size: 78, point: -20 } : { x: 0, y: 680, size: 100, point: -20 });
    addChar('cheese', play ? { x: 282, y: 250, size: 74, flip: true, point: 180 } : { x: 336, y: 424, size: 100, flip: true, point: 180 });
    addChar('onion', play ? { x: 284, y: 500, size: 72, point: 200 } : { x: 340, y: 752, size: 96, point: 200 });
    addHead(play ? { x: 60, y: 30, w: 240 } : { x: 60, y: 62, w: 320 }, play ? { x: 0, y: 0, w: W, h: 150 } : { x: 0, y: 0, w: W, h: 250 });
    addBubble({}, [Math.round(egg.mouth[0] + 8 * s), Math.round(egg.rect.y + 6 * s)]);
  } else if (key === 'przepis') {
    dev = addDevice(play ? { width: 186, x: 160, y: 168 } : { width: 252, x: 172, y: 284 });
    const pier = addChar('pierog', play ? { x: 12, y: 106, size: 104 } : { x: 10, y: 214, size: 140 });
    front.push(times(play ? { x: 78, y: 300, r: 52, fill: c.musztarda, label: notes.times[0], sub: notes.timesLabel[0], size: 40 } : { x: 92, y: 470, r: 72, fill: c.musztarda, label: notes.times[0], sub: notes.timesLabel[0], size: 54 }));
    front.push(times(play ? { x: 86, y: 444, r: 60, fill: c.pomidor, label: notes.times[1], sub: notes.timesLabel[1], size: 46 } : { x: 98, y: 680, r: 84, fill: c.pomidor, label: notes.times[1], sub: notes.timesLabel[1], size: 62 }));
    avoid.push(play ? { x: 18, y: 240, w: 140, h: 270 } : { x: 10, y: 390, w: 180, h: 390 });
    addHead(play ? { x: 64, y: 22, w: 232 } : { x: 46, y: 58, w: 348 }, play ? { x: 0, y: 0, w: W, h: 100 } : { x: 0, y: 0, w: W, h: 200 });
    addBubble({}, [Math.round(pier.mouth[0] + 6 * s), Math.round(pier.rect.y + 10 * s)]);
  } else if (key === 'gotowanie') {
    const spec = play ? { width: 188, x: 140, y: 196, rotate: 5 } : { width: 250, x: 174, y: 300, rotate: 5 };
    const timerY = spec.y + deviceRect(store, spec).h * 0.55;
    back.push(layer(W, H, burst({ cx: spec.x + spec.width / 2, cy: timerY, r: play ? 200 : 280, inner: play ? 140 : 196, spikes: 18, fill: c.musztarda, seed: 7 }) + burst({ cx: spec.x + spec.width / 2, cy: timerY, r: play ? 150 : 210, inner: play ? 112 : 158, spikes: 14, fill: c.pomidor, seed: 9 })));
    dev = addDevice(spec);
    const pan = addChar('pan', play ? { x: 10, y: 120, size: 100 } : { x: 4, y: 192, size: 142 });
    front.push(sfx(play ? { x: 10, y: 300, value: notes.burst, size: 46, name: 'sfx' } : { x: 14, y: 470, value: notes.burst, size: 66, name: 'sfx' }));
    addHead(play ? { x: 104, y: 26, w: 222 } : { x: 118, y: 54, w: 256 }, play ? { x: 0, y: 0, w: W, h: 120 } : { x: 0, y: 0, w: W, h: 200 });
    addBubble({}, [Math.round(pan.rect.x + pan.rect.w * 0.5), Math.round(pan.rect.y + 4 * s)]);
    confettiSpec = { count: play ? 6 : 8, size: confettiSpec.size, edge: play ? 60 : 80 };
  } else if (key === 'kolekcje') {
    groundColor = c.biel;
    const gut = 14 * s;
    const capH = play ? 96 : 160;
    const rowH = play ? 196 : 300;
    const top2 = gut + capH + gut * 0.6;
    const half = (W - 3 * gut) / 2;
    back.push(`<div class="c-panel" style="${styleOf({ left: gut, top: top2, width: half, height: rowH, background: c.musztarda })}"></div>`);
    back.push(`<div class="c-panel" style="${styleOf({ left: 2 * gut + half, top: top2, width: half, height: rowH, background: c.roz })}"></div>`);
    const top3 = top2 + rowH + gut * 0.6;
    const spec = play ? { width: 200, x: 80, y: top3 + 22 } : { width: 280, x: 80, y: top3 + 28 };
    back.push(`<div class="c-panel" data-name="panel-3" style="${styleOf({ left: gut, top: top3, width: W - 2 * gut, height: H - top3 - gut, background: c.kobalt })}">${layer(W, H, `<defs>${halftone({ id: 'p6', color: c.biel, step: 11, dot: 2.4, opacity: 0.22 })}</defs><rect width="${W}" height="${H}" fill="url(#p6)"/>`)}<div style="${styleOf({ position: 'absolute', left: -gut - 4, top: -top3 - 4, width: W, height: H })}">${device(store, { ...spec, screen, name: `device-${n}` })}</div></div>`);
    const cs = play ? 13 : 18;
    notes.cards.forEach((cardSpec, i) => {
      const cw = half - (play ? 28 : 40);
      front.push(recipeCard({ x: gut + (play ? 14 : 20) + i * (half + gut), y: top2 + (play ? 18 : 26), w: cw, h: rowH - (play ? 34 : 52), rotate: i ? 3 : -3, title: cardSpec.title, line: cardSpec.line, kind: cardSpec.food, lang, size: cs, name: `recipe-${i + 1}` }));
    });
    front.push(`<div class="c-caption" style="${styleOf({ left: gut, top: gut, width: W - 2 * gut, height: capH })}"></div>`);
    addHead(play ? { x: gut + 14, y: gut + 14, w: W - 2 * gut - 28, align: 'left' } : { x: gut + 22, y: gut + 22, w: W - 2 * gut - 44, align: 'left' }, null);
    confettiSpec = null;
  } else if (key === 'b') {
    groundColor = c.roz;
    back.push(layer(W, H, `<defs>${halftone({ id: 'pb', color: c.kontur, step: 12, dot: 2.6, opacity: 0.12 })}</defs><rect width="${W}" height="${H}" fill="url(#pb)"/>`));
    dev = addDevice(play ? { width: 190, x: 154, y: 196 } : { width: 256, x: 174, y: 312 });
    const pot = addChar('pot', play ? { x: 10, y: 200, size: 130 } : { x: 6, y: 330, size: 156 });
    addHead(play ? { x: 30, y: 26, w: 300 } : { x: 40, y: 58, w: 360 }, play ? { x: 0, y: 0, w: W, h: 170 } : { x: 0, y: 0, w: W, h: 270 });
    addBubble({}, [Math.round(pot.mouth[0]), Math.round(pot.rect.y + 2 * s)]);
    confettiSpec = { ...confettiSpec, kindsOf: ['question', 'triangle', 'dots'] };
  }

  parts.push(ground(W, H, groundColor));
  parts.push(back.join(''));
  if (confettiSpec) {
    const pieces = confetti({ w: W, h: H, seed: 11 + slotIndex * 7 + (variant === 'b' ? 50 : 0) + (play ? 3 : 0), count: confettiSpec.count * 3, size: confettiSpec.size, avoid, edge: confettiSpec.edge, ...(confettiSpec.kindsOf ? { kindsOf: confettiSpec.kindsOf } : {}) });
    parts.push(layer(W, H, pieces));
  }
  if (dev) parts.push(dev.html);
  parts.push(chars.join(''));
  parts.push(layer(W, H, '', 'bubbles'));
  parts.push(front.join(''));
  parts.push(script({ fonts, bubbles, margin: F.margin, W, H, overlapChars, count: confettiSpec?.count ?? 0 }));
  return parts.join('');
};

const featureBody = (app, lang) => {
  resetIds();
  const copy = app.copy[lang];
  const W = 512;
  const H = 250;
  const tom = character('tomato', { x: 330, y: 92, size: 86, name: 'f-tomato' });
  const pier = character('pierog', { x: 396, y: 132, size: 78, name: 'f-pierog' });
  const egg = character('egg', { x: 440, y: 78, size: 66, name: 'f-egg' });
  const avoid = [grow(tom.rect, 4), grow(pier.rect, 4), grow(egg.rect, 4), { x: 20, y: 20, w: 250, h: 200 }, { x: 200, y: 90, w: 112, h: 70 }];
  const pieces = confetti({ w: W, h: H, seed: 91, count: 40, size: [12, 20], avoid, edge: 40 });
  return `${ground(W, H)}${layer(W, H, pieces)}${tom.html}${pier.html}${egg.html}${layer(W, H, '', 'bubbles')}
<div class="fg-wrap" style="left:60px;top:34px;width:170px"><div class="fg-name" data-box="headline" data-name="feature-name">${esc(app.name)}</div><div class="ch fg-h" data-box="headline" data-name="feature-tagline">${text(copy.feature.headline, lang)}</div></div>
${script({ fonts, bubbles: [{ q: '.fg-wrap', name: 'feature', padX: 14, padTop: 6, padBottom: 10, n: 4, tail: [Math.round(tom.rect.x + 12), Math.round(tom.rect.y + 44)], tailWidth: 0.16, stroke: 3.5 }], margin: 0, W, H, count: 16 })}`;
};

const featureCss = `
.fg-wrap{position:absolute}
.fg-name{position:relative;font-family:'Bangers',cursive;font-size:54px;line-height:1.1;letter-spacing:.02em;color:${c.pomidor};padding-top:.06em;-webkit-text-stroke:0}
.fg-h{position:relative;font-size:19px;line-height:1.15;text-wrap:balance;hyphens:none}
`;

export const iconSvg = (layerName = 'full', size = 1024) => {
  const s = size / 1024;
  const bg = `<rect width="${size}" height="${size}" fill="${c.pomidor}"/><g transform="scale(${s}) translate(512 512) scale(.9) translate(-540 -470)">${[
    [262, 386],
    [372, 268],
    [492, 372],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="50" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="20"/>`)
    .join('')}</g>`;
  const ladle = `<path d="M812 150 L652 610" stroke="${c.kontur}" stroke-width="112" stroke-linecap="round"/><path d="M812 150 L652 610" stroke="${c.kobalt}" stroke-width="64" stroke-linecap="round"/><circle cx="806" cy="170" r="16" fill="${c.kontur}"/><path d="M226 600 H694 A234 234 0 0 1 226 600 Z" fill="${c.kobalt}" stroke="${c.kontur}" stroke-width="24" stroke-linejoin="round"/><ellipse cx="460" cy="600" rx="234" ry="62" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="24"/><path d="M300 700 Q340 790 440 808" fill="none" stroke="${c.biel}" stroke-width="24" stroke-linecap="round" opacity=".85"/>`;
  const fg = `<g transform="scale(${s}) translate(512 512) scale(.9) translate(-540 -470)">${ladle}</g>`;
  const content = layerName === 'background' ? bg : layerName === 'foreground' ? fg : bg + fg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${content}</svg>`;
};

export const jobs = app => {
  const list = [];
  for (const lang of ['pl', 'en']) {
    for (const store of ['appstore', 'play']) {
      const F = frames[store];
      const spec = stores[store].css;
      for (let i = 0; i < 6; i += 1) {
        const slot = String(i + 1).padStart(2, '0');
        list.push({ id: `${store}-${lang}-${slot}`, store, lang, width: F.W, height: F.H, scale: spec.scale, css, body: compose(app, store, lang, i), outputs: [{ slot, frame: 0 }] });
      }
      list.push({ id: `${store}-${lang}-01b`, store, lang, variant: 'b', width: F.W, height: F.H, scale: spec.scale, css, body: compose(app, store, lang, 0, 'b'), outputs: [{ slot: '01', variant: 'b', frame: 0 }] });
    }
    list.push({ id: `feature-${lang}`, store: 'feature', lang, width: 512, height: 250, scale: 2, css: css + featureCss, body: featureBody(app, lang), outputs: [{ slot: 'feature', frame: 0 }] });
  }
  return list;
};

export const sheets = app =>
  ['pl', 'en'].map(lang => {
    const data = app.copy[lang].ui;
    const body = screenOrder
      .map((id, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 3px ${c.kontur}"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: c.kontur })}${renderScreen(id, data, { lang, store: 'appstore' })}</div></div>`)
      .join('');
    return { id: `ui-${lang}`, lang, width: 20 + screenOrder.length * 410, height: 884, scale: 1, css, body, background: '#E9E2D2' };
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });
