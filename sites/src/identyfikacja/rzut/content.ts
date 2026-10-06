import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Tomasz Biernat',
  role: 'architekt, współzałożyciel',
  street: 'ul. Pracowniana 4',
  city: '50-001 Wrocław',
  phone: '+48 71 000 00 03',
  phoneHref: 'tel:+48710000003',
  email: 'pracownia@rzut.example',
  hours: [
    ['pn do pt', '8:00 do 16:00'],
    ['dni otwarte', 'ostatni piątek miesiąca, 16:00 do 19:00'],
  ],
} as const;

export const content: CaseContent = {
  lead: 'Znak narysowany jak rzut: kwadrat, wejście i siatka, na której leży cała reszta.',
  client: {
    paragraphs: [
      'Rzut to pięcioosobowa pracownia architektoniczna z Wrocławia. Projektuje domy jednorodzinne, małe biura i budynki użyteczności publicznej na Dolnym Śląsku. Zleceniodawcy to prywatni inwestorzy, deweloperzy i gminy, które ogłaszają konkursy.',
      'Do tej pory pracownia podpisywała rysunki logo ze zwykłym Arialem, a oferty wysyłała jako PDF z Worda. Na tablicy budowy nazwa pracowni ginęła między danymi inwestora i kierownika.',
      'Zadanie: identyfikacja, którą da się położyć na rysunku technicznym, tablicy budowy i ofercie dla gminy, i która sama wygląda jak dobrze narysowany projekt.',
    ],
    facts: [
      ['Branża', 'pracownia architektoniczna'],
      ['Miejsce', 'Wrocław, Dolny Śląsk'],
      ['Zakres', 'strategia, logo, system, makiety, animacja, brand book'],
      ['Odbiorcy', 'inwestorzy prywatni, deweloperzy, gminy i komisje konkursowe'],
    ],
  },
  direction: {
    title: 'Siatka zamiast ozdoby',
    paragraphs: [
      'Architekt tłumaczy decyzje rysunkiem, więc identyfikacja ma być rysunkiem. Wybraliśmy szwajcarski modernizm: jedną rodzinę kroju, czerń i biel, jeden kolor sygnałowy i widoczną siatkę modułową. Nic nie jest dodane dla ozdoby. Każdy element ma wymiar i miejsce.',
      'Inwestor, urzędnik i komisja konkursowa czytają tak samo: szybko i po kolei. Tekst do lewej z poszarpaną prawą krawędzią, numery w marginesie i krótkie zdania pozwalają znaleźć dane bez szukania. Kobalt zamiast klasycznej czerwieni odróżnia pracownię od większości szwajcarskich plakatów i kojarzy się z niebieską kopią rysunku.',
    ],
    keywords: ['siatka', 'moduł', 'rzut'],
  },
  strategy: {
    audience:
      'Prywatni inwestorzy, deweloperzy i gminy z Dolnego Śląska, które zamawiają domy, biura i budynki publiczne i chcą wiedzieć, dlaczego projekt wygląda tak, a nie inaczej.',
    values: [
      { title: 'Porządek', text: 'Każdy rysunek leży na siatce i ma ten sam układ tabliczki.' },
      { title: 'Dokładność', text: 'Wymiary podajemy w milimetrach, terminy w tygodniach.' },
      { title: 'Czytelność', text: 'Rysunek tłumaczy się sam, bez ustnego komentarza.' },
    ],
    personality: ['rzeczowa', 'spokojna', 'dokładna'],
    avoids: 'ornamentu, zaokrągleń, gradientów, ilustracji i wszystkiego, co jest tylko ozdobą',
    positioning:
      'Rzut to pracownia architektoniczna z Wrocławia, która projektuje domy i budynki publiczne na siatce, w której każdy wymiar ma uzasadnienie.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech szkiców, narysowanych na tej samej siatce. Każdy odpowiada na inne pytanie: czy znak ma liczyć projekty, wskazywać oś, czy pokazywać plan.',
    rejected: [
      {
        id: 'indeks',
        title: 'Indeks',
        text: 'Napis Rzut z pogrubioną cyfrą numeru projektu: Rzut 01, Rzut 02.',
        reason:
          'Odpadł, bo znak zmieniałby się z każdym projektem, a pracownia potrzebuje jednego stałego znaku na tablicy, w stopce i w karcie przeglądarki. Cyfra nie daje też sygnetu.',
        thumb: 'figures/direction-indeks.svg',
      },
      {
        id: 'os',
        title: 'Oś',
        text: 'Cienka pionowa linia przez literę z, zakończona niebieskim punktem.',
        reason:
          'Odpadła, bo przy 24 pikselach linia znika, a przecięta litera wygląda jak skreślona. Znak psuł czytelność nazwy zamiast ją porządkować.',
        thumb: 'figures/direction-os.svg',
      },
    ],
    chosen: {
      title: 'Moduł',
      reason:
        'Kobaltowy kwadrat z wejściem to rzut pomieszczenia w najprostszej postaci. Działa jako sygnet w karcie przeglądarki, jako pole na rysunku i jako moduł, z którego wynikają marginesy, wysokość nazwy i pole ochronne.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Para zu została rozsunięta, ut ściągnięta o ułamek, a Rz zostawiona prawie bez zmian, żeby kolor tekstu w słowie Rzut był równy.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Wysokość kwadratu jest równa wysokości wersalika R, dolna krawędź kwadratu leży na linii pisma, a odstęp między znakiem a nazwą to dwa moduły.',
      },
      {
        title: 'Test czytelności',
        text: 'Sygnet działa od 16 pikseli. Wersja pozioma jest czytelna od 96 pikseli, a pełna z podpisem od 280. Poniżej tych rozmiarów zostaje sam kwadrat.',
      },
    ],
  },
  tone: [
    {
      title: 'Liczby zamiast przymiotników',
      text: 'Opisujemy budynek wymiarami i faktami.',
      yes: 'Dom 168 mkw., dwie kondygnacje, siatka 1,2 m.',
      no: 'Przestronny, nowoczesny dom z duszą.',
    },
    {
      title: 'Każdy wymiar ma uzasadnienie',
      text: 'Przy decyzji piszemy, skąd się wzięła.',
      yes: 'Okna co 1,2 m, bo tyle wynosi moduł konstrukcji.',
      no: 'Okna dobrane tak, żeby było ładnie.',
    },
    {
      title: 'Krótkie zdania, strona czynna',
      text: 'Podmiotem jest pracownia albo rysunek, nie zachwyt.',
      yes: 'Rysujemy na siatce. Pokazujemy, dlaczego.',
      no: 'Nasz zespół z pasją dba o to, aby każdy projekt był wyjątkowy.',
    },
    {
      title: 'Terminy w tygodniach',
      text: 'Obiecujemy konkretne etapy zamiast tempa.',
      yes: 'Koncepcja po trzech tygodniach, projekt budowlany po dziewięciu.',
      no: 'Realizujemy projekty szybko i terminowo.',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Kwadrat na kobalcie, nazwa na siatce. Druk 85 na 55 mm, spad 3 mm.',
      image: 'mockups/rzut-card-front.jpg',
      alt: 'Awers wizytówki Rzut: biały kwadrat z wejściem na kobaltowym polu i napis Rzut.',
    },
    {
      id: 'karta-rewers',
      title: 'Wizytówka, rewers',
      caption: 'Dane w czterech kolumnach, tekst do lewej.',
      image: 'mockups/rzut-card-back.jpg',
      alt: 'Rewers wizytówki Rzut z nazwiskiem, funkcją, adresem i telefonem w układzie siatki.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Logo w pierwszym module, adres w marginesie, list w kolumnach 4 do 9.',
      image: 'mockups/rzut-letterhead.jpg',
      alt: 'Papier firmowy Rzut w formacie A4 z logo, adresem w marginesie i krótkim listem.',
    },
    {
      id: 'tablica',
      title: 'Tablica informacyjna na budowie',
      caption:
        'Zastosowanie dla pracowni: tablica z nazwą inwestycji, numerem projektu, danymi inwestora, kierownika i decyzji.',
      image: 'mockups/rzut-application.jpg',
      alt: 'Tablica informacyjna budowy na dwóch słupkach, z numerem projektu 07, danymi inwestora, kierownika budowy i znakiem Rzut.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML w tabelach, logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/rzut-email-signature.jpg',
      alt: 'Podpis e-mail Rzut z poziomym logo, funkcją, telefonem i adresem.',
    },
  ],
  deliverables: {
    intro:
      'Wszystko, co dostaje pracownia, leży w jednej paczce ZIP i osobno na liście poniżej. Rozwiń grupę, żeby zobaczyć pliki z wymiarami.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twoja firma też może leżeć na siatce',
    text: 'Opowiedz mi, czym się zajmujesz i do kogo mówisz. Zaproponuję kierunek, pokażę trzy szkice logo i dowiozę komplet plików na każdą okazję.',
  },
};

export const extras = {
  typeScale: [
    { name: 'Numer', font: 'condensed', weight: 700, size: 96, line: 0.9, use: 'numery projektów i sekcji' },
    { name: 'Tytuł', font: 'text', weight: 700, size: 56, line: 1.02, use: 'okładki i hasła' },
    { name: 'Nagłówek', font: 'text', weight: 700, size: 32, line: 1.1, use: 'sekcje i tabliczki' },
    { name: 'Podtytuł', font: 'text', weight: 500, size: 20, line: 1.3, use: 'wstępy i lead' },
    { name: 'Tekst', font: 'text', weight: 400, size: 17, line: 1.5, use: 'akapity i opisy' },
    { name: 'Podpis', font: 'condensed', weight: 700, size: 13, line: 1.3, use: 'etykiety, wersaliki z rozstrzelaniem 0,07 em' },
  ],
  specimen: 'Dom przy parku. Okna co 1,2 m, schody w osi, wejście od północy.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 „”·×°',
  grid: {
    columns: 12,
    gutter: '16 px na ekranie, 4 mm w druku',
    margin: '48 px na ekranie, 15 mm w druku',
    baseline: '8 px',
    module: 'bok kwadratu znaku równy M, pole ochronne M/2',
  },
  graphics: [
    {
      title: 'Siatka modułowa',
      text: 'Dwanaście kolumn, widoczna jako cienkie linie w kolorze szarym. Na stronach prezentacyjnych linie zostają na wierzchu, na dokumentach znikają.',
    },
    {
      title: 'Linia wymiarowa',
      text: 'Cienka linia z kreskami na końcach i podpisem w milimetrach. Pokazuje, skąd bierze się odstęp. Jedyny element graficzny poza kwadratem.',
    },
    {
      title: 'Indeks w marginesie',
      text: 'Numer sekcji, rysunku albo projektu wisi w lewym marginesie, w wąskim kroju. Numerujemy wszystko, co ma kolejność.',
    },
  ],
  layoutRules: [
    'Dwanaście kolumn. Każdy element zaczyna się na linii kolumny.',
    'Tekst do lewej, prawa krawędź poszarpana. Nie wyrównujemy do prawej ani do środka.',
    'Kolumny tekstu mają nierówne szerokości: wąska na 3, szeroka na 6 kolumn.',
    'Numery wiszą w marginesie, nie w tekście.',
    'Kobalt występuje raz na rozkładówkę. Zaokrągleń, cieni i gradientów nie używamy.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: budynek frontalnie lub w ścisłym narożniku, pionowe linie pionowo, bez perspektywy żabiej. Światło rozproszone, najlepiej pochmurne popołudnie. Bez ludzi, bez pozowanych wnętrz, bez filtrów. Kolory neutralne, szarość betonu i cegły bez podbijania. Kadr przycinamy do modułu siatki: całość, połowa albo ćwierć.',
  animation:
    'Siatka rysuje się w sekundę. Potem kwadrat wskakuje na swój moduł, a nazwa i podpis wyrównują się jedno po drugim. Każdy ruch kończy się na linii siatki, bez odbić i rozmycia. Całość trwa trzy sekundy. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe połowie boku kwadratu, M/2, ze wszystkich stron. Żaden tekst ani brzeg strony nie wchodzi w ten obszar.',
  minimum: {
    symbol: '16 px na ekranie, 5 mm w druku',
    horizontal: '96 px szerokości, 24 mm w druku',
    primary: '280 px szerokości, 70 mm w druku',
    vertical: '200 px szerokości, 50 mm w druku',
  },
  board: {
    number: '07',
    title: 'Budowa budynku mieszkalnego jednorodzinnego z garażem',
    rows: [
      ['Adres', 'ul. Jesionowa 18, 50-501 Wrocław, działka 24/3'],
      ['Inwestor', 'Anna i Piotr Wojda'],
      ['Projektant', 'Rzut, mgr inż. arch. Tomasz Biernat'],
      ['Kierownik budowy', 'mgr inż. Karolina Sowa'],
      ['Pozwolenie na budowę', 'decyzja nr 412/2026 z 14.04.2026'],
      ['Termin', '09.2026 do 11.2027'],
    ],
  },
  social: [
    {
      id: 'post-1',
      headline: 'Dom przy parku',
      body: 'Rzut 07 wchodzi w projekt budowlany.',
      foot: 'Pracownia Rzut, Wrocław',
    },
    {
      id: 'post-2',
      headline: 'Siatka 1,2 m',
      body: 'Okna, ściany i schody leżą na jednym module.',
      foot: 'Dlatego dom można policzyć, zanim powstanie',
    },
    {
      id: 'post-3',
      headline: 'Dni otwarte',
      body: 'Ostatni piątek miesiąca, 16:00 do 19:00.',
      foot: 'ul. Pracowniana 4, Wrocław',
    },
  ],
} as const;
