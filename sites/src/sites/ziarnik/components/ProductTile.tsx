import { link } from '../../../shared/link';
import { coffeePriceGr } from '../data/catalog';
import { countryLabels, processLabels } from '../data/facets';
import { numbers } from '../data/site';
import type { Coffee } from '../data/types';
import { formatGrams, formatPerKg, formatPln } from '../lib/money';
import { perKgGr } from '../lib/pricing';
import { RoastDots } from './RoastDots';

export const coffeeHref = (id: string): string => link(`/ziarnik/sklep/${id}/`);

export const ProductTile = ({ coffee }: { coffee: Coffee }) => {
  const priceGr = coffeePriceGr(coffee);
  return (
    <article class="tile">
      <p class="tile__deg">
        stopień {coffee.degree} z {numbers.scaleSteps}
      </p>
      <RoastDots degree={coffee.degree} />
      <h3 class="tile__name">
        <a href={coffeeHref(coffee.id)}>{coffee.name}</a>
      </h3>
      <p class="tile__origin">
        {countryLabels[coffee.country]}, {processLabels[coffee.process].toLowerCase()}
      </p>
      <p class="tile__notes">{coffee.notes.join(', ')}</p>
      <p class="tile__price">
        <strong>{formatPln(priceGr, true)}</strong>
        <span>
          {' '}
          za worek {formatGrams(numbers.bagGrams)}, {formatPerKg(perKgGr(priceGr))}
        </span>
      </p>
    </article>
  );
};
