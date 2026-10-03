import type { ExtraId } from '../data/extras';
import type { Lang } from '../i18n/lang';
import type { StepId, StepProblem } from '../lib/flow';
import type { ArrivalWindow, FieldProblem } from '../lib/guest';
import type { RateId } from '../lib/pricing';
import { lowerFirst } from '../lib/format';
import type { CountUnits } from '../lib/format';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface ExtraText {
  name: string;
  help: string;
  unit: string;
}

export interface BookingText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  progressLabel: string;
  steps: Record<StepId, string>;
  stepCounter: (current: number, total: number) => string;
  next: Record<StepId, string>;
  back: string;
  problems: Record<StepProblem, string>;
  dates: { heading: string; lead: string };
  room: {
    heading: string;
    lead: string;
    roomLegend: string;
    rateLegend: string;
    freeOf: (free: number, total: number) => string;
    soldOut: string;
    tooSmall: (guests: number) => string;
    forStay: string;
    guestsUpTo: (count: number) => string;
    rates: Record<RateId, { name: string; text: (deadline: string) => string }>;
    cheaperBy: (amount: string) => string;
    seeRoom: string;
  };
  extras: {
    heading: string;
    lead: string;
    items: Record<ExtraId, ExtraText>;
    included: string;
    packageNote: string;
    free: string;
    less: (name: string) => string;
    more: (name: string) => string;
    count: string;
    perNight: string;
  };
  guest: {
    heading: string;
    lead: string;
    name: string;
    email: string;
    phone: string;
    phoneHint: string;
    arrivalWindow: string;
    arrivalWindowHint: string;
    windows: Record<ArrivalWindow, string>;
    notes: string;
    notesHint: string;
    notesCount: (used: number, max: number) => string;
    invoiceToggle: string;
    invoiceHeading: string;
    company: string;
    nip: string;
    nipHint: string;
    street: string;
    postalCode: string;
    postalHint: string;
    city: string;
    errors: Record<FieldProblem, string>;
    errorSummary: string;
    optional: string;
  };
  summary: {
    heading: string;
    lead: string;
    stay: string;
    guests: string;
    room: string;
    rate: string;
    guestHeading: string;
    invoiceHeading: string;
    priceHeading: string;
    accommodation: string;
    nightLine: (date: string) => string;
    longStay: (percent: number) => string;
    extrasHeading: string;
    packageLine: string;
    packageSaving: (amount: string) => string;
    total: string;
    vatNote: string;
    payment: Record<RateId, string>;
    withdrawal: string;
    confirm: string;
    edit: string;
    stayLine: (arrival: string, departure: string, nights: string) => string;
    roomLine: (name: string, size: number) => string;
  };
  done: {
    heading: string;
    lead: string;
    nothing: string;
    code: string;
    codeHint: string;
    keyHeading: string;
    keyLead: (number: number, name: string) => string;
    boardCaption: string;
    calendar: string;
    calendarHint: string;
    myBooking: string;
    again: string;
    stored: string;
    notStored: string;
    detailsHeading: string;
    arrivalNote: string;
  };
  aside: {
    heading: string;
    empty: string;
    dates: string;
    guests: string;
    room: string;
    extras: string;
    total: string;
    noRoom: string;
    includedInPackage: string;
  };
  countUnits: CountUnits;
}

const plExtras: Record<ExtraId, ExtraText> = {
  breakfast: {
    name: 'Śniadanie',
    help: 'Podawane od 7:30 do 10:30, w weekendy od 8:00 do 11:00. Cena za osobę za każdą noc pobytu.',
    unit: 'za osobę za dobę',
  },
  parking: {
    name: 'Parking',
    help: 'Zamknięty parking przy sąsiedniej ulicy, sześć miejsc dla gości hotelu.',
    unit: 'za dobę',
  },
  earlyCheckIn: {
    name: 'Wcześniejsze zameldowanie',
    help: 'Pokój będzie gotowy od 12:00 zamiast od 15:00.',
    unit: 'za pobyt',
  },
  lateCheckOut: {
    name: 'Późne wymeldowanie',
    help: 'Pokój możesz zająć do 14:00 zamiast do 11:00.',
    unit: 'za pobyt',
  },
  bike: {
    name: 'Rower miejski',
    help: 'Rower z koszykiem i zamkiem. Cena za rower za każdą dobę.',
    unit: 'za rower za dobę',
  },
  transfer: {
    name: 'Transfer z lotniska',
    help: 'Samochód z kierowcą z lotniska Wrocław do hotelu lub z hotelu na lotnisko. Cena za przejazd, do dwóch przejazdów.',
    unit: 'za przejazd',
  },
  welcomeSet: {
    name: 'Zestaw powitalny',
    help: 'Butelka wina albo soku tłoczonego, deska serów i ciastka z piekarni przy ulicy. Czeka w pokoju.',
    unit: 'za pobyt',
  },
  pet: {
    name: 'Zwierzę',
    help: 'Pies lub kot do 15 kg, do dwóch zwierząt. Miska i posłanie w pokoju.',
    unit: 'za zwierzę za pobyt',
  },
  cot: {
    name: 'Łóżeczko dziecięce',
    help: 'Łóżeczko dla dziecka do trzech lat, ustawione w pokoju przed przyjazdem.',
    unit: 'bez opłaty',
  },
};

const enExtras: Record<ExtraId, ExtraText> = {
  breakfast: {
    name: 'Breakfast',
    help: 'Served from 7:30 to 10:30, at weekends from 8:00 to 11:00. The price is per person for every night of the stay.',
    unit: 'per person per day',
  },
  parking: {
    name: 'Parking',
    help: 'A closed car park on the next street, six places for hotel guests.',
    unit: 'per day',
  },
  earlyCheckIn: {
    name: 'Early check-in',
    help: 'Your room will be ready from 12:00 instead of 15:00.',
    unit: 'per stay',
  },
  lateCheckOut: {
    name: 'Late check-out',
    help: 'You can keep the room until 14:00 instead of 11:00.',
    unit: 'per stay',
  },
  bike: {
    name: 'City bike',
    help: 'A bike with a basket and a lock. The price is per bike for every day.',
    unit: 'per bike per day',
  },
  transfer: {
    name: 'Airport transfer',
    help: 'A car with a driver from Wrocław airport to the hotel or from the hotel to the airport. The price is per ride, up to two rides.',
    unit: 'per ride',
  },
  welcomeSet: {
    name: 'Welcome set',
    help: 'A bottle of wine or pressed juice, a cheese board and biscuits from the bakery on the street. Waiting in the room.',
    unit: 'per stay',
  },
  pet: {
    name: 'Pet',
    help: 'A dog or cat up to 15 kg, up to two animals. A bowl and a bed in the room.',
    unit: 'per animal per stay',
  },
  cot: {
    name: 'Cot',
    help: 'A cot for a child under three, set up in the room before you arrive.',
    unit: 'no charge',
  },
};

const pl: BookingText = {
  title: 'Rezerwacja pokoju: daty, pokój, dodatki | Przęsło',
  description:
    'Zarezerwuj pokój w hotelu Przęsło we Wrocławiu: wybierz dni w kalendarzu z cenami, rodzaj pokoju i taryfę, dodatki i poznaj pełną cenę przed rezerwacją.',
  heading: 'Rezerwacja',
  lead: 'Pięć kroków: termin, pokój, dodatki, dane i podsumowanie. Pełną cenę widzisz przez cały czas po prawej.',
  progressLabel: 'Kroki rezerwacji',
  steps: {
    dates: 'Termin',
    room: 'Pokój',
    extras: 'Dodatki',
    guest: 'Dane',
    summary: 'Podsumowanie',
  },
  stepCounter: (current, total) => `Krok ${current} z ${total}`,
  next: {
    dates: 'Dalej: wybierz pokój',
    room: 'Dalej: dodatki',
    extras: 'Dalej: dane gościa',
    guest: 'Dalej: podsumowanie',
    summary: 'Rezerwuję z obowiązkiem zapłaty',
  },
  back: 'Wstecz',
  problems: {
    missingDates: 'Wybierz dzień przyjazdu i dzień wyjazdu.',
    unavailable: 'W wybranych dniach nie ma wolnego pokoju dla tej liczby osób. Zmień daty.',
    missingRoom: 'Wybierz rodzaj pokoju.',
    guestInvalid: 'Popraw zaznaczone pola.',
    invoiceInvalid: 'Popraw dane do faktury.',
  },
  dates: {
    heading: 'Termin i liczba osób',
    lead: 'W każdym dniu widzisz najniższą cenę za noc. Pobyt z nocą z piątku na sobotę albo z soboty na niedzielę trwa co najmniej dwie noce.',
  },
  room: {
    heading: 'Pokój i taryfa',
    lead: 'Wybierz rodzaj pokoju. Numer klucza dostaniesz w potwierdzeniu.',
    roomLegend: 'Rodzaj pokoju',
    rateLegend: 'Taryfa',
    freeOf: (free, total) => `wolne ${free} z ${total}`,
    soldOut: 'wyprzedane na te dni',
    tooSmall: guests => `za mały dla ${guests} os.`,
    forStay: 'za cały pobyt',
    guestsUpTo: count => `do ${count} os.`,
    rates: {
      flexible: {
        name: 'Elastyczna',
        text: deadline => `Odwołasz bez opłaty do ${deadline}. Później pobieramy pierwszą noc.`,
      },
      nonRefundable: {
        name: 'Bezzwrotna',
        text: () =>
          'Cena niższa o 10 procent. Płatna w całości, bez zwrotu przy odwołaniu lub nieprzyjeździe.',
      },
    },
    cheaperBy: amount => `taniej o ${amount}`,
    seeRoom: 'Plan i opis pokoju',
  },
  extras: {
    heading: 'Dodatki',
    lead: 'Wszystko jest dobrowolne. Dodatki możesz też zmienić później na stronie Moja rezerwacja.',
    items: plExtras,
    included: 'w pakiecie',
    packageNote:
      'Pakiet weekendowy już zawiera śniadania dla wszystkich gości, późne wymeldowanie i zestaw powitalny.',
    free: 'bez opłaty',
    less: name => `${name}: mniej`,
    more: name => `${name}: więcej`,
    count: 'Liczba',
    perNight: 'za dobę',
  },
  guest: {
    heading: 'Dane gościa',
    lead: 'Potrzebujemy tylko tego, co jest potrzebne do przyjęcia gościa. Nic nie jest wysyłane, to strona przykładowa.',
    name: 'Imię i nazwisko',
    email: 'Adres e-mail',
    phone: 'Telefon',
    phoneHint: 'Na wypadek, gdyby recepcja musiała się z Tobą skontaktować.',
    arrivalWindow: 'Planowana godzina przyjazdu',
    arrivalWindowHint: 'Recepcja jest czynna od 7:00 do 22:00. Po 22:00 umówimy się na telefon.',
    windows: {
      '': 'Jeszcze nie wiem',
      afternoon: '15:00 do 18:00',
      evening: '18:00 do 22:00',
      night: 'Po 22:00, proszę o kontakt',
      late: 'Przyjadę przed 15:00, zostawię bagaż',
    },
    notes: 'Uwagi do rezerwacji',
    notesHint: 'Na przykład: cicha strona, wysokie piętro, alergia, rocznica.',
    notesCount: (used, max) => `${used} z ${max} znaków`,
    invoiceToggle: 'Chcę fakturę na firmę',
    invoiceHeading: 'Dane do faktury',
    company: 'Nazwa firmy',
    nip: 'NIP',
    nipHint: 'Dziesięć cyfr, z kreskami lub bez. Sprawdzamy sumę kontrolną.',
    street: 'Ulica i numer',
    postalCode: 'Kod pocztowy',
    postalHint: 'W formacie 00-000.',
    city: 'Miejscowość',
    errors: {
      required: 'To pole jest wymagane.',
      invalidName: 'Wpisz imię i nazwisko.',
      invalidEmail: 'Wpisz adres e-mail w formacie nazwa@domena.pl.',
      invalidPhone: 'Wpisz numer telefonu, na przykład +48 71 000 00 08.',
      invalidNip: 'Ten NIP jest nieprawidłowy. Sprawdź cyfry.',
      invalidPostalCode: 'Wpisz kod w formacie 00-000.',
      tooLong: 'Ta wartość jest za długa.',
    },
    errorSummary: 'Popraw te pola, żeby przejść dalej:',
    optional: 'opcjonalnie',
  },
  summary: {
    heading: 'Podsumowanie',
    lead: 'Sprawdź wszystko przed rezerwacją. Kwoty są w złotych brutto.',
    stay: 'Termin',
    guests: 'Goście',
    room: 'Pokój',
    rate: 'Taryfa',
    guestHeading: 'Gość',
    invoiceHeading: 'Faktura',
    priceHeading: 'Cena',
    accommodation: 'Nocleg',
    nightLine: date => `Noc z ${date}`,
    longStay: percent => `Zniżka za długi pobyt, ${percent} procent`,
    extrasHeading: 'Dodatki',
    packageLine: 'Pakiet weekendowy: śniadania, późne wymeldowanie, zestaw powitalny',
    packageSaving: amount => `Oszczędzasz ${amount} w porównaniu z osobnymi cenami.`,
    total: 'Razem do zapłaty',
    vatNote: 'Ceny zawierają podatek VAT.',
    payment: {
      flexible: 'Płacisz w hotelu przy wymeldowaniu, kartą albo gotówką.',
      nonRefundable: 'Link do płatności dostaniesz w wiadomości e-mail po rezerwacji.',
    },
    withdrawal:
      'Prawo odstąpienia od umowy w ciągu 14 dni nie przysługuje przy usłudze noclegowej w ustalonym terminie (art. 38 pkt 12 ustawy o prawach konsumenta). Zasady odwołania podajemy przy taryfie.',
    confirm: 'Rezerwuję z obowiązkiem zapłaty',
    edit: 'Zmień',
    stayLine: (arrival, departure, nights) => `${arrival} do ${departure}, ${nights}`,
    roomLine: (name, size) => `${name}, ${size} m²`,
  },
  done: {
    heading: 'Rezerwacja gotowa',
    lead: 'Oto Twój klucz. Poniżej kod rezerwacji i plik do kalendarza.',
    nothing: 'To strona przykładowa, więc nic nie zostało zarezerwowane ani pobrane z karty.',
    code: 'Kod rezerwacji',
    codeHint: 'Podaj go w recepcji albo wpisz na stronie Moja rezerwacja.',
    keyHeading: 'Twój klucz',
    keyLead: (number, name) => `Pokój ${number}, ${lowerFirst(name)}.`,
    boardCaption: 'Tablica recepcji w dniach Twojego pobytu',
    calendar: 'Dodaj do kalendarza (.ics)',
    calendarHint: 'Pobierzesz plik z całodniowym wydarzeniem od dnia przyjazdu do dnia wyjazdu.',
    myBooking: 'Zobacz moją rezerwację',
    again: 'Zrób kolejną rezerwację',
    stored:
      'Rezerwacja jest zapisana w tej przeglądarce, więc znajdziesz ją na stronie Moja rezerwacja.',
    notStored:
      'Ta przeglądarka nie pozwala zapisać rezerwacji, więc strona Moja rezerwacja jej nie pokaże. Zapisz kod.',
    detailsHeading: 'Szczegóły',
    arrivalNote: `Zameldowanie od ${hotel.checkIn}, wymeldowanie do ${hotel.checkOut}.`,
  },
  aside: {
    heading: 'Twoja rezerwacja',
    empty: 'Wybierz daty, a pokażemy cenę.',
    dates: 'Termin',
    guests: 'Goście',
    room: 'Pokój',
    extras: 'Dodatki',
    total: 'Razem',
    noRoom: 'Jeszcze nie wybrano',
    includedInPackage: 'w pakiecie',
  },
  countUnits: { persons: 'os.', pieces: 'szt.' },
};

const en: BookingText = {
  title: 'Book a room: dates, room, extras | Przęsło',
  description:
    'Book a room at Przęsło hotel in Wrocław: pick your days on a calendar with prices, choose a room type and a rate, add extras and see the full price before you book.',
  heading: 'Booking',
  lead: 'Five steps: dates, room, extras, details and summary. The full price is on the right the whole time.',
  progressLabel: 'Booking steps',
  steps: {
    dates: 'Dates',
    room: 'Room',
    extras: 'Extras',
    guest: 'Details',
    summary: 'Summary',
  },
  stepCounter: (current, total) => `Step ${current} of ${total}`,
  next: {
    dates: 'Next: choose a room',
    room: 'Next: extras',
    extras: 'Next: guest details',
    guest: 'Next: summary',
    summary: 'Book with obligation to pay',
  },
  back: 'Back',
  problems: {
    missingDates: 'Choose an arrival day and a departure day.',
    unavailable: 'No room is free for this party on the chosen days. Change the dates.',
    missingRoom: 'Choose a room type.',
    guestInvalid: 'Correct the marked fields.',
    invoiceInvalid: 'Correct the invoice details.',
  },
  dates: {
    heading: 'Dates and guests',
    lead: 'Each day shows the lowest price for a night. A stay that includes a Friday or Saturday night lasts at least two nights.',
  },
  room: {
    heading: 'Room and rate',
    lead: 'Choose a room type. You get your key number in the confirmation.',
    roomLegend: 'Room type',
    rateLegend: 'Rate',
    freeOf: (free, total) => `${free} of ${total} free`,
    soldOut: 'sold out for these days',
    tooSmall: guests => `too small for ${guests}`,
    forStay: 'for the whole stay',
    guestsUpTo: count => `up to ${count}`,
    rates: {
      flexible: {
        name: 'Flexible',
        text: deadline =>
          `Cancel for free until ${deadline}. After that we charge the first night.`,
      },
      nonRefundable: {
        name: 'Non-refundable',
        text: () =>
          'A price 10 percent lower. Paid in full, no refund if you cancel or do not arrive.',
      },
    },
    cheaperBy: amount => `${amount} cheaper`,
    seeRoom: 'Floor plan and description',
  },
  extras: {
    heading: 'Extras',
    lead: 'Everything is optional. You can also change extras later on the My booking page.',
    items: enExtras,
    included: 'in the package',
    packageNote:
      'The weekend package already includes breakfast for every guest, late check-out and a welcome set.',
    free: 'no charge',
    less: name => `${name}: fewer`,
    more: name => `${name}: more`,
    count: 'Quantity',
    perNight: 'per day',
  },
  guest: {
    heading: 'Guest details',
    lead: 'We ask only for what we need to receive a guest. Nothing is sent, this is a sample website.',
    name: 'Full name',
    email: 'E-mail address',
    phone: 'Phone',
    phoneHint: 'In case reception needs to reach you.',
    arrivalWindow: 'Planned arrival time',
    arrivalWindowHint: 'Reception is open from 7:00 to 22:00. After 22:00 we arrange a phone call.',
    windows: {
      '': 'I do not know yet',
      afternoon: '15:00 to 18:00',
      evening: '18:00 to 22:00',
      night: 'After 22:00, please contact me',
      late: 'I arrive before 15:00 and will leave my luggage',
    },
    notes: 'Notes for the booking',
    notesHint: 'For example: quiet side, a high floor, an allergy, an anniversary.',
    notesCount: (used, max) => `${used} of ${max} characters`,
    invoiceToggle: 'I want an invoice for a company',
    invoiceHeading: 'Invoice details',
    company: 'Company name',
    nip: 'Tax number (NIP)',
    nipHint: 'Ten digits, with or without dashes. We check the control sum.',
    street: 'Street and number',
    postalCode: 'Postal code',
    postalHint: 'In the format 00-000.',
    city: 'City',
    errors: {
      required: 'This field is required.',
      invalidName: 'Enter your first and last name.',
      invalidEmail: 'Enter an e-mail address like name@domain.com.',
      invalidPhone: 'Enter a phone number, for example +48 71 000 00 08.',
      invalidNip: 'This NIP is not valid. Check the digits.',
      invalidPostalCode: 'Enter a code in the format 00-000.',
      tooLong: 'This value is too long.',
    },
    errorSummary: 'Correct these fields to continue:',
    optional: 'optional',
  },
  summary: {
    heading: 'Summary',
    lead: 'Check everything before you book. Amounts are in złoty including VAT.',
    stay: 'Dates',
    guests: 'Guests',
    room: 'Room',
    rate: 'Rate',
    guestHeading: 'Guest',
    invoiceHeading: 'Invoice',
    priceHeading: 'Price',
    accommodation: 'Accommodation',
    nightLine: date => `Night of ${date}`,
    longStay: percent => `Long stay discount, ${percent} percent`,
    extrasHeading: 'Extras',
    packageLine: 'Weekend package: breakfast, late check-out, welcome set',
    packageSaving: amount => `You save ${amount} compared with the separate prices.`,
    total: 'Total to pay',
    vatNote: 'Prices include VAT.',
    payment: {
      flexible: 'You pay at the hotel when you check out, by card or in cash.',
      nonRefundable: 'You get a payment link by e-mail after booking.',
    },
    withdrawal:
      'The 14-day right of withdrawal does not apply to accommodation for a fixed date (Polish consumer rights act, art. 38 point 12). The cancellation rules are stated with the rate.',
    confirm: 'Book with obligation to pay',
    edit: 'Change',
    stayLine: (arrival, departure, nights) => `${arrival} to ${departure}, ${nights}`,
    roomLine: (name, size) => `${name}, ${size} m²`,
  },
  done: {
    heading: 'Booking ready',
    lead: 'Here is your key. Below are your booking code and a file for your calendar.',
    nothing: 'This is a sample website, so nothing was booked or charged to a card.',
    code: 'Booking code',
    codeHint: 'Give it at reception or enter it on the My booking page.',
    keyHeading: 'Your key',
    keyLead: (number, name) => `Room ${number}, ${lowerFirst(name)}.`,
    boardCaption: 'The reception board on the days of your stay',
    calendar: 'Add to calendar (.ics)',
    calendarHint: 'You download a file with an all-day event from arrival to departure.',
    myBooking: 'See your booking',
    again: 'Make another booking',
    stored: 'The booking is saved in this browser, so you will find it on the My booking page.',
    notStored:
      'This browser does not allow saving the booking, so the My booking page will not show it. Note the code.',
    detailsHeading: 'Details',
    arrivalNote: `Check-in from ${hotel.checkIn}, check-out until ${hotel.checkOut}.`,
  },
  aside: {
    heading: 'Your booking',
    empty: 'Choose dates and we show the price.',
    dates: 'Dates',
    guests: 'Guests',
    room: 'Room',
    extras: 'Extras',
    total: 'Total',
    noRoom: 'Not chosen yet',
    includedInPackage: 'in the package',
  },
  countUnits: { persons: 'guests', pieces: 'pcs' },
};

export const bookingText: Record<Lang, BookingText> = { pl: tieDeep(pl), en: tieDeep(en) };
