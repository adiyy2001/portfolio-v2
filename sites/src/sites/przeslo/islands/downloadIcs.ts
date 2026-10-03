import type { StoredBooking } from '../lib/booking';
import { buildIcs, icsFileName } from '../lib/ics';

export const downloadIcs = (booking: StoredBooking): void => {
  const blob = new Blob([buildIcs(booking, new Date())], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = icsFileName(booking);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
