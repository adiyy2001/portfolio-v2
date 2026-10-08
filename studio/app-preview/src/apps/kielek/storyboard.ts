import type { Storyboard } from '../../shared/types';

export const overlayTop = 772;

export const storyboard: Storyboard = {
  fps: 30,
  duration: 630,
  bridge: 20,
  poster: 30,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Hak',
      from: 0,
      to: 59,
      key: 30,
      action:
        'Od pierwszej klatki Kiełek siedzi w doniczce, a pod nim stoi karta Dziś podlej 3 rośliny. Kiełek podskakuje, ląduje ze zgnieceniem, karta ugina się razem z nim, potem mrugnięcie.',
      overlay: { text: 'Rośliny podlane na czas', from: 0, to: 66, top: overlayTop },
    },
    {
      id: 'today',
      name: 'Dziś',
      from: 60,
      to: 209,
      key: 160,
      action:
        'Kiełek przeskakuje do karty, która dojeżdża na górę. Trzy karty roślin wskakują co 5 klatek. Stuknięcie Podlane przy Zdzisi: kropla spada, zgniata się, karta robi się pistacjowa, licznik spada do 2, Kiełek się cieszy.',
    },
    {
      id: 'calendar',
      name: 'Kalendarz',
      from: 210,
      to: 329,
      key: 318,
      action:
        'Zakładka przeskakuje na Kalendarz. Tygodnie wjeżdżają po kolei, krople lądują na 8, 15, 22 i 29 października. Przełącznik przechodzi na zimę i krople przeskakują na 20 października i 1 listopada.',
      overlay: { text: 'Plan dopasowany do pory roku', from: 220, to: 292, top: overlayTop },
    },
    {
      id: 'diagnosis',
      name: 'Diagnoza',
      from: 330,
      to: 479,
      key: 470,
      action:
        'Stuknięcie Żółte dolne liście, potem Mokra. Karta odpowiedzi nadmuchuje się: za dużo wody, odstaw konewkę na 10 dni. Kiełek najpierw się martwi, potem kiwa głową.',
      overlay: { text: 'Podpowie, co dolega liściom', from: 344, to: 412, top: overlayTop },
    },
    {
      id: 'rooms',
      name: 'Pokoje',
      from: 480,
      to: 569,
      key: 562,
      action:
        'Trzy kafle pokoi. Sypialnia dostaje różową obwódkę, pasek wilgotności rośnie do 41%, przy 60% pojawia się Kalina lubi 60%, a pod spodem rada: przestaw ją do kuchni.',
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 570,
      to: 629,
      key: 622,
      action: 'Ekran startowy: ikona nadmuchuje się na sprężynie bounce, pod nią napis Kiełek i Pielęgnacja roślin. Kiełek mruga w ikonie.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 209, kicker: 'Dziś, 7:52', title: 'Podlewasz, kiedy trzeba.', line: 'Kiełek zna każdą roślinę: ile wody i kiedy.' },
  { from: 210, to: 329, kicker: 'Kalendarz', title: 'Zimą rzadziej.', line: 'Od połowy października Zdzisia pije co 12 dni.' },
  { from: 330, to: 479, kicker: 'Diagnoza', title: 'Liście mówią, co jest nie tak.', line: 'Żółte i mokro? Konewka odpoczywa 10 dni.' },
  { from: 480, to: 559, kicker: 'Pokoje', title: 'Każda roślina na swoim miejscu.', line: 'Kalina lubi 60%, w sypialni jest 41%.' },
] as const;

export const marketing = { duration: 630, bridge: 20, outro: 560, poster: 160 } as const;

export const tile = { duration: 150, from: 104, cut: 106, hop: 98, poster: 36 } as const;
