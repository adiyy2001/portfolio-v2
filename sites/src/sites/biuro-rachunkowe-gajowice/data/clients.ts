export type ClientForm = 'jdg' | 'spolka';

export interface Client {
  id: string;
  name: string;
  form: ClientForm;
  nip: string;
  seed: number;
  invoices: number;
  sales: number;
  cost: number;
  vatShare: number;
  vatOut: number;
  taxRate: number;
  zus: number;
  zusVar: number;
  zusDed: number;
  staff: number;
  taxName: string;
  rateLabel: string;
}

export const clients: readonly Client[] = [
  {
    id: 'K-0107',
    name: 'Ewa Rutkowska Fotografia',
    form: 'jdg',
    nip: '897 000 11 07',
    seed: 107,
    invoices: 14,
    sales: 1180000,
    cost: 0.31,
    vatShare: 1,
    vatOut: 0.23,
    taxRate: 0.19,
    zus: 235930,
    zusVar: 0,
    zusDed: 192676,
    staff: 0,
    taxName: 'zaliczka PIT',
    rateLabel: 'podatek liniowy 19%',
  },
  {
    id: 'K-0112',
    name: 'Studio Brzoza',
    form: 'jdg',
    nip: '897 000 11 12',
    seed: 112,
    invoices: 85,
    sales: 4620000,
    cost: 0.52,
    vatShare: 1,
    vatOut: 0.23,
    taxRate: 0.19,
    zus: 235930,
    zusVar: 0,
    zusDed: 192676,
    staff: 0,
    taxName: 'zaliczka PIT',
    rateLabel: 'podatek liniowy 19%',
  },
  {
    id: 'K-0131',
    name: 'Dev Nova sp. z o.o.',
    form: 'spolka',
    nip: '897 000 13 12',
    seed: 131,
    invoices: 99,
    sales: 8200000,
    cost: 0.64,
    vatShare: 0.45,
    vatOut: 0.23,
    taxRate: 0.09,
    zus: 1198432,
    zusVar: 90000,
    zusDed: 0,
    staff: 4,
    taxName: 'zaliczka CIT',
    rateLabel: 'CIT 9%',
  },
  {
    id: 'K-0144',
    name: 'Drukarnia Pod Dębem sp. z o.o.',
    form: 'spolka',
    nip: '897 000 14 41',
    seed: 144,
    invoices: 96,
    sales: 12840000,
    cost: 0.78,
    vatShare: 0.6,
    vatOut: 0.23,
    taxRate: 0.09,
    zus: 1522740,
    zusVar: 120000,
    zusDed: 0,
    staff: 6,
    taxName: 'zaliczka CIT',
    rateLabel: 'CIT 9%',
  },
  {
    id: 'K-0158',
    name: 'Hałas Tłumaczenia',
    form: 'jdg',
    nip: '897 000 15 83',
    seed: 158,
    invoices: 64,
    sales: 5830000,
    cost: 0.57,
    vatShare: 1,
    vatOut: 0.23,
    taxRate: 0.19,
    zus: 235930,
    zusVar: 0,
    zusDed: 192676,
    staff: 0,
    taxName: 'zaliczka PIT',
    rateLabel: 'podatek liniowy 19%',
  },
  {
    id: 'K-0173',
    name: 'Hurtownia Ostoja sp. z o.o.',
    form: 'spolka',
    nip: '897 000 17 35',
    seed: 173,
    invoices: 163,
    sales: 41260000,
    cost: 0.86,
    vatShare: 0.92,
    vatOut: 0.23,
    taxRate: 0.09,
    zus: 2648010,
    zusVar: 200000,
    zusDed: 0,
    staff: 9,
    taxName: 'zaliczka CIT',
    rateLabel: 'CIT 9%',
  },
];

export const buyers = [
  'Wrocławskie Zakłady Cyfrowe',
  'Trans Północ Logistyka',
  'Fabryka Opakowań',
  'Pracownia Ceramiki Sowa',
  'Wydawnictwo Pod Lipami',
  'Studio Tarcza',
  'Park Południowy sp. z o.o.',
  'Agencja Rondo',
  'Szkoła Językowa Lingua',
  'Meble Dąbrowski',
  'Zakład Poligraficzny Przy Młynie',
  'Biuro Projektów Linia',
  'Klub Sportowy Orlik',
  'Stolarnia Bora',
  'Elektro Hurt Nowak',
  'Księgarnia Zakątek',
] as const;
