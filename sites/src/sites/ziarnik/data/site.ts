import type { Degree } from './types';

export const business = {
  name: 'Ziarnik',
  trade: 'Palarnia kawy, Wrocław, Nadodrze',
  email: 'kontakt@ziarnik.example',
  phone: '+48 71 555 01 07',
  phoneHref: 'tel:+48715550107',
  street: 'ul. Jedności Narodowej 65',
  postcode: '50-262',
  city: 'Wrocław',
  district: 'Nadodrze',
} as const;

export const roaster = {
  name: 'Hubert Wojciechowski',
  years: 8,
  certificate: 'SCA Roasting Foundation',
} as const;

export const weekdayHours: [number, number] = [8, 18];

export const saturdayHours: [number, number] = [9, 15];

export type OpeningSchedule = Record<number, [number, number] | null>;

export const openingSchedule: OpeningSchedule = {
  0: null,
  1: weekdayHours,
  2: weekdayHours,
  3: weekdayHours,
  4: weekdayHours,
  5: weekdayHours,
  6: saturdayHours,
};

export const closedDates: string[] = [
  '2026-11-11',
  '2026-12-24',
  '2026-12-25',
  '2026-12-26',
  '2027-01-01',
  '2027-01-06',
  '2027-03-28',
  '2027-03-29',
  '2027-05-01',
  '2027-05-03',
  '2027-05-16',
  '2027-05-27',
  '2027-08-15',
  '2027-11-01',
  '2027-11-11',
  '2027-12-24',
  '2027-12-25',
  '2027-12-26',
];

export const pickupWindows: Record<'weekday' | 'saturday', Array<[number, number]>> = {
  weekday: [
    [8, 11],
    [11, 14],
    [14, 18],
  ],
  saturday: [
    [9, 12],
    [12, 15],
  ],
};

const nbsp = '\u00a0';

export const formatHours = ([from, to]: [number, number]): string => `${from}:00 do ${to}:00`;

export const openingRows: Array<[string, string]> = [
  ['Pon do pt', formatHours(weekdayHours)],
  ['Sobota', formatHours(saturdayHours)],
  ['Niedziela', 'nieczynne'],
];

export const numbers = {
  scaleSteps: 12,
  plantations: 9,
  currentFiltrBatch: 31,
  batchesThisYear: 38,
  batchKg: 12,
  restDays: 4,
  waterTemperature: 94,
  bagGrams: 250,
  maxLineQuantity: 10,
} as const;

export const degreePriceZl: Record<Degree, number> = { 3: 52, 6: 44, 9: 46 };

export const pickupLeadNote = `Worek czeka w${nbsp}palarni od następnego dnia otwarcia.`;

export const sampleNotice = 'To strona przykładowa, więc nic nie zostało wysłane.';

export const orderStatement =
  'Zamawiasz tutaj, telefonem albo mailem, odbierasz w palarni i płacisz przy odbiorze. Wysyłki nie robię.';

export const subscriptionTerms = {
  degree: 6 as Degree,
  everyDays: 7,
  cutoff: 'do czwartku',
  maxBags: 3,
} as const;
