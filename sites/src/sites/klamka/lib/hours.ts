import { openingDays } from '../data/business';

export interface WallClock {
  day: number;
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

const dayAccusative = [
  'w niedzielę',
  'w poniedziałek',
  'we wtorek',
  'w środę',
  'w czwartek',
  'w piątek',
  'w sobotę',
];

export const warsawWallClock = (date: Date): WallClock => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const pick = (type: string): string => parts.find(part => part.type === type)?.value ?? '0';
  return {
    day: weekdayIndex[pick('weekday')] ?? 0,
    minutes: Number(pick('hour')) * 60 + Number(pick('minute')),
  };
};

const scheduleFor = (day: number) => openingDays.find(entry => entry.days.includes(day));

const clock = (hour: number): string => `${hour}:00`;

export const openStatus = (now: WallClock): string => {
  const today = scheduleFor(now.day);
  if (today?.opens != null && today.closes != null) {
    if (now.minutes >= today.opens * 60 && now.minutes < today.closes * 60) {
      return `Teraz otwarte, do ${clock(today.closes)}.`;
    }
    if (now.minutes < today.opens * 60) {
      return `Zamknięte, otwieramy dziś o ${clock(today.opens)}.`;
    }
  }
  for (let step = 1; step <= 7; step += 1) {
    const day = (now.day + step) % 7;
    const next = scheduleFor(day);
    if (next?.opens != null) {
      return `Zamknięte, otwieramy ${dayAccusative[day]} o ${clock(next.opens)}.`;
    }
  }
  return 'Zamknięte.';
};
