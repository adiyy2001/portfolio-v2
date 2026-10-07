import type { BezierPreset, FontFaceSpec, MotionPreset, StepsPreset } from '../../shared/types';

export const color = {
  ground: '#000000',
  raised: '#141414',
  divider: '#2A2A2A',
  secondary: '#8C8C8C',
  ink: '#FFFFFF',
  signal: '#FF5A00',
  surface: '#000000',
  grouped: '#141414',
} as const;

export const palette = [
  { id: 'ground', name: 'Czerń', role: 'tło każdego ekranu, tekst na pomarańczu', hex: color.ground },
  { id: 'raised', name: 'Grafit', role: 'przyciski drugorzędne, podniesione pola', hex: color.raised },
  { id: 'divider', name: 'Linia', role: 'separatory, puste znaczniki serii', hex: color.divider },
  { id: 'secondary', name: 'Popiół', role: 'etykiety i tekst drugorzędny', hex: color.secondary },
  { id: 'ink', name: 'Biel', role: 'liczby, nazwy ćwiczeń, tekst główny', hex: color.ink },
  { id: 'signal', name: 'Sygnał', role: 'jedyny kolor: przycisk, rekord, odwrócenia', hex: color.signal },
] as const;

export const family = 'Anybody';

export const fonts: FontFaceSpec[] = [
  { family, file: 'fonts/anybody-variable.ttf', weight: '100 900', stretch: '50% 150%' },
];

export const type = {
  hero: { size: 300, line: 0.82, weight: 900, width: '50 do 150' },
  display: { size: 56, line: 0.9, weight: 900, width: '75 do 150' },
  title: { size: 40, line: 1, weight: 900, width: '100' },
  label: { size: 15, line: 1.2, weight: 700, width: '75' },
  body: { size: 17, line: 1.3, weight: 600, width: '100' },
  small: { size: 14, line: 1.3, weight: 500, width: '100' },
} as const;

export const space = { s: 8, m: 16, l: 24, xl: 32, side: 24 } as const;

export const beatFrames = 15;

export const beat: StepsPreset = {
  id: 'beat',
  use: 'siatka rytmu dla każdego cięcia i wejścia',
  kind: 'steps',
  steps: 1,
  ms: 500,
  note: '120 BPM przy 30 kl./s, czyli cięcie co 15 klatek; każde ujęcie zaczyna się na wielokrotności 15',
};

export const slam: BezierPreset = {
  id: 'slam',
  use: 'wejście słów i liczb',
  kind: 'bezier',
  points: [0.9, 0, 0.1, 1],
  ms: 267,
  note: '8 klatek, ze skali 140% do 100%, pojawia się od razu, bez przenikania',
};

export const stretch: BezierPreset = {
  id: 'stretch',
  use: 'oś szerokości kroju',
  kind: 'bezier',
  points: [0.16, 1, 0.3, 1],
  ms: 400,
  note: 'szerokość od 50 do 150 w 12 klatek, zawsze na uderzeniu; rozmiar dopasowuje się tak, żeby liczba trzymała szerokość ekranu',
};

export const punch: BezierPreset = {
  id: 'punch',
  use: 'uderzenie kamery w wersji marketingowej',
  kind: 'bezier',
  points: [0.2, 0.9, 0.1, 1],
  ms: 133,
  note: 'skala od 1 do 1,12 w 4 klatki i powrót w 10, co czwarte uderzenie',
};

export const invert: StepsPreset = {
  id: 'invert',
  use: 'odwrócenie kolorów na akcentach',
  kind: 'steps',
  steps: 1,
  ms: 500,
  note: 'czerń i pomarańcz zamieniają się twardym cięciem na dokładnie 15 klatek',
};

export const count: StepsPreset = {
  id: 'count',
  use: 'cyfry minutnika',
  kind: 'steps',
  steps: 1,
  ms: 1000,
  note: 'każda cyfra tnie się bez przejścia; w przyspieszeniu minutnik skacze o 2 do 3 sekund na klatkę',
};

export const motion: MotionPreset[] = [beat, slam, stretch, punch, invert, count];
