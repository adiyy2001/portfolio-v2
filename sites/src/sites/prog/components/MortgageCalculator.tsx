import { useMemo, useState } from 'preact/hooks';
import { formatPrice, groupThousands } from '../lib/format';
import { parseLoanForm, type LoanField, type LoanFormValues } from '../lib/loan-form';
import { summarizeLoan, type InstalmentKind } from '../lib/mortgage';
import { Icon } from './Icon';

interface Props {
  price: number;
}

interface FieldSpec {
  field: LoanField;
  label: string;
  unit: string;
  hint?: string;
}

const fields: readonly FieldSpec[] = [
  { field: 'price', label: 'Cena nieruchomości', unit: 'zł' },
  {
    field: 'downPayment',
    label: 'Wkład własny',
    unit: '%',
    hint: 'Banki zwykle wymagają od 10 do 20 procent.',
  },
  { field: 'years', label: 'Okres kredytu', unit: 'lat' },
  {
    field: 'rate',
    label: 'Oprocentowanie roczne',
    unit: '%',
    hint: 'Założenie do przykładu, nie oferta banku.',
  },
];

const kinds: readonly { value: InstalmentKind; label: string }[] = [
  { value: 'rowne', label: 'Raty równe' },
  { value: 'malejace', label: 'Raty malejące' },
];

const percent = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

export const MortgageCalculator = ({ price }: Props) => {
  const [values, setValues] = useState<LoanFormValues>({
    price: String(price),
    downPayment: '20',
    years: '25',
    rate: '6',
    kind: 'rowne',
  });
  const { errors, input } = useMemo(() => parseLoanForm(values), [values]);
  const summary = useMemo(() => (input ? summarizeLoan(input) : null), [input]);
  const setField = (field: LoanField, value: string) =>
    setValues(current => ({ ...current, [field]: value }));
  const [editing, setEditing] = useState<LoanField | null>(null);
  const shownValue = (field: LoanField): string => {
    const raw = values[field];
    return field === 'price' && editing !== field && /^\d+$/.test(raw)
      ? groupThousands(Number(raw))
      : raw;
  };
  const errorCount = Object.keys(errors).length;

  return (
    <div class="calculator">
      <form class="calculator-form" noValidate onSubmit={event => event.preventDefault()}>
        <div class="calculator-fields">
          {fields.map(spec => {
            const id = `loan-${spec.field}`;
            const error = errors[spec.field];
            const describedBy = [spec.hint ? `${id}-hint` : '', error ? `${id}-error` : '']
              .filter(Boolean)
              .join(' ');
            return (
              <div class="field" key={spec.field}>
                <label for={id}>{spec.label}</label>
                <div class="input-affix">
                  <input
                    id={id}
                    class="input"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={shownValue(spec.field)}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={describedBy || undefined}
                    onFocus={() => setEditing(spec.field)}
                    onBlur={() => setEditing(null)}
                    onInput={event => setField(spec.field, event.currentTarget.value)}
                  />
                  <span class="affix" aria-hidden="true">
                    {spec.unit}
                  </span>
                </div>
                {spec.hint && (
                  <p class="field-hint" id={`${id}-hint`}>
                    {spec.hint}
                  </p>
                )}
                {error && (
                  <p class="field-error" id={`${id}-error`}>
                    <Icon name="alert" size={16} />
                    <span>{error}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <fieldset class="field">
          <legend class="field-label">Rodzaj rat</legend>
          <div class="choice-row">
            {kinds.map(kind => (
              <label class="choice" key={kind.value}>
                <input
                  type="radio"
                  name="loan-kind"
                  checked={values.kind === kind.value}
                  onChange={() => setValues(current => ({ ...current, kind: kind.value }))}
                />
                <span>{kind.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div class="calculator-result" aria-live="polite" aria-atomic="true">
        {summary && input ? (
          <>
            <p class="result-label">
              {input.kind === 'rowne' ? 'Rata miesięczna' : 'Pierwsza rata'}
            </p>
            <p class="result-figure">{formatPrice(Math.round(summary.firstInstalment))}</p>
            {input.kind === 'malejace' && (
              <p class="result-sub">
                Ostatnia rata: {formatPrice(Math.round(summary.lastInstalment))}
              </p>
            )}
            <dl class="result-lines">
              <div>
                <dt>Kredyt</dt>
                <dd>{formatPrice(summary.loan)}</dd>
              </div>
              <div>
                <dt>Wkład własny</dt>
                <dd>{formatPrice(summary.downPayment)}</dd>
              </div>
              <div>
                <dt>Odsetki w całym okresie</dt>
                <dd>{formatPrice(Math.round(summary.totalInterest))}</dd>
              </div>
              <div>
                <dt>Razem do zapłaty</dt>
                <dd>{formatPrice(Math.round(summary.totalPaid))}</dd>
              </div>
            </dl>
            <div class="split" role="img" aria-label="Podział całkowitego kosztu">
              <span
                class="split-part split-own"
                style={`width:${percent(summary.downPayment, summary.totalPaid)}%`}
              />
              <span
                class="split-part split-capital"
                style={`width:${percent(summary.loan, summary.totalPaid)}%`}
              />
              <span
                class="split-part split-interest"
                style={`width:${percent(summary.totalInterest, summary.totalPaid)}%`}
              />
            </div>
            <ul class="split-legend">
              <li>
                <span class="split-key split-own" aria-hidden="true" />
                Wkład własny
              </li>
              <li>
                <span class="split-key split-capital" aria-hidden="true" />
                Kapitał kredytu
              </li>
              <li>
                <span class="split-key split-interest" aria-hidden="true" />
                Odsetki
              </li>
            </ul>
            <p class="result-sub">
              {groupThousands(summary.months)} rat w sumie. Do tego trzeba doliczyć koszty zakupu z
              listy powyżej.
            </p>
          </>
        ) : (
          <p class="result-empty">
            {errorCount === 1
              ? 'Popraw zaznaczone pole, a policzę ratę.'
              : `Popraw zaznaczone pola (${errorCount}), a policzę ratę.`}
          </p>
        )}
      </div>

      <p class="calculator-note">
        <Icon name="info" size={18} />
        <span>
          To szacunek z wzoru na raty, nie oferta kredytowa. Nie uwzględnia prowizji, ubezpieczeń,
          zmiany stawki ani zdolności kredytowej. Ratę, którą naprawdę dostaniesz, policzy bank.
        </span>
      </p>
    </div>
  );
};

export default MortgageCalculator;
