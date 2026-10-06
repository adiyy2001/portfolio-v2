import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Zofia Kurek',
  role: 'piekarka, współwłaścicielka',
  street: 'ul. Piecowa 7',
  city: '30-001 Kraków',
  phone: '+48 12 000 00 07',
  phoneHref: 'tel:+48120000007',
  email: 'zamowienia@skibka.example',
  hours: [
    ['wt do pt', '7:00 do 17:00'],
    ['sobota', '7:00 do 14:00'],
    ['niedziela, poniedziałek', 'zamknięte'],
  ],
} as const;

export const content: CaseContent = {
  lead: 'Znak, który można przybić na torbie, a nie tylko wydrukować.',
  client: {
    paragraphs: [
      'Skibka to mała piekarnia na krakowskim Podgórzu. Chleb piecze na własnym zakwasie, w jednym piecu, w rytmie trzydziestu sześciu godzin: ciasto dojrzewa dwa dni, zanim trafi do pieca.',
      'Sprzedaje przez okno od ulicy i wozi pieczywo do czterech kawiarni. Do tej pory torby podpisywała długopisem, a w witrynie wisiała kartka z cenami.',
      'Zadanie: identyfikacja, którą piekarnia zrobi sama, tanio i szybko, jedną pieczątką i jedną drukarką, i która nie będzie wyglądać jak sieć sklepów.',
    ],
    facts: [
      ['Branża', 'piekarnia rzemieślnicza na zakwasie'],
      ['Miejsce', 'Kraków, Podgórze'],
      ['Zakres', 'strategia, logo, system, makiety, animacja, brand book'],
      ['Odbiorcy', 'sąsiedzi z Kazimierza i Podgórza oraz cztery kawiarnie'],
    ],
  },
  direction: {
    title: 'Rzemiosło zamiast gładkości',
    paragraphs: [
      'Chleb na zakwasie jest niedoskonały z założenia. Każdy bochenek wychodzi trochę inny i właśnie za to ludzie go lubią. Identyfikacja ma tę samą cechę: nie ma w niej prostej linii ani idealnego koła. Brzeg pieczątki, papier i wzór powstały z szumu, który za każdym razem układa się odrobinę inaczej.',
      'Kolory biorą się z mąki, skórki i żyta, a nie z palety technologicznej. Krój nagłówkowy ma charakter ręcznie ciętej litery, a tekst jest zwykły i czytelny. Odbiorca kupuje chleb dwa, trzy razy w tygodniu i chce wiedzieć, co je. Pieczątka mówi to wprost: jest ręczna, jest z Krakowa, jest od człowieka.',
    ],
    keywords: ['wolno', 'zakwas', 'mąka'],
  },
  strategy: {
    audience:
      'Sąsiedzi z Kazimierza i Podgórza, którzy kupują chleb dwa lub trzy razy w tygodniu i chcą wiedzieć, co jest w środku, oraz kawiarnie, które zamawiają bochenki na rano.',
    values: [
      { title: 'Wolno', text: 'Bochenek dojrzewa 36 godzin i nikt go nie poganiał.' },
      {
        title: 'Z mąki i wody',
        text: 'Mąka, woda, sól i zakwas. Nic więcej nie trafia do ciasta.',
      },
      {
        title: 'Po sąsiedzku',
        text: 'Piekarka stoi w oknie, zna imiona i odkłada bochenek na później.',
      },
    ],
    personality: ['ciepła', 'uczciwa', 'trochę niedoskonała'],
    avoids:
      'idealnej geometrii, błyszczącej techniki, neonów i wszystkiego, co wygląda jak sieć sklepów',
    positioning:
      'Skibka piecze chleb na własnym zakwasie w małym piecu na Podgórzu, wolno i bez dodatków, dla ludzi, którzy lubią wiedzieć, co jedzą.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech szkiców, narysowanych szybko i surowo. Każdy odpowiada na inne pytanie: czy znak ma być pieczątką, kromką czy kłosem.',
    rejected: [
      {
        id: 'kromka',
        title: 'Kromka z literą S',
        text: 'Sylwetka kromki z wyciętą literą S.',
        reason:
          'Odpadła, bo litera w środku ginie już przy 24 pikselach, a kromka kojarzy się z chlebem tostowym z supermarketu, nie z bochenkiem na zakwasie.',
        thumb: 'figures/direction-kromka.svg',
      },
      {
        id: 'klos',
        title: 'Kłos z trzech kresek',
        text: 'Trzy ręcznie cięte kreski układają się w kłos nad nazwą.',
        reason:
          'Odpadł, bo kłos jest najczęstszym znakiem piekarni w Polsce. Niczego nie mówi o zakwasie ani o Podgórzu i nie da się go przybić na torbie.',
        thumb: 'figures/direction-klos.svg',
      },
    ],
    chosen: {
      title: 'Pieczątka',
      reason:
        'Pieczątka działa na trzech poziomach jednocześnie: jako sygnet na awatarze i w karcie przeglądarki, jako odcisk na papierowej torbie i jako znak jakości na dostawie dla kawiarni. Ma nieregularny brzeg, więc pasuje do chleba, który też nie jest idealny.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Pary Sk i ka zostały ściągnięte, a ki, ib i bk rozsunięte o kilka jednostek, żeby szeryfy nie zlewały się w jedną szynę, a kolor tekstu w słowie Skibka był równy.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Okrągłe litery wystają ponad linię o ułamek wysokości, a szeryfy k i b leżą na jednej linii podstawowej.',
      },
      {
        title: 'Test czytelności',
        text: 'Pełna pieczątka działa od 48 pikseli. Poniżej niej zastępuje ją uproszczony sygnet z bochenkiem w grubym kole, który czyta się w 16 pikselach.',
      },
    ],
  },
  tone: [
    {
      title: 'Mówimy, co jest w chlebie',
      text: 'Skład podajemy wprost, bez przymiotników.',
      yes: 'Mąka żytnia, woda, sól, zakwas. Nic więcej.',
      no: 'Wyselekcjonowane składniki najwyższej jakości.',
    },
    {
      title: 'Czas jest składnikiem',
      text: 'Pokazujemy, ile chleb dojrzewa, i nie udajemy pośpiechu.',
      yes: 'Ciasto rośnie 36 godzin. Nie poganiamy go.',
      no: 'Szybko, świeżo i zawsze na czas!',
    },
    {
      title: 'Po sąsiedzku',
      text: 'Piszemy tak, jak mówi się przez okno piekarni.',
      yes: 'Zosia piecze od piątej. Wpadnij po ciepły.',
      no: 'Zapraszamy do skorzystania z naszej oferty.',
    },
    {
      title: 'Krótko i bez wykrzykników',
      text: 'Jedno zdanie na jedną informację, bez wykrzykników.',
      yes: 'Dziś: żytni, pszenny, bułki. Do 14:00.',
      no: 'Dziś w ofercie same pyszności!!!',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Kraft i pieczątka. Druk 85 na 55 mm, spad 3 mm.',
      image: 'mockups/skibka-card-front.jpg',
      alt: 'Awers wizytówki Skibki: brązowa pieczątka na papierze kraft.',
    },
    {
      id: 'karta-rewers',
      title: 'Wizytówka, rewers',
      caption: 'Dane kontaktowe na mące, bez ozdób.',
      image: 'mockups/skibka-card-back.jpg',
      alt: 'Rewers wizytówki Skibki z nazwiskiem, adresem i telefonem.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Logo główne w nagłówku, pasek ze wzorem z lewej, adres w stopce.',
      image: 'mockups/skibka-letterhead.jpg',
      alt: 'Papier firmowy Skibki w formacie A4 z krótkim listem.',
    },
    {
      id: 'torba',
      title: 'Torba i etykieta w oknie',
      caption:
        'Zastosowanie dla piekarni: papierowa torba na chleb i karta z dzisiejszymi bochenkami.',
      image: 'mockups/skibka-application.jpg',
      alt: 'Papierowa torba kraft z pieczątką Skibki i etykieta z listą dzisiejszych bochenków.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML bez obrazków w tle, logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/skibka-email-signature.jpg',
      alt: 'Podpis e-mail Skibki z poziomym logo, telefonem i adresem.',
    },
  ],
  deliverables: {
    intro:
      'Logo, kolory, kroje, wzór, ikony, druk, grafiki do mediów, podpis e-mail i brand book leżą w jednej paczce ZIP. Makiety i animacja są osobnymi plikami. Wszystko jest też na liście poniżej, rozwiń grupę, żeby zobaczyć pliki z wymiarami.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twoja pieczątka też może być ręczna',
    text: 'Opowiedz mi o swojej firmie i o ludziach, którzy ją znają. Zaproponuję kierunek, pokażę trzy szkice logo i dowiozę komplet plików na każdą okazję.',
  },
};

export const extras = {
  typeScale: [
    {
      name: 'Tytuł',
      font: 'display',
      size: 56,
      line: 1.05,
      use: 'okładki, hasła, nagłówek strony',
    },
    { name: 'Nagłówek', font: 'display', size: 34, line: 1.12, use: 'sekcje i karty' },
    { name: 'Podtytuł', font: 'text', weight: 700, size: 20, line: 1.3, use: 'wstępy i lead' },
    { name: 'Tekst', font: 'text', weight: 400, size: 17, line: 1.55, use: 'akapity, opisy, menu' },
    {
      name: 'Podpis',
      font: 'text',
      weight: 500,
      size: 14,
      line: 1.4,
      use: 'podpisy, etykiety, adresy',
    },
  ],
  specimen: 'Mąka, woda, sól i zakwas. Chleb dojrzewa trzydzieści sześć godzin.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 „”·×',
  graphics: [
    {
      title: 'Wzór z odcisków',
      text: 'Nieregularne nacięcia, ziarna i kropki rozsypane bez rytmu. Wzór nie ma osi, a szew kafla jest niewidoczny.',
    },
    {
      title: 'Faktura papieru',
      text: 'Drobne ziarno z szumu, nałożone na mąkę i kraft. Tylko na ekranie i w druku z rastra, nigdy w plikach logo.',
    },
    {
      title: 'Karty z krzywym brzegiem',
      text: 'Każda karta jest lekko przechylona, o jeden do dwóch stopni, a jej brzeg jest nierówny jak rwany papier.',
    },
  ],
  layoutRules: [
    'Jedna kolumna tekstu, szerokość do 62 znaków.',
    'Pieczątka stoi samotnie, z polem ochronnym równym wysokości litery S.',
    'Karty i zdjęcia pochylamy o najwyżej dwa stopnie, tekstu nie pochylamy nigdy.',
    'Linii i ramek rysowanych linijką nie używamy. Linie rysujemy kreską o nierównej grubości.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: światło dzienne z okna, boczne i miękkie. Bochenki w całości i w przekroju, na drewnie, kraftowym papierze lub lnianej ściereczce. Mąka na blacie jest widoczna i nieuprzątnięta. Ręce w kadrze są prawdziwe, bez rękawiczek i bez pozowania. Kolory ciepłe, bez filtrów i bez wysokiego kontrastu. Zdjęcia kadrujemy od góry albo z wysokości blatu, nigdy z perspektywy żabiej.',
  animation:
    'Pieczątka opada na papier, tusz rozlewa się odrobinę i brzeg się uspokaja. Całość trwa trzy sekundy. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe wysokości litery S z napisu Skibka. Żaden tekst ani brzeg strony nie wchodzi w ten obszar.',
  minimum: {
    symbol: '16 px na ekranie, 6 mm w druku (uproszczony sygnet)',
    fullStamp: '48 px na ekranie, 18 mm w druku',
    primary: '120 px szerokości, 32 mm w druku',
  },
  social: [
    {
      id: 'post-1',
      headline: 'Dziś w oknie',
      body: 'Żytni na zakwasie, pszenny, bułki. Do 14:00.',
      foot: 'ul. Piecowa 7',
    },
    {
      id: 'post-2',
      headline: 'Mąka, woda, sól.',
      body: 'I trzydzieści sześć godzin.',
      foot: 'Skibka, Kraków',
    },
    {
      id: 'post-3',
      headline: 'Piekarnia czynna',
      body: 'wt do pt 7:00 do 17:00, sobota 7:00 do 14:00',
      foot: 'Niedziela i poniedziałek: odpoczywamy',
    },
  ],
} as const;
