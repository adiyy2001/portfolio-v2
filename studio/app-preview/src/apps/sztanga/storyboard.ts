import type { Storyboard } from '../../shared/types';

const overlayTop = 712;

export const storyboard: Storyboard = {
  fps: 30,
  duration: 660,
  bridge: 15,
  poster: 500,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Hak',
      from: 0,
      to: 59,
      key: 58,
      action:
        'Od pierwszej klatki 140 kg na całą szerokość ekranu. Na drugim i trzecim uderzeniu liczba zmienia szerokość, na czwartym wbijają się KG i SERIA 3/5.',
      overlay: { text: 'Liczby, które widać z ławki', from: 4, to: 72, top: overlayTop },
    },
    {
      id: 'plan',
      name: 'Plan i talerze',
      from: 60,
      to: 179,
      key: 150,
      action:
        'Plan dnia B: trzy boje wchodzą po jednym na uderzenie. Cięcie na talerze: 25, 25 i 10 kg na stronę, klocek po klocku co pół uderzenia.',
    },
    {
      id: 'done',
      name: 'Seria zaliczona',
      from: 180,
      to: 299,
      key: 245,
      action:
        'Stuknięcie w ZALICZONA odwraca przycisk na jedno uderzenie. Cięcie na przerwę: minutnik 3:00, cyfry tną się co sekundę.',
      overlay: { text: 'Przerwa liczona za ciebie', from: 190, to: 252, top: overlayTop },
    },
    {
      id: 'lapse',
      name: 'Przyspieszenie',
      from: 300,
      to: 419,
      key: 395,
      action:
        'Minutnik w przyspieszeniu schodzi do 0:00. Seria 4/5, potem ekran odwraca się na pomarańcz: SERIA 5/5, ostatnia.',
    },
    {
      id: 'record',
      name: 'Rekord',
      from: 420,
      to: 569,
      key: 505,
      action:
        'Martwy ciąg 185 kg zaliczony. Ekran odwraca się na pomarańcz, REKORD wbija się litera po literze, potem 185 × 2 i 1RM ≈ 197 KG. Na koniec historia ośmiu tygodni.',
      overlay: { text: 'Nowy rekord? Sztanga zauważy.', from: 450, to: 516, top: overlayTop },
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 570,
      to: 659,
      key: 640,
      action: 'Ekran startowy: SZTANGA ściska się z szerokości 150 do 100, ikona wchodzi na uderzeniu, pod spodem kategoria.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 179, word: 'CIĘŻAR', line: 'Plan dnia i talerze policzone na stronę.' },
  { from: 180, to: 299, word: 'SERIE', line: 'Seria zaliczona jednym stuknięciem.' },
  { from: 300, to: 419, word: 'PRZERWA', line: 'Minutnik czytelny z ławki.' },
  { from: 420, to: 524, word: 'REKORD', line: 'Szacowane 1RM liczy się samo.' },
] as const;

export const marketingCards = [
  { from: 90, to: 104, text: '140 KG', invert: false },
  { from: 180, to: 194, text: 'SERIE', invert: false },
  { from: 300, to: 314, text: '3:00', invert: false },
  { from: 390, to: 404, text: '5/5', invert: true },
  { from: 480, to: 494, text: '185 × 2', invert: true },
] as const;

export const marketing = { duration: 600, bridge: 15, outro: 525, poster: 150 } as const;

export const tile = { duration: 120, poster: 0 } as const;
