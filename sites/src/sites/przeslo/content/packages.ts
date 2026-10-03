import type { Lang } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface PackagesText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  weekend: {
    heading: string;
    lead: string;
    includesHeading: string;
    includes: { title: string; text: string }[];
    rules: string[];
    exampleHeading: string;
    exampleLead: string;
    caption: string;
    columns: {
      room: string;
      accommodation: string;
      separately: string;
      inPackage: string;
      saving: string;
      total: string;
    };
    book: string;
  };
  longStay: {
    heading: string;
    lead: string;
    tiers: { range: string; discount: string }[];
    rules: string[];
    exampleHeading: string;
    exampleLead: string;
    caption: string;
    columns: {
      room: string;
      sevenList: string;
      sevenPay: string;
      eightList: string;
      eightPay: string;
    };
    book: string;
  };
  closingHeading: string;
  closingText: string;
  closingPhone: string;
}

const pl: PackagesText = {
  title: 'Pakiety: Weekend nad Odrą i zniżka od pięciu nocy | Przęsło',
  description:
    'Weekend nad Odrą w Przęśle: dwie noce od piątku ze śniadaniami, późnym wymeldowaniem i zestawem powitalnym. Od pięciu nocy zniżka na nocleg liczy się sama.',
  heading: 'Pakiety',
  lead: 'Dwa sposoby na niższy rachunek. Oba formularz rezerwacji liczy sam, więc nie musisz niczego wpisywać ani pytać o kod.',
  weekend: {
    heading: 'Weekend nad Odrą',
    lead: `Przyjeżdżasz w piątek, wyjeżdżasz w niedzielę. W cenie nocleg jak zwykle, a dodatki, o które goście proszą najczęściej, kosztują o 15 procent mniej niż osobno.`,
    includesHeading: 'Co wchodzi w pakiet',
    includes: [
      {
        title: 'Śniadanie dla każdego gościa',
        text: 'Przy dużym stole w sobotę i w niedzielę rano, od 8:00 do 11:00.',
      },
      {
        title: `Późne wymeldowanie do ${hotel.lateCheckOut}`,
        text: `Zamiast ${hotel.checkOut} masz pokój do ${hotel.lateCheckOut}, więc niedzielny poranek nie jest wyścigiem.`,
      },
      {
        title: 'Zestaw powitalny w pokoju',
        text: 'Butelka wina albo soku tłoczonego, deska serów i ciastka z piekarni przy ulicy.',
      },
    ],
    rules: [
      'Pakiet obejmuje dokładnie dwie noce, od piątku do niedzieli.',
      'Nocleg liczymy po cenie z kalendarza. Pakiet obniża tylko cenę dodatków.',
      'Zaznaczasz go w pierwszym kroku rezerwacji albo na stronie Moja rezerwacja, dopóki pobyt się nie zaczął.',
    ],
    exampleHeading: 'Ile to kosztuje',
    exampleLead:
      'Przykład dla dwóch osób, od piątku 12 lutego do niedzieli 14 lutego 2027. Ceny zmieniają się z kalendarzem, więc w rezerwacji zobaczysz dokładną kwotę dla swoich dni.',
    caption: 'Weekend nad Odrą dla dwóch osób, 12-14 lutego 2027',
    columns: {
      room: 'Pokój',
      accommodation: 'Nocleg, 2 noce',
      separately: 'Dodatki osobno',
      inPackage: 'Dodatki w pakiecie',
      saving: 'Oszczędzasz',
      total: 'Razem',
    },
    book: 'Zarezerwuj weekend',
  },
  longStay: {
    heading: 'Dłuższy pobyt',
    lead: 'Im dłużej zostajesz, tym taniej wychodzi każda noc. Zniżka nalicza się przy rezerwacji i widać ją w osobnej linii podsumowania.',
    tiers: [
      { range: 'Od 5 do 7 nocy', discount: '10 procent zniżki na nocleg' },
      { range: 'Od 8 nocy', discount: '15 procent zniżki na nocleg' },
    ],
    rules: [
      'Zniżka dotyczy noclegu. Śniadania, parking i inne dodatki liczymy bez zniżki.',
      'Możesz ją łączyć z obiema taryfami, także z bezzwrotną.',
      'Najdłuższy pobyt w formularzu to 30 nocy. Na dłużej zadzwoń do recepcji.',
    ],
    exampleHeading: 'Przykład tygodnia',
    exampleLead:
      'Dwie osoby, od poniedziałku 1 marca 2027, taryfa elastyczna. Siedem nocy obejmuje piątek i sobotę, więc w cenie noclegu jest weekendowy dodatek.',
    caption: 'Dłuższy pobyt dla dwóch osób od 1 marca 2027',
    columns: {
      room: 'Pokój',
      sevenList: '7 nocy, cena z kalendarza',
      sevenPay: '7 nocy, po zniżce',
      eightList: '8 nocy, cena z kalendarza',
      eightPay: '8 nocy, po zniżce',
    },
    book: 'Sprawdź swoje dni',
  },
  closingHeading: 'Inne dni, inna liczba osób?',
  closingText: `Recepcja doradzi, jak ułożyć pobyt, żeby wyszło najtaniej. Jesteśmy od ${hotel.receptionOpens} do ${hotel.receptionCloses}.`,
  closingPhone: 'Zadzwoń do recepcji',
};

const en: PackagesText = {
  title: 'Packages: Weekend by the Oder and a discount from five nights | Przęsło',
  description:
    'Weekend by the Oder at Przęsło: two nights from Friday with breakfasts, late check-out and a welcome set. From five nights the room discount applies by itself.',
  heading: 'Packages',
  lead: 'Two ways to a lower bill. The booking form works out both, so you do not need to type or ask for a code.',
  weekend: {
    heading: 'Weekend by the Oder',
    lead: 'You arrive on Friday and leave on Sunday. The room costs what it costs, and the extras guests ask for most often are 15 percent cheaper than when bought separately.',
    includesHeading: 'What the package contains',
    includes: [
      {
        title: 'Breakfast for every guest',
        text: 'At the long table on both Saturday and Sunday mornings, from 8:00 to 11:00.',
      },
      {
        title: `Late check-out until ${hotel.lateCheckOut}`,
        text: `Instead of ${hotel.checkOut} you keep the room until ${hotel.lateCheckOut}, so Sunday morning is not a race.`,
      },
      {
        title: 'Welcome set in the room',
        text: 'A bottle of wine or pressed juice, a cheese board and biscuits from the bakery down the street.',
      },
    ],
    rules: [
      'The package covers exactly two nights, from Friday to Sunday.',
      'The room is charged at the calendar price. The package lowers only the price of the extras.',
      'You tick it in the first step of the booking, or on the My booking page until the stay begins.',
    ],
    exampleHeading: 'What it costs',
    exampleLead:
      'An example for two guests, from Friday 12 February to Sunday 14 February 2027. Prices change with the calendar, so the booking form shows the exact amount for your dates.',
    caption: 'Weekend by the Oder for two guests, 12-14 February 2027',
    columns: {
      room: 'Room',
      accommodation: 'Room, 2 nights',
      separately: 'Extras bought separately',
      inPackage: 'Extras in the package',
      saving: 'You save',
      total: 'Total',
    },
    book: 'Book the weekend',
  },
  longStay: {
    heading: 'A longer stay',
    lead: 'The longer you stay, the cheaper each night gets. The discount is applied when you book and shows on its own line of the summary.',
    tiers: [
      { range: 'From 5 to 7 nights', discount: '10 percent off the room' },
      { range: 'From 8 nights', discount: '15 percent off the room' },
    ],
    rules: [
      'The discount applies to the room. Breakfasts, parking and other extras are charged without it.',
      'It combines with both rates, including the non-refundable one.',
      'The longest stay in the form is 30 nights. For longer, call reception.',
    ],
    exampleHeading: 'A week as an example',
    exampleLead:
      'Two guests, from Monday 1 March 2027, flexible rate. Seven nights include a Friday and a Saturday, so the room price already contains the weekend surcharge.',
    caption: 'A longer stay for two guests from 1 March 2027',
    columns: {
      room: 'Room',
      sevenList: '7 nights, calendar price',
      sevenPay: '7 nights, after discount',
      eightList: '8 nights, calendar price',
      eightPay: '8 nights, after discount',
    },
    book: 'Check your dates',
  },
  closingHeading: 'Other dates, other party size?',
  closingText: `Reception can suggest how to arrange the stay so it costs least. We are in from ${hotel.receptionOpens} to ${hotel.receptionCloses}.`,
  closingPhone: 'Call reception',
};

export const packagesText: Record<Lang, PackagesText> = { pl: tieDeep(pl), en: tieDeep(en) };
