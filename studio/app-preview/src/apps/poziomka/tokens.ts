import type { FontFaceSpec, MotionPreset, StepsPreset } from '../../shared/types';

export const hex = [
  '#140C1C',
  '#3B2440',
  '#6B3E5E',
  '#A23B4E',
  '#E0474F',
  '#FF8F8F',
  '#F7C873',
  '#FFF3C4',
  '#2D5A3A',
  '#4FA34A',
  '#A6DE5C',
  '#2B4C8C',
  '#4F8FE0',
  '#9ED8FF',
  '#8A7F86',
  '#FFFFFF',
] as const;

export const C = {
  ink: 0,
  plum: 1,
  dusk: 2,
  berryDeep: 3,
  berry: 4,
  berryLight: 5,
  gold: 6,
  cream: 7,
  forest: 8,
  leaf: 9,
  sprout: 10,
  blueDeep: 11,
  skyMid: 12,
  sky: 13,
  stone: 14,
  white: 15,
} as const;

export type ColorName = keyof typeof C;

export const color = {
  surface: hex[C.cream],
  grouped: hex[C.sky],
  ink: hex[C.ink],
} as const;

export const palette = [
  { id: 'ink', name: 'Atrament', role: 'kontury, tekst, ramka telefonu', hex: hex[0] },
  { id: 'plum', name: 'Śliwka', role: 'pasek poziomu, zakładki, panele na ciemnym', hex: hex[1] },
  { id: 'dusk', name: 'Zmierzch', role: 'drugi poziom tekstu, cień pod sprite’ami', hex: hex[2] },
  { id: 'berryDeep', name: 'Głęboka poziomka', role: 'cień owocu, skrzynia, miedź konewki', hex: hex[3] },
  { id: 'berry', name: 'Poziomka', role: 'owoc, słupki tygodnia, kolor marki', hex: hex[4] },
  { id: 'berryLight', name: 'Jasna poziomka', role: 'blask na owocu, zaznaczenie', hex: hex[5] },
  { id: 'gold', name: 'Złoto', role: 'monety XP, pasek doświadczenia, nagłówki na ciemnym', hex: hex[6] },
  { id: 'cream', name: 'Krem', role: 'panele, karty zadań, kafle passy', hex: hex[7] },
  { id: 'forest', name: 'Las', role: 'ciemne liście, cień trawy', hex: hex[8] },
  { id: 'leaf', name: 'Liść', role: 'liście, trawa, odhaczone zadanie', hex: hex[9] },
  { id: 'sprout', name: 'Kiełek', role: 'jasne liście, znak odhaczenia', hex: hex[10] },
  { id: 'blueDeep', name: 'Głęboki błękit', role: 'górny pas nieba, cień chmur', hex: hex[11] },
  { id: 'skyMid', name: 'Błękit', role: 'środkowy pas nieba', hex: hex[12] },
  { id: 'sky', name: 'Jasny błękit', role: 'tło ekranów i strony', hex: hex[13] },
  { id: 'stone', name: 'Kamień', role: 'puste kafle, linie wykresu, tylko grafika', hex: hex[14] },
  { id: 'white', name: 'Biel', role: 'blask, chmury, oczy poziomki', hex: hex[15] },
] as const;

export const fonts: FontFaceSpec[] = [];

export const type = {
  pixel: { family: 'Poziomka Pixel (bitmapa z Jersey 10)', size: 10, line: 14, weight: 400 },
  pixelBig: { family: 'Poziomka Pixel ×2', size: 20, line: 26, weight: 400 },
  mini: { family: 'Poziomka Mini (bitmapa z Tiny5)', size: 5, line: 9, weight: 400 },
} as const;

export const grid = {
  storeArt: { cols: 221, rows: 480, px: 4 },
  marketingArt: { px: 2, chunky: 2 },
  tileArt: { cols: 120, rows: 90, px: 4 },
} as const;

const step = (id: string, use: string, steps: number, ms: number, note: string): StepsPreset => ({
  id,
  use,
  kind: 'steps',
  steps,
  ms,
  note,
});

export const tick = step('tick', 'tempo animacji sprite’ów', 1, 133, 'nowa poza co 4 klatki, czyli 7,5 klatki na sekundę; między pozami nic się nie przesuwa');
export const walk = step('walk', 'skok poziomki', 4, 533, '4 pozy po 4 klatki, wysokość w całych pikselach: 0, 3, 5 i 3, przy lądowaniu poziomka spłaszcza się o 1 piksel');
export const pop = step('pop', 'monety i +XP', 3, 533, 'moneta obraca się w 3 pozach, liczba rośnie o 1 piksel co 2 klatki przez 16 klatek i znika w 2 krokach ditheringu');
export const fill = step('fill', 'pasek XP', 1, 33, '1 piksel na klatkę, bez wygładzania; 10 XP to 7 pikseli paska');
export const blink = step('blink', 'zaznaczenie i nowy poziom', 6, 1200, '6 klatek zapalone, 6 zgaszone, trzy razy');
export const wipe = step('wipe', 'zmiana ekranu', 8, 533, 'pas szachownicy wysoki na 16 pikseli schodzi z góry w 8 krokach po 2 klatki');

export const motion: MotionPreset[] = [tick, walk, pop, fill, blink, wipe];

export const walkHeights = [0, 3, 5, 3] as const;
