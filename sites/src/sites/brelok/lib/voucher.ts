import { hotel } from '../data/hotel';
import { addDays, todayIso } from './dates';

export interface Voucher {
  code: string;
  amount: number;
  recipient: string;
  sender: string;
  message: string;
  issued: string;
  validUntil: string;
}

export const maxVoucherMessage = 160;

export const makeVoucherCode = (random: () => number = Math.random): string => {
  const digits = Math.floor(random() * 90000) + 10000;
  return `BON-${digits}`;
};

export const validUntil = (issued: string): string =>
  addDays(issued, Math.round((hotel.voucherMonths * 365) / 12));

export const buildVoucher = (
  input: { amount: number; recipient: string; sender: string; message: string },
  issued: string = todayIso(),
  random: () => number = Math.random,
): Voucher => ({
  code: makeVoucherCode(random),
  amount: input.amount,
  recipient: input.recipient.trim(),
  sender: input.sender.trim(),
  message: input.message.trim(),
  issued,
  validUntil: validUntil(issued),
});

export const isAllowedAmount = (amount: number): boolean =>
  (hotel.voucherAmounts as readonly number[]).includes(amount);
