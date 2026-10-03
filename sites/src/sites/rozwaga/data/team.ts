export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  focus: string[];
  details: { label: string; value: string }[];
}

export const team: TeamMember[] = [
  {
    slug: 'aneta-wojtynska',
    name: 'Aneta Wojtyńska',
    role: 'radca prawny, prowadzi kancelarię',
    tagline: 'Spółki, wspólnicy i spory, które z nich wynikają.',
    bio: [
      'Aneta zaczynała od sporów sądowych o zapłatę i do dziś pisze własne pozwy. Z czasem coraz więcej klientów przychodziło do niej nie ze sporem, ale z pytaniem, jak go uniknąć, więc zajęła się umowami spółek i umowami wspólników.',
      'Prowadzi sprawy, w których wspólnicy przestali się dogadywać. Najpierw szuka rozwiązania w umowie i w rozmowie, a pozew traktuje jako ostatni krok. Uważa, że dobre pismo procesowe mieści się na dwóch stronach.',
    ],
    focus: ['prawo-spolek', 'spory-sadowe'],
    details: [
      { label: 'Specjalizacje', value: 'prawo spółek, spory sądowe' },
      { label: 'Języki', value: 'polski, angielski' },
      { label: 'Wpis', value: 'Okręgowa Izba Radców Prawnych we Wrocławiu' },
    ],
  },
  {
    slug: 'rafal-dzierzanowski',
    name: 'Rafał Dzierżanowski',
    role: 'radca prawny',
    tagline: 'Umowy i nieruchomości, czyli wszystko, co się podpisuje.',
    bio: [
      'Rafał czyta umowy, zanim zrobi to druga strona, i szuka w nich tego, co dopiero za dwa lata stanie się sporem. Najwięcej pracuje z firmami, które wynajmują lokale, zawierają umowy o współpracy i kupują od dostawców.',
      'W nieruchomościach zajmuje się najmem lokali użytkowych i zakupem lokali na firmę. Przed każdą umową sprawdza księgę wieczystą i pyta o rzeczy, o których klient nie pomyślał, na przykład kto odpowiada za remont dachu.',
    ],
    focus: ['umowy', 'nieruchomosci'],
    details: [
      { label: 'Specjalizacje', value: 'umowy, nieruchomości' },
      { label: 'Języki', value: 'polski, niemiecki' },
      { label: 'Wpis', value: 'Okręgowa Izba Radców Prawnych we Wrocławiu' },
    ],
  },
  {
    slug: 'weronika-chmielecka',
    name: 'Weronika Chmielecka',
    role: 'asystentka kancelarii',
    tagline: 'Pierwszy głos w słuchawce i ostatnia osoba, która sprawdza terminy.',
    bio: [
      'Weronika odbiera telefony, umawia rozmowy i spotkania, zbiera dokumenty od klientów i pilnuje terminów procesowych. Jeśli dzwonisz do kancelarii pierwszy raz, to z nią porozmawiasz.',
      'Wie, o co zapytać, żeby radca nie musiał oddzwaniać z pytaniem o numer sprawy. Prowadzi kalendarz kancelarii i przypomina o rzeczach, które łatwo przeoczyć: terminie sprzeciwu, wygasającym pełnomocnictwie, brakującej opłacie sądowej.',
    ],
    focus: [],
    details: [
      { label: 'Zajmuje się', value: 'umawianiem rozmów, dokumentami, terminami' },
      { label: 'Języki', value: 'polski, angielski' },
      { label: 'Dostępna', value: 'w godzinach pracy kancelarii' },
    ],
  },
];
