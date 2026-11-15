import type { ComponentChildren } from 'preact';

interface Props {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  multiline?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
  name?: string;
  required?: boolean;
  extra?: ComponentChildren;
  onInput: (value: string) => void;
}

export const Field = ({
  id,
  label,
  value,
  error,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  multiline = false,
  maxLength,
  min,
  max,
  name,
  required = true,
  extra,
  onInput,
}: Props) => {
  const noteId = `${id}-note`;
  const shared = {
    id,
    name,
    value,
    maxLength,
    required,
    autoComplete,
    'aria-invalid': error ? ('true' as const) : ('false' as const),
    'aria-describedby': noteId,
  };
  return (
    <div class="field">
      <label class="caps" for={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          class="area"
          rows={5}
          onInput={event => onInput(event.currentTarget.value)}
        />
      ) : (
        <input
          {...shared}
          class={type === 'date' ? 'date' : 'date txt'}
          type={type}
          inputMode={inputMode}
          min={min}
          max={max}
          onInput={event => onInput(event.currentTarget.value)}
        />
      )}
      <span id={noteId} class="date-note field-note">
        {error ?? hint ?? ''}
      </span>
      {extra}
    </div>
  );
};
