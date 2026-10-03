import type { Lang } from '../i18n/lang';
import type { DayBlock } from '../lib/range';
import { tieDeep } from '../lib/typography';

export interface PickerText {
  datesHeading: string;
  guestsLabel: string;
  guestsLess: string;
  guestsMore: string;
  monthPrevious: string;
  monthNext: string;
  gridHint: string;
  legendFree: string;
  legendSelected: string;
  legendSoldOut: string;
  legendUnavailable: string;
  legendRule: string;
  legendToday: string;
  ruleNote: string;
  ruleShort: string;
  soldOutShort: string;
  priceNote: string;
  arrival: string;
  departure: string;
  stay: string;
  nothingYet: string;
  pickArrival: string;
  pickDeparture: string;
  fromPerNight: string;
  clear: string;
  cta: string;
  ctaIdle: string;
  ctaIdleNote: string;
  roleArrival: string;
  roleDeparture: string;
  roleInside: string;
  perNight: string;
  packageLabel: string;
  packageHint: string;
  guestsHint: string;
  monthLabel: string;
  stayLine: (arrival: string, departure: string, nights: string, guests: string) => string;
  blocks: Record<DayBlock, string>;
  board: {
    heading: string;
    tonight: string;
    yourStay: string;
    freeCount: (free: number, total: number) => string;
    freeKey: string;
    takenKey: string;
    tooSmall: (guests: number) => string;
    rowCount: (free: number, total: number) => string;
    rowNames: Record<string, string>;
    explainer: string;
    room: string;
  };
}

const pl: PickerText = {
  datesHeading: 'Wybierz dni pobytu',
  guestsLabel: 'Liczba osób',
  guestsLess: 'Mniej osób',
  guestsMore: 'Więcej osób',
  monthPrevious: 'Poprzedni miesiąc',
  monthNext: 'Następny miesiąc',
  gridHint: 'Strzałki zmieniają dzień, Page Up i Page Down zmieniają miesiąc, Enter wybiera dzień.',
  legendFree: 'cena od za noc',
  legendSelected: 'wybrany pobyt',
  legendSoldOut: 'wyprzedane',
  legendUnavailable: 'niedostępne',
  legendRule: 'wyłączone przez zasadę pobytu',
  legendToday: 'dziś',
  ruleNote:
    'Pobyt z nocą z piątku na sobotę albo z soboty na niedzielę trwa co najmniej dwie noce. Dni, które to wykluczają, są obrysowane kropkami.',
  ruleShort: 'min. 2',
  soldOutShort: 'brak',
  priceNote:
    'W polu dnia jest najniższa cena za noc w pokoju, który pomieści wybraną liczbę osób, w złotych.',
  arrival: 'Przyjazd',
  departure: 'Wyjazd',
  stay: 'Pobyt',
  nothingYet: 'jeszcze nie wybrano',
  pickArrival: 'Wybierz dzień przyjazdu.',
  pickDeparture: 'Teraz wybierz dzień wyjazdu.',
  fromPerNight: 'od',
  clear: 'Wyczyść daty',
  cta: 'Wybierz pokój',
  ctaIdle: 'Wybierz daty',
  ctaIdleNote: 'Najpierw wybierz dzień przyjazdu i dzień wyjazdu.',
  roleArrival: 'przyjazd',
  roleDeparture: 'wyjazd',
  roleInside: 'w wybranym pobycie',
  perNight: 'za noc',
  packageLabel: 'Pakiet weekendowy',
  packageHint: 'Dwie noce od piątku, śniadania, późne wymeldowanie i zestaw powitalny.',
  guestsHint: 'Pokoje mieszczą od 2 do 4 osób.',
  monthLabel: 'Miesiąc',
  stayLine: (arrival, departure, nights, guests) =>
    `Przyjazd ${arrival}, wyjazd ${departure}, ${nights}, ${guests}.`,
  blocks: {
    past: 'Ten dzień już minął.',
    beyondHorizon: 'Przyjmujemy rezerwacje na 365 dni od dziś.',
    soldOut: 'Na tę noc nie ma wolnego pokoju dla wybranej liczby osób.',
    noStay: 'Od tego dnia nie da się ułożyć pobytu, bo następna noc jest zajęta.',
    tooShort:
      'Pobyt z nocą z piątku na sobotę albo z soboty na niedzielę trwa co najmniej dwie noce.',
    tooLong: 'Najdłuższy pobyt to 30 nocy.',
    unavailable: 'W tym czasie nie ma pokoju wolnego przez cały pobyt.',
    packageFriday: 'Pakiet weekendowy zaczyna się w piątek.',
    packageNights: 'Pakiet weekendowy trwa dwie noce.',
  },
  board: {
    heading: 'Tablica recepcji',
    tonight: 'Dzisiejsza noc',
    yourStay: 'Twój pobyt',
    freeCount: (free, total) => `Wolnych pokoi: ${free} z ${total}`,
    freeKey: 'wolny, klucz wisi',
    takenKey: 'zajęty, hak pusty',
    tooSmall: guests => `za mały dla ${guests} os.`,
    rowCount: (free, total) => `wolne ${free} z ${total}`,
    rowNames: {
      podworzowy: 'Podwórzowy',
      klasyczny: 'Klasyczny',
      nadrzeczny: 'Z widokiem na Odrę',
      rodzinny: 'Rodzinny',
      poddasze: 'Poddasze',
    },
    explainer:
      'Klucz wisi na haku, gdy pokój jest wolny przez wszystkie noce pobytu. Pusty hak oznacza pokój zajęty.',
    room: 'pokój',
  },
};

const en: PickerText = {
  datesHeading: 'Choose your dates',
  guestsLabel: 'Guests',
  guestsLess: 'Fewer guests',
  guestsMore: 'More guests',
  monthPrevious: 'Previous month',
  monthNext: 'Next month',
  gridHint:
    'Arrow keys change the day, Page Up and Page Down change the month, Enter selects a day.',
  legendFree: 'price from per night',
  legendSelected: 'selected stay',
  legendSoldOut: 'sold out',
  legendUnavailable: 'unavailable',
  legendRule: 'ruled out by the stay rule',
  legendToday: 'today',
  ruleNote:
    'A stay with a Friday or Saturday night lasts at least two nights. Days that this rules out have a dotted outline.',
  ruleShort: 'min. 2',
  soldOutShort: 'full',
  priceNote:
    'Each day shows the lowest nightly price for a room that fits your party, in Polish zloty.',
  arrival: 'Arrival',
  departure: 'Departure',
  stay: 'Stay',
  nothingYet: 'not chosen yet',
  pickArrival: 'Choose your arrival day.',
  pickDeparture: 'Now choose your departure day.',
  fromPerNight: 'from',
  clear: 'Clear dates',
  cta: 'Choose a room',
  ctaIdle: 'Choose dates',
  ctaIdleNote: 'Choose an arrival day and a departure day first.',
  roleArrival: 'arrival',
  roleDeparture: 'departure',
  roleInside: 'inside your stay',
  perNight: 'per night',
  packageLabel: 'Weekend package',
  packageHint: 'Two nights from Friday, breakfast, late check-out and a welcome set.',
  guestsHint: 'Rooms take 2 to 4 guests.',
  monthLabel: 'Month',
  stayLine: (arrival, departure, nights, guests) =>
    `Arrival ${arrival}, departure ${departure}, ${nights}, ${guests}.`,
  blocks: {
    past: 'This day has passed.',
    beyondHorizon: 'We take bookings 365 days ahead.',
    soldOut: 'No room that fits your party is free on this night.',
    noStay: 'No stay can start on this day because the next night is taken.',
    tooShort: 'A stay that includes a Friday or Saturday night lasts at least two nights.',
    tooLong: 'The longest stay is 30 nights.',
    unavailable: 'No room is free for the whole stay.',
    packageFriday: 'The weekend package starts on a Friday.',
    packageNights: 'The weekend package lasts two nights.',
  },
  board: {
    heading: 'Reception board',
    tonight: 'Tonight',
    yourStay: 'Your stay',
    freeCount: (free, total) => `Free rooms: ${free} of ${total}`,
    freeKey: 'free, key is hanging',
    takenKey: 'taken, hook is empty',
    tooSmall: guests => `too small for ${guests}`,
    rowCount: (free, total) => `${free} of ${total} free`,
    rowNames: {
      podworzowy: 'Courtyard',
      klasyczny: 'Classic',
      nadrzeczny: 'River view',
      rodzinny: 'Family',
      poddasze: 'Attic',
    },
    explainer:
      'A key hangs on its hook when the room is free for every night of the stay. An empty hook means the room is taken.',
    room: 'room',
  },
};

export const pickerText: Record<Lang, PickerText> = { pl: tieDeep(pl), en: tieDeep(en) };
