import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { forms, problemText } from '../content/forms';
import { homeText } from '../content/home';
import { roomCopy } from '../content/rooms';
import { hotel, roomTypes, roomTypeById, padNumber } from '../data/hotel';
import type { RoomId } from '../data/hotel';
import { pagePath } from '../i18n/lang';
import type { Lang } from '../i18n/lang';
import { buildBooking, departureOf } from '../lib/booking';
import { addDays, formatDate, nearestFriday, todayIso } from '../lib/dates';
import { formatMoney, nightsLabel } from '../lib/format';
import { clampNights } from '../lib/pricing';
import { browserStore, saveBooking } from '../lib/storage';
import { validateArrival, validateName, validatePhone } from '../lib/validation';
import type { StoredBooking } from '../lib/booking';
import { Diamond } from './Diamond';
import { Field } from './Field';
import { Stepper } from './Stepper';

interface Props {
  lang: Lang;
}

const photoPath = (id: RoomId, small: boolean): string =>
  link(`/brelok/rooms/room-${id}${small ? '-s' : ''}.webp`);

export const HomeBooking = ({ lang }: Props) => {
  const text = homeText[lang];
  const common = forms[lang];
  const [roomId, setRoomId] = useState<RoomId>('dziedziniec');
  const [nights, setNights] = useState(1);
  const [arrival, setArrival] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState<StoredBooking | null>(null);
  const [failed, setFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const arrivalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setArrival(nearestFriday(todayIso()));
  }, []);

  const type = roomTypeById(roomId);
  const copy = roomCopy[lang][roomId];
  const today = todayIso();
  const arrivalProblem = arrival === '' ? null : validateArrival(arrival, today);
  const shownArrival = attempted || arrival !== '' ? arrivalProblem : null;
  const nameProblem = attempted ? validateName(name) : null;
  const phoneProblem = attempted ? validatePhone(phone) : null;
  const total = type.rate * nights;
  const departure = arrival !== '' && arrivalProblem === null ? addDays(arrival, nights) : '';

  const submit = (event: Event): void => {
    event.preventDefault();
    setAttempted(true);
    setFailed(false);
    if (validateArrival(arrival, today) || validateName(name) || validatePhone(phone)) {
      if (validateArrival(arrival, today)) arrivalRef.current?.focus();
      return;
    }
    const booking = buildBooking({
      roomId,
      arrival,
      nights,
      guests: Math.min(2, type.guests),
      packageId: null,
      breakfast: false,
      name: name.trim(),
      phone: phone.trim(),
      email: '',
      note: '',
    });
    if (!saveBooking(browserStore(), booking)) {
      setFailed(true);
      return;
    }
    setSaved(booking);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  const reset = (): void => {
    setSaved(null);
    setAttempted(false);
    setName('');
    setPhone('');
    window.setTimeout(() => arrivalRef.current?.focus(), 0);
  };

  const bookingHref = link(pagePath('booking', lang));
  const query = new URLSearchParams({ room: roomId, nights: String(nights) });
  if (arrival !== '') query.set('arrival', arrival);

  return (
    <>
      <fieldset class="plates" id="rooms">
        <legend class="sr">{text.rooms.legend}</legend>
        {roomTypes.map(item => {
          const itemCopy = roomCopy[lang][item.id];
          const inputId = `room-${item.id}`;
          return (
            <div class="rp" key={item.id}>
              <input
                class="rp-in"
                type="radio"
                name="room"
                id={inputId}
                value={item.id}
                checked={item.id === roomId}
                onChange={() => setRoomId(item.id)}
              />
              <label class="rp-face" for={inputId}>
                <span class="ov">
                  <span class="sr">{text.rooms.roomNumber}</span>
                  {padNumber(item.showcase)}
                </span>
                <span class="pic">
                  <img
                    src={photoPath(item.id, true)}
                    width={480}
                    height={360}
                    alt={itemCopy.alt}
                    loading="lazy"
                  />
                </span>
                <span class="rname">{itemCopy.name}</span>
                <span class="rtext">{itemCopy.card}</span>
                <span class="lr">
                  <span class="lk">{text.rooms.area}</span>
                  <i></i>
                  <b>{item.area} m²</b>
                </span>
                <span class="lr">
                  <span class="lk">{text.rooms.rate}</span>
                  <i></i>
                  <b>{formatMoney(item.rate, lang)}</b>
                </span>
              </label>
            </div>
          );
        })}
      </fieldset>
      <div class="karta" id="karta" aria-labelledby="karta-h" role="group">
        <div class="karta-in">
          <figure class="karta-pic">
            <span class="pic big">
              <svg class="co tl" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <use href="#co" />
              </svg>
              <svg class="co tr" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <use href="#co" />
              </svg>
              <svg class="co bl" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <use href="#co" />
              </svg>
              <svg class="co br" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <use href="#co" />
              </svg>
              <img
                src={photoPath(roomId, false)}
                width={900}
                height={675}
                alt={copy.alt}
                loading="lazy"
              />
            </span>
            <figcaption>
              {text.rooms.photoCaption} {copy.name}
            </figcaption>
          </figure>
          <div class="karta-body">
            <h3 id="karta-h">{text.card.heading}</h3>
            <dl class="leaders">
              <div>
                <dt>{text.rooms.room}</dt>
                <dd>
                  {copy.name}, {text.rooms.no} {padNumber(type.showcase)}
                </dd>
              </div>
              <div>
                <dt>{text.rooms.area}</dt>
                <dd>{type.area} m²</dd>
              </div>
              <div>
                <dt>{text.rooms.view}</dt>
                <dd class="text">{copy.view}</dd>
              </div>
              <div>
                <dt>{text.rooms.rate}</dt>
                <dd>{formatMoney(type.rate, lang)}</dd>
              </div>
            </dl>
            <p class="noscript-note">{text.card.noScript}</p>
            {saved === null ? (
              <form class="karta-form" onSubmit={submit} noValidate>
                <div class="fields">
                  <Stepper
                    id="nights"
                    label={common.nights}
                    value={nights}
                    min={hotel.minNights}
                    max={hotel.maxNights}
                    downLabel={common.nightsDown}
                    upLabel={common.nightsUp}
                    onChange={value => setNights(clampNights(value))}
                  />
                  <div class="field">
                    <label class="caps" for="arrival">
                      {common.arrival}
                    </label>
                    <input
                      id="arrival"
                      ref={arrivalRef}
                      class="date"
                      type="date"
                      value={arrival}
                      min={today}
                      autoComplete="off"
                      required
                      aria-invalid={shownArrival ? 'true' : 'false'}
                      aria-describedby="arrival-note"
                      onInput={event => setArrival(event.currentTarget.value)}
                    />
                    <span id="arrival-note" class="date-note" role="status">
                      {problemText(lang, 'arrival', shownArrival)}
                    </span>
                  </div>
                </div>
                <div class="total" aria-live="polite" aria-atomic="true">
                  <span class="caps">{nightsLabel(nights, lang)}</span>
                  <strong>{formatMoney(total, lang)}</strong>
                  <span class="dates">
                    {departure === ''
                      ? text.card.pickDate
                      : text.card.stay(formatDate(arrival, lang), formatDate(departure, lang))}
                  </span>
                </div>
                <div class="fields who">
                  <Field
                    id="guest-name"
                    label={text.card.name}
                    value={name}
                    autoComplete="name"
                    error={problemText(lang, 'name', nameProblem) || undefined}
                    onInput={setName}
                  />
                  <Field
                    id="guest-phone"
                    label={text.card.phone}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    autoComplete="tel"
                    error={problemText(lang, 'phone', phoneProblem) || undefined}
                    onInput={setPhone}
                  />
                </div>
                <div class="karta-go">
                  <img
                    class="go-pic"
                    src={photoPath(roomId, true)}
                    width={480}
                    height={360}
                    alt=""
                    aria-hidden="true"
                  />
                  <button class="ticket rev send-btn" type="submit">
                    <Diamond />
                    {text.card.submit}
                    <Diamond />
                  </button>
                  {failed ? (
                    <p class="send-error" role="alert">
                      {text.card.saveFailed}
                    </p>
                  ) : null}
                  <p class="send-note">{text.card.callNote}</p>
                  <a class="tel-alt" href={hotel.phoneHref}>
                    {text.card.callAlt}: {hotel.phone}
                  </a>
                  <a class="tel-alt" href={`${bookingHref}?${query.toString()}`}>
                    {text.card.fullBooking}
                  </a>
                </div>
              </form>
            ) : (
              <div class="confirm" id="confirm">
                <h4 class="confirm-h" tabIndex={-1} ref={headingRef}>
                  {text.card.doneHeading}
                </h4>
                <p class="confirm-lead">{text.card.doneLead(saved.name, saved.phone)}</p>
                <p class="confirm-ref">
                  {text.card.reference} <strong>{saved.reference}</strong>
                </p>
                <dl class="leaders">
                  <div>
                    <dt>{text.card.rowRoom}</dt>
                    <dd>
                      {roomCopy[lang][saved.roomId].name}, {text.rooms.no}{' '}
                      {padNumber(roomTypeById(saved.roomId).showcase)}
                    </dd>
                  </div>
                  <div>
                    <dt>{text.card.rowArrival}</dt>
                    <dd>{formatDate(saved.arrival, lang)}</dd>
                  </div>
                  <div>
                    <dt>{text.card.rowDeparture}</dt>
                    <dd>{formatDate(departureOf(saved), lang)}</dd>
                  </div>
                  <div>
                    <dt>{text.card.rowNights}</dt>
                    <dd>{nightsLabel(saved.nights, lang)}</dd>
                  </div>
                  <div>
                    <dt>{text.card.rowTotal}</dt>
                    <dd>{formatMoney(saved.total, lang)}</dd>
                  </div>
                </dl>
                <p class="notice" role="status">
                  {common.sampleNothingSent}
                </p>
                <p class="confirm-call">
                  {text.card.urgent}{' '}
                  <a class="confirm-tel" href={hotel.phoneHref}>
                    {hotel.phone}
                  </a>
                </p>
                <p class="confirm-extra">
                  <a href={link(pagePath('myBooking', lang))}>{text.card.seeBooking}</a>
                  <button type="button" class="linkish" onClick={reset}>
                    {text.card.again}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
