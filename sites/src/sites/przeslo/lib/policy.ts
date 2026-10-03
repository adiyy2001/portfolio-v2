import { partsFromDay } from './dates';
import type { Day } from './dates';

const minute = 60_000;

export const checkInHour = 15;
export const checkOutHour = 11;
export const freeCancellationDaysBefore = 2;

const lastSundayOfMonthAtOneUtc = (year: number, monthIndex: number): number => {
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  return Date.UTC(year, monthIndex, lastDay.getUTCDate() - lastDay.getUTCDay(), 1);
};

export const warsawOffsetMinutes = (instant: number): number => {
  const year = new Date(instant).getUTCFullYear();
  const summerStart = lastSundayOfMonthAtOneUtc(year, 2);
  const summerEnd = lastSundayOfMonthAtOneUtc(year, 9);
  return instant >= summerStart && instant < summerEnd ? 120 : 60;
};

export const warsawInstant = (day: Day, hourOfDay: number): number => {
  const { year, month, date } = partsFromDay(day);
  const offset = warsawOffsetMinutes(Date.UTC(year, month - 1, date, 12));
  return Date.UTC(year, month - 1, date, hourOfDay) - offset * minute;
};

export const checkInInstant = (arrival: Day): number => warsawInstant(arrival, checkInHour);

export const checkOutInstant = (departure: Day): number => warsawInstant(departure, checkOutHour);

export const freeCancellationDeadline = (arrival: Day): number =>
  warsawInstant(arrival - freeCancellationDaysBefore, checkInHour);
