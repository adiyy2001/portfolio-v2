const pl = {
  title: 'Rezerwacja stolika',
  description:
    'Zarezerwuj stolik w bistrze Szczypta na Szczepinie: dzień, godzina, liczba osób. Strona przykładowa, prośba zapisuje się tylko w Twojej przeglądarce.',
  h1: 'Rezerwacja stolika',
  lead: 'Wybierz dzień i godzinę, a my potwierdzimy stolik telefonicznie. Przyjmujemy grupy od jednej do dwunastu osób.',
  rules: {
    title: 'Co warto wiedzieć',
    items: [
      'Stolik trzymamy przez piętnaście minut od umówionej godziny.',
      'Ostatni stolik przyjmujemy godzinę przed zamknięciem.',
      'Od 16:00 do 17:00 kuchnia ma przerwę i nie przyjmujemy stolików.',
      'Większe grupy rezerwuj telefonicznie.',
    ],
  },
  fromEventHint: 'Dzień, godzina i liczba osób są wpisane z wydarzenia. Możesz je zmienić.',
};

const en: typeof pl = {
  title: 'Book a table',
  description:
    'Book a table at Szczypta bistro in Szczepin: day, time and number of guests. Sample website, the request is saved only in your browser.',
  h1: 'Book a table',
  lead: 'Choose a day and a time and we confirm the table by phone. We take groups of one to twelve guests.',
  rules: {
    title: 'Good to know',
    items: [
      'We hold a table for fifteen minutes after the agreed time.',
      'We seat the last table one hour before closing.',
      'From 16:00 to 17:00 the kitchen takes a break and we do not seat tables.',
      'Please call to book a larger group.',
    ],
  },
  fromEventHint: 'The day, time and number of guests come from the event. You can change them.',
};

export const bookingCopy = { pl, en };
