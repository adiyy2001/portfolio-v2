import type { Listing } from '../data/types';

export const pccRate = 0.02;

export const pricePerSquareMeter = (price: number, area: number): number =>
  area > 0 ? Math.round(price / area) : 0;

export const pccTax = (price: number): number => Math.round(price * pccRate);

export const monthlyTotal = (listing: Pick<Listing, 'price' | 'adminFee' | 'utilities'>): number =>
  listing.price + listing.adminFee + (listing.utilities ?? 0);

export const depositFor = (listing: Pick<Listing, 'price' | 'depositMonths'>): number =>
  listing.price * (listing.depositMonths ?? 1);

export const maxDeposit = (rent: number): number => rent * 12;
