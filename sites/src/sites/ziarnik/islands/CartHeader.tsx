import { link } from '../../../shared/link';
import { pluralPl } from '../lib/plural';
import { cartTotals, useCartInit } from '../store/cart-store';

export const CartHeader = () => {
  useCartInit();
  const count = cartTotals.value.itemCount;
  const label = `${count} ${pluralPl(count, 'worek', 'worki', 'worków')}`;
  return (
    <a class="cart-btn" href={link('/ziarnik/koszyk/')} aria-label={`Koszyk, ${label}`}>
      <span>koszyk</span>
      <span class="cart-btn__n" aria-hidden="true">
        {count}
      </span>
    </a>
  );
};

export default CartHeader;
