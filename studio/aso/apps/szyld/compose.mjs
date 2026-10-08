import { card, esc, headline, phone, phoneGeometry, SCREEN, statusBar, styleOf, text } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { codeCard, colors as c, glyph, mapPins, renderScreen, screenOrder } from './screens.mjs';

const css = `
.sh{font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;line-height:.98;letter-spacing:-.025em;word-spacing:.08em;color:${c.mleko}}
.sh--ink{color:${c.smola}}
.sh--play{line-height:1;letter-spacing:-.02em}
.sv{position:absolute;transform-origin:0 0;transform:rotate(-90deg);hyphens:none;overflow-wrap:normal;word-break:keep-all;text-wrap:balance}
.s-bg{position:absolute;left:0;top:0;overflow:hidden}
.s-bg svg{position:absolute;left:0;top:0;display:block}
.s-stage{position:absolute;left:0;top:0;transform-style:flat}
.s-tag{position:absolute;display:flex;align-items:center;gap:10px;padding:10px 16px 10px 10px;border-radius:20px;background:${c.mleko};color:${c.smola};font-family:'Mona Sans',sans-serif;box-shadow:0 22px 34px -18px rgba(14,30,26,.6),0 2px 0 rgba(14,30,26,.08);white-space:nowrap}
.s-tag b{display:block;font-weight:700;font-size:15.5px;line-height:1.15}
.s-tag span.s-tag__sub{display:block;font-size:13px;color:${c.lupek};font-weight:600}
.s-pin{position:absolute;left:0;top:0;transform-origin:50% 100%;display:flex;flex-direction:column;align-items:center}
.s-pin__head{display:flex;align-items:center;gap:7px;padding:7px 12px 7px 7px;border-radius:16px;background:${c.butelka};color:${c.mleko};font-family:'Mona Sans',sans-serif;font-weight:700;font-size:15px;white-space:nowrap;box-shadow:0 14px 22px -12px rgba(14,30,26,.7)}
.s-pin__head i{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:10px;background:${c.limonka};color:${c.butelka}}
.s-pin__head i svg{width:20px;height:20px}
.s-pin__stalk{width:3px;background:${c.butelka}}
.s-badge{position:absolute;display:flex;align-items:center;gap:12px;padding:16px 20px;border-radius:24px;background:${c.limonka};color:${c.smola};font-family:'Mona Sans',sans-serif;box-shadow:0 26px 40px -18px rgba(14,30,26,.7)}
.s-badge b{display:block;font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:800;font-size:21px;line-height:1.1;letter-spacing:-.01em}
.s-badge small{display:block;margin-top:2px;font-size:14px;font-weight:600}
.s-float{position:absolute;filter:drop-shadow(0 30px 30px rgba(14,30,26,.45))}
.kit-phone__glass{background:${c.mleko}}
`;

const grainSvg = (w, h, { freq = 0.8, opacity = 0.38, seed = 7 } = {}) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="mix-blend-mode:overlay;opacity:${opacity}" aria-hidden="true"><filter id="grain${seed}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  2.2 0 0 0 -.6"/></filter><rect width="${w}" height="${h}" filter="url(#grain${seed})" fill="#fff"/></svg>`;

const duotones = {
  a: (angle, mid = 34) => `linear-gradient(${angle}deg in oklab, ${c.butelka} 0%, ${c.butelka} ${mid}%, #3F8A4E ${mid + 30}%, ${c.limonka} 100%)`,
  b: (angle, mid = 22) => `linear-gradient(${angle}deg in oklab, ${c.grejpfrut} 0%, ${c.grejpfrut} ${mid}%, #FF9A3E ${mid + 34}%, ${c.limonka} 100%)`,
};

const background = (w, h, { tone, angle, mid, glow, seed = 7, freq }) => {
  const layers = [glow ? `radial-gradient(circle at ${glow.x}px ${glow.y}px, ${glow.color} 0, transparent ${glow.r}px)` : null, duotones[tone](angle, mid)].filter(Boolean).join(',');
  return `<div class="s-bg" style="${styleOf({ width: w, height: h, background: layers })}">${grainSvg(w, h, { seed, freq: freq ?? (w > 400 ? 0.8 : 0.85) })}</div>`;
};

const streaks = (items, color = c.limonka) =>
  items
    .map(([x, y, len, angle, thick = 10, op = 0.9]) => `<span style="${styleOf({ position: 'absolute', left: x, top: y, width: len, height: thick, 'border-radius': '999px', background: color, opacity: op, transform: `rotate(${angle}deg)`, 'transform-origin': '0 50%' })}"></span>`)
    .join('');

const trail = (x, y, count, k = 1) =>
  Array.from({ length: count + 1 }, (_, i) =>
    `<span style="${styleOf({ position: 'absolute', left: x + i * 34 * k, top: y + 6 * k, width: 5 * k, height: (58 - i * 12) * k, 'border-radius': '999px', background: c.mleko, opacity: 0.85 - i * 0.18, transform: `rotate(${-8 + i * 3}deg)`, 'transform-origin': '50% 0' })}"></span>`,
  ).join('');

const vhead = ({ value, lang, x, bottom, length, size, className, name }) =>
  `<div class="kit-headline sv ${className}" data-box="headline" data-vertical data-name="${esc(name)}" style="${styleOf({ left: x, top: bottom, width: length, 'font-size': size, transform: 'rotate(-90deg)' })}">${text(value, lang)}</div>`;

const darkTop = new Set(['kod', 'sklep']);

const device = (store, { screen, screenId, width, x, y, transform, name, box = 'device', shadow = true }) => {
  const statusColor = darkTop.has(screenId) ? c.mleko : c.smola;
  return store === 'appstore'
    ? phone({ screen, width, x, y, transform, name, box, statusColor, body: '#1B2421', shadow })
    : card({ screen, width, x, y, transform, name, box, statusColor, radius: 16, shadow });
};

const deviceHeight = (store, width) => (store === 'appstore' ? phoneGeometry(width).height : (SCREEN.height * width) / SCREEN.width);

const screenArea = (store, width) => {
  if (store === 'appstore') {
    const g = phoneGeometry(width);
    return { left: g.bezel, top: g.bezel, scale: g.scale };
  }
  return { left: 0, top: 0, scale: width / SCREEN.width };
};

const stage = (inner, { perspective = 1100, origin = '50% 50%', w, h }) =>
  `<div class="s-stage" style="${styleOf({ width: w, height: h, perspective: `${perspective}px`, 'perspective-origin': origin })}">${inner}</div>`;

const shopTag = (data, id, lang, { x, y, rotate = 0, sub, scale = 1, name }) => {
  const s = data.shops[id];
  return `<div class="s-tag" data-box="fg" data-name="${esc(name)}" style="${styleOf({ left: x, top: y, transform: `rotate(${rotate}deg) scale(${scale})`, 'transform-origin': '0 0' })}"><span class="s-ico s-ico--sm">${glyph[id]}</span><span><b>${text(s.name, lang)}</b><span class="s-tag__sub">${text(sub, lang)}</span></span></div>`;
};

const pinScript = `<script>for(const pin of document.querySelectorAll('[data-pin-for]')){const m=document.querySelector('[data-pin="'+pin.dataset.pinFor+'"]').getBoundingClientRect();pin.style.left=(m.left+m.width/2)+'px';pin.style.top=(m.top+m.height/2)+'px'}</script>`;

const pinOrder = ['srubka', 'ksiegarnia', 'piekarnia', 'warzywniak', 'kwiaciarnia'];

const liftedMap = (data, lang, store, { width, x, y, tilt, spin, pinScale = 1, stalks = [96, 92, 54, 40, 64] }) => {
  const screen = renderScreen('okolica', data, { lang, store, lift: true });
  const deviceHtml = `<div style="${styleOf({ position: 'absolute', left: x, top: y, width, height: deviceHeight(store, width), transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)` })}">${device(store, { screen, screenId: 'okolica', width, x: 0, y: 0, name: 'map-device', shadow: false })}</div>`;
  const pins = pinOrder
    .map(
      (id, i) =>
        `<div class="s-pin" data-box="fg" data-name="pin-${id}" data-pin-for="${id}" style="${styleOf({ transform: `translate(-50%,-100%) scale(${pinScale})` })}"><span class="s-pin__head"><i>${glyph[id]}</i>${text(data.shops[id].short, lang)}</span><span class="s-pin__stalk" style="height:${stalks[i]}px"></span></div>`,
    )
    .join('');
  return { deviceHtml, pins: pins + pinScript };
};

const outlineWord = ({ value, x, y, size, stroke, fill = 'none', strokeWidth = 3, w, h, length, anchor = 'start' }) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" style="position:absolute;left:0;top:0;overflow:visible"><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Mona Sans Expanded" font-weight="900" font-size="${size}" letter-spacing="${-size * 0.02}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"${length ? ` textLength="${length}" lengthAdjust="spacingAndGlyphs"` : ''}>${esc(value)}</text></svg>`;

const holdBadge = (data, lang, { x, y, rotate, scale = 1 }) =>
  `<div class="s-badge" data-box="fg" data-name="hold-badge" style="${styleOf({ left: x, top: y, transform: `rotate(${rotate}deg) scale(${scale})`, 'transform-origin': '0 0' })}"><svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h14v9H4Z"/><path d="M7 10V7a4 4 0 0 1 8 0v3"/><circle cx="11" cy="14.5" r="1.3" fill="currentColor"/></svg><span><b>${text(data.sklep.hold, lang)}</b><small>${text(data.shops.piekarnia.name, lang)}</small></span></div>`;

const layouts = {
  appstore: {
    W: 440,
    H: 956,
    head: 50,
    frames: [
      {
        bg: { tone: 'a', angle: 158, mid: 30, glow: { x: 420, y: 900, r: 420, color: 'rgba(213,242,92,.55)' } },
        head: { x: 26, y: 60, w: 392, size: 48 },
        device: { width: 336, x: 72, y: 330, transform: 'rotateY(-20deg) rotateZ(7deg)' },
        perspective: 1000,
        origin: '20% 40%',
        streaks: [[-40, 520, 220, -26, 16, 0.85], [-30, 580, 170, -26, 10, 0.6], [-20, 630, 120, -26, 6, 0.45]],
      },
      {
        bg: { tone: 'b', angle: 192, mid: 18 },
        head: { x: 26, y: 750, w: 392, size: 48, ink: true },
        map: { width: 312, x: 64, y: 40, tilt: 38, spin: -9 },
        perspective: 1100,
        origin: '50% 10%',
      },
      {
        bg: { tone: 'a', angle: 196, mid: 34, glow: { x: 0, y: 900, r: 320, color: 'rgba(213,242,92,.5)' } },
        head: { x: 26, y: 60, w: 392, size: 48, align: 'right' },
        device: { width: 300, x: 124, y: 470, transform: 'rotateY(-18deg) rotateZ(-4deg)' },
        perspective: 1000,
        origin: '70% 60%',
        tags: [
          { id: 'piekarnia', x: 30, y: 236, rotate: -7 },
          { id: 'warzywniak', x: 18, y: 330, rotate: 3 },
          { id: 'kwiaciarnia', x: 40, y: 424, rotate: -3 },
        ],
        trails: [[70, 292, 2], [64, 386, 2]],
        tagScale: 1,
      },
      {
        bg: { tone: 'b', angle: 140, mid: 20 },
        vhead: { x: 26, bottom: 930, length: 900, size: 60, ink: true },
        big: { size: { pl: 98, en: 124 }, y: 236, x: 290, stroke: c.smola, strokeWidth: 3 },
        device: { width: 280, x: 156, y: 300, transform: 'rotateY(-20deg) rotateZ(4deg)' },
        perspective: 1000,
        origin: '80% 60%',
      },
      {
        bg: { tone: 'a', angle: 205, mid: 30 },
        head: { x: 26, y: 60, w: 392, size: 48 },
        device: { width: 300, x: 26, y: 318, transform: 'rotateZ(-9deg) rotateY(9deg)', hideCode: true },
        perspective: 1200,
        origin: '30% 50%',
        code: { width: 250, x: 168, y: 372, transform: 'rotate(5deg)' },
      },
      {
        bg: { tone: 'b', angle: 180, mid: 18 },
        head: { x: 26, y: 60, w: 392, size: 48, ink: true },
        word: { y: 470, size: { pl: 104, en: 78 }, length: 400, x: 20 },
        device: { width: 300, x: 70, y: 470, transform: 'rotateX(16deg)' },
        perspective: 900,
        origin: '50% 100%',
        streaks: [[60, 900, 120, -90, 8, 0.7], [380, 930, 150, -90, 8, 0.7], [30, 940, 90, -90, 5, 0.5]],
      },
    ],
    variantB: {
      bg: { tone: 'a', angle: 158, mid: 30, glow: { x: 420, y: 900, r: 420, color: 'rgba(213,242,92,.55)' } },
      head: { x: 26, y: 60, w: 392, size: 48 },
      device: { width: 336, x: 80, y: 360, transform: 'rotateY(-20deg) rotateZ(7deg)' },
      perspective: 1000,
      origin: '20% 40%',
      badge: { x: 30, y: 520, rotate: -6 },
    },
  },
  play: {
    W: 360,
    H: 640,
    head: 31,
    frames: [
      {
        bg: { tone: 'a', angle: 158, mid: 30, glow: { x: 350, y: 600, r: 300, color: 'rgba(213,242,92,.55)' } },
        head: { x: 22, y: 34, w: 300, size: 31 },
        device: { width: 250, x: 82, y: 214, transform: 'rotateY(-20deg) rotateZ(7deg)' },
        perspective: 800,
        origin: '20% 40%',
        streaks: [[-30, 360, 170, -26, 12, 0.85], [-24, 404, 130, -26, 8, 0.6]],
      },
      {
        bg: { tone: 'b', angle: 192, mid: 18 },
        head: { x: 22, y: 560, w: 316, size: 30, ink: true },
        map: { width: 212, x: 74, y: 6, tilt: 40, spin: -9, pinScale: 0.7 },
        perspective: 800,
        origin: '50% 10%',
      },
      {
        bg: { tone: 'a', angle: 196, mid: 34, glow: { x: 0, y: 600, r: 220, color: 'rgba(213,242,92,.5)' } },
        head: { x: 22, y: 34, w: 316, size: 31, align: 'right' },
        device: { width: 216, x: 124, y: 316, transform: 'rotateY(-18deg) rotateZ(-4deg)' },
        perspective: 800,
        origin: '70% 60%',
        tags: [
          { id: 'piekarnia', x: 18, y: 150, rotate: -7 },
          { id: 'warzywniak', x: 10, y: 214, rotate: 4 },
          { id: 'kwiaciarnia', x: 24, y: 278, rotate: -3 },
        ],
        tagScale: 0.78,
        trails: [[46, 192, 2, 0.6], [42, 256, 2, 0.6]],
      },
      {
        bg: { tone: 'b', angle: 140, mid: 20 },
        vhead: { x: 20, bottom: 620, length: 580, size: 36, ink: true },
        big: { size: { pl: 80, en: 98 }, y: 156, x: 230, stroke: c.smola, strokeWidth: 2.4 },
        device: { width: 206, x: 128, y: 196, transform: 'rotateY(-20deg) rotateZ(4deg)' },
        perspective: 800,
        origin: '80% 60%',
      },
      {
        bg: { tone: 'a', angle: 205, mid: 30 },
        head: { x: 22, y: 34, w: 316, size: 31 },
        device: { width: 226, x: 34, y: 186, transform: 'rotateZ(-9deg) rotateY(9deg)', hideCode: true },
        perspective: 900,
        origin: '30% 50%',
        code: { width: 186, x: 154, y: 248, transform: 'rotate(5deg)' },
      },
      {
        bg: { tone: 'b', angle: 180, mid: 18 },
        head: { x: 22, y: 34, w: 316, size: 31, ink: true },
        word: { y: 300, size: { pl: 84, en: 63 }, length: 320, x: 20 },
        device: { width: 232, x: 64, y: 300, transform: 'rotateX(16deg)' },
        perspective: 700,
        origin: '50% 100%',
        streaks: [[50, 600, 90, -90, 6, 0.7], [310, 620, 110, -90, 6, 0.7]],
      },
    ],
    variantB: {
      bg: { tone: 'a', angle: 158, mid: 30, glow: { x: 350, y: 600, r: 300, color: 'rgba(213,242,92,.55)' } },
      head: { x: 22, y: 34, w: 300, size: 31 },
      device: { width: 250, x: 82, y: 214, transform: 'rotateY(-20deg) rotateZ(7deg)' },
      perspective: 800,
      origin: '20% 40%',
      badge: { x: 20, y: 338, rotate: -6, scale: 0.8 },
    },
  },
};

const frameBody = (app, store, lang, spec, { slotIndex, variant }) => {
  const L = layouts[store];
  const { W, H } = L;
  const copy = app.copy[lang];
  const data = copy.ui;
  const screenId = variant === 'b' ? copy.variantB.screen : copy.slots[slotIndex].screen;
  const value = variant === 'b' ? copy.variantB.headline : copy.slots[slotIndex].headline;
  const play = store === 'play';
  const parts = [background(W, H, { ...spec.bg, seed: 7 + slotIndex })];
  if (spec.streaks) parts.push(streaks(spec.streaks));
  if (spec.big) {
    parts.push(outlineWord({ value: data.big.time, x: spec.big.x, y: spec.big.y, size: spec.big.size[lang], anchor: 'middle', stroke: spec.big.stroke, strokeWidth: spec.big.strokeWidth, w: W, h: H }));
  }
  if (spec.word) {
    const size = spec.word.size[lang];
    parts.push(outlineWord({ value: data.big.day, x: spec.word.x, y: spec.word.y, size, stroke: 'none', fill: c.butelka, w: W, h: H, length: spec.word.length }));
  }
  if (spec.map) {
    const lifted = liftedMap(data, lang, store, spec.map);
    parts.push(stage(lifted.deviceHtml, { perspective: spec.perspective, origin: spec.origin, w: W, h: H }));
    parts.push(lifted.pins);
  }
  if (spec.device) {
    const screen = renderScreen(screenId, data, { lang, store, hideCode: spec.device.hideCode, hideHold: Boolean(spec.badge) });
    parts.push(stage(device(store, { ...spec.device, screen, screenId, name: `device-${slotIndex + 1}` }), { perspective: spec.perspective, origin: spec.origin, w: W, h: H }));
  }
  if (spec.trails) parts.push(spec.trails.map(([x, y, n, k = 1]) => trail(x, y, n, k)).join(''));
  if (spec.tags) {
    parts.push(spec.tags.map((t, i) => shopTag(data, t.id, lang, { ...t, sub: data.tags[t.id], scale: spec.tagScale, name: `tag-${i + 1}` })).join(''));
  }
  if (spec.code) {
    parts.push(`<div class="s-float" data-box="fg" data-name="code-card" style="${styleOf({ left: spec.code.x, top: spec.code.y, transform: spec.code.transform })}">${codeCard(data, lang, { width: spec.code.width })}</div>`);
  }
  if (spec.badge) parts.push(holdBadge(data, lang, spec.badge));
  const cls = `sh${spec.head?.ink || spec.vhead?.ink ? ' sh--ink' : ''}${play ? ' sh--play' : ''}`;
  if (spec.head) {
    parts.push(headline({ value, lang, x: spec.head.x, y: spec.head.y, width: spec.head.w, size: spec.head.size, align: spec.head.align ?? 'left', className: cls, name: `headline-${slotIndex + 1}` }));
  }
  if (spec.vhead) {
    parts.push(vhead({ value, lang, ...spec.vhead, className: cls, name: `headline-${slotIndex + 1}` }));
  }
  return parts.join('');
};

const featureBody = (app, lang) => {
  const copy = app.copy[lang];
  const data = copy.ui;
  const W = 512;
  const H = 250;
  const tags = [
    { id: 'piekarnia', x: 296, y: 52, r: -6 },
    { id: 'warzywniak', x: 292, y: 108, r: 3 },
    { id: 'kwiaciarnia', x: 298, y: 162, r: -2 },
  ];
  return `${background(W, H, { tone: 'a', angle: 112, mid: 30, glow: { x: 500, y: 40, r: 260, color: 'rgba(213,242,92,.45)' }, seed: 31, freq: 0.9 })}
<div class="s-stage" style="width:${W}px;height:${H}px;perspective:700px;perspective-origin:20% 50%">${tags
    .map(
      (t, i) => `<div class="s-tag" data-box="fg" data-name="feature-tag-${i + 1}" style="${styleOf({ left: t.x, top: t.y, transform: `rotateY(-24deg) rotate(${t.r}deg) scale(.52)`, 'transform-origin': '0 0' })}"><span class="s-ico s-ico--sm">${glyph[t.id]}</span><span><b>${text(data.shops[t.id].name, lang)}</b><span class="s-tag__sub">${text(data.tags[t.id], lang)}</span></span></div>`,
    )
    .join('')}</div>
<div class="fg-name" data-box="headline" data-name="feature-name" style="left:54px;top:40px">${esc(app.name)}</div>
${headline({ value: copy.feature.headline, lang, x: 56, y: 112, width: 164, size: 15, className: 'sh fg-h', name: 'feature-tagline' })}`;
};

const featureCss = `
.fg-name{position:absolute;font-family:'Mona Sans Expanded',sans-serif;font-weight:900;font-size:54px;line-height:1;letter-spacing:-.035em;color:${c.limonka}}
.fg-h{line-height:1.08;letter-spacing:-.01em}
`;

export const iconSvg = (layer = 'full', size = 1024) => {
  const s = size / 1024;
  const bg = `<defs><linearGradient id="ib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0F5A49"/><stop offset="1" stop-color="${c.butelka}"/></linearGradient></defs><rect width="${size}" height="${size}" fill="url(#ib)"/>`;
  const p = v => (v * s).toFixed(1);
  const bag = `M${p(408)} ${p(486)}h${p(208)}l${p(-18)} ${p(156)}h${p(-172)}Z`;
  const fg = `<g fill="none" stroke="${c.limonka}" stroke-linecap="round" stroke-linejoin="round"><path d="M${p(212)} ${p(196)}H${p(800)}" stroke-width="${p(46)}"/><path d="M${p(212)} ${p(150)}V${p(310)}" stroke-width="${p(46)}"/><path d="M${p(212)} ${p(300)}L${p(330)} ${p(196)}" stroke-width="${p(30)}"/><path d="M${p(352)} ${p(204)}V${p(322)}M${p(672)} ${p(204)}V${p(322)}" stroke-width="${p(18)}"/></g><path fill-rule="evenodd" fill="${c.limonka}" d="M${p(294)} ${p(322)}h${p(436)}a${p(48)} ${p(48)} 0 0 1 ${p(48)} ${p(48)}v${p(330)}a${p(48)} ${p(48)} 0 0 1 ${p(-48)} ${p(48)}h${p(-436)}a${p(48)} ${p(48)} 0 0 1 ${p(-48)} ${p(-48)}v${p(-330)}a${p(48)} ${p(48)} 0 0 1 ${p(48)} ${p(-48)}Z${bag}"/><path d="M${p(452)} ${p(510)}c${p(0)} ${p(-58)} ${p(30)} ${p(-78)} ${p(60)} ${p(-78)}s${p(60)} ${p(20)} ${p(60)} ${p(78)}" fill="none" stroke="${c.butelka}" stroke-width="${p(16)}" stroke-linecap="round"/><path d="M${p(430)} ${p(530)}h${p(164)}" stroke="${c.limonka}" stroke-width="${p(10)}" stroke-linecap="round"/>`;
  const shifted = `<g transform="translate(0 ${p(64)})">${fg}</g>`;
  const content = layer === 'background' ? bg : layer === 'foreground' ? shifted : bg + shifted;
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
      .map((id, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px #bbb"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: darkTop.has(id) ? c.mleko : c.smola })}${renderScreen(id, data, { lang, store: 'appstore' })}</div></div>`)
      .join('');
    return { id: `ui-${lang}`, lang, width: 20 + screenOrder.length * 410, height: 884, scale: 1, css, body, background: '#cfd6d2' };
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });

export const layoutsFor = () => layouts;
