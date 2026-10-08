export const app = {
  slug: 'poziomka',
  name: 'Poziomka',
  category: 'Tracker nawyków z grywalizacją',
  city: 'cała Polska',
  zone: '4 nawyki, poziom 7, passa 21 dni',
  tagline: 'Codzienne nawyki jako zadania z punktami doświadczenia, poziomy, passa, która hoduje ogródek, i tydzień w słupkach.',
};

export interface Habit {
  id: 'water' | 'walk' | 'book' | 'phone';
  title: string;
  when: string;
  xp: number;
}

export const habits: Habit[] = [
  { id: 'water', title: 'Szklanka wody po przebudzeniu', when: 'rano, codziennie', xp: 10 },
  { id: 'walk', title: '20 minut spaceru', when: 'przed pracą', xp: 30 },
  { id: 'book', title: '15 stron książki', when: 'wieczorem', xp: 20 },
  { id: 'phone', title: 'Telefon odłożony o 22:30', when: 'przed snem', xp: 40 },
];

export const level = {
  current: 7,
  next: 8,
  from: 1000,
  to: 1200,
  nextTo: 1400,
  start: 1160,
  barWidth: 140,
};

export const xpAfter = (done: Habit['id'][]) => level.start + habits.filter(h => done.includes(h.id)).reduce((sum, h) => sum + h.xp, 0);

export const barPixels = (xp: number, from = level.from, to = level.to, width = level.barWidth) =>
  Math.max(0, Math.min(width, Math.floor(((xp - from) / (to - from)) * width)));

export const today = {
  time: '7:42',
  date: 'Czwartek, 8 października',
  title: 'Zadania na dziś',
  done: ['water', 'walk'] as Habit['id'][],
};

export const streak = {
  time: '7:43',
  title: 'Passa',
  days: 21,
  first: { day: 18, month: 9 },
  weekdays: ['Pt', 'So', 'Nd', 'Pn', 'Wt', 'Śr', 'Cz'],
  dates: Array.from({ length: 21 }, (_, i) => (i < 13 ? 18 + i : i - 12)),
  rule: 'Passa trwa, dopóki robisz choć jedno zadanie dziennie.',
  best: 'Najdłuższa passa: 21 dni',
  next: 'Za 7 dni: złota motyka',
};

export const garden = {
  time: '7:44',
  title: 'Ogródek',
  stages: [
    { id: 'nasionko', label: 'nasionko', from: 1 },
    { id: 'listek', label: 'listek', from: 4 },
    { id: 'sadzonka', label: 'sadzonka', from: 8 },
    { id: 'kwiat', label: 'kwiat', from: 14 },
    { id: 'owoc', label: 'owoc', from: 21 },
  ],
  items: [
    { id: 'rake', name: 'Grabki', days: 7 },
    { id: 'fence', name: 'Płotek', days: 14 },
    { id: 'can', name: 'Miedziana konewka', days: 21 },
  ],
  unlock: 'Miedziana konewka',
  unlockNote: 'za passę 21 dni',
  stageLine: 'Etap 5 z 5: owoc',
};

export const week = {
  time: '7:45',
  title: 'Tydzień',
  range: '2 do 8 października',
  days: [
    { label: 'Pt', xp: 100 },
    { label: 'So', xp: 60 },
    { label: 'Nd', xp: 100 },
    { label: 'Pn', xp: 70 },
    { label: 'Wt', xp: 100 },
    { label: 'Śr', xp: 80 },
    { label: 'Cz', xp: 40 },
  ],
  best: 'Najdłuższa passa: 21 dni',
  top: 'Woda 7 z 7 dni',
  matrix: {
    water: [1, 1, 1, 1, 1, 1, 1],
    walk: [1, 1, 1, 0, 1, 1, 1],
    book: [1, 1, 1, 1, 1, 0, 0],
    phone: [1, 0, 1, 1, 1, 1, 0],
  } as Record<Habit['id'], number[]>,
};

export const weekTotal = week.days.reduce((sum, d) => sum + d.xp, 0);

export const dayXp = (i: number) => habits.reduce((sum, h) => sum + week.matrix[h.id][i] * h.xp, 0);
export const weekAverage = Math.round(weekTotal / week.days.length);

export const newHabit = {
  time: '19:05',
  title: 'Nowy nawyk',
  name: 'Rozciąganie 10 minut',
  icons: ['water', 'walk', 'book', 'phone', 'stretch', 'dumbbell', 'sleep', 'carrot'],
  selected: 4,
  xpSteps: [10, 20, 30, 40, 50],
  xp: 20,
  days: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
  on: [0, 2, 4, 6],
  cta: 'DODAJ ZADANIE',
};

export const launch = { tagline: 'Nawyki z poziomami' };

export const tabs = [
  { id: 'quests', label: 'Zadania' },
  { id: 'streak', label: 'Passa' },
  { id: 'garden', label: 'Ogródek' },
  { id: 'week', label: 'Tydzień' },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export const gallery = [
  { n: 1, title: 'Poziom w górę', caption: 'Po 20 minutach spaceru licznik dobija do 1200 XP: baner POZIOM 8, poziomka skacze, a pasek mruga trzy razy.' },
  { n: 2, title: 'Zadania na dziś', caption: 'Cztery nawyki jako zadania z punktami: woda 10 XP, spacer 30, książka 20, telefon odłożony o 22:30 aż 40.' },
  { n: 3, title: 'Passa', caption: '21 dni z rzędu jako kafle kalendarza, od 18 września do dziś. Wystarczy jedno zadanie dziennie, żeby passa trwała.' },
  { n: 4, title: 'Ogródek', caption: 'Passa hoduje poziomkę: nasionko, listek, sadzonka, kwiat i owoc. Za 21 dni skrzynia oddaje miedzianą konewkę.' },
  { n: 5, title: 'Tydzień', caption: 'Siedem słupków XP od piątku do czwartku, razem 550 XP, średnio 79 dziennie. Woda trzyma się 7 z 7 dni.' },
  { n: 6, title: 'Nowy nawyk', caption: 'Nazwa, ikonka z ośmiu, wartość w XP i dni tygodnia. Rozciąganie 10 minut za 20 XP, cztery razy w tygodniu.' },
] as const;
