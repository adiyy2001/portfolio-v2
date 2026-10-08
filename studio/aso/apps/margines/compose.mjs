import { card, esc, headline, phone, phoneGeometry, SCREEN, statusBar, styleOf, text } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { arrowHead, inkScript, inkShapes, svgLayer } from './ink.mjs';
import { colors as c, doodle, hintCard, icons, renderScreen, screenOrder } from './screens.mjs';

const fonts = ['500 20px "Caveat"', '600 20px "Caveat"', '700 20px "Caveat"', '400 16px "Lexend"', '500 16px "Lexend"', '700 16px "Lexend"'];

const css = `
.mh{font-family:'Caveat',cursive;font-weight:700;line-height:.96;letter-spacing:-.005em;color:${c.atrament}}
.m-ground{position:absolute;left:0;top:0;overflow:hidden;background-color:${c.papier}}
.m-note{position:absolute;font-family:'Caveat',cursive;font-weight:600;line-height:1.02;color:${c.atrament};hyphens:none;text-wrap:balance}
.m-sticker{position:absolute;display:flex;align-items:center;justify-content:center;font-family:'Lexend',sans-serif;font-weight:700;color:${c.atrament};border:4px solid #fff;box-shadow:0 6px 12px -6px rgba(30,42,94,.45),0 0 0 1px rgba(30,42,94,.08);white-space:nowrap}
.m-tape{position:absolute;background:rgba(184,235,208,.82);clip-path:polygon(0 8%,4% 0,8% 10%,12% 0,16% 8%,84% 4%,88% 0,92% 10%,96% 0,100% 8%,100% 92%,96% 100%,92% 90%,88% 100%,84% 94%,16% 96%,12% 100%,8% 90%,4% 100%,0 92%)}
.m-tape--sun{background:rgba(255,228,94,.78)}
.m-pulled{position:absolute;transform-origin:50% 50%;filter:drop-shadow(0 18px 18px rgba(30,42,94,.22))}
.m-index{position:absolute;background:#fff;border-radius:6px;box-shadow:0 14px 22px -14px rgba(30,42,94,.55),0 0 0 1px #E7E2D4;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 25px,#DCE8F2 25px,#DCE8F2 26px);transform-origin:50% 100%}
.m-index::before{content:'';position:absolute;left:18px;top:0;bottom:0;width:1.5px;background:${c.flamaster};opacity:.55}
.m-scrap{position:absolute;background:#FFFEF9;box-shadow:0 18px 26px -18px rgba(30,42,94,.55),0 0 0 1px #E7E2D4;background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 33px,#C9DCEC 33px,#C9DCEC 34px)}
.m-scrap::before{content:'';position:absolute;left:30px;top:0;bottom:0;width:1.5px;background:${c.flamaster};opacity:.6}
.kit-phone__glass{background:${c.papier}}
`;

const ground = (w, h, { grid, margin }) =>
  `<div class="m-ground" style="${styleOf({
    width: w,
    height: h,
    'background-image': `linear-gradient(to right, ${c.kratka} 0, ${c.kratka} 1px, transparent 1px), linear-gradient(to bottom, ${c.kratka} 0, ${c.kratka} 1px, transparent 1px)`,
    'background-size': `${grid}px ${grid}px`,
    'background-position': `${margin % grid}px ${grid - 6}px`,
  })}"><span style="${styleOf({ position: 'absolute', left: margin, top: 0, bottom: 0, width: 1.5, background: c.flamaster, opacity: 0.5 })}"></span><span style="${styleOf({ position: 'absolute', left: margin + 4, top: 0, bottom: 0, width: 1.5, background: c.flamaster, opacity: 0.5 })}"></span></div>`;

const note = ({ id, value, lang, x, y, w, size, rotate = 0, align = 'left', color }) =>
  `<div class="m-note" id="${id}" data-box="fg" data-name="${id}" style="${styleOf({ left: x, top: y, width: w, 'font-size': size, 'text-align': align, transform: rotate ? `rotate(${rotate}deg)` : undefined, color })}">${text(value, lang)}</div>`;

const sticker = ({ id, html, x, y, w, h, rotate = 0, round = false, background = c.mieta, size = 15 }) =>
  `<div class="m-sticker" id="${id}" data-box="fg" data-name="${id}" style="${styleOf({ left: x, top: y, width: w, height: h, 'border-radius': round ? '50%' : '12px', background, transform: `rotate(${rotate}deg)`, 'font-size': size })}">${html}</div>`;

const tape = ({ x, y, w, h = 26, rotate = 0, sun = false }) => `<div class="m-tape${sun ? ' m-tape--sun' : ''}" style="${styleOf({ left: x, top: y, width: w, height: h, transform: `rotate(${rotate}deg)` })}"></div>`;

const device = (store, { screen, width, x, y, rotate = 0, name }) =>
  store === 'appstore'
    ? phone({ screen, width, x, y, rotate, name, box: 'device', statusColor: c.atrament, body: '#232A3F' })
    : card({ screen, width, x, y, rotate, name, box: 'device', statusColor: c.atrament, radius: 14 });

const deviceScale = (store, width) => (store === 'appstore' ? phoneGeometry(width).scale : width / SCREEN.width);

const deviceHeight = (store, width) => (store === 'appstore' ? phoneGeometry(width).height : (SCREEN.height * width) / SCREEN.width);

const forgettingCurve = ({ x, y, w, h, seed = 40, lang, copy, size }) => {
  const p = (fx, fy) => [x + fx * w, y + fy * h];
  const decay = (x0, x1, top, depth, k, steps = 8) => Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return p(x0 + (x1 - x0) * t, top + (depth * (1 - Math.exp(-k * t))) / (1 - Math.exp(-k)));
  });
  const first = decay(0.04, 0.5, 0.04, 0.66, 3.2);
  const second = decay(0.5, 1, 0.04, 0.34, 2.2);
  const [dx, dy] = p(0.5, 0.04);
  const shapes = [
    { t: 'line', x1: x, y1: y - 6, x2: x, y2: y + h, stroke: c.olowek, width: 1.8, seed, single: true, rough: 0.7 },
    { t: 'line', x1: x, y1: y + h, x2: x + w + 6, y2: y + h, stroke: c.olowek, width: 1.8, seed: seed + 1, single: true, rough: 0.7 },
    { t: 'curve', pts: first, stroke: c.flamaster, width: 3.2, seed: seed + 2, single: true, rough: 0.6 },
    { t: 'line', x1: first.at(-1)[0], y1: first.at(-1)[1], x2: dx, y2: dy + 4, stroke: c.flamaster, width: 3.2, seed: seed + 3, single: true, rough: 0.6 },
    { t: 'curve', pts: second, stroke: c.flamaster, width: 3.2, seed: seed + 4, single: true, rough: 0.6 },
    { t: 'ellipse', cx: dx, cy: dy + 2, w: 15, h: 15, stroke: c.atrament, width: 2.4, seed: seed + 5, fill: c.zakreslacz },
  ];
  const label = `<div class="m-note" data-box="fg" data-name="curve-label" style="${styleOf({ left: x + 8, top: y - size * 1.25, 'font-size': size * 0.9, color: c.olowek })}">${text(copy.notes['02b'], lang)}</div>`;
  return { svg: inkShapes(shapes), label, dot: { x: dx, y: dy + 2 } };
};

const pencilChart = ({ x, y, w, h, values, seed = 70, today }) => {
  const max = Math.max(...values);
  const gap = 6;
  const bw = (w - gap * (values.length - 1)) / values.length;
  const shapes = values.map((v, i) => {
    const bh = (v / max) * h;
    return { t: 'rect', x: x + i * (bw + gap), y: y + h - bh, w: bw, h: bh, stroke: c.olowek, width: 1.6, seed: seed + i, rough: 1.3, fill: i === today ? c.atrament : c.olowek, fillStyle: 'hachure', gap: 4.2, fillWeight: 1.1, angle: -45 };
  });
  shapes.push({ t: 'line', x1: x - 6, y1: y + h + 2, x2: x + w + 6, y2: y + h + 1, stroke: c.olowek, width: 1.8, seed: seed + 20, single: true });
  const avgY = y + h - (6 / max) * h;
  shapes.push({ t: 'line', x1: x - 8, y1: avgY, x2: x + w + 8, y2: avgY - 1, stroke: c.zielen, width: 2.4, seed: seed + 21, single: true, rough: 0.8 });
  return inkShapes(shapes);
};

const deckDoodle = (kind, seed) => {
  const s = { stroke: c.atrament, width: 2.4, seed, rough: 1 };
  if (kind === 'ksiazka')
    return inkShapes([
      { ...s, t: 'polygon', pts: [[8, 10], [34, 6], [34, 44], [8, 48]] },
      { ...s, t: 'polygon', pts: [[34, 6], [60, 10], [60, 48], [34, 44]], seed: seed + 1 },
      { ...s, t: 'line', x1: 14, y1: 20, x2: 28, y2: 18, width: 1.6, single: true, seed: seed + 2 },
      { ...s, t: 'line', x1: 40, y1: 18, x2: 54, y2: 20, width: 1.6, single: true, seed: seed + 3 },
    ]);
  if (kind === 'serial')
    return inkShapes([
      { ...s, t: 'rect', x: 6, y: 8, w: 54, h: 36 },
      { ...s, t: 'line', x1: 22, y1: 52, x2: 44, y2: 52, single: true, seed: seed + 1 },
      { ...s, t: 'polygon', pts: [[28, 18], [42, 26], [28, 34]], seed: seed + 2, stroke: c.flamaster },
    ]);
  return inkShapes([
    { ...s, t: 'path', d: 'M6 34 L60 18 M28 27 L20 10 M36 24 L48 40 M10 33 L8 44', seed },
    { ...s, t: 'curve', pts: [[4, 50], [20, 46], [36, 52], [62, 46]], width: 1.6, seed: seed + 1, stroke: c.olowek },
  ]);
};

const indexCard = ({ kind, label, lang, x, y, w, h, rotate, seed, name, size, art = 86, pad = 28 }) =>
  `<div class="m-index" data-box="fg" data-name="${name}" style="${styleOf({ left: x, top: y, width: w, height: h, transform: `rotate(${rotate}deg)` })}"><svg width="${art}" height="${Math.round((art * 56) / 66)}" viewBox="0 0 66 56" style="position:absolute;left:30px;top:12px" aria-hidden="true">${deckDoodle(kind, seed)}</svg><div class="m-note" style="${styleOf({ left: pad, right: 6, bottom: 8, 'font-size': size })}">${text(label, lang)}</div></div>`;

const scrap = ({ items, x, y, w, h, rotate, size, name, line = 34 }) =>
  `<div class="m-scrap" data-box="fg" data-name="${name}" style="${styleOf({ left: x, top: y, width: w, height: h, transform: `rotate(${rotate}deg)`, 'background-image': `repeating-linear-gradient(to bottom,transparent 0,transparent ${line - 1}px,#C9DCEC ${line - 1}px,#C9DCEC ${line}px)`, 'clip-path': 'polygon(0 0,100% 0,100% 100%,92% 98.5%,84% 100%,76% 98%,68% 100%,58% 98.5%,48% 100%,38% 98%,28% 100%,18% 98.5%,8% 100%,0 98.5%)' })}"><div style="${styleOf({ position: 'absolute', left: 40, top: 8, right: 10, 'font-family': "'Caveat',cursive", 'font-weight': 600, 'font-size': size, 'line-height': `${line}px`, color: c.atrament })}">${items.map(item => `<div style="white-space:nowrap">${esc(item)}</div>`).join('')}</div></div>`;

const layouts = {
  appstore: {
    W: 440,
    H: 956,
    grid: 22,
    margin: 44,
    head: 58,
    note: 27,
    frames: [
      {
        head: { x: 60, y: 54, w: 360 },
        device: { width: 290, x: 136, y: 318, rotate: 4 },
        notes: [{ id: 'note-1', key: '01', x: 12, y: 730, w: 124, rotate: -4 }],
        stickers: [{ id: 'sticker-lang', kind: 'lang', x: 118, y: 290, w: 92, h: 40, rotate: -9 }],
        marks: [
          { t: 'circle', q: '[data-mark="sentence"]', dev: true, color: c.flamaster, padX: 16, padY: 3, grow: 1.22, seed: 3, width: 3.4 },
          { t: 'arrow', from: { q: '#note-1', side: 'top', gap: 6, dx: 10 }, to: { q: '[data-mark="sentence"]', dev: true, side: 'left', gap: 26, dy: 20 }, color: c.flamaster, seed: 5, width: 3, bend: -0.25 },
        ],
      },
      {
        head: { x: 60, y: 772, w: 360 },
        device: { width: 282, x: 20, y: 54, rotate: -3 },
        curve: { x: 324, y: 236, w: 100, h: 110 },
        notes: [{ id: 'note-2', key: '02', x: 318, y: 384, w: 116, rotate: 3 }],
        marks: [
          { t: 'highlight', q: '[data-mark="set"]', dev: true, color: c.zakreslacz, padX: 8, padY: 2, seed: 9 },
          { t: 'arrow', from: { q: '#note-2', side: 'bottom', gap: 8, dx: -20 }, to: { q: '[data-mark="next"]', dev: true, side: 'right', gap: 6 }, color: c.flamaster, seed: 12, width: 3, bend: -0.3 },
        ],
      },
      {
        head: { x: 60, y: 54, w: 360 },
        device: { width: 236, x: 22, y: 556, rotate: -5, hideHint: true },
        hint: { x: 128, y: 262, scale: 1.1, rotate: 3, tapes: [{ x: 110, y: 256, w: 92, rotate: -28 }, { x: 352, y: 244, w: 84, rotate: 30, sun: true }] },
        notes: [{ id: 'note-3', key: '03', x: 286, y: 640, w: 140, rotate: -3 }],
        marks: [{ t: 'arrow', from: { q: '#note-3', side: 'bottom', gap: 8, dx: -10 }, to: { q: '[data-mark="hint"]', dev: true, side: 'right', gap: 10, dy: -40 }, color: c.flamaster, seed: 21, width: 3, bend: -0.35 }],
      },
      {
        head: { x: 40, y: 54, w: 360, align: 'center' },
        device: { width: 280, x: 80, y: 330, rotate: 0 },
        notes: [{ id: 'note-4', key: '04', x: 236, y: 230, w: 190, rotate: -3, align: 'right' }],
        stickers: [{ id: 'sticker-plus', kind: 'plus', w: 50, h: 50, rotate: -12, place: { q: '[data-mark="addbtn"]', dev: true, side: 'left', dx: -4 } }],
        marks: [
          { t: 'underline', q: '[data-mark="word"]', dev: true, color: c.flamaster, double: true, off: 4, gap: 8, ext: 4, seed: 31, width: 2.6 },
          { t: 'arrow', from: { q: '#note-4', side: 'bottom', gap: 6, dx: 50 }, to: { q: '[data-mark="addbtn"]', dev: true, side: 'right', gap: 8 }, color: c.flamaster, seed: 33, width: 3, bend: -0.22 },
        ],
      },
      {
        head: { x: 60, y: 54, w: 360 },
        device: { width: 284, x: 146, y: 270, rotate: 3 },
        pencil: { x: 24, y: 560, w: 104, h: 96 },
        notes: [{ id: 'note-5', key: '05', x: 8, y: 390, w: 130, rotate: -3 }],
        marks: [
          { t: 'circle', q: '[data-mark="avg"]', dev: true, color: c.zielen, padX: 12, padY: 5, grow: 1.04, seed: 41, width: 3.4 },
          { t: 'arrow', from: { q: '#note-5', side: 'right', gap: 4, dy: -6 }, to: { q: '[data-mark="avg"]', dev: true, side: 'left', gap: 16 }, color: c.zielen, seed: 43, width: 3, bend: -0.25 },
        ],
      },
      {
        head: { x: 60, y: 54, w: 360 },
        device: { width: 272, x: 154, y: 420, rotate: 5 },
        decks: [
          { kind: 'ksiazka', x: 28, y: 300, rotate: -12 },
          { kind: 'serial', x: 146, y: 262, rotate: -2 },
          { kind: 'wyjazd', x: 276, y: 284, rotate: 9 },
        ],
        deckSize: { w: 140, h: 132, label: 25 },
        marks: [],
      },
    ],
    variantB: {
      head: { x: 60, y: 54, w: 360 },
      device: { width: 252, x: 182, y: 470, rotate: 4 },
      scrap: { x: 16, y: 226, w: 236, h: 252, rotate: -4, size: 23 },
      notes: [{ id: 'note-b', key: 'b', x: 14, y: 572, w: 124, rotate: -3 }],
      marks: [{ t: 'arrow', from: { q: '[data-name="scrap"]', side: 'bottom', gap: 6, dx: 60 }, to: { q: '[data-mark="list"]', dev: true, side: 'left', gap: 8, dy: -40 }, color: c.flamaster, seed: 51, width: 3.2, bend: 0.3 }],
    },
  },
  play: {
    W: 360,
    H: 640,
    grid: 18,
    margin: 34,
    head: 38,
    note: 22,
    frames: [
      {
        head: { x: 46, y: 26, w: 300 },
        device: { width: 198, x: 144, y: 174, rotate: 4 },
        notes: [{ id: 'note-1', key: '01', x: 8, y: 470, w: 112, rotate: -4 }],
        stickers: [{ id: 'sticker-lang', kind: 'lang', x: 124, y: 156, w: 74, h: 32, rotate: -9 }],
        marks: [
          { t: 'circle', q: '[data-mark="sentence"]', dev: true, color: c.flamaster, padX: 12, padY: 2, grow: 1.22, seed: 3, width: 2.8 },
          { t: 'arrow', from: { q: '#note-1', side: 'top', gap: 6, dx: 10 }, to: { q: '[data-mark="sentence"]', dev: true, side: 'left', gap: 22, dy: 18 }, color: c.flamaster, seed: 5, width: 2.6, bend: -0.25, head: 12 },
        ],
      },
      {
        head: { x: 46, y: 512, w: 300 },
        device: { width: 200, x: 12, y: 30, rotate: -3 },
        curve: { x: 236, y: 132, w: 100, h: 92 },
        notes: [{ id: 'note-2', key: '02', x: 222, y: 250, w: 126, rotate: 3 }],
        marks: [
          { t: 'highlight', q: '[data-mark="set"]', dev: true, color: c.zakreslacz, padX: 6, padY: 2, seed: 9 },
          { t: 'arrow', from: { q: '#note-2', side: 'bottom', gap: 6, dx: -20 }, to: { q: '[data-mark="next"]', dev: true, side: 'right', gap: 5 }, color: c.flamaster, seed: 12, width: 2.6, bend: -0.3, head: 12 },
        ],
      },
      {
        head: { x: 46, y: 26, w: 300 },
        device: { width: 160, x: 16, y: 330, rotate: -5, hideHint: true },
        hint: { x: 104, y: 150, scale: 0.86, rotate: 3, tapes: [{ x: 92, y: 148, w: 70, h: 22, rotate: -28 }, { x: 290, y: 140, w: 64, h: 22, rotate: 30, sun: true }] },
        notes: [{ id: 'note-3', key: '03', x: 200, y: 418, w: 148, rotate: -3 }],
        marks: [{ t: 'arrow', from: { q: '#note-3', side: 'bottom', gap: 6, dx: -20 }, to: { q: '[data-mark="hint"]', dev: true, side: 'right', gap: 8, dy: -20 }, color: c.flamaster, seed: 21, width: 2.6, bend: -0.35, head: 12 }],
      },
      {
        head: { x: 30, y: 26, w: 300, align: 'center' },
        device: { width: 196, x: 82, y: 210, rotate: 0 },
        notes: [{ id: 'note-4', key: '04', x: 196, y: 150, w: 156, rotate: -3, align: 'right' }],
        stickers: [{ id: 'sticker-plus', kind: 'plus', w: 36, h: 36, rotate: -12, place: { q: '[data-mark="addbtn"]', dev: true, side: 'left', dx: -3 } }],
        marks: [
          { t: 'underline', q: '[data-mark="word"]', dev: true, color: c.flamaster, double: true, off: 3, gap: 6, ext: 3, seed: 31, width: 2.2 },
          { t: 'arrow', from: { q: '#note-4', side: 'bottom', gap: 4, dx: 46 }, to: { q: '[data-mark="addbtn"]', dev: true, side: 'right', gap: 6 }, color: c.flamaster, seed: 33, width: 2.6, bend: -0.2, head: 12 },
        ],
      },
      {
        head: { x: 46, y: 26, w: 300 },
        device: { width: 200, x: 150, y: 180, rotate: 3 },
        pencil: { x: 26, y: 406, w: 82, h: 74 },
        notes: [{ id: 'note-5', key: '05', x: 6, y: 284, w: 120, rotate: -3 }],
        marks: [
          { t: 'circle', q: '[data-mark="avg"]', dev: true, color: c.zielen, padX: 13, padY: 5, grow: 1.04, seed: 41, width: 2.8 },
          { t: 'arrow', from: { q: '#note-5', side: 'right', gap: 4, dy: -6 }, to: { q: '[data-mark="avg"]', dev: true, side: 'left', gap: 12 }, color: c.zielen, seed: 43, width: 2.6, bend: -0.25, head: 12 },
        ],
      },
      {
        head: { x: 46, y: 26, w: 300 },
        device: { width: 196, x: 148, y: 300, rotate: 5 },
        decks: [
          { kind: 'ksiazka', x: 22, y: 196, rotate: -12 },
          { kind: 'serial', x: 128, y: 170, rotate: -2 },
          { kind: 'wyjazd', x: 234, y: 186, rotate: 9 },
        ],
        deckSize: { w: 104, h: 104, label: 18, art: 56, pad: 22 },
        marks: [],
      },
    ],
    variantB: {
      head: { x: 46, y: 26, w: 300 },
      device: { width: 180, x: 172, y: 300, rotate: 4 },
      scrap: { x: 10, y: 140, w: 210, h: 186, rotate: -4, size: 19, line: 28 },
      notes: [{ id: 'note-b', key: 'b', x: 12, y: 380, w: 140, rotate: -3 }],
      marks: [{ t: 'arrow', from: { q: '[data-name="scrap"]', side: 'bottom', gap: 6, dx: 50 }, to: { q: '[data-mark="list"]', dev: true, side: 'left', gap: 6, dy: -30 }, color: c.flamaster, seed: 51, width: 2.8, bend: 0.3, head: 12 }],
    },
  },
};

const stickerHtml = (kind, copy, store) =>
  kind === 'plus'
    ? `<svg width="${store === 'play' ? 22 : 28}" height="${store === 'play' ? 22 : 28}" viewBox="0 0 24 24" fill="none" stroke="${c.atrament}" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>`
    : esc(copy.notes.sticker);

const frameBody = (app, store, lang, spec, { slotIndex, variant }) => {
  const L = layouts[store];
  const { W, H } = L;
  const copy = app.copy[lang];
  const data = copy.ui;
  const screenId = variant === 'b' ? copy.variantB.screen : copy.slots[slotIndex].screen;
  const value = variant === 'b' ? copy.variantB.headline : copy.slots[slotIndex].headline;
  const play = store === 'play';
  const k = deviceScale(store, spec.device.width);
  const a = spec.device.rotate ?? 0;
  const parts = [ground(W, H, { grid: L.grid, margin: L.margin })];
  const behind = [];
  const front = [];
  const statics = [];
  const places = [];

  if (spec.decks) {
    const labels = copy.notes['06'];
    spec.decks.forEach((d, i) => behind.push(indexCard({ ...d, ...spec.deckSize, size: spec.deckSize.label, label: labels[i], lang, seed: 60 + i * 5, name: `deck-card-${i + 1}` })));
  }
  if (spec.scrap) {
    behind.push(scrap({ ...spec.scrap, items: data.notebook, name: 'scrap' }));
  }
  const screen = renderScreen(screenId, data, { lang, store, hideHint: spec.device.hideHint });
  const deviceHtml = device(store, { screen, width: spec.device.width, x: spec.device.x, y: spec.device.y, rotate: a, name: `device-${slotIndex + 1}` });

  if (spec.hint) {
    const h = spec.hint;
    front.push(`<div class="m-pulled" data-box="fg" data-name="hint-card" style="${styleOf({ left: h.x, top: h.y, width: 272, transform: `rotate(${h.rotate}deg) scale(${h.scale})`, 'transform-origin': '0 0' })}"><div style="padding:12px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px #E7E2D4">${hintCard(data, lang, { mark: 'hint-big', seed: 11 })}</div></div>`);
    h.tapes.forEach(t => front.push(tape(t)));
  }
  if (spec.curve) {
    const curve = forgettingCurve({ ...spec.curve, lang, copy, size: L.note });
    statics.push(curve.svg);
    front.push(curve.label);
  }
  if (spec.pencil) {
    const p = data.postep;
    statics.push(pencilChart({ ...spec.pencil, values: p.minutes, today: p.today }));
  }
  for (const n of spec.notes ?? []) front.push(note({ ...n, value: copy.notes[n.key], lang, size: L.note }));
  for (const s of spec.stickers ?? []) {
    const size = play ? 12.5 : 15;
    front.push(sticker({ ...s, x: s.x ?? 0, y: s.y ?? 0, html: stickerHtml(s.kind, copy, store), round: s.kind === 'plus', background: s.kind === 'plus' ? c.zakreslacz : c.mieta, size }));
    if (s.place) places.push({ id: s.id, to: { ...s.place, k, a } });
  }

  const marks = (spec.marks ?? []).map(m => {
    const fix = p => (p.dev ? { ...p, k, a } : p);
    if (m.t === 'arrow') return { ...m, from: fix(m.from), to: fix(m.to) };
    return fix(m);
  });

  parts.push(behind.join(''));
  parts.push(deviceHtml);
  parts.push(svgLayer(W, H, '', { style: 'mix-blend-mode:multiply' }).replace('<svg ', '<svg id="hl" '));
  parts.push(svgLayer(W, H, statics.join('')));
  parts.push(front.join(''));
  parts.push(svgLayer(W, H, '').replace('<svg ', '<svg id="ink" '));
  parts.push(headline({ value, lang, x: spec.head.x, y: spec.head.y, width: spec.head.w, size: L.head, align: spec.head.align ?? 'left', className: 'mh', name: `headline-${slotIndex + 1}` }));
  parts.push(inkScript({ fonts, marks, places }));
  return parts.join('');
};

const featureBody = (app, lang) => {
  const copy = app.copy[lang];
  const data = copy.ui;
  const W = 512;
  const H = 250;
  const k = data.card;
  const underline = inkShapes([{ t: 'curve', pts: [[64, 112], [130, 106], [196, 110], [232, 104]], stroke: c.flamaster, width: 4, seed: 81, rough: 0.8 }]);
  const arrow = inkShapes([{ t: 'curve', pts: [[244, 112], [262, 150], [298, 148]], stroke: c.flamaster, width: 3, seed: 83, single: true, rough: 0.7 }, ...arrowHead(298, 148, -10, { stroke: c.flamaster, width: 3, seed: 85, size: 12 })]);
  return `${ground(W, H, { grid: 16, margin: 30 })}
${svgLayer(W, H, underline + arrow)}
<div class="fg-name" data-box="headline" data-name="feature-name" style="left:62px;top:32px">${esc(app.name)}</div>
${headline({ value: copy.feature.headline, lang, x: 64, y: 122, width: 150, size: 24, className: 'mh fg-h', name: 'feature-tagline' })}
<div class="fg-card" data-box="fg" data-name="feature-card" style="${styleOf({ left: 300, top: 28, width: 158, transform: 'rotate(5deg)' })}"><div style="font-family:'Lexend',sans-serif;font-weight:700;font-size:16px;color:${c.atrament}">${esc(k.word)}</div><div style="font-family:'Lexend',sans-serif;font-size:10px;line-height:1.25;color:${c.olowek};margin-top:1px">${text(k.meaning, lang)}</div><div style="margin:2px 0 0 -14px">${doodle(k.doodle, { seed: 11, width: 140, height: 99 })}</div><div class="m-note" style="position:static;font-size:15px;text-align:center">${text(k.hintNote, lang)}</div></div>
${tape({ x: 338, y: 18, w: 64, h: 18, rotate: -6, sun: true })}`;
};

const featureCss = `
.fg-name{position:absolute;font-family:'Caveat',cursive;font-weight:700;font-size:62px;line-height:1;color:${c.atrament}}
.fg-h{line-height:1}
.fg-card{position:absolute;padding:12px 10px 10px 24px;border-radius:8px;background:#fff;box-shadow:0 12px 20px -12px rgba(30,42,94,.55),0 0 0 1px #E7E2D4;transform-origin:50% 50%}
.fg-card::before{content:'';position:absolute;left:14px;top:0;bottom:0;width:1.5px;background:${c.flamaster};opacity:.55}
`;

export const iconSvg = (layer = 'full', size = 1024) => {
  const s = size / 1024;
  const grid = Array.from({ length: 15 }, (_, i) => 64 + i * 64)
    .map(v => `<path d="M${v * s} 0V${size}M0 ${v * s}H${size}" stroke="${c.kratka}" stroke-width="${3 * s}" opacity=".7"/>`)
    .join('');
  const bg = `<rect width="${size}" height="${size}" fill="${c.papier}"/>${grid}`;
  const lines = [520, 610, 700].map(y => `<path d="M190 ${y}H834" stroke="#C9DCEC" stroke-width="8"/>`).join('');
  const star = inkShapes([
    { t: 'polygon', pts: [[560, 214], [600, 326], [716, 330], [626, 400], [658, 512], [560, 448], [462, 512], [494, 400], [404, 330], [520, 326]], stroke: c.atrament, width: 20, seed: 7, rough: 1.8, bow: 1.6 },
  ]);
  const cardShape = `<g transform="rotate(-6 512 512)"><rect x="150" y="214" width="724" height="604" rx="36" fill="#000" opacity=".12" transform="translate(0 26)"/><rect x="150" y="214" width="724" height="604" rx="36" fill="#fff"/>${lines}<path d="M276 214V818" stroke="${c.flamaster}" stroke-width="12" opacity=".8"/><g transform="translate(-10 40)">${star}</g></g>`;
  const fg = `<g transform="scale(${s})">${cardShape}</g>`;
  const content = layer === 'background' ? bg : layer === 'foreground' ? fg : bg + fg;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${content}</svg>`;
};

export const jobs = app => {
  const list = [];
  for (const lang of ['pl', 'en']) {
    for (const store of ['appstore', 'play']) {
      const L = layouts[store];
      const spec = stores[store].css;
      L.frames.forEach((frame, i) => {
        const slot = String(i + 1).padStart(2, '0');
        list.push({ id: `${store}-${lang}-${slot}`, store, lang, width: L.W, height: L.H, scale: spec.scale, css, body: frameBody(app, store, lang, frame, { slotIndex: i }), outputs: [{ slot, frame: 0 }] });
      });
      list.push({ id: `${store}-${lang}-01b`, store, lang, variant: 'b', width: L.W, height: L.H, scale: spec.scale, css, body: frameBody(app, store, lang, L.variantB, { slotIndex: 0, variant: 'b' }), outputs: [{ slot: '01', variant: 'b', frame: 0 }] });
    }
    list.push({ id: `feature-${lang}`, store: 'feature', lang, width: 512, height: 250, scale: 2, css: css + featureCss, body: featureBody(app, lang), outputs: [{ slot: 'feature', frame: 0 }] });
  }
  return list;
};

export const sheets = app =>
  ['pl', 'en'].map(lang => {
    const data = app.copy[lang].ui;
    const body = screenOrder
      .map((id, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px #bbb"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: c.atrament })}${renderScreen(id, data, { lang, store: 'appstore' })}</div></div>`)
      .join('');
    return { id: `ui-${lang}`, lang, width: 20 + screenOrder.length * 410, height: 884, scale: 1, css, body, background: '#d9dde4' };
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });

export const layoutsFor = () => layouts;

export { deviceHeight, icons };
