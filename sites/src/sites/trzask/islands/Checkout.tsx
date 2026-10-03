import { useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { deliveryMethods, paymentMethods, sampleNotice } from '../data/site';
import type { DeliveryId, PaymentId } from '../data/site';
import { computeTotals } from '../lib/cart';
import { buildConfirmation, confirmationStorageKey } from '../lib/confirmation';
import { deliveryCostGr } from '../lib/delivery';
import { formatPln } from '../lib/money';
import { writeStorage } from '../lib/storage';
import {
  checkoutFieldOrder,
  emptyCheckout,
  firstErrorField,
  validateCheckout,
} from '../lib/validation';
import type { CheckoutErrors, CheckoutField, CheckoutValues } from '../lib/validation';
import { ErrorSummary, TextField } from '../components/FormParts';
import { FreeDeliveryBar, TotalsList, lineDescription } from '../components/CartParts';
import { Label } from '../components/Label';
import { cart, cartLines, cartReady, cartTotals, useCartInit } from '../store/cart-store';

const targetId = (field: CheckoutField): string =>
  field === 'delivery' ? 'delivery-first' : field === 'payment' ? 'payment-first' : field;

export const Checkout = () => {
  useCartInit();
  const [values, setValues] = useState<CheckoutValues>(emptyCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [attempt, setAttempt] = useState(0);

  if (!cartReady.value) return <p class="cart-loading">Wczytuję koszyk.</p>;

  const baseTotals = cartTotals.value;
  if (baseTotals.itemCount === 0) {
    return (
      <div class="cart-empty">
        <p class="cart-empty__big">W&nbsp;koszyku nic nie ma.</p>
        <p>Do kasy trafiają kawy z&nbsp;koszyka. Wybierz coś i&nbsp;wróć.</p>
        <a class="btn btn--lime" href={link('/trzask/sklep/')}>
          Do sklepu
        </a>
      </div>
    );
  }

  const totals = computeTotals(cart.value, values.delivery || null);
  const set = <K extends CheckoutField>(field: K, value: CheckoutValues[K]): void => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (event: Event): void => {
    event.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);
    setAttempt(count => count + 1);
    if (Object.keys(found).length > 0) return;
    const data = buildConfirmation(values, cart.value);
    if (!data) return;
    writeStorage('session', confirmationStorageKey, JSON.stringify(data));
    window.location.assign(link('/trzask/kasa/potwierdzenie/'));
  };

  const summaryItems = checkoutFieldOrder
    .filter(field => errors[field])
    .map(field => ({ id: targetId(field), message: errors[field] ?? '' }));
  const firstError = firstErrorField(errors, checkoutFieldOrder);
  const delivery = deliveryMethods.find(method => method.id === values.delivery);
  const pickup = values.delivery === 'odbior';

  return (
    <div class="checkout">
      <form class="checkout__form" onSubmit={onSubmit} noValidate aria-describedby="sample-warning">
        <p class="notice" id="sample-warning">
          To strona przykładowa. Zamówienie nie zostanie złożone, a&nbsp;płatność nie zostanie
          pobrana.
        </p>
        <ErrorSummary items={summaryItems} focusSignal={firstError ? attempt : 0} />

        <section class="cform" aria-labelledby="contact-title">
          <h2 id="contact-title">Twoje dane</h2>
          <div class="cform__grid">
            <TextField
              id="firstName"
              label="Imię"
              value={values.firstName}
              autocomplete="given-name"
              error={errors.firstName}
              onInput={value => set('firstName', value)}
            />
            <TextField
              id="lastName"
              label="Nazwisko"
              value={values.lastName}
              autocomplete="family-name"
              error={errors.lastName}
              onInput={value => set('lastName', value)}
            />
            <TextField
              id="email"
              label="Adres e-mail"
              type="email"
              value={values.email}
              autocomplete="email"
              error={errors.email}
              hint="Na ten adres wysłalibyśmy potwierdzenie."
              onInput={value => set('email', value)}
            />
            <TextField
              id="phone"
              label="Telefon"
              type="tel"
              inputMode="tel"
              value={values.phone}
              autocomplete="tel"
              error={errors.phone}
              hint="Numer przyda się kurierowi i przy odbiorze."
              onInput={value => set('phone', value)}
            />
          </div>
        </section>

        <fieldset
          class="opts cform"
          aria-describedby={errors.delivery ? 'delivery-error' : undefined}>
          <legend class="cform__legend">Dostawa</legend>
          {deliveryMethods.map((method, index) => {
            const cost = deliveryCostGr(method.id, totals.goodsAfterDiscountGr);
            return (
              <label class="opt" key={method.id}>
                <input
                  id={index === 0 ? 'delivery-first' : undefined}
                  type="radio"
                  name="delivery"
                  value={method.id}
                  checked={values.delivery === method.id}
                  onChange={() => {
                    set('delivery', method.id as DeliveryId);
                    if (method.id !== 'odbior' && values.payment === 'gotowka') set('payment', '');
                  }}
                />
                <span class="opt__name">{method.name}</span>
                <span class="opt__note">
                  {method.time}. {method.note}
                </span>
                <span class="opt__price">{cost === 0 ? 'gratis' : formatPln(cost)}</span>
              </label>
            );
          })}
          {errors.delivery && (
            <span class="field__error" id="delivery-error">
              {errors.delivery}
            </span>
          )}
        </fieldset>

        {delivery?.needs === 'locker' && (
          <div class="cform">
            <TextField
              id="locker"
              label="Kod paczkomatu"
              value={values.locker}
              error={errors.locker}
              hint="Na przykład WRO12M. Kod znajdziesz w aplikacji przewoźnika."
              onInput={value => set('locker', value.toUpperCase())}
              maxLength={8}
            />
          </div>
        )}
        {delivery?.needs === 'address' && (
          <section class="cform" aria-labelledby="address-title">
            <h2 id="address-title">Adres dostawy</h2>
            <div class="cform__grid">
              <TextField
                id="street"
                label="Ulica i numer"
                value={values.street}
                autocomplete="street-address"
                error={errors.street}
                onInput={value => set('street', value)}
              />
              <TextField
                id="postcode"
                label="Kod pocztowy"
                value={values.postcode}
                autocomplete="postal-code"
                inputMode="numeric"
                error={errors.postcode}
                hint="Format 00-000."
                onInput={value => set('postcode', value)}
                maxLength={6}
              />
              <TextField
                id="city"
                label="Miejscowość"
                value={values.city}
                autocomplete="address-level2"
                error={errors.city}
                onInput={value => set('city', value)}
              />
            </div>
          </section>
        )}

        <fieldset
          class="opts cform"
          aria-describedby={errors.payment ? 'payment-error' : undefined}>
          <legend class="cform__legend">Płatność</legend>
          {paymentMethods.map((method, index) => {
            const blocked = method.pickupOnly && !pickup;
            return (
              <label class="opt opt--plain" key={method.id}>
                <input
                  id={index === 0 ? 'payment-first' : undefined}
                  type="radio"
                  name="payment"
                  value={method.id}
                  disabled={blocked}
                  checked={values.payment === method.id}
                  onChange={() => set('payment', method.id as PaymentId)}
                />
                <span class="opt__name">
                  {method.name}
                  <span class="opt__inline">
                    {blocked ? 'Dostępna tylko przy odbiorze w palarni.' : method.note}
                  </span>
                </span>
              </label>
            );
          })}
          <p class="cform__small">
            Wybór płatności jest tylko makietą. Nie podajemy tu numerów kart ani kodów BLIK.
          </p>
          {errors.payment && (
            <span class="field__error" id="payment-error">
              {errors.payment}
            </span>
          )}
        </fieldset>

        <button type="submit" class="btn btn--lime btn--block checkout__go">
          Zamawiam i&nbsp;płacę
        </button>
        <p class="cform__small">
          {sampleNotice} Przycisk tylko pokaże, jak wyglądałoby potwierdzenie.
        </p>
      </form>

      <aside class="checkout__side" aria-labelledby="order-title">
        <h2 id="order-title">Twoje zamówienie</h2>
        <ul class="mini">
          {cartLines.value.map(entry => (
            <li key={entry.key}>
              <div class="mini__img">
                <Label product={entry.product} weight={entry.line.weight ?? undefined} decorative />
              </div>
              <div>
                <p class="mini__name">{entry.product.name}</p>
                <p class="mini__opts">
                  {lineDescription(entry.line)}
                  {lineDescription(entry.line) ? ', ' : ''}
                  {entry.line.quantity} szt.
                </p>
              </div>
              <p class="mini__total">{formatPln(entry.totalGr)}</p>
            </li>
          ))}
        </ul>
        <FreeDeliveryBar totals={totals} />
        <TotalsList
          totals={totals}
          deliveryPending={!values.delivery}
          pendingText="wybierz sposób dostawy"
        />
        <p class="cart__small">
          <a href={link('/trzask/koszyk/')}>Wróć do koszyka</a>, żeby zmienić ilości albo wpisać kod
          rabatowy.
        </p>
      </aside>
    </div>
  );
};

export default Checkout;
