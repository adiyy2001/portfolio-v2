import { card, headline, phone, phoneGeometry, SCREEN, statusBar, styleOf } from '../../kit/kit.mjs';
import { stores } from '../../lib/convention.mjs';
import { area, cloud, colors as c, forest, ridgePoints, signMark, smoothPath, summitPole, svgOpen, trailPath, windLine, yAt } from './art.mjs';
import { profile, profileRange } from './profile.mjs';
import { landscapeChart, mapPoints, renderScreen } from './screens.mjs';

const css = `
.gh{font-family:'Overpass',sans-serif;font-weight:900;line-height:1.02;letter-spacing:-.018em;color:${c.glab}}
.gh--light{color:${c.biel}}
.gh--play{line-height:1.04;letter-spacing:-.012em}
.kit-phone__glass{background:${c.mgla}}
`;

const profileSilhouette = ({ x0, x1, yLow, yHigh }) =>
  profile.map(([km, h]) => [x0 + (km / profileRange.km[1]) * (x1 - x0), yLow - ((h - profile[0][1]) / (profile[profile.length - 1][1] - profile[0][1])) * (yLow - yHigh)]);

const chartSpan = ({ glassLeft, scale }) => {
  const left = glassLeft + (landscapeChart.offset + landscapeChart.padLeft) * scale;
  const right = glassLeft + (landscapeChart.offset + landscapeChart.width - landscapeChart.padRight) * scale;
  return [left, right];
};

const layouts = {
  appstore: {
    W: 2640,
    H: 956,
    F: 440,
    head: 41,
    headPlay: false,
    phones: [
      { x: 150, y: 398, w: 262 },
      { x: 564, y: 150, w: 196 },
      { x: 930, y: 350, w: 232, rotate: 6 },
      { x: 1350, y: 562, w: 382, landscape: true },
      { x: 1880, y: 70, w: 200 },
      { x: 2232, y: 450, w: 238 },
    ],
    heads: [
      { x: 28, y: 64, w: 384 },
      { x: 468, y: 800, w: 384, light: true },
      { x: 908, y: 66, w: 384 },
      { x: 1348, y: 62, w: 384 },
      { x: 1788, y: 600, w: 384, light: true },
      { x: 2228, y: 64, w: 384, align: 'right' },
    ],
    far: { base: 548, amp: 52, step: 44, peaks: [{ x: 330, width: 260, height: 70 }, { x: 1040, width: 300, height: 60 }, { x: 2060, width: 260, height: 50 }, { x: 2470, width: 240, height: 46 }] },
    mid: { base: 618, amp: 40, step: 38, peaks: [{ x: 700, width: 220, height: 92 }, { x: 1180, width: 200, height: 40 }, { x: 2380, width: 220, height: 60 }] },
    terrainA: [[-20, 702], [120, 692], [260, 676], [400, 646], [520, 614], [640, 590], [760, 548], [880, 494], [1000, 470], [1130, 470], [1250, 486], [1322, 502], [1366, 514]],
    terrainB: [[1736, 330], [1762, 362], [1800, 410], [1880, 430], [1960, 420], [2040, 434], [2120, 426], [2200, 444], [2300, 500], [2420, 590], [2540, 676], [2660, 756]],
    silhouette: { yLow: 520, yHigh: 300 },
    sun: { x: 1238, y: 404, r: 46 },
    glow: { top: 230, bottom: 700 },
    trail: {
      a: [[-10, 962], [70, 840], [130, 760]],
      b: [[400, 680], [470, 640], [540, 668], [620, 640], [700, 610], [800, 572], [880, 548], [960, 534], [1080, 528], [1200, 540], [1300, 552], [1360, 548]],
      c: [[1740, 344], [1790, 420], [1850, 500], [1960, 512], [2080, 506], [2200, 520], [2260, 540]],
      d: [[2440, 650], [2500, 700], [2570, 760], [2650, 830]],
      entry: 'map',
    },
    meadow: [[-20, 902], [150, 890], [300, 878], [460, 896], [600, 930]],
    grass: [[2160, 920], [2300, 900], [2440, 912], [2560, 940], [2660, 950]],
    rock: { x: 1134, y: 872, w: 156, h: 250 },
    ledge: { x: 1334, y: 742, w: 404 },
    clouds: {
      back: [[1262, 318, 160], [2140, 342, 150], [1990, 476, 280]],
      front: [[1748, 400, 230], [2186, 398, 210]],
    },
    winds: [[1690, 270, 150], [2130, 296, 140], [2070, 216, 96], [1560, 336, 90]],
    forests: [
      { seed: 11, from: 330, to: 960, count: 70, minH: 26, maxH: 54, depth: 20 },
      { seed: 12, from: 380, to: 940, count: 90, minH: 34, maxH: 70, depth: 260, offset: 40, tone: 1 },
      { seed: 13, from: 2470, to: 2660, count: 26, minH: 30, maxH: 56, depth: 160, offset: 90, tone: 1 },
    ],
    zones: { forest: { from: 380, to: 900, inner: 6, ramp: 150 }, pine: { from: 1500, to: 2160, inner: 34, ramp: 190 } },
    frontFrames: [1],
    village: [[34, 1.25], [62, 1.1], [92, 1.3], [118, 1], [76, 0.9]],
  },
  play: {
    W: 2160,
    H: 640,
    F: 360,
    head: 27,
    headPlay: true,
    cards: [
      { x: 136, y: 176, w: 196 },
      { x: 386, y: 34, w: 182 },
      { x: 766, y: 150, w: 196, rotate: 5 },
      { x: 1106, y: 340, w: 308, landscape: true },
      { x: 1584, y: 26, w: 176 },
      { x: 1824, y: 206, w: 196 },
    ],
    heads: [
      { x: 26, y: 28, w: 300 },
      { x: 386, y: 520, w: 306, light: true },
      { x: 746, y: 30, w: 306 },
      { x: 1106, y: 30, w: 306 },
      { x: 1466, y: 470, w: 306, light: true },
      { x: 1828, y: 30, w: 304, align: 'right' },
    ],
    far: { base: 352, amp: 34, step: 34, peaks: [{ x: 260, width: 210, height: 46 }, { x: 860, width: 240, height: 40 }, { x: 1700, width: 220, height: 36 }, { x: 2030, width: 200, height: 30 }] },
    mid: { base: 400, amp: 28, step: 30, peaks: [{ x: 600, width: 170, height: 60 }, { x: 980, width: 160, height: 30 }, { x: 1960, width: 170, height: 40 }] },
    terrainA: [[-20, 470], [120, 462], [250, 448], [360, 424], [470, 400], [580, 382], [680, 350], [760, 318], [860, 304], [960, 306], [1050, 318], [1090, 326], [1118, 332]],
    terrainB: [[1416, 168], [1440, 200], [1470, 252], [1540, 276], [1610, 268], [1680, 280], [1760, 272], [1820, 292], [1900, 336], [2000, 396], [2100, 452], [2180, 492]],
    silhouette: { yLow: 330, yHigh: 160 },
    sun: { x: 1026, y: 252, r: 30 },
    glow: { top: 130, bottom: 470 },
    trail: {
      a: [[-10, 646], [60, 560], [128, 500]],
      b: [[320, 452], [380, 420], [440, 436], [520, 410], [600, 392], [700, 362], [800, 350], [900, 346], [1000, 352], [1080, 360], [1130, 356]],
      c: [[1420, 182], [1460, 260], [1500, 330], [1600, 340], [1700, 334], [1800, 346], [1840, 360]],
      d: [[2024, 430], [2080, 470], [2130, 520], [2180, 570]],
      entry: 'card',
    },
    meadow: [[-20, 604], [120, 596], [250, 588], [380, 600], [480, 624]],
    grass: [[1780, 616], [1900, 600], [2020, 610], [2120, 630], [2180, 636]],
    rock: { x: 928, y: 594, w: 118, h: 168 },
    ledge: { x: 1094, y: 488, w: 322 },
    clouds: {
      back: [[1050, 212, 110], [1790, 226, 110]],
      front: [[1450, 250, 170], [1806, 168, 90], [1700, 590, 150]],
    },
    winds: [[1390, 176, 110], [1790, 140, 100], [1500, 110, 70]],
    forests: [
      { seed: 21, from: 270, to: 780, count: 56, minH: 18, maxH: 38, depth: 16 },
      { seed: 22, from: 310, to: 770, count: 70, minH: 24, maxH: 50, depth: 190, offset: 30, tone: 1 },
      { seed: 23, from: 2020, to: 2180, count: 20, minH: 22, maxH: 40, depth: 110, offset: 70, tone: 1 },
    ],
    zones: { forest: { from: 310, to: 740, inner: 5, ramp: 120 }, pine: { from: 1230, to: 1780, inner: 24, ramp: 150 } },
    frontFrames: [],
    village: [[30, 1], [54, 0.9], [78, 1.05], [100, 0.85]],
  },
};

const deviceBox = (L, store, i, variant) => {
  if (store === 'appstore') {
    const p = L.phones[i];
    const g = phoneGeometry(p.w, p.landscape);
    return { ...p, h: g.height, glassLeft: p.x + g.bezel, glassTop: p.y + g.bezel, scale: g.scale, variant };
  }
  const k = L.cards[i];
  const scale = k.w / (k.landscape ? SCREEN.height : SCREEN.width);
  return { ...k, h: (k.landscape ? SCREEN.width : SCREEN.height) * scale, glassLeft: k.x, glassTop: k.y, scale, variant };
};

const terrainFor = (L, store) => {
  const dev = deviceBox(L, store, 3);
  const [left, right] = chartSpan(dev);
  const sil = profileSilhouette({ x0: left, x1: right, ...L.silhouette });
  return { points: [...L.terrainA, ...sil, ...L.terrainB], silhouette: sil };
};

const entryPoint = (L, store, variant) => {
  const dev = deviceBox(L, store, 0, variant);
  const statusTop = store === 'play' ? 0 : 0;
  return [dev.glassLeft + 2, dev.glassTop + statusTop + mapPoints.entry[1] * dev.scale];
};

const smooth01 = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

const zoneTop = (terrain, { from, to, inner, ramp, H }) => {
  const pts = [];
  for (let x = from - ramp - 20; x <= to + ramp + 20; x += 16) {
    const s = Math.min(smooth01((x - (from - ramp)) / ramp), smooth01((to + ramp - x) / ramp));
    pts.push([x, yAt(terrain, x) + inner + (1 - s) * H]);
  }
  return pts;
};

const band = (line, depth) => {
  const top = smoothPath(line, 0.5);
  const lower = [...line].reverse().map(([x, y], i, all) => {
    const t = i / (all.length - 1);
    return [x, y + depth * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 4];
  });
  return `${top}L${lower.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`;
};

const house = (x, y, s) =>
  `<rect x="${x - 7 * s}" y="${y - 9 * s}" width="${14 * s}" height="${9 * s}" fill="${c.biel}"/><path d="M${x - 9 * s},${y - 8 * s}L${x},${y - 16 * s}L${x + 9 * s},${y - 8 * s}Z" fill="${c.glab}"/><rect x="${x - 2 * s}" y="${y - 6 * s}" width="${4 * s}" height="${4 * s}" fill="${c.slonce}"/>`;

const scene = (store, { variant } = {}) => {
  const L = layouts[store];
  const { W, H, F } = L;
  const play = store === 'play';
  const tw = play ? 3.6 : 4.5;
  const { points: terrain, silhouette } = terrainFor(L, store);
  const far = ridgePoints({ seed: 3, from: -40, to: W + 40, ...L.far });
  const mid = ridgePoints({ seed: 7, from: -40, to: W + 40, ...L.mid });
  const entry = entryPoint(L, store, variant);
  const cone = silhouette.slice(-5);
  const summit = cone[cone.length - 1];
  const climb = silhouette.filter(([x]) => x > silhouette[0][0] + 10).map(([x, y]) => [x, y + (play ? 12 : 16)]);
  const trail = [...L.trail.a, entry, ...L.trail.b, ...climb, [summit[0] - 2, summit[1] + 8], ...L.trail.c, ...L.trail.d];
  const terrainPath = area(terrain, H + 10, 0.5);
  const forestZone = zoneTop(terrain, { ...L.zones.forest, H });
  const pineZone = zoneTop(terrain, { ...L.zones.pine, H });
  const rockLine = [[cone[0][0] - (play ? 22 : 30), cone[0][1] + (play ? 22 : 30)], ...cone, [summit[0] + (play ? 18 : 26), summit[1] + (play ? 30 : 40)]];
  const forests = L.forests.map(spec => forest({ ...spec, line: terrain.map(([x, y]) => [x, y + (spec.offset ?? 0)]) })).join('');
  const glowDefs = `<linearGradient id="${store}-glowx" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".22" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset=".78" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="${store}-glowm"><rect width="${W}" height="${H}" fill="url(#${store}-glowx)"/></mask><linearGradient id="${store}-glowy" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${c.swit}" stop-opacity="0"/><stop offset=".7" stop-color="${c.swit}" stop-opacity=".95"/><stop offset="1" stop-color="${c.swit}" stop-opacity="1"/></linearGradient>`;
  const ground = id => `<path d="${terrainPath}" fill="${c.laka}"/>
<path d="${area(forestZone, H + 10, 0.5)}" fill="${c.las}" clip-path="url(#${id})"/>
<path d="${area(pineZone, H + 10, 0.5)}" fill="${c.las}" clip-path="url(#${id})"/>
<path d="${band(rockLine, play ? 34 : 48)}" fill="${c.grzbiet}" clip-path="url(#${id})"/>
<path d="${smoothPath(cone.map(([x, y]) => [x - 3, y + 7]), 0.5)}" fill="none" stroke="${c.dal}" stroke-width="${play ? 3 : 4}" stroke-linecap="round" clip-path="url(#${id})"/>
${forests}
${trailPath(trail, tw)}`;
  const rock = (({ x, y, w, h }) =>
    `<path d="M${x},${y}L${x + w * 0.06},${y - h * 0.62}L${x + w * 0.34},${y - h}L${x + w * 0.74},${y - h * 0.86}L${x + w},${y - h * 0.3}L${x + w * 1.02},${y}Z" fill="${c.grzbiet}"/><path d="M${x + w * 0.34},${y - h}L${x + w * 0.74},${y - h * 0.86}L${x + w},${y - h * 0.3}L${x + w * 0.58},${y - h * 0.42}Z" fill="${c.dal}"/><path d="M${x},${y}L${x + w * 0.06},${y - h * 0.62}L${x + w * 0.3},${y - h * 0.3}L${x + w * 0.5},${y}Z" fill="#5A7A86"/>${signMark(x + w * 0.66, y - h * 0.58, w * 0.15)}`)(L.rock);
  const ledge = (({ x, y, w }) =>
    `<path d="M${x},${y + 8}L${x + w * 0.08},${y - 4}L${x + w * 0.92},${y - 6}L${x + w},${y + 10}L${x + w * 0.96},${y + 70}L${x + w * 0.04},${y + 64}Z" fill="${c.grzbiet}"/><path d="M${x + w * 0.08},${y - 4}L${x + w * 0.92},${y - 6}L${x + w * 0.86},${y + 8}L${x + w * 0.14},${y + 10}Z" fill="${c.dal}"/>`)(L.ledge);
  const village = L.village.map(([x, s]) => house(x, yAt(terrain, x) + 6 * s, s)).join('');
  const back = `${svgOpen(W, H)}<defs>${glowDefs}<clipPath id="${store}-t1"><path d="${terrainPath}"/></clipPath></defs>
<rect width="${W}" height="${H}" fill="${c.mgla}"/>
<rect y="${L.glow.top}" width="${W}" height="${L.glow.bottom - L.glow.top}" fill="url(#${store}-glowy)" mask="url(#${store}-glowm)"/>
<circle cx="${L.sun.x}" cy="${L.sun.y}" r="${L.sun.r * 1.9}" fill="${c.swit}" opacity=".7"/><circle cx="${L.sun.x}" cy="${L.sun.y}" r="${L.sun.r}" fill="${c.slonce}"/>
${L.clouds.back.map(([x, y, w]) => cloud(x, y, w, 0.85)).join('')}
${L.winds.map(([x, y, w]) => windLine(x, y, w, play ? 7 : 10)).join('')}
<path d="${area(far, H + 10, 0.4)}" fill="${c.dal}"/>
<path d="${area(mid, H + 10, 0.4)}" fill="${c.grzbiet}"/>
${ground(`${store}-t1`)}
${village}
${summitPole(summit[0], summit[1] + 1, play ? 26 : 36)}
${ledge}
</svg>`;
  const front = `${svgOpen(W, H)}<defs><clipPath id="${store}-front">${L.frontFrames.map(i => `<rect x="${F * i}" y="0" width="${F}" height="${H}"/>`).join('')}</clipPath><clipPath id="${store}-t2"><path d="${terrainPath}"/></clipPath></defs>
<g clip-path="url(#${store}-front)">${ground(`${store}-t2`)}</g>
${L.clouds.front.map(([x, y, w]) => cloud(x, y, w, 0.94)).join('')}
${rock}
<path d="${area(L.meadow, H + 10, 0.5)}" fill="${c.laka}"/>
<path d="${smoothPath(L.meadow, 0.5)}" fill="none" stroke="#93AE5F" stroke-width="3"/>
<path d="${area(L.grass, H + 10, 0.5)}" fill="${c.laka}"/>
<path d="${smoothPath(L.grass, 0.5)}" fill="none" stroke="#93AE5F" stroke-width="3"/>
</svg>`;
  return { back, front };
};

const copyFor = (app, lang) => app.copy[lang];

const slotScreen = (copy, i, variant) => (i === 0 && variant === 'b' ? copy.variantB.screen : copy.slots[i].screen);

const slotHeadline = (copy, i, variant) => (i === 0 && variant === 'b' ? copy.variantB.headline : copy.slots[i].headline);

const strip = (app, store, lang, variant) => {
  const L = layouts[store];
  const copy = copyFor(app, lang);
  const { back, front } = scene(store, { variant });
  const devices = Array.from({ length: 6 }, (_, i) => {
    const dev = deviceBox(L, store, i, variant);
    const screenId = slotScreen(copy, i, variant);
    const screen = renderScreen(screenId, copy.ui, { lang, store, landscape: Boolean(dev.landscape) });
    if (store === 'appstore') {
      return phone({ screen, width: dev.w, x: dev.x, y: dev.y, rotate: dev.rotate ?? 0, landscape: dev.landscape, name: `phone-${i + 1}`, statusColor: c.glab });
    }
    return card({ screen, width: dev.w, x: dev.x, y: dev.y, rotate: dev.rotate ?? 0, landscape: dev.landscape, name: `card-${i + 1}`, statusColor: c.glab, radius: 18 });
  }).join('');
  const heads = L.heads
    .map((h, i) =>
      headline({
        value: slotHeadline(copy, i, variant),
        lang,
        x: h.x,
        y: h.y,
        width: h.w,
        size: L.head * (h.scale ?? 1) * (lang === 'pl' ? 1 : 1),
        align: h.align ?? 'left',
        className: `gh${h.light ? ' gh--light' : ''}${L.headPlay ? ' gh--play' : ''}`,
        name: `headline-${i + 1}`,
      }),
    )
    .join('');
  return `<div class="kit-layer">${back}</div>${devices}<div class="kit-layer">${front}</div>${heads}`;
};

const featureArt = (app, lang) => {
  const W = 512;
  const H = 250;
  const copy = copyFor(app, lang);
  const far = ridgePoints({ seed: 5, from: -20, to: W + 20, base: 150, amp: 16, step: 18, peaks: [{ x: 120, width: 120, height: 20 }, { x: 430, width: 110, height: 18 }] });
  const mid = ridgePoints({ seed: 9, from: -20, to: W + 20, base: 176, amp: 12, step: 16, peaks: [{ x: 60, width: 90, height: 26 }] });
  const sil = profileSilhouette({ x0: 262, x1: 452, yLow: 196, yHigh: 82 });
  const terrain = [[-20, 214], [80, 210], [180, 204], [240, 200], ...sil, [470, 96], [490, 128], [530, 160]];
  const tp = area(terrain, H + 5, 0.5);
  const cone = sil.slice(-5);
  const trail = [...sil.filter(([x]) => x > sil[0][0] + 6).map(([x, y]) => [x, y + 7])];
  const svg = `${svgOpen(W, H)}<defs><linearGradient id="fg-glow" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${c.swit}" stop-opacity="0"/><stop offset=".8" stop-color="${c.swit}" stop-opacity="1"/></linearGradient><clipPath id="fg-t"><path d="${tp}"/></clipPath></defs>
<rect width="${W}" height="${H}" fill="${c.mgla}"/>
<rect y="40" width="${W}" height="170" fill="url(#fg-glow)"/>
<circle cx="470" cy="150" r="40" fill="${c.swit}" opacity=".8"/><circle cx="470" cy="150" r="21" fill="${c.slonce}"/>
${windLine(330, 50, 70, 5)}${windLine(392, 66, 50, 4)}
<path d="${area(far, H + 5, 0.4)}" fill="${c.dal}"/>
<path d="${area(mid, H + 5, 0.4)}" fill="${c.grzbiet}"/>
<path d="${tp}" fill="${c.laka}"/>
<path d="${area(terrain.map(([x, y]) => [x, y + (x > 250 ? 26 : 8)]), H + 5, 0.5)}" fill="${c.las}" clip-path="url(#fg-t)"/>
<path d="${band([[cone[0][0] - 14, cone[0][1] + 14], ...cone, [cone[cone.length - 1][0] + 12, cone[cone.length - 1][1] + 20]], 22)}" fill="${c.grzbiet}" clip-path="url(#fg-t)"/>
${forest({ seed: 31, from: -10, to: 220, count: 40, minH: 10, maxH: 22, depth: 30, line: terrain.map(([x, y]) => [x, y + 6]), tone: 1 })}
${trailPath([[150, 260], [200, 228], [250, 210], ...trail], 2.4)}
${summitPole(cone[cone.length - 1][0], cone[cone.length - 1][1] + 1, 16)}
${cloud(300, 120, 70, 0.9)}
</svg>`;
  return `<div class="kit-layer">${svg}</div>
<div class="fg-name" data-box="headline" data-name="feature-name" style="${styleOf({ left: 56, top: 50 })}">${app.name}</div>
${headline({ value: copy.feature.headline, lang, x: 58, y: 120, width: 162, size: 17.5, className: 'gh fg-h', name: 'feature-tagline' })}`;
};

const featureCss = `
.fg-name{position:absolute;font-family:'Overpass',sans-serif;font-weight:900;font-size:58px;line-height:1;letter-spacing:-.03em;color:${c.las}}
.fg-h{position:absolute;line-height:1.08}
`;

export const iconSvg = (layer = 'full', size = 1024) => {
  const s = size / 1024;
  const far = [[-40, 520], [120, 430], [250, 470], [390, 360], [520, 440], [640, 380], [780, 470], [900, 400], [1064, 470]].map(([x, y]) => [x * s, y * s]);
  const mid = [[-40, 640], [140, 560], [300, 610], [470, 500], [600, 570], [760, 520], [900, 590], [1064, 560]].map(([x, y]) => [x * s, y * s]);
  const front = [[-40, 780], [160, 700], [330, 650], [520, 560], [660, 620], [820, 690], [1064, 730]].map(([x, y]) => [x * s, y * s]);
  const B = size + 10;
  const bg = `<rect width="${size}" height="${size}" fill="${c.mgla}"/><circle cx="${730 * s}" cy="${300 * s}" r="${92 * s}" fill="${c.slonce}"/><path d="${area(far, B, 0.35)}" fill="${c.dal}"/><path d="${area(mid, B, 0.35)}" fill="${c.grzbiet}"/>`;
  const trail = smoothPath([[-20 * s, 880 * s], [200 * s, 800 * s], [380 * s, 740 * s], [520 * s, 600 * s]], 0.5);
  const fg = `<path d="${area(front, B, 0.4)}" fill="${c.las}"/><path d="${trail}" fill="none" stroke="${c.biel}" stroke-width="${52 * s}" stroke-linecap="round"/><path d="${trail}" fill="none" stroke="${c.znak}" stroke-width="${22 * s}" stroke-linecap="round"/>`;
  const content = layer === 'background' ? bg : layer === 'foreground' ? fg : bg + fg;
  return `${svgOpen(size, size)}${content}</svg>`;
};

export const jobs = app => {
  const list = [];
  for (const lang of ['pl', 'en']) {
    for (const store of ['appstore', 'play']) {
      const L = layouts[store];
      const spec = stores[store].css;
      list.push({
        id: `${store}-${lang}`,
        store,
        lang,
        width: L.W,
        height: L.H,
        scale: spec.scale,
        frames: 6,
        frameWidth: L.F,
        css,
        body: strip(app, store, lang),
        outputs: ['01', '02', '03', '04', '05', '06'].map((slot, frame) => ({ slot, frame })),
      });
      list.push({
        id: `${store}-${lang}-b`,
        store,
        lang,
        variant: 'b',
        width: L.W,
        height: L.H,
        scale: spec.scale,
        frames: 6,
        frameWidth: L.F,
        css,
        body: strip(app, store, lang, 'b'),
        outputs: [{ slot: '01', variant: 'b', frame: 0 }],
      });
    }
    list.push({
      id: `feature-${lang}`,
      store: 'feature',
      lang,
      width: 512,
      height: 250,
      scale: 2,
      css: css + featureCss,
      body: featureArt(app, lang),
      outputs: [{ slot: 'feature', frame: 0 }],
    });
  }
  return list;
};

export const sheets = app =>
  ['pl', 'en'].map(lang => {
    const copy = copyFor(app, lang);
    const ids = ['mapa', 'trasa', 'offline', 'zmrok', 'profil', 'grani', 'dziennik'];
    const body = ids
      .map((id, i) => `<div style="position:absolute;left:${20 + i * 410}px;top:20px;width:390px;height:844px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px #ccc"><div class="kit-screen" style="width:390px;height:844px">${statusBar('ios', { color: c.glab })}${renderScreen(id, copy.ui, { lang, store: 'appstore' })}</div></div>`)
      .join('') + `<div style="position:absolute;left:20px;top:884px;width:844px;height:390px;overflow:hidden;border-radius:24px;box-shadow:0 0 0 1px #ccc"><div class="kit-screen kit-screen--landscape" style="width:844px;height:390px">${renderScreen('profil', copy.ui, { lang, store: 'appstore', landscape: true })}</div></div>`;
    return { id: `ui-${lang}`, lang, width: 20 + ids.length * 410, height: 1300, scale: 1, css, body, background: '#ddd' };
  });

export const ogSource = () => ({ store: 'appstore', lang: 'pl', slots: ['01', '02', '03'] });

export const layoutsFor = () => layouts;

