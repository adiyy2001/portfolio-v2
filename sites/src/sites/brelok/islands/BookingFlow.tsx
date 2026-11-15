import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { bookingText } from '../content/booking';
import { forms, problemText } from '../content/forms';
import { packageCopy, packageRule } from '../content/packages';
import { roomCopy } from '../content/rooms';
import {
  hotel,
  isPackageId,
  isRoomId,
  packageById,
  packages,
  roomTypeById,
  roomTypes,
} from '../data/hotel';
import type { PackageId, RoomId } from '../data/hotel';
import { pagePath } from '../i18n/lang';
import type { Lang } from '../i18n/lang';
import { buildBooking, departureOf } from '../lib/booking';
import type { StoredBooking } from '../lib/booking';
import {
  addDays,
  farthestArrival,
  formatDate,
  nearestFriday,
  parseIso,
  todayIso,
} from '../lib/dates';
import { formatMoney, guestsLabel, nightsLabel } from '../lib/format';
import {
  breakfastIncluded,
  clampGuests,
  clampNights,
  fitToPackage,
  packageFits,
  quoteStay,
} from '../lib/pricing';
import { browserStore, saveBooking } from '../lib/storage';
import { validateArrival, validateEmail, validateName, validatePhone } from '../lib/validation';
import type { FieldProblem } from '../lib/validation';
import { Field } from './Field';
import { Stepper } from './Stepper';

interface Props {
  lang: Lang;
}

interface Draft {
  arrival: string;
  nights: number;
  guests: number;
  roomId: RoomId;
  packageId: PackageId | null;
  breakfast: boolean;
  name: string;
  phone: string;
  email: string;
  note: string;
}

type FieldName = 'arrival' | 'name' | 'phone' | 'email';

interface Problem {
  field: FieldName;
  id: string;
  problem: FieldProblem;
}

const largestRoom = Math.max(...roomTypes.map(item => item.guests));
const fieldIds: Record<FieldName, string> = {
  arrival: 'bk-arrival',
  name: 'bk-name',
  phone: 'bk-phone',
  email: 'bk-email',
};
const stepFields: FieldName[][] = [['arrival'], [], ['name', 'phone', 'email'], []];

const settle = (draft: Draft): Draft => {
  const guests = Math.min(largestRoom, Math.max(1, draft.guests));
  const nights = clampNights(draft.nights);
  const fitting = roomTypes.find(item => item.guests >= guests);
  const roomId =
    roomTypeById(draft.roomId).guests >= guests ? draft.roomId : (fitting?.id ?? draft.roomId);
  const packageId =
    draft.packageId !== null && packageFits(draft.packageId, nights, guests)
      ? draft.packageId
      : null;
  return { ...draft, guests: clampGuests(guests, roomId), nights, roomId, packageId };
};

const startingDraft = (): Draft => {
  const query = new URLSearchParams(window.location.search);
  const room = query.get('room');
  const pack = query.get('package');
  const arrival = query.get('arrival');
  const nights = Number(query.get('nights'));
  const guests = Number(query.get('guests'));
  const today = todayIso();
  const packageId = isPackageId(pack) ? pack : null;
  const wantedNights = Number.isFinite(nights) && nights > 0 ? nights : 2;
  const wantedGuests = Number.isFinite(guests) && guests > 0 ? guests : 2;
  const fitted = packageId
    ? fitToPackage(
        packageId,
        Number.isFinite(nights) && nights > 0 ? nights : packageById(packageId).minNights,
        wantedGuests,
      )
    : { nights: wantedNights, guests: wantedGuests };
  return settle({
    arrival:
      arrival !== null && parseIso(arrival) && arrival >= today ? arrival : nearestFriday(today),
    nights: fitted.nights,
    guests: fitted.guests,
    roomId: isRoomId(room) ? room : 'dziedziniec',
    packageId,
    breakfast: false,
    name: '',
    phone: '',
    email: '',
    note: '',
  });
};

const photoPath = (id: RoomId): string => link(`/brelok/rooms/room-${id}.webp`);

export const BookingFlow = ({ lang }: Props) => {
  const text = bookingText[lang];
  const common = forms[lang];
  const [draft, setDraft] = useState<Draft>(startingDraft);
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState<StoredBooking | null>(null);
  const [failed, setFailed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    const target = saved ? doneRef.current : headingRef.current;
    target?.focus();
  }, [step, saved]);

  const change = (patch: Partial<Draft>): void => {
    setDraft(previous => settle({ ...previous, ...patch }));
  };

  const today = todayIso();
  const type = roomTypeById(draft.roomId);
  const copy = roomCopy[lang][draft.roomId];
  const quote = quoteStay(draft);
  const included = breakfastIncluded(draft);
  const arrivalProblem = validateArrival(draft.arrival, today);
  const departure = arrivalProblem === null ? addDays(draft.arrival, draft.nights) : '';

  const problemsFor = (index: number): Problem[] => {
    const found: Problem[] = [];
    const check = (field: FieldName, problem: FieldProblem | null): void => {
      if (problem !== null) found.push({ field, id: fieldIds[field], problem });
    };
    if (stepFields[index].includes('arrival')) check('arrival', arrivalProblem);
    if (stepFields[index].includes('name')) check('name', validateName(draft.name));
    if (stepFields[index].includes('phone')) check('phone', validatePhone(draft.phone));
    if (stepFields[index].includes('email')) check('email', validateEmail(draft.email));
    return found;
  };

  const shown = attempted ? problemsFor(step) : [];
  const messageFor = (field: FieldName): string | undefined => {
    const match = shown.find(item => item.field === field);
    return match ? problemText(lang, field, match.problem) : undefined;
  };

  const go = (index: number): void => {
    setStep(index);
    setAttempted(false);
    setFailed(false);
  };

  const focusField = (id: string): void => {
    window.setTimeout(() => document.getElementById(id)?.focus(), 0);
  };

  const submit = (event: Event): void => {
    event.preventDefault();
    const found = problemsFor(step);
    if (found.length > 0) {
      setAttempted(true);
      focusField(found[0].id);
      return;
    }
    if (step < 3) {
      go(step + 1);
      return;
    }
    const failedStep = [0, 2].find(index => problemsFor(index).length > 0);
    if (failedStep !== undefined) {
      go(failedStep);
      return;
    }
    const booking = buildBooking({
      roomId: draft.roomId,
      arrival: draft.arrival,
      nights: draft.nights,
      guests: draft.guests,
      packageId: draft.packageId,
      breakfast: draft.breakfast || included,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      note: draft.note.trim(),
    });
    if (!saveBooking(browserStore(), booking)) {
      setFailed(true);
      return;
    }
    setSaved(booking);
  };

  const reset = (): void => {
    setDraft(startingDraft());
    setSaved(null);
    go(0);
  };

  const lineLabel = (kind: 'room' | 'package' | 'breakfast'): string => {
    if (kind === 'room') return text.lineRoom(copy.name, nightsLabel(draft.nights, lang));
    if (kind === 'package' && draft.packageId)
      return text.linePackage(packageCopy[lang][draft.packageId].name);
    return text.lineBreakfast(guestsLabel(draft.guests, lang), nightsLabel(draft.nights, lang));
  };

  if (saved) {
    const savedRoom = roomCopy[lang][saved.roomId];
    return (
      <div class="karta">
        <div class="karta-in single">
          <div class="confirm done" id="booking-done">
            <h2 class="confirm-h" tabIndex={-1} ref={doneRef}>
              {text.done.heading}
            </h2>
            <p class="confirm-lead">{text.done.lead(saved.name)}</p>
            <p class="eyebrow">{text.done.reference}</p>
            <strong class="done-ref">{saved.reference}</strong>
            <dl class="leaders">
              <div>
                <dt>{text.rows.room}</dt>
                <dd class="text">{savedRoom.name}</dd>
              </div>
              <div>
                <dt>{text.rows.stay}</dt>
                <dd class="text">
                  {text.stayValue(
                    formatDate(saved.arrival, lang),
                    formatDate(departureOf(saved), lang),
                  )}
                </dd>
              </div>
              <div>
                <dt>{text.rows.guest}</dt>
                <dd>{guestsLabel(saved.guests, lang)}</dd>
              </div>
              <div>
                <dt>{text.rows.package}</dt>
                <dd class="text">
                  {saved.packageId ? packageCopy[lang][saved.packageId].name : text.rowNoPackage}
                </dd>
              </div>
              <div>
                <dt>{text.rows.total}</dt>
                <dd>{formatMoney(saved.total, lang)}</dd>
              </div>
            </dl>
            <p class="notice" role="status">
              {common.sampleNothingSent}
            </p>
            <p class="confirm-call">
              {text.done.changes}{' '}
              <a class="confirm-tel" href={hotel.phoneHref}>
                {hotel.phone}
              </a>
            </p>
            <p class="confirm-extra">
              <a href={link(pagePath('myBooking', lang))}>{text.done.seeBooking}</a>
              <button type="button" class="linkish" onClick={reset}>
                {text.done.again}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summaryRows = [
    {
      label: text.rows.stay,
      value:
        departure === ''
          ? text.noDate
          : text.stayValue(formatDate(draft.arrival, lang), formatDate(departure, lang)),
      target: 0,
    },
    {
      label: text.rows.room,
      value: `${copy.name}, ${guestsLabel(draft.guests, lang)}, ${nightsLabel(draft.nights, lang)}`,
      target: 1,
    },
    {
      label: text.rows.package,
      value: draft.packageId ? packageCopy[lang][draft.packageId].name : text.rowNoPackage,
      target: 1,
    },
    {
      label: text.rows.breakfast,
      value: included
        ? text.rowBreakfastIncluded
        : draft.breakfast
          ? text.rowBreakfastYes
          : text.rowBreakfastNo,
      target: 1,
    },
    { label: text.rows.guest, value: draft.name, target: 2 },
    { label: text.rows.contact, value: `${draft.phone}, ${draft.email}`, target: 2 },
  ];
  if (draft.note.trim() !== '') {
    summaryRows.push({ label: text.rows.note, value: draft.note.trim(), target: 2 });
  }

  return (
    <div class="karta">
      <div class="karta-in single">
        <ol class="steps" aria-label={text.stepsLabel}>
          {text.steps.map((label, index) => (
            <li
              key={label}
              data-n={index + 1}
              aria-current={index === step ? 'step' : undefined}
              class={index < step ? 'done' : undefined}>
              {label}
            </li>
          ))}
        </ol>
        <div class="flow">
          <form class="flow-main" onSubmit={submit} noValidate aria-labelledby="bk-step-h">
            <h2 class="step-h" id="bk-step-h" tabIndex={-1} ref={headingRef}>
              {text.stepHeadings[step]}
            </h2>
            {step === 0 ? (
              <div class="fields">
                <Field
                  id={fieldIds.arrival}
                  name="arrival"
                  label={common.arrival}
                  type="date"
                  value={draft.arrival}
                  min={today}
                  max={farthestArrival(today)}
                  autoComplete="off"
                  error={messageFor('arrival')}
                  hint={departure === '' ? undefined : text.departure(formatDate(departure, lang))}
                  onInput={value => change({ arrival: value })}
                />
                <Stepper
                  id="bk-nights"
                  label={common.nights}
                  value={draft.nights}
                  min={hotel.minNights}
                  max={hotel.maxNights}
                  downLabel={common.nightsDown}
                  upLabel={common.nightsUp}
                  onChange={value => change({ nights: value })}
                />
                <Stepper
                  id="bk-guests"
                  label={common.guests}
                  value={draft.guests}
                  min={1}
                  max={largestRoom}
                  downLabel={common.guestsDown}
                  upLabel={common.guestsUp}
                  onChange={value => change({ guests: value })}
                />
              </div>
            ) : null}
            {step === 1 ? (
              <>
                <fieldset class="choices two">
                  <legend>{text.roomLegend}</legend>
                  {roomTypes.map(item => {
                    const itemCopy = roomCopy[lang][item.id];
                    const fits = item.guests >= draft.guests;
                    const id = `bk-room-${item.id}`;
                    return (
                      <div class="choice" key={item.id}>
                        <input
                          type="radio"
                          name="room"
                          id={id}
                          value={item.id}
                          checked={item.id === draft.roomId}
                          disabled={!fits}
                          onChange={() => change({ roomId: item.id })}
                        />
                        <label for={id}>
                          <span>
                            <span class="c-main">{itemCopy.name}</span>
                            <span class="c-sub">
                              {fits
                                ? text.roomSub(item.area, item.guests)
                                : text.roomTooSmall(draft.guests)}
                            </span>
                            <span class="c-sub">{text.roomRate(item.rate)}</span>
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
                <fieldset class="choices">
                  <legend>{text.packageLegend}</legend>
                  <div class="choice">
                    <input
                      type="radio"
                      name="package"
                      id="bk-package-none"
                      value=""
                      checked={draft.packageId === null}
                      onChange={() => change({ packageId: null })}
                    />
                    <label for="bk-package-none">
                      <span>
                        <span class="c-main">{text.noPackage}</span>
                        <span class="c-sub">{text.noPackageSub}</span>
                      </span>
                    </label>
                  </div>
                  {packages.map(item => {
                    const itemCopy = packageCopy[lang][item.id];
                    const fits = packageFits(item.id, draft.nights, draft.guests);
                    const id = `bk-package-${item.id}`;
                    return (
                      <div class="choice" key={item.id}>
                        <input
                          type="radio"
                          name="package"
                          id={id}
                          value={item.id}
                          checked={item.id === draft.packageId}
                          disabled={!fits}
                          onChange={() => change({ packageId: item.id })}
                        />
                        <label for={id}>
                          <span>
                            <span class="c-main">{itemCopy.name}</span>
                            <span class="c-sub">
                              {fits ? itemCopy.tagline : text.packageDoesNotFit}
                            </span>
                            <span class="c-sub">{packageRule(packageById(item.id), lang)}</span>
                          </span>
                          <span class="c-price">{formatMoney(item.price, lang)}</span>
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
                <fieldset class="choices">
                  <legend>{text.breakfastLegend}</legend>
                  <div class="choice">
                    <input
                      type="checkbox"
                      id="bk-breakfast"
                      checked={included || draft.breakfast}
                      disabled={included}
                      onChange={event => change({ breakfast: event.currentTarget.checked })}
                    />
                    <label for="bk-breakfast">
                      <span>
                        <span class="c-main">
                          {included ? text.breakfastIncluded : text.breakfastAdd}
                        </span>
                        <span class="c-sub">
                          {included ? text.breakfastIncludedSub : text.breakfastAddSub}
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>
              </>
            ) : null}
            {step === 2 ? (
              <div class="fields">
                <Field
                  id={fieldIds.name}
                  name="name"
                  label={common.name}
                  value={draft.name}
                  autoComplete="name"
                  error={messageFor('name')}
                  onInput={value => change({ name: value })}
                />
                <Field
                  id={fieldIds.phone}
                  name="phone"
                  label={common.phone}
                  type="tel"
                  inputMode="tel"
                  value={draft.phone}
                  autoComplete="tel"
                  error={messageFor('phone')}
                  onInput={value => change({ phone: value })}
                />
                <Field
                  id={fieldIds.email}
                  name="email"
                  label={common.email}
                  type="email"
                  inputMode="email"
                  value={draft.email}
                  autoComplete="email"
                  hint={text.emailHint}
                  error={messageFor('email')}
                  onInput={value => change({ email: value })}
                />
                <Field
                  id="bk-note"
                  name="note"
                  label={common.note}
                  value={draft.note}
                  multiline
                  required={false}
                  maxLength={400}
                  hint={text.noteHint}
                  onInput={value => change({ note: value })}
                />
              </div>
            ) : null}
            {step === 3 ? (
              <>
                <dl class="leaders">
                  {summaryRows.map(row => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd class="text">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p class="flow-nav">
                  {[
                    { label: text.rows.stay, target: 0 },
                    { label: text.rows.room, target: 1 },
                    { label: text.rows.guest, target: 2 },
                  ].map(item => (
                    <button
                      type="button"
                      class="ghost"
                      key={item.target}
                      onClick={() => go(item.target)}>
                      {text.change}
                      <span class="sr">: {item.label}</span>
                    </button>
                  ))}
                </p>
              </>
            ) : null}
            {shown.length > 0 ? (
              <div class="flow-error" role="alert">
                <strong>{common.errorsHeading}</strong>
                <ul>
                  {shown.map(item => (
                    <li key={item.field}>{problemText(lang, item.field, item.problem)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {failed ? (
              <p class="flow-error" role="alert">
                {text.saveFailed}
              </p>
            ) : null}
            <div class="flow-nav">
              {step > 0 ? (
                <button type="button" class="ghost" onClick={() => go(step - 1)}>
                  {text.back}
                </button>
              ) : (
                <span></span>
              )}
              <button class="ticket rev" type="submit">
                {step < 3 ? text.next : text.confirm}
              </button>
            </div>
          </form>
          <aside class="flow-side" aria-label={text.summaryHeading}>
            <figure>
              <span class="pic">
                <img src={photoPath(draft.roomId)} width="900" height="675" alt={copy.alt} />
              </span>
              <figcaption>
                {text.sideCaption}: {copy.name}
              </figcaption>
            </figure>
            <dl class="lines">
              {quote.lines.map(line => (
                <div key={line.kind}>
                  <dt>{lineLabel(line.kind)}</dt>
                  <dd>{formatMoney(line.amount, lang)}</dd>
                </div>
              ))}
            </dl>
            <div class="total" aria-live="polite" aria-atomic="true">
              <span class="caps">{text.rows.total}</span>
              <strong>{formatMoney(quote.total, lang)}</strong>
              <span class="dates">
                {departure === ''
                  ? text.noDate
                  : text.stayValue(formatDate(draft.arrival, lang), formatDate(departure, lang))}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
