import { useState } from 'preact/hooks';
import { sampleNotice, subscriptionFrequencies, subscriptionProfiles } from '../data/site';
import { weights } from '../data/facets';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { weightPriceGr } from '../lib/pricing';
import { defaultSubscription, quoteSubscription } from '../lib/subscription';
import type { SubscriptionChoice } from '../lib/subscription';
import { firstErrorField, validateSubscriptionContact } from '../lib/validation';
import type { SubscriptionContactErrors, SubscriptionContactValues } from '../lib/validation';
import { ErrorSummary, SuccessNotice, TextField } from '../components/FormParts';
import { pluralPl } from '../lib/plural';

const fieldOrder: Array<keyof SubscriptionContactValues> = ['name', 'email'];

export const Subscription = () => {
  const [choice, setChoice] = useState<SubscriptionChoice>(defaultSubscription);
  const [contact, setContact] = useState<SubscriptionContactValues>({ name: '', email: '' });
  const [errors, setErrors] = useState<SubscriptionContactErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [done, setDone] = useState(false);

  const quote = quoteSubscription(choice);
  const profile = quote.profile;

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateSubscriptionContact(contact);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length === 0) setDone(true);
  };

  const items = fieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: `sub-${field}`, message: errors[field] ?? '' }));

  return (
    <div class="sub">
      <div class="sub__pick">
        <fieldset class="opts">
          <legend class="cform__legend">Profil kawy</legend>
          {subscriptionProfiles.map(item => (
            <label class="opt opt--tall" key={item.id}>
              <input
                type="radio"
                name="profile"
                value={item.id}
                checked={choice.profileId === item.id}
                onChange={() => setChoice({ ...choice, profileId: item.id })}
              />
              <span class="opt__name">
                {item.name} <span class="opt__tag">{item.roast}</span>
              </span>
              <span class="opt__note">
                {item.blurb} Na początek: {item.examples}.
              </span>
              <span class="opt__price">od {formatPln(weightPriceGr(item.base250, 250), true)}</span>
            </label>
          ))}
        </fieldset>

        <fieldset class="opts opts--row">
          <legend class="cform__legend">Gramatura paczki</legend>
          {weights.map(grams => (
            <label class="opt opt--compact" key={grams}>
              <input
                type="radio"
                name="weight"
                value={grams}
                checked={choice.weight === grams}
                onChange={() => setChoice({ ...choice, weight: grams })}
              />
              <span class="opt__name">{formatGrams(grams)}</span>
              <span class="opt__note">
                {formatPln(weightPriceGr(profile.base250, grams), true)}
              </span>
            </label>
          ))}
        </fieldset>

        <fieldset class="opts opts--row">
          <legend class="cform__legend">Jak często</legend>
          {subscriptionFrequencies.map(item => (
            <label class="opt opt--compact" key={item.id}>
              <input
                type="radio"
                name="frequency"
                value={item.id}
                checked={choice.frequencyId === item.id}
                onChange={() => setChoice({ ...choice, frequencyId: item.id })}
              />
              <span class="opt__name">{item.name}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <aside class="sub__quote" aria-labelledby="quote-title">
        <h2 id="quote-title">Twoja subskrypcja</h2>
        <div role="status" aria-live="polite" class="sub__live">
          <p class="sub__sentence">
            {profile.name}, {profile.roast.toLowerCase()}, {formatGrams(choice.weight)}{' '}
            {quote.frequency.name.toLowerCase()}.
          </p>
          <dl class="sub__nums">
            <div>
              <dt>Jedna paczka</dt>
              <dd>{formatPln(quote.parcelGr, true)}</dd>
            </div>
            <div>
              <dt>Za kilogram</dt>
              <dd>{formatPerKg(quote.perKgGr)}</dd>
            </div>
            <div>
              <dt>Miesięcznie, około</dt>
              <dd>{formatPln(quote.monthlyGr, true)}</dd>
            </div>
            <div>
              <dt>Kawy w&nbsp;miesiącu</dt>
              <dd>około {quote.gramsPerMonth} g</dd>
            </div>
          </dl>
          <p class="sub__cups">
            Z&nbsp;jednej paczki wyjdzie około {quote.cups}{' '}
            {pluralPl(quote.cups, 'filiżanka', 'filiżanki', 'filiżanek')} przelewu.
          </p>
        </div>
        <p class="sub__small">
          Dostawa jest w&nbsp;cenie. Ceny zawierają 23% VAT. Rezygnujesz, pomijasz paczkę albo
          zmieniasz profil do 12:00 dnia przed paleniem.
        </p>

        {done ? (
          <SuccessNotice>
            <strong>{contact.name}, dziękujemy.</strong> {sampleNotice} W&nbsp;prawdziwym sklepie
            dostałbyś mail z&nbsp;linkiem do płatności pierwszej paczki.
          </SuccessNotice>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <ErrorSummary
              items={items}
              focusSignal={firstErrorField(errors, fieldOrder) ? attempt : 0}
            />
            <TextField
              id="sub-name"
              label="Imię"
              value={contact.name}
              autocomplete="given-name"
              error={errors.name}
              onInput={value => setContact({ ...contact, name: value })}
            />
            <TextField
              id="sub-email"
              label="Adres e-mail"
              type="email"
              value={contact.email}
              autocomplete="email"
              error={errors.email}
              onInput={value => setContact({ ...contact, email: value })}
            />
            <button type="submit" class="btn btn--lime btn--block">
              Zapisz mnie
            </button>
          </form>
        )}
      </aside>
    </div>
  );
};

export default Subscription;
