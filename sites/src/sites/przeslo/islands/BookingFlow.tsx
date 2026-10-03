import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { bookingText } from '../content/booking';
import { pickerText } from '../content/picker';
import type { Lang } from '../i18n/lang';
import { createBooking } from '../lib/booking';
import type { StoredBooking } from '../lib/booking';
import { dayFromDate } from '../lib/dates';
import {
  firstBlockedStep,
  flowErrors,
  initialFlow,
  reconcileFlow,
  stepOrder,
  stepProblem,
  toBookingInput,
} from '../lib/flow';
import type { FlowState, StepId } from '../lib/flow';
import { hasErrors } from '../lib/guest';
import { browserStore, writeStoredBooking } from '../lib/storage';
import { buildBookingQuery, parseBookingQuery } from '../lib/urlState';
import { BookingAside } from './booking/BookingAside';
import { Confirmation } from './booking/Confirmation';
import { DatesStep } from './booking/DatesStep';
import { ExtrasStep } from './booking/ExtrasStep';
import { GuestStep } from './booking/GuestStep';
import { RoomStep } from './booking/RoomStep';
import { SummaryStep } from './booking/SummaryStep';

interface Props {
  lang: Lang;
}

const startingState = (today: number): { state: FlowState; step: StepId } => {
  const query = parseBookingQuery(window.location.search);
  const state = reconcileFlow(
    {
      ...initialFlow,
      selection: { arrival: query.arrival, departure: query.departure },
      guests: query.guests,
      packageMode: query.weekendPackage,
      roomType: query.room,
      rate: query.rate,
    },
    today,
  );
  return { state, step: stepProblem(state, 'dates') === null ? 'room' : 'dates' };
};

export const BookingFlow = ({ lang }: Props) => {
  const text = bookingText[lang];
  const picker = pickerText[lang];
  const today = useMemo(() => dayFromDate(new Date()), []);
  const initial = useMemo(() => startingState(today), [today]);
  const [state, setState] = useState<FlowState>(initial.state);
  const [step, setStep] = useState<StepId>(initial.step);
  const [attempted, setAttempted] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<StoredBooking | null>(null);
  const [stored, setStored] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const stepChanged = useRef(false);

  useEffect(() => {
    if (confirmed) return;
    const query = buildBookingQuery({
      arrival: state.selection.arrival,
      departure: state.selection.departure,
      guests: state.guests,
      room: state.roomType,
      rate: state.rate,
      weekendPackage: state.packageMode,
    });
    window.history.replaceState(null, '', `${window.location.pathname}${query}`);
  }, [state, confirmed]);

  useEffect(() => {
    if (!stepChanged.current) return;
    stepChanged.current = false;
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (confirmed) confirmationRef.current?.focus();
  }, [confirmed]);

  const update = (change: (current: FlowState) => FlowState): void => {
    setProblem(null);
    setState(current => change(current));
  };

  const goTo = (target: StepId): void => {
    stepChanged.current = true;
    setProblem(null);
    setAttempted(false);
    setStep(target);
  };

  const index = stepOrder.indexOf(step);

  const submit = (event: Event): void => {
    event.preventDefault();
    const blocked = stepProblem(state, step);
    if (blocked === 'guestInvalid' || blocked === 'invoiceInvalid') {
      setAttempted(true);
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    if (blocked !== null) {
      setProblem(text.problems[blocked]);
      return;
    }
    if (step === 'summary') {
      const input = toBookingInput(state, lang);
      const booking = input ? createBooking(input, new Date(), Math.random) : null;
      if (!booking) {
        setProblem(text.problems.unavailable);
        return;
      }
      setStored(writeStoredBooking(browserStore(), booking));
      setConfirmed(booking);
      return;
    }
    const next = stepOrder[index + 1];
    if (next) goTo(next);
  };

  const reachable = (target: StepId): boolean =>
    stepOrder.indexOf(target) <= index || firstBlockedStep(state, target) === null;

  if (confirmed) {
    return (
      <div class="flow flow--done">
        <Confirmation
          lang={lang}
          text={text}
          picker={picker}
          booking={confirmed}
          stored={stored}
          headingRef={confirmationRef}
        />
      </div>
    );
  }

  const shared = { lang, today, text, picker, state, update };
  const errors = flowErrors(state);
  const guestReady = !hasErrors(errors.guest) && !hasErrors(errors.invoice);

  return (
    <div class="flow">
      <nav aria-label={text.progressLabel}>
        <ol class="progress">
          {stepOrder.map((id, position) => (
            <li
              key={id}
              aria-current={id === step ? 'step' : undefined}
              data-done={position < index ? 'true' : undefined}>
              {reachable(id) && id !== step ? (
                <button type="button" onClick={() => goTo(id)}>
                  <span class="progress-name">{text.steps[id]}</span>
                </button>
              ) : (
                <span class="progress-name">{text.steps[id]}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div class="flow-layout">
        <form
          class="flow-step"
          noValidate
          onSubmit={submit}
          data-guest-ready={guestReady ? 'true' : undefined}>
          <p class="step-counter">{text.stepCounter(index + 1, stepOrder.length)}</p>
          <h2 tabIndex={-1} ref={headingRef}>
            {step === 'dates' ? text.dates.heading : null}
            {step === 'room' ? text.room.heading : null}
            {step === 'extras' ? text.extras.heading : null}
            {step === 'guest' ? text.guest.heading : null}
            {step === 'summary' ? text.summary.heading : null}
          </h2>
          {step === 'dates' ? <DatesStep {...shared} /> : null}
          {step === 'room' ? <RoomStep {...shared} /> : null}
          {step === 'extras' ? <ExtrasStep {...shared} /> : null}
          {step === 'guest' ? (
            <GuestStep {...shared} attempted={attempted} summaryRef={summaryRef} />
          ) : null}
          {step === 'summary' ? <SummaryStep {...shared} goTo={goTo} /> : null}
          {problem ? (
            <p class="field-error step-problem" role="alert">
              <span>{problem}</span>
            </p>
          ) : null}
          <div class="step-actions">
            {index > 0 ? (
              <button
                class="btn btn--ghost"
                type="button"
                onClick={() => goTo(stepOrder[index - 1] ?? 'dates')}>
                {text.back}
              </button>
            ) : null}
            <button class="btn" type="submit">
              {text.next[step]}
            </button>
          </div>
        </form>
        <BookingAside lang={lang} text={text} state={state} />
      </div>
    </div>
  );
};
