import type { ComponentChildren } from 'preact';

interface Props {
  id: string;
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  maxLength?: number;
  multiline?: boolean;
  optionalLabel?: string;
  extra?: ComponentChildren;
}

export const Field = ({
  id,
  label,
  value,
  onInput,
  error,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  multiline = false,
  optionalLabel,
  extra,
}: Props) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ');
  const shared = {
    id,
    name: id,
    value,
    'aria-invalid': error ? ('true' as const) : undefined,
    'aria-describedby': describedBy === '' ? undefined : describedBy,
    autoComplete,
    maxLength,
  };
  return (
    <div class="field">
      <label for={id}>
        {label}
        {optionalLabel ? <span class="optional"> ({optionalLabel})</span> : null}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} onInput={event => onInput(event.currentTarget.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          inputMode={inputMode}
          onInput={event => onInput(event.currentTarget.value)}
        />
      )}
      {hint ? (
        <p class="hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {extra}
      {error ? (
        <p class="field-error" id={errorId}>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
};
