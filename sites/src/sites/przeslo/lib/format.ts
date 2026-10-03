import type { Lang } from '../i18n/lang';
import { partsFromDay, weekdayOf } from './dates';
import type { Day } from './dates';

const noBreakSpace = ' ';

const monthsNominative: Record<Lang, readonly string[]> = {
  pl: [
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

const monthsGenitive: Record<Lang, readonly string[]> = {
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
  en: monthsNominative.en,
};

const monthsShort: Record<Lang, readonly string[]> = {
  pl: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const weekdaysLong: Record<Lang, readonly string[]> = {
  pl: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const weekdaysShort: Record<Lang, readonly string[]> = {
  pl: ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const pick = (names: readonly string[], index: number): string => names[index] ?? '';

export const weekdayShortName = (weekday: number, lang: Lang): string =>
  pick(weekdaysShort[lang], weekday);

export const weekdayLongName = (weekday: number, lang: Lang): string =>
  pick(weekdaysLong[lang], weekday);

export const monthName = (month: number, lang: Lang): string =>
  pick(monthsNominative[lang], month - 1);

export const formatMonthYear = (year: number, month: number, lang: Lang): string =>
  `${monthName(month, lang)} ${year}`;

export const formatDayShort = (day: Day, lang: Lang): string => {
  const { month, date } = partsFromDay(day);
  return `${weekdayShortName(weekdayOf(day), lang)} ${date} ${pick(monthsShort[lang], month - 1)}`;
};

export const formatDate = (day: Day, lang: Lang): string => {
  const { year, month, date } = partsFromDay(day);
  return `${date} ${pick(monthsGenitive[lang], month - 1)} ${year}`;
};

export const formatDayLong = (day: Day, lang: Lang): string =>
  `${weekdayLongName(weekdayOf(day), lang)}, ${formatDate(day, lang)}`;

export const formatDateNoYear = (day: Day, lang: Lang): string => {
  const { month, date } = partsFromDay(day);
  return `${date} ${pick(monthsGenitive[lang], month - 1)}`;
};

export const formatPln = (amount: number, lang: Lang): string => {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = String(Math.abs(rounded));
  if (lang === 'pl') {
    const grouped =
      digits.length > 4 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, noBreakSpace) : digits;
    return `${sign}${grouped}${noBreakSpace}zł`;
  }
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}PLN${noBreakSpace}${grouped}`;
};

const polishPlural = (count: number, one: string, few: string, many: string): string => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
};

export const formatNights = (count: number, lang: Lang): string =>
  lang === 'pl'
    ? `${count}${noBreakSpace}${polishPlural(count, 'noc', 'noce', 'nocy')}`
    : `${count}${noBreakSpace}${count === 1 ? 'night' : 'nights'}`;

export const formatGuests = (count: number, lang: Lang): string =>
  lang === 'pl'
    ? `${count}${noBreakSpace}${polishPlural(count, 'osoba', 'osoby', 'osób')}`
    : `${count}${noBreakSpace}${count === 1 ? 'guest' : 'guests'}`;

export const formatRoomsFree = (free: number, total: number, lang: Lang): string =>
  lang === 'pl' ? `wolne ${free} z ${total}` : `${free} of ${total} free`;

export interface CountUnits {
  persons: string;
  pieces: string;
}

export const formatExtraLine = (
  name: string,
  count: number,
  nights: number,
  perPerson: boolean,
  units: CountUnits,
  lang: Lang,
): string => {
  const countPart =
    count > 1 ? `${count}${noBreakSpace}${perPerson ? units.persons : units.pieces}` : '';
  const nightsPart = nights > 1 ? formatNights(nights, lang) : '';
  const detail = [countPart, nightsPart]
    .filter(part => part !== '')
    .join(`${noBreakSpace}\u00d7${noBreakSpace}`);
  return detail === '' ? name : `${name}, ${detail}`;
};

export const lowerFirst = (value: string): string => value.charAt(0).toLowerCase() + value.slice(1);
