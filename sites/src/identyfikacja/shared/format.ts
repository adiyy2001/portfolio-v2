const nbsp = ' ';

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes}${nbsp}B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb < 10 ? kb.toFixed(1).replace('.', ',') : Math.round(kb)}${nbsp}KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')}${nbsp}MB`;
};

export const pluralPl = (count: number, one: string, few: string, many: string) => {
  if (count === 1) return one;
  const last = count % 10;
  const lastTwo = count % 100;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
};

export const filesLabel = (count: number) =>
  `${count}${nbsp}${pluralPl(count, 'plik', 'pliki', 'plików')}`;
