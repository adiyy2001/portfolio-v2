import { deadlineDate } from '../lib/dates';

export interface MonthlyRow {
  title: string;
  short: string;
  day: number;
  label: string;
  legal: boolean;
}

export const monthlyRows: readonly MonthlyRow[] = [
  {
    title: 'Księgowanie faktur i kosztów',
    short: 'faktury',
    day: 5,
    label: 'do 5. dnia',
    legal: false,
  },
  { title: 'Listy płac i kadry', short: 'listy płac', day: 10, label: 'do 10. dnia', legal: false },
  {
    title: 'Raport miesięczny dla właściciela',
    short: 'raport',
    day: 10,
    label: 'do 10. dnia',
    legal: false,
  },
  {
    title: 'Składki ZUS spółek z o.o. i spółek akcyjnych',
    short: 'ZUS spółki',
    day: 15,
    label: 'do 15. dnia',
    legal: true,
  },
  {
    title: 'Zaliczka na PIT lub CIT i składki ZUS osób fizycznych',
    short: 'PIT, CIT, ZUS',
    day: 20,
    label: 'do 20. dnia',
    legal: true,
  },
  {
    title: 'Rozliczenie VAT i JPK_V7',
    short: 'VAT, JPK',
    day: 25,
    label: 'do 25. dnia',
    legal: true,
  },
  {
    title: 'Archiwizacja dokumentów',
    short: 'archiwum',
    day: 31,
    label: 'koniec miesiąca',
    legal: false,
  },
];

export type Audience = 'osoba' | 'spolka';

export interface StatutoryRule {
  id: string;
  day: number;
  title: string;
  audience: readonly Audience[];
  note: string;
}

export const statutoryRules: readonly StatutoryRule[] = [
  {
    id: 'zus-spolka',
    day: 15,
    title: 'Składki ZUS',
    audience: ['spolka'],
    note: 'Płatnicy z osobowością prawną: spółka z o.o. i spółka akcyjna.',
  },
  {
    id: 'zus-osoba',
    day: 20,
    title: 'Składki ZUS',
    audience: ['osoba'],
    note: 'Osoby fizyczne, także gdy zatrudniają pracowników, oraz spółki osobowe.',
  },
  {
    id: 'zaliczka',
    day: 20,
    title: 'Zaliczka na PIT lub CIT',
    audience: ['osoba', 'spolka'],
    note: 'Za poprzedni miesiąc. Kto rozlicza się kwartalnie, płaci do 20. dnia po kwartale.',
  },
  {
    id: 'vat',
    day: 25,
    title: 'VAT i plik JPK_V7',
    audience: ['osoba', 'spolka'],
    note: 'JPK_V7M co miesiąc. Przy JPK_V7K podatek płacisz co miesiąc, plik wysyłasz co kwartał.',
  },
];

export interface AnnualDeadline {
  id: string;
  month: number;
  day: number;
  title: string;
  who: string;
  note: string;
}

export const annualYear = 2027;

export const annualDeadlines: readonly AnnualDeadline[] = [
  {
    id: 'pit-11-urzad',
    month: 0,
    day: 31,
    title: 'PIT-11, PIT-4R i PIT-8AR do urzędu skarbowego',
    who: 'płatnicy zaliczek, pracodawcy, zleceniodawcy',
    note: 'Ostatni dzień stycznia wypada w niedzielę, więc termin przesuwa się na poniedziałek.',
  },
  {
    id: 'forma-opodatkowania',
    month: 1,
    day: 20,
    title: 'Oświadczenie o zmianie formy opodatkowania',
    who: 'osoby fizyczne przechodzące na podatek liniowy lub ryczałt',
    note: 'Składasz do 20. dnia lutego, jeśli zmiana ma obowiązywać od stycznia. Sobota przesuwa termin na poniedziałek.',
  },
  {
    id: 'pit-11-podatnik',
    month: 1,
    day: 28,
    title: 'PIT-11 dla pracownika lub zleceniobiorcy',
    who: 'pracodawcy i zleceniodawcy',
    note: 'Termin to koniec lutego. W 2027 roku 28 lutego to niedziela.',
  },
  {
    id: 'cit-8',
    month: 2,
    day: 31,
    title: 'CIT-8 i sprawozdanie finansowe',
    who: 'spółki z o.o. z rokiem podatkowym równym kalendarzowemu',
    note: 'Deklarację składamy do końca trzeciego miesiąca roku. Sprawozdanie przygotowujemy w tym samym terminie.',
  },
  {
    id: 'pit-roczny',
    month: 3,
    day: 30,
    title: 'PIT-36, PIT-36L, PIT-28, PIT-37 i PIT-38',
    who: 'osoby fizyczne',
    note: 'Roczne zeznanie za poprzedni rok. Zapłatę dopłaty robisz w tym samym dniu.',
  },
  {
    id: 'skladka-zdrowotna',
    month: 4,
    day: 20,
    title: 'Roczne rozliczenie składki zdrowotnej',
    who: 'przedsiębiorcy rozliczani na skali, liniowo lub ryczałtem',
    note: 'Składasz razem z dokumentami rozliczeniowymi ZUS za kwiecień.',
  },
];

export const annualDate = (item: AnnualDeadline): Date =>
  deadlineDate(annualYear, item.month, item.day);

export const monthWindowLength = 12;
