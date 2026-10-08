import type { BezierPreset, FontFaceSpec, MotionPreset, SpringPreset } from '../../shared/types';

export const color = {
  ground: '#EEF2F6',
  card: '#FFFFFF',
  left: '#DCE3EB',
  right: '#C3CEDA',
  ink: '#15202B',
  secondary: '#4E5D6C',
  sun: '#F2A100',
  sunText: '#965E00',
  sunTint: '#FCEAC7',
  battery: '#2E9F5B',
  batteryText: '#1F7A43',
  batteryTint: '#D5ECDE',
  home: '#3A6FD8',
  homeTint: '#D8E2F7',
  grid: '#6B7C8F',
  gridText: '#5F6F82',
  panel: '#2A3F5A',
  surface: '#FFFFFF',
  grouped: '#EEF2F6',
} as const;

export type Hue = 'sun' | 'battery' | 'home' | 'grid';

export const hue = {
  sun: { line: color.sun, text: color.sunText, tint: color.sunTint },
  battery: { line: color.battery, text: color.batteryText, tint: color.batteryTint },
  home: { line: color.home, text: color.home, tint: color.homeTint },
  grid: { line: color.grid, text: color.gridText, tint: color.left },
} as const;

export const palette = [
  { id: 'ground', name: 'Mgła', role: 'tło ekranów i sceny izometrycznej', hex: color.ground },
  { id: 'card', name: 'Biel', role: 'górne ściany brył, karty, pola', hex: color.card },
  { id: 'left', name: 'Cień lewy', role: 'lewe ściany brył, linie siatki wykresu', hex: color.left },
  { id: 'right', name: 'Cień prawy', role: 'prawe ściany brył, krawędzie kart', hex: color.right },
  { id: 'ink', name: 'Grafit', role: 'tekst główny i duże liczby', hex: color.ink },
  { id: 'secondary', name: 'Łupek', role: 'opisy, osie, jednostki', hex: color.secondary },
  { id: 'sun', name: 'Słońce', role: 'produkcja: linie, kreski przepływu, tarcza słońca', hex: color.sun },
  { id: 'sunText', name: 'Słońce, tekst', role: 'liczby i etykiety produkcji na bieli', hex: color.sunText },
  { id: 'sunTint', name: 'Słońce, tło', role: 'pole nadwyżki, okno czasu w poradzie', hex: color.sunTint },
  { id: 'battery', name: 'Magazyn', role: 'poziom baterii, ładowanie, przepływ do magazynu', hex: color.battery },
  { id: 'batteryText', name: 'Magazyn, tekst', role: 'liczby i etykiety magazynu na bieli', hex: color.batteryText },
  { id: 'batteryTint', name: 'Magazyn, tło', role: 'pole pod krzywą naładowania', hex: color.batteryTint },
  { id: 'home', name: 'Dom', role: 'zużycie: linia, przepływ do domu, liczby', hex: color.home },
  { id: 'homeTint', name: 'Dom, tło', role: 'pola zużycia i karta porady', hex: color.homeTint },
  { id: 'grid', name: 'Sieć', role: 'przepływ do sieci, słup, linie', hex: color.grid },
  { id: 'gridText', name: 'Sieć, tekst', role: 'liczby i etykiety sieci na bieli', hex: color.gridText },
  { id: 'panel', name: 'Panel', role: 'ogniwa paneli na dachu i w ikonie', hex: color.panel },
] as const;

export const family = 'Poludnie Archivo';
export const fontFamily = `'${family}', 'Arial Narrow', Arial, sans-serif`;

export const fonts: FontFaceSpec[] = [{ family, file: 'fonts/archivo-variable.ttf', weight: '100 900', stretch: '62% 125%' }];

export const type = {
  hero: { family: 'Archivo', size: 88, line: 84, weight: 800, width: 75 },
  number: { family: 'Archivo', size: 40, line: 42, weight: 800, width: 75 },
  title: { family: 'Archivo', size: 30, line: 36, weight: 700, width: 100 },
  headline: { family: 'Archivo', size: 17, line: 22, weight: 600, width: 87.5 },
  body: { family: 'Archivo', size: 15, line: 21, weight: 400, width: 100 },
  label: { family: 'Archivo', size: 13, line: 17, weight: 500, width: 100 },
} as const;

export const num = { fontWeight: 800, fontStretch: '75%', fontVariantNumeric: 'tabular-nums lining-nums' } as const;
export const semi = { fontWeight: 600, fontStretch: '87.5%' } as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, side: 22 } as const;

export const radius = { card: 14, chip: 999, tile: 10 } as const;

export const slab = (depth = 4) => `0 ${depth}px 0 ${color.right}, 0 ${depth + 10}px 22px rgba(21,32,43,0.06)`;

export const draw: BezierPreset = {
  id: 'draw',
  use: 'linie wykresów i ścieżki energii',
  kind: 'bezier',
  points: [0.65, 0, 0.35, 1],
  ms: 1333,
  note: 'pathLength od 0 do 1 w 40 klatek; linia rusza powoli, przyspiesza w środku dnia i dojeżdża łagodnie',
};

export const count: BezierPreset = {
  id: 'count',
  use: 'liczby',
  kind: 'bezier',
  points: [0.22, 1, 0.36, 1],
  ms: 1000,
  note: '30 klatek, szybki start i długie dojście; wynik stoi potem co najmniej 45 klatek, żeby dało się go przeczytać',
};

export const rise: SpringPreset = {
  id: 'rise',
  use: 'bryły izometryczne i karty',
  kind: 'spring',
  mass: 1,
  stiffness: 200,
  damping: 24,
  note: 'wjazd o 12 pikseli wzdłuż pionu izometrii, bez widocznego odbicia; kolejne karty co 4 klatki',
};

export const track: BezierPreset = {
  id: 'track',
  use: 'kamera między częściami sceny',
  kind: 'bezier',
  points: [0.45, 0, 0.55, 1],
  ms: 800,
  note: '24 klatki wzdłuż osi izometrii pod kątem 30 stopni, nigdy na skos ekranu',
};

export const focus: BezierPreset = {
  id: 'focus',
  use: 'jedna informacja na ujęcie',
  kind: 'bezier',
  points: [0.33, 1, 0.68, 1],
  ms: 400,
  note: 'kolor wiodący zostaje w 100%, pozostałe przepływy i karty schodzą do 40% w 12 klatek',
};

export const flow: BezierPreset = {
  id: 'flow',
  use: 'kreski na ścieżkach energii',
  kind: 'bezier',
  points: [0, 0, 1, 1],
  ms: 600,
  note: 'kreska 8, przerwa 10, prędkość 1 piksel na klatkę na każdy kilowat; jedyny ruch liniowy, bo pokazuje moc',
};

export const motion: MotionPreset[] = [draw, count, rise, track, focus, flow];

export const linear: BezierPreset = {
  id: 'linear',
  use: 'porównanie w laboratorium',
  kind: 'bezier',
  points: [0, 0, 1, 1],
  ms: 1333,
  note: 'ten sam czas, stała prędkość',
};
