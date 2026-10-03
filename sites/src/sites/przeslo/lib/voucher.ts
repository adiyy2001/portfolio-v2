import { addMonths, dayFromParts } from './dates';
import type { Day } from './dates';
import { quoteStay } from './pricing';

export type VoucherKind = 'amount' | 'package';

export interface VoucherDraft {
  kind: VoucherKind;
  amount: number;
  recipient: string;
  sender: string;
  message: string;
}

export const voucherAmounts: readonly number[] = [200, 400, 600, 1000];
export const minVoucherAmount = 100;
export const maxVoucherAmount = 3000;
export const voucherAmountStep = 50;
export const maxMessageLength = 240;
export const maxNameLength = 60;
export const voucherValidityMonths = 12;

const referenceQuote = quoteStay({
  arrival: dayFromParts(2027, 1, 15),
  nights: 2,
  guests: 2,
  roomType: 'klasyczny',
  rate: 'flexible',
  extras: {},
  weekendPackage: true,
});

export const weekendVoucherPrice = Math.round(referenceQuote.total / 10) * 10;

export const emptyVoucher: VoucherDraft = {
  kind: 'amount',
  amount: 400,
  recipient: '',
  sender: '',
  message: '',
};

export const voucherValue = (draft: VoucherDraft): number =>
  draft.kind === 'package' ? weekendVoucherPrice : draft.amount;

export const voucherExpiry = (purchaseDay: Day): Day =>
  addMonths(purchaseDay, voucherValidityMonths);

export type VoucherProblem = 'required' | 'tooLong' | 'invalidAmount';

export interface VoucherErrors {
  amount?: VoucherProblem;
  recipient?: VoucherProblem;
  sender?: VoucherProblem;
  message?: VoucherProblem;
}

export const isValidVoucherAmount = (amount: number): boolean =>
  Number.isInteger(amount) &&
  amount >= minVoucherAmount &&
  amount <= maxVoucherAmount &&
  amount % voucherAmountStep === 0;

export const validateVoucher = (draft: VoucherDraft): VoucherErrors => {
  const errors: VoucherErrors = {};
  if (draft.kind === 'amount' && !isValidVoucherAmount(draft.amount)) {
    errors.amount = 'invalidAmount';
  }
  const recipient = draft.recipient.trim();
  if (recipient === '') errors.recipient = 'required';
  else if (recipient.length > maxNameLength) errors.recipient = 'tooLong';
  const sender = draft.sender.trim();
  if (sender === '') errors.sender = 'required';
  else if (sender.length > maxNameLength) errors.sender = 'tooLong';
  if (draft.message.length > maxMessageLength) errors.message = 'tooLong';
  return errors;
};

const codeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const codeGroup = (random: () => number): string => {
  let group = '';
  for (let index = 0; index < 4; index += 1) {
    group += codeAlphabet.charAt(Math.floor(random() * codeAlphabet.length) % codeAlphabet.length);
  }
  return group;
};

export const generateVoucherCode = (random: () => number): string =>
  `PRZ-BON-${codeGroup(random)}-${codeGroup(random)}`;
