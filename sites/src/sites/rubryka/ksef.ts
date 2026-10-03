import { type CalendarDate, daysBetween } from './deadlines';
import { formatZloty } from './format';

export type Buyers = 'business' | 'consumers' | 'both';
export type MonthlySales = 'upTo10k' | 'over10k' | 'exceeded';
export type KsefVerdict = 'mandatory' | 'relief' | 'optional';

export interface KsefInput {
  buyers: Buyers;
  sales: MonthlySales;
}

export interface KsefAnswer {
  verdict: KsefVerdict;
  headline: string;
  points: string[];
  daysToDeadline: number | null;
}

const reliefEnd: CalendarDate = { year: 2026, month: 12, day: 31 };
const mandatoryFor2027: CalendarDate = { year: 2027, month: 1, day: 1 };
const limitGrosze = 1_000_000;
const receivingPoint =
  'Faktury od dostawców, którzy wystawiają je w KSeF, odbierasz tam od 1 lutego 2026 r. Faktura jest doręczona w dniu nadania numeru KSeF, a system nie wysyła powiadomień, więc ktoś musi do niego zaglądać.';

export const checkKsef = (input: KsefInput, today: CalendarDate): KsefAnswer => {
  if (input.buyers === 'consumers') {
    return {
      verdict: 'optional',
      headline: 'Faktury dla konsumentów nie muszą być w KSeF.',
      points: [
        'Możesz je tam wystawiać dobrowolnie, ale obowiązku nie ma. Paragony z kasy też zostają poza KSeF.',
        'Obowiązek obejmuje faktury dla firm. Gdy zaczniesz sprzedawać firmom, wróć do tego sprawdzenia.',
        receivingPoint,
      ],
      daysToDeadline: null,
    };
  }

  const reliefOver = daysBetween(today, reliefEnd) < 0;
  const consumerNote =
    input.buyers === 'both'
      ? [
          'Faktury dla konsumentów i sprzedaż z kasy nie liczą się do limitu i nie muszą być w KSeF.',
        ]
      : [];

  if (input.sales !== 'upTo10k' || reliefOver) {
    const exceededNote =
      input.sales === 'upTo10k'
        ? []
        : [
            'Limit liczysz według daty wystawienia faktury. Po jego przekroczeniu KSeF obowiązuje od tej faktury i każdej kolejnej, także w miesiącach, w których sprzedaż spadnie poniżej limitu.',
          ];
    return {
      verdict: 'mandatory',
      headline: reliefOver
        ? 'Od 1 stycznia 2027 r. wystawiasz faktury dla firm w KSeF.'
        : 'Faktury dla firm wystawiasz już w KSeF.',
      points: [
        'Fakturę wystawiasz w KSeF jako plik XML i dostaje ona numer KSeF. Papier albo PDF wysłany mailem przestaje wystarczać, poza trybami awaryjnymi opisanymi w przewodniku.',
        ...exceededNote,
        ...consumerNote,
        'Kary pieniężne za naruszenia obowiązku KSeF obejmują naruszenia od 1 stycznia 2027 r.',
        receivingPoint,
      ],
      daysToDeadline: null,
    };
  }

  return {
    verdict: 'relief',
    headline: 'Do końca 2026 r. możesz jeszcze wystawiać faktury poza KSeF.',
    points: [
      `Warunek: faktury dla firm wystawione w danym miesiącu nie przekraczają łącznie ${formatZloty(limitGrosze)} brutto. Pierwsza faktura, która przekroczy limit, uruchamia KSeF na stałe.`,
      'Od 1 stycznia 2027 r. wyjątku nie ma: wszystkie faktury dla firm wystawiasz w KSeF, a kary obowiązują od tego dnia.',
      ...consumerNote,
      receivingPoint,
    ],
    daysToDeadline: daysBetween(today, mandatoryFor2027),
  };
};
