import { facts } from './site';

export type CompanyForm = 'osoba' | 'spolka';

export interface Plan {
  id: 'maly' | 'sredni' | 'duzy';
  name: string;
  no: string;
  limit: number;
  price: Record<CompanyForm, number>;
  example: string;
}

export const plans: readonly Plan[] = [
  {
    id: 'maly',
    name: 'Mały',
    no: '01',
    limit: 30,
    price: { osoba: 190, spolka: 390 },
    example: 'Ewa Rutkowska Fotografia',
  },
  {
    id: 'sredni',
    name: 'Średni',
    no: '02',
    limit: 100,
    price: { osoba: 390, spolka: 690 },
    example: 'Studio Brzoza',
  },
  {
    id: 'duzy',
    name: 'Duży',
    no: '03',
    limit: 200,
    price: { osoba: 690, spolka: 1090 },
    example: 'Hurtownia Ostoja',
  },
];

export const maxInvoices = plans[plans.length - 1]!.limit;
export const vatRate = 0.23;

export interface Feature {
  id: string;
  label: string;
  note: string;
  inPlan: readonly [boolean, boolean, boolean];
}

export const features: readonly Feature[] = [
  {
    id: 'ewidencja',
    label: 'ewidencja przychodów i kosztów',
    note: 'Księga przychodów i rozchodów, ryczałt albo księgi handlowe, zależnie od formy firmy.',
    inPlan: [true, true, true],
  },
  {
    id: 'vat',
    label: 'rozliczenie VAT i JPK_V7',
    note: 'Deklaracja i plik JPK_V7 wysyłamy do 25. dnia miesiąca.',
    inPlan: [true, true, true],
  },
  {
    id: 'zus-pit',
    label: 'składki ZUS i zaliczki na PIT lub CIT',
    note: 'Wyliczamy kwoty, terminy i numery rachunków do przelewów.',
    inPlan: [true, true, true],
  },
  {
    id: 'mail',
    label: 'kontakt mailowy z biurem',
    note: `Odpowiedź w ciągu ${facts.replyHours} godzin w dni robocze.`,
    inPlan: [true, true, true],
  },
  {
    id: 'place',
    label: 'listy płac i rozliczenia ZUS',
    note: 'Umowy o pracę i zlecenia, listy płac, deklaracje ZUS, zwolnienia i urlopy.',
    inPlan: [false, true, true],
  },
  {
    id: 'raport',
    label: 'raport miesięczny dla właściciela',
    note: 'Przychody, koszty, zobowiązania i wynik firmy na jednej stronie, do 10. dnia miesiąca.',
    inPlan: [false, true, true],
  },
  {
    id: 'telefon',
    label: 'telefon w godzinach pracy biura',
    note: 'Dzwonisz na numer biura i rozmawiasz z osobą, która zna Twoje księgi.',
    inPlan: [false, true, true],
  },
  {
    id: 'urzad',
    label: 'reprezentacja przed urzędem',
    note: 'Pełnomocnictwo i rozmowy z urzędem skarbowym oraz ZUS prowadzimy my.',
    inPlan: [false, false, true],
  },
  {
    id: 'kontrahenci',
    label: 'rozliczenia z kontrahentami',
    note: 'Uzgadniamy salda, wezwania do zapłaty i noty odsetkowe.',
    inPlan: [false, false, true],
  },
  {
    id: 'opiekun',
    label: 'stały opiekun w biurze',
    note: 'Jedna osoba prowadzi Twoją firmę od przejęcia ksiąg do zamknięcia roku.',
    inPlan: [false, false, true],
  },
];

export const extras = [
  {
    id: 'przejecie',
    label: 'Przejęcie ksiąg od innego biura',
    price: facts.takeoverFee,
    unit: 'jednorazowo, netto',
    note: 'W planie Duży bez opłaty. Zwykle trwa dwa tygodnie.',
  },
  {
    id: 'ponad-limit',
    label: 'Więcej faktur niż limit planu',
    price: 0,
    unit: 'bez dopłat za sztukę',
    note: 'Przechodzisz na wyższy plan od następnego miesiąca. Powyżej 200 faktur wyceniamy osobno.',
  },
] as const;

export const planIndexFor = (invoices: number): number => {
  const index = plans.findIndex(plan => invoices <= plan.limit);
  return index === -1 ? plans.length - 1 : index;
};

export const grossFrom = (net: number): number => Math.round(net * (1 + vatRate) * 100) / 100;
