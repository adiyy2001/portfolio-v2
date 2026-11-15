export interface TreatmentStep {
  name: string;
  text: string;
}

export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface Treatment {
  slug: string;
  name: string;
  short: string;
  description: string;
  lead: string;
  visits: string;
  time: string;
  priceId: string;
  card?: { number: string; meta: string; items: readonly string[] };
  intro: readonly string[];
  steps: readonly TreatmentStep[];
  afterHeading: string;
  after: readonly string[];
  faq: readonly TreatmentFaq[];
  doctors: readonly string[];
}

export const treatments: readonly Treatment[] = [
  {
    slug: 'przeglad',
    name: 'Przegląd',
    short: 'Badanie, zdjęcie i plan leczenia na jednej kartce.',
    description:
      'Przegląd w Emalii na Krzykach: badanie zębów, zdjęcie pantomograficzne i plan leczenia z cenami na kartce, od 150 zł.',
    lead: 'Badamy zęby, dziąsła i zgryz, robimy zdjęcie pantomograficzne i zapisujemy na kartce, co jest do zrobienia i ile to kosztuje.',
    visits: '1 wizyta',
    time: '60 min',
    priceId: 'przeglad',
    card: {
      number: '01',
      meta: '60 min',
      items: [
        'Badanie i zdjęcie pantomograficzne',
        'Plan leczenia na kartce',
        'Kosztorys przed pierwszym zabiegiem',
      ],
    },
    intro: [
      'Przegląd jest naszą pierwszą wizytą i zwykłą kontrolą dla każdego, kto od dawna nie był u dentysty albo chce sprawdzić, czy wszystko jest w porządku.',
      'Lekarz ogląda każdy ząb osobno, a zdjęcie pantomograficzne pokazuje to, czego w ustach nie widać: korzenie, zęby zatrzymane w kości i zmiany przy wierzchołkach korzeni.',
    ],
    steps: [
      {
        name: 'Rozmowa',
        text: 'Pytamy o dolegliwości, leki i dotychczasowe leczenie. Jeśli masz stare zdjęcia, pokaż je.',
      },
      {
        name: 'Badanie',
        text: 'Oglądamy zęby i dziąsła, robimy zdjęcie pantomograficzne i opisujemy je razem z tobą na ekranie.',
      },
      {
        name: 'Plan',
        text: 'Zapisujemy na kartce kolejność zabiegów i cenę każdego z nich. Kartkę zabierasz do domu.',
      },
    ],
    afterHeading: 'Po przeglądzie',
    after: [
      'Wychodzisz z planem leczenia i kosztorysem na kartce.',
      'Możesz od razu umówić pierwszy zabieg albo wrócić do decyzji w domu.',
      'Zdjęcie pantomograficzne zostaje w twojej kartotece i jest dostępne przy każdej kolejnej wizycie.',
    ],
    faq: [
      {
        question: 'Czy przegląd boli?',
        answer:
          'Zwykle nie. Lekarz ogląda zęby lusterkiem i sondą, a zdjęcie robimy na stojąco. Jeśli coś zacznie przeszkadzać, podnieś rękę, a przerwiemy.',
      },
      {
        question: 'Jak często robić przegląd?',
        answer:
          'Raz na pół roku, jeśli leczysz się regularnie, i raz w roku, gdy zęby są w dobrym stanie. Lekarz powie, który wariant dotyczy ciebie.',
      },
      {
        question: 'Czy muszę leczyć się u was?',
        answer:
          'Nie. Plan z kartki możesz zrealizować u nas albo w innym gabinecie. Decyzja należy do ciebie.',
      },
    ],
    doctors: ['marta-kowal', 'jan-wrona'],
  },
  {
    slug: 'higienizacja',
    name: 'Higienizacja',
    short: 'Skaling, piaskowanie, polerowanie i fluoryzacja w godzinę.',
    description:
      'Higienizacja w Emalii na Krzykach: skaling, piaskowanie, polerowanie i fluoryzacja w godzinę, od 280 zł.',
    lead: 'Usuwamy kamień i osad, piaskujemy przebarwienia po kawie i herbacie, polerujemy zęby i na koniec nakładamy lakier z fluorem.',
    visits: '1 wizyta',
    time: '60 min',
    priceId: 'higienizacja',
    card: {
      number: '02',
      meta: '60 min',
      items: ['Skaling i piaskowanie', 'Polerowanie i fluoryzacja', 'Instruktaż szczotkowania'],
    },
    intro: [
      'Higienizację prowadzi higienistka Alicja Nowicka. Wizyta trwa godzinę i kończy się instruktażem szczotkowania, pokazanym na twoich zębach.',
      'Kamień odkłada się u każdego, także przy starannym szczotkowaniu, bo twardnieje tam, gdzie szczoteczka nie sięga. Po zabiegu dziąsła wracają do formy w ciągu kilku dni.',
    ],
    steps: [
      {
        name: 'Skaling',
        text: 'Końcówka ultradźwiękowa odrywa kamień nad dziąsłem i przy jego brzegu.',
      },
      {
        name: 'Piaskowanie',
        text: 'Strumień wody z miękkim proszkiem zdejmuje przebarwienia po kawie, herbacie i papierosach.',
      },
      {
        name: 'Polerowanie i fluoryzacja',
        text: 'Pasta polerska wygładza powierzchnię zębów, a lakier z fluorem ją wzmacnia.',
      },
      {
        name: 'Instruktaż',
        text: 'Pokazujemy, jak szczotkować i czyścić przestrzenie między zębami, od razu na twoich zębach.',
      },
    ],
    afterHeading: 'Po higienizacji',
    after: [
      'Przez pierwsze dwie godziny unikaj kawy, herbaty i czerwonego wina.',
      'Zęby mogą być do następnego dnia wrażliwe na zimno.',
      'Kolejną higienizację zaplanuj za pół roku, a przy dziąsłach, które krwawią, za trzy miesiące.',
    ],
    faq: [
      {
        question: 'Czy higienizacja boli?',
        answer:
          'Zwykle nie. Przy wrażliwych zębach nakładamy żel znieczulający, a zabieg przerywamy na twój znak.',
      },
      {
        question: 'Czy piaskowanie niszczy zęby?',
        answer:
          'Nie. Proszek jest miękki i zdejmuje osad oraz przebarwienia, a zdrowej powierzchni zęba nie rysuje.',
      },
      {
        question: 'Czy mogę przyjść, gdy dziąsła krwawią?',
        answer:
          'Tak, to częsty powód wizyty. Alicja zobaczy, czy dziąsła potrzebują leczenia u lekarza, i powie o tym jeszcze na fotelu.',
      },
    ],
    doctors: ['alicja-nowicka'],
  },
  {
    slug: 'wybielanie',
    name: 'Wybielanie',
    short: 'Nakładki robione na twoje zęby i żel do używania w domu.',
    description:
      'Wybielanie nakładkowe w Emalii na Krzykach: dwie wizyty, nakładki na twoje zęby, żel do domu i kontrola odcienia po tygodniu, od 900 zł.',
    lead: 'Robimy nakładki na twoje zęby, dobieramy żel i pokazujemy, jak go stosować w domu. Pierwsze efekty widać po kilku dniach.',
    visits: '2 wizyty',
    time: 'pierwsza około godziny, druga krótsza',
    priceId: 'wybielanie',
    card: {
      number: '03',
      meta: '2 wizyty',
      items: ['Nakładki indywidualne', 'Żel i zestaw do domu', 'Kontrola odcienia po tygodniu'],
    },
    intro: [
      'Wybielamy nakładkami, bo rozjaśniają zęby powoli i równo, a o tym, kiedy skończyć, decydujesz sam. Lekarka Marta Kowal sprawdza przed zabiegiem, czy zęby są zdrowe, bo wybielanie zaczyna się od wyleczenia ubytków.',
      'Wybielanie działa na własne zęby. Wypełnienia i korony nie zmieniają koloru, dlatego przed zabiegiem mówimy, co z nimi zrobić.',
    ],
    steps: [
      {
        name: 'Pierwsza wizyta',
        text: 'Skanujemy zęby, dobieramy odcień na skali od A1 do C1 i ustalamy, do którego chcesz dojść.',
      },
      {
        name: 'Druga wizyta',
        text: 'Odbierasz nakładki i żel, a lekarka pokazuje, jak je zakładać i jak długo nosić.',
      },
      {
        name: 'Kontrola po tygodniu',
        text: 'Dzwonimy i pytamy o odcień oraz wrażliwość zębów. Jeśli trzeba, zmieniamy plan noszenia.',
      },
    ],
    afterHeading: 'Po wybielaniu',
    after: [
      'W pierwszych dniach unikaj kawy, herbaty i czerwonego wina.',
      'Wrażliwość na zimno mija zwykle w ciągu kilku dni.',
      'Nakładki zostają u ciebie. Za rok lub dwa możesz je odświeżyć żelem uzupełniającym.',
    ],
    faq: [
      {
        question: 'Jak długo utrzymuje się efekt?',
        answer:
          'To zależy od nawyków. Kawa, herbata i papierosy skracają go, a przy spokojnej diecie wystarcza zwykle na rok lub dwa. Potem wystarczy krótkie uzupełnienie żelem.',
      },
      {
        question: 'Czy wybielanie szkodzi zębom?',
        answer:
          'Przy zdrowych zębach i stosowaniu zgodnie z instrukcją nie. Dlatego zaczynamy od przeglądu i leczymy ubytki przed pierwszą nakładką.',
      },
      {
        question: 'Kiedy lepiej poczekać z wybielaniem?',
        answer:
          'W ciąży, przy aktywnej próchnicy i przy bardzo wrażliwych zębach. Lekarka powie, czy w twoim przypadku trzeba najpierw coś wyleczyć.',
      },
    ],
    doctors: ['marta-kowal'],
  },
  {
    slug: 'leczenie-kanalowe',
    name: 'Leczenie kanałowe',
    short: 'Praca pod mikroskopem, zdjęcie przed i po, cena zależna od zęba.',
    description:
      'Leczenie kanałowe pod mikroskopem w Emalii na Krzykach: jedna lub dwie wizyty, zdjęcie przed i po, od 650 zł, cena zależy od zęba.',
    lead: 'Leczymy kanały pod mikroskopem, żeby uratować ząb, który inaczej trzeba byłoby usunąć. Cenę podajemy po zdjęciu, zanim zaczniemy.',
    visits: '1 do 2 wizyt',
    time: 'do 2 godz. na wizytę',
    priceId: 'kanal-jeden',
    card: {
      number: '04',
      meta: '1 do 2 wizyt',
      items: ['Praca pod mikroskopem', 'Zdjęcie przed i po', 'Cena zależy od zęba'],
    },
    intro: [
      'Leczenie kanałowe prowadzi lekarz Jan Wrona. Mikroskop powiększa pole pracy tak, że widać ujścia kanałów, które gołym okiem łatwo przeoczyć.',
      'Ząb po leczeniu jest osłabiony, więc zwykle potrzebuje odbudowy. Opisujemy ją w planie jeszcze przed zabiegiem, razem z ceną.',
    ],
    steps: [
      {
        name: 'Zdjęcie przed',
        text: 'Robimy zdjęcie, liczymy kanały i oceniamy, ile wizyt będzie potrzebne.',
      },
      {
        name: 'Znieczulenie i dostęp',
        text: 'Znieczulamy ząb i zakładamy koferdam, czyli gumową osłonę, która odgradza ząb od śliny.',
      },
      {
        name: 'Kanały',
        text: 'Pod mikroskopem oczyszczamy i płuczemy kanały, a potem szczelnie je wypełniamy. Przy zainfekowanym zębie dzielimy to na dwie wizyty.',
      },
      {
        name: 'Zdjęcie po',
        text: 'Robimy kontrolne zdjęcie i pokazujemy, jak wygląda wypełnienie kanałów.',
      },
    ],
    afterHeading: 'Po zabiegu',
    after: [
      'Ząb może być przez kilka dni wrażliwy na nagryzanie.',
      'Jeśli ból narasta zamiast słabnąć, zadzwoń. Przyjmiemy cię tego samego albo następnego dnia roboczego.',
      'Odbudowę zęba, wypełnieniem lub koroną, planujemy razem z leczeniem kanałowym.',
    ],
    faq: [
      {
        question: 'Czy leczenie kanałowe boli?',
        answer:
          'Leczymy w znieczuleniu, więc podczas zabiegu zwykle nie czuć bólu. Potem ząb może przez kilka dni boleć przy nagryzaniu. Jeśli ból nie słabnie, zadzwoń.',
      },
      {
        question: 'Dlaczego cena zależy od zęba?',
        answer:
          'Im więcej kanałów, tym dłuższa i trudniejsza praca. Siekacz ma zwykle jeden kanał, a trzonowiec trzy albo cztery. Dlatego w cenniku są trzy stawki.',
      },
      {
        question: 'Czy da się wszystko zrobić w jednej wizycie?',
        answer:
          'Często tak. Gdy ząb jest zainfekowany, dzielimy leczenie na dwie wizyty, żeby kanały miały czas się wyciszyć.',
      },
    ],
    doctors: ['jan-wrona'],
  },
  {
    slug: 'wypelnienia',
    name: 'Wypełnienia',
    short: 'Kompozyt w kolorze zęba, zwykle w jednej wizycie.',
    description:
      'Wypełnienia kompozytowe w Emalii na Krzykach: usunięcie próchnicy i odbudowa zęba w kolorze twojego zęba, od 260 zł za ząb.',
    lead: 'Usuwamy próchnicę i odbudowujemy ząb kompozytem w kolorze twojego zęba. Zwykle wystarcza jedna wizyta.',
    visits: '1 wizyta',
    time: 'do 60 min',
    priceId: 'wypelnienie',
    intro: [
      'Wypełnienia robi lekarka Marta Kowal. Kolor kompozytu dobieramy przy świetle dziennym, bo pod lampą w gabinecie każdy odcień wygląda inaczej niż na ulicy.',
      'Gdy ubytek jest duży, mówimy o tym przed zabiegiem i podajemy osobną cenę za odbudowę większego ubytku.',
    ],
    steps: [
      {
        name: 'Znieczulenie',
        text: 'Znieczulamy miejscowo i czekamy, aż ząb przestanie czuć, zanim zaczniemy pracę.',
      },
      {
        name: 'Usunięcie próchnicy',
        text: 'Usuwamy chore tkanki i zostawiamy zdrowy ząb, ile się da.',
      },
      {
        name: 'Odbudowa',
        text: 'Kompozyt nakładamy warstwami i utwardzamy lampą, żeby kształt i kolor zgadzały się z sąsiednimi zębami.',
      },
      {
        name: 'Zgryz',
        text: 'Sprawdzamy zgryz i polerujemy wypełnienie, żeby nic nie przeszkadzało przy gryzieniu.',
      },
    ],
    afterHeading: 'Po zabiegu',
    after: [
      'Nie jedz, dopóki nie wróci czucie, żeby nie przygryźć policzka lub języka.',
      'Ząb może być przez kilka dni wrażliwy na zimno i ciepło.',
      'Jeśli zgryz wydaje się za wysoki, wróć do nas. Poprawimy go bez opłaty.',
    ],
    faq: [
      {
        question: 'Z czego robicie wypełnienia?',
        answer: 'Z kompozytu światłoutwardzalnego w kolorze zęba. Metalowych wypełnień nie robimy.',
      },
      {
        question: 'Czy wypełnienie będzie widać?',
        answer:
          'Dobrze dobrany kompozyt zlewa się z zębem. Kolor sprawdzamy przy świetle dziennym i pokazujemy ci go w lusterku, zanim skończymy.',
      },
      {
        question: 'Jak długo wytrzyma?',
        answer: 'Przy dobrej higienie wiele lat. Stan wypełnień sprawdzamy na każdym przeglądzie.',
      },
    ],
    doctors: ['marta-kowal'],
  },
  {
    slug: 'bol-zeba',
    name: 'Ból zęba',
    short: 'Przyjmujemy tego samego albo następnego dnia roboczego.',
    description:
      'Ból zęba we Wrocławiu na Krzykach: Emalia przyjmuje tego samego albo następnego dnia roboczego, wizyta od 180 zł ze zdjęciem i zabezpieczeniem zęba.',
    lead: 'Z bólem zęba przyjmujemy tego samego albo następnego dnia roboczego. Szukamy przyczyny, uśmierzamy ból i mówimy, co dalej.',
    visits: '1 wizyta',
    time: 'około pół godziny',
    priceId: 'wizyta-bolowa',
    intro: [
      'Zadzwoń do gabinetu albo wyślij zgłoszenie z tematem „Ból zęba”. Oddzwonimy w godzinach przyjęć i ustalimy termin najbliższy, jaki mamy.',
      'Wizyta bólowa jest krótsza od przeglądu. Celem jest ustalenie przyczyny i ulga, a nie pełny plan leczenia, który przygotowujemy na kolejnej wizycie.',
    ],
    steps: [
      {
        name: 'Rozmowa o bólu',
        text: 'Pytamy, kiedy ból się zaczął i na co reaguje: zimno, ciepło, nagryzanie czy leżenie.',
      },
      {
        name: 'Zdjęcie',
        text: 'Robimy zdjęcie punktowe zęba, które jest w cenie wizyty, i sprawdzamy, skąd ból pochodzi.',
      },
      {
        name: 'Zabezpieczenie',
        text: 'Znieczulamy ząb, usuwamy przyczynę bólu na tyle, na ile to możliwe w jednej wizycie, i zakładamy opatrunek.',
      },
      {
        name: 'Co dalej',
        text: 'Mówimy, czy ząb wymaga leczenia kanałowego, wypełnienia czy obserwacji, i umawiamy kolejną wizytę.',
      },
    ],
    afterHeading: 'Do czasu wizyty',
    after: [
      'Płucz usta letnią wodą i przyjmuj leki przeciwbólowe zgodnie z ulotką.',
      'Zimny okład na policzek jest bezpieczniejszy niż ciepło.',
      'Jeśli policzek puchnie albo masz gorączkę, zadzwoń do gabinetu od razu, a poza godzinami przyjęć wezwij pogotowie.',
    ],
    faq: [
      {
        question: 'Czy muszę być wcześniej pacjentem Emalii?',
        answer:
          'Nie. Z bólem przyjmujemy także osoby, które nigdy u nas nie były. Wystarczy zadzwonić.',
      },
      {
        question: 'Ile kosztuje wizyta z bólem?',
        answer:
          'Od 180 zł, w tym jedno zdjęcie punktowe. Cenę dalszego leczenia podajemy na kartce, zanim je zaczniemy.',
      },
      {
        question: 'Czy ból zniknie po jednej wizycie?',
        answer:
          'Zwykle ulga przychodzi od razu po znieczuleniu i zabezpieczeniu zęba. Pełne leczenie bywa dłuższe i zależy od przyczyny.',
      },
    ],
    doctors: ['marta-kowal', 'jan-wrona'],
  },
];

export const findTreatment = (slug: string) => {
  const treatment = treatments.find(entry => entry.slug === slug);
  if (!treatment) throw new Error(`Unknown treatment: ${slug}`);
  return treatment;
};

export const homeCards = treatments.filter(treatment => treatment.card);
