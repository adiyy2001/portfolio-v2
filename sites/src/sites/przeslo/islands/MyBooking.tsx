import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { bookingText } from '../content/booking';
import { myBookingText } from '../content/myBooking';
import { roomText } from '../content/rooms';
import { extraDefinitions } from '../data/extras';
import type { ExtraId, ExtraSelection } from '../data/extras';
import { roomTypeById } from '../data/rooms';
import type { Lang } from '../i18n/lang';
import {
  bookingStatus,
  buildSampleBooking,
  cancelBooking,
  cancellationOutcome,
  quoteBooking,
  stayOf,
  updateExtras,
} from '../lib/booking';
import type { StoredBooking } from '../lib/booking';
import { dayFromDate } from '../lib/dates';
import { packageIncludes } from '../lib/flow';
import { formatDate, formatDayShort, formatGuests, formatNights, formatPln } from '../lib/format';
import { lookupProblem } from '../lib/lookup';
import type { LookupProblem } from '../lib/lookup';
import { weekendPackageApplies } from '../lib/pricing';
import {
  browserStore,
  readStoredBooking,
  removeStoredBooking,
  writeStoredBooking,
} from '../lib/storage';
import { link } from '../../../shared/link';
import { pagePath } from '../i18n/lang';
import { buildBookingQuery } from '../lib/urlState';
import { Field } from './Field';
import { PriceBreakdown } from './PriceBreakdown';
import { Stepper } from './Stepper';
import { downloadIcs } from './downloadIcs';

interface Props {
  lang: Lang;
}

const codeId = 'lookup-code';
const emailId = 'lookup-email';

export const MyBooking = ({ lang }: Props) => {
  const text = myBookingText[lang];
  const flowText = bookingText[lang];
  const today = useMemo(() => dayFromDate(new Date()), []);
  const [stored, setStored] = useState<StoredBooking | null>(() =>
    readStoredBooking(browserStore()),
  );
  const [booking, setBooking] = useState<StoredBooking | null>(null);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState<LookupProblem | null>(null);
  const [missing, setMissing] = useState({ code: false, email: false });
  const [attempted, setAttempted] = useState(false);
  const [message, setMessage] = useState('');
  const [draftExtras, setDraftExtras] = useState<ExtraSelection>({});
  const [draftPackage, setDraftPackage] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasStorage = useMemo(() => browserStore() !== null, []);

  useEffect(() => {
    if (booking) headingRef.current?.focus();
  }, [booking?.code]);

  const open = (next: StoredBooking): void => {
    setBooking(next);
    setDraftExtras(next.extras);
    setDraftPackage(next.weekendPackage);
    setConfirmingCancel(false);
    setMessage('');
    setNow(Date.now());
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  const submitLookup = (event: Event): void => {
    event.preventDefault();
    const found = lookupProblem(stored, code, email);
    setMissing({ code: code.trim() === '', email: email.trim() === '' });
    setProblem(found);
    setAttempted(true);
    if (found === null && stored) {
      open(stored);
      return;
    }
    window.setTimeout(() => summaryRef.current?.focus(), 0);
  };

  const loadSample = (): void => {
    const sample = buildSampleBooking(today, lang, new Date());
    if (!sample) {
      setProblem(null);
      setMessage(text.lookup.sampleFailed);
      return;
    }
    writeStoredBooking(browserStore(), sample);
    setStored(sample);
    setCode(sample.code);
    setEmail(sample.guest.email);
    setProblem(null);
    setAttempted(false);
    open(sample);
  };

  const forget = (): void => {
    removeStoredBooking(browserStore());
    setStored(null);
    setBooking(null);
    setCode('');
    setEmail('');
    setProblem(null);
    setAttempted(false);
    setMessage(text.forgotten);
  };

  if (!booking) {
    const codeError = attempted && missing.code ? text.lookup.problems.codeRequired : undefined;
    const emailError = attempted && missing.email ? text.lookup.problems.emailRequired : undefined;
    const generalError =
      attempted && problem === 'notFound' ? text.lookup.problems.notFound : undefined;
    const summaryItems: { href: string; text: string }[] = [];
    if (codeError)
      summaryItems.push({ href: `#${codeId}`, text: `${text.lookup.code}: ${codeError}` });
    if (emailError)
      summaryItems.push({ href: `#${emailId}`, text: `${text.lookup.email}: ${emailError}` });
    return (
      <div class="mybooking">
        <div role="status">{message ? <p class="notice">{message}</p> : null}</div>
        <form class="lookup" onSubmit={submitLookup} noValidate>
          <h2>{text.lookup.heading}</h2>
          {stored ? (
            <p class="notice lookup-stored">
              {text.lookup.storedFound(stored.code)}{' '}
              <button type="button" class="text-button" onClick={() => open(stored)}>
                {text.lookup.storedOpen}
              </button>
            </p>
          ) : null}
          {!hasStorage ? <p class="notice">{text.lookup.noStorage}</p> : null}
          {summaryItems.length > 0 || generalError ? (
            <div class="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
              <h3>{text.lookup.errorSummary}</h3>
              <ul>
                {generalError ? <li>{generalError}</li> : null}
                {summaryItems.map(item => (
                  <li key={item.href}>
                    <a href={item.href}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div class="form-grid lookup-fields">
            <Field
              id={codeId}
              label={text.lookup.code}
              hint={text.lookup.codeHint}
              value={code}
              error={codeError}
              autoComplete="off"
              maxLength={20}
              onInput={setCode}
            />
            <Field
              id={emailId}
              label={text.lookup.email}
              type="email"
              value={email}
              error={emailError}
              autoComplete="email"
              onInput={setEmail}
            />
          </div>
          <div class="btn-row">
            <button class="btn" type="submit">
              {text.lookup.submit}
            </button>
          </div>
        </form>
        <section class="sample-offer" aria-labelledby="sample-offer-title">
          <h2 id="sample-offer-title">{text.lookup.sampleHeading}</h2>
          <p>{text.lookup.sampleText}</p>
          <div class="btn-row">
            <button class="btn btn--ghost" type="button" onClick={loadSample}>
              {text.lookup.sampleButton}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const status = bookingStatus(booking, now);
  const editable = status === 'upcoming';
  const stay = stayOf(booking);
  const room = roomText[lang][booking.roomType];
  const type = roomTypeById(booking.roomType);
  const packageAllowed = weekendPackageApplies(stay.arrival, stay.nights);
  const preview = editable ? updateExtras(booking, draftExtras, draftPackage) : booking;
  const quote = quoteBooking(preview);
  const difference = quote.total - quoteBooking(booking).total;
  const changed = editable && JSON.stringify(preview) !== JSON.stringify(booking);
  const packageOn = preview.weekendPackage;
  const outcome = cancellationOutcome(
    booking,
    booking.cancelledAt ? Date.parse(booking.cancelledAt) : now,
  );
  const outcomeWords = status === 'cancelled' ? text.outcomeDone : text.outcome;
  const outcomeText =
    outcome.kind === 'free'
      ? outcomeWords.free
      : outcome.kind === 'firstNight'
        ? outcomeWords.firstNight(formatPln(outcome.charge, lang))
        : outcomeWords.nonRefundable(formatPln(outcome.charge, lang));

  const rebookHref =
    link(pagePath('booking', lang)) +
    buildBookingQuery(
      stay.arrival >= today
        ? { arrival: stay.arrival, departure: stay.departure, guests: booking.guests }
        : { arrival: null, departure: null, guests: booking.guests },
    );

  const setCount = (id: ExtraId, count: number): void => {
    setMessage('');
    setDraftExtras(current => ({ ...current, [id]: count }));
  };

  const saveExtras = (): void => {
    const saved = updateExtras(booking, draftExtras, draftPackage);
    writeStoredBooking(browserStore(), saved);
    setStored(saved);
    setBooking(saved);
    setDraftExtras(saved.extras);
    setDraftPackage(saved.weekendPackage);
    setMessage(text.extrasSaved);
  };

  const confirmCancel = (): void => {
    const cancelled = cancelBooking(booking, new Date());
    writeStoredBooking(browserStore(), cancelled);
    setStored(cancelled);
    setBooking(cancelled);
    setConfirmingCancel(false);
    setMessage('');
    setNow(Date.now());
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  return (
    <div class="mybooking mybooking--open">
      <div class="booking-head">
        <p class="booking-status" data-status={status}>
          {text.status[status]}
        </p>
        <h2 tabIndex={-1} ref={headingRef}>
          {text.code}: <span class="booking-code">{booking.code}</span>
        </h2>
        <p class="step-lead">{text.statusLead[status]}</p>
      </div>
      <div role="status">{message ? <p class="notice notice--strong">{message}</p> : null}</div>
      <div class="mybooking-grid">
        <section aria-labelledby="mb-details">
          <h3 id="mb-details" class="step-subheading">
            {text.detailsHeading}
          </h3>
          <dl class="detail-list">
            <div>
              <dt>{flowText.summary.stay}</dt>
              <dd>
                {text.stayLine(
                  formatDayShort(stay.arrival, lang),
                  formatDayShort(stay.departure, lang),
                  formatNights(stay.nights, lang),
                )}
              </dd>
            </div>
            <div>
              <dt>{flowText.summary.room}</dt>
              <dd>{text.guestsLine(formatGuests(booking.guests, lang), room.name, type.size)}</dd>
            </div>
            <div>
              <dt>{text.rate}</dt>
              <dd>{flowText.room.rates[booking.rate].name}</dd>
            </div>
            <div>
              <dt>{text.guestHeading}</dt>
              <dd>
                {booking.guest.name}, {booking.guest.email}
              </dd>
            </div>
          </dl>
          <div class="key-tag">
            <p>{text.roomKey(booking.roomNumber, room.name)}</p>
          </div>
        </section>
        <section aria-labelledby="mb-price">
          <h3 id="mb-price" class="step-subheading">
            {text.priceHeading}
          </h3>
          <PriceBreakdown
            quote={quote}
            lang={lang}
            text={flowText}
            voided={status === 'cancelled'}
            totalLabel={status === 'cancelled' ? text.cancelledOriginalTotal : undefined}
          />
          {status === 'cancelled' ? (
            <p class="charge-line">{text.cancelledDue(formatPln(outcome.charge, lang))}</p>
          ) : null}
          {changed ? (
            <p class="notice" role="status">
              {difference === 0
                ? text.extraNoChange
                : text.extraChange(`${difference > 0 ? '+' : ''}${formatPln(difference, lang)}`)}
            </p>
          ) : null}
        </section>
      </div>

      {status === 'cancelled' ? null : (
        <section class="mybooking-extras" aria-labelledby="mb-extras">
          <h3 id="mb-extras" class="step-subheading">
            {text.extrasHeading}
          </h3>
          <p class="step-lead">{editable ? text.extrasLead : text.extrasLocked}</p>
          {packageAllowed ? (
            <div class="package-toggle">
              <label class="check">
                <input
                  type="checkbox"
                  checked={draftPackage}
                  disabled={!editable}
                  onChange={event => {
                    setMessage('');
                    setDraftPackage(event.currentTarget.checked);
                  }}
                />
                <span>
                  {text.packageToggle}
                  <span class="hint-line">{text.packageHint}</span>
                </span>
              </label>
            </div>
          ) : booking.weekendPackage ? null : (
            <p class="step-note">{text.packageUnavailable}</p>
          )}
          <ul class="extras">
            {extraDefinitions.map(definition => {
              const copy = flowText.extras.items[definition.id];
              const max = definition.maxCount(booking.guests);
              const included = packageOn && packageIncludes.includes(definition.id);
              const count = included
                ? definition.id === 'breakfast'
                  ? booking.guests
                  : 1
                : (draftExtras[definition.id] ?? 0);
              const nameId = `mb-extra-${definition.id}`;
              const locked = !editable || included;
              return (
                <li class="extra" key={definition.id}>
                  <div class="extra-text">
                    <p class="extra-name" id={nameId}>
                      {copy.name}
                      {included ? (
                        <span class="extra-badge">{flowText.extras.included}</span>
                      ) : null}
                    </p>
                    <p class="extra-help">{copy.help}</p>
                  </div>
                  <p class="extra-price">
                    <span class="num">
                      {definition.price === 0
                        ? flowText.extras.free
                        : formatPln(definition.price, lang)}
                    </span>
                    {definition.price === 0 ? null : <span>{copy.unit}</span>}
                  </p>
                  <div class="extra-control">
                    {max === 1 ? (
                      <label class="check">
                        <input
                          type="checkbox"
                          checked={count === 1}
                          disabled={locked}
                          aria-labelledby={nameId}
                          onChange={event =>
                            setCount(definition.id, event.currentTarget.checked ? 1 : 0)
                          }
                        />
                        <span class="visually-hidden">{copy.name}</span>
                      </label>
                    ) : (
                      <Stepper
                        labelledBy={nameId}
                        value={count}
                        min={0}
                        max={max}
                        disabled={locked}
                        lessLabel={flowText.extras.less(copy.name)}
                        moreLabel={flowText.extras.more(copy.name)}
                        onChange={value => setCount(definition.id, value)}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {editable ? (
            <div class="btn-row">
              <button class="btn" type="button" disabled={!changed} onClick={saveExtras}>
                {text.saveExtras}
              </button>
            </div>
          ) : null}
        </section>
      )}

      {status === 'cancelled' ? (
        <div class="btn-row">
          <a class="btn" href={rebookHref}>
            {text.rebook}
          </a>
        </div>
      ) : (
        <div class="btn-row">
          <button class="btn btn--ghost" type="button" onClick={() => downloadIcs(booking)}>
            {text.calendar}
          </button>
        </div>
      )}

      {status === 'cancelled' && booking.cancelledAt ? (
        <section class="cancel-panel" aria-labelledby="mb-cancel">
          <h3 id="mb-cancel" class="step-subheading">
            {text.cancelHeading}
          </h3>
          <p class="notice notice--strong">
            {text.cancelledNotice(formatDate(dayFromDate(new Date(booking.cancelledAt)), lang))}
          </p>
          <p>{outcomeText}</p>
          <p class="step-note">{text.cancelledNothing}</p>
        </section>
      ) : status === 'upcoming' ? (
        <section class="cancel-panel" aria-labelledby="mb-cancel">
          <h3 id="mb-cancel" class="step-subheading">
            {text.cancelHeading}
          </h3>
          <p class="step-lead">{text.cancelLead}</p>
          <p class="notice">{outcomeText}</p>
          {confirmingCancel ? (
            <div class="btn-row" role="group" aria-label={text.cancelHeading}>
              <button class="btn" type="button" onClick={confirmCancel}>
                {text.cancelConfirm}
              </button>
              <button
                class="btn btn--ghost"
                type="button"
                onClick={() => setConfirmingCancel(false)}>
                {text.cancelKeep}
              </button>
            </div>
          ) : (
            <div class="btn-row">
              <button
                class="btn btn--ghost"
                type="button"
                onClick={() => setConfirmingCancel(true)}>
                {text.cancelStart}
              </button>
            </div>
          )}
        </section>
      ) : null}

      <section class="forget-panel">
        <p class="step-note">{text.forgetHint}</p>
        <button class="text-button" type="button" onClick={forget}>
          {text.forget}
        </button>
      </section>
    </div>
  );
};
