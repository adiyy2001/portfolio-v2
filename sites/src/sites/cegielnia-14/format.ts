const nbsp = '\u00a0';

export const comma = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');

export const grouped = (value: number) =>
  String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp);

export const zl = (value: number) => `${grouped(value)}${nbsp}zł`;

export const m2 = (value: number, digits = 0) => `${comma(value, digits)}${nbsp}m²`;

export const pricePerM2 = (price: number, area: number) => Math.round(price / area);

export const plural = (n: number, one: string, few: string, many: string) => {
  if (n === 1) return one;
  const tail = n % 10;
  const teen = n % 100;
  if (tail >= 2 && tail <= 4 && !(teen >= 12 && teen <= 14)) return few;
  return many;
};
