import type { RoomTypeId } from '../data/rooms';
import type { Lang } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface RoomText {
  name: string;
  summary: string;
  bed: string;
  view: string;
  pageTitle: string;
  pageDescription: string;
  headline: string;
  intro: string[];
  details: { label: string; value: string }[];
  amenities: string[];
  goodFor: string;
  planCaption: string;
}

export interface RoomsPageText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  rackHeading: string;
  guestsLabel: (count: number) => string;
  sizeLabel: string;
  fromLabel: string;
  perNight: string;
  priceNote: string;
  openRoom: string;
  commonHeading: string;
  commonLead: string;
  commonGroups: { title: string; items: string[] }[];
  compareHeading: string;
  compareHead: { room: string; size: string; guests: string; bed: string; from: string };
  planHeading: string;
  numbersLabel: string;
  planLegend: string;
  bookRoom: string;
  checkDates: string;
  otherRooms: string;
  specHeading: string;
  amenitiesHeading: string;
  priceHeading: string;
  priceLead: string;
  priceRows: { label: string; factor: string }[];
  breadcrumbRooms: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  exampleHeading: string;
  exampleLead: string;
  exampleHead: { night: string; flexible: string; nonRefundable: string };
  exampleNights: Record<
    'weekday' | 'weekend' | 'summerWeekday' | 'summerWeekend' | 'market' | 'newYearsEve',
    string
  >;
  cancelNote: string;
  planAlt: (name: string, size: number) => string;
}

const sharedAmenities = {
  pl: [
    'Wi-Fi światłowodowe w całym domu',
    'Sejf w szafie',
    'Czajnik, kawa i herbata bez dopłaty',
    'Woda z filtra na każdym piętrze',
    'Telewizor, ekran na ścianie',
    'Okna z podwójnymi szybami i ciężkie zasłony',
    'Ręczniki i kosmetyki w dozownikach',
    'Suszarka do włosów, lustro powiększające',
    'Ogrzewanie podłogowe w łazience',
  ],
  en: [
    'Fibre Wi-Fi throughout the house',
    'A safe in the wardrobe',
    'Kettle, coffee and tea at no charge',
    'Filtered water on every floor',
    'A wall-mounted television',
    'Double-glazed windows and heavy curtains',
    'Towels and toiletries in dispensers',
    'Hair dryer, magnifying mirror',
    'Underfloor heating in the bathroom',
  ],
};

const roomsPl: Record<RoomTypeId, RoomText> = {
  podworzowy: {
    name: 'Podwórzowy',
    summary: 'Najcichszy pokój w domu, okno na podwórze.',
    bed: 'łóżko 160 cm',
    view: 'podwórze',
    pageTitle: 'Pokój podwórzowy, 17 m², cichy, od 340 zł | Przęsło',
    pageDescription:
      'Pokój podwórzowy w hotelu Przęsło: 17 m², łóżko 160 cm, okno na cichy dziedziniec, prysznic. Plan pokoju w skali i cena od 340 zł za noc.',
    headline: 'Mały pokój, dobrze policzony.',
    intro: [
      'Okno wychodzi na podwórze kamienicy. Od strony Grodzkiej słychać tylko to, co przejdzie przez bramę, a po dziesiątej wieczorem prawie nic. To najcichszy pokój w domu i dlatego najczęściej wybierają go osoby, które przyjeżdżają na konferencję albo wyspać się po pociągu.',
      'Pokój ma siedemnaście metrów i nie udaje, że ma więcej. Łóżko stoi pod ścianą, biurko przy oknie, szafa we wnęce przy wejściu. Łazienka z prysznicem jest obok przedpokoju, z ogrzewaną podłogą.',
    ],
    details: [
      { label: 'Powierzchnia', value: '17 m²' },
      { label: 'Łóżko', value: 'jedno łóżko 160 x 200 cm' },
      { label: 'Osoby', value: 'do 2' },
      { label: 'Okno', value: '160 cm, na podwórze' },
      { label: 'Łazienka', value: 'prysznic bez progu' },
      { label: 'Liczba pokoi', value: '7 w całym domu' },
    ],
    amenities: ['Biurko przy oknie, gniazda z obu stron', 'Szafa z wieszakami i półkami'],
    goodFor: 'Dla jednej lub dwóch osób, które chcą ciszy i nie potrzebują dużo miejsca.',
    planCaption:
      'Plan pokoju podwórzowego w skali. Wejście od korytarza po prawej stronie, łazienka w lewym górnym rogu, okno w dolnej ścianie.',
  },
  klasyczny: {
    name: 'Klasyczny',
    summary: 'Dwa okna, łóżko 180 cm i fotel do czytania.',
    bed: 'łóżko 180 cm',
    view: 'ulica lub podwórze',
    pageTitle: 'Pokój klasyczny, 21 m², łóżko 180 cm, od 420 zł | Przęsło',
    pageDescription:
      'Pokój klasyczny w hotelu Przęsło: 21 m², dwa okna, łóżko 180 cm, biurko i fotel. Plan pokoju w skali i cena od 420 zł za noc.',
    headline: 'Dwa okna i fotel.',
    intro: [
      'Wysokie pokoje z oknami od frontu i od podwórza dostały po odnowieniu najwięcej światła z całego domu. Stropy mają trzy metry dwadzieścia, więc przy dwudziestu jeden metrach nie czuć ścisku.',
      'Łóżko ma 180 centymetrów, przy oknie stoi biurko z lampą, a w rogu fotel, w którym da się naprawdę czytać. Łazienka jest oddzielona przedpokojem, więc szum prysznica nie budzi drugiej osoby.',
    ],
    details: [
      { label: 'Powierzchnia', value: '21 m²' },
      { label: 'Łóżko', value: 'jedno łóżko 180 x 200 cm' },
      { label: 'Osoby', value: 'do 2' },
      { label: 'Okna', value: 'dwa, po 100 cm' },
      { label: 'Łazienka', value: 'prysznic bez progu' },
      { label: 'Liczba pokoi', value: '6 w całym domu' },
    ],
    amenities: ['Biurko z lampą', 'Fotel z lampką do czytania', 'Szafa z wieszakami i półkami'],
    goodFor: 'Na weekend we dwoje i na kilka nocy służbowo.',
    planCaption:
      'Plan pokoju klasycznego w skali. Łazienka i przedpokój od wejścia, pokój z dwoma oknami po przeciwnej stronie.',
  },
  nadrzeczny: {
    name: 'Z widokiem na Odrę',
    summary: 'Duże okna nad wodą, wanna i łóżko 180 cm.',
    bed: 'łóżko 180 cm',
    view: 'Odra',
    pageTitle: 'Pokój z widokiem na Odrę, 25 m², wanna, od 520 zł | Przęsło',
    pageDescription:
      'Pokój z widokiem na Odrę w hotelu Przęsło: 25 m², dwa duże okna, wanna, łóżko 180 cm. Plan pokoju w skali i cena od 520 zł za noc.',
    headline: 'Rzeka za dwoma oknami.',
    intro: [
      'Pięć pokoi od strony wody. Z okien widać rzekę, bulwar po drugiej stronie i drzewa, które rano zasłaniają pierwsze tramwaje. Okna mają po 160 centymetrów, więc w pokoju nie potrzeba dużo światła z lampy.',
      'W łazience stoi wanna, a łóżko jest ustawione tak, że leżąc widzisz wodę. Przy oknie jest biurko, w rogu fotel. To pokój na dłuższą rozmowę, na rocznicę albo na dzień, w którym nie ma się gdzie spieszyć.',
    ],
    details: [
      { label: 'Powierzchnia', value: '25 m²' },
      { label: 'Łóżko', value: 'jedno łóżko 180 x 200 cm' },
      { label: 'Osoby', value: 'do 2' },
      { label: 'Okna', value: 'dwa, po 160 cm, na Odrę' },
      { label: 'Łazienka', value: 'wanna' },
      { label: 'Liczba pokoi', value: '5 w całym domu' },
    ],
    amenities: ['Wanna z baterią podtynkową', 'Biurko przy oknie', 'Fotel i stolik'],
    goodFor: 'Dla par i dla każdego, kto przyjeżdża do Wrocławia na rzekę.',
    planCaption:
      'Plan pokoju z widokiem na Odrę w skali. Dwa duże okna w ścianie od strony rzeki, łazienka z wanną przy wejściu.',
  },
  rodzinny: {
    name: 'Rodzinny',
    summary: 'Dwie izby: sypialnia i pokój dla dzieci, do czterech osób.',
    bed: 'łóżko 160 cm i dwa łóżka 90 cm',
    view: 'podwórze i ulica',
    pageTitle: 'Pokój rodzinny, 36 m², do 4 osób, od 640 zł | Przęsło',
    pageDescription:
      'Pokój rodzinny w hotelu Przęsło: 36 m², dwie izby, łóżko 160 cm i dwa łóżka 90 cm, wanna i prysznic. Plan w skali i cena od 640 zł za noc.',
    headline: 'Dwie izby i drzwi, które się zamykają.',
    intro: [
      'Rodzinny to dwa pokoje z osobnym wejściem do każdego. W większym jest łóżko dla dorosłych i fotel, w mniejszym dwa łóżka po 90 centymetrów i stolik, przy którym dzieci rysują, kiedy dorośli piją kawę.',
      'Łazienka ma i wannę, i prysznic, więc rano nie ma kolejki. Jeśli podróżujesz z niemowlęciem, łóżeczko dostaniesz bez dopłaty, wystarczy je zaznaczyć w rezerwacji.',
    ],
    details: [
      { label: 'Powierzchnia', value: '36 m²' },
      { label: 'Łóżka', value: 'jedno 160 x 200 cm i dwa 90 x 200 cm' },
      { label: 'Osoby', value: 'do 4' },
      { label: 'Okna', value: 'trzy, w obu izbach' },
      { label: 'Łazienka', value: 'wanna i prysznic' },
      { label: 'Liczba pokoi', value: '3 w całym domu' },
    ],
    amenities: [
      'Dwie izby z osobnymi drzwiami',
      'Stolik do rysowania w pokoju dzieci',
      'Łóżeczko bez dopłaty',
    ],
    goodFor: 'Dla rodziny z dwójką dzieci i dla czterech osób, które chcą mieć własne drzwi.',
    planCaption:
      'Plan pokoju rodzinnego w skali. Sypialnia dorosłych po lewej, pokój dzieci po prawej, łazienka z wanną i prysznicem przy wejściu.',
  },
  poddasze: {
    name: 'Poddasze',
    summary: 'Najwyższe piętro, skosy, wanna i sofa rozkładana.',
    bed: 'łóżko 180 cm i sofa rozkładana',
    view: 'dachy Starego Miasta',
    pageTitle: 'Pokój Poddasze, 46 m², wanna, skosy, od 780 zł | Przęsło',
    pageDescription:
      'Poddasze w hotelu Przęsło: 46 m² pod skosami, łóżko 180 cm, sofa rozkładana, wanna i prysznic. Plan w skali i cena od 780 zł za noc.',
    headline: 'Najwyżej w domu, pod skosami.',
    intro: [
      'Trzy pokoje na czwartym piętrze, w dawnym strychu. Ściana od strony okna jest skośna, więc część pokoju ma niski sufit, a część sięga pod samą kalenicę. Okna w połaci dają światło z góry, a z lukarny widać dachy Starego Miasta.',
      'Jest tu miejsce na łóżko 180 centymetrów, biurko, sofę rozkładaną i stolik. Łazienka ma wannę i prysznic, a podłoga jest ogrzewana. W domu jest winda do czwartego piętra, więc schody nie są ceną za widok.',
    ],
    details: [
      { label: 'Powierzchnia', value: '46 m², część pod skosem' },
      { label: 'Łóżka', value: 'jedno 180 x 200 cm i sofa rozkładana' },
      { label: 'Osoby', value: 'do 3' },
      { label: 'Okna', value: 'trzy, w tym lukarna' },
      { label: 'Łazienka', value: 'wanna i prysznic' },
      { label: 'Liczba pokoi', value: '3 w całym domu' },
    ],
    amenities: ['Sofa rozkładana w części dziennej', 'Biurko', 'Winda do czwartego piętra'],
    goodFor:
      'Na dłuższy pobyt, dla trojga i dla tych, którzy lubią mieć w pokoju osobne miejsce do siedzenia.',
    planCaption:
      'Plan poddasza w skali. Lewa ściana jest skośna, część sypialna u góry planu, część dzienna z sofą poniżej.',
  },
};

const roomsEn: Record<RoomTypeId, RoomText> = {
  podworzowy: {
    name: 'Courtyard',
    summary: 'The quietest room in the house, window on the courtyard.',
    bed: '160 cm bed',
    view: 'courtyard',
    pageTitle: 'Courtyard room, 17 m², quiet, from PLN 340 | Przęsło',
    pageDescription:
      'The courtyard room at Przęsło hotel: 17 m², a 160 cm bed, a window on a quiet courtyard, a shower. Scale floor plan and a price from PLN 340 a night.',
    headline: 'A small room, well measured.',
    intro: [
      'The window looks onto the courtyard of the tenement. From the Grodzka side you hear only what comes through the gate, and after ten in the evening almost nothing. It is the quietest room in the house, which is why people who come for a conference or to sleep off a train journey choose it most often.',
      'The room is seventeen square metres and does not pretend to be more. The bed stands against the wall, the desk by the window, the wardrobe in an alcove by the door. The shower room is next to the hall, with a heated floor.',
    ],
    details: [
      { label: 'Size', value: '17 m²' },
      { label: 'Bed', value: 'one 160 x 200 cm bed' },
      { label: 'Guests', value: 'up to 2' },
      { label: 'Window', value: '160 cm, onto the courtyard' },
      { label: 'Bathroom', value: 'walk-in shower' },
      { label: 'Rooms of this kind', value: '7 in the house' },
    ],
    amenities: ['A desk by the window, sockets on both sides', 'Wardrobe with hangers and shelves'],
    goodFor: 'For one or two people who want quiet and do not need much space.',
    planCaption:
      'Scale floor plan of the courtyard room. The entrance is from the corridor on the right, the bathroom is in the top left corner, the window is in the bottom wall.',
  },
  klasyczny: {
    name: 'Classic',
    summary: 'Two windows, a 180 cm bed and an armchair for reading.',
    bed: '180 cm bed',
    view: 'street or courtyard',
    pageTitle: 'Classic room, 21 m², 180 cm bed, from PLN 420 | Przęsło',
    pageDescription:
      'The classic room at Przęsło hotel: 21 m², two windows, a 180 cm bed, a desk and an armchair. Scale floor plan and a price from PLN 420 a night.',
    headline: 'Two windows and an armchair.',
    intro: [
      'These tall rooms, with windows on the front and on the courtyard, got the most light of the whole house after the restoration. The ceilings are three metres twenty, so at twenty-one square metres you do not feel crowded.',
      'The bed is 180 centimetres wide, there is a desk with a lamp by the window and, in the corner, an armchair you can actually read in. The bathroom is separated by a hall, so the shower does not wake the other person.',
    ],
    details: [
      { label: 'Size', value: '21 m²' },
      { label: 'Bed', value: 'one 180 x 200 cm bed' },
      { label: 'Guests', value: 'up to 2' },
      { label: 'Windows', value: 'two, 100 cm each' },
      { label: 'Bathroom', value: 'walk-in shower' },
      { label: 'Rooms of this kind', value: '6 in the house' },
    ],
    amenities: [
      'A desk with a lamp',
      'An armchair with a reading light',
      'Wardrobe with hangers and shelves',
    ],
    goodFor: 'For a weekend for two and for a few nights on business.',
    planCaption:
      'Scale floor plan of the classic room. Bathroom and hall at the entrance, the room with two windows on the far side.',
  },
  nadrzeczny: {
    name: 'River view',
    summary: 'Large windows over the water, a bath and a 180 cm bed.',
    bed: '180 cm bed',
    view: 'the Oder',
    pageTitle: 'River view room, 25 m², bath, from PLN 520 | Przęsło',
    pageDescription:
      'The river view room at Przęsło hotel: 25 m², two large windows, a bath, a 180 cm bed. Scale floor plan and a price from PLN 520 a night.',
    headline: 'The river outside two windows.',
    intro: [
      'Five rooms on the water side. From the windows you see the river, the embankment on the other bank and the trees that hide the first trams in the morning. The windows are 160 centimetres wide, so in the daytime you do not need a lamp.',
      'There is a bath in the bathroom, and the bed is placed so that you see the water lying down. By the window there is a desk, in the corner an armchair. It is a room for a long conversation, an anniversary or a day with nowhere to hurry to.',
    ],
    details: [
      { label: 'Size', value: '25 m²' },
      { label: 'Bed', value: 'one 180 x 200 cm bed' },
      { label: 'Guests', value: 'up to 2' },
      { label: 'Windows', value: 'two, 160 cm each, onto the Oder' },
      { label: 'Bathroom', value: 'bath' },
      { label: 'Rooms of this kind', value: '5 in the house' },
    ],
    amenities: [
      'A bath with a wall-mounted mixer',
      'A desk by the window',
      'An armchair and a small table',
    ],
    goodFor: 'For couples and for anyone who comes to Wrocław for the river.',
    planCaption:
      'Scale floor plan of the river view room. Two large windows in the wall facing the river, a bathroom with a bath by the entrance.',
  },
  rodzinny: {
    name: 'Family',
    summary: 'Two rooms: a bedroom and a children’s room, up to four guests.',
    bed: '160 cm bed and two 90 cm beds',
    view: 'courtyard and street',
    pageTitle: 'Family room, 36 m², up to 4 guests, from PLN 640 | Przęsło',
    pageDescription:
      'The family room at Przęsło hotel: 36 m², two rooms, a 160 cm bed and two 90 cm beds, a bath and a shower. Scale floor plan and a price from PLN 640 a night.',
    headline: 'Two rooms and a door that closes.',
    intro: [
      'The family room is two rooms, each with its own door. The larger one has the adults’ bed and an armchair, the smaller one two 90 centimetre beds and a small table where the children draw while the adults drink coffee.',
      'The bathroom has both a bath and a shower, so there is no queue in the morning. If you travel with a baby, you get a cot at no charge, just tick it in the booking.',
    ],
    details: [
      { label: 'Size', value: '36 m²' },
      { label: 'Beds', value: 'one 160 x 200 cm and two 90 x 200 cm' },
      { label: 'Guests', value: 'up to 4' },
      { label: 'Windows', value: 'three, in both rooms' },
      { label: 'Bathroom', value: 'bath and shower' },
      { label: 'Rooms of this kind', value: '3 in the house' },
    ],
    amenities: [
      'Two rooms with separate doors',
      'A drawing table in the children’s room',
      'A cot at no charge',
    ],
    goodFor: 'For a family with two children and for four people who want their own door.',
    planCaption:
      'Scale floor plan of the family room. The adults’ bedroom on the left, the children’s room on the right, a bathroom with a bath and a shower at the entrance.',
  },
  poddasze: {
    name: 'Attic',
    summary: 'The top floor, sloping ceilings, a bath and a sofa bed.',
    bed: '180 cm bed and a sofa bed',
    view: 'the roofs of the Old Town',
    pageTitle: 'Attic room, 46 m², bath, sloping ceilings, from PLN 780 | Przęsło',
    pageDescription:
      'The attic at Przęsło hotel: 46 m² under sloping ceilings, a 180 cm bed, a sofa bed, a bath and a shower. Scale floor plan and a price from PLN 780 a night.',
    headline: 'The highest in the house, under the slope.',
    intro: [
      'Three rooms on the fourth floor, in the former loft. The wall on the window side slopes, so part of the room has a low ceiling and part reaches right up to the ridge. Roof windows bring light from above, and from the dormer you see the roofs of the Old Town.',
      'There is space for a 180 centimetre bed, a desk, a sofa bed and a small table. The bathroom has a bath and a shower, and the floor is heated. The house has a lift to the fourth floor, so the stairs are not the price of the view.',
    ],
    details: [
      { label: 'Size', value: '46 m², part under the slope' },
      { label: 'Beds', value: 'one 180 x 200 cm and a sofa bed' },
      { label: 'Guests', value: 'up to 3' },
      { label: 'Windows', value: 'three, including a dormer' },
      { label: 'Bathroom', value: 'bath and shower' },
      { label: 'Rooms of this kind', value: '3 in the house' },
    ],
    amenities: ['A sofa bed in the sitting area', 'A desk', 'A lift to the fourth floor'],
    goodFor:
      'For a longer stay, for three guests and for anyone who likes a separate place to sit in the room.',
    planCaption:
      'Scale floor plan of the attic. The left wall slopes, the sleeping area is at the top of the plan and the sitting area with the sofa below it.',
  },
};

export const roomText: Record<Lang, Record<RoomTypeId, RoomText>> = {
  pl: Object.fromEntries(
    Object.entries(roomsPl).map(([id, value]) => [id, tieDeep(value)]),
  ) as Record<RoomTypeId, RoomText>,
  en: Object.fromEntries(
    Object.entries(roomsEn).map(([id, value]) => [id, tieDeep(value)]),
  ) as Record<RoomTypeId, RoomText>,
};

const pagePl: RoomsPageText = {
  title: 'Pokoje: pięć rodzajów, plany w skali, ceny od 340 zł | Przęsło',
  description:
    'Pięć rodzajów pokoi w hotelu Przęsło we Wrocławiu: od 17 do 46 metrów, plany w skali, wyposażenie i ceny od 340 zł za noc.',
  heading: 'Pokoje',
  lead: `Dwadzieścia cztery pokoje na czterech piętrach, pięć rodzajów. Przy każdym znajdziesz plan narysowany w skali i cenę od. Cena zależy od dnia tygodnia i pory roku, dokładną zobaczysz w kalendarzu rezerwacji.`,
  rackHeading: 'Wybierz klucz',
  guestsLabel: count => (count === 1 ? 'osoba' : `do ${count} osób`),
  sizeLabel: 'm²',
  fromLabel: 'od',
  perNight: 'za noc',
  priceNote:
    'Cena od dotyczy nocy w dzień powszedni poza sezonem, w taryfie elastycznej, w złotych brutto.',
  openRoom: 'Zobacz pokój',
  commonHeading: 'W każdym pokoju',
  commonLead: 'To jest w cenie, niezależnie od rodzaju pokoju.',
  commonGroups: [
    { title: 'W pokoju', items: sharedAmenities.pl.slice(0, 6) },
    { title: 'W łazience', items: sharedAmenities.pl.slice(6) },
    {
      title: 'W domu',
      items: [
        'Recepcja codziennie od 7:00 do 22:00',
        'Winda do wszystkich pięter',
        'Bagażownia przed zameldowaniem i po wymeldowaniu',
        'Rowerownia na podwórzu',
      ],
    },
  ],
  compareHeading: 'Pokoje obok siebie',
  compareHead: {
    room: 'Pokój',
    size: 'Powierzchnia',
    guests: 'Osoby',
    bed: 'Łóżka',
    from: 'Cena od za noc',
  },
  planHeading: 'Plan pokoju',
  numbersLabel: 'Numery pokoi',
  planLegend:
    'Plan w skali. Wymiary w centymetrach, powierzchnia liczona razem z łazienką i przedpokojem. Numery na planie odpowiadają liście mebli pod nim.',
  bookRoom: 'Sprawdź terminy',
  checkDates: 'Sprawdź wolne terminy tego pokoju',
  otherRooms: 'Pozostałe pokoje',
  specHeading: 'Dane pokoju',
  amenitiesHeading: 'Wyposażenie tego pokoju',
  priceHeading: 'Ile kosztuje noc',
  priceLead:
    'Cena od to stawka za noc w dzień powszedni poza sezonem, bez żadnych zniżek. W innych dniach i porach roku zmienia się według stałych zasad:',
  priceRows: [
    { label: 'Piątek i sobota', factor: '+25 procent' },
    { label: 'Maj do września', factor: '+15 procent' },
    { label: 'Jarmark bożonarodzeniowy, 20 listopada do 23 grudnia', factor: '+18 procent' },
    { label: 'Sylwester', factor: '×1,9' },
    { label: 'Taryfa bezzwrotna', factor: '-10 procent' },
    { label: 'Pobyt od 5 nocy', factor: '-10 procent' },
    { label: 'Pobyt od 8 nocy', factor: '-15 procent' },
  ],
  breadcrumbRooms: 'Pokoje',
  breadcrumbHome: 'Start',
  breadcrumbLabel: 'Ścieżka',
  exampleHeading: 'Ceny w przykładowych dniach',
  exampleLead: 'Cena za jedną noc w złotych brutto, bez dodatków. Daty z 2027 roku jako przykłady.',
  exampleHead: { night: 'Noc', flexible: 'Taryfa elastyczna', nonRefundable: 'Taryfa bezzwrotna' },
  exampleNights: {
    weekday: 'Wtorek, 9 lutego',
    weekend: 'Piątek, 12 lutego',
    summerWeekday: 'Wtorek, 8 czerwca',
    summerWeekend: 'Piątek, 11 czerwca',
    market: 'Wtorek, 7 grudnia (jarmark)',
    newYearsEve: 'Piątek, 31 grudnia (Sylwester)',
  },
  cancelNote:
    'Taryfa elastyczna: odwołanie bez opłaty do 48 godzin przed przyjazdem. Taryfa bezzwrotna: 10 procent taniej, bez zwrotu.',
  planAlt: (name, size) => `Plan pokoju ${name} w skali, ${size} metrów kwadratowych`,
};

const pageEn: RoomsPageText = {
  title: 'Rooms: five kinds, scale plans, from PLN 340 | Przęsło',
  description:
    'Five kinds of room at Przęsło hotel in Wrocław: from 17 to 46 square metres, scale floor plans, what is in the room, and prices from PLN 340 a night.',
  heading: 'Rooms',
  lead: 'Twenty-four rooms on four floors, five kinds. Each has a floor plan drawn to scale and a from price. The price depends on the weekday and the season, and you see the exact figure in the booking calendar.',
  rackHeading: 'Choose a key',
  guestsLabel: count => (count === 1 ? 'guest' : `up to ${count} guests`),
  sizeLabel: 'm²',
  fromLabel: 'from',
  perNight: 'per night',
  priceNote:
    'The from price is for a weekday night outside the season, on the flexible rate, in złoty including VAT.',
  openRoom: 'See the room',
  commonHeading: 'In every room',
  commonLead: 'These come with the price, whichever kind of room you take.',
  commonGroups: [
    { title: 'In the room', items: sharedAmenities.en.slice(0, 6) },
    { title: 'In the bathroom', items: sharedAmenities.en.slice(6) },
    {
      title: 'In the house',
      items: [
        'Reception every day from 7:00 to 22:00',
        'A lift to all floors',
        'Luggage room before check-in and after check-out',
        'A bicycle room in the courtyard',
      ],
    },
  ],
  compareHeading: 'The rooms side by side',
  compareHead: {
    room: 'Room',
    size: 'Size',
    guests: 'Guests',
    bed: 'Beds',
    from: 'From per night',
  },
  planHeading: 'Floor plan',
  numbersLabel: 'Room numbers',
  planLegend:
    'Plan to scale. Dimensions in centimetres, the area counts the bathroom and the hall. The numbers on the plan match the list of furniture below it.',
  bookRoom: 'Check dates',
  checkDates: 'Check free dates for this room',
  otherRooms: 'The other rooms',
  specHeading: 'Room facts',
  amenitiesHeading: 'What is in this room',
  priceHeading: 'What a night costs',
  priceLead:
    'The from price is the rate for a weekday night outside the season, with no discounts. On other days and in other seasons it changes by fixed rules:',
  priceRows: [
    { label: 'Friday and Saturday', factor: '+25 percent' },
    { label: 'May to September', factor: '+15 percent' },
    { label: 'Christmas market, 20 November to 23 December', factor: '+18 percent' },
    { label: 'New Year’s Eve', factor: '×1.9' },
    { label: 'Non-refundable rate', factor: '-10 percent' },
    { label: 'Stay of 5 nights or more', factor: '-10 percent' },
    { label: 'Stay of 8 nights or more', factor: '-15 percent' },
  ],
  breadcrumbRooms: 'Rooms',
  breadcrumbHome: 'Home',
  breadcrumbLabel: 'Breadcrumb',
  exampleHeading: 'Prices on sample nights',
  exampleLead:
    'The price for one night in złoty including VAT, without extras. Dates in 2027 as examples.',
  exampleHead: { night: 'Night', flexible: 'Flexible rate', nonRefundable: 'Non-refundable rate' },
  exampleNights: {
    weekday: 'Tuesday, 9 February',
    weekend: 'Friday, 12 February',
    summerWeekday: 'Tuesday, 8 June',
    summerWeekend: 'Friday, 11 June',
    market: 'Tuesday, 7 December (Christmas market)',
    newYearsEve: 'Friday, 31 December (New Year\u2019s Eve)',
  },
  cancelNote:
    'Flexible rate: free cancellation until 48 hours before arrival. Non-refundable rate: 10 percent cheaper, no refund.',
  planAlt: (name, size) => `Scale floor plan of the ${name} room, ${size} square metres`,
};

export const roomsPage: Record<Lang, RoomsPageText> = { pl: tieDeep(pagePl), en: tieDeep(pageEn) };

export const hotelAddress = `${hotel.street}, ${hotel.postalCode} ${hotel.city}`;
