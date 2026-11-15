import { maxInvoices, plans, type CompanyForm, type Plan } from '../data/plans';
import { invoicesLabel } from './format';

export interface PickerInput {
  form: CompanyForm;
  invoices: number;
  payroll: boolean;
  phone: boolean;
  office: boolean;
  partners: boolean;
}

export interface PickerResult {
  index: number;
  plan: Plan;
  price: number;
  perInvoice: number;
  reasons: string[];
  overLimit: boolean;
}

export const maxTypedInvoices = 999;

export const clampInvoices = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(maxTypedInvoices, Math.round(value)));
};

const indexForInvoices = (invoices: number): number => {
  const index = plans.findIndex(plan => invoices <= plan.limit);
  return index === -1 ? plans.length - 1 : index;
};

export const recommendPlan = (input: PickerInput): PickerResult => {
  const invoices = Math.max(0, Math.round(input.invoices));
  const reasons: string[] = [];
  const byInvoices = indexForInvoices(invoices);
  let index = byInvoices;
  const overLimit = invoices > maxInvoices;
  reasons.push(
    overLimit
      ? `${invoicesLabel(invoices)} w miesiącu to więcej niż limit planu ${plans[byInvoices]!.name} (do ${plans[byInvoices]!.limit}), więc cenę ustalamy indywidualnie`
      : `${invoicesLabel(invoices)} w miesiącu mieści się w limicie planu ${plans[byInvoices]!.name} (do ${plans[byInvoices]!.limit})`,
  );
  const needs: Array<[boolean, number, string]> = [
    [input.payroll, 1, 'listy płac i rozliczenia ZUS pracowników są od planu Średni'],
    [input.phone, 1, 'telefon w godzinach pracy biura jest od planu Średni'],
    [input.office, 2, 'reprezentacja przed urzędem jest tylko w planie Duży'],
    [input.partners, 2, 'rozliczenia z kontrahentami są tylko w planie Duży'],
  ];
  for (const [wanted, minimum, reason] of needs) {
    if (!wanted) continue;
    if (minimum > index) index = minimum;
    reasons.push(reason);
  }
  const plan = plans[index]!;
  const price = plan.price[input.form];
  return {
    index,
    plan,
    price,
    perInvoice: invoices > 0 ? price / invoices : 0,
    reasons,
    overLimit,
  };
};
