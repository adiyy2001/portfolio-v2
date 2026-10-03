import type { Lang } from '../data/lang';

const pl = {
  meta: {
    title: 'Rezerwacja stolika | Kminek',
    description:
      'Jak zarezerwować stolik w bistrze Kminek we Wrocławiu: system rezerwacji, co dzieje się po wysłaniu, zasady dla grup i telefon na ostatnią chwilę.',
  },
  head: {
    title: 'Zarezerwuj stolik.',
    lead: 'Rezerwujemy przez zewnętrzny system, w którym sam wybierasz dzień, godzinę i liczbę osób. Poniżej wyjaśniamy, jak to działa i co dostajesz po wysłaniu.',
  },
  widget: {
    title: 'Wybierz termin',
    button: 'Wybierz termin w systemie rezerwacji',
    sampleTitle: 'To przykładowa strona, więc nic się tu nie otworzy.',
    sampleText:
      'W prawdziwej wersji ten przycisk otwiera system rezerwacji w nowej karcie. Wybierasz tam dzień, godzinę i liczbę osób, wpisujesz imię i adres e-mail, a system wysyła potwierdzenie. Kminek nie ma własnego formularza ani nie przechowuje twoich danych na tej stronie.',
    seeTitle: 'Co zobaczyłbyś w systemie',
    see: [
      'kalendarz z wolnymi dniami od wtorku do niedzieli',
      'godziny co pół godziny, od 12:00 do 20:30',
      'liczbę osób od jednej do pięciu',
      'pole na uwagi: alergie, krzesełko dla dziecka, pies',
    ],
    phone: 'Wolisz telefon? Zadzwoń',
  },
  steps: {
    title: 'Co dzieje się dalej',
    items: [
      {
        title: 'Wybierasz termin',
        text: 'Dzień, godzina, liczba osób. Rezerwacje przyjmujemy do dwóch godzin przed wizytą.',
      },
      {
        title: 'Dostajesz e-mail',
        text: 'Potwierdzenie przychodzi od razu. Są w nim data, godzina, adres i odnośnik do zmiany albo odwołania rezerwacji.',
      },
      {
        title: 'Trzymamy stolik',
        text: 'Czekamy na ciebie piętnaście minut po umówionej godzinie. Spóźnisz się bardziej, zadzwoń, a poczekamy.',
      },
      {
        title: 'Zmieniasz plany?',
        text: 'Rezerwację odwołasz w odnośniku z e-maila albo telefonem, bez opłat. Prosimy tylko, żeby zrobić to przed wizytą.',
      },
    ],
  },
  rules: {
    title: 'Zasady',
    rows: [
      { label: 'Do pięciu osób', value: 'przez system rezerwacji' },
      { label: 'Od sześciu osób', value: 'telefonicznie, we wtorek-niedzielę 12:00-22:00' },
      { label: 'Bar', value: 'bez rezerwacji, zajmujesz wolne miejsce' },
      { label: 'Wspólny stół', value: 'dla dwóch osób i więcej rezerwujemy fragment stołu' },
      { label: 'Dzieci', value: 'krzesełka są, napisz w uwagach, ile potrzebujesz' },
      { label: 'Psy', value: 'mogą wejść, powiedz przy rezerwacji, żeby posadzić was z brzegu' },
      { label: 'Alergie', value: 'wpisz w uwagach, Basia sprawdzi kartę przed twoim przyjściem' },
      {
        label: 'Warsztaty i kolacje',
        value: 'zapisy w systemie, osobne zasady zwrotu opisane przy wydarzeniu',
      },
    ],
  },
  plan: {
    title: 'Plan sali',
    text: 'Trzydzieści cztery miejsca. Stoliki dla dwóch i dla czterech osób łączymy, kiedy trzeba, a wspólny stół stoi pod oknem.',
    labels: { kitchen: 'Kuchnia', bar: 'Bar', entry: 'Wejście', window: 'Okno na ulicę' },
    legend: {
      bar: 'Bar, sześć miejsc, bez rezerwacji',
      shared: 'Wspólny stół, dziesięć miejsc',
      four: 'Trzy stoliki dla czterech osób',
      two: 'Trzy stoliki dla dwóch osób',
    },
    label:
      'Schemat sali Kminka: kuchnia i bar u góry, sześć stolików w środku, wspólny stół pod oknem, wejście z lewej strony.',
  },
};

const en: typeof pl = {
  meta: {
    title: 'Book a table | Kminek',
    description:
      'How to book a table at the Kminek bistro in Wrocław: the booking system, what happens after you send, rules for groups and a phone number for the last minute.',
  },
  head: {
    title: 'Book a table.',
    lead: 'We take bookings through an external system where you choose the day, the time and the number of guests yourself. Below is how it works and what you get afterwards.',
  },
  widget: {
    title: 'Choose a time',
    button: 'Choose a time in the booking system',
    sampleTitle: 'This is a sample site, so nothing will open here.',
    sampleText:
      'In the real version this button opens the booking system in a new tab. You pick the day, the time and the number of guests there, enter your name and e-mail, and the system sends a confirmation. Kminek has no form of its own and stores none of your data on this site.',
    seeTitle: 'What you would see in the system',
    see: [
      'a calendar with the free days from Tuesday to Sunday',
      'times every half hour, from 12:00 to 20:30',
      'a guest count from one to five',
      'a notes field: allergies, a high chair, a dog',
    ],
    phone: 'Prefer the phone? Call',
  },
  steps: {
    title: 'What happens next',
    items: [
      {
        title: 'You choose a time',
        text: 'Day, time, number of guests. We take bookings up to two hours before the visit.',
      },
      {
        title: 'You get an e-mail',
        text: 'The confirmation arrives at once. It has the date, the time, the address and a link to change or cancel the booking.',
      },
      {
        title: 'We hold the table',
        text: 'We wait for you for fifteen minutes after the time you booked. If you will be later than that, call us and we will wait.',
      },
      {
        title: 'Plans change?',
        text: 'You cancel with the link in the e-mail or by phone, free of charge. We only ask that you do it before the visit.',
      },
    ],
  },
  rules: {
    title: 'House rules',
    rows: [
      { label: 'Up to five guests', value: 'through the booking system' },
      { label: 'Six or more', value: 'by phone, Tuesday to Sunday 12:00-22:00' },
      { label: 'The bar', value: 'no reservations, you take a free seat' },
      { label: 'Shared table', value: 'for two guests or more we reserve a stretch of the table' },
      { label: 'Children', value: 'high chairs available, say in the notes how many you need' },
      { label: 'Dogs', value: 'welcome, say so when you book and we will seat you by the edge' },
      {
        label: 'Allergies',
        value: 'put them in the notes, Basia checks the menu before you arrive',
      },
      {
        label: 'Workshops and dinners',
        value: 'booked in the system, with refund terms listed at the event',
      },
    ],
  },
  plan: {
    title: 'Floor plan',
    text: 'Thirty-four seats. We push the tables for two and four together when needed, and the shared table stands under the window.',
    labels: { kitchen: 'Kitchen', bar: 'Bar', entry: 'Entrance', window: 'Street window' },
    legend: {
      bar: 'The bar, six stools, no reservations',
      shared: 'Shared table, ten seats',
      four: 'Three tables for four',
      two: 'Three tables for two',
    },
    label:
      'Floor plan of Kminek: the kitchen and the bar at the top, six tables in the middle, a shared table under the window, the entrance on the left.',
  },
};

export const bookingCopy: Record<Lang, typeof pl> = { pl, en };
