import type { Lang } from '../data/lang';

const pl = {
  meta: {
    title: 'Wydarzenia | Kminek',
    description:
      'Obiad niedzielny, czwartek pierogowy, warsztaty lepienia pierogów, kolacja z producentem i gęś na świętego Marcina. Bistro Kminek we Wrocławiu, z cenami i najbliższymi terminami.',
  },
  head: {
    title: 'Przy stole dzieje się coś co tydzień.',
    lead: 'Pięć rzeczy, które wracają w rytmie tygodnia, miesiąca i roku. Daty liczymy na bieżąco, więc przy każdym wydarzeniu widzisz najbliższy termin.',
  },
  show: {
    next: 'Najbliższy termin',
    cadence: 'Kiedy',
    book: 'Jak zarezerwować',
  },
  hire: {
    title: 'Cały Kminek na jeden wieczór.',
    text: 'Urodziny, kolacja firmowa, chrzciny, pożegnanie w pracy. Salę na trzydzieści cztery miejsca wynajmujemy w poniedziałki od 17:00, kiedy i tak mamy zamknięte, a kuchnia wraca z targu. Menu układamy z Basią na dwa tygodnie przed.',
    rows: [
      { label: 'Miejsca', value: '34 siedzące, 50 na stojąco' },
      { label: 'Obiad lub kolacja', value: 'od 119 zł od osoby, trzy dania' },
      { label: 'Kolacja pięciodaniowa', value: '189 zł od osoby' },
      { label: 'Napoje', value: 'według rachunku, Tomek dobierze do menu' },
      { label: 'Zaliczka', value: '30% przy potwierdzeniu, zwrot do 7 dni przed' },
      { label: 'Dieta', value: 'wegetariańskie i wegańskie menu bez dopłaty' },
    ],
    action: 'Napisz do nas',
    mailSubject: 'Wynajem sali w Kminku',
    phoneHint: 'albo zadzwoń we wtorek-niedzielę w godzinach pracy',
  },
  end: {
    title: 'Wybrane wydarzenie? Zarezerwuj miejsce.',
    text: 'Stolik na obiad niedzielny albo czwartek pierogowy rezerwujesz tak samo jak zwykły. Na warsztaty i kolacje zapisujemy przez system rezerwacji.',
    button: 'Jak zarezerwować',
  },
};

const en: typeof pl = {
  meta: {
    title: 'Events | Kminek',
    description:
      "Sunday lunch, Dumpling Thursday, a dumpling workshop, dinner with a producer and goose on St Martin's Day. The Kminek bistro in Wrocław, with prices and next dates.",
  },
  head: {
    title: 'Something happens at the table every week.',
    lead: 'Five things that come back on a weekly, monthly and yearly rhythm. We work out the dates as we go, so every event shows its next date.',
  },
  show: {
    next: 'Next date',
    cadence: 'When',
    book: 'How to book',
  },
  hire: {
    title: 'The whole of Kminek for one evening.',
    text: 'Birthdays, a company dinner, a christening, a farewell from work. We hire out the room for thirty-four on Mondays from 17:00, when we are closed anyway and the kitchen is back from the market. We plan the menu with Basia two weeks ahead.',
    rows: [
      { label: 'Places', value: '34 seated, 50 standing' },
      { label: 'Lunch or dinner', value: 'from 119 zł per person, three courses' },
      { label: 'Five-course dinner', value: '189 zł per person' },
      { label: 'Drinks', value: 'on the bill, Tomek pairs them with the menu' },
      { label: 'Deposit', value: '30% on confirmation, refunded up to 7 days before' },
      { label: 'Diets', value: 'vegetarian and vegan menu at no extra cost' },
    ],
    action: 'Write to us',
    mailSubject: 'Private hire at Kminek',
    phoneHint: 'or call Tuesday to Sunday during opening hours',
  },
  end: {
    title: 'Picked an event? Book a place.',
    text: 'You book a table for Sunday lunch or Dumpling Thursday the same way as an ordinary one. Workshops and dinners go through the booking system.',
    button: 'How to book',
  },
};

export const eventsCopy: Record<Lang, typeof pl> = { pl, en };
