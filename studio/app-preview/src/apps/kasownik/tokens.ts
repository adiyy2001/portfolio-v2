import type { FontFaceSpec, MotionPreset, SpringPreset, BezierPreset } from '../../shared/types';

export const color = {
  brand: '#00864F',
  brandDeep: '#006B3F',
  brandTint: '#E3F4EC',
  ink: '#101418',
  secondary: '#5B6470',
  tertiary: '#8A929C',
  separator: '#E4E7EB',
  grouped: '#F2F4F6',
  surface: '#FFFFFF',
} as const;

export const palette = [
  { id: 'brand', name: 'Zieleń tramwaju', role: 'przyciski, pasek ważności, ikona', hex: color.brand },
  { id: 'brandDeep', name: 'Zieleń głęboka', role: 'stan wciśnięcia, mały tekst na tincie', hex: color.brandDeep },
  { id: 'brandTint', name: 'Tinta', role: 'zaznaczone wiersze, tło ważnego biletu', hex: color.brandTint },
  { id: 'ink', name: 'Atrament', role: 'tekst główny', hex: color.ink },
  { id: 'secondary', name: 'Grafit', role: 'tekst drugorzędny', hex: color.secondary },
  { id: 'tertiary', name: 'Szary', role: 'podpowiedzi, tylko duży tekst', hex: color.tertiary },
  { id: 'separator', name: 'Linia', role: 'separatory list', hex: color.separator },
  { id: 'grouped', name: 'Tło grupowane', role: 'tło ekranów z listami', hex: color.grouped },
  { id: 'surface', name: 'Biel', role: 'karty, arkusze, pasek kart', hex: color.surface },
] as const;

export const family = 'Onest';

export const fonts: FontFaceSpec[] = [
  { family, file: 'fonts/onest-variable.ttf', weight: '100 900' },
];

export const type = {
  largeTitle: { size: 34, line: 41, weight: 800 },
  title: { size: 22, line: 28, weight: 700 },
  headline: { size: 17, line: 22, weight: 600 },
  body: { size: 17, line: 22, weight: 400 },
  callout: { size: 16, line: 21, weight: 500 },
  caption: { size: 13, line: 18, weight: 500 },
  clock: { size: 56, line: 60, weight: 700 },
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const radius = { row: 12, card: 18, sheet: 16, button: 14, pill: 999 } as const;

export const shadow = {
  card: '0 1px 2px rgba(16,20,24,0.06), 0 6px 20px rgba(16,20,24,0.07)',
  lift: '0 2px 4px rgba(16,20,24,0.08), 0 18px 40px rgba(16,20,24,0.14)',
  sheet: '0 -4px 24px rgba(16,20,24,0.12)',
} as const;

export const push: SpringPreset = {
  id: 'push',
  use: 'przejście między ekranami',
  kind: 'spring',
  mass: 1,
  stiffness: 300,
  damping: 32,
  note: 'bez widocznego przestrzelenia, około 380 ms',
};

export const sheet: SpringPreset = {
  id: 'sheet',
  use: 'arkusze od dołu',
  kind: 'spring',
  mass: 1,
  stiffness: 260,
  damping: 28,
  note: 'arkusz dojeżdża miękko, tło przyciemnia się krzywą 400 ms',
};

export const hero: SpringPreset = {
  id: 'hero',
  use: 'karta biletu rośnie do pełnego ekranu',
  kind: 'spring',
  mass: 1,
  stiffness: 220,
  damping: 26,
  note: 'element współdzielony, przestrzelenie poniżej 2%',
};

export const press: BezierPreset = {
  id: 'press',
  use: 'wciśnięcie przycisku i wiersza',
  kind: 'bezier',
  points: [0.25, 0.1, 0.25, 1],
  ms: 120,
  note: 'skala 0,97, powrót na sprężynie push',
};

export const fade: BezierPreset = {
  id: 'fade',
  use: 'tekst i treść drugorzędna',
  kind: 'bezier',
  points: [0.25, 0.1, 0.25, 1],
  ms: 250,
  note: 'kolejne wiersze co 40 ms',
};

export const scrim: BezierPreset = {
  id: 'scrim',
  use: 'przyciemnienie pod arkuszem',
  kind: 'bezier',
  points: [0.32, 0.72, 0, 1],
  ms: 400,
  note: 'czerń od 0 do 30%',
};

export const live: BezierPreset = {
  id: 'live',
  use: 'pasek ważności i fala kodu',
  kind: 'bezier',
  points: [0.45, 0, 0.55, 1],
  ms: 667,
  note: 'pasek przesuwa się w cyklu 2,4 s, fala kodu od środka w 20 klatek',
};

export const motion: MotionPreset[] = [push, sheet, hero, press, fade, scrim, live];

export const liveCycleFrames = 72;
export const staggerFrames = 1.2;
