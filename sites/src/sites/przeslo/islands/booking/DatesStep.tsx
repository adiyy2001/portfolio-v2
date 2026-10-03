import { maxCapacity } from '../../data/rooms';
import { formatDayShort, formatGuests, formatNights } from '../../lib/format';
import { reconcileFlow } from '../../lib/flow';
import { nightsOf, selectDay } from '../../lib/range';
import type { RangeContext } from '../../lib/range';
import { Calendar } from '../Calendar';
import { Stepper } from '../Stepper';
import type { StepProps } from './types';

export const DatesStep = ({ lang, today, text, picker, state, update }: StepProps) => {
  const context: RangeContext = { today, guests: state.guests, packageMode: state.packageMode };
  const { selection } = state;
  let status = picker.pickArrival;
  if (selection.arrival !== null && selection.departure === null) status = picker.pickDeparture;
  if (selection.arrival !== null && selection.departure !== null) {
    status = picker.stayLine(
      formatDayShort(selection.arrival, lang),
      formatDayShort(selection.departure, lang),
      formatNights(nightsOf(selection), lang),
      formatGuests(state.guests, lang),
    );
  }
  return (
    <div class="step-body">
      <p class="step-lead">{text.dates.lead}</p>
      <div class="picker-guests">
        <span id="book-guests-label">{picker.guestsLabel}</span>
        <Stepper
          labelledBy="book-guests-label"
          value={state.guests}
          min={1}
          max={maxCapacity}
          lessLabel={picker.guestsLess}
          moreLabel={picker.guestsMore}
          onChange={guests => update(current => reconcileFlow({ ...current, guests }, today))}
        />
      </div>
      <label class="check package-toggle">
        <input
          type="checkbox"
          checked={state.packageMode}
          onChange={event => {
            const packageMode = event.currentTarget.checked;
            update(current => reconcileFlow({ ...current, packageMode }, today));
          }}
        />
        <span>
          <strong>{picker.packageLabel}</strong>
          <span class="hint-line">{picker.packageHint}</span>
        </span>
      </label>
      <Calendar
        lang={lang}
        text={picker}
        context={context}
        selection={selection}
        idPrefix="book"
        onSelect={day =>
          update(current =>
            reconcileFlow(
              {
                ...current,
                selection: selectDay(current.selection, day, {
                  today,
                  guests: current.guests,
                  packageMode: current.packageMode,
                }),
              },
              today,
            ),
          )
        }
      />
      <p class="picker-status" role="status">
        {status}
      </p>
    </div>
  );
};
