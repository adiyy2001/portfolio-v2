import { discount } from '../data/site';

export const normalizeCode = (input: string): string => input.trim().toUpperCase();

export const isValidCode = (input: string): boolean => normalizeCode(input) === discount.code;

export const discountAmountGr = (goodsGr: number, code: string): number =>
  isValidCode(code) ? Math.round((goodsGr * discount.percent) / 100) : 0;
