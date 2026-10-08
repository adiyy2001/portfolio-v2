export const content = {
  kicker: 'Wzornik, app preview. A1, natywny iOS',
  lead: 'Podgląd aplikacji z biletami komunikacji miejskiej: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Wszystko z jednego projektu, w jednym rytmie.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '23 s, 886×1920, 30 kl./s'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Pętle web', 'WebM i MP4, każda do 4 MB'],
    ['Dźwięk', 'brak, wszystko czytelne bez niego'],
  ] as [string, string][],
  client: {
    paragraphs: [
      'Kasownik to aplikacja z Poznania, w której kupuje się i kasuje bilety na tramwaj i autobus. Przed premierą w sklepach zespół potrzebował podglądu aplikacji, który w pierwszych dwóch sekundach pokaże najważniejsze: skasowany bilet widać od razu i trudno go podrobić zrzutem ekranu.',
      'Zadanie: wersja do App Store zgodna ze specyfikacją Apple, trzy formaty na kampanię w mediach społecznościowych, pętle na stronę i storyboard, który zespół może pokazać inwestorom. Wszystko bez dźwięku, bo podgląd w sklepie startuje wyciszony.',
    ],
    facts: [
      [
        'Użytkownik',
        'dojeżdżający do pracy i szkoły, telefon w jednej ręce, kilka sekund na przystanku',
      ],
      ['Miasto', 'Poznań, strefa A; przystanki prawdziwe, trasy i ceny zmyślone'],
      [
        'Trzy funkcje',
        'bilet proponowany na trasę, kasowanie, które ożywia bilet, i widok przesiadki',
      ],
      ['Ton', 'spokojny i rzeczowy, bez hałasu i bez obietnic, których aplikacja nie spełni'],
    ] as [string, string][],
  },
  direction: {
    title: 'Interfejs, który wygląda jak część telefonu',
    paragraphs: [
      'Bilet kupuje się w biegu, w słońcu, często jedną ręką. Interfejs w stylu systemu nie wymaga nauki i budzi zaufanie przy płaceniu, dlatego kierunek to natywny iOS: duże tytuły, karty, arkusze wysuwane od dołu i dużo bieli.',
      'Jedynym kolorem jest zieleń tramwaju. Dzięki temu, gdy pasek ważności zaczyna płynąć, oko od razu wie, gdzie patrzeć. Ruch naśladuje przedmioty: arkusz dojeżdża miękko, a karta biletu rośnie do pełnego ekranu jako ten sam element. Nic nie wskakuje i nic nie miga.',
    ],
    keywords: ['Biel', 'Jeden kolor', 'Sprężyny', 'Element współdzielony'],
  },
  storyboard: {
    intro:
      'Osiem ujęć w 690 klatkach. Hak to od razu skasowany bilet, bo pierwsza klatka w sklepie musi sprzedawać bez dźwięku. Potem trzy funkcje w kolejności, w jakiej używa się aplikacji, i na końcu ekran startowy z ikoną i nazwą.',
    alt: 'Plansza ośmiu klatek kluczowych wersji sklepowej z numerami ujęć i czasami',
    rules: [
      'Cztery napisy, każdy najwyżej sześć słów i co najmniej półtorej sekundy na ekranie.',
      'Napisy omijają górne 120 i dolne 160 pikseli, gdzie sklep kładzie własne elementy.',
      'Plakat sklepowy to klatka 360: żywy bilet z pełnym kodem. Domyślna klatka z piątej sekundy, arkusz płatności, też się broni.',
    ],
  },
  motion: {
    intro:
      'Każdy ruch ma nazwę i wartość zapisaną w tokenach projektu. Te same liczby napędzają wideo i ten przykład obok.',
    caption:
      'Po lewej arkusz na sprężynie sheet, po prawej ten sam arkusz na zwykłej krzywej. Sprężyna rusza szybciej i dojeżdża miękko, bez twardego zatrzymania. Przesuń suwak, żeby zobaczyć, co robi zbyt małe tłumienie.',
    rules: [
      [
        'Bez cięć w interfejsie',
        'każda zmiana ekranu jest ruchem ciągłym: push, arkusz albo element współdzielony',
      ],
      ['Stopniowanie', 'wiersze trasy wchodzą co 40 ms, nigdy wszystkie naraz'],
      [
        'Bez liniowego easingu',
        'wyjątkiem jest tylko stały przepływ paska ważności, napędzany cyklem 2,4 s',
      ],
      [
        'Kamera w wersji marketingowej',
        'powolny najazd o 6% w każdym akcie i boczny przejazd między aktami',
      ],
    ] as [string, string][],
  },
  screensIntro:
    'Siedem ekranów zbudowanych jako komponenty z jednego mini design systemu: kolory, skala typograficzna, odstępy, promienie i cienie. Projekt w kanwie 443×960, render w skali 2, czyli dokładnie 886×1920.',
  formats: {
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, dlatego powstały dwie odrębne wersje. Sklepowa to sam ekran aplikacji. Marketingowa ma własną ramkę telefonu, nagłówki i ruch kamery, a w chwili kasowania bilet wychodzi poza telefon.',
    store: 'Wersja sklepowa, sam interfejs',
    portrait: 'Reels, TikTok, Shorts, 9:16',
    square: 'Post w kanale, 1:1',
    wide: 'YouTube i link w Google Play, 16:9',
  },
  deliverables: {
    intro:
      'Klient dostaje pliki gotowe do wgrania, z parametrami sprawdzonymi przez ffprobe. Wersje pełnej jakości są za duże na stronę, dlatego tutaj odtwarzają się lekkie pętle bez dźwięku, w formacie WebM i MP4.',
    extras: [
      ['Ikona', '1024×1024 PNG bez przezroczystości i podgląd z zaokrągleniem'],
      ['Storyboard', 'tabela ujęć z klatkami i plansza klatek kluczowych w PNG'],
      ['Ekrany', 'siedem ekranów interfejsu w 886×1920'],
      ['Projekt ruchu', 'tokeny kolorów, typografii i ruchu, opisane jak tutaj'],
    ] as [string, string][],
  },
  cta: {
    title: 'Masz aplikację do pokazania?',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard, styl ruchu i komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla klientów',
  },
};
