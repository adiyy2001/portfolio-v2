export const colors = {
  krem: '#FFF3DD',
  pomidor: '#EE4B2B',
  musztarda: '#F6B400',
  kobalt: '#2547C8',
  turkus: '#19B3A3',
  roz: '#F7A8C9',
  kontur: '#1A1714',
  biel: '#FFFFFF',
  szary: '#5C534A',
};

const c = colors;

let uid = 0;
const nextId = prefix => `${prefix}${(uid += 1)}`;
export const resetIds = () => {
  uid = 0;
};

const r2 = v => Math.round(v * 100) / 100;

export const halftone = ({ id, color = c.kontur, step = 7, dot = 1.7, opacity = 0.32 }) =>
  `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="${step / 2}" cy="${step / 2}" r="${dot}" fill="${color}" fill-opacity="${opacity}"/></pattern>`;

const crimp = (cx, cy, r, from, to, teeth, depth) => {
  const pts = [];
  const n = teeth * 2;
  for (let i = 0; i <= n; i += 1) {
    const t = from + ((to - from) * i) / n;
    const rr = i % 2 === 0 ? r : r + depth;
    pts.push(`${r2(cx + Math.cos(t) * rr)} ${r2(cy + Math.sin(t) * rr)}`);
  }
  return pts;
};

const face = ({ x, y, gap = 22, eye = 6, mouth = 'open', size = 1 }) => {
  const e = eye * size;
  const g = (gap * size) / 2;
  const eyes = [-g, g]
    .map(dx => `<ellipse cx="${r2(x + dx)}" cy="${r2(y)}" rx="${r2(e * 0.78)}" ry="${r2(e)}" fill="${c.kontur}"/><circle cx="${r2(x + dx + e * 0.25)}" cy="${r2(y - e * 0.38)}" r="${r2(e * 0.3)}" fill="${c.biel}"/>`)
    .join('');
  const my = y + 13 * size;
  const mw = 9 * size;
  const shape =
    mouth === 'open'
      ? `<path d="M${r2(x - mw)} ${r2(my)} Q${r2(x)} ${r2(my + 18 * size)} ${r2(x + mw)} ${r2(my)} Z" fill="${c.kontur}"/><path d="M${r2(x - mw * 0.5)} ${r2(my + 7 * size)} Q${r2(x)} ${r2(my + 3 * size)} ${r2(x + mw * 0.5)} ${r2(my + 7 * size)} Q${r2(x)} ${r2(my + 12 * size)} ${r2(x - mw * 0.5)} ${r2(my + 7 * size)} Z" fill="${c.roz}"/>`
      : `<path d="M${r2(x - mw)} ${r2(my)} Q${r2(x)} ${r2(my + 11 * size)} ${r2(x + mw)} ${r2(my)}" fill="none" stroke="${c.kontur}" stroke-width="${r2(3.2 * size)}" stroke-linecap="round"/>`;
  const cheeks = [-g - e * 1.4, g + e * 1.4].map(dx => `<ellipse cx="${r2(x + dx)}" cy="${r2(my - 1 * size)}" rx="${r2(5 * size)}" ry="${r2(3.4 * size)}" fill="${c.roz}" opacity=".9"/>`).join('');
  return { svg: cheeks + eyes + shape, mouth: [x, my + (mouth === 'open' ? 9 : 5) * size] };
};

const arm = (x, y, angle, length = 26, stroke = 4) => {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * length;
  const ey = y + Math.sin(a) * length;
  return `<path d="M${r2(x)} ${r2(y)} L${r2(ex)} ${r2(ey)}" stroke="${c.kontur}" stroke-width="${stroke}" stroke-linecap="round"/><circle cx="${r2(ex)}" cy="${r2(ey)}" r="6.5" fill="${c.biel}" stroke="${c.kontur}" stroke-width="3"/>`;
};

const shade = (clipShape, extra = '') => {
  const clip = nextId('cl');
  const pat = nextId('ht');
  return `<defs><clipPath id="${clip}">${clipShape}</clipPath>${halftone({ id: pat })}</defs><g clip-path="url(#${clip})"><rect x="0" y="0" width="160" height="160" fill="url(#${pat})" ${extra}/></g>`;
};

const characters = {
  tomato: ({ point }) => {
    const body = `<circle cx="60" cy="68" r="44"/>`;
    const f = face({ x: 60, y: 66 });
    const calyx = [];
    for (let i = 0; i < 5; i += 1) {
      const t = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const t2 = t + 0.36;
      calyx.push(`${r2(60 + Math.cos(t) * 30)} ${r2(26 + Math.sin(t) * 14)}`, `${r2(60 + Math.cos(t2) * 8)} ${r2(26 + Math.sin(t2) * 6)}`);
    }
    return {
      svg: `${point !== undefined ? arm(28, 92, point) : ''}<circle cx="60" cy="68" r="44" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="3.5"/>${shade(body, 'transform="translate(30 30)"')}<path d="M34 50 Q40 36 54 32" fill="none" stroke="${c.biel}" stroke-width="6" stroke-linecap="round"/><polygon points="${calyx.join(' ')}" fill="${c.turkus}" stroke="${c.kontur}" stroke-width="3" stroke-linejoin="round"/><path d="M60 22 L62 8" stroke="${c.kontur}" stroke-width="5" stroke-linecap="round"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  egg: ({ point }) => {
    const shape = `<path d="M60 14 C88 14 102 56 102 78 C102 102 84 116 60 116 C36 116 18 102 18 78 C18 56 32 14 60 14 Z"/>`;
    const f = face({ x: 60, y: 74 });
    return {
      svg: `${point !== undefined ? arm(96, 86, point) : ''}<path d="M60 14 C88 14 102 56 102 78 C102 102 84 116 60 116 C36 116 18 102 18 78 C18 56 32 14 60 14 Z" fill="${c.biel}" stroke="${c.kontur}" stroke-width="3.5"/>${shade(shape, 'transform="translate(36 36)"')}<path d="M38 46 Q42 34 52 28" fill="none" stroke="${c.musztarda}" stroke-width="5" stroke-linecap="round"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  zucchini: ({ point }) => {
    const body = `<rect x="14" y="40" width="96" height="42" rx="21" transform="rotate(-28 62 61)"/>`;
    const f = face({ x: 58, y: 58, gap: 18, eye: 5, mouth: 'smile' });
    return {
      svg: `${point !== undefined ? arm(78, 72, point) : ''}<rect x="14" y="40" width="96" height="42" rx="21" transform="rotate(-28 62 61)" fill="${c.turkus}" stroke="${c.kontur}" stroke-width="3.5"/>${shade(body, 'transform="translate(0 34)"')}<path d="M30 84 L96 48" stroke="${c.krem}" stroke-width="3" stroke-linecap="round" opacity=".55"/><rect x="98" y="20" width="16" height="12" rx="3" transform="rotate(-28 106 26)" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="3"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  cheese: ({ point }) => {
    const shape = `<path d="M10 100 L110 100 L110 52 Z"/>`;
    const f = face({ x: 82, y: 78, gap: 16, eye: 4.6, mouth: 'smile' });
    return {
      svg: `${point !== undefined ? arm(18, 92, point) : ''}<path d="M10 100 L110 100 L110 52 Z" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/><path d="M10 100 L110 52 L110 36 L14 92 Z" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="3" stroke-linejoin="round"/>${shade(shape, 'transform="translate(40 40)"')}<circle cx="50" cy="92" r="5" fill="${c.krem}" stroke="${c.kontur}" stroke-width="2.5"/><circle cx="100" cy="94" r="4" fill="${c.krem}" stroke="${c.kontur}" stroke-width="2.5"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  onion: ({ point }) => {
    const shape = `<path d="M60 22 C60 40 100 52 100 82 C100 104 82 116 60 116 C38 116 20 104 20 82 C20 52 60 40 60 22 Z"/>`;
    const f = face({ x: 60, y: 84, gap: 18, eye: 5, mouth: 'smile' });
    return {
      svg: `${point !== undefined ? arm(26, 96, point) : ''}<path d="M60 22 C60 40 100 52 100 82 C100 104 82 116 60 116 C38 116 20 104 20 82 C20 52 60 40 60 22 Z" fill="${c.roz}" stroke="${c.kontur}" stroke-width="3.5"/>${shade(shape, 'transform="translate(40 50)"')}<path d="M44 58 Q36 84 46 108 M76 58 Q84 84 74 108" fill="none" stroke="${c.kontur}" stroke-width="2.5" opacity=".5"/><path d="M60 24 L54 6 M60 24 L66 8" stroke="${c.turkus}" stroke-width="5" stroke-linecap="round"/><path d="M60 24 L54 6 M60 24 L66 8" stroke="${c.kontur}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  pierog: ({ point }) => {
    const edge = crimp(60, 92, 50, Math.PI, Math.PI * 2, 11, 6);
    const d = `M${edge.join(' L')} Z`;
    const f = face({ x: 60, y: 70, gap: 22, eye: 5.6 });
    return {
      svg: `${point !== undefined ? arm(100, 96, point) : ''}<path d="${d}" fill="${c.biel}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/><path d="M14 92 Q60 100 106 92" fill="none" stroke="${c.kontur}" stroke-width="3" stroke-linecap="round"/>${shade(`<path d="${d}"/>`, 'transform="translate(44 40)" fill-opacity="1"')}<path d="M24 70 Q40 50 60 46" fill="none" stroke="${c.musztarda}" stroke-width="5" stroke-linecap="round" opacity=".8"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  pan: ({ point }) => {
    const body = `<path d="M10 56 L94 56 L86 98 Q84 106 76 106 L28 106 Q20 106 18 98 Z"/>`;
    const f = face({ x: 52, y: 78, gap: 22, eye: 5.4 });
    return {
      svg: `${point !== undefined ? arm(14, 92, point) : ''}<rect x="88" y="62" width="34" height="13" rx="6.5" transform="rotate(-10 100 68)" fill="${c.kontur}"/><path d="M10 56 L94 56 L86 98 Q84 106 76 106 L28 106 Q20 106 18 98 Z" fill="${c.kobalt}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/>${shade(body, 'transform="translate(40 40)"')}<rect x="4" y="50" width="96" height="10" rx="5" fill="${c.kobalt}" stroke="${c.kontur}" stroke-width="3.5"/>${f.svg}<path d="M36 40 q-6 -8 0 -16 q6 -8 0 -16 M58 40 q-6 -8 0 -16 q6 -8 0 -16" fill="none" stroke="${c.kontur}" stroke-width="3" stroke-linecap="round" opacity=".55"/>`,
      mouth: f.mouth,
    };
  },
  pot: ({ point }) => {
    const body = `<path d="M16 52 L104 52 L100 104 Q98 112 90 112 L30 112 Q22 112 20 104 Z"/>`;
    const f = face({ x: 60, y: 76, gap: 24, eye: 5.6 });
    return {
      svg: `${point !== undefined ? arm(102, 92, point) : ''}<path d="M16 52 L104 52 L100 104 Q98 112 90 112 L30 112 Q22 112 20 104 Z" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/>${shade(body, 'transform="translate(44 40)"')}<rect x="2" y="60" width="16" height="12" rx="5" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="3"/><rect x="102" y="60" width="16" height="12" rx="5" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="3"/><path d="M12 50 Q60 22 108 50 Z" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="60" cy="30" r="7" fill="${c.kontur}"/><circle cx="48" cy="96" r="3" fill="${c.biel}" opacity=".8"/>${f.svg}`,
      mouth: f.mouth,
    };
  },
  list: ({ point }) => {
    const f = face({ x: 60, y: 82, gap: 22, eye: 5.2, mouth: 'open', size: 0.95 });
    const rows = [30, 46, 62]
      .map((y, i) => `<rect x="30" y="${y - 6}" width="12" height="12" rx="3" fill="${i < 2 ? c.turkus : c.biel}" stroke="${c.kontur}" stroke-width="2.5"/><path d="M50 ${y} H${i === 1 ? 78 : 88}" stroke="${c.kontur}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`)
      .join('');
    return {
      svg: `${point !== undefined ? arm(98, 92, point) : ''}<g transform="rotate(-6 60 64)"><path d="M18 12 H102 V108 Q92 102 82 110 Q72 102 62 110 Q52 102 42 110 Q32 102 18 108 Z" fill="${c.biel}" stroke="${c.kontur}" stroke-width="3.5" stroke-linejoin="round"/>${rows}${f.svg}</g>`,
      mouth: [64, 100],
    };
  },
};

export const character = (kind, { x, y, size = 120, point, flip = false, name }) => {
  const make = characters[kind];
  if (!make) throw new Error(`chochla: unknown character ${kind}`);
  const { svg, mouth } = make({ point });
  const k = size / 120;
  const mx = flip ? 120 - mouth[0] : mouth[0];
  const inner = flip ? `<g transform="translate(120 0) scale(-1 1)">${svg}</g>` : svg;
  return {
    html: `<svg class="c-char" data-box="fg" data-name="${name ?? kind}" width="${size}" height="${size}" viewBox="-6 -6 132 132" style="position:absolute;left:${r2(x)}px;top:${r2(y)}px;overflow:visible" aria-hidden="true">${inner}</svg>`,
    mouth: [x + ((mx + 6) * size) / 132, y + ((mouth[1] + 6) * size) / 132],
    rect: { x, y, w: size, h: size },
  };
};

const bowl = (fill, inside = '') =>
  `<path d="M5 22 H43 A19 19 0 0 1 5 22 Z" fill="${fill}" stroke="${c.kontur}" stroke-width="2.5" stroke-linejoin="round"/>${inside}<path d="M3 22 H45" stroke="${c.kontur}" stroke-width="2.5" stroke-linecap="round"/>`;

const foods = {
  zupa: () => `${bowl(c.pomidor)}<circle cx="18" cy="17" r="2.3" fill="${c.biel}" stroke="${c.kontur}" stroke-width="1.4"/><circle cx="26" cy="15" r="2.3" fill="${c.biel}" stroke="${c.kontur}" stroke-width="1.4"/><circle cx="32" cy="18" r="2.3" fill="${c.biel}" stroke="${c.kontur}" stroke-width="1.4"/><path d="M17 10 q-3-3 0-6 M27 9 q-3-3 0-6" fill="none" stroke="${c.kontur}" stroke-width="2" stroke-linecap="round"/>`,
  placki: () => `<ellipse cx="24" cy="32" rx="18" ry="7" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="2.5"/><ellipse cx="24" cy="24" rx="17" ry="7" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="2.5"/><ellipse cx="24" cy="16" rx="16" ry="6.5" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="2.5"/><path d="M18 14 l3 2 M27 13 l3 3 M22 18 l2 -2" stroke="${c.turkus}" stroke-width="2.4" stroke-linecap="round"/>`,
  pierogi: () => {
    const e = crimp(24, 31, 17, Math.PI, Math.PI * 2, 7, 2.6);
    return `<path d="M${e.join(' L')} Z" fill="${c.biel}" stroke="${c.kontur}" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 31 H40" stroke="${c.kontur}" stroke-width="2.4" stroke-linecap="round"/><path d="M14 24 Q20 18 26 17" fill="none" stroke="${c.musztarda}" stroke-width="2.6" stroke-linecap="round"/>`;
  },
  leczo: () => `<rect x="9" y="17" width="30" height="20" rx="4" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="2.5"/><path d="M5 20 H9 M39 20 H43" stroke="${c.kontur}" stroke-width="3" stroke-linecap="round"/><path d="M7 15 H41" stroke="${c.kontur}" stroke-width="2.5" stroke-linecap="round"/><circle cx="18" cy="27" r="3" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="1.6"/><circle cx="29" cy="25" r="3" fill="${c.turkus}" stroke="${c.kontur}" stroke-width="1.6"/><path d="M20 10 q-3-3 0-6 M28 10 q-3-3 0-6" fill="none" stroke="${c.kontur}" stroke-width="2" stroke-linecap="round"/>`,
  dorsz: () => `<path d="M8 24 Q20 10 34 24 Q20 38 8 24 Z" fill="${c.biel}" stroke="${c.kontur}" stroke-width="2.5" stroke-linejoin="round"/><path d="M33 24 L43 15 L43 33 Z" fill="${c.kobalt}" stroke="${c.kontur}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="15" cy="22" r="2" fill="${c.kontur}"/><path d="M20 19 q3 5 0 10" fill="none" stroke="${c.kontur}" stroke-width="2" stroke-linecap="round"/>`,
  gulasz: () => `${bowl(c.kobalt, `<rect x="13" y="13" width="8" height="8" rx="2" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="1.6"/><rect x="27" y="14" width="8" height="7" rx="3" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="1.6"/><rect x="20" y="9" width="7" height="7" rx="2" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="1.6"/>`)}`,
  rosol: () => `${bowl(c.musztarda)}<circle cx="16" cy="18" r="3" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="1.5"/><circle cx="31" cy="17" r="3" fill="${c.pomidor}" stroke="${c.kontur}" stroke-width="1.5"/><path d="M20 19 q3 -4 6 0 q3 4 6 0" fill="none" stroke="${c.biel}" stroke-width="2.2" stroke-linecap="round"/>`,
  frittata: () => `<circle cx="24" cy="24" r="17" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="2.5"/><circle cx="24" cy="24" r="17" fill="none" stroke="${c.kontur}" stroke-width="5" opacity=".18"/><circle cx="18" cy="20" r="3" fill="${c.turkus}" stroke="${c.kontur}" stroke-width="1.5"/><circle cx="29" cy="27" r="3" fill="${c.turkus}" stroke="${c.kontur}" stroke-width="1.5"/><circle cx="27" cy="16" r="2.4" fill="${c.biel}" stroke="${c.kontur}" stroke-width="1.4"/>`,
  zapiekanka: () => `<rect x="6" y="15" width="36" height="22" rx="5" fill="${c.biel}" stroke="${c.kontur}" stroke-width="2.5"/><path d="M10 22 h28 v9 a3 3 0 0 1 -3 3 h-22 a3 3 0 0 1 -3 -3 Z" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="1.8"/><circle cx="17" cy="26" r="2.6" fill="${c.turkus}"/><circle cx="31" cy="27" r="2.6" fill="${c.pomidor}"/><circle cx="24" cy="25" r="2.2" fill="${c.turkus}"/>`,
  sernik: () => `<path d="M6 34 L42 34 L42 20 L6 26 Z" fill="${c.musztarda}" stroke="${c.kontur}" stroke-width="2.5" stroke-linejoin="round"/><path d="M6 26 L42 20 L36 15 Z" fill="${c.krem}" stroke="${c.kontur}" stroke-width="2.5" stroke-linejoin="round"/><path d="M6 34 L42 34" stroke="${c.kontur}" stroke-width="2.5"/><path d="M8 30 L40 30" stroke="${c.pomidor}" stroke-width="2" opacity=".8"/>`,
};

export const food = (kind, size = 44, background = c.krem) => {
  const draw = foods[kind];
  if (!draw) throw new Error(`chochla: unknown food ${kind}`);
  return `<span class="c-plate" style="width:${size}px;height:${size}px;background:${background}"><svg width="${size - 6}" height="${size - 6}" viewBox="0 0 48 48" aria-hidden="true">${draw()}</svg></span>`;
};

export const foodSvg = (kind, size = 48) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">${foods[kind]()}</svg>`;

const rand = seed => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const paletteCycle = [c.pomidor, c.kobalt, c.musztarda, c.turkus, c.roz];

const shapeSvg = (kind, color, s, rot) => {
  const t = `transform="rotate(${r2(rot)})"`;
  const k = c.kontur;
  if (kind === 'triangle') return `<path ${t} d="M0 ${r2(-s * 0.6)} L${r2(s * 0.55)} ${r2(s * 0.4)} L${r2(-s * 0.55)} ${r2(s * 0.4)} Z" fill="${color}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (kind === 'squiggle') {
    const w = s * 1.6;
    return `<path ${t} d="M${r2(-w / 2)} 0 q${r2(w / 8)} ${r2(-s / 3)} ${r2(w / 4)} 0 t${r2(w / 4)} 0 t${r2(w / 4)} 0 t${r2(w / 4)} 0" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (kind === 'ring') return `<circle r="${r2(s * 0.4)}" fill="none" stroke="${color}" stroke-width="5"/><circle r="${r2(s * 0.4 + 2.5)}" fill="none" stroke="${k}" stroke-width="1.2" opacity="0"/>`;
  if (kind === 'dots') {
    const out = [];
    for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) out.push(`<circle cx="${r2((i - 1) * s * 0.34)}" cy="${r2((j - 1) * s * 0.34)}" r="${r2(s * 0.07 + 0.8)}" fill="${k}"/>`);
    return `<g ${t}>${out.join('')}</g>`;
  }
  if (kind === 'zigzag') {
    const w = s * 1.5;
    const pts = Array.from({ length: 7 }, (_, i) => `${r2(-w / 2 + (i * w) / 6)} ${i % 2 ? r2(-s * 0.18) : r2(s * 0.18)}`);
    return `<polyline ${t} points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="miter" stroke-linecap="square"/>`;
  }
  if (kind === 'half') return `<path ${t} d="M${r2(-s * 0.45)} ${r2(s * 0.12)} A${r2(s * 0.45)} ${r2(s * 0.45)} 0 0 1 ${r2(s * 0.45)} ${r2(s * 0.12)} Z" fill="${color}" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (kind === 'question') return `<g ${t}><path d="M${r2(-s * 0.22)} ${r2(-s * 0.2)} q0 ${r2(-s * 0.3)} ${r2(s * 0.24)} ${r2(-s * 0.3)} q${r2(s * 0.24)} 0 ${r2(s * 0.24)} ${r2(s * 0.24)} q0 ${r2(s * 0.18)} ${r2(-s * 0.22)} ${r2(s * 0.27)} v${r2(s * 0.12)}" fill="none" stroke="${color}" stroke-width="${r2(s * 0.16)}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${r2(s * 0.02)}" cy="${r2(s * 0.45)}" r="${r2(s * 0.09)}" fill="${color}"/></g>`;
  if (kind === 'cross') return `<path ${t} d="M${r2(-s * 0.3)} 0 H${r2(s * 0.3)} M0 ${r2(-s * 0.3)} V${r2(s * 0.3)}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  return '';
};

const kinds = ['triangle', 'squiggle', 'ring', 'dots', 'zigzag', 'half', 'cross'];

const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const confetti = ({ w, h, seed, count = 14, avoid = [], size = [18, 30], margin = 6, kindsOf = kinds, colors: cols = paletteCycle, edge }) => {
  const next = rand(seed);
  const placed = [];
  let tries = 0;
  while (placed.length < count && tries < 4000) {
    tries += 1;
    const s = size[0] + next() * (size[1] - size[0]);
    const kind = kindsOf[Math.floor(next() * kindsOf.length)];
    const ext = kind === 'squiggle' || kind === 'zigzag' ? s * 0.95 : s * 0.82;
    const x = margin + ext + next() * (w - 2 * (margin + ext));
    const y = margin + ext + next() * (h - 2 * (margin + ext));
    if (edge && Math.min(x, y, w - x, h - y) > edge) continue;
    const box = { x: x - ext, y: y - ext, w: ext * 2, h: ext * 2 };
    if (avoid.some(zone => overlaps(box, zone))) continue;
    if (placed.some(p => overlaps({ x: box.x - 10, y: box.y - 10, w: box.w + 20, h: box.h + 20 }, p.box))) continue;
    const color = cols[Math.floor(next() * cols.length)];
    placed.push({ box, svg: `<g data-pattern="${kind}" transform="translate(${r2(x)} ${r2(y)})">${shapeSvg(kind, color, s, next() * 360)}</g>` });
  }
  return placed.map(p => p.svg).join('');
};

export const zigzagBand = ({ x0, y0, x1, y1, height, teeth = 14, fill = c.musztarda, stroke = c.kontur, id }) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const tooth = len / teeth;
  const top = [];
  const bottom = [];
  for (let i = 0; i <= teeth * 2; i += 1) {
    const along = (i * tooth) / 2;
    const off = i % 2 ? tooth * 0.42 : 0;
    top.push([x0 + ux * along + nx * (-height / 2 - off), y0 + uy * along + ny * (-height / 2 - off)]);
    bottom.push([x0 + ux * along + nx * (height / 2 + off), y0 + uy * along + ny * (height / 2 + off)]);
  }
  const pts = [...top, ...bottom.reverse()].map(([px, py]) => `${r2(px)} ${r2(py)}`);
  const pat = id ?? nextId('band');
  return `<defs>${halftone({ id: pat, color: c.kontur, step: 8, dot: 1.9, opacity: 0.22 })}</defs><polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="miter"/><polygon points="${pts.join(' ')}" fill="url(#${pat})"/>`;
};

export const burst = ({ cx, cy, r, inner, spikes = 16, fill = c.musztarda, stroke = c.kontur, seed = 3, width = 3.5 }) => {
  const next = rand(seed);
  const pts = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const t = (i * Math.PI) / spikes - Math.PI / 2;
    const rr = i % 2 === 0 ? r * (0.86 + next() * 0.14) : inner * (0.9 + next() * 0.12);
    pts.push(`${r2(cx + Math.cos(t) * rr)} ${r2(cy + Math.sin(t) * rr)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="miter"/>`;
};

export const halftoneDisc = ({ cx, cy, r, fill, dot = 3.2, step = 11, ink = c.kontur, opacity = 0.9 }) => {
  const clip = nextId('hc');
  return `<defs><clipPath id="${clip}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${c.kontur}" stroke-width="4"/><g clip-path="url(#${clip})">${(() => {
    const out = [];
    for (let y = cy - r; y <= cy + r; y += step) {
      for (let x = cx - r; x <= cx + r; x += step) {
        const row = Math.round((y - cy + r) / step);
        const px = x + (row % 2 ? step / 2 : 0);
        const d = Math.hypot(px - (cx - r * 0.5), y - (cy - r * 0.5)) / (r * 1.8);
        const rr = dot * Math.min(1, Math.max(0.15, d));
        out.push(`<circle cx="${r2(px)}" cy="${r2(y)}" r="${r2(rr)}" fill="${ink}" fill-opacity="${opacity}"/>`);
      }
    }
    return out.join('');
  })()}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.kontur}" stroke-width="4"/>`;
};
