export type Day = number;

const millisecondsPerDay = 86_400_000;

export const dayFromParts = (year: number, month: number, date: number): Day =>
  Math.floor(Date.UTC(year, month - 1, date) / millisecondsPerDay);

export interface DayParts {
  year: number;
  month: number;
  date: number;
}

export const partsFromDay = (day: Day): DayParts => {
  const moment = new Date(day * millisecondsPerDay);
  return {
    year: moment.getUTCFullYear(),
    month: moment.getUTCMonth() + 1,
    date: moment.getUTCDate(),
  };
};

export const dayFromDate = (value: Date): Day =>
  dayFromParts(value.getFullYear(), value.getMonth() + 1, value.getDate());

export const toIsoDate = (day: Day): string =>
  new Date(day * millisecondsPerDay).toISOString().slice(0, 10);

export const parseIsoDate = (value: string): Day | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const day = dayFromParts(Number(match[1]), Number(match[2]), Number(match[3]));
  return toIsoDate(day) === value ? day : null;
};

export const weekdayOf = (day: Day): number => (((day + 4) % 7) + 7) % 7;

export const daysInMonth = (year: number, month: number): number =>
  dayFromParts(year, month + 1, 1) - dayFromParts(year, month, 1);

export const addMonths = (day: Day, months: number): Day => {
  const { year, month, date } = partsFromDay(day);
  const index = year * 12 + (month - 1) + months;
  const targetYear = Math.floor(index / 12);
  const targetMonth = (index % 12) + 1;
  return dayFromParts(
    targetYear,
    targetMonth,
    Math.min(date, daysInMonth(targetYear, targetMonth)),
  );
};

export const firstOfMonth = (day: Day): Day => {
  const { year, month } = partsFromDay(day);
  return dayFromParts(year, month, 1);
};

export const monthIndex = (day: Day): number => {
  const { year, month } = partsFromDay(day);
  return year * 12 + (month - 1);
};
