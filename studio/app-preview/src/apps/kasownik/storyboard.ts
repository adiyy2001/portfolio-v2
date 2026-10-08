import type { Storyboard } from '../../shared/types';

export const storyboard: Storyboard = {
  fps: 30,
  duration: 690,
  bridge: 15,
  poster: 360,
  defaultPoster: 150,
  shots: [
    {
      id: 'hook',
      name: 'Hak',
      from: 0,
      to: 59,
      key: 20,
      action:
        'Od pierwszej klatki skasowany bilet na pełnym ekranie: pasek ważności płynie, zegar odlicza, przez kod przechodzi fala.',
      overlay: { text: 'Widać, że bilet ważny.', from: 0, to: 63, top: 818 },
    },
    {
      id: 'home',
      name: 'Bilety',
      from: 60,
      to: 134,
      key: 118,
      action:
        'Bilet zjeżdża w dół i odsłania ekran główny. Przewinięcie zwija duży tytuł, karta proponowanego biletu dostaje obwódkę.',
    },
    {
      id: 'buy',
      name: 'Zakup',
      from: 135,
      to: 224,
      key: 160,
      action:
        'Stuknięcie w kartę wysuwa arkusz zakupu. Drugie stuknięcie płaci, przycisk zwija się w znacznik, arkusz odjeżdża.',
      overlay: { text: 'Dwa stuknięcia, bez kolejki', from: 140, to: 204, top: 320 },
    },
    {
      id: 'mine',
      name: 'Moje bilety',
      from: 225,
      to: 314,
      key: 286,
      action:
        'Nowy bilet ląduje na stosie. Przytrzymanie przycisku napełnia pierścień przez sekundę i kasuje bilet.',
    },
    {
      id: 'alive',
      name: 'Bilet ożywa',
      from: 315,
      to: 419,
      key: 360,
      action:
        'Element współdzielony: karta rośnie do pełnego ekranu, kod ożywa falą od środka, zegar rusza od 45:00.',
      overlay: { text: 'Kasujesz przy wejściu', from: 328, to: 392, top: 818 },
    },
    {
      id: 'transfer',
      name: 'Przesiadka',
      from: 420,
      to: 539,
      key: 480,
      action:
        'Arkusz trasy: linia 16, przesiadka na Rondzie Kaponiera, linia 5. Wiersze wchodzą kolejno, plakietka odlicza minuty biletu.',
      overlay: { text: 'Przesiadka? Zostanie 27 minut', from: 430, to: 494, top: 150 },
    },
    {
      id: 'inspector',
      name: 'Kontrola',
      from: 540,
      to: 614,
      key: 590,
      action:
        'Pokaż kontrolerowi: kod rośnie na środek, ekran rozjaśnia się, zegar jest duży i czytelny z odległości.',
    },
    {
      id: 'end',
      name: 'Zakończenie',
      from: 615,
      to: 689,
      key: 670,
      action: 'Ekran startowy aplikacji: ikona wchodzi na sprężynie, pod nią nazwa.',
    },
  ],
};

export const marketingBeats = [
  { from: 0, to: 59, kicker: 'Kasownik', title: 'Bilet, który żyje.' },
  { from: 60, to: 224, kicker: '01 Zakup', title: 'Kup w dwa stuknięcia.' },
  { from: 225, to: 419, kicker: '02 Kasowanie', title: 'Skasuj przy wejściu.' },
  { from: 420, to: 539, kicker: '03 Przesiadka', title: 'Zdąż na przesiadkę.' },
] as const;

export const marketing = { duration: 630, bridge: 15, outro: 540, poster: 380 } as const;

export const tile = { duration: 150, from: 300, poster: 75 } as const;
