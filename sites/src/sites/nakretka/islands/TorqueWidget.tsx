import { useRef, useState } from 'preact/hooks';
import { fasteners, torqueRange } from '../data/site';
import { describeTorque, hitFor } from '../lib/torque';

export default function TorqueWidget() {
  const [value, setValue] = useState<number>(torqueRange.start);
  const slider = useRef<HTMLInputElement>(null);
  const verdict = describeTorque(value);
  const hit = hitFor(value);

  const pick = (nm: number): void => {
    setValue(nm);
    slider.current?.focus();
  };

  return (
    <div class="klucz-live">
      <div class="kl-label">
        <label class="kl-title s" for="nm">
          Moment dokręcenia
        </label>
        <span class="kl-read" aria-hidden="true">
          {value}
        </span>
        <span class="kl-unit" aria-hidden="true">
          Nm
        </span>
      </div>
      <div class="ruler">
        <input
          ref={slider}
          id="nm"
          type="range"
          min={torqueRange.min}
          max={torqueRange.max}
          step={1}
          value={value}
          aria-valuetext={verdict.spoken}
          onInput={event => setValue(Number(event.currentTarget.value))}
        />
      </div>
      <div class="ruler-scale s" aria-hidden="true">
        <span>{torqueRange.min}</span>
        <span>{torqueRange.start}</span>
        <span>{torqueRange.max}</span>
      </div>
      <ul class="fasteners s">
        {fasteners.map(item => (
          <li>
            <button
              type="button"
              class="fast"
              aria-pressed={hit?.nm === item.nm ? 'true' : 'false'}
              onClick={() => pick(item.nm)}>
              <span>{item.label}</span> <strong>{item.nm} Nm</strong>
            </button>
          </li>
        ))}
      </ul>
      <p class={hit ? 'kl-caption s ok' : 'kl-caption s'}>
        <strong>{verdict.verdict}</strong> {verdict.detail}
      </p>
    </div>
  );
}
