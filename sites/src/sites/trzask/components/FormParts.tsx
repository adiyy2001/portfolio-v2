import type { ComponentChildren, JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface ShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (describedBy: string | undefined) => ComponentChildren;
}

const FieldShell = ({ id, label, hint, error, children }: ShellProps) => {
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div class="field">
      <label for={id}>{label}</label>
      {children(describedBy || undefined)}
      {hint && (
        <span class="field__hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span class="field__error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
};

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel';
  autocomplete?: string;
  inputMode?: JSX.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
}

export const TextField = ({
  id,
  label,
  value,
  onInput,
  error,
  hint,
  type = 'text',
  autocomplete,
  inputMode,
  maxLength,
}: TextFieldProps) => (
  <FieldShell id={id} label={label} hint={hint} error={error}>
    {describedBy => (
      <input
        id={id}
        class="input"
        type={type}
        value={value}
        autocomplete={autocomplete}
        inputMode={inputMode}
        maxLength={maxLength}
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
  hint?: string;
}

export const TextAreaField = ({ id, label, value, onInput, error, hint }: TextAreaProps) => (
  <FieldShell id={id} label={label} hint={hint} error={error}>
    {describedBy => (
      <textarea
        id={id}
        class="textarea"
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
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const SelectField = ({ id, label, value, onChange, options }: SelectProps) => (
  <FieldShell id={id} label={label}>
    {() => (
      <select
        id={id}
        class="select"
        value={value}
        onChange={event => onChange(event.currentTarget.value)}>
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

export const SuccessNotice = ({ children }: { children: ComponentChildren }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div class="notice" ref={ref} tabIndex={-1} role="status">
      {children}
    </div>
  );
};
