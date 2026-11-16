import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface ShellProps {
  id: string;
  label: string;
  error?: string;
  wide?: boolean;
  children: (describedBy: string | undefined) => ComponentChildren;
}

const FieldShell = ({ id, label, error, wide, children }: ShellProps) => (
  <div class={wide ? 'field wide' : 'field'}>
    <label for={id}>{label}</label>
    {children(error ? `${id}-error` : undefined)}
    {error && (
      <span class="field-error" id={`${id}-error`}>
        {error}
      </span>
    )}
  </div>
);

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
  autocomplete?: string;
  inputMode?: 'text' | 'tel' | 'email';
}

export const TextField = ({
  id,
  label,
  value,
  onInput,
  error,
  autocomplete,
  inputMode,
}: TextFieldProps) => (
  <FieldShell id={id} label={label} error={error}>
    {describedBy => (
      <input
        id={id}
        type="text"
        value={value}
        autocomplete={autocomplete}
        inputMode={inputMode}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onInput={event => onInput(event.currentTarget.value)}
      />
    )}
  </FieldShell>
);

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
}

export const TextAreaField = ({ id, label, value, onInput, error }: TextAreaProps) => (
  <FieldShell id={id} label={label} error={error} wide>
    {describedBy => (
      <textarea
        id={id}
        rows={4}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onInput={event => onInput(event.currentTarget.value)}
      />
    )}
  </FieldShell>
);

interface SelectProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
  error?: string;
}

export const SelectField = ({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
}: SelectProps) => (
  <FieldShell id={id} label={label} error={error} wide>
    {describedBy => (
      <select
        id={id}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onChange={event => onChange(event.currentTarget.value)}>
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </FieldShell>
);

interface ErrorSummaryProps {
  items: Array<{ id: string; message: string }>;
  focusSignal: number;
}

export const ErrorSummary = ({ items, focusSignal }: ErrorSummaryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusSignal > 0 && items.length > 0) ref.current?.focus();
  }, [focusSignal]);
  if (items.length === 0) return null;
  return (
    <div class="err-summary" ref={ref} tabIndex={-1} role="alert">
      <h2>
        {items.length === 1 ? 'Jedno pole wymaga poprawy' : `Pola do poprawy: ${items.length}`}
      </h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={event => {
                event.preventDefault();
                document.getElementById(item.id)?.focus();
              }}>
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface DoneProps {
  children: ComponentChildren;
}

export const DonePanel = ({ children }: DoneProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div class="form-done" ref={ref} tabIndex={-1} role="status">
      {children}
    </div>
  );
};
