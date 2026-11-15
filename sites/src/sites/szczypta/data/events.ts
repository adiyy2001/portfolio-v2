import type { Localized } from './lang';

export type ImageId = 'poledwiczki' | 'zupa' | 'buraki' | 'sala';

export interface EventRule {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  nth: 1 | 2 | 3 | -1;
}

export interface BistroEvent {
  slug: string;
  rule: EventRule;
  start: string;
  end?: string;
  price: number;
  seats: number;
  image: ImageId;
  title: Localized;
  teaser: Localized;
  rhythm: Localized;
  paragraphs: { pl: string[]; en: string[] };
  included: { pl: string[]; en: string[] };
}

export const events: BistroEvent[] = [
  {
    slug: 'czwartek-z-dostawca',
    rule: { weekday: 4, nth: -1 },
    start: '18:00',
    price: 82,
    seats: 14,
    image: 'buraki',
    title: { pl: 'Czwartek z dostawcą', en: 'Thursday with a supplier' },
    teaser: {
      pl: 'Kolacja w czterech daniach z warzyw jednego gospodarstwa. Przy stole siada ten, kto je wyhodował.',
      en: 'A four-course dinner built from one farm. The grower sits at the table with you.',
    },
    rhythm: { pl: 'Ostatni czwartek miesiąca', en: 'Last Thursday of the month' },
    paragraphs: {
      pl: [
        'Co miesiąc zapraszamy jednego dostawcę. Najczęściej jest to Gospodarstwo Krzyżanowice, od którego bierzemy warzywa w poniedziałki i czwartki.',
        'Kuchnia gotuje cztery dania z tego, co przyjechało rano. Gospodarz opowiada, co rośnie w polu w tym tygodniu i co z tego nie trafi do karty.',
        'Stół jest wspólny, więc przy kolacji poznasz sąsiadów z Szczepina.',
      ],
      en: [
        'Each month we invite one supplier. Most often it is Krzyżanowice Farm, where we collect vegetables on Mondays and Thursdays.',
        'The kitchen cooks four courses from whatever arrived that morning. The grower tells you what is in the field this week and what will not make the menu.',
        'The table is shared, so you will meet your neighbours from Szczepin over dinner.',
      ],
    },
    included: {
      pl: ['Cztery dania', 'Kieliszek wina z Moraw do pierwszego dania', 'Chleb z piekarni Zakwas'],
      en: [
        'Four courses',
        'A glass of Moravian wine with the first course',
        'Bread from Zakwas Bakery',
      ],
    },
  },
  {
    slug: 'wieczor-z-winem-z-moraw',
    rule: { weekday: 4, nth: 3 },
    start: '19:00',
    price: 79,
    seats: 16,
    image: 'sala',
    title: { pl: 'Wieczór z winem z Moraw', en: 'Moravian wine evening' },
    teaser: {
      pl: 'Pięć lampek z jednej piwnicy na Morawach i deski z serami z Księginic.',
      en: 'Five glasses from one cellar in Moravia, with cheese boards from Księginice.',
    },
    rhythm: { pl: 'Trzeci czwartek miesiąca', en: 'Third Thursday of the month' },
    paragraphs: {
      pl: [
        'Lampkę wina z Moraw masz w karcie przez cały rok. Raz w miesiącu pijemy pięć odmian jedna po drugiej i zagryzamy serami z Serowarni Księginice.',
        'Tomasz prowadzi wieczór na sali i mówi, co czuć w kieliszku. Pytania są mile widziane, gotowa wiedza nie jest potrzebna.',
      ],
      en: [
        'The Moravian wine by the glass is on the menu all year. Once a month we taste five varieties in a row, with cheese from Księginice Creamery.',
        'Tomasz hosts the evening in the dining room and tells you what to look for in the glass. Questions are welcome, and you need no background.',
      ],
    },
    included: {
      pl: ['Pięć lampek wina', 'Deska serów i chleb', 'Woda do stołu'],
      en: ['Five glasses of wine', 'A cheese board with bread', 'Water for the table'],
    },
  },
  {
    slug: 'wieczor-pierogowy',
    rule: { weekday: 6, nth: 1 },
    start: '17:00',
    price: 42,
    seats: 18,
    image: 'zupa',
    title: { pl: 'Wieczór pierogowy', en: 'Dumpling night' },
    teaser: {
      pl: 'Pierogi z gęsiną bez limitu porcji, dopóki starcza ciasta.',
      en: 'Goose dumplings with no limit on portions, as long as the dough lasts.',
    },
    rhythm: { pl: 'Pierwsza sobota miesiąca', en: 'First Saturday of the month' },
    paragraphs: {
      pl: [
        'W pierwszą sobotę miesiąca lepimy pierogi od rana. Wieczorem wychodzą z kuchni partiami i trafiają prosto na stoły.',
        'Dostajesz pierogi z gęsiną z cebulą smażoną na maśle, a w drugiej rundzie wersję z kapustą i grzybami.',
      ],
      en: [
        'On the first Saturday of the month we fold dumplings from the morning. In the evening they leave the kitchen in batches and go straight to the tables.',
        'You get goose dumplings with onion fried in butter, and in the second round a version with cabbage and mushrooms.',
      ],
    },
    included: {
      pl: [
        'Pierogi z gęsiną oraz z kapustą i grzybami',
        'Surówka z kiszonej kapusty',
        'Herbata do stołu',
      ],
      en: [
        'Goose dumplings and cabbage and mushroom dumplings',
        'Sauerkraut salad',
        'Tea for the table',
      ],
    },
  },
  {
    slug: 'warsztat-zupy',
    rule: { weekday: 6, nth: 2 },
    start: '11:00',
    end: '13:00',
    price: 34,
    seats: 10,
    image: 'zupa',
    title: { pl: 'Warsztat zupy', en: 'Soup workshop' },
    teaser: {
      pl: 'Dwie godziny w kuchni: bulion od podstaw i zupa, którą zjesz na koniec.',
      en: 'Two hours in the kitchen: a stock from scratch and a soup you eat at the end.',
    },
    rhythm: { pl: 'Druga sobota miesiąca', en: 'Second Saturday of the month' },
    paragraphs: {
      pl: [
        'Halina pokazuje, jak ugotować bulion o wyraźnym smaku. Kroisz, podpiekasz, doprawiasz i próbujesz na każdym etapie.',
        'Na koniec jecie wspólnie zupę, którą ugotowaliście. Przepis dostajesz na kartce.',
      ],
      en: [
        'Halina shows how to cook a stock with a clear flavour. You chop, roast, season and taste at every step.',
        'At the end you all eat the soup you cooked. You take the recipe home on a card.',
      ],
    },
    included: {
      pl: ['Fartuch na czas warsztatu', 'Miska zupy z chlebem', 'Przepis na kartce'],
      en: ['An apron for the session', 'A bowl of soup with bread', 'The recipe on a card'],
    },
  },
  {
    slug: 'sniadanie-przy-dlugim-stole',
    rule: { weekday: 0, nth: 2 },
    start: '10:30',
    price: 26,
    seats: 12,
    image: 'sala',
    title: { pl: 'Śniadanie przy długim stole', en: 'Breakfast at the long table' },
    teaser: {
      pl: 'Jeden stół, jedna taca z jedzeniem i niedzielne tempo.',
      en: 'One table, one big tray of food and a Sunday pace.',
    },
    rhythm: { pl: 'Druga niedziela miesiąca', en: 'Second Sunday of the month' },
    paragraphs: {
      pl: [
        'Zestawiamy stoły w jeden i stawiamy na nim wszystkie śniadania z karty: jajka, twarożek, owsiankę, chleb i konfiturę z pigwy.',
        'Bierzesz, co chcesz, i siedzisz tak długo, jak masz ochotę. Kuchnia pracuje do 16:00.',
      ],
      en: [
        'We push the tables into one and put the whole breakfast menu on it: eggs, fresh cheese, porridge, bread and quince jam.',
        'You take what you like and stay as long as you like. The kitchen works until 16:00.',
      ],
    },
    included: {
      pl: ['Wszystkie śniadania z karty do dzielenia', 'Kawa i herbata bez limitu'],
      en: ['Every breakfast dish from the menu to share', 'Coffee and tea without limit'],
    },
  },
];

export const eventBySlug = (slug: string) => events.find(event => event.slug === slug)!;
