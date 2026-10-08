export const day = {
  date: 'Czwartek, 14 maja 2026, dom pod Opolem',
  prod: 47.8,
  use: 15.3,
  prodSplit: [
    ['do domu', 7.5, 'home'],
    ['do magazynu', 7.5, 'battery'],
    ['do sieci', 32.8, 'grid'],
  ] as [string, number, string][],
  useSplit: [
    ['z dachu', 7.5, 'sun'],
    ['z magazynu', 6.6, 'battery'],
    ['z sieci', 1.2, 'grid'],
  ] as [string, number, string][],
  selfSufficiency: 92,
  notBought: 14.1,
  exported: 32.8,
  buy: 1.08,
  sell: 0.24,
  savedZl: 15.23,
  soldZl: 7.87,
  valueZl: 23.1,
  now: [
    ['z dachu', 6.4],
    ['do domu', 0.5],
    ['do magazynu', 1.3],
    ['do sieci', 4.6],
  ] as [string, number][],
};

export const content = {
  kicker: 'Wzornik, app preview. A6, izometryczny dashboard danych',
  lead: 'Podgląd aplikacji do domowej fotowoltaiki z magazynem energii: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Izometryczny dom, przez który płynie prąd, wykresy rysujące się w czasie i liczby, które się sumują.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '25 s, 886×1920, 30 kl./s'],
    ['Ruch', 'rysowanie linii, liczenie, przepływ zależny od mocy'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Dźwięk', 'brak, wszystko czytelne bez niego'],
  ] as [string, string][],
  client: {
    title: 'Prąd z\u00a0dachu, policzony co do kilowatogodziny',
    paragraphs: [
      'Południe to aplikacja dla rodzin, które mają na dachu od 6 do 10 kWp i magazyn energii. Falownik pokazuje im surowe liczby, a pralka i tak chodzi wieczorem, kiedy prąd trzeba kupić. Aplikacja ma pokazać, dokąd płynie energia teraz, jak wyglądał cały dzień i kiedy włączyć duże urządzenia.',
      'Zadanie: podgląd do App Store, który w pierwszych dwóch sekundach pokaże dom z płynącym prądem i jedną dużą liczbą, trzy formaty na kampanię w mediach społecznościowych, pętle na stronę i storyboard. Bez dźwięku, bo sklep i feed startują wyciszone.',
    ],
    facts: [
      [
        'Użytkownik',
        'rodzina w domu jednorodzinnym, instalacja z magazynem, rozliczenie net-billing',
      ],
      [
        'Trzy funkcje',
        'przepływ energii na żywo, profil dnia z produkcją i zużyciem, porada, kiedy włączyć pralkę, z bilansem w złotówkach',
      ],
      [
        'Instalacja w historii',
        '8,2 kWp, czyli 20 paneli po 410 W, falownik hybrydowy 8 kW, magazyn 10,2 kWh z rezerwą 30%',
      ],
      [
        'Liczby',
        'zmyślone, ale policzone z modelu dnia; ceny przykładowe: zakup 1,08 zł, sprzedaż 0,24 zł za kWh',
      ],
    ] as [string, string][],
  },
  direction: {
    title: 'Jedna informacja na ujęcie',
    paragraphs: [
      'Dane o energii łatwo zamienić w ścianę wykresów. Tutaj każde ujęcie ma jedną liczbę i jeden kolor wiodący: słońce na bursztynowo, magazyn na zielono, dom na niebiesko, sieć w kolorze łupku. Reszta czeka w 40% krycia, aż przyjdzie jej kolej.',
      'Izometria daje danym miejsce: dom z panelami, magazyn przy ścianie i słup sieci stoją na jednej płycie, a prąd płynie między nimi po ścieżkach. Kreski biegną z prędkością zależną od mocy, więc 6,4 kW z dachu widać jako szybki strumień, a 0,5 kW do domu jako spokojny. Krój Archivo w wąskiej szerokości trzyma duże liczby zwarte i czytelne.',
    ],
    keywords: ['Izometria', 'Przepływ', 'Rysowanie w czasie', 'Wąskie liczby', 'Bilans'],
  },
  storyboard: {
    title: '25 sekund, sześć ujęć, jedna liczba w\u00a0każdym',
    intro:
      'Sześć ujęć w 750 klatkach. Hak to dom z płynącym prądem i liczba 6,4 kW z dachu od pierwszej klatki, bo w sklepie pierwsza klatka musi sprzedawać bez dźwięku. Potem magazyn, cały dzień na wykresie, porada na jutro i bilans, a na końcu ekran startowy z ikoną.',
    alt: 'Plansza sześciu klatek kluczowych wersji sklepowej z numerami ujęć, czasami i osią czasu',
    rules: [
      'Trzy napisy, każdy najwyżej pięć słów i co najmniej 2,2 s na ekranie.',
      'Napisy siedzą nad paskiem zakładek, poza górnymi 120 i dolnymi 160 pikselami, gdzie sklep kładzie własne elementy.',
      'Plakat sklepowy to klatka 45: dom z przepływami i 6,4 kW z dachu. Domyślna klatka z piątej sekundy, rysująca się krzywa magazynu, też się broni.',
      'Zegar na pasku stanu idzie z historią: 13:10 przy przepływie i magazynie, 21:40 przy podsumowaniu dnia.',
    ],
  },
  motion: {
    title: 'Ruch, który coś mierzy',
    intro:
      'Każdy ruch ma nazwę i wartość zapisaną w tokenach projektu. Linie rysują się w czasie, liczby dochodzą do wyniku, a jedyny ruch liniowy to kreski przepływu, bo pokazują moc.',
    caption:
      'Ta sama krzywa produkcji i ta sama liczba 47,8 kWh. Po lewej krzywa draw i licznik count, po prawej oba liniowo. Ruch liniowy wygląda mechanicznie, a licznik długo pokazuje liczby, których nikt nie powinien czytać. Zmień długość, żeby zobaczyć, kiedy rysowanie robi się nerwowe.',
    rules: [
      [
        'Jedna informacja na ujęcie',
        'kolor wiodący zostaje w 100%, pozostałe przepływy i wiersze schodzą do 40% w 12 klatek',
      ],
      [
        'Przepływ',
        'kreska 8, przerwa 10, 1 piksel na klatkę na każdy kilowat: 6,4 kW z dachu biegnie prawie trzynaście razy szybciej niż 0,5 kW do domu',
      ],
      [
        'Stopniowanie',
        'nagłówek, liczba i karta wjeżdżają co 4 klatki, linia zużycia rysuje się dopiero po produkcji',
      ],
      [
        'Kamera',
        'w wersji marketingowej jedzie po osiach izometrii pod kątem 30 stopni: dach, magazyn, tablica z wykresem, pralka, słupki bilansu',
      ],
    ] as [string, string][],
  },
  screens: {
    title: 'Siedem ekranów, jeden model dnia',
    intro:
      'Ekrany są komponentami z jednego mini design systemu: kolory danych, krój w pięciu odmianach, karty z krawędzią jak płyta w izometrii. Wszystkie liczby pochodzą z jednego modelu dnia co 5 minut, więc magazyn, wykres i bilans mówią to samo. Projekt w kanwie 443×960, render w skali 2, czyli dokładnie 886×1920.',
  },
  formats: {
    title: 'Sklep pokazuje aplikację, social pokazuje dom',
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, dlatego powstały dwie odrębne wersje. Sklepowa to sam ekran aplikacji. W marketingowej izometryczny dom stoi obok telefonu, przewód z falownika prowadzi prąd prosto do ekranu, a kamera przejeżdża od dachu przez magazyn i tablicę z wykresem do słupków bilansu.',
    store: 'Wersja sklepowa, sam interfejs',
    portrait: 'Reels, TikTok, Shorts, 9:16',
    square: 'Post w kanale, 1:1',
    wide: 'YouTube i link w Google Play, 16:9',
  },
  deliverables: {
    title: 'Pliki gotowe do wgrania, z\u00a0parametrami',
    intro:
      'Klient dostaje pliki gotowe do wgrania, z parametrami sprawdzonymi przez ffprobe. Wersje pełnej jakości są za duże na stronę, dlatego tutaj odtwarzają się lekkie pętle bez dźwięku, w formacie WebM i MP4.',
    extras: [
      ['Ikona', '1024×1024 PNG bez przezroczystości i podgląd z zaokrągleniem'],
      ['Storyboard', 'tabela ujęć z klatkami i plansza klatek kluczowych w PNG'],
      ['Ekrany', 'siedem ekranów interfejsu w 886×1920'],
      ['Model danych', 'profil dnia co 5 minut, z którego liczą się wszystkie liczby w wideo'],
    ] as [string, string][],
  },
  cta: {
    title: 'Twoje dane też mogą opowiadać historię',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard, styl ruchu i komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla klientów',
  },
};
