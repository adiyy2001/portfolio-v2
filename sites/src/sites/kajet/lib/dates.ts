import { pad } from './format';

export const monthNames = [
  'styczeń',
  'luty',
  'marzec',
  'kwiecień',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpień',
  'wrzesień',
  'październik',
  'listopad',
  'grudzień',
] as const;

export const monthNamesShort = [
  'sty',
  'lut',
  'mar',
  'kwi',
  'maj',
  'cze',
  'lip',
  'sie',
  'wrz',
  'paź',
  'lis',
  'gru',
] as const;

export const monthNamesGenitive = [
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
] as const;

export const weekdayNamesShort = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'] as const;

export const weekdayNamesLong = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
] as const;

export interface MonthRef {
  y: number;
  m: number;
  id: number;
  age: number;
  days: number;
}

export const easterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const dayKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const holidayCache = new Map<number, Set<string>>();

export const holidayKeys = (year: number): Set<string> => {
  const cached = holidayCache.get(year);
  if (cached) return cached;
  const easter = easterSunday(year);
  const fixed = [
    [0, 1],
    [0, 6],
    [4, 1],
    [4, 3],
    [7, 15],
    [10, 1],
    [10, 11],
    [11, 24],
    [11, 25],
    [11, 26],
  ] as const;
  const keys = new Set<string>();
  for (const [month, day] of fixed) keys.add(dayKey(new Date(year, month, day)));
  for (const offset of [0, 1, 49, 60]) keys.add(dayKey(addDays(easter, offset)));
  holidayCache.set(year, keys);
  return keys;
};

export const isHoliday = (date: Date): boolean => holidayKeys(date.getFullYear()).has(dayKey(date));

export const isWorkday = (date: Date): boolean => {
  const weekday = date.getDay();
  return weekday !== 0 && weekday !== 6 && !isHoliday(date);
};

export const nextWorkday = (date: Date): Date => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let cursor = new Date(date);
  while (!isWorkday(cursor)) {
    const next = addDays(cursor, 1);
    cursor = new Date(next.getFullYear(), next.getMonth(), next.getDate(), hours, minutes, seconds);
  }
  return cursor;
};

export const deadlineDate = (year: number, month: number, day: number): Date =>
  nextWorkday(new Date(year, month, day, 23, 59, 59));

export const monthRefs = (now: Date, count: number): MonthRef[] =>
  Array.from({ length: count }, (_, age) => {
    const first = new Date(now.getFullYear(), now.getMonth() - 1 - age, 1);
    return {
      y: first.getFullYear(),
      m: first.getMonth(),
      id: first.getFullYear() * 12 + first.getMonth(),
      age,
      days: new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(),
    };
  });

export const dayMonth = (date: Date): string =>
  `${weekdayNamesShort[date.getDay()]} ${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;

export const dayMonthYear = (date: Date): string => `${dayMonth(date)}.${date.getFullYear()}`;

export const daysUntil = (date: Date, now: Date): number =>
  Math.floor((date.getTime() - now.getTime()) / 86400000);

export const inDaysLabel = (date: Date, now: Date): string => {
  const days = daysUntil(date, now);
  if (days < 1) return 'dziś';
  return `za ${days} ${days === 1 ? 'dzień' : 'dni'}`;
};
