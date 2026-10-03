import { parseDecimal, type ErrorMap } from './validation';
import type { InstalmentKind, LoanInput } from './mortgage';

export type LoanField = 'price' | 'downPayment' | 'years' | 'rate';

export interface LoanFormValues {
  price: string;
  downPayment: string;
  years: string;
  rate: string;
  kind: InstalmentKind;
}

export interface LoanFormResult {
  errors: ErrorMap<LoanField>;
  input: LoanInput | null;
}

interface FieldRule {
  field: LoanField;
  name: string;
  minimum: number;
  maximum: number;
  unit: string;
}

const rules: readonly FieldRule[] = [
  { field: 'price', name: 'cenę mieszkania', minimum: 50_000, maximum: 20_000_000, unit: 'zł' },
  { field: 'downPayment', name: 'wkład własny', minimum: 0, maximum: 90, unit: '%' },
  { field: 'years', name: 'okres kredytu', minimum: 1, maximum: 35, unit: 'lat' },
  { field: 'rate', name: 'oprocentowanie', minimum: 0, maximum: 25, unit: '%' },
];

const rangeText = (rule: FieldRule): string => {
  const minimum = String(rule.minimum).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const maximum = String(rule.maximum).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `od ${minimum} do ${maximum} ${rule.unit}`;
};

const checkField = (rule: FieldRule, text: string): { value: number | null; error?: string } => {
  if (text.trim().length === 0) return { value: null, error: `Podaj ${rule.name}.` };
  const value = parseDecimal(text);
  if (value === null) return { value: null, error: `Wpisz ${rule.name} jako liczbę.` };
  if (value < rule.minimum || value > rule.maximum) {
    return { value: null, error: `Wpisz ${rule.name} w zakresie ${rangeText(rule)}.` };
  }
  return { value };
};

export const parseLoanForm = (values: LoanFormValues): LoanFormResult => {
  const errors: ErrorMap<LoanField> = {};
  const parsed: Partial<Record<LoanField, number>> = {};
  for (const rule of rules) {
    const result = checkField(rule, values[rule.field]);
    if (result.error) errors[rule.field] = result.error;
    else if (result.value !== null) parsed[rule.field] = result.value;
  }
  const { price, downPayment, years, rate } = parsed;
  if (
    Object.keys(errors).length > 0 ||
    price === undefined ||
    downPayment === undefined ||
    years === undefined ||
    rate === undefined
  ) {
    return { errors, input: null };
  }
  return {
    errors,
    input: {
      price,
      downPaymentPercent: downPayment,
      years,
      annualRatePercent: rate,
      kind: values.kind,
    },
  };
};
