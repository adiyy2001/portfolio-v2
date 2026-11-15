import { grindLabels } from '../data/facets';
import { computeTotals, resolveLines } from './cart';
import type { CartState } from './cart';
import type { CheckoutValues } from './validation';

export interface ConfirmationLine {
  name: string;
  grind: string;
  quantity: number;
  totalGr: number;
}

export interface ConfirmationData {
  reference: string;
  name: string;
  email: string;
  phone: string;
  pickupLabel: string;
  pickupWindow: string;
  note: string;
  lines: ConfirmationLine[];
  totalGr: number;
}

export const confirmationStorageKey = 'ziarnik:confirmation:v1';

export const makeReference = (random: () => number): string =>
  `ZR-${1000 + Math.floor(random() * 9000)}`;

export const buildConfirmation = (
  values: CheckoutValues,
  state: CartState,
  pickupLabel: string,
  reference: string,
): ConfirmationData | null => {
  const lines = resolveLines(state);
  if (lines.length === 0) return null;
  return {
    reference,
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    pickupLabel,
    pickupWindow: values.pickupWindow,
    note: values.note.trim(),
    lines: lines.map(entry => ({
      name: entry.coffee.name,
      grind: grindLabels[entry.line.grind],
      quantity: entry.line.quantity,
      totalGr: entry.totalGr,
    })),
    totalGr: computeTotals(state).totalGr,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const parseLine = (entry: unknown): ConfirmationLine | null => {
  if (!isRecord(entry)) return null;
  const { name, grind, quantity, totalGr } = entry;
  if (typeof name !== 'string' || typeof grind !== 'string') return null;
  if (!isNumber(quantity) || !isNumber(totalGr)) return null;
  return { name, grind, quantity, totalGr };
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
  const { reference, name, email, phone, pickupLabel, pickupWindow, note, totalGr } = data;
  if (
    typeof reference !== 'string' ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof phone !== 'string' ||
    typeof pickupLabel !== 'string' ||
    typeof pickupWindow !== 'string' ||
    typeof note !== 'string' ||
    !isNumber(totalGr)
  ) {
    return null;
  }
  const lines = data.lines.map(parseLine);
  if (lines.length === 0 || lines.some(line => line === null)) return null;
  return {
    reference,
    name,
    email,
    phone,
    pickupLabel,
    pickupWindow,
    note,
    lines: lines.filter((line): line is ConfirmationLine => line !== null),
    totalGr,
  };
};
