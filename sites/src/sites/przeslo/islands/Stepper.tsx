interface Props {
  labelledBy?: string;
  groupLabel?: string;
  value: number;
  min: number;
  max: number;
  lessLabel: string;
  moreLabel: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export const Stepper = ({
  labelledBy,
  groupLabel,
  value,
  min,
  max,
  lessLabel,
  moreLabel,
  disabled = false,
  onChange,
}: Props) => (
  <div class="stepper" role="group" aria-labelledby={labelledBy} aria-label={groupLabel}>
    <button
      type="button"
      aria-label={lessLabel}
      aria-disabled={disabled || value <= min ? 'true' : undefined}
      onClick={() => !disabled && value > min && onChange(value - 1)}>
      <span aria-hidden="true">&minus;</span>
    </button>
    <output aria-live="polite">{value}</output>
    <button
      type="button"
      aria-label={moreLabel}
      aria-disabled={disabled || value >= max ? 'true' : undefined}
      onClick={() => !disabled && value < max && onChange(value + 1)}>
      <span aria-hidden="true">+</span>
    </button>
  </div>
);
