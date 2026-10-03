import { useEffect, useState } from 'preact/hooks';
import { coffees } from '../data/catalog';
import {
  activeFilterCount,
  clearFilters,
  defaultFilters,
  filterGroups,
  parseFilters,
  resultMessage,
  serializeFilters,
  sortOptions,
  toggleFilter,
  visibleCoffees,
} from '../lib/filters';
import type { FilterGroup, FilterState, SortId } from '../lib/filters';
import { ProductTile } from '../components/ProductTile';

export const ShopList = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setFilters(parseFilters(window.location.search));
    const onPop = () => setFilters(parseFilters(window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const update = (next: FilterState): void => {
    setFilters(next);
    window.history.replaceState(null, '', `${window.location.pathname}${serializeFilters(next)}`);
  };

  const shown = visibleCoffees(coffees, filters);
  const active = activeFilterCount(filters);

  return (
    <div class="shop">
      <section class="filters" aria-labelledby="filters-title">
        <h2 id="filters-title" class="sr-only">
          Filtry
        </h2>
        <button
          type="button"
          class="filters__toggle"
          aria-expanded={panelOpen}
          aria-controls="filters-body"
          onClick={() => setPanelOpen(!panelOpen)}>
          <span>Filtry</span>
          {active > 0 && (
            <span class="filters__count" aria-label={`Aktywne filtry: ${active}`}>
              {active}
            </span>
          )}
        </button>
        <div class="filters__body" id="filters-body" hidden={!panelOpen}>
          {filterGroups.map(group => (
            <fieldset class="fgroup" key={group.id}>
              <legend>{group.label}</legend>
              <div class="chips">
                {group.options.map(option => (
                  <label class="chip" key={option.value}>
                    <input
                      type="checkbox"
                      checked={(filters[group.id as FilterGroup] as string[]).includes(
                        option.value,
                      )}
                      onChange={() => update(toggleFilter(filters, group.id, option.value))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>
      <div class="shop-meta">
        <p class="shop-meta__count" role="status" aria-live="polite">
          {resultMessage(shown.length, coffees.length)}
        </p>
        {active > 0 && (
          <button
            type="button"
            class="btn btn--ghost shop-clear"
            onClick={() => update(clearFilters(filters))}>
            Wyczyść filtry
          </button>
        )}
        <div class="field">
          <label for="sort">Sortowanie</label>
          <select
            id="sort"
            class="select"
            value={filters.sort}
            onChange={event => update({ ...filters, sort: event.currentTarget.value as SortId })}>
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {shown.length === 0 ? (
        <div class="shop-empty">
          <p>Nic tu nie ma.</p>
          <button type="button" class="btn btn--lime" onClick={() => update(clearFilters(filters))}>
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <ul class="wall">
          {shown.map(coffee => (
            <li key={coffee.id}>
              <ProductTile product={coffee} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShopList;
