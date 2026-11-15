import { link } from '../../../shared/link';
import { CartLineRow, EmptyCart, TotalsList } from '../components/CartParts';
import { cartLines, cartReady, cartTotals, useCartInit, useHydrated } from '../store/cart-store';

export const CartPage = () => {
  useCartInit();
  const hydrated = useHydrated();
  const totals = cartTotals.value;
  const lines = cartLines.value;

  if (!hydrated || !cartReady.value) return <p class="cart-loading">Wczytuję koszyk.</p>;

  if (totals.itemCount === 0) {
    return (
      <EmptyCart lead="Wybierz kawę, a worek będzie czekał w palarni od następnego dnia otwarcia." />
    );
  }

  return (
    <div class="cart">
      <div class="cart__main">
        <h2 class="sr-only">Kawy w koszyku</h2>
        <ul class="lines">
          {lines.map(entry => (
            <CartLineRow key={entry.key} entry={entry} />
          ))}
        </ul>
      </div>
      <aside class="cart__side" aria-labelledby="sum-title">
        <h2 id="sum-title">Podsumowanie</h2>
        <TotalsList totals={totals} />
        <p class="cart__small">
          Ceny brutto. Dzień i godziny odbioru wybierzesz w kasie. Płacisz w palarni, gotówką albo
          kartą.
        </p>
        <a class="btn btn--block" href={link('/ziarnik/kasa/')}>
          Przejdź do kasy
        </a>
        <a class="cart__back" href={link('/ziarnik/sklep/')}>
          Wróć do sklepu
        </a>
      </aside>
    </div>
  );
};

export default CartPage;
