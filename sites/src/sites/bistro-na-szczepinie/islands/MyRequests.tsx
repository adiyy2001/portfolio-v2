import { useEffect, useState } from 'preact/hooks';
import type { Lang } from '../data/lang';
import { events } from '../data/events';
import { ticketCopy } from '../copy/ticket';
import { readBookings, removeBooking, storageKey, writeBookings } from '../logic/booking';
import type { Booking } from '../logic/booking';
import { longDate, parseIso } from '../logic/format';

interface Props {
  lang: Lang;
}

const load = () => readBookings(typeof window === 'undefined' ? undefined : window.localStorage);

export const MyRequests = ({ lang }: Props) => {
  const copy = ticketCopy[lang].mine;
  const [bookings, setBookings] = useState<Booking[]>(load);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const refresh = () => setBookings(load());
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) refresh();
    };
    window.addEventListener('bistro-na-szczepinie:bookings', refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('bistro-na-szczepinie:bookings', refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const cancel = (ref: string) => {
    const next = removeBooking(bookings, ref);
    if (writeBookings(window.localStorage, next)) {
      setBookings(next);
      setRemoved(true);
    }
  };

  const label = (booking: Booking) => {
    const day = parseIso(booking.date);
    const title = events.find(event => event.slug === booking.event)?.title[lang];
    const parts = [
      day ? longDate(day, lang) : booking.date,
      booking.time,
      copy.people(booking.people),
    ];
    if (title) parts.push(title);
    return parts.join(', ');
  };

  return (
    <div class="mine">
      <h2>{copy.title}</h2>
      {bookings.length === 0 ? (
        <p class="mine-empty">{copy.empty}</p>
      ) : (
        <ul class="mine-list">
          {bookings.map(booking => (
            <li class="mine-item" key={booking.ref}>
              <div>
                <b>{booking.ref}</b>
                <span>{label(booking)}</span>
              </div>
              <button
                type="button"
                class="mine-cancel"
                aria-label={copy.cancelLabel(booking.ref)}
                onClick={() => cancel(booking.ref)}>
                {copy.cancel}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p class="mine-status" role="status" aria-live="polite">
        {removed ? copy.removed : ''}
      </p>
    </div>
  );
};

export default MyRequests;
