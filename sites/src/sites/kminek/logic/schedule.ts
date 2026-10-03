import type { Lang } from '../data/lang';
import type { Weekday } from '../data/hours';
import { clockInWarsaw, toMinutes } from './status';

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export type Recurrence =
  | { kind: 'weekly'; weekday: Weekday }
  | { kind: 'monthly'; weekday: Weekday; nth: 1 | 2 | 3 | 4 | 'last' }
  | { kind: 'yearly'; month: number; day: number };

const utc = (date: CalendarDate) => Date.UTC(date.year, date.month - 1, date.day);

const fromUtc = (time: number): CalendarDate => {
  const date = new Date(time);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

export const weekdayOf = (date: CalendarDate) => new Date(utc(date)).getUTCDay() as Weekday;

export const isBefore = (a: CalendarDate, b: CalendarDate) => utc(a) < utc(b);

export const toIso = (date: CalendarDate) =>
  [date.year, date.month, date.day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');

export const warsawToday = (instant: Date): CalendarDate => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const read = (type: string) => Number(parts.find(part => part.type === type)?.value);
  return { year: read('year'), month: read('month'), day: read('day') };
};

export interface Moment {
  date: CalendarDate;
  minutes: number;
}

export const warsawMoment = (instant: Date): Moment => ({
  date: warsawToday(instant),
  minutes: clockInWarsaw(instant).minutes,
});

const DAY = 86_400_000;

export const addDays = (date: CalendarDate, days: number) => fromUtc(utc(date) + days * DAY);

export const daysBetween = (from: CalendarDate, to: CalendarDate) =>
  Math.round((utc(to) - utc(from)) / DAY);

const nthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: Weekday,
  nth: 1 | 2 | 3 | 4 | 'last',
) => {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const firstMatch = 1 + ((weekday - firstWeekday + 7) % 7);
  if (nth === 'last') {
    const lateMatch = firstMatch + 28;
    return {
      year,
      month,
      day: lateMatch <= daysInMonth(year, month) ? lateMatch : firstMatch + 21,
    };
  }
  return { year, month, day: firstMatch + (nth - 1) * 7 };
};

export const nextOccurrence = (rule: Recurrence, from: CalendarDate): CalendarDate => {
  if (rule.kind === 'weekly') {
    const ahead = (rule.weekday - weekdayOf(from) + 7) % 7;
    return addDays(from, ahead);
  }
  if (rule.kind === 'monthly') {
    const thisMonth = nthWeekdayOfMonth(from.year, from.month, rule.weekday, rule.nth);
    if (!isBefore(thisMonth, from)) return thisMonth;
    const nextMonth =
      from.month === 12
        ? { year: from.year + 1, month: 1 }
        : { year: from.year, month: from.month + 1 };
    return nthWeekdayOfMonth(nextMonth.year, nextMonth.month, rule.weekday, rule.nth);
  }
  const thisYear = { year: from.year, month: rule.month, day: rule.day };
  return isBefore(thisYear, from) ? { ...thisYear, year: from.year + 1 } : thisYear;
};

export const nextShowing = (rule: Recurrence, now: Moment, endsAt: string): CalendarDate => {
  const next = nextOccurrence(rule, now.date);
  const hasEnded = toIso(next) === toIso(now.date) && now.minutes >= toMinutes(endsAt);
  return hasEnded ? nextOccurrence(rule, addDays(now.date, 1)) : next;
};

const locales: Record<Lang, string> = { pl: 'pl-PL', en: 'en-GB' };

export interface DateParts {
  weekday: string;
  day: string;
  monthShort: string;
  full: string;
  fullWithYear: string;
}

export const dateParts = (date: CalendarDate, lang: Lang): DateParts => {
  const instant = new Date(utc(date));
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locales[lang], { ...options, timeZone: 'UTC' }).format(instant);
  return {
    weekday: format({ weekday: 'long' }),
    day: format({ day: 'numeric' }),
    monthShort: format({ month: 'short' }).replace('.', ''),
    full: format({ weekday: 'long', day: 'numeric', month: 'long' }),
    fullWithYear: format({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  };
};

interface WeekdayWords {
  accusative: string;
  feminine: boolean;
}

const polishWeekdays: readonly WeekdayWords[] = [
  { accusative: 'niedzielę', feminine: true },
  { accusative: 'poniedziałek', feminine: false },
  { accusative: 'wtorek', feminine: false },
  { accusative: 'środę', feminine: true },
  { accusative: 'czwartek', feminine: false },
  { accusative: 'piątek', feminine: false },
  { accusative: 'sobotę', feminine: true },
];

const englishWeekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const polishOrdinals = {
  feminine: { 1: 'pierwszą', 2: 'drugą', 3: 'trzecią', 4: 'czwartą', last: 'ostatnią' },
  masculine: { 1: 'pierwszy', 2: 'drugi', 3: 'trzeci', 4: 'czwarty', last: 'ostatni' },
} as const;

const englishOrdinals = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  last: 'last',
} as const;

const dayAndMonth = (month: number, day: number, lang: Lang) =>
  new Intl.DateTimeFormat(locales[lang], {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2026, month - 1, day)));

export const describeRecurrence = (rule: Recurrence, lang: Lang) => {
  if (rule.kind === 'yearly') {
    const date = dayAndMonth(rule.month, rule.day, lang);
    return lang === 'pl' ? `co roku ${date}` : `every year on ${date}`;
  }
  if (lang === 'en') {
    const name = englishWeekdays[rule.weekday];
    return rule.kind === 'weekly'
      ? `every ${name}`
      : `the ${englishOrdinals[rule.nth]} ${name} of the month`;
  }
  const words = polishWeekdays[rule.weekday];
  if (!words) return '';
  if (rule.kind === 'weekly') {
    return `w ${words.feminine ? 'każdą' : 'każdy'} ${words.accusative}`;
  }
  const ordinals = words.feminine ? polishOrdinals.feminine : polishOrdinals.masculine;
  return `w ${ordinals[rule.nth]} ${words.accusative} miesiąca`;
};

export const serializeRecurrence = (rule: Recurrence) => {
  if (rule.kind === 'weekly') return `weekly:${rule.weekday}`;
  if (rule.kind === 'monthly') return `monthly:${rule.weekday}:${rule.nth}`;
  return `yearly:${rule.month}:${rule.day}`;
};

const isWholeNumber = (text: string | undefined): text is string => /^\d{1,2}$/.test(text ?? '');

const isWeekday = (value: number): value is Weekday => value >= 0 && value <= 6;

export const parseRecurrence = (text: string): Recurrence | null => {
  const [kind, first, second] = text.split(':');
  if (!isWholeNumber(first)) return null;
  const number = Number(first);
  if (kind === 'weekly' && isWeekday(number)) return { kind, weekday: number };
  if (kind === 'monthly' && isWeekday(number)) {
    const nth = second === 'last' ? 'last' : Number(second);
    if (nth === 'last' || nth === 1 || nth === 2 || nth === 3 || nth === 4) {
      return { kind, weekday: number, nth };
    }
    return null;
  }
  if (kind === 'yearly' && isWholeNumber(second)) {
    const day = Number(second);
    if (number >= 1 && number <= 12 && day >= 1 && day <= 31) return { kind, month: number, day };
  }
  return null;
};

const noBreakSpace = String.fromCharCode(0xa0);

const YEAR_SHOWN_AFTER_DAYS = 120;

const showsYear = (date: CalendarDate, today: CalendarDate) =>
  date.year !== today.year || daysBetween(today, date) > YEAR_SHOWN_AFTER_DAYS;

export const nextLabel = (date: CalendarDate, today: CalendarDate, lang: Lang) => {
  const { full, fullWithYear } = dateParts(date, lang);
  if (toIso(date) === toIso(today)) {
    return `${full}${noBreakSpace}${lang === 'pl' ? '(dziś)' : '(today)'}`;
  }
  return showsYear(date, today) ? fullWithYear : full;
};

const MENU_WEEK_START: Weekday = 2;
const MENU_WEEK_LENGTH_DAYS = 6;

export interface MenuWeek {
  start: CalendarDate;
  end: CalendarDate;
}

export const menuWeekOf = (today: CalendarDate): MenuWeek => {
  const weekday = weekdayOf(today);
  const sinceStart = (weekday - MENU_WEEK_START + 7) % 7;
  const start = weekday === 1 ? addDays(today, 1) : addDays(today, -sinceStart);
  return { start, end: addDays(start, MENU_WEEK_LENGTH_DAYS - 1) };
};

const shortWeekdays: Record<Lang, readonly string[]> = {
  pl: ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const shortDay = (date: CalendarDate, lang: Lang, withYear: boolean) => {
  const text = new Intl.DateTimeFormat(locales[lang], {
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' as const } : {}),
    timeZone: 'UTC',
  }).format(new Date(utc(date)));
  return `${shortWeekdays[lang][weekdayOf(date)]} ${text}`;
};

export const menuWeekLabel = (week: MenuWeek, lang: Lang) => {
  const crossesYear = week.start.year !== week.end.year;
  return `${shortDay(week.start, lang, crossesYear)} - ${shortDay(week.end, lang, true)}`;
};
