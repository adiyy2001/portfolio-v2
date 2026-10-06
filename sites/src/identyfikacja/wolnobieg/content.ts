import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Piotr Zawada',
  role: 'mechanik, współwłaściciel',
  street: 'ul. Szprychowa 14',
  city: '80-200 Gdańsk',
  phone: '+48 58 000 00 06',
  phoneHref: 'tel:+48580000006',
  email: 'serwis@wolnobieg.example',
  hours: [
    ['pn do pt', '9:00 do 18:00'],
    ['sobota', '10:00 do 15:00'],
    ['niedziela', 'zamknięte'],
  ],
} as const;

export const content: CaseContent = {
  lead: 'Przestajesz pedałować i jedziesz dalej. Tak ma wyglądać serwis rowerowy.',
  client: {
    paragraphs: [
      'Wolnobieg to serwis i sklep rowerowy we Wrzeszczu, w Gdańsku. Trzech mechaników naprawia rowery miejskie na miejscu, zwykle tego samego dnia, a w małym sklepie obok sprzedaje używane i nowe rowery do jazdy po mieście.',
      'Do tej pory warsztat miał tablicę namalowaną sprayem, cennik pisany flamastrem i kilka naklejek od hurtowni części. Klienci pamiętali mechaników z imienia, ale nie nazwę firmy.',
      'Zadanie: znak i system, które pasują do drzwi warsztatu, do przywieszki na kierownicy i do profilu w mediach. Mają wyglądać jak ciepłe miejsce z historią, a nie jak sieciówka.',
    ],
    facts: [
      ['Branża', 'serwis i sklep rowerowy'],
      ['Miejsce', 'Gdańsk, Wrzeszcz'],
      ['Zakres', 'strategia, logo, system, makiety, animacja, brand book'],
      ['Odbiorcy', 'ludzie, którzy jeżdżą rowerem do pracy i na weekend, od studentów po rodziny'],
    ],
  },
  direction: {
    title: 'Lata siedemdziesiąte, bo wtedy rower był przyjemnością',
    paragraphs: [
      'W latach siedemdziesiątych rower miejski stał się zwykłą rzeczą: do sklepu, do pracy, do babci. Paleta z tamtych lat jest ciepła i nasycona: przypalona pomarańcza, musztarda, brąz i awokado na kremowym papierze. Nic w niej nie jest zimne ani sportowe.',
      'Styl niosą trzy elementy. Równoległe pasy prowadzone łukami przypominają ślad opony i ruch koła. Okrągła odznaka z koncentrycznych pasów jest znakiem i jednocześnie zębatką wolnobiegu. Gruby, zaokrąglony krój nagłówkowy daje napisowi ciężar dawnego szyldu.',
      'Odbiorca jeździ do pracy i na wycieczki, a rower traktuje jak towarzysza, nie sprzęt. Ciepłe kolory i obłe kształty mówią mu, że w warsztacie nikt nie postraszy go rachunkiem.',
    ],
    keywords: ['wolno', 'pasy', 'korba'],
  },
  strategy: {
    audience:
      'Gdańszczanie, którzy jeżdżą rowerem do pracy i na weekend, od studentów po rodziny z dziećmi, oraz kupujący używane i miejskie rowery.',
    values: [
      {
        title: 'Naprawiamy, nie wymieniamy',
        text: 'Zanim zaproponujemy nową część, sprawdzamy, czy starą da się uratować.',
      },
      {
        title: 'Jedź wolno',
        text: 'Rower ma dawać przyjemność, nie wynik. Nikt tu nie mierzy czasu.',
      },
      {
        title: 'Po sąsiedzku',
        text: 'Warsztat stoi w bramie, mechanik zna rowery z całej ulicy i pamięta, co kiedyś w nich naprawiał.',
      },
    ],
    personality: ['ciepła', 'wesoła', 'solidna'],
    avoids: 'zimnych błękitów, minimalizmu, fotorealizmu i sportowej agresji',
    positioning:
      'Wolnobieg to serwis i sklep rowerowy w Gdańsku, w którym naprawiamy rowery miejskie na miejscu, a sprzedajemy te, które sami chcielibyśmy jeździć.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech szkiców, narysowanych szybko i surowo. Każdy odpowiada na inne pytanie: czy znakiem mają być pasy, odznaka z napisem, czy litera.',
    rejected: [
      {
        id: 'odznaka',
        title: 'Odznaka z napisem po obwodzie',
        text: 'Okrągła odznaka z napisem WOLNOBIEG · SERWIS · GDAŃSK biegnącym po obwodzie.',
        reason:
          'Odpadła, bo napis po obwodzie przy 24 pikselach zamienia się w kropki i powtarza to, co stoi obok w logo. Z odznaki zostało koło, ale bez liter.',
        thumb: 'figures/direction-odznaka.svg',
      },
      {
        id: 'wstega',
        title: 'Wstęga zwinięta z pasów',
        text: 'Litera W zbudowana wyłącznie z trzech zawiniętych pasów.',
        reason:
          'Odpadła, bo litera z pasów jest czytelna dopiero od 120 pikseli, a nazwa potrzebuje całego słowa. Pasy zostały jako osobny element systemu.',
        thumb: 'figures/direction-wstega.svg',
      },
    ],
    chosen: {
      title: 'Pasy i koło',
      reason:
        'Dwa elementy robią dwie różne rzeczy. Okrągła odznaka z pasów jest sygnetem, ikoną i naklejką na ramie. Trzy pasy prowadzone łukiem pod napisem niosą ruch. Razem czytają się jak koło wolnobiegu w jeździe, a osobno każdy działa na swoim poziomie.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Pary Wo i eg zostały ściągnięte, a ol, ln i bi odrobinę rozsunięte, żeby gruby krój tworzył równy rytm w całym słowie.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Napis stoi na zboczu minus cztery stopnie, a pasy pod nim prowadzą ten sam łuk. Pasy zaczynają się pod literą W i kończą za literą g, żeby ogonek g miał oddech.',
      },
      {
        title: 'Test czytelności',
        text: 'Pełna odznaka z otworami w piaście działa od 48 pikseli. Poniżej zastępuje ją uproszczony sygnet z dwoma pierścieniami, który w 16 pikselach nadal czyta się jak koło.',
      },
    ],
  },
  tone: [
    {
      title: 'Mówimy, co naprawimy',
      text: 'Piszemy, co jest zepsute i ile to potrwa, bez straszenia.',
      yes: 'Dętka do wymiany, 25 minut. Zostaw rower i wróć po kawie.',
      no: 'Konieczna profesjonalna diagnostyka układu jezdnego.',
    },
    {
      title: 'Jedź wolno',
      text: 'Nikogo nie ścigamy. Zachęcamy do spokojnej jazdy, bez wyniku i bez ambicji.',
      yes: 'Wolno też dojedziesz. Rower będzie gotowy o szóstej.',
      no: 'Przyspiesz z nami i pobij swój rekord!',
    },
    {
      title: 'Po sąsiedzku',
      text: 'Mówimy tak, jak mechanik przez ladę.',
      yes: 'Hamulec do regulacji. Wpadnij w piątek, zrobię od ręki.',
      no: 'Zapraszamy do skorzystania z naszej oferty serwisowej.',
    },
    {
      title: 'Prosto o cenie',
      text: 'Cenę podajemy przed naprawą i niczego nie dopisujemy po fakcie.',
      yes: 'Wymiana dętki: 30 zł z robocizną.',
      no: 'Cena do ustalenia po diagnozie.',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Pomarańczowe tło, odznaka i pasy. Druk 85 na 55 mm, spad 3 mm.',
      image: 'mockups/wolnobieg-card-front.jpg',
      alt: 'Awers wizytówki Wolnobiegu: odznaka z zębatką i trzy pasy na pomarańczowym tle.',
    },
    {
      title: 'Wizytówka, rewers',
      id: 'karta-rewers',
      caption: 'Dane kontaktowe na kremowym papierze i pasy w dolnym rogu.',
      image: 'mockups/wolnobieg-card-back.jpg',
      alt: 'Rewers wizytówki Wolnobiegu z nazwiskiem mechanika, adresem i telefonem.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Łuk z pasów w rogu, adres w stopce i szeroki margines na list.',
      image: 'mockups/wolnobieg-letterhead.jpg',
      alt: 'Papier firmowy Wolnobiegu w formacie A4 z krótkim listem.',
    },
    {
      id: 'szyld',
      title: 'Szyld i przywieszka serwisowa',
      caption:
        'Zastosowanie dla serwisu: szyld nad drzwiami warsztatu i przywieszka serwisowa na kierownicę.',
      image: 'mockups/wolnobieg-application.jpg',
      alt: 'Szyld nad drzwiami warsztatu rowerowego Wolnobieg i przywieszka serwisowa z numerem zlecenia.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML bez obrazków w tle, poziome logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/wolnobieg-email-signature.jpg',
      alt: 'Podpis e-mail Wolnobiegu z poziomym logo, telefonem i adresem.',
    },
  ],
  deliverables: {
    intro:
      'Wszystko, co dostaje serwis, leży w jednej paczce ZIP i osobno na liście poniżej. Rozwiń grupę, żeby zobaczyć pliki z wymiarami.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twoja firma też może toczyć się własnym tempem',
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
    { name: 'Podtytuł', font: 'text', weight: 800, size: 22, line: 1.25, use: 'wstępy i lead' },
    { name: 'Tekst', font: 'text', weight: 400, size: 18, line: 1.5, use: 'akapity, opisy, cenniki' },
    {
      name: 'Podpis',
      font: 'text',
      weight: 600,
      size: 14,
      line: 1.4,
      use: 'podpisy, etykiety, adresy',
    },
  ],
  specimen: 'Naprawiamy, nie wymieniamy. Jedź wolno, dojedziesz.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 „”·×',
  graphics: [
    {
      title: 'Pasy w łukach',
      text: 'Trzy pasy w pomarańczy, musztardzie i brązie biegną równolegle po łuku. Wzór w tle składa się z ćwiartek okręgów i nigdy nie robi ostrych zakrętów.',
    },
    {
      title: 'Lekkie zużycie',
      text: 'Drobny wzór wytarcia z szumu, nałożony na kolorowe pola. Tylko na ekranie, nigdy w plikach logo i w plikach do druku.',
    },
    {
      title: 'Odznaki i naklejki',
      text: 'Okrągłe odznaki z jednym słowem i pierścieniem pasów. Powtarzają znak, nie dodają nowych symboli.',
    },
  ],
  layoutRules: [
    'Rogi zawsze zaokrąglone, promień od 20 do 40 pikseli, nigdy ostre.',
    'Pas sekcji idzie łukiem, nie linijką. Tekst nigdy nie leży na łuku.',
    'Jeden akapit na jedną kartę, kolor tła z palety, ciemny tekst na jasnym lub jasny na ciemnym.',
    'Pasy mają trzy kolory na raz, nigdy więcej, a ich kolejność zawsze zaczyna się od pomarańczy.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: ciepłe popołudniowe światło, lekko ziarniste ujęcia z poziomu kierownicy. Rowery stoją pod ścianą warsztatu, na stojaku do naprawy albo na ulicy z kocimi łbami, a dłonie mechanika są widoczne w kadrze. Kolory zbliżamy do palety: kremowe ściany, brązowy metal, pomarańczowe akcenty. Bez chłodnych filtrów, bez sportowych póz i bez przesadnej ostrości.',
  animation:
    'Odznaka toczy się z lewej strony i zatrzymuje na środku, a trzy pasy suną za nią łukiem. Potem wjeżdża napis. Całość trwa trzy sekundy. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe wysokości litery W z napisu Wolnobieg. Żaden tekst ani brzeg strony nie wchodzi w ten obszar.',
  minimum: {
    symbol: '16 px na ekranie, 6 mm w druku (uproszczony sygnet)',
    fullBadge: '48 px na ekranie, 14 mm w druku',
    primary: '140 px szerokości, 30 mm w druku',
  },
  social: [
    {
      id: 'post-1',
      headline: 'Dętka w 25 minut.',
      body: 'Zostaw rower rano, odbierz po pracy.',
      foot: 'ul. Szprychowa 14',
    },
    {
      id: 'post-2',
      headline: 'Naprawiamy, nie wymieniamy.',
      body: 'Zanim kupisz nowe, pokaż stare.',
      foot: 'Wolnobieg, Gdańsk',
    },
    {
      id: 'post-3',
      headline: 'Warsztat czynny',
      body: 'pn do pt 9:00 do 18:00, sobota 10:00 do 15:00',
      foot: 'Niedziela: jeździmy sami',
    },
  ],
  tag: {
    title: 'Przywieszka serwisowa',
    number: 'Zlecenie nr 0417',
    rows: [
      ['Rower', 'miejski, damka, zielony'],
      ['Do zrobienia', 'dętka tył, regulacja hamulców'],
      ['Gotowe', 'czwartek do 17:00'],
      ['Cena', '60 zł z robocizną'],
    ],
  },
  services: [
    ['Wymiana dętki', '30 zł'],
    ['Regulacja hamulców i przerzutek', '40 zł'],
    ['Przegląd podstawowy', '90 zł'],
  ],
} as const;
