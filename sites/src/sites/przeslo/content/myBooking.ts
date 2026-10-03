import type { Lang } from '../i18n/lang';
import type { BookingStatus } from '../lib/booking';
import { lowerFirst } from '../lib/format';
import type { LookupProblem } from '../lib/lookup';
import { tieDeep } from '../lib/typography';

export interface MyBookingText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  lookup: {
    heading: string;
    code: string;
    codeHint: string;
    email: string;
    submit: string;
    problems: Record<LookupProblem, string>;
    errorSummary: string;
    sampleHeading: string;
    sampleText: string;
    sampleButton: string;
    sampleFailed: string;
    storedFound: (code: string) => string;
    storedOpen: string;
    noStorage: string;
  };
  status: Record<BookingStatus, string>;
  statusLead: Record<BookingStatus, string>;
  code: string;
  roomKey: (number: number, name: string) => string;
  detailsHeading: string;
  stayLine: (arrival: string, departure: string, nights: string) => string;
  guestsLine: (guests: string, room: string, size: number) => string;
  rate: string;
  guestHeading: string;
  priceHeading: string;
  calendar: string;
  extrasHeading: string;
  extrasLead: string;
  extrasLocked: string;
  packageToggle: string;
  packageHint: string;
  packageUnavailable: string;
  extraChange: (difference: string) => string;
  extraNoChange: string;
  saveExtras: string;
  extrasSaved: string;
  cancelHeading: string;
  cancelLead: string;
  outcome: {
    free: string;
    firstNight: (amount: string) => string;
    nonRefundable: (amount: string) => string;
  };
  outcomeDone: {
    free: string;
    firstNight: (amount: string) => string;
    nonRefundable: (amount: string) => string;
  };
  cancelStart: string;
  cancelConfirm: string;
  cancelKeep: string;
  cancelledNotice: (when: string) => string;
  cancelledNothing: string;
  cancelledOriginalTotal: string;
  cancelledDue: (amount: string) => string;
  rebook: string;
  forget: string;
  forgetHint: string;
  forgotten: string;
}

const pl: MyBookingText = {
  title: 'Moja rezerwacja | Przęsło',
  description:
    'Sprawdź swoją rezerwację w Przęśle: dodaj śniadania lub parking, pobierz plik do kalendarza albo anuluj pobyt. Strona przykładowa.',
  heading: 'Moja rezerwacja',
  lead: 'Wpisz kod rezerwacji i adres e-mail z formularza. Dodasz dodatki, pobierzesz plik do kalendarza albo anulujesz pobyt.',
  lookup: {
    heading: 'Znajdź rezerwację',
    code: 'Kod rezerwacji',
    codeHint: 'Wygląda tak: PRZ-7K4M9Q. Podaliśmy go po rezerwacji.',
    email: 'Adres e-mail z rezerwacji',
    submit: 'Pokaż rezerwację',
    problems: {
      codeRequired: 'Wpisz kod rezerwacji.',
      emailRequired: 'Wpisz adres e-mail z rezerwacji.',
      notFound:
        'Nie znaleźliśmy w tej przeglądarce rezerwacji z tym kodem i adresem e-mail. Sprawdź oba pola.',
    },
    errorSummary: 'Popraw te pola, żeby zobaczyć rezerwację:',
    sampleHeading: 'Nie masz jeszcze rezerwacji?',
    sampleText:
      'Zrób ją na stronie Rezerwacja, a zapisze się w tej przeglądarce. Możesz też wczytać gotowy przykład i od razu wypróbować zmiany.',
    sampleButton: 'Wczytaj przykładową rezerwację',
    sampleFailed: 'Nie udało się przygotować przykładu. Spróbuj jeszcze raz.',
    storedFound: code => `W tej przeglądarce jest zapisana rezerwacja ${code}.`,
    storedOpen: 'Otwórz ją',
    noStorage:
      'Ta przeglądarka nie pozwala zapisywać danych, więc rezerwacje nie przetrwają odświeżenia strony.',
  },
  status: {
    upcoming: 'Przed pobytem',
    underway: 'Pobyt trwa',
    finished: 'Po pobycie',
    cancelled: 'Anulowana',
  },
  statusLead: {
    upcoming: 'Czekamy na Ciebie. Do zameldowania możesz jeszcze zmienić dodatki.',
    underway:
      'Jesteś u nas. Dodatki można zmienić tylko przed przyjazdem, resztę ustal w recepcji.',
    finished: 'Pobyt się skończył. Rezerwacja zostaje tu do wglądu.',
    cancelled: 'Ta rezerwacja jest anulowana.',
  },
  code: 'Kod rezerwacji',
  roomKey: (number, name) => `Klucz do pokoju ${number}, ${lowerFirst(name)}`,
  detailsHeading: 'Szczegóły pobytu',
  stayLine: (arrival, departure, nights) => `${arrival} do ${departure}, ${nights}`,
  guestsLine: (guests, room, size) => `${guests}, ${lowerFirst(room)}, ${size} m²`,
  rate: 'Taryfa',
  guestHeading: 'Gość',
  priceHeading: 'Cena',
  calendar: 'Dodaj do kalendarza (.ics)',
  extrasHeading: 'Dodatki',
  extrasLead: 'Zmień liczbę dodatków i zapisz. Nowa cena pojawi się niżej.',
  extrasLocked: 'Dodatki można zmieniać do dnia przyjazdu, jeśli rezerwacja nie jest anulowana.',
  packageToggle: 'Pakiet weekendowy',
  packageHint: 'Dwie noce od piątku, śniadania, późne wymeldowanie i zestaw powitalny.',
  packageUnavailable: 'Pakiet weekendowy dotyczy tylko dwóch nocy od piątku.',
  extraChange: difference => `Zmiana ceny: ${difference}`,
  extraNoChange: 'Cena bez zmian.',
  saveExtras: 'Zapisz zmiany',
  extrasSaved: 'Zmiany zapisane. Cena jest już zaktualizowana.',
  cancelHeading: 'Anulowanie',
  cancelLead: 'Zasady zależą od taryfy wybranej przy rezerwacji.',
  outcome: {
    free: `Anulujesz bez opłaty. Termin bezpłatnego anulowania jeszcze nie minął.`,
    firstNight: amount => `Termin bezpłatnego anulowania minął. Pobieramy pierwszą noc: ${amount}.`,
    nonRefundable: amount => `Taryfa bezzwrotna: przy anulowaniu płacisz całość pobytu, ${amount}.`,
  },
  outcomeDone: {
    free: 'Anulowanie bez opłaty.',
    firstNight: amount => `Anulowanie po terminie. Pierwsza noc do zapłaty: ${amount}.`,
    nonRefundable: amount => `Taryfa bezzwrotna. Do zapłaty cały pobyt: ${amount}.`,
  },
  cancelStart: 'Anuluj rezerwację',
  cancelConfirm: 'Tak, anuluj',
  cancelKeep: 'Zostaw rezerwację',
  cancelledNotice: when => `Rezerwacja anulowana: ${when}.`,
  cancelledNothing: 'To strona przykładowa, więc nic nie zostało pobrane ani zwrócone.',
  cancelledOriginalTotal: 'Cena przed anulowaniem',
  cancelledDue: amount => `Do zapłaty po anulowaniu: ${amount}`,
  rebook: 'Zarezerwuj ponownie',
  forget: 'Usuń rezerwację z tej przeglądarki',
  forgetHint: 'Usuwa tylko kopię zapisaną tutaj. Nie ma serwera, który trzymałby rezerwacje.',
  forgotten: 'Rezerwacja usunięta z tej przeglądarki.',
};

const en: MyBookingText = {
  title: 'My booking | Przęsło',
  description:
    'Check your booking at Przęsło: add breakfasts or parking, download a calendar file or cancel the stay. Sample website.',
  heading: 'My booking',
  lead: 'Enter the booking code and the e-mail address from the form. You can add extras, download a calendar file or cancel the stay.',
  lookup: {
    heading: 'Find a booking',
    code: 'Booking code',
    codeHint: 'It looks like this: PRZ-7K4M9Q. You got it after booking.',
    email: 'E-mail address used for the booking',
    submit: 'Show booking',
    problems: {
      codeRequired: 'Enter the booking code.',
      emailRequired: 'Enter the e-mail address used for the booking.',
      notFound:
        'This browser holds no booking with this code and e-mail address. Check both fields.',
    },
    errorSummary: 'Fix these fields to see the booking:',
    sampleHeading: 'No booking yet?',
    sampleText:
      'Make one on the Booking page and it is saved in this browser. Or load a ready example and try the changes straight away.',
    sampleButton: 'Load a sample booking',
    sampleFailed: 'The example could not be prepared. Try again.',
    storedFound: code => `This browser holds booking ${code}.`,
    storedOpen: 'Open it',
    noStorage:
      'This browser does not allow storing data, so bookings will not survive a page refresh.',
  },
  status: {
    upcoming: 'Before the stay',
    underway: 'Stay in progress',
    finished: 'After the stay',
    cancelled: 'Cancelled',
  },
  statusLead: {
    upcoming: 'We are expecting you. You can still change the extras before check-in.',
    underway: 'You are staying with us. Extras can only change before arrival, ask at reception.',
    finished: 'The stay is over. The booking stays here for reference.',
    cancelled: 'This booking is cancelled.',
  },
  code: 'Booking code',
  roomKey: (number, name) => `Key to room ${number}, ${lowerFirst(name)}`,
  detailsHeading: 'Stay details',
  stayLine: (arrival, departure, nights) => `${arrival} to ${departure}, ${nights}`,
  guestsLine: (guests, room, size) => `${guests}, ${lowerFirst(room)}, ${size} m²`,
  rate: 'Rate',
  guestHeading: 'Guest',
  priceHeading: 'Price',
  calendar: 'Add to calendar (.ics)',
  extrasHeading: 'Extras',
  extrasLead: 'Change the number of extras and save. The new price shows below.',
  extrasLocked: 'Extras can be changed until the arrival day, unless the booking is cancelled.',
  packageToggle: 'Weekend package',
  packageHint: 'Two nights from Friday, breakfasts, late check-out and a welcome set.',
  packageUnavailable: 'The weekend package covers only two nights from Friday.',
  extraChange: difference => `Price change: ${difference}`,
  extraNoChange: 'Price unchanged.',
  saveExtras: 'Save changes',
  extrasSaved: 'Changes saved. The price is updated.',
  cancelHeading: 'Cancellation',
  cancelLead: 'The rules follow the rate you chose when booking.',
  outcome: {
    free: 'You cancel free of charge. The free cancellation deadline has not passed yet.',
    firstNight: amount =>
      `The free cancellation deadline has passed. We charge the first night: ${amount}.`,
    nonRefundable: amount =>
      `Non-refundable rate: if you cancel, you pay the whole stay, ${amount}.`,
  },
  outcomeDone: {
    free: 'Cancelled free of charge.',
    firstNight: amount => `Cancelled after the deadline. First night due: ${amount}.`,
    nonRefundable: amount => `Non-refundable rate. The whole stay is due: ${amount}.`,
  },
  cancelStart: 'Cancel booking',
  cancelConfirm: 'Yes, cancel',
  cancelKeep: 'Keep the booking',
  cancelledNotice: when => `Booking cancelled: ${when}.`,
  cancelledNothing: 'This is a sample website, so nothing was charged or refunded.',
  cancelledOriginalTotal: 'Price before cancelling',
  cancelledDue: amount => `Due after cancelling: ${amount}`,
  rebook: 'Book again',
  forget: 'Remove the booking from this browser',
  forgetHint: 'This only removes the copy stored here. There is no server holding bookings.',
  forgotten: 'The booking was removed from this browser.',
};

export const myBookingText: Record<Lang, MyBookingText> = { pl: tieDeep(pl), en: tieDeep(en) };
