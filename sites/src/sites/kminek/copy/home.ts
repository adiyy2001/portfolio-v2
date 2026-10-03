import type { Lang } from '../data/lang';

const pl = {
  meta: {
    title: 'Kminek, bistro na Nadodrzu we Wrocławiu',
    description:
      'Kuchnia polska, podana od nowa. Nowa karta co wtorek, alergeny przy każdym daniu. Otwarte od wtorku do niedzieli, ul. Jedności Narodowej 43 we Wrocławiu.',
  },
  hero: {
    title: 'Kuchnia polska, podana od nowa.',
    lead: 'Pierogi, żurek i kaczka, ale też to, co w tym tygodniu przyjechało z targu: buraki, dynia i jabłka z sadu pod Trzebnicą. Nowa karta co wtorek.',
    reserve: 'Zarezerwuj stolik',
    menu: 'Zobacz kartę',
    hoursLabel: 'Godziny',
    hours: 'wtorek-niedziela, 12:00-22:00',
    addressLabel: 'Adres',
  },
  card: {
    title: 'W tym tygodniu w karcie',
    note: 'Karta zmienia się we wtorek. Ceny w złotych, serwisu nie doliczamy.',
    link: 'Cała karta z alergenami',
  },
  week: {
    title: 'W poniedziałek targ, od wtorku nowa karta.',
    text: 'W poniedziałek jesteśmy zamknięci. Basia jeździ po targach i do dostawców, a Tomek liczy, ile zostało wina. We wtorek rano Basia pisze kartę z tego, co przywiozła, i tak zostaje do niedzieli. Dlatego dań jest czternaście, a nie czterdzieści.',
    notes: {
      1: 'targ, zamówienia, próby nowych dań',
      2: 'nowa karta od otwarcia',
      3: 'kuchnia do 21:00',
      4: 'pierogi od 18:00',
      5: 'kuchnia do 21:00',
      6: 'w pierwszą sobotę miesiąca warsztaty',
      0: 'obiad niedzielny 13:00-16:00',
    },
  },
  events: {
    title: 'Niedziela na obiad, czwartek na pierogi.',
    intro:
      'Trzy rzeczy, które wracają regularnie. Reszta, od kolacji z producentem po gęś na świętego Marcina, jest na osobnej stronie.',
    next: 'Najbliższy termin',
    all: 'Wszystkie wydarzenia',
  },
  know: {
    title: 'Dobrze wiedzieć',
    rows: [
      { label: 'Płatności', value: 'karta, BLIK i gotówka' },
      { label: 'Serwis', value: 'nie doliczamy, ceny w karcie są ostateczne' },
      { label: 'Alergeny', value: 'przy każdym daniu, resztę wyjaśni Tomek' },
      { label: 'Psy', value: 'mogą wejść na salę, miska z wodą stoi przy barze' },
      { label: 'Dzieci', value: 'krzesełka są, mniejsze porcje pierogów na życzenie' },
      { label: 'Wejście', value: 'z ulicy, bez schodów, toaleta przystosowana' },
    ],
  },
  about: {
    title: 'Trzy osoby, jedna kuchnia.',
    text: 'Basia gotuje, Tomek prowadzi salę i bar, Ola piecze chleb i ciasta. Nikt tu nie jest dyrektorem, a zmywają wszyscy troje.',
    link: 'Poznaj ich bliżej',
  },
  visitor: {
    lang: 'en' as Lang,
    title: 'Visiting Wrocław?',
    text: 'This whole site is also in English: the menu with allergens, the events and how to book a table.',
    link: 'Read it in English',
  },
};

const en: typeof pl = {
  meta: {
    title: 'Kminek, a Polish bistro in Wrocław',
    description:
      'Polish cooking, served anew. The menu changes every Tuesday and every dish lists its allergens. Open Tuesday to Sunday at ul. Jedności Narodowej 43 in Wrocław.',
  },
  hero: {
    title: 'Polish cooking, served anew.',
    lead: 'Pierogi, żurek and duck, but also whatever came from the market this week: beetroot, pumpkin and apples from an orchard near Trzebnica. A new menu every Tuesday.',
    reserve: 'Book a table',
    menu: 'See the menu',
    hoursLabel: 'Hours',
    hours: 'Tuesday to Sunday, 12:00-22:00',
    addressLabel: 'Address',
  },
  card: {
    title: 'On the menu this week',
    note: 'The menu changes on Tuesday. Prices in złoty, no service charge.',
    link: 'The full menu with allergens',
  },
  week: {
    title: 'Market on Monday, a new menu from Tuesday.',
    text: 'We are closed on Monday. Basia drives around the markets and suppliers while Tomek counts how much wine is left. On Tuesday morning Basia writes the menu from what she brought back, and it stays until Sunday. That is why there are fourteen dishes, not forty.',
    notes: {
      1: 'market, orders, trying new dishes',
      2: 'new menu from opening',
      3: 'kitchen until 21:00',
      4: 'pierogi from 18:00',
      5: 'kitchen until 21:00',
      6: 'dumpling workshop on the first Saturday',
      0: 'Sunday lunch 13:00-16:00',
    },
  },
  events: {
    title: 'Lunch on Sunday, pierogi on Thursday.',
    intro:
      "Three things that come back regularly. The rest, from the dinner with a producer to the goose on St Martin's Day, is on its own page.",
    next: 'Next date',
    all: 'All events',
  },
  know: {
    title: 'Good to know',
    rows: [
      { label: 'Payment', value: 'card, BLIK and cash' },
      { label: 'Service', value: 'not added, the prices on the menu are final' },
      { label: 'Allergens', value: 'listed with every dish, Tomek explains the rest' },
      { label: 'Dogs', value: 'welcome in the dining room, a bowl of water waits at the bar' },
      { label: 'Children', value: 'high chairs, smaller portions of pierogi on request' },
      { label: 'Access', value: 'street level, no steps, an accessible toilet' },
    ],
  },
  about: {
    title: 'Three people, one kitchen.',
    text: 'Basia cooks, Tomek runs the floor and the bar, Ola bakes the bread and the cakes. Nobody here is a director, and all three of them do the dishes.',
    link: 'Meet them',
  },
  visitor: {
    lang: 'pl' as Lang,
    title: 'Mówisz po polsku?',
    text: 'Ta strona jest też po polsku: karta z alergenami, wydarzenia i rezerwacja stolika.',
    link: 'Czytaj po polsku',
  },
};

export const homeCopy: Record<Lang, typeof pl> = { pl, en };
