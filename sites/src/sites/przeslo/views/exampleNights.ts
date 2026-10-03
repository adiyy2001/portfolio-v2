import { dayFromParts } from '../lib/dates';
import type { Day } from '../lib/dates';

export interface ExampleNight {
  key: 'weekday' | 'weekend' | 'summerWeekday' | 'summerWeekend' | 'market' | 'newYearsEve';
  night: Day;
}

export const exampleNights: ExampleNight[] = [
  { key: 'weekday', night: dayFromParts(2027, 2, 9) },
  { key: 'weekend', night: dayFromParts(2027, 2, 12) },
  { key: 'summerWeekday', night: dayFromParts(2027, 6, 8) },
  { key: 'summerWeekend', night: dayFromParts(2027, 6, 11) },
  { key: 'market', night: dayFromParts(2027, 12, 7) },
  { key: 'newYearsEve', night: dayFromParts(2027, 12, 31) },
];
