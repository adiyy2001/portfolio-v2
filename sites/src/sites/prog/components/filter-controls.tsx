import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { groupThousands } from '../lib/format';

interface GroupProps {
  legend: string;
  children: ComponentChildren;
  class?: string;
}

export const FilterGroup = ({ legend, children, class: className }: GroupProps) => (
  <fieldset class={className ? `filter-group ${className}` : 'filter-group'}>
    <legend class="field-label">{legend}</legend>
    {children}
  </fieldset>
);

interface DisclosureProps {
  legend: string;
  selected: number;
  children: ComponentChildren;
}

export const FilterDisclosure = ({ legend, selected, children }: DisclosureProps) => (
  <details class="filter-group filter-disclosure">
    <summary>
      <span class="field-label">{legend}</span>
      {selected > 0 && <span class="disclosure-count">{selected} wybrane</span>}
    </summary>
    <fieldset class="disclosure-body">
      <legend class="visually-hidden">{legend}</legend>
      {children}
    </fieldset>
  </details>
);

interface CheckProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
  disabled?: boolean;
  radio?: boolean;
  value?: string;
}

export const CheckOption = ({
  name,
  label,
  checked,
  onChange,
  count,
  disabled = false,
  radio = false,
  value,
}: CheckProps) => (
  <label class="check">
    <input
      type={radio ? 'radio' : 'checkbox'}
      name={name}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={event => onChange(event.currentTarget.checked)}
    />
    <span class="box" aria-hidden="true"></span>
    <span class="check-text">{label}</span>
    {count !== undefined && <span class="check-count">{count}</span>}
  </label>
);

interface ChoiceProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  radio?: boolean;
}

export const Choice = ({ name, label, checked, onChange, radio = false }: ChoiceProps) => (
  <label class="choice">
    <input
      type={radio ? 'radio' : 'checkbox'}
      name={name}
      checked={checked}
      onChange={event => onChange(event.currentTarget.checked)}
    />
    <span>{label}</span>
  </label>
);

interface AmountProps {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (input: HTMLInputElement) => void;
}

export const AmountField = ({
  id,
  label,
  value,
  unit,
  placeholder,
  disabled = false,
  onChange,
}: AmountProps) => {
  const [editing, setEditing] = useState(false);
  const shown = value === null ? '' : editing ? String(value) : groupThousands(value);
  return (
    <div class="field">
      <label for={id}>{label}</label>
      <div class="input-affix">
        <input
          class="input"
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={shown}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onInput={event => onChange(event.currentTarget)}
        />
        <span class="affix" aria-hidden="true">
          {unit}
        </span>
      </div>
    </div>
  );
};
