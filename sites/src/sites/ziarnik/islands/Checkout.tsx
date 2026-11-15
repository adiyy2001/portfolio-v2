import { useEffect, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { business, pickupLeadNote, sampleNotice } from '../data/site';
import { buildConfirmation, confirmationStorageKey, makeReference } from '../lib/confirmation';
import { warsawClock } from '../lib/hours';
import { formatPln } from '../lib/money';
import { pickupDays, windowsFor } from '../lib/pickup';
import type { PickupDay } from '../lib/pickup';
import { writeStorage } from '../lib/storage';
import {
  checkoutFieldOrder,
  emptyCheckout,
  firstErrorField,
  noteLimit,
  validateCheckout,
} from '../lib/validation';
import type { CheckoutErrors, CheckoutField, CheckoutValues } from '../lib/validation';
import { CartLineRow, EmptyCart, TotalsList } from '../components/CartParts';
import { ErrorSummary, SelectField, TextAreaField, TextField } from '../components/FormParts';
import { cart, cartLines, cartReady, cartTotals, useCartInit } from '../store/cart-store';

const noChoice = { value: '', label: 'Wybierz' };

export const Checkout = () => {
  useCartInit();
  const [values, setValues] = useState<CheckoutValues>(emptyCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [days, setDays] = useState<PickupDay[]>([]);

  useEffect(() => {
    setDays(pickupDays(warsawClock(new Date())));
  }, []);

  if (!cartReady.value) return <p class="cart-loading">Wczytuję koszyk.</p>;

  const totals = cartTotals.value;
  if (totals.itemCount === 0) {
    return <EmptyCart lead="Do kasy trafiają kawy z koszyka. Wybierz coś i wróć." />;
  }

  const set = <K extends CheckoutField>(field: K, value: CheckoutValues[K]): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const chosenDay = days.find(day => day.iso === values.pickupDay);

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateCheckout(
      values,
      days.map(day => day.iso),
      windowsFor,
    );
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length > 0 || !chosenDay) return;
    const data = buildConfirmation(values, cart.value, chosenDay.label, makeReference(Math.random));
    if (!data) return;
    writeStorage('session', confirmationStorageKey, JSON.stringify(data));
    window.location.assign(link('/ziarnik/kasa/potwierdzenie/'));
  };

  const summaryItems = checkoutFieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: field, message: errors[field] ?? '' }));
  const firstError = firstErrorField(errors, checkoutFieldOrder);
  const windows = chosenDay ? chosenDay.windows : [];

  return (
    <div class="checkout">
      <form class="checkout__form" onSubmit={onSubmit} noValidate aria-describedby="sample-warning">
        <p class="notice" id="sample-warning">
          To strona przykładowa. Zamówienie nie zostanie złożone, a nikt nie zapłaci. Na koniec
          zobaczysz tylko, jak wyglądałoby potwierdzenie.
        </p>
        <ErrorSummary items={summaryItems} focusSignal={firstError ? attempt : 0} />

        <section class="cform" aria-labelledby="who-title">
          <h2 id="who-title">Twoje dane</h2>
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
              hint="Zadzwonię tylko, gdyby kawa się skończyła."
              onInput={value => set('phone', value)}
            />
            <TextField
              id="email"
              label="Adres e-mail"
              type="email"
              value={values.email}
              autocomplete="email"
              error={errors.email}
              hint="Na ten adres przyszłoby potwierdzenie."
              onInput={value => set('email', value)}
            />
          </div>
        </section>

        <section class="cform" aria-labelledby="pickup-title">
          <h2 id="pickup-title">Odbiór w palarni</h2>
          <p class="cform__small">
            {business.street}, {business.postcode} {business.city}. {pickupLeadNote} Płacisz na
            miejscu, gotówką albo kartą.
          </p>
          <div class="cform__grid">
            <SelectField
              id="pickupDay"
              label="Dzień odbioru"
              value={values.pickupDay}
              options={[noChoice, ...days.map(day => ({ value: day.iso, label: day.label }))]}
              error={errors.pickupDay}
              onChange={value => {
                set('pickupDay', value);
                set('pickupWindow', '');
              }}
            />
            <SelectField
              id="pickupWindow"
              label="Godziny odbioru"
              value={values.pickupWindow}
              options={[noChoice, ...windows.map(label => ({ value: label, label }))]}
              error={errors.pickupWindow}
              onChange={value => set('pickupWindow', value)}
            />
          </div>
          <TextAreaField
            id="note"
            label="Uwagi do zamówienia"
            value={values.note}
            error={errors.note}
            hint={`Nieobowiązkowe, do ${noteLimit} znaków.`}
            onInput={value => set('note', value)}
          />
        </section>

        <button type="submit" class="btn btn--block checkout__go">
          Zamawiam, zapłacę przy odbiorze
        </button>
        <p class="cform__small">{sampleNotice}</p>
      </form>

      <aside class="checkout__side" aria-labelledby="order-title">
        <h2 id="order-title">Twoje zamówienie</h2>
        <ul class="lines lines--compact">
          {cartLines.value.map(entry => (
            <CartLineRow key={entry.key} entry={entry} />
          ))}
        </ul>
        <TotalsList totals={totals} />
        <p class="cart__small">
          Razem {formatPln(totals.totalGr, true)}.{' '}
          <a href={link('/ziarnik/koszyk/')}>Wróć do koszyka</a>, żeby zmienić ilości.
        </p>
      </aside>
    </div>
  );
};

export default Checkout;
