import type { Storyboard } from '../../shared/types';

export const overlayTop = 724;

export const storyboard: Storyboard = {
  fps: 30,
  duration: 720,
  bridge: 15,
  poster: 30,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Alert',
      from: 0,
      to: 59,
      key: 30,
      action:
        'Od pierwszej klatki karta alertu w kolorze alarmu: serwis, daty i co wyciekło. Przez ekran przechodzi linia skanu, pierścień alertu pulsuje.',
      overlay: { text: 'Wiesz o wycieku pierwszy', from: 4, to: 75, top: overlayTop },
    },
    {
      id: 'details',
      name: 'Szczegóły',
      from: 60,
      to: 179,
      key: 150,
      action:
        'Skan odsłania szczegóły. Oś czasu rysuje się węzeł po węźle, godzina wykrycia 07:12 dostaje poświatę, to, co wyciekło, odszyfrowuje się na czerwono.',
    },
    {
      id: 'password',
      name: 'Nowe hasło',
      from: 180,
      to: 329,
      key: 290,
      action:
        'Zmień hasło teraz: generator odszyfrowuje 20 znaków od lewej, segmenty siły zapalają się po kolei, ok. 131 bitów. Użyj tego hasła, hasło zmienione.',
      overlay: { text: 'Nowe hasło w trzy sekundy', from: 186, to: 265, top: overlayTop },
    },
    {
      id: 'vault',
      name: 'Sejf',
      from: 330,
      to: 479,
      key: 460,
      action:
        'Sejf zablokowany, rygiel odsuwa się. Skan odsłania listę, wiersze odszyfrowują się z góry na dół, wpis forum ma znacznik „zmienione dziś”.',
    },
    {
      id: 'health',
      name: 'Zdrowie sejfu',
      from: 480,
      to: 629,
      key: 600,
      action:
        'Wieczorem: wynik rośnie od 68 do 96, problemy skreślają się jeden po drugim, liczniki spadają do zera. Na koniec napis Sejf zdrowy.',
      overlay: { text: 'Sejf zdrowy w jeden wieczór', from: 496, to: 575, top: overlayTop },
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 630,
      to: 719,
      key: 712,
      action: 'Ekran startowy: obrys ikony rysuje się, rygiel zasuwa się, napis RYGIEL odszyfrowuje się pod spodem.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 179, title: 'Wyciek wykryty.', line: 'Alert w kilka godzin od wycieku, z tym, co wyciekło.' },
  { from: 180, to: 329, title: 'Hasło zmienione.', line: '20 znaków, ok. 131 bitów, jednym stuknięciem.' },
  { from: 330, to: 479, title: 'Sejf otwarty.', line: '214 wpisów odszyfrowanych na Twoim telefonie.' },
  { from: 480, to: 599, title: 'Sejf zdrowy.', line: 'Od 68 do 96 punktów w jeden wieczór.' },
] as const;

export const marketing = { duration: 690, bridge: 15, outro: 600, poster: 45 } as const;

export const tile = { duration: 150, poster: 30, cut: 60, from: 200, back: 132 } as const;
