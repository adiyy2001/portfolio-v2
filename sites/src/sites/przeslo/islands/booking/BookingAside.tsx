import { roomText } from '../../content/rooms';
import { quoteOf, staysOf } from '../../lib/flow';
import {
  formatDayShort,
  formatExtraLine,
  formatGuests,
  formatNights,
  formatPln,
} from '../../lib/format';
import type { StepProps } from './types';

type Props = Pick<StepProps, 'lang' | 'text' | 'state'>;

export const BookingAside = ({ lang, text, state }: Props) => {
  const copy = text.aside;
  const stay = staysOf(state);
  const quote = quoteOf(state);
  return (
    <div class="flow-aside" role="group" aria-labelledby="aside-title">
      <h2 id="aside-title">{copy.heading}</h2>
      {stay ? (
        <dl class="aside-list">
          <div>
            <dt>{copy.dates}</dt>
            <dd>
              {formatDayShort(stay.arrival, lang)} -{' '}
              {formatDayShort(stay.arrival + stay.nights, lang)}
              <span class="aside-sub">{formatNights(stay.nights, lang)}</span>
            </dd>
          </div>
          <div>
            <dt>{copy.guests}</dt>
            <dd>{formatGuests(state.guests, lang)}</dd>
          </div>
          <div>
            <dt>{copy.room}</dt>
            <dd>
              {state.roomType === null ? (
                copy.noRoom
              ) : (
                <>
                  {roomText[lang][state.roomType].name}
                  <span class="aside-sub">{text.room.rates[state.rate].name}</span>
                </>
              )}
            </dd>
          </div>
          {quote && quote.extras.length > 0 ? (
            <div>
              <dt>{copy.extras}</dt>
              <dd>
                {quote?.extras.map(line => (
                  <span class="aside-extra" key={line.id}>
                    {formatExtraLine(
                      text.extras.items[line.id].name,
                      line.count,
                      line.multiplier,
                      line.id === 'breakfast',
                      text.countUnits,
                      lang,
                    )}
                    {line.inPackage ? ` (${copy.includedInPackage})` : ''}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p>{copy.empty}</p>
      )}
      {quote ? (
        <p class="aside-total">
          <span>{copy.total}</span>
          <span class="num">{formatPln(quote.total, lang)}</span>
        </p>
      ) : null}
    </div>
  );
};
