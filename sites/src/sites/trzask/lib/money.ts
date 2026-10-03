const nbsp = '\u00a0';
const minus = '\u2212';

const groupThousands = (digits: string): string => digits.replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);

export const formatPln = (grosze: number, compact = false): string => {
  const negative = grosze < 0;
  const absolute = Math.abs(Math.round(grosze));
  const zloty = Math.floor(absolute / 100);
  const rest = absolute % 100;
  const zlotyText = zloty >= 10000 ? groupThousands(String(zloty)) : String(zloty);
  const body = compact && rest === 0 ? zlotyText : `${zlotyText},${String(rest).padStart(2, '0')}`;
  return `${negative ? minus : ''}${body}${nbsp}zł`;
};

export const formatPerKg = (grosze: number): string => `${formatPln(grosze, true)}/kg`;

export const vatIncluded = (grossGr: number, ratePercent: number): number =>
  Math.round((grossGr * ratePercent) / (100 + ratePercent));

export const formatGrams = (grams: number): string =>
  grams >= 1000 && grams % 1000 === 0 ? `${grams / 1000} kg` : `${grams}${nbsp}g`;
