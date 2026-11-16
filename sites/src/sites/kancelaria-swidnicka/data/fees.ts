import { grossFromNet } from '../lib/money';
import { firm } from './site';

export const hourlyNetPln = 400;
export const hourlyGrossPln = grossFromNet(hourlyNetPln, firm.vatPercent);
export const billingStepMinutes = 15;
export const invoiceDueDays = 14;
export const advanceSharePercent = 50;

export interface FixedFee {
  id: string;
  areaSlug: string;
  title: string;
  scope: string;
  netPln: number;
}

export const fixedFees: FixedFee[] = [
  {
    id: 'opinia',
    areaSlug: 'umowy',
    title: 'Opinia na piśmie',
    scope: 'Analiza dokumentów, do 90 minut pracy, pisemna opinia z drogami wyjścia.',
    netPln: 600,
  },
  {
    id: 'najem',
    areaSlug: 'umowy',
    title: 'Umowa najmu mieszkania',
    scope: 'Projekt umowy dla wynajmującego albo najemcy, jedna runda poprawek.',
    netPln: 600,
  },
  {
    id: 'cudza-umowa',
    areaSlug: 'umowy',
    title: 'Przegląd umowy od drugiej strony',
    scope: 'Do 15 stron z załącznikami, lista zapisów ryzykownych i propozycje zmian.',
    netPln: 700,
  },
  {
    id: 'rozwod',
    areaSlug: 'rodzina',
    title: 'Rozwód bez orzekania o winie',
    scope: 'Pozew, przygotowanie do rozprawy i obecność na rozprawach w pierwszej instancji.',
    netPln: 3000,
  },
  {
    id: 'alimenty',
    areaSlug: 'rodzina',
    title: 'Pozew o alimenty na dziecko',
    scope: 'Pozew z dowodami i obecność na pierwszej rozprawie.',
    netPln: 1500,
  },
  {
    id: 'stwierdzenie-spadku',
    areaSlug: 'spadki',
    title: 'Stwierdzenie nabycia spadku',
    scope: 'Wniosek do sądu i obecność na jednym terminie.',
    netPln: 1500,
  },
  {
    id: 'zachowek',
    areaSlug: 'spadki',
    title: 'Pozew o zachowek',
    scope: 'Wezwanie do zapłaty, pozew i obecność na pierwszej rozprawie.',
    netPln: 2500,
  },
  {
    id: 'zalozenie-spolki',
    areaSlug: 'spolki',
    title: 'Założenie spółki z o.o.',
    scope: 'Umowa spółki, uchwały i wniosek do rejestru firm.',
    netPln: 2000,
  },
  {
    id: 'umowa-wspolnikow',
    areaSlug: 'spolki',
    title: 'Umowa między wspólnikami',
    scope: 'Spotkanie ze wspólnikami, projekt umowy i jedna runda poprawek.',
    netPln: 3000,
  },
  {
    id: 'zmiany-krs',
    areaSlug: 'spolki',
    title: 'Zmiany w rejestrze firm',
    scope: 'Uchwała wspólników i wniosek o wpis zmiany.',
    netPln: 800,
  },
];

export const grossOf = (netPln: number): number => grossFromNet(netPln, firm.vatPercent);

export const feesForArea = (areaSlug: string): FixedFee[] =>
  fixedFees.filter(fee => fee.areaSlug === areaSlug);
