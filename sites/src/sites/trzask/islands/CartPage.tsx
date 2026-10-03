import { useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { discount } from '../data/site';
import { CartLineRow, FreeDeliveryBar, TotalsList } from '../components/CartParts';
import {
  dropCode,
  cart,
  cartLines,
  cartReady,
  cartTotals,
  submitCode,
  useCartInit,
} from '../store/cart-store';

export const CartPage = () => {
  useCartInit();
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  const totals = cartTotals.value;
  const lines = cartLines.value;
  const code = cart.value.code;

  if (!cartReady.value) {
    return <p class="cart-loading">Wczytuję koszyk.</p>;
  }

  if (totals.itemCount === 0) {
    return (
      <div class="cart-empty">
        <p class="cart-empty__big">Koszyk jest pusty.</p>
        <p>Wybierz kawę, a&nbsp;my wypalimy ją najbliższego wtorku albo czwartku.</p>
        <div class="btns">
          <a class="btn btn--lime" href={link('/trzask/sklep/')}>
            Do sklepu
          </a>
          <a class="btn btn--ghost" href={link('/trzask/subskrypcja/')}>
            Zobacz subskrypcję
          </a>
        </div>
      </div>
    );
  }

  const onApply = (event: Event): void => {
    event.preventDefault();
    if (submitCode(input)) {
      setFailed(false);
      setMessage(`Kod ${discount.code} zastosowany. Towary są o\u00a0${discount.percent}% tańsze.`);
      setInput('');
    } else {
      setFailed(true);
      setMessage('Nie znamy takiego kodu. Sprawdź pisownię i\u00a0spróbuj jeszcze raz.');
    }
  };

  return (
    <div class="cart">
      <div class="cart__main">
        <FreeDeliveryBar totals={totals} />
        <h2 class="sr-only">Produkty w&nbsp;koszyku</h2>
        <ul class="lines">
          {lines.map(entry => (
            <CartLineRow key={entry.key} entry={entry} />
          ))}
        </ul>
        <form class="code" onSubmit={onApply} noValidate>
          <div class="field">
            <label for="code">Kod rabatowy</label>
            <div class="code__row">
              <input
                id="code"
                class="input"
                type="text"
                autocomplete="off"
                autocapitalize="characters"
                value={input}
                aria-invalid={failed}
                aria-describedby="code-hint code-msg"
                onInput={event => setInput(event.currentTarget.value)}
              />
              <button type="submit" class="btn">
                Zastosuj
              </button>
            </div>
            <span class="field__hint" id="code-hint">
              To strona przykładowa. Działa jeden kod: {discount.code}.
            </span>
          </div>
          <p class={failed ? 'field__error' : 'code__ok'} id="code-msg" role="status">
            {message}
          </p>
          {code && (
            <p class="code__applied">
              Zastosowano kod {code}.{' '}
              <button
                type="button"
                class="link-btn"
                onClick={() => {
                  dropCode();
                  setMessage('Kod rabatowy usunięty.');
                  setFailed(false);
                }}>
                Usuń kod
              </button>
            </p>
          )}
        </form>
      </div>
      <aside class="cart__side" aria-labelledby="sum-title">
        <h2 id="sum-title">Podsumowanie</h2>
        <TotalsList totals={totals} deliveryPending />
        <p class="cart__small">
          Dostawę (paczkomat, kurier albo odbiór w&nbsp;palarni) i&nbsp;płatność wybierzesz
          w&nbsp;kasie.
        </p>
        <a class="btn btn--lime btn--block" href={link('/trzask/kasa/')}>
          Przejdź do kasy
        </a>
        <a class="cart__back" href={link('/trzask/sklep/')}>
          Wróć do sklepu
        </a>
      </aside>
    </div>
  );
};

export default CartPage;
