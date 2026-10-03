import type { CalendarDate } from './polish-calendar';

export interface WarsawMoment {
  date: CalendarDate;
  minutes: number;
}

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Warsaw',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

export const warsawMoment = (instant: Date): WarsawMoment => {
  const parts = formatter.formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find(part => part.type === type)?.value);
  return {
    date: { year: read('year'), month: read('month'), day: read('day') },
    minutes: read('hour') * 60 + read('minute'),
  };
};
