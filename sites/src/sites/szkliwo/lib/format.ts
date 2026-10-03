const nonBreakingSpace = ' ';

export const formatNumber = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, nonBreakingSpace);

export const formatZloty = (value: number) => `${formatNumber(value)}${nonBreakingSpace}zł`;

export type PluralForms = readonly [one: string, few: string, many: string];

export const plural = (count: number, [one, few, many]: PluralForms) => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew = lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14);
  return isFew ? few : many;
};

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}:${rest.toString().padStart(2, '0')}`;
};
