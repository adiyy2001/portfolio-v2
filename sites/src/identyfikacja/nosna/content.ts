import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Marta Kolasa',
  role: 'dyrektorka programowa',
  street: 'ul. Szpulowa 5',
  city: '90-001 Łódź',
  place: 'dawna przędzalnia, hala C',
  phone: '+48 42 000 00 07',
  phoneHref: 'tel:+48420000007',
  email: 'program@nosna.example',
  web: 'nosna.example',
} as const;

export const content: CaseContent = {
  lead: 'Znak, który jest systemem: jedna nośna, a dookoła niej tyle pól, ile festiwal ma dni, scen i temp.',
  client: {
    paragraphs: [
      'Nośna to trzydniowy festiwal sztuki nowych mediów i muzyki elektronicznej w dawnej przędzalni w Łodzi. Piątek, sobota i niedziela, cztery sceny w czterech halach, instalacje, koncerty i noc klubowa.',
      'Przez dwie edycje festiwal wisiał na plakatach z innym logo co roku, a każdy wykonawca dostawał własną grafikę. Zespół programowy nie miał jednego znaku, który dałoby się powielić bez grafika.',
      'Zadanie: identyfikacja, która zostaje ta sama, a mimo to może wyglądać inaczej dla każdego dnia, sceny i tempa. Do tego generator, którym organizatorzy sami zrobią plakat, bilet i post na sceny, o których nikt jeszcze nie pomyślał.',
    ],
    facts: [
      ['Branża', 'festiwal sztuki nowych mediów i muzyki elektronicznej'],
      ['Miejsce', 'Łódź, dawna przędzalnia'],
      ['Zakres', 'strategia, logo jako system, generator, makiety, animacja, brand book'],
      ['Odbiorcy', 'ludzie od 20 do 40 lat z Łodzi, Warszawy i Berlina oraz artyści z naboru'],
    ],
  },
  direction: {
    title: 'Sygnał zamiast ozdoby',
    paragraphs: [
      'Fala nośna to stały sygnał, który po zmodulowaniu niesie treść. Tak działa identyfikacja Nośnej: napis, linia nośna i mały pierścień odbiornika nigdy się nie ruszają. Wszystko wokół nich jest modulacją, czyli polem, które powstaje z trzech parametrów: dnia, sceny i tempa.',
      'Łódź to miasto włókna, więc nitki, przędza i krosna dają język: sceny nazywają się Przędzalnia, Tkalnia, Farbiarnia i Wykończalnia. Pole ma charakter tkaniny zapisanej liczbami. Tło jest jasne i drukarskie, a kolor niesie wyłącznie dzień. Dzięki temu strona wygląda jak program festiwalu, a nie jak ulotka z klubu.',
    ],
    keywords: ['sygnał', 'nić', 'modulacja'],
  },
  strategy: {
    audience:
      'Dwudziesto i trzydziestolatkowie z Łodzi, Warszawy i Berlina, którzy chodzą na koncerty i wystawy, oraz artyści i projektanci dźwięku, którzy zgłaszają się do programu.',
    values: [
      {
        title: 'Sygnał',
        text: 'Mówimy rzeczy, które da się zmierzyć: godzinę, halę, tempo. Szum zostawiamy artystom.',
      },
      {
        title: 'Eksperyment',
        text: 'Każda edycja próbuje czegoś, co jeszcze nie miało nazwy. Identyfikacja ma to unieść.',
      },
      {
        title: 'Miasto z włókna',
        text: 'Przędzalnie, krosna i nitka są historią Łodzi i zostają tu jako język formy.',
      },
    ],
    personality: ['precyzyjna', 'eksperymentalna', 'otwarta'],
    avoids: 'ciemnego neonu i cyberestetyki, ulotek klubowych oraz losowości bez reguł',
    positioning:
      'Nośna to trzydniowy festiwal sztuki nowych mediów i muzyki elektronicznej w dawnej fabryce w Łodzi, w którym każdy dzień, scena i tempo ma swój wygenerowany znak.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech kierunków narysowanych szybko i surowo. Każdy odpowiada na to samo pytanie: co w znaku ma być stałe, a co ma się zmieniać.',
    rejected: [
      {
        id: 'nitki',
        title: 'Cztery nitki',
        text: 'Cztery poziome nitki, po jednej na scenę, których interferencja tworzy część generowaną.',
        reason:
          'Odpadły, bo przy czterech liniach dwanaście wariantów różni się tylko grubością i przesunięciem. Za mało, żeby dzień i tempo były widoczne z daleka.',
        thumb: 'figures/direction-nitki.svg',
      },
      {
        id: 'akcent',
        title: 'Ruchomy akcent',
        text: 'Kreska nad literą ś zmienia kształt zależnie od parametrów.',
        reason:
          'Odpadł, bo pole jest zbyt małe, żeby unieść dwanaście wersji, a na ekranie telefonu zmiana jest niewidoczna. Jako element systemu byłby słaby, jako ozdoba zbędny.',
        thumb: 'figures/direction-akcent.svg',
      },
    ],
    chosen: {
      title: 'Nośna i pole',
      reason:
        'Stała linia nośna z pierścieniem i napisem oraz generowane pole modulacji nad nią. Rozpoznawalność niesie stała część, a różnorodność pole. Dwanaście wariantów (trzy dni razy cztery sceny) czyta się jako jedną markę, bo zawsze mają tę samą nośną, ten sam pierścień i tę samą grubość nitki.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Napis w kroju Syne 800 jest bardzo szeroki, więc pary No, śn i na zostały ściągnięte, a oś odrobinę rozsunięta, żeby kreska nad ś nie dotykała sąsiadów.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Nośna kończy się pierścieniem dokładnie w prawej krawędzi napisu, a pole zaczyna się w tej samej odległości od lewej. Dzięki temu pole i napis tworzą jeden prostokąt.',
      },
      {
        title: 'Test czytelności',
        text: 'Pełny sygnet czyta się od 48 pikseli. Poniżej zastępuje go uproszczony znak w kwadracie: jedna soczewka, nośna i pierścień na atramencie, czytelny w karcie przeglądarki.',
      },
    ],
  },
  tone: [
    {
      title: 'Podajemy dane, nie przymiotniki',
      text: 'Godzina, hala, tempo. Resztę dopowiada program.',
      yes: 'Sobota, 22:00, Tkalnia. 128\u00a0BPM.',
      no: 'Niesamowita noc pełna elektryzujących brzmień!',
    },
    {
      title: 'Mówimy jak program, nie jak ulotka',
      text: 'Krótkie wpisy w kolumnie, bez wykrzykników i bez haseł.',
      yes: 'Przędzalnia: instalacja na 32 szpule. Wstęp wolny.',
      no: 'Nie przegap, to będzie najlepszy weekend w roku!',
    },
    {
      title: 'Nazywamy rzeczy po łódzku',
      text: 'Sceny mają nazwy z fabryki. Używamy ich zawsze i bez tłumaczenia.',
      yes: 'Spotkajmy się w Farbiarni.',
      no: 'Spotkajmy się na stage numer trzy.',
    },
    {
      title: 'Zostawiamy miejsce na eksperyment',
      text: 'Nie obiecujemy, że będzie ładnie. Obiecujemy, że będzie nowo.',
      yes: 'Premiera: chór sterowany modemami.',
      no: 'Gwarantujemy świetną zabawę dla każdego.',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Pole piątku na atramencie. Druk 85 na 55\u00a0mm, spad\u00a03\u00a0mm.',
      image: 'mockups/nosna-card-front.jpg',
      alt: 'Awers wizytówki Nośnej: czerwone pole nitek na atramentowym tle.',
    },
    {
      id: 'karta-rewers',
      title: 'Wizytówka, rewers',
      caption: 'Dane na kości, w kroju monospace jak w programie.',
      image: 'mockups/nosna-card-back.jpg',
      alt: 'Rewers wizytówki Nośnej z nazwiskiem, funkcją i danymi kontaktowymi.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Nośna biegnie przez całą szerokość kartki i kończy się pierścieniem.',
      image: 'mockups/nosna-letterhead.jpg',
      alt: 'Papier firmowy Nośnej w formacie A4 z linią nośną w górnej części.',
    },
    {
      id: 'identyfikator',
      title: 'Identyfikator i plakaty dni',
      caption:
        'Trzy plakaty, po jednym na dzień, na kolorze dnia z polem w atramencie, i identyfikator na smyczy. Pierścień odbiornika zostaje widoczny na każdym formacie.',
      image: 'mockups/nosna-application.jpg',
      alt: 'Identyfikator festiwalowy i trzy plakaty Nośnej na tle czerwonym, morskim i różowym, z czarnym polem nitek i widocznym pierścieniem.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML z tabel, logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/nosna-email-signature.jpg',
      alt: 'Podpis e-mail Nośnej z poziomym logo, telefonem i adresem.',
    },
  ],
  deliverables: {
    intro:
      'Pliki marki leżą w jednej paczce ZIP i osobno na liście poniżej. Paczka zawiera logo, kolory, kroje, ikony, wzór, druki, media społecznościowe i brand book. Makiet i animacji logo w niej nie ma, pobierasz je z listy. Rozwiń grupę, żeby zobaczyć pliki z wymiarami. Dwanaście wariantów znaku to osobne pliki SVG w grupie Logo.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twój znak też może być systemem',
    text: 'Opowiedz mi o wydarzeniu, marce albo produkcie, który zmienia się częściej niż jedna kampania. Zaproponuję stałą część i reguły dla zmiennej, pokażę trzy kierunki i dowiozę komplet plików razem z generatorem.',
  },
};

export const extras = {
  typeScale: [
    {
      name: 'Tytuł',
      font: 'display',
      weight: 800,
      size: 56,
      line: 1.02,
      use: 'okładki, nazwy dni, hasło strony',
    },
    {
      name: 'Nagłówek',
      font: 'display',
      weight: 700,
      size: 32,
      line: 1.1,
      use: 'sekcje i plakaty',
    },
    { name: 'Podtytuł', font: 'display', weight: 500, size: 20, line: 1.35, use: 'wstępy i lead' },
    { name: 'Tekst', font: 'display', weight: 500, size: 16, line: 1.6, use: 'akapity i opisy' },
    {
      name: 'Parametr',
      font: 'mono',
      weight: 500,
      size: 13,
      line: 1.5,
      use: 'godziny, tempo, ziarno, podpisy',
    },
  ],
  specimen: 'Sygnał niesie treść. Sobota, 22:00, Tkalnia, 128\u00a0BPM.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 → ×',
  rules: [
    {
      parameter: 'Dzień',
      sets: 'kolor, faza i miejsce szczytu',
      text: 'Piątek jest cynobrowy, a szczyt energii leży na początku pola. Sobota jest morska i symetryczna. Niedziela jest magentowa, a szczyt leży na końcu.',
    },
    {
      parameter: 'Scena',
      sets: 'rodzina kształtu',
      text: 'Przędzalnia daje skręcone nitki, Tkalnia schodki z kart krosna, Farbiarnia wypełnione pasma, Wykończalnia wachlarz linii.',
    },
    {
      parameter: 'Tempo',
      sets: 'gęstość i częstotliwość',
      text: 'Od 60 do 180\u00a0BPM. Im szybciej, tym więcej nitek i więcej drgań na długości pola. Zakres nitek zależy od sceny.',
    },
    {
      parameter: 'Ziarno',
      sets: 'drobne różnice',
      text: 'Ziarno jest skrótem z dnia, sceny i tempa, więc ten sam zestaw zawsze daje ten sam znak. Ziarno przesuwa fazę i rozstrajka nitki o ułamki procenta.',
    },
  ],
  constants: [
    'Napis Nośna w kroju Syne 800, zawsze atramentem.',
    'Linia nośna o grubości 9 jednostek, zawsze w tej samej wysokości.',
    'Pierścień odbiornika po prawej, zawsze w tym samym miejscu.',
    'Pole zaczyna się i kończy na nośnej, nigdy jej nie opuszcza.',
  ],
  graphics: [
    {
      title: 'Wzór z interferencji',
      text: 'Dwanaście przesuniętych w fazie fal, które po złożeniu dają kafel bez szwu. Wzór ma barwę dnia albo atramentu i służy jako tło plakatów i koperty.',
    },
    {
      title: 'Linia nośna jako linijka',
      text: 'Nośna przecina każdy format od krawędzi do krawędzi i kończy się pierścieniem. Układa kolumny i dzieli kartkę.',
    },
    {
      title: 'Program w kolumnach',
      text: 'Trzy kolumny dni, w każdej godziny w kroju monospace. Układ przypomina rozkład jazdy i drukowany program festiwalu.',
    },
  ],
  layoutRules: [
    'Trzy kolumny, jedna na dzień. Każda w swoim kolorze.',
    'Godziny, parametry i ziarno w kroju monospace, tekst w Syne.',
    'Pole zawsze na nośnej, nigdy obok niej i nigdy pod napisem.',
    'Zero tekstur, zdjęć w tle i cieni. Kolor jest płaski.',
    'Kolor niesie dzień na dwa sposoby: nitki w kolorze dnia na atramencie albo pole w atramencie na tle w kolorze dnia. Na kości kolor dnia jest tylko dekoracją.',
    'Pierścień odbiornika zawsze jest widoczny. Pole może wyjść poza lewą krawędź plakatu, prawa strona kończy się pierścieniem.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: dokumentacja pracy artystów w hali, światło zastane, bez lamp błyskowych. Kadry szerokie, z ludźmi przy urządzeniach, kablami i projektorami widocznymi w kadrze. Ostrość na dłoniach i interfejsach, tło może się rozmywać. Kolory neutralne, przyciemniony kontrast, bez nasycania. Zdjęcia nie mają ramek, kolor dnia pojawia się tylko w podpisie.',
  animation:
    'Linia nośna jest nieruchoma, a pole przechodzi przez trzy dni: piątek, sobotę i niedzielę, zmieniając kolor i miejsce szczytu. Na końcu osiada w znaku głównym. Całość trwa trzy sekundy. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe wysokości litery N z napisu Nośna. Żaden tekst ani brzeg kartki nie wchodzi w ten obszar.',
  minimum: {
    primary: { px: 120, mm: 32, label: 'Logo główne' },
    horizontal: { px: 96, mm: 30, label: 'Logo poziome' },
    symbol: { px: 48, mm: 12, label: 'Sygnet' },
    favicon: { px: 16, mm: 0, label: 'Ikona strony' },
  },
  social: [
    {
      id: 'post-1',
      day: 'piatek',
      headline: 'Piątek',
      body: 'Przędzalnia, 18:00. Instalacja na 32 szpule. Wstęp wolny.',
      foot: 'ul. Szpulowa 5, Łódź',
    },
    {
      id: 'post-2',
      day: 'sobota',
      headline: 'Sobota',
      body: 'Tkalnia, 22:00. Koncert na 8 syntezatorów modularnych. 128\u00a0BPM.',
      foot: 'ul. Szpulowa 5, Łódź',
    },
    {
      id: 'post-3',
      day: 'niedziela',
      headline: 'Niedziela',
      body: 'Wykończalnia, do rana. Noc klubowa na 146\u00a0BPM.',
      foot: 'ul. Szpulowa 5, Łódź',
    },
  ],
} as const;
