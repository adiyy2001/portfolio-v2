import { useState } from 'preact/hooks';
import { sampleNotice } from '../data/business';
import { firstErrorField, validateEnquiry } from '../lib/validation';
import type { EnquiryValues, Errors } from '../lib/validation';
import { ErrorSummary, FormDone, SelectField, TextField } from '../components/FormParts';

type Field = keyof EnquiryValues;

interface Props {
  street: string;
  agentName: string;
}

const windows = [
  { value: 'rano', label: 'W tygodniu rano' },
  { value: 'popoludnie', label: 'W tygodniu po południu' },
  { value: 'sobota', label: 'W sobotę przed 14:00' },
];

const fieldOrder: Field[] = ['name', 'phone', 'when'];
const blank: EnquiryValues = { name: '', phone: '', when: 'rano' };

export const EnquiryForm = ({ street, agentName }: Props) => {
  const [values, setValues] = useState<EnquiryValues>(blank);
  const [errors, setErrors] = useState<Errors<EnquiryValues>>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<EnquiryValues | null>(null);

  const set = (field: Field, value: string): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(values);
  };

  if (done) {
    const label = windows.find(item => item.value === done.when)?.label.toLowerCase();
    return (
      <FormDone
        title={`Dziękujemy, ${done.name.trim()}.`}
        resetLabel="Umów inny termin"
        onReset={() => {
          setDone(null);
          setValues(blank);
        }}>
        <p>{sampleNotice}</p>
        <p>
          {agentName} zadzwoniłby pod numer {done.phone.trim()} ({label}), żeby umówić oglądanie
          przy {street}.
        </p>
      </FormDone>
    );
  }

  const items = fieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: `enquiry-${field}`, message: errors[field] ?? '' }));

  return (
    <form onSubmit={onSubmit} noValidate>
      <ErrorSummary items={items} focusSignal={firstErrorField(errors, fieldOrder) ? attempt : 0} />
      <TextField
        id="enquiry-name"
        label="Imię"
        value={values.name}
        autocomplete="given-name"
        error={errors.name}
        onInput={value => set('name', value)}
      />
      <TextField
        id="enquiry-phone"
        label="Telefon"
        type="tel"
        value={values.phone}
        autocomplete="tel"
        inputMode="tel"
        error={errors.phone}
        onInput={value => set('phone', value)}
      />
      <SelectField
        id="enquiry-when"
        label="Kiedy możemy zadzwonić"
        value={values.when}
        options={windows}
        onChange={value => set('when', value)}
      />
      <button type="submit" class="form-btn">
        Umów oglądanie
      </button>
    </form>
  );
};

export default EnquiryForm;
