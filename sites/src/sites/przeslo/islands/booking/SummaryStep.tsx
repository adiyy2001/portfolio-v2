import { roomText } from '../../content/rooms';
import { roomTypeById } from '../../data/rooms';
import { quoteOf, staysOf } from '../../lib/flow';
import { formatDate, formatDayShort, formatGuests, formatNights } from '../../lib/format';
import { formatNip } from '../../lib/nip';
import { freeCancellationDaysBefore } from '../../lib/policy';
import { PriceBreakdown } from '../PriceBreakdown';
import type { StepId } from '../../lib/flow';
import type { StepProps } from './types';

interface Props extends StepProps {
  goTo: (step: StepId) => void;
}

export const SummaryStep = ({ lang, text, state, goTo }: Props) => {
  const stay = staysOf(state);
  const quote = quoteOf(state);
  if (!stay || !quote || state.roomType === null) return null;
  const copy = text.summary;
  const type = roomTypeById(state.roomType);
  const room = roomText[lang][state.roomType];
  const departure = stay.arrival + stay.nights;
  const rows: { label: string; value: string; step: StepId }[] = [
    {
      label: copy.stay,
      value: copy.stayLine(
        formatDayShort(stay.arrival, lang),
        formatDayShort(departure, lang),
        formatNights(stay.nights, lang),
      ),
      step: 'dates',
    },
    { label: copy.guests, value: formatGuests(state.guests, lang), step: 'dates' },
    { label: copy.room, value: copy.roomLine(room.name, type.size), step: 'room' },
    { label: copy.rate, value: text.room.rates[state.rate].name, step: 'room' },
  ];
  return (
    <div class="step-body">
      <p class="step-lead">{copy.lead}</p>
      <dl class="summary-list">
        {rows.map(row => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
            <dd>
              <button type="button" class="text-button" onClick={() => goTo(row.step)}>
                {copy.edit}
                <span class="visually-hidden"> {row.label}</span>
              </button>
            </dd>
          </div>
        ))}
        <div>
          <dt>{copy.guestHeading}</dt>
          <dd>
            {state.guest.name}, {state.guest.email}, {state.guest.phone}
          </dd>
          <dd>
            <button type="button" class="text-button" onClick={() => goTo('guest')}>
              {copy.edit}
              <span class="visually-hidden"> {copy.guestHeading}</span>
            </button>
          </dd>
        </div>
        {state.wantsInvoice ? (
          <div>
            <dt>{copy.invoiceHeading}</dt>
            <dd>
              {state.invoice.company}, NIP {formatNip(state.invoice.nip)}, {state.invoice.street},{' '}
              {state.invoice.postalCode} {state.invoice.city}
            </dd>
            <dd>
              <button type="button" class="text-button" onClick={() => goTo('guest')}>
                {copy.edit}
                <span class="visually-hidden"> {copy.invoiceHeading}</span>
              </button>
            </dd>
          </div>
        ) : null}
      </dl>
      <h3 class="step-subheading">{copy.priceHeading}</h3>
      <PriceBreakdown quote={quote} lang={lang} text={text} />
      <p class="step-note">{copy.vatNote}</p>
      <p class="notice">
        {text.room.rates[state.rate].text(
          `${formatDate(stay.arrival - freeCancellationDaysBefore, lang)}, 15:00`,
        )}{' '}
        {copy.payment[state.rate]}
      </p>
      <p class="step-note">{copy.withdrawal}</p>
    </div>
  );
};
