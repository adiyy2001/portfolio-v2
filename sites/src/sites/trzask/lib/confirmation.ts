import { deliveryMethods, paymentMethods } from '../data/site';
import type { DeliveryId, PaymentId } from '../data/site';
import { grindLabels } from '../data/facets';
import { computeTotals, resolveLines } from './cart';
import type { CartState } from './cart';
import { formatGrams } from './money';
import type { CheckoutValues } from './validation';

export interface ConfirmationLine {
  name: string;
  options: string;
  quantity: number;
  totalGr: number;
}

export interface ConfirmationData {
  firstName: string;
  email: string;
  delivery: DeliveryId;
  payment: PaymentId;
  code: string;
  lines: ConfirmationLine[];
  goodsGr: number;
  discountGr: number;
  deliveryGr: number;
  totalGr: number;
}

export const confirmationStorageKey = 'trzask:confirmation:v1';

export const buildConfirmation = (
  values: CheckoutValues,
  state: CartState,
): ConfirmationData | null => {
  const delivery = deliveryMethods.find(method => method.id === values.delivery);
  const payment = paymentMethods.find(method => method.id === values.payment);
  if (!delivery || !payment) return null;
  const totals = computeTotals(state, delivery.id);
  return {
    firstName: values.firstName.trim(),
    email: values.email.trim(),
    delivery: delivery.id,
    payment: payment.id,
    code: state.code,
    lines: resolveLines(state).map(entry => ({
      name: entry.product.name,
      options:
        entry.line.weight && entry.line.grind
          ? `${formatGrams(entry.line.weight)}, ${grindLabels[entry.line.grind]}`
          : '',
      quantity: entry.line.quantity,
      totalGr: entry.totalGr,
    })),
    goodsGr: totals.goodsGr,
    discountGr: totals.discountGr,
    deliveryGr: totals.deliveryGr,
    totalGr: totals.totalGr,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const parseLine = (entry: unknown): ConfirmationLine | null => {
  if (!isRecord(entry)) return null;
  const { name, options, quantity, totalGr } = entry;
  if (typeof name !== 'string' || typeof options !== 'string') return null;
  if (!isNumber(quantity) || !isNumber(totalGr)) return null;
  return { name, options, quantity, totalGr };
};

export const parseConfirmation = (raw: string | null): ConfirmationData | null => {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data) || !Array.isArray(data.lines)) return null;
  const { firstName, email, delivery, payment, code, goodsGr, discountGr, deliveryGr, totalGr } =
    data;
  const deliveryMethod = deliveryMethods.find(method => method.id === delivery);
  const paymentMethod = paymentMethods.find(method => method.id === payment);
  if (!deliveryMethod || !paymentMethod) return null;
  if (typeof firstName !== 'string' || typeof email !== 'string' || typeof code !== 'string') {
    return null;
  }
  if (![goodsGr, discountGr, deliveryGr, totalGr].every(isNumber)) return null;
  const lines = data.lines.map(parseLine);
  if (lines.some(line => line === null)) return null;
  return {
    firstName,
    email,
    delivery: deliveryMethod.id,
    payment: paymentMethod.id,
    code,
    lines: lines.filter((line): line is ConfirmationLine => line !== null),
    goodsGr: Number(goodsGr),
    discountGr: Number(discountGr),
    deliveryGr: Number(deliveryGr),
    totalGr: Number(totalGr),
  };
};
