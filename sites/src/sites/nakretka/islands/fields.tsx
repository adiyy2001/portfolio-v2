import type { ComponentChildren } from 'preact';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ComponentChildren;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div class={error ? 'field has-error' : 'field'}>
      <label for={id}>{label}</label>
      {children}
      {hint && !error && (
        <span class="field-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span class="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

export const describedBy = (id: string, error?: string, hint?: string): string | undefined => {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
};
