import { useState } from 'preact/hooks';
import { coffeesAtDegree } from '../data/catalog';
import { grindLabels, grindOrder } from '../data/facets';
import { business, sampleNotice, subscriptionTerms } from '../data/site';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { pluralPl } from '../lib/plural';
import { clampBags, quoteSubscription } from '../lib/subscription';
import { subscriptionCoffeeLabel } from '../lib/subscription';
import { firstErrorField, subscriptionFieldOrder, validateSubscription } from '../lib/validation';
import type { SubscriptionErrors, SubscriptionField, SubscriptionValues } from '../lib/validation';
import { ErrorSummary, SelectField, SuccessNotice, TextField } from '../components/FormParts';

const noChoice = { value: '', label: 'Wybierz' };

const weekdayOptions = [1, 2, 3, 4, 5, 6].map(day => ({
  value: String(day),
  label: ['', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'][day],
}));

const initial: SubscriptionValues = {
  coffee: 'dobor',
  grind: 'ziarna',
  bags: 1,
  pickupDay: '',
  name: '',
  phone: '',
  email: '',
};

export const Subscription = () => {
  const [values, setValues] = useState<SubscriptionValues>(initial);
  const [errors, setErrors] = useState<SubscriptionErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState<SubscriptionValues | null>(null);

  const set = <K extends SubscriptionField>(field: K, value: SubscriptionValues[K]): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const quote = quoteSubscription(values.bags);
  const options = [
    { value: 'dobor', label: subscriptionCoffeeLabel('dobor') },
    ...coffeesAtDegree(subscriptionTerms.degree).map(coffee => ({
      value: coffee.id,
      label: coffee.name,
    })),
  ];

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateSubscription(
      values,
      weekdayOptions.map(option => option.value),
      subscriptionTerms.maxBags,
    );
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(values);
  };

  if (done) {
    const finalQuote = quoteSubscription(done.bags);
    const day = weekdayOptions.find(option => option.value === done.pickupDay)?.label ?? '';
    return (
      <div class="sub-done">
        <SuccessNotice>
          <p>
            <strong>{sampleNotice}</strong>
          </p>
          <p>
            Tak wyglądałby abonament: {done.bags} {pluralPl(done.bags, 'worek', 'worki', 'worków')}{' '}
            tygodniowo, {subscriptionCoffeeLabel(done.coffee).toLowerCase()}, mielenie:{' '}
            {grindLabels[done.grind as keyof typeof grindLabels].toLowerCase()}, odbiór w {day} w{' '}
            {business.street}, {formatPln(finalQuote.weeklyGr, true)} tygodniowo, płatne przy
            odbiorze.
          </p>
        </SuccessNotice>
        <button type="button" class="btn btn--ghost" onClick={() => setDone(null)}>
          Wróć do formularza
        </button>
      </div>
    );
  }

  const summaryItems = subscriptionFieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: field, message: errors[field] ?? '' }));
  const firstError = firstErrorField(errors, subscriptionFieldOrder);

  return (
    <div class="sub">
      <form class="sub__form" onSubmit={onSubmit} noValidate>
        <ErrorSummary items={summaryItems} focusSignal={firstError ? attempt : 0} />
        <section class="cform" aria-labelledby="sub-what">
          <h2 id="sub-what">Co ma przychodzić</h2>
          <SelectField
            id="coffee"
            label="Kawa"
            value={values.coffee}
            options={options}
            error={errors.coffee}
            hint="Przy doborze Hubert wybiera kawę stopnia 6, którą akurat pali."
            onChange={value => set('coffee', value)}
          />
          <div class="cform__grid">
            <SelectField
              id="grind"
              label="Mielenie"
              value={values.grind}
              options={grindOrder.map(id => ({ value: id, label: grindLabels[id] }))}
              error={errors.grind}
              onChange={value => set('grind', value)}
            />
            <SelectField
              id="bags"
              label="Worków tygodniowo"
              value={String(values.bags)}
              options={Array.from({ length: subscriptionTerms.maxBags }, (_, index) => ({
                value: String(index + 1),
                label: String(index + 1),
              }))}
              error={errors.bags}
              onChange={value => set('bags', clampBags(Number(value)))}
            />
          </div>
          <SelectField
            id="pickupDay"
            label="Dzień odbioru w tygodniu"
            value={values.pickupDay}
            options={[noChoice, ...weekdayOptions]}
            error={errors.pickupDay}
            hint={`Zmiany przyjmuję ${subscriptionTerms.cutoff}, żeby wiedzieć, ile palić.`}
            onChange={value => set('pickupDay', value)}
          />
        </section>
        <section class="cform" aria-labelledby="sub-who">
          <h2 id="sub-who">Twoje dane</h2>
          <div class="cform__grid">
            <TextField
              id="name"
              label="Imię i nazwisko"
              value={values.name}
              autocomplete="name"
              error={errors.name}
              onInput={value => set('name', value)}
            />
            <TextField
              id="phone"
              label="Telefon"
              type="tel"
              inputMode="tel"
              value={values.phone}
              autocomplete="tel"
              error={errors.phone}
              onInput={value => set('phone', value)}
            />
            <TextField
              id="email"
              label="Adres e-mail"
              type="email"
              value={values.email}
              autocomplete="email"
              error={errors.email}
              onInput={value => set('email', value)}
            />
          </div>
        </section>
        <button type="submit" class="btn btn--block">
          Zapisz mnie na abonament
        </button>
        <p class="cform__small">{sampleNotice}</p>
      </form>
      <aside class="sub__side" aria-labelledby="sub-sum">
        <h2 id="sub-sum">Twój tydzień</h2>
        <dl class="totals">
          <div>
            <dt>Worki tygodniowo</dt>
            <dd>{quote.bags}</dd>
          </div>
          <div>
            <dt>Kawy tygodniowo</dt>
            <dd>
              {formatGrams(quote.gramsPerWeek)}, około {quote.cupsPerWeek}{' '}
              {pluralPl(quote.cupsPerWeek, 'filiżanka', 'filiżanki', 'filiżanek')}
            </dd>
          </div>
          <div>
            <dt>Cena worka</dt>
            <dd>
              {formatPln(quote.bagPriceGr, true)}, {formatPerKg(quote.perKgGr)}
            </dd>
          </div>
          <div class="totals__sum">
            <dt>Tygodniowo przy odbiorze</dt>
            <dd>{formatPln(quote.weeklyGr, true)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
};

export default Subscription;
