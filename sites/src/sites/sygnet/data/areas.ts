import { firm } from './site';

export interface Matter {
  title: string;
  text: string;
}

export interface Area {
  slug: string;
  no: number;
  name: string;
  tableText: string;
  metaDescription: string;
  lead: string;
  documentsTitle: string;
  matters: Matter[];
  documents: string[];
  leaderSlug: string;
  closing: string;
  articleSlugs: string[];
}

export const areas: Area[] = [
  {
    slug: 'rodzina',
    no: 1,
    name: 'Rodzina',
    tableText:
      'Rozwód i separacja. Alimenty i kontakty z dzieckiem. Podział majątku po rozstaniu. Prowadzimy sprawy spokojnie i bez zbędnych kłótni.',
    metaDescription:
      'Sprawy rodzinne w kancelarii Sygnet we Wrocławiu: rozwód, alimenty, kontakty z dzieckiem, podział majątku. Co zabrać na pierwszą rozmowę i ile to kosztuje.',
    lead: 'Rozwody, alimenty, kontakty z dzieckiem i podział majątku po rozstaniu. Prowadzi je Anna Wierzbicka, która najpierw pyta, czego się obawiasz, a dopiero potem mówi, co zrobi sąd.',
    documentsTitle: 'Dokumenty na pierwszą rozmowę w sprawie rodzinnej',
    matters: [
      {
        title: 'Rozwód i separacja',
        text: 'Pozew albo odpowiedź na pozew. Rozwód bez orzekania o winie, gdy oboje jesteście zgodni, i rozwód z orzeczeniem o winie, gdy zgody nie ma.',
      },
      {
        title: 'Alimenty',
        text: 'Pozew o alimenty na dziecko, wniosek o podwyższenie albo obniżenie, egzekucja zaległych rat.',
      },
      {
        title: 'Kontakty z dzieckiem',
        text: 'Ustalenie, kiedy i gdzie dziecko spotyka się z rodzicem, z którym nie mieszka. Gdy się da, kończymy ugodą rodziców.',
      },
      {
        title: 'Podział majątku po rozstaniu',
        text: 'Mieszkanie, samochód, oszczędności i kredyty. Podział w umowie u notariusza albo w sądzie.',
      },
      {
        title: 'Rozdzielność majątkowa',
        text: 'Umowa u notariusza, którą przygotowujemy i omawiamy z drugą stroną przed wizytą w kancelarii notarialnej.',
      },
      {
        title: 'Władza rodzicielska',
        text: 'Ograniczenie, zawieszenie i zmiana zasad. To rzadkie sprawy, w których pierwsze pytanie dotyczy bezpieczeństwa dziecka.',
      },
    ],
    documents: [
      'Dowody osobiste obu stron',
      'Odpis aktu małżeństwa',
      'Akty urodzenia dzieci',
      'Umowa o majątku małżeńskim, jeśli jest',
      'Zaświadczenia o zarobkach',
    ],
    leaderSlug: 'anna-wierzbicka',
    closing:
      'Czas trwania sprawy zależy głównie od sądu i od tego, czy strony się zgadzają. Na pierwszej rozmowie mówimy, czego da się spodziewać, a czego nie da się przewidzieć.',
    articleSlugs: ['alimenty-na-dziecko'],
  },
  {
    slug: 'spolki',
    no: 2,
    name: 'Spółki',
    tableText:
      'Zakładanie spółki i umowa między wspólnikami, napisana tak, by nie wracać do niej w sporze. Decyzje wspólników i zmiany w rejestrze firm. Spory między wspólnikami.',
    metaDescription:
      'Prawo spółek w kancelarii Sygnet we Wrocławiu: zakładanie spółki z o.o., umowa wspólników, uchwały, zmiany w KRS i spory. Dokumenty na spotkanie i honorarium.',
    lead: 'Zakładanie spółki, umowy między wspólnikami, uchwały, zmiany w rejestrze i spory. Prowadzi je Marek Zawada, który umowy pisze tak, żeby po dwóch latach dało się je przeczytać bez niego.',
    documentsTitle: 'Dokumenty na pierwszą rozmowę w sprawie spółki',
    matters: [
      {
        title: 'Zakładanie spółki z o.o.',
        text: 'Przez internetowy system S24 albo u notariusza. Razem sprawdzamy, który sposób pasuje do waszej umowy.',
      },
      {
        title: 'Umowa spółki',
        text: 'Pisana pod wspólników, a nie z formularza. Wyjaśniamy, co zostawić w standardzie, a co zmienić.',
      },
      {
        title: 'Umowa między wspólnikami',
        text: 'Wyjście wspólnika ze spółki, prawo pierwszeństwa przy sprzedaży udziałów, decyzje przy równym podziale głosów.',
      },
      {
        title: 'Uchwały i zgromadzenia',
        text: 'Projekty uchwał, protokoły i zwołanie zgromadzenia tak, żeby nikt nie mógł później podważyć decyzji z powodu formy.',
      },
      {
        title: 'Zmiany w rejestrze firm',
        text: 'Nowy zarząd, nowy adres, podwyższenie kapitału. Przygotowujemy uchwałę i wniosek o wpis do KRS.',
      },
      {
        title: 'Spory między wspólnikami',
        text: 'Impas w decyzjach, wyłączenie wspólnika, wyjście ze spółki. Zaczynamy od spisania, o co naprawdę chodzi.',
      },
    ],
    documents: [
      'Aktualny odpis z rejestru firm (KRS)',
      'Umowa spółki albo jej statut, czyli pisemne zasady działania spółki',
      'Spisane decyzje wspólników',
      'Roczne sprawozdanie finansowe',
      'Pisemna zgoda dla osoby, która przyjdzie za Ciebie',
      'Wzory podpisów osób kierujących spółką',
    ],
    leaderSlug: 'marek-zawada',
    closing:
      'Przy zakładaniu spółki prosimy o jedno spotkanie z wszystkimi wspólnikami. Zmiana zapisu po podpisaniu kosztuje więcej niż godzina rozmowy przed nim.',
    articleSlugs: ['spolka-zoo-s24-czy-notariusz'],
  },
  {
    slug: 'spadki',
    no: 3,
    name: 'Spadki',
    tableText:
      'Testament. Sądowe potwierdzenie, kto dziedziczy. Część spadku, która należy się bliskim mimo testamentu. Podział spadku między dziedziców.',
    metaDescription:
      'Sprawy spadkowe w kancelarii Sygnet we Wrocławiu: testament, stwierdzenie nabycia spadku, zachowek, dział spadku. Dokumenty na spotkanie i honorarium.',
    lead: 'Testamenty, potwierdzanie dziedziczenia, zachowek i dział spadku. Prowadzi je Anna Wierzbicka, która zaczyna od listy osób i majątku, bo od niej zależy, jaką drogą pójdziecie.',
    documentsTitle: 'Dokumenty na pierwszą rozmowę w sprawie spadkowej',
    matters: [
      {
        title: 'Stwierdzenie nabycia spadku',
        text: 'Sądowe albo notarialne potwierdzenie, kto dziedziczy. Wybieramy drogę zależnie od tego, czy wszyscy dziedzice są zgodni.',
      },
      {
        title: 'Przyjęcie albo odrzucenie spadku',
        text: 'Termin na decyzję jest krótki, więc sprawdzamy go na samym początku rozmowy, razem z tym, jakie długi zostawił zmarły.',
      },
      {
        title: 'Testament',
        text: 'Pisanie testamentu i sprawdzanie tego, który już istnieje. Wyjaśniamy, co zapis oznacza dla każdej z osób.',
      },
      {
        title: 'Zachowek',
        text: 'Część spadku, która należy się najbliższym, gdy testament zostawił im mniej albo nic. Wyliczamy kwotę i prowadzimy rozmowy z dziedzicami.',
      },
      {
        title: 'Dział spadku',
        text: 'Podział majątku między dziedziców u notariusza albo w sądzie, z uwzględnieniem mieszkania, które trudno rozdzielić na części.',
      },
      {
        title: 'Spadek z długami',
        text: 'Co można zrobić, gdy po zmarłym zostały zobowiązania, i jak ograniczyć odpowiedzialność za nie.',
      },
    ],
    documents: [
      'Akt zgonu',
      'Testament, jeśli istnieje',
      'Dane wszystkich bliskich, którzy mogą dziedziczyć',
      'Wykaz majątku',
      'Numery ksiąg wieczystych, czyli rejestru nieruchomości',
    ],
    leaderSlug: 'anna-wierzbicka',
    closing:
      'Jeśli minęło sporo czasu od śmierci bliskiej osoby i nie wiesz, czy terminy już upłynęły, zadzwoń. Sprawdzimy to na pierwszej rozmowie.',
    articleSlugs: ['zachowek-komu-sie-nalezy'],
  },
  {
    slug: 'umowy',
    no: 4,
    name: 'Umowy',
    tableText:
      'Umowy najmu i sprzedaży mieszkań. Umowy między firmami. Sprawdzamy też umowę, którą dostajesz od drugiej strony, i zaznaczamy każdy zapis, który działa przeciw Tobie.',
    metaDescription:
      'Umowy w kancelarii Sygnet we Wrocławiu: najem, sprzedaż mieszkania, umowy między firmami i przegląd umowy od drugiej strony. Dokumenty i honorarium.',
    lead: 'Umowy najmu i sprzedaży mieszkań, umowy między firmami i przegląd tej, którą dostajesz do podpisu. Prowadzi je Marek Zawada, który czyta także załączniki i regulaminy.',
    documentsTitle: 'Dokumenty na pierwszą rozmowę w sprawie umowy',
    matters: [
      {
        title: 'Najem mieszkania',
        text: 'Umowa dla wynajmującego albo najemcy, kaucja, protokół zdawczo-odbiorczy i wypowiedzenie.',
      },
      {
        title: 'Sprzedaż mieszkania',
        text: 'Umowa przedwstępna, zadatek i zaliczka, akt notarialny. Sprawdzamy księgę wieczystą, zanim cokolwiek zapłacisz.',
      },
      {
        title: 'Umowy między firmami',
        text: 'Współpraca, usługi, dostawy i licencje. Opisujemy, kto za co odpowiada i co się dzieje przy opóźnieniu.',
      },
      {
        title: 'Przegląd umowy od drugiej strony',
        text: 'Czytamy całość z załącznikami i zaznaczamy zapisy, które działają przeciw Tobie, wraz z propozycją zmiany.',
      },
      {
        title: 'Kary umowne',
        text: 'Kiedy kara jest zapisana skutecznie, kiedy można ją obniżyć i jak ją sformułować, żeby nie wisiała nad Tobą bez końca.',
      },
      {
        title: 'Odstąpienie i wypowiedzenie',
        text: 'Czy wolno wyjść z umowy, na jakich warunkach i w jakiej formie złożyć oświadczenie.',
      },
    ],
    documents: [
      'Projekt umowy w całości',
      'Załączniki i regulaminy',
      'Dotychczasowa korespondencja',
      'Termin podpisu',
      'Pytania, które masz już teraz',
    ],
    leaderSlug: 'marek-zawada',
    closing:
      'Najlepiej przyjść przed podpisem, bo wtedy da się zmienić prawie każdy zapis. Po podpisie zostaje spór.',
    articleSlugs: ['kaucja-za-mieszkanie'],
  },
];

export const areaBySlug = (slug: string): Area | undefined =>
  areas.find(area => area.slug === slug);

export const processSteps = [
  {
    no: '2.1',
    title: 'Zgłoszenie',
    text: `Opowiadasz, o co chodzi. My słuchamy i zadajemy pytania. Pierwsze ${firm.firstTalkMinutes} minut jest bez opłaty.`,
    meta: `${firm.firstTalkMinutes} minut, ${firm.firstTalkPricePln} zł`,
  },
  {
    no: '2.2',
    title: 'Dokumenty',
    text: 'Czytamy to, co przyniesiesz, i zaznaczamy zapisy, które mogą być dla Ciebie ryzykowne.',
    meta: `Do ${firm.documentReviewWorkingDays} dni roboczych`,
  },
  {
    no: '2.3',
    title: 'Opinia',
    text: 'Piszemy krótko, co z dokumentów wynika i jakie masz drogi. To, co dalej, wybierasz Ty.',
    meta: 'Opinia na piśmie',
  },
  {
    no: '2.4',
    title: 'Sprawa',
    text: 'Występujemy za Ciebie w sądzie i w urzędach. Po każdym kroku dostajesz krótką wiadomość.',
    meta: 'Wiadomość po każdym etapie',
  },
];
