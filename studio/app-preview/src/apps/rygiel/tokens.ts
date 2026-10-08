import type { BezierPreset, FontFaceSpec, MotionPreset, StepsPreset } from '../../shared/types';

export const color = {
  void: '#05070B',
  panel: '#0A1018',
  grid: '#12303A',
  dim: '#1D4A57',
  cyan: '#2CF6FF',
  text: '#D9FBFF',
  muted: '#7FA6B0',
  alert: '#FF3D71',
  warn: '#FFB547',
  surface: '#05070B',
  grouped: '#0A1018',
} as const;

export const palette = [
  { id: 'void', name: 'Próżnia', role: 'tło każdego ekranu, tekst na cyjanie', hex: color.void },
  { id: 'panel', name: 'Panel', role: 'karty, pola, wiersze listy', hex: color.panel },
  { id: 'grid', name: 'Siatka', role: 'linie siatki w tle, puste segmenty', hex: color.grid },
  { id: 'dim', name: 'Obrys przygaszony', role: 'obrysy kart i pól w spoczynku', hex: color.dim },
  { id: 'cyan', name: 'Neon cyjan', role: 'bezpiecznie, fokus, przycisk główny, linia skanu', hex: color.cyan },
  { id: 'text', name: 'Tekst', role: 'tekst główny', hex: color.text },
  { id: 'muted', name: 'Tekst przygaszony', role: 'etykiety, daty, objaśnienia', hex: color.muted },
  { id: 'alert', name: 'Alarm', role: 'tylko wyciek: karta alertu, to, co wyciekło', hex: color.alert },
  { id: 'warn', name: 'Ostrzeżenie', role: 'hasła słabe i powtórzone', hex: color.warn },
] as const;

export const mono = 'Azeret Mono';
export const display = 'Oxanium';

export const fonts: FontFaceSpec[] = [
  { family: mono, file: 'fonts/azeret-mono-variable.ttf', weight: '100 900' },
  { family: display, file: 'fonts/oxanium-variable.ttf', weight: '200 800' },
];

export const type = {
  display: { family: 'Oxanium', size: 64, line: 64, weight: 800 },
  title: { family: 'Azeret Mono', size: 24, line: 30, weight: 700 },
  headline: { family: 'Azeret Mono', size: 17, line: 23, weight: 700 },
  body: { family: 'Azeret Mono', size: 15, line: 22, weight: 400 },
  label: { family: 'Azeret Mono', size: 12, line: 16, weight: 500 },
  password: { family: 'Azeret Mono', size: 30, line: 48, weight: 500 },
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, side: 24 } as const;

export const line = { hair: 1, outline: 1.5, scan: 2 } as const;

export const glow = (hex: string, alpha: number, blur = 12) => {
  const n = parseInt(hex.slice(1), 16);
  return `0 0 ${blur}px rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

export const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

export const scramble: StepsPreset = {
  id: 'scramble',
  use: 'odsłanianie tekstu',
  kind: 'steps',
  steps: 4,
  ms: 267,
  note: 'każdy znak losuje znaki ze swojej klasy przez 6 do 10 klatek, zmiana co 2 klatki, potem staje; od lewej, 2 klatki odstępu na znak; gotowy tekst stoi co najmniej 1,5 s',
};

export const scan: BezierPreset = {
  id: 'scan',
  use: 'odblokowanie, alert i zmiana ekranu',
  kind: 'bezier',
  points: [0.65, 0, 0.35, 1],
  ms: 1000,
  note: 'linia 2 px w cyjanie z poświatą jedzie z góry na dół w 30 klatek i odsłania to, co pod nią; zmiana ekranu w 20 klatek',
};

export const pulse: BezierPreset = {
  id: 'pulse',
  use: 'pierścień alertu i poświata fokusu',
  kind: 'bezier',
  points: [0.37, 0, 0.63, 1],
  ms: 1200,
  note: 'krycie poświaty od 0,35 do 0,6 i z powrotem, okres 36 klatek, sinusoida',
};

export const draw: BezierPreset = {
  id: 'draw',
  use: 'obrysy, oś czasu, rygiel w ikonie',
  kind: 'bezier',
  points: [0.33, 1, 0.68, 1],
  ms: 600,
  note: 'kreska rysuje się w 18 klatek',
};

export const step: StepsPreset = {
  id: 'step',
  use: 'wiersze list',
  kind: 'steps',
  steps: 1,
  ms: 100,
  note: '3 klatki odstępu między wierszami; wiersz wchodzi przez odszyfrowanie, nigdy przez przesunięcie',
};

export const drift: StepsPreset = {
  id: 'drift',
  use: 'siatka w tle, ruch ciągły',
  kind: 'steps',
  steps: 1,
  ms: 133,
  note: '1 piksel na 4 klatki, stała prędkość; jedyny ruch liniowy, bo to tło, a nie interfejs',
};

export const motion: MotionPreset[] = [scramble, scan, pulse, draw, step, drift];

export const gridCell = 24;
