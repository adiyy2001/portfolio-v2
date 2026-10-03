import { useEffect, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { deliveryMethods, paymentMethods } from '../data/site';
import { confirmationStorageKey, parseConfirmation } from '../lib/confirmation';
import type { ConfirmationData } from '../lib/confirmation';
import { formatPln } from '../lib/money';
import { readStorage } from '../lib/storage';
import { cartTotals, emptyTheCart, useCartInit } from '../store/cart-store';

type Phase = 'loading' | 'missing' | 'ready';

export const Confirmation = () => {
  useCartInit();
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [emptied, setEmptied] = useState(false);

  useEffect(() => {
    const parsed = parseConfirmation(readStorage('session', confirmationStorageKey));
    setData(parsed);
    setPhase(parsed ? 'ready' : 'missing');
  }, []);

  if (phase === 'loading') return <p class="cart-loading">Wczytuję podsumowanie.</p>;

  if (!data) {
    return (
      <div class="cart-empty">
        <p class="cart-empty__big">Nie ma tu zamówienia do pokazania.</p>
        <p>Przejdź przez kasę, a&nbsp;zobaczysz, jak wyglądałoby potwierdzenie.</p>
        <a class="btn btn--lime" href={link('/trzask/sklep/')}>
          Do sklepu
        </a>
      </div>
    );
  }

  const delivery = deliveryMethods.find(method => method.id === data.delivery);
  const payment = paymentMethods.find(method => method.id === data.payment);
  const cartCount = cartTotals.value.itemCount;

  return (
    <div class="confirm">
      <div class="confirm__sheet">
        <h2>Tak wyglądałoby potwierdzenie</h2>
        <p>
          {data.firstName}, gdyby to był prawdziwy sklep, wysłalibyśmy mail na adres {data.email}.
          Upalilibyśmy kawę najbliższego wtorku albo czwartku i&nbsp;nadali paczkę następnego dnia
          roboczego.
        </p>
        <ul class="confirm__lines">
          {data.lines.map((line, index) => (
            <li key={`${line.name}-${index}`}>
              <span>
                {line.name}
                {line.options ? `, ${line.options}` : ''}, {line.quantity} szt.
              </span>
              <strong>{formatPln(line.totalGr)}</strong>
            </li>
          ))}
        </ul>
        <dl class="ledger">
          <div>
            <dt>Dostawa</dt>
            <dd>
              {delivery?.name}, {data.deliveryGr === 0 ? 'gratis' : formatPln(data.deliveryGr)}
            </dd>
          </div>
          <div>
            <dt>Płatność</dt>
            <dd>{payment?.name}</dd>
          </div>
          {data.discountGr > 0 && (
            <div>
              <dt>Kod rabatowy</dt>
              <dd>
                {data.code}, {formatPln(-data.discountGr)}
              </dd>
            </div>
          )}
          <div>
            <dt>Do zapłaty</dt>
            <dd>
              <strong>{formatPln(data.totalGr)}</strong>
            </dd>
          </div>
        </dl>
      </div>
      <div class="confirm__actions">
        <p class="notice">
          Nic nie zostało pobrane z&nbsp;żadnej karty ani konta. Twoje dane zostały tylko w&nbsp;tej
          karcie przeglądarki i&nbsp;znikną po jej zamknięciu.
        </p>
        <div class="btns">
          <a class="btn btn--lime" href={link('/trzask/sklep/')}>
            Wróć do sklepu
          </a>
          {cartCount > 0 && !emptied && (
            <button
              type="button"
              class="btn btn--ghost"
              onClick={() => {
                emptyTheCart();
                setEmptied(true);
              }}>
              Opróżnij koszyk
            </button>
          )}
        </div>
        <p role="status" class="confirm__status">
          {emptied
            ? 'Koszyk jest pusty.'
            : cartCount > 0
              ? 'Koszyk został nietknięty, więc możesz jeszcze go pooglądać.'
              : ''}
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
