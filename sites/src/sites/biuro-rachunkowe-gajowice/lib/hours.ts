import { openHours } from '../data/site';

export interface OpenInfo {
  open: boolean;
  short: string;
  long: string;
}

export const openInfo = (date: Date): OpenInfo => {
  const weekday = date.getDay();
  const minutes = date.getHours() * 60 + date.getMinutes();
  const work = weekday >= 1 && weekday <= 5;
  if (work && minutes >= openHours.fromMinutes && minutes < openHours.toMinutes) {
    return { open: true, short: 'czynne do 16:00', long: 'Biuro czynne do 16:00' };
  }
  if (work && minutes < openHours.fromMinutes) {
    return {
      open: false,
      short: 'zamknięte do dziś 8:00',
      long: 'Biuro zamknięte. Otwarcie dziś o 8:00.',
    };
  }
  if (weekday >= 1 && weekday <= 4) {
    return {
      open: false,
      short: 'zamknięte do jutra 8:00',
      long: 'Biuro zamknięte. Otwarcie jutro o 8:00.',
    };
  }
  return {
    open: false,
    short: 'zamknięte do pn 8:00',
    long: 'Biuro zamknięte. Otwarcie w poniedziałek o 8:00.',
  };
};
