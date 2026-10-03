import { checkInHour, checkOutHour, freeCancellationDaysBefore } from '../lib/policy';

const clock = (hour: number): string => `${hour}:00`;

export const hotel = {
  name: 'Przęsło',
  street: 'ul. Grodzka 31',
  postalCode: '50-137',
  city: 'Wrocław',
  phone: '+48 71 000 00 09',
  phoneHref: 'tel:+48710000009',
  email: 'biuro@przeslo.example',
  emailHref: 'mailto:biuro@przeslo.example',
  rooms: 24,
  builtYear: 1893,
  restoredYear: 2024,
  floors: 4,
  checkIn: clock(checkInHour),
  checkOut: clock(checkOutHour),
  lateCheckOut: clock(14),
  receptionOpens: clock(7),
  receptionCloses: clock(22),
  breakfastWeekdayFrom: '7:30',
  breakfastWeekdayTo: '10:30',
  breakfastWeekendFrom: '8:00',
  breakfastWeekendTo: '11:00',
  freeCancellationHours: freeCancellationDaysBefore * 24,
  parkingSpaces: 6,
} as const;

export const examplePhone = '+48 71 000 00 08';
