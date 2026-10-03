import type {
  Condition,
  Extra,
  Heating,
  Lease,
  Market,
  Ownership,
  PropertyType,
  Transaction,
} from './types';

export const transactionLabel: Record<Transaction, string> = {
  sprzedaz: 'Sprzedaż',
  wynajem: 'Wynajem',
};

export const typeLabel: Record<PropertyType, string> = {
  mieszkanie: 'Mieszkanie',
  dom: 'Dom',
};

export const extraLabel: Record<Extra, string> = {
  balkon: 'Balkon',
  ogrod: 'Ogród',
  winda: 'Winda',
  parking: 'Miejsce parkingowe',
  piwnica: 'Piwnica',
  umeblowane: 'Umeblowane',
  zwierzeta: 'Zwierzęta mile widziane',
};

export const extraOrder: readonly Extra[] = [
  'balkon',
  'ogrod',
  'winda',
  'parking',
  'piwnica',
  'umeblowane',
  'zwierzeta',
];

export const conditionLabel: Record<Condition, string> = {
  'do-remontu': 'do remontu',
  dobry: 'dobry',
  'po-remoncie': 'po remoncie',
  'stan-deweloperski': 'stan deweloperski',
  nowy: 'nowy',
};

export const heatingLabel: Record<Heating, string> = {
  miejskie: 'miejskie',
  gazowe: 'gazowe',
  elektryczne: 'elektryczne',
  'pompa-ciepla': 'pompa ciepła',
};

export const ownershipLabel: Record<Ownership, string> = {
  wlasnosc: 'odrębna własność z księgą wieczystą',
  spoldzielcze: 'spółdzielcze własnościowe prawo do lokalu',
};

export const marketLabel: Record<Market, string> = {
  wtorny: 'wtórny',
  pierwotny: 'pierwotny',
};

export const leaseLabel: Record<Lease, string> = {
  zwykly: 'zwykła umowa najmu',
  okazjonalny: 'najem okazjonalny',
};

export const floorBandLabel = {
  parter: 'Parter',
  niskie: '1. i 2. piętro',
  srednie: '3. do 5. piętra',
  wysokie: '6. piętro i wyżej',
} as const;

export const sortLabel = {
  najnowsze: 'Najnowsze',
  'cena-rosnaco': 'Cena: od najniższej',
  'cena-malejaco': 'Cena: od najwyższej',
  'cena-za-m2': 'Cena za m²: od najniższej',
  powierzchnia: 'Powierzchnia: od największej',
} as const;
