import { useMemo, useState } from 'preact/hooks';
import { pickerText } from '../content/picker';
import { maxCapacity } from '../data/rooms';
import type { Lang } from '../i18n/lang';
import { pagePath } from '../i18n/lang';
import { link } from '../../../shared/link';
import { dayFromDate } from '../lib/dates';
import { formatDayShort, formatGuests, formatNights } from '../lib/format';
import { emptySelection, nightsOf, reconcileSelection, selectDay } from '../lib/range';
import type { RangeContext, Selection } from '../lib/range';
import { buildBookingQuery } from '../lib/urlState';
import { Calendar } from './Calendar';
import { KeyBoard } from './KeyBoard';
import { Stepper } from './Stepper';

interface Props {
  lang: Lang;
}

export const HomeBooking = ({ lang }: Props) => {
  const text = pickerText[lang];
  const today = useMemo(() => dayFromDate(new Date()), []);
  const [guests, setGuests] = useState(2);
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const context: RangeContext = { today, guests, packageMode: false };

  const changeGuests = (next: number): void => {
    setGuests(next);
    setSelection(current =>
      reconcileSelection(current, { today, guests: next, packageMode: false }),
    );
  };

  const complete = selection.arrival !== null && selection.departure !== null;
  const nights = nightsOf(selection);
  const stay =
    selection.arrival !== null && selection.departure !== null
      ? { arrival: selection.arrival, nights }
      : { arrival: selection.arrival ?? today, nights: 1 };

  let statusLine = text.pickArrival;
  if (selection.arrival !== null && selection.departure === null) statusLine = text.pickDeparture;
  if (selection.arrival !== null && selection.departure !== null) {
    statusLine = text.stayLine(
      formatDayShort(selection.arrival, lang),
      formatDayShort(selection.departure, lang),
      formatNights(nights, lang),
      formatGuests(guests, lang),
    );
  }

  const bookingHref =
    link(pagePath('booking', lang)) +
    buildBookingQuery({ arrival: selection.arrival, departure: selection.departure, guests });

  return (
    <div class="console">
      <section class="card picker" aria-labelledby="picker-title">
        <h2 id="picker-title">{text.datesHeading}</h2>
        <div class="picker-guests">
          <span id="guests-label">{text.guestsLabel}</span>
          <Stepper
            labelledBy="guests-label"
            value={guests}
            min={1}
            max={maxCapacity}
            lessLabel={text.guestsLess}
            moreLabel={text.guestsMore}
            onChange={changeGuests}
          />
        </div>
        <Calendar
          lang={lang}
          text={text}
          context={context}
          selection={selection}
          idPrefix="home"
          onSelect={day => setSelection(current => selectDay(current, day, context))}
        />
        <p class="picker-status" role="status">
          {statusLine}
        </p>
        <div class="btn-row">
          {complete ? (
            <a class="btn" href={bookingHref}>
              {text.cta}
            </a>
          ) : (
            <button class="btn" type="button" aria-disabled="true" aria-describedby="picker-note">
              {text.ctaIdle}
            </button>
          )}
          {selection.arrival !== null ? (
            <button class="text-button" type="button" onClick={() => setSelection(emptySelection)}>
              {text.clear}
            </button>
          ) : null}
        </div>
        {complete ? null : (
          <p class="picker-note" id="picker-note">
            {text.ctaIdleNote}
          </p>
        )}
      </section>
      <KeyBoard
        text={text}
        stay={stay}
        guests={guests}
        title={text.board.heading}
        caption={complete ? text.board.yourStay : text.board.tonight}
        headingLevel={2}
      />
    </div>
  );
};
