import { initFilter } from './filter';
import { initNav } from './nav';
import { fillNextDates } from './next-dates';
import { markToday } from './today';

initNav();
markToday();
fillNextDates();
initFilter();
