export const content = {
  kicker: 'Wzornik, app preview. A5, pixel art 8-bit',
  lead: 'Podgląd trackera nawyków, w którym każde zadanie daje punkty doświadczenia: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Szesnaście kolorów, piksele tylko w całości i ruch w rytmie starej konsoli.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '20 s, 886×1920, 30 kl./s'],
    ['Ruch', 'kroki co 4 klatki, bez wygładzania'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Dźwięk', 'brak, wszystko czytelne bez niego'],
  ] as [string, string][],
  client: {
    title: 'Nawyki, które nie nudzą się po dwóch tygodniach',
    paragraphs: [
      'Poziomka to tracker nawyków dla ludzi, którzy wychowali się na grach i chcą małych, codziennych zwycięstw. Większość takich aplikacji zamienia się po dwóch tygodniach w listę obowiązków. Tu każdy nawyk jest zadaniem z punktami, punkty dają poziomy, a passa hoduje w ogródku poziomkę.',
      'Zadanie: podgląd do App Store, który w pierwszej klatce pokaże nowy poziom i od razu powie, że to gra, a nie kolejna tabelka. Do tego trzy formaty na kampanię w mediach społecznościowych, pętle na stronę i storyboard. Bez dźwięku, bo sklep i feed startują wyciszone.',
    ],
    facts: [
      ['Użytkownik', 'od 16 do 35 lat, gra w gry i chce mieć co rano jasną listę małych zadań'],
      [
        'Trzy funkcje',
        'nawyki jako zadania z XP, poziomy i passa, która hoduje ogródek, tydzień w słupkach',
      ],
      [
        'Dane w historii',
        'poziom 7, 1160 z 1200 XP, passa 21 dni od 18 września, czwartek 8 października',
      ],
      ['Ton', 'krótko, z liczbami i bez moralizowania: punkty, dni, strony, minuty'],
    ] as [string, string][],
    quests: {
      label: 'Czwartek, 8 października',
      title: 'Zadania na dziś',
      rows: [
        ['Szklanka wody po przebudzeniu', 'rano', 10, true],
        ['20 minut spaceru', 'przed pracą', 30, true],
        ['15 stron książki', 'wieczorem', 20, false],
        ['Telefon odłożony o 22:30', 'przed snem', 40, false],
      ] as [string, string, number, boolean][],
      total: 'Rano +40 XP, czyli 1200 XP i poziom 8',
    },
  },
  direction: {
    title: 'Gra, ale taka, którą da się czytać',
    paragraphs: [
      'Pixel art mówi do tej grupy od pierwszej klatki: poziom, monety, skrzynia ze skarbem. Każdy element stoi na siatce, a jeden piksel rysunku to cztery piksele wideo. Nic nie jest skalowane o ułamek, nic nie ma rozmytej krawędzi, a cienie powstają z ditheringu, czyli z szachownicy dwóch kolorów, nie z gradientu.',
      'Paleta ma dokładnie szesnaście kolorów. Tekst zawsze stoi na kremie, błękicie albo śliwce, żeby kontrast nie spadał poniżej 4,5:1. Oba kroje to prawdziwe fonty pikselowe na licencji OFL. W wideo nie są rysowane przez przeglądarkę, tylko zamienione na bitmapy, więc litery mają ostre krawędzie w każdej klatce.',
    ],
    keywords: ['16 kolorów', 'Dithering', 'Całe piksele', '7,5 kl./s', 'Grywalizacja'],
  },
  type: [
    {
      family: 'Jersey 10',
      bitmap: 'Poziomka Pixel',
      sample: ['POZIOM 8!', 'Zażółć gęślą jaźń'],
      note: 'nagłówki, liczby i napisy w wideo. Piksel kroju to 75 jednostek, wersalik ma 10 pikseli.',
    },
    {
      family: 'Tiny5',
      bitmap: 'Poziomka Mini',
      sample: ['Szklanka wody +10 XP', 'Zażółć gęślą jaźń'],
      note: 'etykiety, opisy i tekst tej strony. Wersalik ma 5 pikseli, wszystkie polskie znaki są na miejscu.',
    },
  ],
  storyboard: {
    title: '20 sekund, sześć ujęć, jedna pętla gry',
    intro:
      'Sześć ujęć w 600 klatkach, ułożonych jak pętla gry: zadanie, nagroda, poziom. Hak to baner nowego poziomu, który stoi już w pierwszej klatce, bo w sklepie pierwsza klatka musi sprzedawać bez dźwięku. Potem zadania, passa, ogródek, tydzień i ekran startowy z ikoną.',
    alt: 'Plansza sześciu klatek kluczowych wersji sklepowej z numerami ujęć, czasami, osią czasu i paletą 16 kolorów',
    rules: [
      'Trzy napisy w kroju Poziomka Pixel, każdy najwyżej sześć słów i co najmniej 2,2 s na ekranie.',
      'Napisy pojawiają się i znikają w dwóch krokach ditheringu, bez przenikania. Siedzą nad paskiem zakładek, poza górnymi 120 i dolnymi 160 pikselami.',
      'Plakat sklepowy to klatka 30: baner POZIOM 8 i poziomka w skoku. Domyślna klatka z piątej sekundy, moneta +30 XP nad spacerem, też się broni.',
    ],
  },
  motion: {
    title: 'Kroki zamiast krzywych',
    intro:
      'Poziomka jako jedyna z sześciu realizacji nie ma żadnego wygładzania. Każdy ruch to seria póz, a nowa poza wchodzi co 4 klatki, czyli 7,5 razy na sekundę. Te same wartości napędzają wideo i laboratorium poniżej.',
    caption:
      'Ta sama poziomka i ten sam skok. Po lewej płynna krzywa ease-in-out w 60 klatkach na sekundę: sprite przesuwa się o ułamki piksela rysunku i wypada z siatki, a ruch wygląda jak animacja interfejsu, nie jak gra. Po prawej kroki: cztery pozy, wysokość 0, 3, 5 i 3 piksele, nowa poza co 4 klatki. Zmień tempo kroków i porównaj, przy jakim skok przestaje wyglądać jak gra.',
    rules: [
      [
        'Całe piksele',
        'każda pozycja, rozmiar i przesunięcie to wielokrotność piksela rysunku, czyli 4 pikseli wideo',
      ],
      [
        'Takt 7,5 kl./s',
        'sprite’y zmieniają pozę co 4 klatki; pasek XP rośnie szybciej, 1 piksel na klatkę, bo liczy punkty',
      ],
      [
        'Zmiana ekranu',
        'szachownica schodzi z góry w 8 krokach po 2 klatki, razem 16 klatek, zawsze ta sama',
      ],
      [
        'Kamera w wersji marketingowej',
        'chmury i ogródek przesuwają się o 2 piksele co 8 i 16 klatek, a zakończenie wchodzi tą samą szachownicą',
      ],
    ] as [string, string][],
  },
  screens: {
    title: 'Sześć ekranów z jednej palety',
    intro:
      'Sześć ekranów zbudowanych z jednego zestawu części: panele z obrysem, paski XP, monety, kafle i zakładki. Projekt w siatce 221×480 pikseli rysunku, każdy piksel powiększony dokładnie cztery razy, co daje 884×1920. Pasek o szerokości 2 pikseli z prawej domyka 886, bo tej szerokości nie da się podzielić na całe piksele.',
  },
  formats: {
    title: 'Sklep pokazuje aplikację, social pokazuje świat',
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, dlatego powstały dwie odrębne wersje. Sklepowa to sam ekran aplikacji. Marketingowa to pikselowy świat: pasy nieba z ditheringu, chmury, ogródek ze wszystkimi etapami poziomki, telefon narysowany w tej samej siatce i monety, które wyskakują z ekranu.',
    store: 'Wersja sklepowa, sam interfejs',
    portrait: 'Reels, TikTok, Shorts, 9:16',
    square: 'Post w kanale, 1:1',
    wide: 'YouTube i link w Google Play, 16:9',
  },
  deliverables: {
    title: 'Pliki gotowe do wgrania, z parametrami',
    intro:
      'Klient dostaje pliki gotowe do wgrania, z parametrami sprawdzonymi przez ffprobe. Wersja sklepowa w pełnej jakości jest za duża na stronę, dlatego tutaj odtwarzają się lekkie pętle bez dźwięku, w formacie WebM i MP4. Pikselowa grafika kompresuje się tak dobrze, że pętle zostają w pełnej rozdzielczości, więc żaden piksel nie jest skalowany.',
    extras: [
      ['Ikona', '1024×1024 PNG bez przezroczystości, 32×32 piksele rysunku powiększone 32 razy'],
      ['Storyboard', 'tabela ujęć z klatkami i plansza klatek kluczowych w PNG'],
      ['Ekrany', 'sześć ekranów interfejsu w 886×1920, bez strat'],
      [
        'Kroje bitmapowe',
        'Poziomka Pixel i Poziomka Mini, bitmapy z Jersey 10 i Tiny5, z tekstem licencji OFL',
      ],
    ] as [string, string][],
  },
  cta: {
    title: 'Twoja aplikacja też może mieć swój poziom',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard, styl ruchu i komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla klientów',
  },
};
