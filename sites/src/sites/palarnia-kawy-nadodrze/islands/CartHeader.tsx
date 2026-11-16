import { link } from '../../../shared/link';
import { pluralPl } from '../lib/plural';
import { cartTotals, useCartInit, useHydrated } from '../store/cart-store';

export const CartHeader = () => {
  useCartInit();
  const hydrated = useHydrated();
  const count = hydrated ? cartTotals.value.itemCount : 0;
  const label = `${count} ${pluralPl(count, 'worek', 'worki', 'worków')}`;
  return (
    <a
      class="cart-btn"
      href={link('/palarnia-kawy-nadodrze/koszyk/')}
      aria-label={`Koszyk, ${label}`}>
      <span>koszyk</span>
      <span class="cart-btn__n" aria-hidden="true">
        {count}
      </span>
    </a>
  );
};

export default CartHeader;
