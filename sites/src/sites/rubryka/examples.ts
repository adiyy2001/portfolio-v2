import type { QuoteInput } from './quote';

export interface PriceExample {
  title: string;
  description: string;
  input: QuoteInput;
}

export const priceExamples: readonly PriceExample[] = [
  {
    title: 'Gabinet kosmetyczny',
    description: 'Jednoosobowa firma na ryczałcie, 25 dokumentów miesięcznie, zwolniona z VAT.',
    input: { businessType: 'ryczalt', documents: 'upTo30', employees: 0, vat: 'exempt' },
  },
  {
    title: 'Sklep internetowy',
    description: 'Jednoosobowa firma na KPiR, 80 dokumentów miesięcznie, VAT i jeden pracownik.',
    input: { businessType: 'kpir', documents: 'upTo100', employees: 1, vat: 'active' },
  },
  {
    title: 'Agencja reklamowa',
    description: 'Spółka z o.o., 45 dokumentów miesięcznie, VAT i czterech pracowników.',
    input: { businessType: 'spolka', documents: 'upTo60', employees: 4, vat: 'active' },
  },
];
