import type { Lang } from '../data/lang';
import { dayNames } from '../data/week';

const months = {
  pl: [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

export const longDate = (date: Date, lang: Lang) => {
  const day = dayNames[lang][date.getDay()];
  const month = months[lang][date.getMonth()];
  return `${day} ${date.getDate()} ${month}`;
};

export const shortDate = (date: Date, lang: Lang) => {
  const day = dayNames[lang][date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} ${dd}.${mm}`;
};

export const parseIso = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getMonth() === Number(match[2]) - 1 ? date : null;
};

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const inlineName = (name: string, lang: Lang) =>
  lang === 'en' && /^Vienna\b/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1);
