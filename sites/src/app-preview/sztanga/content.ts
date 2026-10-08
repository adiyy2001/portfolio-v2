export const content = {
  kicker: 'Wzornik, app preview. A2, kinetyczna typografia',
  lead: 'Podgląd dziennika treningu siłowego: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Liczby są tu bohaterem, a każde cięcie wypada na uderzenie 120 BPM.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '22 s, 886×1920, 30 kl./s'],
    ['Rytm', '120 BPM, cięcie co 15 klatek'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Dźwięk', 'brak, rytm niesie sam obraz'],
  ] as [string, string][],
  client: {
    paragraphs: [
      'Sztanga to dziennik treningu siłowego dla osób, które ćwiczą według planu procentowego. Między ciężkimi seriami nikt nie czyta drobnego druku, nie liczy talerzy w pamięci i nie pamięta, ile podniósł tydzień temu. Aplikacja pokazuje to wszystko liczbami, które widać z ławki.',
      'Zadanie: podgląd do App Store, który w pierwszej klatce pokaże ciężar na całą szerokość ekranu, trzy formaty na kampanię w mediach społecznościowych i pętle na stronę. Bez dźwięku, ale z rytmem, który czuć jak muzykę na siłowni.',
    ],
    facts: [
      ['Użytkownik', 'średniozaawansowani, trzy lub cztery treningi w tygodniu, plan procentowy'],
      [
        'Dane z treningu',
        'tydzień 3 z 4, dzień B: przysiad 5 × 3 po 140 kg, wyciskanie 5 × 5 po 92,5 kg, martwy ciąg 1 × 2 po 185 kg',
      ],
      [
        'Trzy funkcje',
        'plan dnia z talerzami na stronę, minutnik przerwy czytelny z ławki, rekordy z szacowanym 1RM',
      ],
      ['Ton', 'krótko, głośno i konkretnie, jak trener przy sztandze'],
    ] as [string, string][],
  },
  direction: {
    title: 'Liczba zamiast ikony, cięcie bez przenikania',
    paragraphs: [
      'Na treningu liczą się trzy rzeczy: ciężar, seria i czas przerwy. Dlatego interfejs jest typograficzny. Ciężar zajmuje całą szerokość ekranu, a krój Anybody zmienia szerokość znaków od 50 do 150, więc ta sama liczba może być wąska i wysoka albo szeroka i niska, zawsze od krawędzi do krawędzi.',
      'Ruch idzie za muzyką z siłowni: 120 uderzeń na minutę, cięcie co 15 klatek, żadnych przenikań i sprężyn, które się kołyszą. Kolor jest jeden: pomarańcz na czerni. Gdy pada rekord, cały ekran odwraca się na jedno uderzenie.',
    ],
    keywords: ['Czerń', 'Jeden pomarańcz', 'Oś szerokości', '120 BPM'],
  },
  storyboard: {
    intro:
      'Sześć ujęć w 660 klatkach, czyli 44 uderzenia po 15 klatek. Hak to 140 kg na pełnym ekranie od pierwszej klatki. Potem plan z talerzami, zaliczona seria z przerwą, przyspieszony minutnik, rekord i ekran startowy.',
    alt: 'Plansza sześciu klatek kluczowych wersji sklepowej z czasami i linijką 44 uderzeń',
    rules: [
      'Każde ujęcie zaczyna się na wielokrotności 15 klatek, mniejsze wejścia wypadają na pół uderzenia.',
      'Trzy napisy, każdy najwyżej sześć słów i co najmniej dwie sekundy na ekranie, poza górnymi 120 i dolnymi 160 pikselami.',
      'Plakat sklepowy to klatka 500: pomarańczowy ekran rekordu z wynikiem 185 × 2. Domyślna klatka z piątej sekundy pokazuje talerze na stronę.',
    ],
  },
  motion: {
    intro:
      'Każdy ruch ma nazwę i wartość w tokenach projektu. Te same liczby napędzają wideo i metronom poniżej.',
    caption:
      'Oba słupki startują na uderzeniu. Slam trzyma się przez chwilę i dobija w 8 klatek, więc stoi, zanim padnie następne uderzenie. Liniowy jedzie równo przez całe uderzenie i nigdy nie ląduje, dlatego w Sztandze nie ma liniowych wejść.',
    rules: [
      ['Wszystko na uderzeniu', 'cięcia co 15 klatek, drobne wejścia co 7 albo 8 klatek'],
      ['Bez przenikań', 'ekran zmienia się twardym cięciem, napis wbija się bez zanikania'],
      ['Oś szerokości', 'liczba zmienia proporcje, ale zawsze trzyma szerokość ekranu'],
      ['Kamera', 'uderzenie o 12% co czwarte uderzenie, telefon wchodzi i znika cięciem'],
    ] as [string, string][],
  },
  screensIntro:
    'Sześć ekranów z jednego mini design systemu: sześć kolorów, jeden krój w kilku szerokościach, odstępy co 8 pikseli i przyciski o wysokości 72 pikseli, w które trafia się spoconym palcem. Projekt w kanwie 443×960, render w skali 2, czyli dokładnie 886×1920.',
  formats: {
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, więc wersja sklepowa to sam ekran aplikacji. Wersja marketingowa ma ogromne słowa poza telefonem, a telefon wchodzi i znika cięciem na uderzenie.',
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
      ['Storyboard', 'tabela ujęć z klatkami i plansza klatek kluczowych z linijką uderzeń'],
      ['Ekrany', 'sześć ekranów interfejsu w 886×1920'],
      ['Projekt ruchu', 'siatka rytmu, krzywe i czasy zapisane w tokenach, opisane jak tutaj'],
    ] as [string, string][],
  },
  cta: {
    title: 'Twoja aplikacja ma liczby, które warto pokazać?',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard, rytm i styl ruchu, a potem dowiozę komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla klientów',
  },
};
