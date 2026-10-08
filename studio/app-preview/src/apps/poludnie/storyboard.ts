import type { Storyboard } from '../../shared/types';

export const overlayTop = 798;

export const storyboard: Storyboard = {
  fps: 30,
  duration: 750,
  bridge: 20,
  poster: 45,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Hak',
      from: 0,
      to: 74,
      key: 45,
      action:
        'Od pierwszej klatki izometryczny dom z płynącą energią i duża liczba 6,4 kW z dachu. Kreski na ścieżkach biegną z prędkością zależną od mocy, przepływ ze słońca prowadzi, reszta czeka na 40%. Po panelach przesuwa się refleks.',
      overlay: { text: 'Prąd z dachu na żywo', from: 4, to: 72, top: overlayTop },
    },
    {
      id: 'battery',
      name: 'Magazyn',
      from: 75,
      to: 224,
      key: 190,
      action:
        'Stuknięcie w wiersz Magazyn. Kamera jedzie wzdłuż osi izometrii do baterii i przybliża ją, przepływ do magazynu przejmuje kolor wiodący. Krzywa naładowania rysuje się od rezerwy 30% o 6:15 do 95% teraz, poziom w bryle i liczba idą razem z nią. Na końcu plan: pełny o 13:40.',
    },
    {
      id: 'day',
      name: 'Dzień',
      from: 225,
      to: 374,
      key: 366,
      action:
        'Zakładka Dzień, wieczór. Krzywa produkcji rysuje się przez cały dzień, liczba dochodzi do 47,8 kWh. Potem linia zużycia, pole nadwyżki i znacznik szczytu 6,4 kW o 13:10. Na dole bilans: dokąd poszła energia z dachu i skąd przyszła ta w domu.',
      overlay: { text: 'Cały dzień na jednym wykresie', from: 240, to: 312, top: overlayTop },
    },
    {
      id: 'tip',
      name: 'Kiedy włączyć',
      from: 375,
      to: 524,
      key: 512,
      action:
        'Zakładka Porady. Prognoza na jutro rysuje się, okno od 12:30 do 14:00 rozjaśnia się na krzywej. Karta pralki wjeżdża od dołu, nadwyżka liczy się do 4,1 kW, potem zmywarka i grzałka w bojlerze dostają swoje okna.',
      overlay: { text: 'Pralka wtedy, gdy świeci', from: 390, to: 456, top: overlayTop },
    },
    {
      id: 'balance',
      name: 'Bilans',
      from: 525,
      to: 674,
      key: 664,
      action:
        'Zakładka Bilans. Pierścień samowystarczalności rysuje się do 92%: najpierw część z dachu, potem z magazynu, a 8% z sieci zostaje szare. Pod spodem wartość dnia liczy się do 23,10 zł, w cenach przykładowych.',
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 675,
      to: 749,
      key: 740,
      action: 'Ekran startowy: sześcian z ikony unosi się na sprężynie rise, na górnej ścianie wypełnia się tarcza słońca, pod spodem nazwa Południe.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 119, store: [0, 74], part: 'roof', kicker: 'Teraz, 13:10', title: '6,4 kW prosto z dachu.', line: 'Widać, dokąd płynie prąd: do domu, do magazynu i do sieci.' },
  { from: 120, to: 269, store: [75, 224], part: 'battery', kicker: 'Magazyn', title: 'Pełny o 13:40.', line: 'Bateria ładuje się w południe, gdy słońca jest najwięcej.' },
  { from: 270, to: 419, store: [225, 374], part: 'chart', kicker: 'Dzień', title: '47,8 kWh z dachu.', line: 'Szczyt 6,4 kW o 13:10. Dom zużył 15,3 kWh.' },
  { from: 420, to: 569, store: [375, 524], part: 'washer', kicker: 'Jutro', title: 'Pralka o 12:30.', line: 'Wtedy dach ma 4,1 kW nadwyżki.' },
  { from: 570, to: 719, store: [525, 674], part: 'grid', kicker: 'Bilans dnia', title: '92% prądu z\u00a0własnego dachu.', line: 'Z sieci tylko 1,2 kWh. Wartość dnia 23,10 zł w\u00a0cenach przykładowych.' },
] as const;

export const marketing = { duration: 795, bridge: 20, outro: 720, poster: 60 } as const;

export const tile = { duration: 150, poster: 40 } as const;
