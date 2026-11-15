import type { Lang } from '../i18n/lang';
import { padNumber } from '../data/hotel';

const groupThousands = (value: number, separator: string): string =>
  String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, separator);

export const formatMoney = (value: number, lang: Lang): string =>
  lang === 'pl' ? `${groupThousands(value, ' ')} zł` : `PLN ${groupThousands(value, ',')}`;

export const nightsLabel = (count: number, lang: Lang): string => {
  if (lang === 'en') return count === 1 ? '1 night' : `${count} nights`;
  if (count === 1) return '1 doba';
  const last = count % 10;
  const tens = count % 100;
  return last >= 2 && last <= 4 && (tens < 12 || tens > 14) ? `${count} doby` : `${count} dób`;
};

export const guestsLabel = (count: number, lang: Lang): string => {
  if (lang === 'en') return count === 1 ? '1 guest' : `${count} guests`;
  if (count === 1) return '1 osoba';
  const last = count % 10;
  const tens = count % 100;
  return last >= 2 && last <= 4 && (tens < 12 || tens > 14) ? `${count} osoby` : `${count} osób`;
};

export const guestsGenitive = (count: number, lang: Lang): string => {
  if (lang === 'en') return guestsLabel(count, lang);
  return count === 1 ? '1 osoby' : guestsLabel(count, lang).replace(/ osoby$/, ' osób');
};

export const minutesLabel = (count: number, lang: Lang): string => {
  if (lang === 'en') return count === 1 ? '1 minute' : `${count} minutes`;
  if (count === 1) return '1 minuta';
  const last = count % 10;
  const tens = count % 100;
  return last >= 2 && last <= 4 && (tens < 12 || tens > 14) ? `${count} minuty` : `${count} minut`;
};

export const numberList = (numbers: readonly number[], lang: Lang): string => {
  const labels = numbers.map(padNumber);
  if (labels.length <= 1) return labels.join('');
  const last = labels[labels.length - 1];
  const head = labels.slice(0, -1).join(', ');
  return `${head} ${lang === 'pl' ? 'i' : 'and'} ${last}`;
};

export const numberWord = (value: number, lang: Lang): string => {
  const pl: Record<number, string> = { 14: 'czternaście', 13: 'trzynaście', 12: 'dwanaście' };
  const en: Record<number, string> = { 14: 'fourteen', 13: 'thirteen', 12: 'twelve' };
  const words = lang === 'pl' ? pl : en;
  return words[value] ?? String(value);
};
