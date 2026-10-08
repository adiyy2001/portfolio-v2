export const colors = {
  chromJasny: '#EEF1F6',
  chrom: '#AAB2C0',
  grafit: '#3B4250',
  atrament: '#111217',
  roz: '#FF8AD0',
  cyjan: '#72EFFF',
  limonka: '#D7FF63',
  brzoskwinia: '#FFC7A0',
  biel: '#FFFFFF',
  srebro: '#DDE2EA',
};

const c = colors;

export const tones = { roz: c.roz, cyjan: c.cyjan, limonka: c.limonka, brzoskwinia: c.brzoskwinia };

const r1 = v => Math.round(v * 100) / 100;

export const starPath = (cx, cy, r, pinch = 0.16) => {
  const k = r * pinch;
  return `M${r1(cx)} ${r1(cy - r)}C${r1(cx + k)} ${r1(cy - k)} ${r1(cx + k)} ${r1(cy - k)} ${r1(cx + r)} ${r1(cy)}C${r1(cx + k)} ${r1(cy + k)} ${r1(cx + k)} ${r1(cy + k)} ${r1(cx)} ${r1(cy + r)}C${r1(cx - k)} ${r1(cy + k)} ${r1(cx - k)} ${r1(cy + k)} ${r1(cx - r)} ${r1(cy)}C${r1(cx - k)} ${r1(cy - k)} ${r1(cx - k)} ${r1(cy - k)} ${r1(cx)} ${r1(cy - r)}Z`;
};

export const chromeStops = `<stop offset="0" stop-color="#FFFFFF"/><stop offset=".16" stop-color="#E2FAFF"/><stop offset=".42" stop-color="#9DB9D2"/><stop offset=".47" stop-color="#F7F9FC"/><stop offset=".5" stop-color="#2F3542"/><stop offset=".58" stop-color="#737C8F"/><stop offset=".76" stop-color="#FFA9DA"/><stop offset=".92" stop-color="#FFE1C9"/><stop offset="1" stop-color="#FFFFFF"/>`;

export const letterStops = `<stop offset="0" stop-color="#F4FBFF"/><stop offset=".18" stop-color="#B9D3E6"/><stop offset=".44" stop-color="#6F88A6"/><stop offset=".48" stop-color="#DCE3EE"/><stop offset=".52" stop-color="#262B36"/><stop offset=".62" stop-color="#5B6478"/><stop offset=".8" stop-color="#FF8AD0"/><stop offset=".94" stop-color="#FFC7A0"/><stop offset="1" stop-color="#FFE9DA"/>`;

export const rimStops = `<stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#C3CAD6"/><stop offset=".5" stop-color="#6D7586"/><stop offset=".62" stop-color="#E9EDF3"/><stop offset=".82" stop-color="#9AA3B4"/><stop offset="1" stop-color="#F7F8FB"/>`;

export const holoStops = `<stop offset="0" stop-color="${c.roz}"/><stop offset=".34" stop-color="${c.brzoskwinia}"/><stop offset=".62" stop-color="${c.limonka}"/><stop offset="1" stop-color="${c.cyjan}"/>`;

export const sparkle = ({ x, y, r, fill = '#FFFFFF', glow = true, id = 'sp', opacity = 1 }) =>
  `<g opacity="${opacity}">${glow ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.55)}" fill="url(#${id}-glow)"/>` : ''}<path d="${starPath(x, y, r)}" fill="${fill}"/></g>`;

export const sparkleDefs = id => `<radialGradient id="${id}-glow"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity=".35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`;

const lin = (id, a, b, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

const gloss = u => `<radialGradient id="${u}-gl" cx="35%" cy="28%" r="70%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity=".25"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`;

const covers = {
  mira: u => ({
    defs: `${lin(`${u}-bg`, c.roz, c.brzoskwinia, 0.4, 1)}${gloss(u)}<radialGradient id="${u}-orb" cx="40%" cy="35%" r="65%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="${c.cyjan}"/><stop offset="1" stop-color="#58B7D6"/></radialGradient>`,
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/><ellipse cx="50" cy="56" rx="40" ry="11" fill="none" stroke="#FFFFFF" stroke-width="2.4" opacity=".8"/><circle cx="50" cy="48" r="24" fill="url(#${u}-orb)"/><circle cx="50" cy="48" r="24" fill="url(#${u}-gl)"/><path d="M14 58a40 11 0 0 0 72 0" fill="none" stroke="#FFFFFF" stroke-width="2.4"/><path d="${starPath(80, 22, 7)}" fill="#FFFFFF"/><path d="${starPath(22, 80, 4.5)}" fill="#FFFFFF" opacity=".85"/>`,
  }),
  lisie: u => ({
    defs: lin(`${u}-bg`, c.limonka, c.cyjan, 1, 1),
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/>${[16, 28, 40, 52].map((r, i) => `<path d="M${50 - r} ${74 - r * 0.15}A${r} ${r} 0 0 1 ${50 + r} ${74 - r * 0.15}" fill="none" stroke="${c.atrament}" stroke-width="${5 - i * 0.6}" stroke-linecap="round" opacity="${1 - i * 0.14}"/>`).join('')}<circle cx="50" cy="74" r="7" fill="${c.atrament}"/><path d="M40 92 50 74 60 92" fill="none" stroke="${c.atrament}" stroke-width="4" stroke-linejoin="round"/>`,
  }),
  brokat: u => ({
    defs: `<radialGradient id="${u}-bg" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="#2A3040"/><stop offset="1" stop-color="${c.atrament}"/></radialGradient><radialGradient id="${u}-ball" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="${c.chrom}"/><stop offset="1" stop-color="#4A5262"/></radialGradient><clipPath id="${u}-cl"><circle cx="50" cy="52" r="26"/></clipPath>`,
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/><circle cx="50" cy="52" r="26" fill="url(#${u}-ball)"/><g clip-path="url(#${u}-cl)" stroke="${c.atrament}" stroke-width="1.1" opacity=".55">${[32, 40, 48, 56, 64, 72].map(y => `<line x1="20" x2="80" y1="${y}" y2="${y}"/>`).join('')}${[30, 38, 46, 54, 62, 70].map(x => `<path d="M${x} 24Q${50 + (x - 50) * 1.35} 52 ${x} 80" fill="none"/>`).join('')}</g><line x1="50" y1="0" x2="50" y2="26" stroke="${c.chrom}" stroke-width="1.6"/>${[
      [16, 18, 6, c.roz],
      [84, 24, 5, c.cyjan],
      [18, 84, 5, c.limonka],
      [84, 82, 7, c.brzoskwinia],
      [70, 12, 3, '#FFFFFF'],
      [10, 52, 3, c.cyjan],
    ]
      .map(([x, y, r, f]) => `<path d="${starPath(x, y, r)}" fill="${f}"/>`)
      .join('')}`,
  }),
  pola: u => ({
    defs: `<clipPath id="${u}-cl"><rect width="100" height="100"/></clipPath>`,
    body: `<rect width="100" height="100" fill="${c.brzoskwinia}"/><g clip-path="url(#${u}-cl)"><path d="M-10 70 70 -10 86 6 6 86Z" fill="${c.roz}"/><path d="M14 110 110 14 122 26 26 122Z" fill="${c.cyjan}"/></g><circle cx="68" cy="66" r="16" fill="#FFFFFF" stroke="${c.atrament}" stroke-width="3.5"/><circle cx="68" cy="66" r="5" fill="${c.atrament}"/>`,
  }),
  szklane: u => ({
    defs: `${lin(`${u}-bg`, '#CFF8FF', c.chrom, 0.2, 1)}${lin(`${u}-sh`, '#FFFFFF', c.cyjan, 1, 1)}`,
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/><path d="M22 78 40 18 58 70Z" fill="url(#${u}-sh)" stroke="${c.atrament}" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 84 70 30 86 74Z" fill="#FFFFFF" fill-opacity=".75" stroke="${c.atrament}" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 90 26 64 36 92Z" fill="${c.roz}" stroke="${c.atrament}" stroke-width="2.5" stroke-linejoin="round"/><path d="M38 28 41 20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><path d="${starPath(78, 16, 6)}" fill="#FFFFFF"/>`,
  }),
  olacma: u => ({
    defs: `${lin(`${u}-bg`, c.grafit, c.roz, 0, 1)}<radialGradient id="${u}-lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c.limonka}" stop-opacity=".95"/><stop offset="1" stop-color="${c.limonka}" stop-opacity="0"/></radialGradient>`,
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/><circle cx="50" cy="30" r="26" fill="url(#${u}-lamp)"/><circle cx="50" cy="30" r="8" fill="${c.limonka}"/><g fill="${c.chromJasny}" stroke="${c.atrament}" stroke-width="2.4"><ellipse cx="36" cy="58" rx="14" ry="11" transform="rotate(-25 36 58)"/><ellipse cx="64" cy="58" rx="14" ry="11" transform="rotate(25 64 58)"/><ellipse cx="40" cy="76" rx="9" ry="7" transform="rotate(20 40 76)" fill="${c.cyjan}"/><ellipse cx="60" cy="76" rx="9" ry="7" transform="rotate(-20 60 76)" fill="${c.cyjan}"/></g><rect x="47" y="54" width="6" height="30" rx="3" fill="${c.atrament}"/>`,
  }),
  tygrys: u => ({
    defs: '',
    body: `<rect width="100" height="100" fill="${c.limonka}"/>${[14, 38, 62, 86].map((y, i) => `<path d="M-4 ${y}l12 -8 12 8 12 -8 12 8 12 -8 12 8 12 -8 12 8 12 -8" fill="none" stroke="${i % 2 ? c.roz : c.atrament}" stroke-width="6" stroke-linejoin="round"/>`).join('')}<rect x="30" y="30" width="40" height="40" rx="6" fill="${c.brzoskwinia}" stroke="${c.atrament}" stroke-width="3"/><path d="M30 44h40M50 30v14" stroke="${c.atrament}" stroke-width="3"/>`,
  }),
  neonbabci: u => ({
    defs: `${lin(`${u}-bg`, c.cyjan, c.roz, 0, 1)}${gloss(u)}`,
    body: `<rect width="100" height="100" fill="url(#${u}-bg)"/><rect x="16" y="28" width="68" height="44" rx="8" fill="${c.chromJasny}" stroke="${c.atrament}" stroke-width="3"/><rect x="26" y="36" width="48" height="18" rx="9" fill="${c.atrament}"/><circle cx="38" cy="45" r="6" fill="${c.limonka}"/><circle cx="62" cy="45" r="6" fill="${c.limonka}"/><path d="M30 72l6 -10h28l6 10" fill="none" stroke="${c.atrament}" stroke-width="3" stroke-linejoin="round"/><rect x="16" y="28" width="68" height="44" rx="8" fill="url(#${u}-gl)"/><path d="${starPath(84, 16, 6)}" fill="#FFFFFF"/>`,
  }),
};

export const coverIds = Object.keys(covers);

let counter = 0;

export const cover = (id, { size = 100, radius = 0, uid } = {}) => {
  const make = covers[id];
  if (!make) throw new Error(`bis: no cover for ${id}`);
  counter += 1;
  const u = uid ?? `cv${id}${counter}`;
  const { defs, body } = make(u);
  const clip = radius ? `<clipPath id="${u}-r"><rect width="100" height="100" rx="${radius}"/></clipPath>` : '';
  return `<svg class="b-cover" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><defs>${defs}${clip}</defs><g${radius ? ` clip-path="url(#${u}-r)"` : ''}>${body}</g></svg>`;
};

const avatarShapes = {
  star: `<path d="${starPath(50, 52, 26, 0.3)}" fill="${c.atrament}"/>`,
  drop: `<path d="M50 24C60 40 68 50 68 60a18 18 0 0 1-36 0c0-10 8-20 18-36Z" fill="${c.atrament}"/>`,
  flower: `<g fill="${c.atrament}">${[0, 72, 144, 216, 288].map(a => `<circle cx="${r1(50 + 14 * Math.cos(((a - 90) * Math.PI) / 180))}" cy="${r1(52 + 14 * Math.sin(((a - 90) * Math.PI) / 180))}" r="10"/>`).join('')}</g><circle cx="50" cy="52" r="7" fill="#FFFFFF"/>`,
  moon: `<path d="M60 26a26 26 0 1 0 12 40 20 20 0 1 1-12-40Z" fill="${c.atrament}"/>`,
  heart: `<path d="M50 74C30 60 26 50 26 42a12 12 0 0 1 24-3 12 12 0 0 1 24 3c0 8-4 18-24 32Z" fill="${c.atrament}"/>`,
  bolt: `<path d="M56 22 34 56h14l-6 24 24-36H52Z" fill="${c.atrament}"/>`,
};

export const avatar = (shape, tone, size = 40) => {
  counter += 1;
  const u = `av${counter}`;
  return `<svg class="b-avatar" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><defs>${gloss(u)}</defs><circle cx="50" cy="50" r="50" fill="${tones[tone]}"/>${avatarShapes[shape]}<circle cx="50" cy="50" r="50" fill="url(#${u}-gl)"/></svg>`;
};

export const groundDefs = id => `<filter id="${id}-brush" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.4 -0.55"/></filter>`;
