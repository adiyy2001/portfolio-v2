const pl = {
  title: 'Bistro na Szczepinie, Wrocław',
  description:
    'Bistro we Wrocławiu, na Szczepinie. Karta na śniadanie, lunch i kolację, zestaw dnia na pięć dni tygodnia. Strona przykładowa.',
  hero: {
    kicker: 'Z karty kolacji, od 17:00',
    price: 'Kolacja',
    cta: 'Zarezerwuj stolik',
    photoAlt:
      'Zrumieniony kawałek mięsa z mikroliśćmi na ciemnym talerzu, obok czarna miseczka, wokół sól i różowy pieprz',
  },
  today: {
    kicker: 'Danie dnia,',
    dayFallback: 'w poniedziałek',
    dayToday: 'dziś',
    setPrefix: 'W zestawie',
    and: 'i',
    secondPrice: 'Drugie danie',
    setPrice: 'Zestaw',
  },
  booking: {
    title: 'Stolik',
    lead: 'Podaj dzień, godzinę, liczbę osób, imię i telefon. Oddzwonimy, żeby potwierdzić stolik.',
    hoursCaption: 'Godziny otwarcia',
    seats:
      'Ostatni stolik przyjmujemy godzinę przed zamknięciem. Między 16:00 a 17:00 kuchnia ma przerwę i nie przyjmujemy stolików.',
  },
};

const en: typeof pl = {
  title: 'Bistro na Szczepinie, Wrocław',
  description:
    'Bistro na Szczepinie is in Wrocław, in the Szczepin district. Menus for breakfast, lunch and dinner, and a set of the day on five days of the week. Sample website.',
  hero: {
    kicker: 'From the dinner menu, from 17:00',
    price: 'Dinner',
    cta: 'Book a table',
    photoAlt:
      'A browned piece of meat with microgreens on a dark plate, a small black ramekin beside it, salt and pink pepper around',
  },
  today: {
    kicker: 'Dish of the day,',
    dayFallback: 'on Monday',
    dayToday: 'today',
    setPrefix: 'The set includes',
    and: 'and',
    secondPrice: 'Main course',
    setPrice: 'Set',
  },
  booking: {
    title: 'Book a table',
    lead: 'Give us the day, time, number of guests, your name and phone. We call back to confirm the table.',
    hoursCaption: 'Opening hours',
    seats:
      'We seat the last table one hour before closing. From 16:00 to 17:00 the kitchen takes a break and we do not seat tables.',
  },
};

export const homeCopy = { pl, en };
