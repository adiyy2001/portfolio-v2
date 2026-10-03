import { openingHours, type IsoDay, type OpeningDay } from '../data/hours';
import { formatMinutes } from './format';
import { isPublicHoliday } from './holidays';

export interface WarsawMoment {
  year: number;
  month: number;
  day: number;
  isoDay: IsoDay;
  minutes: number;
}

export interface OpenStatus {
  isOpen: boolean;
  message: string;
}

const dayInMilliseconds = 86_400_000;
const lookAheadDays = 8;

const isoDayByWeekday: Record<string, IsoDay> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

export const warsawMoment = (date: Date): WarsawMoment => {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(part => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    isoDay: isoDayByWeekday[parts.weekday ?? ''] ?? 1,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};

const hoursFor = (year: number, month: number, day: number, hours: readonly OpeningDay[]) => {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const isoDay = (weekday === 0 ? 7 : weekday) as IsoDay;
  if (isPublicHoliday(year, month, day)) return null;
  return hours.find(entry => entry.day === isoDay) ?? null;
};

const nextOpening = (now: WarsawMoment, hours: readonly OpeningDay[]) => {
  const start = Date.UTC(now.year, now.month - 1, now.day);
  for (let offset = 0; offset <= lookAheadDays; offset += 1) {
    const date = new Date(start + offset * dayInMilliseconds);
    const entry = hoursFor(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), hours);
    if (!entry || entry.opens === null) continue;
    if (offset === 0 && now.minutes >= entry.opens) continue;
    return { offset, entry, opens: entry.opens };
  }
  return null;
};

export const openStatus = (date: Date, hours: readonly OpeningDay[] = openingHours): OpenStatus => {
  const now = warsawMoment(date);
  const today = hoursFor(now.year, now.month, now.day, hours);
  if (today && today.opens !== null && today.closes !== null) {
    if (now.minutes >= today.opens && now.minutes < today.closes) {
      return { isOpen: true, message: `Teraz otwarte, do ${formatMinutes(today.closes)}.` };
    }
  }
  const next = nextOpening(now, hours);
  if (!next) return { isOpen: false, message: 'Teraz zamknięte.' };
  const when = next.offset === 0 ? 'dziś' : next.offset === 1 ? 'jutro' : next.entry.accusative;
  return {
    isOpen: false,
    message: `Teraz zamknięte. Otwieramy ${when} o ${formatMinutes(next.opens)}.`,
  };
};
