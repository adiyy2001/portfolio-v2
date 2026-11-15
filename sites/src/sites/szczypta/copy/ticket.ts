const pl = {
  kicker: 'Bilecik na stolik',
  title: 'Szczypta, Szczepin',
  eventTitle: (name: string) => `Stolik na wydarzenie: ${name}`,
  fields: {
    date: 'Dzień',
    time: 'Godzina',
    people: 'Osoby',
    name: 'Imię',
    phone: 'Telefon',
  },
  send: 'Rezerwacja stolika',
  stub: 'Stolik',
  timePlaceholder: 'Wybierz',
  noscript:
    'Formularz działa z włączonym JavaScriptem. Zadzwoń, zarezerwujemy stolik przez telefon:',
  done: {
    title: 'Prośba zapisana',
    ref: 'Numer zgłoszenia',
    summary: {
      date: 'Dzień',
      time: 'Godzina',
      people: 'Osoby',
      name: 'Imię',
      phone: 'Telefon',
      event: 'Wydarzenie',
    },
    sample:
      'To strona przykładowa, więc nic nie zostało wysłane. Prośba zapisała się tylko w tej przeglądarce.',
    call: 'Wolisz zadzwonić? Numer bistra:',
    again: 'Wyślij kolejną prośbę',
  },
  mine: {
    title: 'Twoje prośby w tej przeglądarce',
    cancel: 'Anuluj',
    cancelLabel: (ref: string) => `Anuluj prośbę ${ref}`,
    empty: 'Nie masz jeszcze żadnej zapisanej prośby.',
    people: (count: number) => `${count} ${count === 1 ? 'osoba' : count < 5 ? 'osoby' : 'osób'}`,
    removed: 'Prośba usunięta.',
  },
  errors: {
    dateMissing: 'Proszę wybrać dzień.',
    datePast: 'Ten dzień już minął. Proszę wybrać późniejszy.',
    timeMissing: 'Proszę wybrać godzinę.',
    timeOutside: (day: string, from: number, to: number) =>
      `W ${day} przyjmujemy stoliki od ${from}:00 do ${to}:00.`,
    timeBreak: 'Od 16:00 do 17:00 kuchnia ma przerwę. Proszę wybrać godzinę przed albo po niej.',
    timePassed: 'Ta godzina już minęła. Proszę wybrać późniejszą.',
    peopleRange:
      'Przy stole mieści się od 1 do 12 osób. Większe grupy prosimy zgłaszać telefonicznie.',
    nameShort: 'Proszę podać imię.',
    phoneInvalid: 'Proszę podać numer telefonu, co najmniej 9 cyfr.',
    storage: 'Przeglądarka nie pozwala zapisać prośby. Zadzwoń pod',
    storageEnd: ', zarezerwujemy stolik przez telefon.',
  },
  dayAccusative: ['niedzielę', 'poniedziałek', 'wtorek', 'środę', 'czwartek', 'piątek', 'sobotę'],
};

const en: typeof pl = {
  kicker: 'Table ticket',
  title: 'Szczypta, Szczepin',
  eventTitle: (name: string) => `A table for the event: ${name}`,
  fields: {
    date: 'Day',
    time: 'Time',
    people: 'Guests',
    name: 'Name',
    phone: 'Phone',
  },
  send: 'Book a table',
  stub: 'Table',
  timePlaceholder: 'Choose',
  noscript: 'The form needs JavaScript. Call us and we will book your table by phone:',
  done: {
    title: 'Request saved',
    ref: 'Reference number',
    summary: {
      date: 'Day',
      time: 'Time',
      people: 'Guests',
      name: 'Name',
      phone: 'Phone',
      event: 'Event',
    },
    sample:
      'This is a sample website, so nothing was sent. The request is saved only in this browser.',
    call: 'Prefer to call? The bistro number:',
    again: 'Send another request',
  },
  mine: {
    title: 'Your requests in this browser',
    cancel: 'Cancel',
    cancelLabel: (ref: string) => `Cancel request ${ref}`,
    empty: 'You have no saved requests yet.',
    people: (count: number) => `${count} ${count === 1 ? 'guest' : 'guests'}`,
    removed: 'Request removed.',
  },
  errors: {
    dateMissing: 'Please choose a day.',
    datePast: 'That day has already passed. Please choose a later one.',
    timeMissing: 'Please choose a time.',
    timeOutside: (day: string, from: number, to: number) =>
      `On ${day} we seat tables from ${from}:00 to ${to}:00.`,
    timeBreak:
      'The kitchen takes a break from 16:00 to 17:00. Please choose a time before or after.',
    timePassed: 'That time has already passed. Please choose a later one.',
    peopleRange: 'A table seats 1 to 12 guests. For larger groups please call us.',
    nameShort: 'Please enter your name.',
    phoneInvalid: 'Please enter a phone number with at least 9 digits.',
    storage: 'The browser would not save the request. Call',
    storageEnd: ', and we will book your table by phone.',
  },
  dayAccusative: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const ticketCopy = { pl, en };
