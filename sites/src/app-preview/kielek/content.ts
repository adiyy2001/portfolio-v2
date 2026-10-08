export const content = {
  kicker: 'Wzornik, app preview. A4, claymorphism pastelowy',
  lead: 'Podgląd aplikacji do pielęgnacji roślin domowych: wersja do App Store, trzy formaty na social media i lekkie pętle na stronę. Miękkie, napompowane kształty, ciepłe pastele i maskotka, która gra razem z interfejsem.',
  heroCaption:
    'Wersja marketingowa 16:9, pętla na stronę. Na telefonie odtwarza się pionowa wersja 9:16.',
  facts: [
    ['Wersja sklepowa', '21 s, 886×1920, 30 kl./s'],
    ['Ruch', 'sprężyny z odbiciem, zgniecenie, krople'],
    ['Formaty social', '9:16, 1:1 i 16:9'],
    ['Dźwięk', 'brak, wszystko czytelne bez niego'],
  ] as [string, string][],
  client: {
    title: 'Mniej przelanych roślin, więcej zielonych liści',
    paragraphs: [
      'Kiełek to aplikacja dla ludzi, którzy mają w mieszkaniu od pięciu do dwudziestu roślin i nie pamiętają, która kiedy piła. Rośliny domowe częściej giną od nadmiaru wody niż od suszy, a ich potrzeby zależą od gatunku, okna i pory roku.',
      'Zadanie: podgląd do App Store, który w pierwszych dwóch sekundach pokaże, że aplikacja jest życzliwa i konkretna, trzy formaty na kampanię w mediach społecznościowych, pętle na stronę i storyboard. Bez dźwięku, bo sklep i feed startują wyciszone.',
    ],
    facts: [
      [
        'Użytkownik',
        'mieszkanie w mieście, od 5 do 20 roślin, pierwsze kwiatki albo już mała dżungla',
      ],
      [
        'Trzy funkcje',
        'plan podlewania zmieniany z porą roku, diagnoza po objawach na liściach, pokoje ze światłem i wilgotnością',
      ],
      [
        'Rośliny w historii',
        'monstera Zdzisia, kalatea Kalina, sansewieria Szabla, epipremnum Lolek i trzy inne, w salonie, sypialni i kuchni',
      ],
      ['Ton', 'ciepły i życzliwy, ale z liczbami: mililitry, dni i procenty'],
    ] as [string, string][],
    plan: {
      label: 'Czwartek, 8 października',
      title: 'Dziś podlej 3 rośliny',
      rows: [
        ['Zdzisia', 'monstera, salon', '400 ml'],
        ['Kalina', 'kalatea, sypialnia', '250 ml'],
        ['Szabla', 'sansewieria, salon', '150 ml'],
      ] as [string, string, string][],
      total: 'Razem 800 ml',
    },
  },
  direction: {
    title: 'Miękko, ciepło i\u00a0z\u00a0charakterem',
    paragraphs: [
      'Rośliny kojarzą się z czymś żywym i miękkim, a nie z tabelką. Dlatego interfejs wygląda jak ulepiony z plasteliny: karty są napompowane, mają jasny brzeg u góry i miękki cień pod spodem. Nie ma ostrych narożników ani zimnych szarości, a promień nigdy nie spada poniżej 18 pikseli.',
      'Paleta jest ciepła: brzoskwiniowe tło, pistacja dla zdrowych roślin, masło dla dzisiejszych zadań, róż dla tych, które potrzebują uwagi, i woda w kroplach. Maskotka Kiełek to kiełek w doniczce zbudowany z kilku brył. Cieszy się po podlaniu, martwi się przy diagnozie i kiwa głową, gdy znajdzie rozwiązanie.',
    ],
    keywords: ['Plastelina', 'Ciepłe pastele', 'Zaokrąglony krój', 'Maskotka', 'Odbicie'],
  },
  storyboard: {
    title: '21 sekund, sześć ujęć, każde ląduje z\u00a0odbiciem',
    intro:
      'Sześć ujęć w 630 klatkach. Hak to maskotka w doniczce i karta Dziś podlej 3 rośliny, obie na ekranie od pierwszej klatki, bo w sklepie pierwsza klatka musi sprzedawać bez dźwięku i od razu mówić, do czego jest aplikacja. Potem podlewanie, kalendarz, który sam zmienia się z porą roku, diagnoza i pokoje, a na końcu ekran startowy z ikoną.',
    alt: 'Plansza sześciu klatek kluczowych wersji sklepowej z numerami ujęć, czasami i osią czasu',
    rules: [
      'Trzy napisy, każdy najwyżej pięć słów i co najmniej 2 s na ekranie.',
      'Napisy siedzą nad paskiem zakładek, poza górnymi 120 i dolnymi 160 pikselami, gdzie sklep kładzie własne elementy.',
      'Plakat sklepowy to klatka 30: Kiełek po skoku nad kartą Dziś podlej 3 rośliny. Domyślna klatka z piątej sekundy, pistacjowa karta Zdzisi i cieszący się Kiełek, też się broni.',
    ],
  },
  motion: {
    title: 'Odbicie zamiast zatrzymania',
    intro:
      'Każdy ruch ma nazwę i wartość zapisaną w tokenach projektu. Te same liczby napędzają wideo i laboratorium kropli poniżej.',
    caption:
      'Po lewej kropla na sprężynie bounce, po prawej na sztywnej sprężynie bez przestrzelenia. Obie spadają po tej samej krzywej drop i zgniatają się przy zetknięciu z liściem, różni je tylko powrót do kształtu. Zmień sztywność i tłumienie, żeby zobaczyć, kiedy odbicie robi się galaretowate, a kiedy znika.',
    rules: [
      [
        'Nic nie staje jak wryte',
        'karty, chipy i maskotka dojeżdżają z przestrzeleniem około 20% i dwoma miękkimi odbiciami',
      ],
      [
        'Lądowanie',
        'każde zetknięcie ma zgniecenie 0,88 na 1,1 przez 4 klatki, także karta, która dojeżdża na górę ekranu',
      ],
      [
        'Stopniowanie',
        'karty roślin co 5 klatek, tygodnie kalendarza co 5 klatek, słowa nagłówków co 3 klatki',
      ],
      [
        'Zmiana zakładki',
        'stary ekran odjeżdża w lewo w 6 klatek, nowy wjeżdża z prawej na sprężynie bounce i ugina się przy hamowaniu, a nagłówek wchodzi dopiero, gdy poprzedni ekran zniknie',
      ],
      [
        'Kamera w wersji marketingowej',
        'powolna orbita: tło, rekwizyty i telefon przesuwają się na różnej głębokości, więc płaska scena wygląda na trójwymiarową',
      ],
    ] as [string, string][],
  },
  screens: {
    title: 'Sześć ekranów z\u00a0jednej plasteliny',
    intro:
      'Sześć ekranów zbudowanych jako komponenty z jednego mini design systemu: kolory, krój w trzech wagach, odstępy, promienie i trzy poziomy cienia. Projekt w kanwie 443×960, render w skali 2, czyli dokładnie 886×1920.',
  },
  formats: {
    title: 'Sklep pokazuje aplikację, social pokazuje Kiełka',
    intro:
      'Apple wymaga, żeby podgląd w sklepie pokazywał prawdziwy interfejs, dlatego powstały dwie odrębne wersje. Sklepowa to sam ekran aplikacji. Marketingowa ma różowy telefon z plasteliny, unoszące się doniczki i krople, a w chwili podlewania Kiełek wyskakuje z ekranu i siada na krawędzi telefonu.',
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
      ['Ekrany', 'sześć ekranów interfejsu w 886×1920'],
      ['Projekt ruchu', 'tokeny kolorów, typografii i ruchu, opisane jak tutaj'],
    ] as [string, string][],
  },
  cta: {
    title: 'Twoja aplikacja też może mieć charakter',
    text: 'Napisz, co robi Twoja aplikacja i kto jej używa. Zaproponuję storyboard, styl ruchu i komplet plików do App Store, Google Play i mediów społecznościowych.',
    link: 'Zobacz ofertę dla klientów',
  },
};
