import type { ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { districts } from '../data/districts';
import { conditionLabel } from '../data/labels';
import type { Condition } from '../data/types';
import { estimateValue } from '../lib/estimate';
import { formatPrice, groupThousands } from '../lib/format';
import type { ErrorMap } from '../lib/validation';
import {
  emptyValuation,
  firstInvalidField,
  stepFields,
  toEstimateInput,
  validateStep,
  type Timing,
  type ValuationField,
  type ValuationValues,
} from '../lib/valuation-form';
import { Icon } from './Icon';

const stepNames = ['Nieruchomość', 'Termin', 'Kontakt'] as const;

const conditions: readonly Condition[] = ['do-remontu', 'dobry', 'po-remoncie', 'nowy'];

const timings: readonly { value: Timing; label: string; hint: string }[] = [
  {
    value: 'teraz',
    label: 'Chcę sprzedać jak najszybciej',
    hint: 'Zaczynamy od oględzin w tym tygodniu.',
  },
  {
    value: 'trzy-miesiace',
    label: 'W ciągu trzech miesięcy',
    hint: 'Zdążymy przygotować rysunek, rzut i opis.',
  },
  {
    value: 'rozgladam-sie',
    label: 'Na razie sprawdzam, ile to warte',
    hint: 'Nic nie musisz decydować.',
  },
];

const sortedDistricts = [...districts].sort((a, b) => a.name.localeCompare(b.name, 'pl'));

const fieldId = (field: ValuationField): string => `valuation-${field}`;

interface FieldProps {
  field: ValuationField;
  label: string;
  value: string;
  onInput: (value: string) => void;
  error?: string;
  hint?: string;
  type?: 'text' | 'tel' | 'email';
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email';
  autoComplete?: string;
  unit?: string;
}

const TextField = ({
  field,
  label,
  value,
  onInput,
  error,
  hint,
  type = 'text',
  inputMode,
  autoComplete,
  unit,
}: FieldProps) => {
  const id = fieldId(field);
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : '']
    .filter(Boolean)
    .join(' ');
  const input = (
    <input
      id={id}
      class="input"
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      value={value}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy || undefined}
      onInput={event => onInput(event.currentTarget.value)}
    />
  );
  return (
    <div class="field">
      <label for={id}>{label}</label>
      {unit ? (
        <div class="input-affix">
          {input}
          <span class="affix" aria-hidden="true">
            {unit}
          </span>
        </div>
      ) : (
        input
      )}
      {hint && (
        <p class="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`} text={error} />}
    </div>
  );
};

const FieldError = ({ id, text }: { id: string; text: string }) => (
  <p class="field-error" id={id}>
    <Icon name="alert" size={16} />
    <span>{text}</span>
  </p>
);

interface GroupProps {
  legend: string;
  error?: string;
  errorId: string;
  children: ComponentChildren;
}

const Group = ({ legend, error, errorId, children }: GroupProps) => (
  <fieldset class="field" aria-describedby={error ? errorId : undefined}>
    <legend class="field-label">{legend}</legend>
    {children}
    {error && <FieldError id={errorId} text={error} />}
  </fieldset>
);

const conditionText = (condition: Condition | ''): string =>
  condition === '' ? '' : conditionLabel[condition];

export const ValuationForm = () => {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ValuationValues>(emptyValuation);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<ErrorMap<ValuationField>>({});
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof ValuationValues>(key: K, value: ValuationValues[K]) =>
    setValues(current => ({ ...current, [key]: value }));

  const isHouse = values.type === 'dom';
  const estimateInput = useMemo(() => (done ? toEstimateInput(values) : null), [done, values]);
  const estimate = estimateInput ? estimateValue(estimateInput) : null;
  const errorEntries = (stepFields[step] ?? []).flatMap(field => {
    const text = errors[field];
    return text ? [{ field, text }] : [];
  });

  const next = (event: Event) => {
    event.preventDefault();
    const found = validateStep(step, values);
    setErrors(found);
    if (firstInvalidField(found, step)) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (step < stepNames.length - 1) {
      setStep(step + 1);
      return;
    }
    setDone(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const restart = () => {
    setValues(emptyValuation);
    setNote('');
    setErrors({});
    setStep(0);
    setDone(false);
  };

  if (done && estimate && estimateInput) {
    return (
      <div class="success-panel valuation-result" tabIndex={-1} ref={resultRef} role="status">
        <h3>Dziękujemy, {values.name.trim()}.</h3>
        <p class="label">Wstępny przedział ceny</p>
        <p class="estimate-figure">
          {groupThousands(estimate.low)}-{groupThousands(estimate.high)} zł
        </p>
        <p>
          To około {formatPrice(estimate.perSquareMeter)} za metr kwadratowy w dzielnicy{' '}
          {estimateInput.district.name}. Przedział liczymy z cen ofertowych, nie transakcyjnych, i
          nie jest wyceną rzeczoznawcy. Prawdziwą cenę ustalimy po oględzinach, bo zależy od
          instalacji, okien i tego, co wspólnota uchwaliła na najbliższe lata.
        </p>
        <p>
          <strong>To strona przykładowa, więc nic nie zostało wysłane.</strong>
        </p>
        <button type="button" class="btn btn-quiet" onClick={restart}>
          Policz jeszcze raz
        </button>
      </div>
    );
  }

  return (
    <form class="valuation" noValidate onSubmit={next}>
      <div class="steps" aria-label={`Krok ${step + 1} z ${stepNames.length}`} role="group">
        <ol>
          {stepNames.map((name, index) => (
            <li
              key={name}
              class={index === step ? 'is-current' : index < step ? 'is-done' : undefined}
              aria-current={index === step ? 'step' : undefined}>
              <span class="step-bar" aria-hidden="true" />
              <span class="step-name">{name}</span>
            </li>
          ))}
        </ol>
        <p class="step-count">
          Krok {step + 1} z {stepNames.length}
        </p>
      </div>

      {errorEntries.length > 0 && (
        <div class="error-summary" tabIndex={-1} ref={summaryRef} role="alert">
          <h3>Formularz wymaga poprawek</h3>
          <ul>
            {errorEntries.map(entry => (
              <li key={entry.field}>
                <a href={`#${fieldId(entry.field)}`}>{entry.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 0 && (
        <div class="valuation-step">
          <h3 tabIndex={-1} ref={headingRef}>
            Co sprzedajesz
          </h3>
          <Group legend="Rodzaj nieruchomości" errorId="valuation-type-error">
            <div class="choice-row">
              {(['mieszkanie', 'dom'] as const).map(type => (
                <label class="choice" key={type}>
                  <input
                    type="radio"
                    name="valuation-type"
                    checked={values.type === type}
                    onChange={() => set('type', type)}
                  />
                  <span>{type === 'dom' ? 'Dom' : 'Mieszkanie'}</span>
                </label>
              ))}
            </div>
          </Group>
          <div class="field">
            <label for={fieldId('district')}>Dzielnica</label>
            <select
              id={fieldId('district')}
              class="select"
              value={values.district}
              aria-invalid={errors.district ? 'true' : undefined}
              aria-describedby={errors.district ? 'valuation-district-error' : undefined}
              onChange={event =>
                set('district', event.currentTarget.value as ValuationValues['district'])
              }>
              <option value="">Wybierz z listy</option>
              {sortedDistricts.map(district => (
                <option value={district.id} key={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.district && <FieldError id="valuation-district-error" text={errors.district} />}
          </div>
          <TextField
            field="area"
            label="Powierzchnia użytkowa"
            value={values.area}
            unit="m²"
            inputMode="decimal"
            autoComplete="off"
            error={errors.area}
            onInput={value => set('area', value)}
          />
          {!isHouse && (
            <div class="valuation-pair">
              <TextField
                field="floor"
                label="Piętro"
                value={values.floor}
                inputMode="numeric"
                autoComplete="off"
                hint="Parter to 0."
                error={errors.floor}
                onInput={value => set('floor', value)}
              />
              <TextField
                field="floorsTotal"
                label="Pięter w budynku"
                value={values.floorsTotal}
                inputMode="numeric"
                autoComplete="off"
                error={errors.floorsTotal}
                onInput={value => set('floorsTotal', value)}
              />
            </div>
          )}
          <Group legend="Stan" error={errors.condition} errorId="valuation-condition-error">
            <div class="choice-row" id={fieldId('condition')} tabIndex={-1}>
              {conditions.map(condition => (
                <label class="choice" key={condition}>
                  <input
                    type="radio"
                    name="valuation-condition"
                    checked={values.condition === condition}
                    onChange={() => set('condition', condition)}
                  />
                  <span>{conditionText(condition)}</span>
                </label>
              ))}
            </div>
          </Group>
          <fieldset class="field">
            <legend class="field-label">Dodatkowo</legend>
            {!isHouse && (
              <label class="check">
                <input
                  type="checkbox"
                  checked={values.elevator}
                  onChange={event => set('elevator', event.currentTarget.checked)}
                />
                <span class="box" aria-hidden="true" />
                <span class="check-text">Budynek ma windę</span>
              </label>
            )}
            <label class="check">
              <input
                type="checkbox"
                checked={values.outdoor}
                onChange={event => set('outdoor', event.currentTarget.checked)}
              />
              <span class="box" aria-hidden="true" />
              <span class="check-text">Balkon, taras lub ogród</span>
            </label>
          </fieldset>
        </div>
      )}

      {step === 1 && (
        <div class="valuation-step">
          <h3 tabIndex={-1} ref={headingRef}>
            Kiedy chcesz sprzedawać
          </h3>
          <Group legend="Termin" error={errors.timing} errorId="valuation-timing-error">
            <div class="option-list" id={fieldId('timing')} tabIndex={-1}>
              {timings.map(timing => (
                <label class="option" key={timing.value}>
                  <input
                    type="radio"
                    name="valuation-timing"
                    checked={values.timing === timing.value}
                    onChange={() => set('timing', timing.value)}
                  />
                  <span class="option-card">
                    <strong>{timing.label}</strong>
                    <span>{timing.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Group>
          <div class="field">
            <label for="valuation-note">Co jeszcze warto wiedzieć (opcjonalnie)</label>
            <textarea
              id="valuation-note"
              class="textarea"
              value={note}
              onInput={event => setNote(event.currentTarget.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div class="valuation-step">
          <h3 tabIndex={-1} ref={headingRef}>
            Jak się z tobą skontaktować
          </h3>
          <TextField
            field="name"
            label="Imię i nazwisko"
            value={values.name}
            autoComplete="name"
            error={errors.name}
            onInput={value => set('name', value)}
          />
          <TextField
            field="phone"
            label="Telefon"
            value={values.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            error={errors.phone}
            onInput={value => set('phone', value)}
          />
          <TextField
            field="email"
            label="E-mail (opcjonalnie)"
            value={values.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            error={errors.email}
            onInput={value => set('email', value)}
          />
          <div class="field">
            <label class="check">
              <input
                id={fieldId('consent')}
                type="checkbox"
                checked={values.consent}
                aria-invalid={errors.consent ? 'true' : undefined}
                aria-describedby={errors.consent ? 'valuation-consent-error' : undefined}
                onChange={event => set('consent', event.currentTarget.checked)}
              />
              <span class="box" aria-hidden="true" />
              <span class="check-text">
                Zgadzam się, żeby biuro Próg skontaktowało się ze mną w sprawie wyceny.
              </span>
            </label>
            {errors.consent && <FieldError id="valuation-consent-error" text={errors.consent} />}
          </div>
        </div>
      )}

      <div class="valuation-actions">
        {step > 0 && (
          <button type="button" class="btn" onClick={() => setStep(step - 1)}>
            Wstecz
          </button>
        )}
        <button type="submit" class="btn btn-primary">
          {step === stepNames.length - 1 ? 'Pokaż przedział ceny' : 'Dalej'}
          <Icon name="arrow" size={18} />
        </button>
      </div>
      <p class="field-hint">
        Formularz nie ma zaplecza: po ostatnim kroku zobaczysz przedział ceny i potwierdzenie, bez
        wysyłki.
      </p>
    </form>
  );
};

export default ValuationForm;
