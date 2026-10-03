import { useEffect, useRef, useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { formatPln } from '../lib/money';
import { pluralPl } from '../lib/plural';
import { CartLineRow, FreeDeliveryBar } from '../components/CartParts';
import { cartLines, cartNotice, cartTotals, drawerOpen, useCartInit } from '../store/cart-store';

interface Props {
  drawer: boolean;
}

export const CartHeader = ({ drawer }: Props) => {
  useCartInit();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const totals = cartTotals.value;
  const lines = cartLines.value;
  const count = totals.itemCount;
  const [pop, setPop] = useState(0);
  const previousCount = useRef(count);

  useEffect(() => {
    if (count > previousCount.current) setPop(value => value + 1);
    previousCount.current = count;
  }, [count]);

  const open = drawer && drawerOpen.value;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const countLabel = `${count} ${pluralPl(count, 'produkt', 'produkty', 'produktów')}`;

  return (
    <>
      <a
        class="cart-btn"
        href={link('/trzask/koszyk/')}
        aria-label={`Koszyk, ${countLabel}`}
        onClick={event => {
          if (!drawer || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
            return;
          }
          event.preventDefault();
          drawerOpen.value = true;
        }}>
        Koszyk
        <span key={pop} class="cart-btn__n" data-pop={pop > 0 ? '' : undefined}>
          {count}
        </span>
      </a>
      {drawer && (
        <dialog
          class="drawer"
          ref={dialogRef}
          aria-labelledby="drawer-title"
          onClose={() => {
            drawerOpen.value = false;
          }}
          onClick={event => {
            if (event.target === dialogRef.current) drawerOpen.value = false;
          }}>
          <div class="drawer__head">
            <h2 id="drawer-title">
              Koszyk <span>{count}</span>
            </h2>
            <button
              type="button"
              class="drawer__x"
              aria-label="Zamknij koszyk"
              onClick={() => {
                drawerOpen.value = false;
              }}>
              &times;
            </button>
          </div>
          <div class="drawer__body">
            <p class="sr-only" role="status">
              {cartNotice.value}
            </p>
            {count === 0 ? (
              <div class="drawer__empty">
                <p>Koszyk jest pusty.</p>
                <a class="btn btn--lime" href={link('/trzask/sklep/')}>
                  Zobacz kawy
                </a>
              </div>
            ) : (
              <>
                <FreeDeliveryBar totals={totals} />
                <ul class="lines">
                  {lines.map(entry => (
                    <CartLineRow key={entry.key} entry={entry} />
                  ))}
                </ul>
              </>
            )}
          </div>
          {count > 0 && (
            <div class="drawer__foot">
              <p class="drawer__sum">
                <span>Razem</span>
                <span>{formatPln(totals.goodsGr)}</span>
              </p>
              <p class="drawer__small">
                Dostawę i&nbsp;kod rabatowy wybierzesz w&nbsp;kolejnych krokach.
              </p>
              <div class="btns">
                <a class="btn btn--lime btn--block" href={link('/trzask/kasa/')}>
                  Do kasy
                </a>
                <a class="btn btn--ghost btn--block" href={link('/trzask/koszyk/')}>
                  Pokaż koszyk
                </a>
              </div>
            </div>
          )}
        </dialog>
      )}
    </>
  );
};

export default CartHeader;
