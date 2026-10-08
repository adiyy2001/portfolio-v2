import type { BezierPreset, FontFaceSpec, MotionPreset, SpringPreset, StepsPreset } from '../../shared/types';

export const color = {
  ground: '#FFE6D6',
  card: '#FFF5EE',
  pistachio: '#BFE29A',
  leaf: '#7DBE5A',
  butter: '#FFE07A',
  blush: '#FFC2CC',
  terracotta: '#E8896B',
  water: '#AEE3D3',
  ink: '#4A2C2A',
  inkSoft: '#7A5650',
  surface: '#FFF5EE',
  grouped: '#FFE6D6',
} as const;

export type Tone = 'ground' | 'card' | 'pistachio' | 'leaf' | 'butter' | 'blush' | 'terracotta' | 'water';

export const palette = [
  { id: 'ground', name: 'Brzoskwinia', role: 'tło każdego ekranu i sceny', hex: color.ground },
  { id: 'card', name: 'Śmietanka', role: 'karty, pola, kafle dni', hex: color.card },
  { id: 'pistachio', name: 'Pistacja', role: 'roślina zdrowa, podlane, głowa maskotki', hex: color.pistachio },
  { id: 'leaf', name: 'Liść', role: 'liście maskotki i drobne akcenty, nigdy pod tekstem', hex: color.leaf },
  { id: 'butter', name: 'Masło', role: 'dziś, wybrane, aktywna zakładka', hex: color.butter },
  { id: 'blush', name: 'Róż', role: 'roślina potrzebuje uwagi, obudowa telefonu', hex: color.blush },
  { id: 'terracotta', name: 'Terakota', role: 'doniczki, tylko dekoracja', hex: color.terracotta },
  { id: 'water', name: 'Woda', role: 'krople, wilgotność, ilość wody', hex: color.water },
  { id: 'ink', name: 'Śliwkowy brąz', role: 'tekst, oczy maskotki, ikony', hex: color.ink },
  { id: 'inkSoft', name: 'Brąz łagodny', role: 'objaśnienia na brzoskwini, śmietance, maśle i wodzie', hex: color.inkSoft },
] as const;

export const family = 'Kielek Rounded';
export const fontFamily = `'${family}', 'Arial Rounded MT Bold', sans-serif`;

export const fonts: FontFaceSpec[] = [
  { family, file: 'fonts/mplus-rounded-1c-500.ttf', weight: '500' },
  { family, file: 'fonts/mplus-rounded-1c-800.ttf', weight: '800' },
  { family, file: 'fonts/mplus-rounded-1c-900.ttf', weight: '900' },
];

export const type = {
  display: { family: 'M PLUS Rounded 1c', size: 40, line: 44, weight: 900 },
  title: { family: 'M PLUS Rounded 1c', size: 28, line: 34, weight: 900 },
  headline: { family: 'M PLUS Rounded 1c', size: 18, line: 24, weight: 800 },
  body: { family: 'M PLUS Rounded 1c', size: 15, line: 21, weight: 500 },
  label: { family: 'M PLUS Rounded 1c', size: 13, line: 17, weight: 800 },
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, side: 24 } as const;

export const radius = { chip: 20, card: 28, tile: 32, pill: 999 } as const;

export const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

export const clay = (lift = 1, inner = 1) =>
  [
    `inset ${5 * inner}px ${5 * inner}px ${10 * inner}px rgba(255,255,255,0.7)`,
    `inset ${-5 * inner}px ${-7 * inner}px ${12 * inner}px ${rgba(color.ink, 0.12)}`,
    `0 ${8 * lift}px ${24 * lift}px ${rgba(color.ink, 0.18)}`,
  ].join(', ');

export const clayFlat = (inner = 1) =>
  [
    `inset ${3 * inner}px ${3 * inner}px ${6 * inner}px rgba(255,255,255,0.65)`,
    `inset ${-3 * inner}px ${-4 * inner}px ${8 * inner}px ${rgba(color.ink, 0.1)}`,
  ].join(', ');

export const clayPressed = [
  `inset 4px 5px 10px ${rgba(color.ink, 0.14)}`,
  `inset -3px -3px 8px rgba(255,255,255,0.6)`,
].join(', ');

export const bounce: SpringPreset = {
  id: 'bounce',
  use: 'karty, przyciski, wejście maskotki',
  kind: 'spring',
  mass: 1,
  stiffness: 180,
  damping: 12,
  note: 'wyraźne przestrzelenie, około 20%, i dwa miękkie odbicia, spokój po około 0,86 s; każda karta dojeżdża jak napompowana',
};

export const squash: BezierPreset = {
  id: 'squash',
  use: 'lądowanie',
  kind: 'bezier',
  points: [0.33, 1, 0.68, 1],
  ms: 133,
  note: 'przy zetknięciu skala pionowa 0,88 i pozioma 1,1 przez 4 klatki, potem powrót na sprężynie bounce',
};

export const puff: SpringPreset = {
  id: 'puff',
  use: 'chipy, znaczniki, napisy',
  kind: 'spring',
  mass: 1,
  stiffness: 260,
  damping: 14,
  note: 'skala od 0 do 1, cień rośnie razem z kształtem przez 6 klatek',
};

export const drop: BezierPreset = {
  id: 'drop',
  use: 'krople wody',
  kind: 'bezier',
  points: [0.55, 0, 1, 0.45],
  ms: 467,
  note: 'spadek z przyspieszeniem w 14 klatek, a po zetknięciu squash i trzy kropelki rozprysku',
};

export const wiggle: SpringPreset = {
  id: 'wiggle',
  use: 'liście w spoczynku',
  kind: 'spring',
  mass: 1,
  stiffness: 120,
  damping: 6,
  note: 'obrót o ±4° co 50 klatek, liście maskotki nigdy nie stoją zupełnie nieruchomo',
};

export const stagger: StepsPreset = {
  id: 'stagger',
  use: 'listy i siatki',
  kind: 'steps',
  steps: 1,
  ms: 167,
  note: '5 klatek odstępu między elementami listy, każdy wjeżdża na sprężynie bounce; w kalendarzu 5 klatek między tygodniami',
};

export const motion: MotionPreset[] = [bounce, squash, puff, drop, wiggle, stagger];

export const stiff: SpringPreset = {
  id: 'stiff',
  use: 'porównanie w laboratorium',
  kind: 'spring',
  mass: 1,
  stiffness: 260,
  damping: 34,
  note: 'sztywna sprężyna bez przestrzelenia, do porównania z bounce',
};
