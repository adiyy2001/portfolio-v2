export interface WallClock {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hour: number;
  minute: number;
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

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
});

export const warsawClock = (date: Date): WallClock => {
  const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    weekday: weekdayIndex[parts.weekday] ?? 0,
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
  };
};

export const addDays = (clock: WallClock, days: number): WallClock => {
  const moved = new Date(Date.UTC(clock.year, clock.month - 1, clock.day + days));
  return {
    year: moved.getUTCFullYear(),
    month: moved.getUTCMonth() + 1,
    day: moved.getUTCDate(),
    weekday: moved.getUTCDay(),
    hour: clock.hour,
    minute: clock.minute,
  };
};

const pad = (value: number): string => String(value).padStart(2, '0');

export const isoDate = (clock: WallClock): string =>
  `${clock.year}-${pad(clock.month)}-${pad(clock.day)}`;
