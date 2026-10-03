import { shifts } from '../data/site';
import { openStatus, statusMessage } from '../lib/hours';
import { warsawMoment } from '../lib/warsaw-time';

const target = document.querySelector<HTMLElement>('[data-open-status]');

if (target) {
  target.textContent = statusMessage(openStatus(warsawMoment(new Date()), shifts));
}
