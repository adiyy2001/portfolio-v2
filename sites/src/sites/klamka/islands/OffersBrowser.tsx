import { useMemo, useState } from 'preact/hooks';
import { offers } from '../data/offers';
import type { District } from '../data/offers';
import { business } from '../data/business';
import OfferRow from '../components/OfferRow';
import {
  applyFilters,
  budgetOptions,
  districtOptions,
  emptyFilters,
  roomOptions,
  sortOptions,
} from '../lib/filters';
import type { OfferFilters, SortKey } from '../lib/filters';
import { countLabel, formatPrice } from '../lib/format';
import { useFavourites } from '../lib/use-favourites';

interface Props {
  sortable?: boolean;
}

interface ChoiceProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onPick: () => void;
}

const Choice = ({ name, value, label, checked, onPick }: ChoiceProps) => (
  <>
    <label>
      <input type="radio" name={name} value={value} checked={checked} onChange={onPick} />
      <span>{label}</span>
    </label>{' '}
  </>
);

export const OffersBrowser = ({ sortable = false }: Props) => {
  const [filters, setFilters] = useState<OfferFilters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>('number');
  const { slugs, toggle } = useFavourites();
  const shown = useMemo(() => applyFilters(offers, filters, sort), [filters, sort]);
  const setFilter = <K extends keyof OfferFilters>(key: K, value: OfferFilters[K]): void =>
    setFilters(current => ({ ...current, [key]: value }));

  return (
    <>
      <form
        class="filter"
        autoComplete="off"
        aria-label="Filtr katalogu ofert"
        onSubmit={event => event.preventDefault()}>
        <div class="grp" role="radiogroup" aria-labelledby="g-rooms">
          <span class="glabel" id="g-rooms">
            Pokoje
          </span>
          <div class="opts">
            <Choice
              name="rooms"
              value=""
              label="wszystkie"
              checked={filters.rooms === 0}
              onPick={() => setFilter('rooms', 0)}
            />
            {roomOptions.map(count => (
              <Choice
                key={count}
                name="rooms"
                value={String(count)}
                label={String(count)}
                checked={filters.rooms === count}
                onPick={() => setFilter('rooms', count)}
              />
            ))}
          </div>
        </div>
        <div class="grp" role="radiogroup" aria-labelledby="g-district">
          <span class="glabel" id="g-district">
            Osiedle
          </span>
          <div class="opts">
            <Choice
              name="district"
              value=""
              label="wszystkie"
              checked={filters.district === ''}
              onPick={() => setFilter('district', '')}
            />
            {districtOptions.map((name: District) => (
              <Choice
                key={name}
                name="district"
                value={name}
                label={name}
                checked={filters.district === name}
                onPick={() => setFilter('district', name)}
              />
            ))}
          </div>
        </div>
        <div class="grp" role="radiogroup" aria-labelledby="g-budget">
          <span class="glabel" id="g-budget">
            Cena do
          </span>
          <div class="opts">
            <Choice
              name="budget"
              value="0"
              label="dowolna"
              checked={filters.budget === 0}
              onPick={() => setFilter('budget', 0)}
            />
            {budgetOptions.map(limit => (
              <Choice
                key={limit}
                name="budget"
                value={String(limit)}
                label={formatPrice(limit)}
                checked={filters.budget === limit}
                onPick={() => setFilter('budget', limit)}
              />
            ))}
          </div>
        </div>
        {sortable && (
          <div class="grp" role="radiogroup" aria-labelledby="g-sort">
            <span class="glabel" id="g-sort">
              Kolejność
            </span>
            <div class="opts">
              {sortOptions.map(option => (
                <Choice
                  key={option.key}
                  name="sort"
                  value={option.key}
                  label={option.label}
                  checked={sort === option.key}
                  onPick={() => setSort(option.key)}
                />
              ))}
            </div>
          </div>
        )}
        <p class="count" role="status" aria-live="polite">
          {countLabel(shown.length, offers.length)}
        </p>
      </form>
      {shown.length > 0 ? (
        <ul class="index">
          {shown.map(offer => (
            <OfferRow
              key={offer.slug}
              offer={offer}
              pressed={slugs.includes(offer.slug)}
              onToggle={toggle}
            />
          ))}
        </ul>
      ) : (
        <div class="empty">
          <p>
            Nic takiego dziś nie mamy. Zadzwoń pod <a href={business.phoneHref}>{business.phone}</a>
            , zapiszemy Cię.
          </p>
          <button type="button" class="u-link-btn" onClick={() => setFilters(emptyFilters)}>
            Pokaż wszystkie oferty
          </button>
        </div>
      )}
    </>
  );
};

export default OffersBrowser;
