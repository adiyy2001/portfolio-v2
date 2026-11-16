import { link } from '../../../shared/link';
import { grindLabels } from '../data/facets';
import { numbers } from '../data/site';
import type { ResolvedLine, Totals } from '../lib/cart';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { pluralPl } from '../lib/plural';
import { changeQuantity, removeFromCart } from '../store/cart-store';
import { coffeeHref } from './ProductTile';
import { RoastDots } from './RoastDots';

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
      disabled={value >= numbers.maxLineQuantity}
      onClick={() => onChange(value + 1)}>
      +
    </button>
  </div>
);

export const bagCount = (count: number): string =>
  `${count} ${pluralPl(count, 'worek', 'worki', 'worków')}`;

export const CartLineRow = ({ entry }: { entry: ResolvedLine }) => {
  const { coffee, line } = entry;
  const description = `${formatGrams(numbers.bagGrams)}, ${grindLabels[line.grind]}`;
  const accessibleName = `${coffee.name}, ${description}`;
  return (
    <li class="line">
      <div class="line__dots">
        <RoastDots degree={coffee.degree} />
      </div>
      <div class="line__main">
        <h3 class="line__name">
          <a href={coffeeHref(coffee.id)}>{coffee.name}</a>
        </h3>
        <p class="line__opts">{description}</p>
        <p class="line__unit">
          {formatPln(entry.unitPriceGr, true)} za worek ({formatPerKg(entry.perKgGr)})
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
      <p class="line__total">{formatPln(entry.totalGr, true)}</p>
    </li>
  );
};

export const TotalsList = ({ totals }: { totals: Totals }) => (
  <dl class="totals">
    <div>
      <dt>Worki w koszyku</dt>
      <dd>{totals.itemCount}</dd>
    </div>
    <div>
      <dt>Odbiór w palarni</dt>
      <dd>bez opłat</dd>
    </div>
    <div class="totals__sum">
      <dt>Do zapłaty przy odbiorze</dt>
      <dd>{formatPln(totals.totalGr, true)}</dd>
    </div>
  </dl>
);

export const EmptyCart = ({ lead }: { lead: string }) => (
  <div class="cart-empty">
    <p class="cart-empty__big">Koszyk jest pusty.</p>
    <p>{lead}</p>
    <div class="btns">
      <a class="btn" href={link('/palarnia-kawy-nadodrze/sklep/')}>
        Do sklepu
      </a>
      <a class="btn btn--ghost" href={link('/palarnia-kawy-nadodrze/subskrypcja/')}>
        Zobacz abonament
      </a>
    </div>
  </div>
);
