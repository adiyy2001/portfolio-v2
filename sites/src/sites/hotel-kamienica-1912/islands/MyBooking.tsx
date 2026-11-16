import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { myBookingText } from '../content/myBooking';
import { packageCopy } from '../content/packages';
import { roomCopy } from '../content/rooms';
import { hotel } from '../data/hotel';
import { pagePath } from '../i18n/lang';
import type { Lang } from '../i18n/lang';
import { departureOf } from '../lib/booking';
import type { StoredBooking } from '../lib/booking';
import { formatDate } from '../lib/dates';
import { formatMoney, guestsLabel, nightsLabel } from '../lib/format';
import { findBooking } from '../lib/lookup';
import { breakfastStatus } from '../lib/pricing';
import { browserStore, readBookings, removeBooking } from '../lib/storage';
import { Field } from './Field';

interface Props {
  lang: Lang;
}

type Problem = { field: 'reference' | 'surname'; message: string };

export const MyBooking = ({ lang }: Props) => {
  const text = myBookingText[lang];
  const [bookings, setBookings] = useState<StoredBooking[]>(() => readBookings(browserStore()));
  const [reference, setReference] = useState('');
  const [surname, setSurname] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [missing, setMissing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const detailsRef = useRef<HTMLHeadingElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);
  const opened = useRef(false);

  const current = bookings.find(item => item.reference === selected) ?? null;

  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return;
    }
    if (current) detailsRef.current?.focus();
  }, [selected]);

  useEffect(() => {
    if (notice) noticeRef.current?.focus();
  }, [notice]);

  const problems: Problem[] = [];
  if (reference.trim() === '')
    problems.push({ field: 'reference', message: text.referenceRequired });
  if (surname.trim() === '') problems.push({ field: 'surname', message: text.surnameRequired });
  const shown = attempted ? problems : [];
  const messageFor = (field: Problem['field']): string | undefined =>
    shown.find(item => item.field === field)?.message;

  const select = (value: string): void => {
    setSelected(value);
    setAsking(false);
    setFailed(false);
    setNotice(null);
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    setAttempted(true);
    setMissing(false);
    if (problems.length > 0) {
      const first = problems[0].field === 'reference' ? 'mb-reference' : 'mb-surname';
      document.getElementById(first)?.focus();
      return;
    }
    const found = findBooking(readBookings(browserStore()), reference, surname);
    if (!found) {
      setMissing(true);
      setSelected(null);
      document.getElementById('mb-reference')?.focus();
      return;
    }
    setBookings(readBookings(browserStore()));
    select(found.reference);
  };

  const cancel = (): void => {
    if (!current) return;
    const done = removeBooking(browserStore(), current.reference);
    if (!done) {
      setFailed(true);
      setAsking(false);
      return;
    }
    setBookings(readBookings(browserStore()));
    setSelected(null);
    setAsking(false);
    setNotice(text.cancelled(current.reference));
  };

  const stayOf = (booking: StoredBooking): string =>
    text.stayValue(formatDate(booking.arrival, lang), formatDate(departureOf(booking), lang));

  const breakfastOf = (booking: StoredBooking): string => {
    const status = breakfastStatus(booking);
    if (status === 'included') return text.breakfastIncluded;
    return status === 'paid' ? text.breakfastYes : text.breakfastNo;
  };

  return (
    <div class="karta">
      <div class="karta-in single">
        <form class="my-lookup" onSubmit={submit} noValidate>
          <h2 class="eyebrow">{text.lookupHeading}</h2>
          <Field
            id="mb-reference"
            label={text.reference}
            value={reference}
            hint={text.referenceHint}
            error={messageFor('reference')}
            autoComplete="off"
            onInput={setReference}
          />
          <Field
            id="mb-surname"
            label={text.surname}
            value={surname}
            error={messageFor('surname')}
            autoComplete="family-name"
            onInput={setSurname}
          />
          {shown.length > 0 ? (
            <div class="flow-error" role="alert">
              <strong>{text.errorsHeading}</strong>
              <ul>
                {shown.map(item => (
                  <li key={item.field}>{item.message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {missing ? (
            <p class="flow-error" role="alert">
              {text.notFound}
            </p>
          ) : null}
          <p class="actions">
            <button class="ticket rev" type="submit">
              {text.find}
            </button>
          </p>
        </form>

        {notice ? (
          <p class="notice" role="status" tabIndex={-1} ref={noticeRef}>
            {notice}
          </p>
        ) : null}

        {bookings.length > 0 ? (
          <div class="my-saved">
            <h2 class="eyebrow">{text.savedHeading}</h2>
            <p class="my-hint">{text.savedHint}</p>
            <ul class="bookings-list">
              {bookings.map(item => (
                <li key={item.reference}>
                  <button
                    type="button"
                    aria-pressed={item.reference === selected ? 'true' : 'false'}
                    onClick={() => select(item.reference)}>
                    <b>{item.reference}</b>
                    <span>{roomCopy[lang][item.roomId].name}</span>
                    <span>{stayOf(item)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div class="my-empty">
            <h2 class="eyebrow">{text.emptyHeading}</h2>
            <p>{text.emptyText}</p>
            <p class="actions">
              <a class="ticket rev" href={link(pagePath('booking', lang))}>
                {text.emptyLink}
              </a>
            </p>
          </div>
        )}

        {current ? (
          <div class="confirm my-details" id="my-details">
            <h2 class="confirm-h" tabIndex={-1} ref={detailsRef}>
              {text.detailsHeading}
            </h2>
            <strong class="done-ref">{current.reference}</strong>
            <dl class="leaders">
              <div>
                <dt>{text.rows.room}</dt>
                <dd class="text">{roomCopy[lang][current.roomId].name}</dd>
              </div>
              <div>
                <dt>{text.rows.stay}</dt>
                <dd class="text">
                  {stayOf(current)}, {nightsLabel(current.nights, lang)}
                </dd>
              </div>
              <div>
                <dt>{text.rows.guests}</dt>
                <dd>{guestsLabel(current.guests, lang)}</dd>
              </div>
              <div>
                <dt>{text.rows.package}</dt>
                <dd class="text">
                  {current.packageId ? packageCopy[lang][current.packageId].name : text.noPackage}
                </dd>
              </div>
              <div>
                <dt>{text.rows.breakfast}</dt>
                <dd class="text">{breakfastOf(current)}</dd>
              </div>
              <div>
                <dt>{text.rows.guest}</dt>
                <dd class="text">{current.name}</dd>
              </div>
              <div>
                <dt>{text.rows.contact}</dt>
                <dd class="text">
                  {current.phone}, {current.email}
                </dd>
              </div>
              {current.note ? (
                <div>
                  <dt>{text.rows.note}</dt>
                  <dd class="text">{current.note}</dd>
                </div>
              ) : null}
              <div>
                <dt>{text.rows.total}</dt>
                <dd>{formatMoney(current.total, lang)}</dd>
              </div>
            </dl>
            <p class="my-hint">{text.checkInOut}</p>
            {failed ? (
              <p class="flow-error" role="alert">
                {text.cancelFailed}
              </p>
            ) : null}
            {asking ? (
              <div class="my-ask" role="group" aria-label={text.cancel}>
                <p>{text.cancelAsk}</p>
                <p class="actions">
                  <button type="button" class="ticket rev" onClick={cancel}>
                    {text.cancelYes}
                  </button>
                  <button type="button" class="ghost" onClick={() => setAsking(false)}>
                    {text.cancelNo}
                  </button>
                </p>
              </div>
            ) : (
              <p class="actions">
                <button type="button" class="ghost" onClick={() => setAsking(true)}>
                  {text.cancel}
                </button>
              </p>
            )}
            <p class="confirm-call">
              {text.changes}{' '}
              <a class="confirm-tel" href={hotel.phoneHref}>
                {hotel.phone}
              </a>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
