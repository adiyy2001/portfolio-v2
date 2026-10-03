import type { Step } from './areas';

export const firstContactSteps: Step[] = [
  {
    title: 'Piszesz albo dzwonisz',
    duration: 'dzień zero',
    text: 'Formularz zajmuje dwie minuty: imię, telefon lub e-mail i kilka zdań o sprawie. Możesz też zadzwonić do asystentki.',
  },
  {
    title: 'Oddzwaniamy',
    duration: 'do jednego dnia roboczego',
    text: 'Radca dzwoni w godzinach, które wskażesz w formularzu. Nie musisz czekać przy telefonie cały dzień.',
  },
  {
    title: 'Pierwsza rozmowa',
    duration: 'do 20 minut, bez opłaty',
    text: 'Mówisz, o co chodzi. My mówimy, czy możemy pomóc, czego będziemy potrzebować i jak to się zwykle toczy.',
  },
  {
    title: 'Wycena na piśmie',
    duration: 'do dwóch dni roboczych',
    text: 'Zakres, termin i kwota. Zaczynamy dopiero po twojej akceptacji, a cena nie rośnie bez uzgodnienia.',
  },
];

export interface PriceRow {
  service: string;
  netFrom: number;
  exact?: boolean;
  per?: string;
}

export const priceHighlights: PriceRow[] = [
  { service: 'Konsultacja prawna, 60 minut', netFrom: 380, exact: true },
  { service: 'Wezwanie do zapłaty', netFrom: 350 },
  { service: 'Przegląd umowy do 10 stron', netFrom: 900 },
  { service: 'Analiza umowy najmu lokalu', netFrom: 1200 },
  { service: 'Umowa spółki z o.o. i wniosek do KRS', netFrom: 1800 },
];
