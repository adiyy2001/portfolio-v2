import type { Lang } from '../i18n/lang';

export type IsoDate = string;

const pad = (value: number): string => String(value).padStart(2, '0');

export const parseIso = (text: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return valid ? date : null;
};

export const toIso = (date: Date): IsoDate =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

export const todayIso = (now: Date = new Date()): IsoDate =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

export const addDays = (iso: IsoDate, days: number): IsoDate => {
  const date = parseIso(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
};

export const nearestFriday = (from: IsoDate): IsoDate => {
  const date = parseIso(from);
  if (!date) return from;
  const ahead = (5 - date.getUTCDay() + 7) % 7;
  return addDays(from, ahead);
};

const months: Record<Lang, readonly string[]> = {
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

const weekdays: Record<Lang, readonly string[]> = {
  pl: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const formatDate = (iso: IsoDate, lang: Lang): string => {
  const date = parseIso(iso);
  if (!date) return iso;
  const day = date.getUTCDate();
  const month = months[lang][date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

export const formatDateWithWeekday = (iso: IsoDate, lang: Lang): string => {
  const date = parseIso(iso);
  if (!date) return iso;
  return `${weekdays[lang][date.getUTCDay()]}, ${formatDate(iso, lang)}`;
};

export const farthestArrival = (from: IsoDate): IsoDate => addDays(from, 365);
