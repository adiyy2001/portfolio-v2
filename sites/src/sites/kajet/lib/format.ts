const NBSP = ' ';

export const pad = (value: number): string => String(value).padStart(2, '0');

export const formatGrosze = (grosze: number): string => {
  const negative = grosze < 0;
  const abs = Math.abs(grosze);
  const zloty = Math.floor(abs / 100);
  const rest = abs % 100;
  const grouped = String(zloty).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${negative ? '-' : ''}${grouped},${pad(rest)}`;
};

export const formatZloty = (grosze: number): string => `${formatGrosze(grosze)}${NBSP}zł`;

export const formatPrice = (zloty: number): string => formatGrosze(Math.round(zloty * 100));

export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
};

export const invoicesLabel = (n: number): string =>
  `${n} ${plural(n, 'faktura', 'faktury', 'faktur')}`;
