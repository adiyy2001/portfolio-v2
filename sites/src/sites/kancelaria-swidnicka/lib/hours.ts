export interface WallClock {
  weekday: number;
  minutes: number;
}

export interface OpeningHours {
  openMinute: number;
  closeMinute: number;
}

const weekdayIndex: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export const warsawWallClock = (now: Date): WallClock => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const lookup = (type: string): string => parts.find(part => part.type === type)?.value ?? '';
  return {
    weekday: weekdayIndex[lookup('weekday')] ?? 1,
    minutes: (Number(lookup('hour')) % 24) * 60 + Number(lookup('minute')),
  };
};

export const isOpen = (clock: WallClock, hours: OpeningHours): boolean =>
  clock.weekday >= 1 &&
  clock.weekday <= 5 &&
  clock.minutes >= hours.openMinute &&
  clock.minutes < hours.closeMinute;
