import { useState } from 'preact/hooks';
import { business, figures, sampleNotice } from '../data/business';
import { firstErrorField, validateValuation } from '../lib/validation';
import type { Errors, ValuationValues } from '../lib/validation';
import { ErrorSummary, FormDone, TextAreaField, TextField } from '../components/FormParts';

type Field = keyof ValuationValues;

const fieldOrder: Field[] = ['name', 'phone', 'address', 'note'];
const blank: ValuationValues = { name: '', phone: '', address: '', note: '' };

interface Props {
  idPrefix?: string;
}

export const ValuationForm = ({ idPrefix = 'v' }: Props) => {
  const [values, setValues] = useState<ValuationValues>(blank);
  const [errors, setErrors] = useState<Errors<ValuationValues>>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<ValuationValues | null>(null);

  const set = (field: Field, value: string): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateValuation(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(values);
  };

  if (done) {
    return (
      <FormDone
        title={`Dziękujemy, ${done.name.trim()}.`}
        resetLabel="Wypełnij formularz jeszcze raz"
        onReset={() => {
          setDone(null);
          setValues(blank);
        }}>
        <p>{sampleNotice}</p>
        <p>
          Zadzwonilibyśmy pod numer {done.phone.trim()}, żeby umówić oględziny przy adresie{' '}
          {done.address.trim()}. Wycena byłaby gotowa w {figures.valuationHours} godzin od oględzin.
          Wolisz zadzwonić od razu? {business.phone}.
        </p>
      </FormDone>
    );
  }

  const items = fieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: `${idPrefix}-${field}`, message: errors[field] ?? '' }));

  return (
    <form onSubmit={onSubmit} noValidate>
      <ErrorSummary items={items} focusSignal={firstErrorField(errors, fieldOrder) ? attempt : 0} />
      <TextField
        id={`${idPrefix}-name`}
        label="Imię"
        value={values.name}
        autocomplete="given-name"
        error={errors.name}
        onInput={value => set('name', value)}
      />
      <TextField
        id={`${idPrefix}-phone`}
        label="Telefon"
        type="tel"
        value={values.phone}
        autocomplete="tel"
        inputMode="tel"
        error={errors.phone}
        onInput={value => set('phone', value)}
      />
      <TextField
        id={`${idPrefix}-address`}
        label="Adres mieszkania"
        value={values.address}
        autocomplete="street-address"
        error={errors.address}
        onInput={value => set('address', value)}
      />
      <TextAreaField
        id={`${idPrefix}-note`}
        label="Co jeszcze powinniśmy wiedzieć"
        value={values.note}
        onInput={value => set('note', value)}
      />
      <button type="submit" class="form-btn">
        Wyślij prośbę o wycenę
      </button>
    </form>
  );
};

export default ValuationForm;
