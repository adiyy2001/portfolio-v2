import { discount, maxLineQuantity, vatRatePercent } from '../data/site';
import { grindLabels } from '../data/facets';
import type { CartLine, ResolvedLine, Totals } from '../lib/cart';
import { freeDeliveryMessage } from '../lib/delivery';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { changeQuantity, removeFromCart } from '../store/cart-store';
import { Label } from './Label';
import { productHref } from './ProductTile';

export const FreeDeliveryBar = ({ totals }: { totals: Totals }) => (
  <div class="free">
    <p class="free__msg" role="status">
      {freeDeliveryMessage(totals.freeDelivery, totals.itemCount)}
    </p>
    <div class="free__bar" aria-hidden="true">
      <span style={{ width: `${Math.round(totals.freeDelivery.progress * 100)}%` }} />
    </div>
  </div>
);

interface StepperProps {
  value: number;
  label: string;
  onChange: (next: number) => void;
}

export const QtyStepper = ({ value, label, onChange }: StepperProps) => (
  <div class="qty" role="group" aria-label={`Ilość: ${label}`}>
    <button
      type="button"
      class="qty__b"
      aria-label={`Zmniejsz ilość: ${label}`}
      onClick={() => onChange(value - 1)}>
      &minus;
    </button>
    <span class="qty__n" aria-live="polite" aria-atomic="true">
      {value}
    </span>
    <button
      type="button"
      class="qty__b"
      aria-label={`Zwiększ ilość: ${label}`}
      disabled={value >= maxLineQuantity}
      onClick={() => onChange(value + 1)}>
      +
    </button>
  </div>
);

export const lineDescription = (line: CartLine): string =>
  line.weight && line.grind ? `${formatGrams(line.weight)}, ${grindLabels[line.grind]}` : '';

export const CartLineRow = ({ entry }: { entry: ResolvedLine }) => {
  const { product, line } = entry;
  const description = lineDescription(line);
  const accessibleName = description ? `${product.name}, ${description}` : product.name;
  return (
    <li class="line">
      <div class="line__img">
        <Label product={product} weight={line.weight ?? undefined} decorative />
      </div>
      <div class="line__main">
        <h3 class="line__name">
          <a href={productHref(product.id)}>{product.name}</a>
        </h3>
        {description && <p class="line__opts">{description}</p>}
        <p class="line__unit">
          {formatPln(entry.unitPriceGr)}
          {entry.perKgGr !== null && <span> ({formatPerKg(entry.perKgGr)})</span>}
        </p>
        <div class="line__ctl">
          <QtyStepper
            value={line.quantity}
            label={accessibleName}
            onChange={next => changeQuantity(entry.key, next)}
          />
          <button type="button" class="link-btn" onClick={() => removeFromCart(entry.key)}>
            Usuń<span class="sr-only">: {accessibleName}</span>
          </button>
        </div>
      </div>
      <p class="line__total">{formatPln(entry.totalGr)}</p>
    </li>
  );
};

interface TotalsProps {
  totals: Totals;
  deliveryPending?: boolean;
  pendingText?: string;
}

export const TotalsList = ({
  totals,
  deliveryPending = false,
  pendingText = 'wybierzesz w\u00a0kasie',
}: TotalsProps) => (
  <dl class="totals">
    <div>
      <dt>Wartość koszyka</dt>
      <dd>{formatPln(totals.goodsGr)}</dd>
    </div>
    {totals.discountGr > 0 && (
      <div>
        <dt>
          Kod {discount.code} (&minus;{discount.percent}%)
        </dt>
        <dd>{formatPln(-totals.discountGr)}</dd>
      </div>
    )}
    <div>
      <dt>Dostawa</dt>
      <dd>
        {deliveryPending
          ? pendingText
          : totals.deliveryGr === 0
            ? 'gratis'
            : formatPln(totals.deliveryGr)}
      </dd>
    </div>
    <div class="totals__sum">
      <dt>{deliveryPending ? 'Razem bez dostawy' : 'Do zapłaty'}</dt>
      <dd>{formatPln(totals.totalGr)}</dd>
    </div>
    <div class="totals__vat">
      <dt>W&nbsp;tym VAT {vatRatePercent}%</dt>
      <dd>{formatPln(totals.vatGr)}</dd>
    </div>
  </dl>
);
