export const pluralPl = (count: number, one: string, few: string, many: string): string => {
  const abs = Math.abs(count);
  const lastTwo = abs % 100;
  const last = abs % 10;
  if (abs === 1) return one;
  if (lastTwo >= 12 && lastTwo <= 14) return many;
  if (last >= 2 && last <= 4) return few;
  return many;
};

export const documentsLabel = (count: number): string =>
  `${count} ${pluralPl(count, 'dokument', 'dokumenty', 'dokumentów')}`;
