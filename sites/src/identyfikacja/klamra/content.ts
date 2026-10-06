import type { CaseContent } from '../shared/types';

export const contact = {
  person: 'Marta Wrona',
  role: 'mentorka, współzałożycielka',
  office: 'ul. Zecerska 3, 50-001 Wrocław',
  site: 'klamra.example',
  phone: '+48 71 000 00 14',
  phoneHref: 'tel:+48710000014',
  email: 'kontakt@klamra.example',
  student: 'Julia Nowicka',
  mentor: 'Marta Wrona',
} as const;

export const content: CaseContent = {
  lead: 'Szkoła, która od pierwszego dnia pokazuje, że kod się pisze, a nie ogląda.',
  client: {
    paragraphs: [
      'Klamra to nowa szkoła programowania online. Uczy dorosłych, którzy chcą zmienić pracę, oraz maturzystów, którzy wolą mentora niż pięć lat studiów. Grupy mają do ośmiu osób, zajęcia odbywają się dwa wieczory w tygodniu, a kurs trwa cztery miesiące.',
      'Wszyscy konkurenci wyglądają tak samo: granatowe tło, fioletowy gradient, uśmiechnięty człowiek z laptopem. Klamra nie ma budżetu na reklamę, więc musi być rozpoznawalna w jednym kadrze, na naklejce przyklejonej do laptopa kursanta.',
      'Zadanie: identyfikacja, która jest głośna, uczciwa i łatwa do powielenia bez projektanta, w którą można zapakować cały kurs: stronę, certyfikat, posty i naklejki.',
    ],
    facts: [
      ['Branża', 'szkoła programowania online'],
      ['Zasięg', 'cała Polska, zajęcia na żywo przez internet'],
      ['Zakres', 'strategia, logo, system, makiety, animacja, brand book'],
      ['Odbiorcy', 'dorośli zmieniający zawód i maturzyści, 18 do 45 lat'],
    ],
  },
  direction: {
    title: 'Surowo, głośno i bez wstydu',
    paragraphs: [
      'Kod jest surowy: nawiasy, średniki, błąd w linii dwudziestej trzeciej. Neobrutalizm robi z tej surowości styl. Grube czarne obrysy pokazują konstrukcję, twarde cienie bez rozmycia dają wrażenie przedmiotu, a cztery płaskie kolory krzyczą tam, gdzie konkurencja szepcze.',
      'Dla odbiorcy, który boi się, że programowanie jest dla innych, to jest zaproszenie: tu nikt niczego nie udaje. Klamra to nawias, który otwiera blok kodu, i zapięcie, które trzyma grupę razem. Znak jest naklejką, a naklejkę się przykleja, nie ogląda w gablocie.',
    ],
    keywords: ['klamra', 'commit', 'surowo'],
  },
  strategy: {
    audience:
      'Dorośli, którzy chcą przejść do pracy w kodzie, i maturzyści, którzy wolą pracować z mentorem niż studiować. Czytają w telefonie, porównują trzy szkoły naraz i nie ufają obietnicom.',
    values: [
      { title: 'Robisz, nie oglądasz', text: 'Pierwszą linijkę kodu piszesz w pierwszy wieczór, a w trzecim tygodniu publikujesz swoją stronę.' },
      { title: 'Małe grupy', text: 'Do ośmiu osób na jednego mentora. Mentor zna twój kod i twoje błędy po imieniu.' },
      { title: 'Uczciwa cena', text: 'Jedna cena podana z góry, bez ukrytych modułów i bez raty, której nie widać na stronie.' },
    ],
    personality: ['bezpośrednia', 'żywa', 'trochę szalona'],
    avoids: 'luksusu, pastelowej miękkości, miękkich cieni i startupowego połysku',
    positioning:
      'Klamra to szkoła programowania online, w której w małej grupie, w cztery miesiące i na prawdziwym projekcie przechodzisz od zera do pierwszej pracy w kodzie.',
  },
  process: {
    intro:
      'Zaczęliśmy od trzech szkiców, narysowanych szybko i surowo. Każdy odpowiada na inne pytanie: czy znak ma być nawiasem, literą, czy ekranem terminala.',
    rejected: [
      {
        id: 'k-z-klamer',
        title: 'K zbudowane z klamer',
        text: 'Pionowa kreska i dwa ramiona w kształcie połówek klamry składają się w literę K.',
        reason:
          'Odpadło, bo ramiona klamer przy 24 pikselach zlewają się w zwykłe K, a właśnie klamra miała być rozpoznawalna. Znak czyta się jako litera, nie jako kod.',
        thumb: 'figures/direction-k.svg',
      },
      {
        id: 'terminal',
        title: 'Terminal z kursorem',
        text: 'Napis Klamra, za nim migający blok kursora, całość w ramce okna terminala.',
        reason:
          'Odpadł, bo bez klamer przypomina każdą szkołę z konsolą w tle, a w roli ikony strony jest za szeroki. Kursor został, ale przeniósł się do środka klamer.',
        thumb: 'figures/direction-terminal.svg',
      },
    ],
    chosen: {
      title: 'Klamry i kursor',
      reason:
        'Dwie grube klamry z różowym blokiem kursora w środku mówią dwie rzeczy naraz: to jest kod i tu coś się zaraz zacznie. Żółta ramka z twardym cieniem robi z nich naklejkę, którą da się przykleić na laptopie, wydrukować na koszulce i zmniejszyć do ikony strony.',
    },
    refinement: [
      {
        title: 'Ręczny kerning',
        text: 'Pary Kl i ra zostały ściągnięte, am i mr odrobinę rozsunięte, żeby w grubym kroju Epilogue 900 kolor tekstu w słowie Klamra był równy.',
      },
      {
        title: 'Wyrównania optyczne',
        text: 'Kursor jest niższy od wersalika K o jedną piątą, a spiczaste czubki klamer wchodzą w pole ochronne o połowę grubości kreski. Napis stoi na środku optycznym ramki, nie na geometrycznym.',
      },
      {
        title: 'Test czytelności',
        text: 'Pełny znak z ramką i cieniem działa od 24 pikseli. Do 16 pikseli ikona strony dostaje grubsze klamry i mniejszy kursor, a ramka i cień zostają.',
      },
    ],
  },
  tone: [
    {
      title: 'Mówimy wprost',
      text: 'Co się stanie, kiedy, ile to kosztuje. Bez przymiotników, które niczego nie znaczą.',
      yes: 'Po czterech miesiącach masz napisaną własną aplikację.',
      no: 'Rewolucyjna transformacja twojej kariery w świecie technologii.',
    },
    {
      title: 'Żargon tłumaczymy, nie chowamy',
      text: 'Używamy prawdziwych nazw, ale przy pierwszym użyciu mówimy, co znaczą.',
      yes: 'Commit to zapisany krok w historii projektu. Robisz ich dziesiątki.',
      no: 'Wykorzystaj synergię nowoczesnych technologii.',
    },
    {
      title: 'Pokazujemy robotę, nie obietnice',
      text: 'Zamiast gwarancji opisujemy, co kursant zrobi w danym tygodniu.',
      yes: 'W trzecim tygodniu publikujesz pierwszą stronę.',
      no: 'Gwarantujemy pracę marzeń.',
    },
    {
      title: 'Krótko, na ty, bez krzyku',
      text: 'Mówimy głośno wizualnie, ale zdania są spokojne. Jedna myśl, jeden wykrzyknik na całą stronę, najlepiej żaden.',
      yes: 'Zacznij od pierwszej linijki.',
      no: 'Dołącz do nas już dziś i zmień swoje życie!!!',
    },
  ],
  applications: [
    {
      id: 'karta-awers',
      title: 'Wizytówka, awers',
      caption: 'Cytrynowe pole i znak z twardym cieniem. Druk 85 na 55 mm, spad 3 mm.',
      image: 'mockups/klamra-card-front.jpg',
      alt: 'Awers wizytówki Klamry: żółte pole z czarnym znakiem w ramce z twardym cieniem.',
    },
    {
      id: 'karta-rewers',
      title: 'Wizytówka, rewers',
      caption: 'Dane kontaktowe w kroju mono, pasek ze wzorem u dołu.',
      image: 'mockups/klamra-card-back.jpg',
      alt: 'Rewers wizytówki Klamry z nazwiskiem mentorki, adresem strony i telefonem.',
    },
    {
      id: 'papier',
      title: 'Papier firmowy A4',
      caption: 'Szeroki żółty pasek, znak w ramce i list w kroju Epilogue.',
      image: 'mockups/klamra-letterhead.jpg',
      alt: 'Papier firmowy Klamry w formacie A4 z krótkim listem do kursanta.',
    },
    {
      id: 'naklejki',
      title: 'Arkusz naklejek i certyfikat',
      caption:
        'Zastosowanie dla szkoły: naklejki na laptopy kursantów i certyfikat ukończenia kursu w formacie A4.',
      image: 'mockups/klamra-application.jpg',
      alt: 'Arkusz kolorowych naklejek z hasłami programistów obok certyfikatu ukończenia kursu Klamra.',
    },
    {
      id: 'podpis',
      title: 'Podpis e-mail',
      caption: 'HTML z tabel, logo z hostingu, tekst w czcionkach systemowych.',
      image: 'mockups/klamra-email-signature.jpg',
      alt: 'Podpis e-mail Klamry z poziomym logo, telefonem i adresem strony.',
    },
  ],
  deliverables: {
    intro:
      'Wszystko, co dostaje szkoła, leży w jednej paczce ZIP i osobno na liście poniżej. Rozwiń grupę, żeby zobaczyć pliki z wymiarami.',
    note: 'CMYK w tabeli kolorów jest przybliżony. Do druku zamów próbny wydruk. Odpowiedników Pantone nie podajemy.',
  },
  cta: {
    title: 'Twoja marka też może być głośna',
    text: 'Opowiedz mi, kogo uczysz i co ma być widać z drugiego końca sali. Zaproponuję kierunek, pokażę trzy szkice logo i dowiozę komplet plików na każdą okazję.',
  },
};

export const extras = {
  typeScale: [
    { name: 'Tytuł', font: 'display', size: 64, line: 1, weight: 900, use: 'okładki, hasła, nagłówek strony' },
    { name: 'Nagłówek', font: 'display', size: 36, line: 1.1, weight: 800, use: 'sekcje i karty' },
    { name: 'Podtytuł', font: 'text', size: 20, line: 1.35, weight: 700, use: 'wstępy i lead' },
    { name: 'Tekst', font: 'text', size: 17, line: 1.55, weight: 500, use: 'akapity, opisy' },
    { name: 'Etykieta', font: 'mono', size: 13, line: 1.3, weight: 700, use: 'naklejki, numery, kod' },
  ],
  specimen: 'Pierwszą linijkę kodu piszesz pierwszego wieczoru.',
  glyphs: 'ĄĆĘŁŃÓŚŹŻ ąćęłńóśźż 0123456789 {}[]()<>;',
  graphics: [
    {
      title: 'Wzór z klocków',
      text: 'Cztery płaskie kształty w czterech kolorach, każdy z grubym obrysem i twardym cieniem, ułożone na siatce. Wzór nie ma przejść ani gradientów.',
    },
    {
      title: 'Twardy cień',
      text: 'Przesunięty o stałą wartość w prawo i w dół, w kolorze atramentu, bez rozmycia. Cień jest zawsze pełny i zawsze w tym samym kierunku.',
    },
    {
      title: 'Naklejki i etykiety',
      text: 'Etykiety w kroju mono, wersalikami, na płaskim kolorze z obrysem. Naklejki wolno przechylić o kilka stopni, treści strony nigdy.',
    },
  ],
  layoutRules: [
    'Jedna siatka prostokątnych bloków. Każdy blok ma obrys, każdy większy blok ma cień.',
    'Cztery kolory na wypełnienia, atrament na tekst i obrysy. Tekst biały tylko na atramencie.',
    'Obrys ma grubość 3 do 5 pikseli na ekranie, cień przesunięcie 6 do 10 pikseli.',
    'Naklejki nie zakrywają tekstu. Wokół przycisku zostaje miejsce na jego cień.',
  ],
  photoStyle:
    'Zdjęć w tym projekcie nie generujemy. Opis stylu dla fotografa: jednolite, płaskie tło w jednym z czterech kolorów marki, światło z lampy błyskowej prosto z przodu, twardy cień za obiektem. Laptop, ręce na klawiaturze, naklejki w kadrze z bliska. Ludzie patrzą w ekran albo w obiektyw, nigdy w niebo. Kolory nasycone, bez filtrów i bez rozmycia tła. Kadr ciasny, od pasa w górę, ekran czytelny.',
  animation:
    'Ramka znaku spada na kartę, klamry wjeżdżają z dwóch stron i uderzają o siebie, a cień wyskakuje spod spodu. Potem pisze się słowo Klamra, litera po literze, a kursor mruga dwa razy. Całość trwa trzy sekundy. Przy ustawieniu ograniczenia ruchu strona pokazuje nieruchome logo.',
  clearSpace:
    'Pole ochronne jest równe szerokości kursora w znaku. Żaden tekst ani brzeg strony nie wchodzi w ten obszar. Cień liczy się do znaku, więc margines mierzymy od jego krawędzi.',
  minimum: {
    symbol: '16 px na ekranie, 6 mm w druku (ikona strony z grubszymi klamrami)',
    fullStamp: '24 px na ekranie, 9 mm w druku',
    primary: '120 px szerokości, 32 mm w druku',
  },
  social: [
    {
      id: 'post-1',
      headline: 'Pierwsza linijka kodu.',
      body: 'Piszesz ją pierwszego wieczoru. Nie za miesiąc.',
      foot: 'klamra.example',
    },
    {
      id: 'post-2',
      headline: 'Osiem miejsc w grupie.',
      body: 'Nowa grupa startuje w lutym. Jeden mentor na ośmiu kursantów.',
      foot: 'Zapisy na klamra.example',
    },
    {
      id: 'post-3',
      headline: 'Co to jest klamra?',
      body: 'Otwiera blok kodu. Zamyka blok kodu. Reszta to kod.',
      foot: 'Klamra, szkoła programowania online',
    },
  ],
  certificate: {
    title: 'Certyfikat ukończenia kursu',
    course: 'Pierwsza praca w kodzie',
    lead: 'Klamra, szkoła programowania online, potwierdza, że',
    detail: 'ukończył(a) kurs trwający cztery miesiące i opublikował(a) własną aplikację internetową.',
    date: '28 czerwca',
  },
  stickers: ['git push', 'TODO', '404', '{ }', 'sudo', ';', 'commit', 'works on my machine'],
} as const;
