export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

const dayInMilliseconds = 24 * 60 * 60 * 1000;

const toTimestamp = ({ year, month, day }: CalendarDate): number => Date.UTC(year, month - 1, day);

const fromTimestamp = (timestamp: number): CalendarDate => {
  const date = new Date(timestamp);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

export const weekdayOf = (date: CalendarDate): number => new Date(toTimestamp(date)).getUTCDay();

export const addDays = (date: CalendarDate, days: number): CalendarDate =>
  fromTimestamp(toTimestamp(date) + days * dayInMilliseconds);

export const isSameDate = (a: CalendarDate, b: CalendarDate): boolean =>
  a.year === b.year && a.month === b.month && a.day === b.day;

export const isoDate = ({ year, month, day }: CalendarDate): string =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const easterSunday = (year: number): CalendarDate => {
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
  return { year, month, day };
};

const fixedHolidays: [month: number, day: number][] = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26],
];

const firstYearOfChristmasEve = 2025;

export const publicHolidays = (year: number): CalendarDate[] => {
  const easter = easterSunday(year);
  const fixed = fixedHolidays.map(([month, day]) => ({ year, month, day }));
  const christmasEve = year >= firstYearOfChristmasEve ? [{ year, month: 12, day: 24 }] : [];
  return [
    ...fixed,
    ...christmasEve,
    easter,
    addDays(easter, 1),
    addDays(easter, 49),
    addDays(easter, 60),
  ];
};

export const isPublicHoliday = (date: CalendarDate): boolean =>
  publicHolidays(date.year).some(holiday => isSameDate(holiday, date));

export const isBusinessDay = (date: CalendarDate): boolean => {
  const weekday = weekdayOf(date);
  return weekday >= 1 && weekday <= 5 && !isPublicHoliday(date);
};
