export const NBSP = '\u00a0';

export const grossFromNet = (net: number, vatPercent: number): number =>
  Math.round((net * (100 + vatPercent)) / 100);

export const formatPln = (amount: number): string =>
  `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(amount).replace(/\s/g, NBSP)}${NBSP}zł`;
