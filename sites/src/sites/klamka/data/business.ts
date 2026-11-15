export interface OpeningDay {
  label: string;
  days: number[];
  opens: number | null;
  closes: number | null;
}

export const business = {
  name: 'Klamka',
  tagline: 'Magazyn ofert, Wrocław',
  issue: { number: 11, label: 'Numer 11, listopad 2026' },
  street: 'ul. Bolesława Krzywoustego 313',
  postcode: '51-310',
  city: 'Wrocław',
  district: 'Psie Pole',
  phone: '+48 71 555 01 24',
  phoneHref: 'tel:+48715550124',
  email: 'biuro@klamka.example',
} as const;

export const openingDays: OpeningDay[] = [
  { label: 'Poniedziałek do piątku', days: [1, 2, 3, 4, 5], opens: 9, closes: 18 },
  { label: 'Sobota', days: [6], opens: 10, closes: 14 },
  { label: 'Niedziela', days: [0], opens: null, closes: null },
];

export const hoursSentence =
  'Poniedziałek do piątku 9:00 do 18:00, sobota 10:00 do 14:00, niedziela zamknięte.';

export const figures = {
  sold: 480,
  daysToPreliminary: 66,
  valuationHours: 48,
  commissionPercent: '2,5',
} as const;

export const figuresSentence = `Sprzedaliśmy ${figures.sold} mieszkań. Od pierwszej wyceny do umowy przedwstępnej mija u nas średnio ${figures.daysToPreliminary} dni.`;

export const sampleNotice =
  'To strona przykładowa, więc nic nie zostało wysłane. W prawdziwym biurze oddzwonilibyśmy w godzinach pracy.';
