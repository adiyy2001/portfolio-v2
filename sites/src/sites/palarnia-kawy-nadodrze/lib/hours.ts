import type { OpeningSchedule } from '../data/site';

export interface WarsawClock {
  iso: string;
  weekday: number;
  minutes: number;
}

const weekdayIndex: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const dayNamesAt = [
  'w niedzielę',
  'w poniedziałek',
  'we wtorek',
  'w środę',
  'w czwartek',
  'w piątek',
  'w sobotę',
];

export const dayNamesNominative = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota',
];

export const warsawClock = (date: Date): WarsawClock => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const read = (type: string): string => parts.find(part => part.type === type)?.value ?? '';
  return {
    iso: `${read('year')}-${read('month')}-${read('day')}`,
    weekday: weekdayIndex[read('weekday')] ?? 0,
    minutes: Number(read('hour')) * 60 + Number(read('minute')),
  };
};

export const shiftIso = (iso: string, days: number): string => {
  const [year, month, day] = iso.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
};

export const weekdayOfIso = (iso: string): number => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export const hoursOn = (
  iso: string,
  schedule: OpeningSchedule,
  closedDates: readonly string[],
): [number, number] | null =>
  closedDates.includes(iso) ? null : (schedule[weekdayOfIso(iso)] ?? null);

export const describeOpening = (
  clock: WarsawClock,
  schedule: OpeningSchedule,
  closedDates: readonly string[] = [],
): string => {
  const today = hoursOn(clock.iso, schedule, closedDates);
  if (today && clock.minutes >= today[0] * 60 && clock.minutes < today[1] * 60) {
    return `Otwarte do ${today[1]}:00`;
  }
  if (today && clock.minutes < today[0] * 60) {
    return `Zamknięte, otwieram o ${today[0]}:00`;
  }
  for (let offset = 1; offset <= 14; offset += 1) {
    const iso = shiftIso(clock.iso, offset);
    const hours = hoursOn(iso, schedule, closedDates);
    if (!hours) continue;
    const when = offset === 1 ? 'jutro' : dayNamesAt[weekdayOfIso(iso)];
    return `Zamknięte, otwieram ${when} o ${hours[0]}:00`;
  }
  return 'Zamknięte';
};
