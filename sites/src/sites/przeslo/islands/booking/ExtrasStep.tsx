import { extraDefinitions } from '../../data/extras';
import type { ExtraId } from '../../data/extras';
import { packageActive, packageIncludes } from '../../lib/flow';
import { formatPln } from '../../lib/format';
import { Stepper } from '../Stepper';
import type { StepProps } from './types';

export const ExtrasStep = ({ lang, text, state, update }: StepProps) => {
  const inPackage = packageActive(state);
  const setCount = (id: ExtraId, count: number): void =>
    update(current => ({ ...current, extras: { ...current.extras, [id]: count } }));
  return (
    <div class="step-body">
      <p class="step-lead">{text.extras.lead}</p>
      {inPackage ? <p class="notice">{text.extras.packageNote}</p> : null}
      <ul class="extras">
        {extraDefinitions.map(definition => {
          const copy = text.extras.items[definition.id];
          const max = definition.maxCount(state.guests);
          const included = inPackage && packageIncludes.includes(definition.id);
          const count = included
            ? definition.id === 'breakfast'
              ? state.guests
              : 1
            : (state.extras[definition.id] ?? 0);
          const nameId = `extra-${definition.id}`;
          return (
            <li class="extra" key={definition.id} data-included={included ? 'true' : undefined}>
              <div class="extra-text">
                <p class="extra-name" id={nameId}>
                  {copy.name}{' '}
                  {included ? <span class="extra-badge">{text.extras.included}</span> : null}
                </p>
                <p class="extra-help">{copy.help}</p>
              </div>
              <p class="extra-price">
                <span class="num">
                  {definition.price === 0 ? text.extras.free : formatPln(definition.price, lang)}
                </span>
                {definition.price === 0 ? null : <span>{copy.unit}</span>}
              </p>
              <div class="extra-control">
                {max === 1 ? (
                  <label class="check">
                    <input
                      type="checkbox"
                      checked={count === 1}
                      disabled={included}
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
                    disabled={included}
                    lessLabel={text.extras.less(copy.name)}
                    moreLabel={text.extras.more(copy.name)}
                    onChange={value => setCount(definition.id, value)}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
