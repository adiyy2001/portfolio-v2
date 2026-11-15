import { weekHours } from '../data/site';
import { addDays } from './clock';
import type { WallClock } from './clock';

export interface OpenStatus {
  open: boolean;
  text: string;
}

const weekdayAccusative = [
  'w niedzielę',
  'w poniedziałek',
  'we wtorek',
  'w środę',
  'w czwartek',
  'w piątek',
  'w sobotę',
];

export const openStatus = (now: WallClock): OpenStatus => {
  const today = weekHours[now.weekday];
  const minutes = now.hour * 60 + now.minute;
  if (today && minutes >= today.from * 60 && minutes < today.to * 60) {
    return { open: true, text: `Otwarte teraz, do ${today.to}:00` };
  }
  for (let offset = 0; offset <= 7; offset += 1) {
    const day = addDays(now, offset);
    const hours = weekHours[day.weekday];
    if (!hours) continue;
    if (offset === 0 && minutes >= hours.from * 60) continue;
    const when =
      offset === 0 ? 'dziś' : offset === 1 ? 'jutro' : weekdayAccusative[day.weekday];
    const prefix = now.weekday === 0 ? 'Niedziela bez przyjęć' : 'Zamknięte';
    return { open: false, text: `${prefix}, otwieramy ${when} o ${hours.from}:00` };
  }
  return { open: false, text: 'Zamknięte' };
};
