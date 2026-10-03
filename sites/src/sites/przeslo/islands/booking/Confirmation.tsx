import { roomText } from '../../content/rooms';
import { roomTypeById } from '../../data/rooms';
import type { StoredBooking } from '../../lib/booking';
import { quoteBooking, stayOf } from '../../lib/booking';
import { formatDayLong, formatGuests, formatNights } from '../../lib/format';
import { link } from '../../../../shared/link';
import { pagePath } from '../../i18n/lang';
import { downloadIcs } from '../downloadIcs';
import { KeyBoard } from '../KeyBoard';
import { PriceBreakdown } from '../PriceBreakdown';
import type { StepProps } from './types';

interface Props extends Pick<StepProps, 'lang' | 'text' | 'picker'> {
  booking: StoredBooking;
  stored: boolean;
  headingRef: { current: HTMLHeadingElement | null };
}

export const Confirmation = ({ lang, text, picker, booking, stored, headingRef }: Props) => {
  const copy = text.done;
  const stay = stayOf(booking);
  const room = roomText[lang][booking.roomType];
  const type = roomTypeById(booking.roomType);
  const quote = quoteBooking(booking);
  return (
    <div class="confirmation">
      <h2 tabIndex={-1} ref={headingRef}>
        {copy.heading}
      </h2>
      <p class="step-lead">{copy.lead}</p>
      <p class="notice notice--strong" role="status">
        {copy.nothing}
      </p>
      <div class="code-tag">
        <p class="code-label">{copy.code}</p>
        <p class="code-value">{booking.code}</p>
        <p class="code-hint">{copy.codeHint}</p>
      </div>
      <h3 class="step-subheading">{copy.keyHeading}</h3>
      <p class="step-lead">{copy.keyLead(booking.roomNumber, room.name)}</p>
      <KeyBoard
        text={picker}
        stay={{ arrival: stay.arrival, nights: stay.nights }}
        guests={booking.guests}
        title={picker.board.heading}
        caption={copy.boardCaption}
        highlight={booking.roomType}
        assigned={booking.roomNumber}
      />
      <h3 class="step-subheading">{copy.detailsHeading}</h3>
      <p>
        {formatDayLong(stay.arrival, lang)} - {formatDayLong(stay.departure, lang)},{' '}
        {formatNights(stay.nights, lang)}, {formatGuests(booking.guests, lang)}. {room.name},{' '}
        {type.size} m². {copy.arrivalNote}
      </p>
      <PriceBreakdown quote={quote} lang={lang} text={text} />
      <div class="btn-row confirmation-actions">
        <button class="btn" type="button" onClick={() => downloadIcs(booking)}>
          {copy.calendar}
        </button>
        <a class="btn btn--ghost" href={link(pagePath('myBooking', lang))}>
          {copy.myBooking}
        </a>
      </div>
      <p class="step-note">{copy.calendarHint}</p>
      <p class="step-note">{stored ? copy.stored : copy.notStored}</p>
      <p>
        <a class="text-link" href={link(pagePath('booking', lang))}>
          {copy.again}
        </a>
      </p>
    </div>
  );
};
