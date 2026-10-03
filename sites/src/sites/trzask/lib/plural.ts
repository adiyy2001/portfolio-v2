export const pluralPl = (count: number, one: string, few: string, many: string): string => {
  const absolute = Math.abs(count);
  if (absolute === 1) return one;
  const lastDigit = absolute % 10;
  const lastTwo = absolute % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
};
