import type { Storyboard } from '../../shared/types';

export const overlayArtTops = { hook: 366, streak: 300, garden: 62 } as const;

export const storyboard: Storyboard = {
  fps: 30,
  duration: 600,
  bridge: 16,
  poster: 30,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Poziom w górę',
      from: 0,
      to: 59,
      key: 30,
      action:
        'Baner POZIOM 8! stoi już w pierwszej klatce. Poziomka skacze w rytmie 7,5 klatki na sekundę, pasek XP mruga pełny, a z boków wyskakują monety.',
      overlay: { text: 'Nawyki, za które rośnie poziom', from: 4, to: 72, top: overlayArtTops.hook * 2 },
    },
    {
      id: 'quests',
      name: 'Zadania',
      from: 60,
      to: 209,
      key: 150,
      action:
        'Szachownica odsłania zadania na dziś. Odhaczona woda daje +10 XP, spacer +30 XP, monety podskakują, a pasek rośnie po pikselu, aż dobija do 1200 XP i mruga. Odznaka zmienia się na POZIOM 8.',
    },
    {
      id: 'streak',
      name: 'Passa',
      from: 210,
      to: 329,
      key: 318,
      action:
        'Kalendarz 21 dni od 18 września. Kafle odwracają się po kolei co 4 klatki, licznik rośnie razem z nimi, a na końcu mruga PASSA: 21 DNI.',
      overlay: { text: 'Passa 21 dni i rośnie', from: 220, to: 290, top: overlayArtTops.streak * 2 },
    },
    {
      id: 'garden',
      name: 'Ogródek',
      from: 330,
      to: 479,
      key: 466,
      action:
        'Ogródek: kwiat w trzech pozach zamienia się w owoc, wskaźnik etapu przeskakuje na 5 z 5. Skrzynia otwiera się w trzech krokach i wypuszcza miedzianą konewkę.',
      overlay: { text: 'Ogródek rośnie z każdą passą', from: 345, to: 412, top: overlayArtTops.garden * 2 },
    },
    {
      id: 'week',
      name: 'Tydzień',
      from: 480,
      to: 539,
      key: 536,
      action: 'Siedem słupków XP od piątku do czwartku rośnie po 3 piksele na klatkę. Pod spodem razem 550 XP, średnio 79 dziennie i tabela: które zadanie którego dnia.',
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 540,
      to: 599,
      key: 596,
      action: 'Ekran startowy: pikselowa ikona z poziomką, napis POZIOMKA wpisuje się literą na każdy takt i podpis Nawyki z poziomami.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 209, kicker: 'Zadania na dziś', title: 'Nawyk to zadanie.', line: 'Woda +10 XP, spacer +30 XP.' },
  { from: 210, to: 329, kicker: 'Passa', title: '21 dni z rzędu.', line: 'Kafel po kaflu, dzień po dniu.' },
  { from: 330, to: 479, kicker: 'Ogródek', title: 'Passa daje owoce.', line: 'Za 21 dni miedziana konewka.' },
  { from: 480, to: 539, kicker: 'Tydzień', title: '550 XP w tydzień.', line: 'Średnio 79 XP dziennie.' },
] as const;

export const marketing = { duration: 600, bridge: 16, outro: 540, poster: 160 } as const;

export const tile = { duration: 128, poster: 20 } as const;
