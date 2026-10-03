import { link } from '../../../shared/link';
import type { Product } from '../data/types';
import { formatPerKg, formatPln } from '../lib/money';
import { lowestPriceGr, unitPricePerKgGr } from '../lib/pricing';
import { Label } from './Label';

export const productHref = (id: string): string => link(`/trzask/sklep/${id}/`);

export const ProductTile = ({ product }: { product: Product }) => {
  const priceGr = lowestPriceGr(product);
  return (
    <article class="tile">
      <div class="tile__label">
        <Label product={product} decorative />
      </div>
      <div class="tile__body">
        <h3 class="tile__name">
          <a href={productHref(product.id)}>{product.name}</a>
        </h3>
        <p class="tile__notes">
          {product.kind === 'coffee' ? product.notes.join(', ') : product.blurb}
        </p>
        <p class="tile__price">
          <strong>{formatPln(priceGr)}</strong>
          {product.kind === 'coffee' && (
            <span> za 250 g, {formatPerKg(unitPricePerKgGr(priceGr, 250))}</span>
          )}
        </p>
      </div>
    </article>
  );
};
