import { roomText } from '../../content/rooms';
import { formatDate, formatPln } from '../../lib/format';
import { roomOptions, staysOf } from '../../lib/flow';
import { freeCancellationDaysBefore } from '../../lib/policy';
import type { RateId } from '../../lib/pricing';
import { KeyBoard } from '../KeyBoard';
import type { StepProps } from './types';

const rateIds: RateId[] = ['flexible', 'nonRefundable'];

export const RoomStep = ({ lang, text, picker, state, update }: StepProps) => {
  const stay = staysOf(state);
  if (!stay) return null;
  const options = roomOptions(state);
  const deadline = `${formatDate(stay.arrival - freeCancellationDaysBefore, lang)}, 15:00`;
  const totalOf = (flexible: number | null, nonRefundable: number | null): number | null =>
    state.rate === 'flexible' ? flexible : nonRefundable;
  const chosen = options.find(option => option.type.id === state.roomType);
  const saving =
    chosen && chosen.flexibleTotal !== null && chosen.nonRefundableTotal !== null
      ? chosen.flexibleTotal - chosen.nonRefundableTotal
      : null;
  return (
    <div class="step-body">
      <p class="step-lead">{text.room.lead}</p>
      <KeyBoard
        text={picker}
        stay={stay}
        guests={state.guests}
        title={picker.board.heading}
        caption={picker.board.yourStay}
        highlight={state.roomType}
      />
      <fieldset class="choice-group">
        <legend>{text.room.roomLegend}</legend>
        <ul class="room-options">
          {options.map(option => {
            const copy = roomText[lang][option.type.id];
            const total = totalOf(option.flexibleTotal, option.nonRefundableTotal);
            let availability = text.room.freeOf(option.free, option.total);
            if (!option.fits) availability = text.room.tooSmall(state.guests);
            else if (option.free === 0) availability = text.room.soldOut;
            return (
              <li key={option.type.id}>
                <label class="room-option" data-disabled={option.bookable ? undefined : 'true'}>
                  <input
                    type="radio"
                    name="room"
                    value={option.type.id}
                    checked={state.roomType === option.type.id}
                    disabled={!option.bookable}
                    onChange={() => update(current => ({ ...current, roomType: option.type.id }))}
                  />
                  <span class="room-option-main">
                    <span class="room-option-name">{copy.name}</span>
                    <span class="room-option-meta">
                      {option.type.size} m², {copy.bed},{' '}
                      {text.room.guestsUpTo(option.type.capacity)}
                    </span>
                    <span class="room-option-free">{availability}</span>
                  </span>
                  <span class="room-option-price">
                    {total === null ? null : (
                      <>
                        <span class="num">{formatPln(total, lang)}</span>
                        <span class="room-option-unit">{text.room.forStay}</span>
                      </>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <fieldset class="choice-group">
        <legend>{text.room.rateLegend}</legend>
        <ul class="rate-options">
          {rateIds.map(rate => (
            <li key={rate}>
              <label class="room-option">
                <input
                  type="radio"
                  name="rate"
                  value={rate}
                  checked={state.rate === rate}
                  onChange={() => update(current => ({ ...current, rate }))}
                />
                <span class="room-option-main">
                  <span class="room-option-name">{text.room.rates[rate].name}</span>
                  <span class="room-option-meta">{text.room.rates[rate].text(deadline)}</span>
                  {rate === 'nonRefundable' && saving !== null ? (
                    <span class="room-option-free">
                      {text.room.cheaperBy(formatPln(saving, lang))}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
};
