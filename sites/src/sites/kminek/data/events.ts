import type { Localized } from './lang';
import type { Recurrence } from '../logic/schedule';

export interface Fact {
  label: Localized;
  value: Localized;
}

export interface EventItem {
  id: string;
  rule: Recurrence;
  time: Localized;
  endsAt: string;
  price: Localized;
  title: Localized;
  summary: Localized;
  facts: readonly Fact[];
}

export const events: readonly EventItem[] = [
  {
    id: 'sunday-lunch',
    rule: { kind: 'weekly', weekday: 0 },
    endsAt: '16:00',
    time: { pl: '13:00-16:00', en: '13:00-16:00' },
    price: { pl: '79 zł od osoby', en: '79 zł per person' },
    title: { pl: 'Obiad niedzielny', en: 'Sunday lunch' },
    summary: {
      pl: 'Trzy dania, jeden stół, bez pośpiechu. Zupa tygodnia, jedno z trzech dań głównych, które Basia wybiera na niedzielę, i deser. Nikt nie liczy, ile wzięliście chleba.',
      en: 'Three courses, one table, no rush. The soup of the week, one of three mains that Basia picks for Sunday, and dessert. Nobody counts how much bread you took.',
    },
    facts: [
      { label: { pl: 'Godziny', en: 'Hours' }, value: { pl: '13:00-16:00', en: '13:00-16:00' } },
      { label: { pl: 'Cena', en: 'Price' }, value: { pl: '79 zł', en: '79 zł' } },
      {
        label: { pl: 'Dzieci do 12 lat', en: 'Children up to 12' },
        value: { pl: '39 zł', en: '39 zł' },
      },
      {
        label: { pl: 'Stolik', en: 'Table' },
        value: { pl: 'warto zarezerwować do piątku', en: 'book by Friday if you can' },
      },
    ],
  },
  {
    id: 'dumpling-thursday',
    rule: { kind: 'weekly', weekday: 4 },
    endsAt: '21:00',
    time: { pl: 'od 18:00', en: 'from 18:00' },
    price: { pl: '42 zł za 12 sztuk', en: '42 zł for 12' },
    title: { pl: 'Czwartek pierogowy', en: 'Dumpling Thursday' },
    summary: {
      pl: 'Dwanaście pierogów na talerzu, każde nadzienie osobno: ruskie, z kaszanką i jabłkiem albo z kapustą i grzybami. Do tego smażona cebula, śmietana i masło.',
      en: 'Twelve pierogi on a plate, each filling separate: potato and curd cheese, black pudding with apple, or cabbage with mushrooms. Fried onion, soured cream and butter on the side.',
    },
    facts: [
      {
        label: { pl: 'Godziny', en: 'Hours' },
        value: { pl: '18:00-21:00, kuchnia', en: '18:00-21:00, kitchen' },
      },
      { label: { pl: 'Cena', en: 'Price' }, value: { pl: '42 zł', en: '42 zł' } },
      {
        label: { pl: 'Nadzienia', en: 'Fillings' },
        value: { pl: 'ruskie, kaszanka, kapusta', en: 'potato, black pudding, cabbage' },
      },
      {
        label: { pl: 'Stolik', en: 'Table' },
        value: {
          pl: 'od sześciu osób prosimy o telefon',
          en: 'groups of six or more, please call',
        },
      },
    ],
  },
  {
    id: 'dumpling-workshop',
    rule: { kind: 'monthly', weekday: 6, nth: 1 },
    endsAt: '16:30',
    time: { pl: '14:00-16:30', en: '14:00-16:30' },
    price: { pl: '120 zł od osoby', en: '120 zł per person' },
    title: { pl: 'Warsztaty lepienia pierogów', en: 'Dumpling workshop' },
    summary: {
      pl: 'Basia pokazuje ciasto, farsz i zakładkę. Dwie godziny lepienia przy jednym stole, potem jecie to, co wyszło, z kompotem.',
      en: 'Basia shows the dough, the filling and the pinch. Two hours of folding at one table, then you eat what you made, with a glass of kompot.',
    },
    facts: [
      {
        label: { pl: 'Godziny', en: 'Hours' },
        value: { pl: '14:00-16:30', en: '14:00-16:30' },
      },
      { label: { pl: 'Cena', en: 'Price' }, value: { pl: '120 zł', en: '120 zł' } },
      { label: { pl: 'Miejsca', en: 'Places' }, value: { pl: '10', en: '10' } },
      {
        label: { pl: 'Zapisy', en: 'Booking' },
        value: {
          pl: 'do środy, zwrot do 48 godzin przed',
          en: 'by Wednesday, refund up to 48 hours before',
        },
      },
    ],
  },
  {
    id: 'producer-dinner',
    rule: { kind: 'monthly', weekday: 3, nth: 'last' },
    endsAt: '21:30',
    time: { pl: '19:00', en: '19:00' },
    price: { pl: '169 zł od osoby', en: '169 zł per person' },
    title: { pl: 'Kolacja z producentem', en: 'Dinner with a producer' },
    summary: {
      pl: 'Raz w miesiącu przy stole siada ktoś, od kogo kupujemy: serowar, piwowar, winiarz albo pasiecznik. Pięć dań z jego produktów i opowieść o tym, skąd się wzięły.',
      en: 'Once a month someone we buy from sits at the table: a cheesemaker, a brewer, a winemaker or a beekeeper. Five courses built on their produce, and the story of where it came from.',
    },
    facts: [
      {
        label: { pl: 'Godziny', en: 'Hours' },
        value: { pl: '19:00, około 2,5 godziny', en: '19:00, about 2.5 hours' },
      },
      { label: { pl: 'Cena', en: 'Price' }, value: { pl: '169 zł', en: '169 zł' } },
      {
        label: { pl: 'Dobrane napoje', en: 'Drink pairing' },
        value: { pl: '79 zł', en: '79 zł' },
      },
      { label: { pl: 'Miejsca', en: 'Places' }, value: { pl: '24', en: '24' } },
    ],
  },
  {
    id: 'st-martins-day',
    rule: { kind: 'yearly', month: 11, day: 11 },
    endsAt: '22:00',
    time: { pl: 'trzy tury', en: 'three sittings' },
    price: { pl: '189 zł dla dwóch osób', en: '189 zł for two' },
    title: { pl: 'Dzień Świętego Marcina', en: "St Martin's Day" },
    summary: {
      pl: 'Na świętego Marcina najlepsza gęsina, mówi przysłowie, więc pieczemy gęś: z jabłkami, modrą kapustą i kluskami. Hodowca przywozi ją z dnia na dzień, dlatego zamawiamy z wyprzedzeniem.',
      en: "On St Martin's Day Poles eat roast goose, so we roast one: with apples, red cabbage and potato dumplings. The farmer delivers the geese the day before, which is why we take orders in advance.",
    },
    facts: [
      {
        label: { pl: 'Tury', en: 'Sittings' },
        value: {
          pl: 'trzy, godzinę ustalamy przy zamówieniu',
          en: 'three, we agree the time when you order',
        },
      },
      {
        label: { pl: 'Cena', en: 'Price' },
        value: { pl: '189 zł, gęś dla dwóch osób', en: '189 zł, one goose for two' },
      },
      {
        label: { pl: 'Zamówienie', en: 'Order' },
        value: { pl: 'najpóźniej cztery dni wcześniej', en: 'at least four days ahead' },
      },
    ],
  },
];

export const eventById = (id: string): EventItem => {
  const found = events.find(event => event.id === id);
  if (!found) throw new Error(`Unknown event ${id}`);
  return found;
};

export const homeEventIds = ['sunday-lunch', 'dumpling-thursday', 'dumpling-workshop'] as const;
