import { useState } from 'preact/hooks';
import { link } from '../../../shared/link';
import { getCoffee, coffeePriceGr } from '../data/catalog';
import { defaultGrindForBrew, grindLabels, grindOrder } from '../data/facets';
import { numbers, pickupLeadNote } from '../data/site';
import type { GrindId } from '../data/types';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { perKgGr } from '../lib/pricing';
import { QtyStepper } from '../components/CartParts';
import { addToCart } from '../store/cart-store';

interface Props {
  coffeeId: string;
}

export const ProductBuy = ({ coffeeId }: Props) => {
  const coffee = getCoffee(coffeeId);
  const [grind, setGrind] = useState<GrindId>(
    coffee ? defaultGrindForBrew[coffee.brew[0]] : 'ziarna',
  );
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');
  const [added, setAdded] = useState(false);

  if (!coffee) return null;
  const unitGr = coffeePriceGr(coffee);

  return (
    <form
      class="buy"
      onSubmit={event => {
        event.preventDefault();
        addToCart({ coffeeId: coffee.id, grind, quantity });
        setStatus(
          `Dodano do koszyka: ${coffee.name}, ${grindLabels[grind].toLowerCase()}, ${quantity} szt.`,
        );
        setAdded(true);
      }}>
      <p class="buy__price">
        <strong>{formatPln(unitGr, true)}</strong>
        <span>
          {' '}
          za worek {formatGrams(numbers.bagGrams)}, {formatPerKg(perKgGr(unitGr))}
        </span>
      </p>
      <div class="field">
        <label for="grind">Mielenie</label>
        <select
          id="grind"
          class="select"
          value={grind}
          onChange={event => setGrind(event.currentTarget.value as GrindId)}>
          {grindOrder.map(id => (
            <option key={id} value={id}>
              {grindLabels[id]}
            </option>
          ))}
        </select>
        <span class="field__hint">
          Mielę tuż przed odbiorem. Całe ziarna trzymają aromat dłużej.
        </span>
      </div>
      <div class="buy__row">
        <div class="field">
          <span class="field__label">Ilość worków</span>
          <QtyStepper
            value={quantity}
            label={coffee.name}
            onChange={next => setQuantity(Math.max(1, next))}
          />
        </div>
        <p class="buy__total">
          <span>Razem</span>
          <strong>{formatPln(unitGr * quantity, true)}</strong>
        </p>
      </div>
      <button type="submit" class="btn btn--block">
        Dodaj do koszyka
      </button>
      <p class="buy__status" role="status">
        {status}
        {added && (
          <>
            {' '}
            <a href={link('/ziarnik/koszyk/')}>Przejdź do koszyka</a>
          </>
        )}
      </p>
      <p class="buy__note">{pickupLeadNote}</p>
    </form>
  );
};

export default ProductBuy;
