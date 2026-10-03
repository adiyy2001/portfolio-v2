export type PackageId = 'ryczalt' | 'kpir' | 'pelna';
export type BucketId = 'upTo10' | 'upTo30' | 'upTo60' | 'upTo100' | 'upTo150' | 'over150';
export type PricedBucketId = Exclude<BucketId, 'over150'>;

export interface PackageInfo {
  id: PackageId;
  name: string;
  audience: string;
  vatSurcharge: number;
}

export interface DocumentBucket {
  id: BucketId;
  label: string;
  short: string;
  param: string;
}

export const packages: readonly PackageInfo[] = [
  {
    id: 'ryczalt',
    name: 'Ryczałt',
    audience: 'Jednoosobowa firma rozliczana ryczałtem od przychodów ewidencjonowanych.',
    vatSurcharge: 69,
  },
  {
    id: 'kpir',
    name: 'KPiR',
    audience: 'Jednoosobowa firma lub spółka osobowa na skali podatkowej albo podatku liniowym.',
    vatSurcharge: 89,
  },
  {
    id: 'pelna',
    name: 'Pełna księgowość',
    audience: 'Spółka z o.o. i każda firma, która prowadzi księgi rachunkowe.',
    vatSurcharge: 149,
  },
];

export const documentBuckets: readonly DocumentBucket[] = [
  { id: 'upTo10', label: 'do 10 dokumentów', short: 'do 10', param: 'do-10' },
  { id: 'upTo30', label: '11 do 30 dokumentów', short: '11-30', param: '11-30' },
  { id: 'upTo60', label: '31 do 60 dokumentów', short: '31-60', param: '31-60' },
  { id: 'upTo100', label: '61 do 100 dokumentów', short: '61-100', param: '61-100' },
  { id: 'upTo150', label: '101 do 150 dokumentów', short: '101-150', param: '101-150' },
  { id: 'over150', label: 'powyżej 150 dokumentów', short: 'ponad 150', param: 'wiecej' },
];

export const monthlyPrices: Record<PackageId, Record<PricedBucketId, number>> = {
  ryczalt: { upTo10: 229, upTo30: 299, upTo60: 419, upTo100: 579, upTo150: 749 },
  kpir: { upTo10: 299, upTo30: 379, upTo60: 529, upTo100: 719, upTo150: 929 },
  pelna: { upTo10: 690, upTo30: 890, upTo60: 1290, upTo100: 1790, upTo150: 2290 },
};

export const payrollPerPerson = 59;
export const maxPayrollPeople = 20;
export const ksefStartPrice = 390;
export const grossMultiplier = 123;

export const findPackage = (id: PackageId): PackageInfo => {
  const found = packages.find(item => item.id === id);
  if (!found) throw new Error(`Unknown package ${id}`);
  return found;
};

export const findBucket = (id: BucketId): DocumentBucket => {
  const found = documentBuckets.find(item => item.id === id);
  if (!found) throw new Error(`Unknown bucket ${id}`);
  return found;
};

export const isPricedBucket = (id: BucketId): id is PricedBucketId => id !== 'over150';

export interface PricedBucket extends DocumentBucket {
  id: PricedBucketId;
}

export const pricedBuckets: readonly PricedBucket[] = documentBuckets.filter(
  (bucket): bucket is PricedBucket => isPricedBucket(bucket.id),
);

export interface FeatureCell {
  tick: boolean;
  text?: string;
}

export interface FeatureRow {
  label: string;
  cells: Record<PackageId, FeatureCell>;
}

const everywhere = (text?: string): Record<PackageId, FeatureCell> => ({
  ryczalt: { tick: true, text },
  kpir: { tick: true, text },
  pelna: { tick: true, text },
});

export const includedFeatures: readonly FeatureRow[] = [
  { label: 'Księgowanie dokumentów w limicie z cennika', cells: everywhere() },
  { label: 'Odbiór faktur z KSeF i ich księgowanie', cells: everywhere() },
  {
    label: 'Ewidencja i zaliczki na podatek dochodowy',
    cells: {
      ryczalt: { tick: true, text: 'ewidencja przychodów' },
      kpir: { tick: true, text: 'księga przychodów i rozchodów' },
      pelna: { tick: true, text: 'księgi rachunkowe' },
    },
  },
  {
    label: 'Roczne rozliczenie',
    cells: {
      ryczalt: { tick: true, text: 'PIT-28' },
      kpir: { tick: true, text: 'PIT-36 lub PIT-36L' },
      pelna: { tick: true, text: 'CIT-8 lub PIT, bilans i rachunek zysków i strat' },
    },
  },
  { label: 'Rozliczenie składek ZUS właściciela lub wspólników', cells: everywhere() },
  { label: 'Przypomnienia o terminach 15., 20. i 25.', cells: everywhere() },
  { label: 'Stały opiekun i odpowiedź na e-mail w 1 dzień roboczy', cells: everywhere() },
];

export const surchargeRows: readonly FeatureRow[] = [
  {
    label: 'VAT i JPK_V7, miesięcznie netto',
    cells: {
      ryczalt: { tick: false, text: '+69 zł' },
      kpir: { tick: false, text: '+89 zł' },
      pelna: { tick: false, text: '+149 zł' },
    },
  },
  {
    label: 'Kadry i płace, za osobę miesięcznie netto',
    cells: {
      ryczalt: { tick: false, text: '59 zł' },
      kpir: { tick: false, text: '59 zł' },
      pelna: { tick: false, text: '59 zł' },
    },
  },
  {
    label: 'Start z KSeF: dostęp, uprawnienia i pierwsza faktura',
    cells: {
      ryczalt: { tick: true, text: '0 zł dla klientów' },
      kpir: { tick: true, text: '0 zł dla klientów' },
      pelna: { tick: true, text: '0 zł dla klientów' },
    },
  },
];
