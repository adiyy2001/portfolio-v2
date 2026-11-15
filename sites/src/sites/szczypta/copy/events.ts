const pl = {
  title: 'Wydarzenia',
  description:
    'Wydarzenia w bistrze Szczypta: czwartek z dostawcą, wieczór z winem z Moraw, wieczór pierogowy, warsztat zupy i śniadanie przy długim stole. Strona przykładowa.',
  h1: 'Wydarzenia',
  lead: 'Pięć stałych terminów w miesiącu. Każdy wraca w tym samym dniu tygodnia, więc datę kolejnego sprawdzisz tutaj.',
  next: 'Najbliższy termin',
  price: (amount: number) => `${amount} zł od osoby`,
  seats: (count: number) => `${count} miejsc`,
  details: 'Szczegóły',
  detailsLabel: (title: string) => `Szczegóły wydarzenia: ${title}`,
  book: 'Zarezerwuj miejsce',
  back: 'Wszystkie wydarzenia',
  included: 'W cenie',
  when: 'Termin',
  at: 'godz.',
  duration: (start: string, end: string) => `${start} do ${end}`,
  facts: 'Najważniejsze',
  labels: { when: 'Termin', time: 'Godzina', price: 'Cena', seats: 'Miejsca' },
  detailTitle: (title: string) => `${title}. Wydarzenia`,
  detailDescription: (title: string, teaser: string) => `${title} w bistrze Szczypta. ${teaser}`,
  otherTitle: 'Inne wydarzenia',
};

const en: typeof pl = {
  title: 'Events',
  description:
    'Events at Szczypta bistro: Thursday with a supplier, Moravian wine evening, dumpling night, soup workshop and breakfast at the long table. Sample website.',
  h1: 'Events',
  lead: 'Five regular dates each month. Each one returns on the same day of the week, so you can check the next date here.',
  next: 'Next date',
  price: (amount: number) => `${amount} zł per person`,
  seats: (count: number) => `${count} seats`,
  details: 'Details',
  detailsLabel: (title: string) => `Event details: ${title}`,
  book: 'Reserve a seat',
  back: 'All events',
  included: 'Included',
  when: 'When',
  at: 'at',
  duration: (start: string, end: string) => `${start} to ${end}`,
  facts: 'At a glance',
  labels: { when: 'Date', time: 'Time', price: 'Price', seats: 'Seats' },
  detailTitle: (title: string) => `${title}. Events`,
  detailDescription: (title: string, teaser: string) => `${title} at Szczypta bistro. ${teaser}`,
  otherTitle: 'Other events',
};

export const eventsCopy = { pl, en };
