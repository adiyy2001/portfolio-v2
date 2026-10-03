import { weekdayPhrases } from './names';
import { addDays, isBusinessDay, weekdayOf, type CalendarDate } from './polish-calendar';
import type { WarsawMoment } from './warsaw-time';

export interface Shift {
  weekdays: number[];
  from: number;
  to: number;
}

export type OpenStatus =
  | { open: true; closesAt: number }
  | { open: false; opensAt: number; date: CalendarDate; daysAhead: number };

const searchLimitInDays = 14;

export const shiftOn = (date: CalendarDate, shifts: Shift[]): Shift | undefined =>
  isBusinessDay(date) ? shifts.find(shift => shift.weekdays.includes(weekdayOf(date))) : undefined;

export const openStatus = (moment: WarsawMoment, shifts: Shift[]): OpenStatus => {
  const today = shiftOn(moment.date, shifts);
  if (today && moment.minutes >= today.from && moment.minutes < today.to) {
    return { open: true, closesAt: today.to };
  }
  if (today && moment.minutes < today.from) {
    return { open: false, opensAt: today.from, date: moment.date, daysAhead: 0 };
  }
  for (let daysAhead = 1; daysAhead <= searchLimitInDays; daysAhead += 1) {
    const date = addDays(moment.date, daysAhead);
    const shift = shiftOn(date, shifts);
    if (shift) return { open: false, opensAt: shift.from, date, daysAhead };
  }
  throw new Error('No opening hours found within the search limit');
};

export const formatMinutes = (minutes: number): string =>
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;

export const statusMessage = (status: OpenStatus): string => {
  if (status.open) return `Teraz czynne, do ${formatMinutes(status.closesAt)}.`;
  const time = formatMinutes(status.opensAt);
  if (status.daysAhead === 0) return `Teraz zamknięte. Otwieramy dziś o ${time}.`;
  if (status.daysAhead === 1) return `Teraz zamknięte. Otwieramy jutro o ${time}.`;
  return `Teraz zamknięte. Otwieramy ${weekdayPhrases[weekdayOf(status.date)]} o ${time}.`;
};
