const nbsp = '\u00a0';

export const formatZl = (amount: number): string => `${amount}${nbsp}zł`;

export const formatNm = (nm: number): string => `${nm}${nbsp}Nm`;

export const pluralPl = (count: number, one: string, few: string, many: string): string => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? few : many;
};

export const workdayHours = 8;

export const formatWorkTime = (hours: number): string => {
  const days = Math.floor(hours / workdayHours);
  const rest = hours % workdayHours;
  const parts: string[] = [];
  if (days > 0)
    parts.push(`${days} ${pluralPl(days, 'dzień roboczy', 'dni robocze', 'dni roboczych')}`);
  if (rest > 0) parts.push(`${rest} ${pluralPl(rest, 'godzina', 'godziny', 'godzin')}`);
  return parts.join(' i ');
};
