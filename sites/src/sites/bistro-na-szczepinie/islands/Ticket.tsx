import { useEffect, useRef, useState } from 'preact/hooks';
import type { Lang } from '../data/lang';
import { ticketCopy } from '../copy/ticket';
import { bookingCopy } from '../copy/booking';
import { eventBySlug, events } from '../data/events';
import { place } from '../data/place';
import { maxPeople } from '../data/hours';
import {
  addBooking,
  bookableTimes,
  makeRef,
  readBookings,
  validateBooking,
  writeBookings,
} from '../logic/booking';
import type { Booking, BookingError, BookingField, BookingInput } from '../logic/booking';
import { isoDate, nextOccurrence } from '../logic/events';
import { longDate, parseIso } from '../logic/format';

interface Props {
  lang: Lang;
  variant: 'home' | 'page';
}

const emptyValues: BookingInput = { date: '', time: '', people: '2', name: '', phone: '' };

const eventFromUrl = () => {
  const slug = new URLSearchParams(window.location.search).get('wydarzenie');
  return events.find(event => event.slug === slug)?.slug;
};

const initialValues = (eventSlug: string | undefined): BookingInput => {
  if (!eventSlug) return emptyValues;
  const event = eventBySlug(eventSlug);
  return {
    ...emptyValues,
    date: isoDate(nextOccurrence(event.rule, new Date())),
    time: event.start,
  };
};

export const Ticket = ({ lang, variant }: Props) => {
  const copy = ticketCopy[lang];
  const [eventSlug, setEventSlug] = useState(eventFromUrl);
  const [values, setValues] = useState<BookingInput>(() => initialValues(eventFromUrl()));
  const [error, setError] = useState<BookingError | null>(null);
  const [storageFailed, setStorageFailed] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Partial<Record<BookingField, HTMLElement | null>>>({});
  const today = isoDate(new Date());
  const chosen = values.date ? parseIso(values.date) : null;
  const times = bookableTimes(chosen ? chosen.getDay() : 1);
  const event = eventSlug ? eventBySlug(eventSlug) : undefined;

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (field: BookingField, value: string) => {
    setError(null);
    setStorageFailed(false);
    setValues(current => {
      const next = { ...current, [field]: value };
      if (field === 'date') {
        const day = parseIso(value);
        if (day && next.time && !bookableTimes(day.getDay()).includes(next.time)) next.time = '';
      }
      return next;
    });
  };

  const submit = (submitEvent: Event) => {
    submitEvent.preventDefault();
    const found = validateBooking(values, new Date());
    setError(found);
    setStorageFailed(false);
    if (found) {
      fieldRefs.current[found.field]?.focus();
      return;
    }
    const booking: Booking = {
      ref: makeRef(),
      date: values.date,
      time: values.time,
      people: Number(values.people),
      name: values.name.trim(),
      phone: values.phone.trim(),
      ...(eventSlug ? { event: eventSlug } : {}),
    };
    const stored = writeBookings(
      window.localStorage,
      addBooking(readBookings(window.localStorage), booking),
    );
    if (!stored) {
      setStorageFailed(true);
      return;
    }
    window.dispatchEvent(new CustomEvent('bistro-na-szczepinie:bookings'));
    setDone(booking);
  };

  const again = () => {
    setDone(null);
    setValues(emptyValues);
    setEventSlug(undefined);
    window.requestAnimationFrame(() => dateRef.current?.focus());
  };

  const message = error
    ? error.code === 'timeOutside' && error.day !== undefined && error.window
      ? copy.errors.timeOutside(copy.dayAccusative[error.day], error.window[0], error.window[1])
      : (copy.errors[error.code] as string)
    : '';
  const invalid = (field: BookingField) => (error?.field === field ? 'true' : undefined);
  const bind = (field: BookingField) => (node: HTMLElement | null) => {
    fieldRefs.current[field] = node;
  };
  const doneDate = done ? parseIso(done.date) : null;
  const doneEvent = done?.event ? eventBySlug(done.event) : undefined;

  return (
    <form
      class={variant === 'page' ? 'ticket ticket--page' : 'ticket'}
      id="booking"
      noValidate
      onSubmit={submit}>
      <div class="ticket-main">
        <p class="ticket-kicker">{copy.kicker}</p>
        <h3 id="ticket-h">{event ? copy.eventTitle(event.title[lang]) : copy.title}</h3>
        {event && !done && <p class="ticket-hint">{bookingCopy[lang].fromEventHint}</p>}
        {done ? (
          <div class="ticket-done" ref={doneRef} tabIndex={-1}>
            <h4>{copy.done.title}</h4>
            <p class="done-ref">
              {copy.done.ref} <b>{done.ref}</b>
            </p>
            <dl class="done-sum">
              <div>
                <dt>{copy.done.summary.date}</dt>
                <dd>{doneDate ? longDate(doneDate, lang) : done.date}</dd>
              </div>
              <div>
                <dt>{copy.done.summary.time}</dt>
                <dd>{done.time}</dd>
              </div>
              <div>
                <dt>{copy.done.summary.people}</dt>
                <dd>{done.people}</dd>
              </div>
              <div>
                <dt>{copy.done.summary.name}</dt>
                <dd>{done.name}</dd>
              </div>
              <div>
                <dt>{copy.done.summary.phone}</dt>
                <dd>{done.phone}</dd>
              </div>
              {doneEvent && (
                <div>
                  <dt>{copy.done.summary.event}</dt>
                  <dd>{doneEvent.title[lang]}</dd>
                </div>
              )}
            </dl>
            <p class="done-text">{copy.done.sample}</p>
            <p class="done-text">
              {copy.done.call} <a href={`tel:${place.phone.href}`}>{place.phone.display}</a>
            </p>
            <p class="done-extra">
              <button type="button" class="again" onClick={again}>
                {copy.done.again}
              </button>
            </p>
          </div>
        ) : (
          <div class="ticket-fields">
            <div class="tf">
              <div class="f">
                <label for="f-date">{copy.fields.date}</label>
                <input
                  id="f-date"
                  name="date"
                  type="date"
                  min={today}
                  required
                  value={values.date}
                  ref={node => {
                    dateRef.current = node;
                    bind('date')(node);
                  }}
                  aria-invalid={invalid('date')}
                  aria-describedby="ticket-msg"
                  onInput={inputEvent =>
                    set('date', (inputEvent.currentTarget as HTMLInputElement).value)
                  }
                />
              </div>
              <div class="f">
                <label for="f-time">{copy.fields.time}</label>
                <select
                  id="f-time"
                  name="time"
                  required
                  value={values.time}
                  ref={bind('time')}
                  aria-invalid={invalid('time')}
                  aria-describedby="ticket-msg"
                  onChange={changeEvent =>
                    set('time', (changeEvent.currentTarget as HTMLSelectElement).value)
                  }>
                  <option value="">{copy.timePlaceholder}</option>
                  {times.map(time => (
                    <option value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div class="f">
                <label for="f-people">{copy.fields.people}</label>
                <input
                  id="f-people"
                  name="people"
                  type="number"
                  min="1"
                  max={maxPeople}
                  inputMode="numeric"
                  required
                  value={values.people}
                  ref={bind('people')}
                  aria-invalid={invalid('people')}
                  aria-describedby="ticket-msg"
                  onInput={inputEvent =>
                    set('people', (inputEvent.currentTarget as HTMLInputElement).value)
                  }
                />
              </div>
            </div>
            <div class="tf tf-contact">
              <div class="f">
                <label for="f-name">{copy.fields.name}</label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={values.name}
                  ref={bind('name')}
                  aria-invalid={invalid('name')}
                  aria-describedby="ticket-msg"
                  onInput={inputEvent =>
                    set('name', (inputEvent.currentTarget as HTMLInputElement).value)
                  }
                />
              </div>
              <div class="f">
                <label for="f-phone">{copy.fields.phone}</label>
                <input
                  id="f-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={values.phone}
                  ref={bind('phone')}
                  aria-invalid={invalid('phone')}
                  aria-describedby="ticket-msg"
                  onInput={inputEvent =>
                    set('phone', (inputEvent.currentTarget as HTMLInputElement).value)
                  }
                />
              </div>
            </div>
            <button class="send" type="submit">
              {copy.send}
            </button>
            <p class="ticket-msg" id="ticket-msg" role="status" aria-live="polite">
              {message}
              {storageFailed && (
                <>
                  {copy.errors.storage}{' '}
                  <a href={`tel:${place.phone.href}`}>{place.phone.display}</a>
                  {copy.errors.storageEnd}
                </>
              )}
            </p>
          </div>
        )}
      </div>
      <div class="ticket-stub" aria-hidden="true">
        <span>{copy.stub}</span>
      </div>
    </form>
  );
};

export default Ticket;
