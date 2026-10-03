const NO_BREAK_SPACE = ' ';

const groupThousands = (digits: string): string =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, NO_BREAK_SPACE);

export const formatZloty = (grosze: number): string => {
  const whole = Math.trunc(grosze / 100);
  const cents = grosze % 100;
  const wholeText = groupThousands(String(whole));
  const centsText = cents === 0 ? '' : `,${String(cents).padStart(2, '0')}`;
  return `${wholeText}${centsText}${NO_BREAK_SPACE}zł`;
};

export const formatDayMonth = (day: number, month: number): string =>
  `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}`;

export const pluralPl = (count: number, one: string, few: string, many: string): string => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const isFew = lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14);
  return isFew ? few : many;
};

export const daysLeftPhrase = (days: number): string => {
  if (days === 0) return 'dziś';
  if (days === 1) return 'jutro';
  return `za ${days} dni`;
};
