interface Props {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  downLabel: string;
  upLabel: string;
  onChange: (value: number) => void;
}

export const Stepper = ({ id, label, value, min, max, downLabel, upLabel, onChange }: Props) => {
  const labelId = `${id}-legend`;
  return (
    <div>
      <span class="caps" id={labelId}>
        {label}
      </span>
      <div class="stepper" role="group" aria-labelledby={labelId}>
        <button
          type="button"
          aria-label={downLabel}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10" stroke="currentColor" stroke-width="2.2" fill="none" />
          </svg>
        </button>
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={1}
          value={value}
          inputMode="numeric"
          aria-labelledby={labelId}
          onInput={event => {
            const parsed = parseInt(event.currentTarget.value, 10);
            if (!Number.isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
          }}
        />
        <button
          type="button"
          aria-label={upLabel}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M8 3v10" stroke="currentColor" stroke-width="2.2" fill="none" />
          </svg>
        </button>
      </div>
    </div>
  );
};
