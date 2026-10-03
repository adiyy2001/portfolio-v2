import { useEffect, useRef, useState } from 'preact/hooks';
import { grindLabels, grindOrder, processLabels, roastLabels, weights } from '../data/facets';
import { getProduct } from '../data/catalog';
import { business } from '../data/site';
import type { GrindId, WeightGrams } from '../data/types';
import { formatGrams, formatPerKg, formatPln, vatIncluded } from '../lib/money';
import { productPriceGr, unitPricePerKgGr } from '../lib/pricing';
import { vatRatePercent } from '../data/site';
import { Label } from '../components/Label';
import { QtyStepper } from '../components/CartParts';
import { defaultGrind } from '../components/default-grind';
import { addToCart, cartNotice, drawerOpen } from '../store/cart-store';

interface Props {
  productId: string;
  summary: string;
}

export const ProductBuy = ({ productId, summary }: Props) => {
  const product = getProduct(productId);
  const [weight, setWeight] = useState<WeightGrams>(250);
  const [grind, setGrind] = useState<GrindId>(
    product?.kind === 'coffee' ? defaultGrind(product.recipe.method) : 'ziarna',
  );
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');
  const addButton = useRef<HTMLButtonElement>(null);
  const [addInView, setAddInView] = useState(true);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const button = addButton.current;
    const footer = document.querySelector('.ftr');
    if (!button || !footer) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === button) setAddInView(entry.isIntersecting);
        else setFooterInView(entry.isIntersecting);
      }
    });
    observer.observe(button);
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!product) return null;
  const isCoffee = product.kind === 'coffee';
  const chosenWeight = isCoffee ? weight : null;
  const unitGr = productPriceGr(product, chosenWeight);
  const totalGr = unitGr * quantity;

  const onAdd = (): void => {
    addToCart({
      productId: product.id,
      weight: chosenWeight,
      grind: isCoffee ? grind : null,
      quantity,
    });
    const options = isCoffee ? `, ${formatGrams(weight)}, ${grindLabels[grind].toLowerCase()}` : '';
    const message = `Dodano do koszyka: ${product.name}${options}, ilość ${quantity}.`;
    setStatus(message);
    cartNotice.value = message;
    drawerOpen.value = true;
  };

  return (
    <div class="pb">
      <div class="pb__label">
        <Label product={product} weight={chosenWeight ?? undefined} />
      </div>
      <div class="pb__info">
        <p class="eyebrow">
          {product.kind === 'coffee'
            ? `${roastLabels[product.roast]} palenie, ${processLabels[product.process].toLowerCase()}`
            : 'Akcesoria'}
        </p>
        <h1 class="pb__name">{product.name}</h1>
        <p class="lead pb__summary">{summary}</p>
        {product.kind === 'coffee' && (
          <ul class="pb__notes" aria-label="Nuty smakowe">
            {product.notes.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
        <form
          class="pb__buy"
          onSubmit={event => {
            event.preventDefault();
            onAdd();
          }}>
          {isCoffee && (
            <>
              <fieldset class="opts">
                <legend>Gramatura</legend>
                {weights.map(grams => {
                  const price = productPriceGr(product, grams);
                  return (
                    <label class="opt" key={grams}>
                      <input
                        type="radio"
                        name="weight"
                        value={grams}
                        checked={weight === grams}
                        onChange={() => setWeight(grams)}
                      />
                      <span class="opt__name">{formatGrams(grams)}</span>
                      <span class="opt__note">{formatPerKg(unitPricePerKgGr(price, grams))}</span>
                      <span class="opt__price">{formatPln(price)}</span>
                    </label>
                  );
                })}
              </fieldset>
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
                  Mielimy tuż przed wysyłką. Całe ziarna trzymają aromat dłużej.
                </span>
              </div>
            </>
          )}
          <div class="pb__row">
            <div class="field">
              <span class="field__label">Ilość</span>
              <QtyStepper
                value={quantity}
                label={product.name}
                onChange={next => setQuantity(Math.max(1, next))}
              />
            </div>
            <p class="pb__total">
              <strong>{formatPln(totalGr)}</strong>
              <span>
                w&nbsp;tym VAT {vatRatePercent}%: {formatPln(vatIncluded(totalGr, vatRatePercent))}
              </span>
            </p>
          </div>
          <button type="submit" class="btn btn--lime btn--block pb__add" ref={addButton}>
            Dodaj do koszyka
          </button>
          <p class="pb__status" role="status">
            {status}
          </p>
          <p class="pb__ship muted">
            {isCoffee
              ? `Palimy we wtorki i\u00a0czwartki. Odbiór osobisty: ${business.street}, ${business.city}.`
              : `Wysyłamy razem z\u00a0kawą albo osobno. Odbiór osobisty: ${business.street}, ${business.city}.`}
          </p>
        </form>
      </div>
      <div class={addInView || footerInView ? 'pb__bar' : 'pb__bar pb__bar--on'}>
        <p class="pb__bar-info">
          <strong>{formatPln(totalGr)}</strong>
          <span>
            {product.name}
            {isCoffee ? `, ${formatGrams(weight)}` : ''}
            {quantity > 1 ? `, ilość ${quantity}` : ''}
          </span>
        </p>
        <button type="button" class="btn btn--lime pb__bar-add" onClick={onAdd}>
          Do koszyka
        </button>
      </div>
    </div>
  );
};

export default ProductBuy;
