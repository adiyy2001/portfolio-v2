import { closedDates, openingSchedule } from '../data/site';
import { describeOpening, warsawClock } from '../lib/hours';
import { setHandText } from './hand';

export const initHoursStatus = (): void => {
  const chip = document.getElementById('chip-text');
  if (!chip) return;
  const label = describeOpening(warsawClock(new Date()), openingSchedule, closedDates);
  chip.setAttribute('data-read', label);
  setHandText(chip, label.replace(', ', '|'));
};
