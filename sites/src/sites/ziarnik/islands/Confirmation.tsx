import { useEffect, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { business, sampleNotice } from '../data/site';
import { confirmationStorageKey, parseConfirmation } from '../lib/confirmation';
import type { ConfirmationData } from '../lib/confirmation';
import { formatPln } from '../lib/money';
import { readStorage, removeStorage } from '../lib/storage';
import { emptyTheCart } from '../store/cart-store';

export const Confirmation = () => {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(parseConfirmation(readStorage('session', confirmationStorageKey)));
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!data) {
    return (
      <div class="cart-empty">
        <p class="cart-empty__big">Nie ma tu żadnego zamówienia.</p>
        <p>Potwierdzenie pojawia się po przejściu przez kasę w tej samej karcie przeglądarki.</p>
        <div class="btns">
          <a class="btn" href={link('/ziarnik/sklep/')}>
            Do sklepu
          </a>
          <a class="btn btn--ghost" href={link('/ziarnik/koszyk/')}>
            Do koszyka
          </a>
        </div>
      </div>
    );
  }

  const finish = (): void => {
    emptyTheCart();
    removeStorage('session', confirmationStorageKey);
    window.location.assign(link('/ziarnik/sklep/'));
  };

  return (
    <article class="receipt" aria-labelledby="receipt-title">
      <p class="notice">{sampleNotice}</p>
      <h2 id="receipt-title">
        Numer zamówienia: <span class="receipt__ref">{data.reference}</span>
      </h2>
      <dl class="receipt__facts">
        <div>
          <dt>Odbiór</dt>
          <dd>
            {data.pickupLabel}, {data.pickupWindow}
          </dd>
        </div>
        <div>
          <dt>Miejsce</dt>
          <dd>
            {business.street}, {business.postcode} {business.city}
          </dd>
        </div>
        <div>
          <dt>Zamawia</dt>
          <dd>
            {data.name}, {data.phone}, {data.email}
          </dd>
        </div>
        {data.note && (
          <div>
            <dt>Uwagi</dt>
            <dd>{data.note}</dd>
          </div>
        )}
      </dl>
      <ul class="receipt__lines">
        {data.lines.map(line => (
          <li key={`${line.name}-${line.grind}`}>
            <span>
              {line.name}, {line.grind}, {line.quantity} szt.
            </span>
            <strong>{formatPln(line.totalGr, true)}</strong>
          </li>
        ))}
      </ul>
      <p class="receipt__sum">
        Do zapłaty przy odbiorze <strong>{formatPln(data.totalGr, true)}</strong>
      </p>
      <button type="button" class="btn" onClick={finish}>
        Opróżnij koszyk i wróć do sklepu
      </button>
    </article>
  );
};

export default Confirmation;
