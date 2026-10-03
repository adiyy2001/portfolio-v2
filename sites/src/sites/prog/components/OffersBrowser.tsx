import type { ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { districts, districtIds } from '../data/districts';
import { cards } from '../data/listings';
import {
  extraLabel,
  extraOrder,
  floorBandLabel,
  sortLabel,
  transactionLabel,
  typeLabel,
} from '../data/labels';
import type { DistrictId, Extra, PropertyType, Transaction } from '../data/types';
import {
  countActiveFilters,
  countByDistrict,
  defaultFilters,
  filterCards,
  maxRoomsFilter,
  parseAmount,
  toggleInOrder,
  type Filters,
  type FloorBand,
  type SortKey,
} from '../lib/filters';
import {
  formatArea,
  formatMonthlyPrice,
  formatPrice,
  offersLabel,
  roomsLabel,
} from '../lib/format';
import { parseFilters, serializeFilters } from '../lib/url-state';
import { useFavourites } from '../lib/use-favourites';
import { AmountField, CheckOption, Choice, FilterDisclosure, FilterGroup } from './filter-controls';
import { Icon } from './Icon';
import { MapPins } from './MapPins';
import { Sheet, offerHref, placeLine } from './Sheet';

type View = 'karty' | 'mapa';

const floorBands: readonly FloorBand[] = ['parter', 'niskie', 'srednie', 'wysokie'];
const roomOptions = [1, 2, 3, 4, maxRoomsFilter];
const sortKeys = Object.keys(sortLabel) as SortKey[];

const readView = (search: string): View =>
  new URLSearchParams(search).get('widok') === 'mapa' ? 'mapa' : 'karty';

const buildQuery = (filters: Filters, view: View): string => {
  const base = serializeFilters(filters);
  if (view !== 'mapa') return base;
  return base ? `${base}&widok=mapa` : 'widok=mapa';
};

interface Props {
  children?: ComponentChildren;
}

export default function OffersBrowser({ children }: Props) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [view, setView] = useState<View>('karty');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const favourites = useFavourites();
  const panelToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFilters(parseFilters(window.location.search));
    setView(readView(window.location.search));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const query = buildQuery(filters, view);
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, [filters, view, mounted]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPanelOpen(false);
      panelToggle.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const results = useMemo(() => filterCards(cards, filters), [filters]);
  const districtCounts = useMemo(() => countByDistrict(cards, filters), [filters]);
  const activeCount = countActiveFilters(filters);
  const hasTransaction = filters.transaction !== null;
  const priceUnit = filters.transaction === 'wynajem' ? 'zł/mies.' : 'zł';
  const pricePlaceholder = filters.transaction === 'wynajem' ? '2 500' : '600 000';

  const change = (changes: Partial<Filters>) => setFilters(current => ({ ...current, ...changes }));

  const setTransaction = (transaction: Transaction | null) =>
    change({ transaction, priceMin: null, priceMax: null });

  const setAmount = (
    key: 'priceMin' | 'priceMax' | 'areaMin' | 'areaMax',
    input: HTMLInputElement,
  ) => {
    const text = input.value;
    if (text.trim() === '') {
      change({ [key]: null });
      return;
    }
    const amount = parseAmount(text);
    if (amount === null) {
      const current = filters[key];
      input.value = current === null ? '' : String(current);
      return;
    }
    change({ [key]: amount });
  };

  const emptyFilters = countActiveFilters(filters) === 0;
  const resetFilters = () => setFilters({ ...defaultFilters, sort: filters.sort });

  const resultLabel = `Wyniki: ${offersLabel(results.length)} z ${cards.length}`;

  return (
    <div class="browser">
      <div class="browser-bar">
        <button
          ref={panelToggle}
          type="button"
          class="btn btn-quiet filters-toggle"
          aria-expanded={panelOpen}
          aria-controls="filters-panel"
          onClick={() => setPanelOpen(open => !open)}>
          <Icon name="filter" size={18} />
          Filtry{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>

      <form
        id="filters-panel"
        class={panelOpen ? 'filters is-open' : 'filters'}
        aria-label="Filtry ofert"
        onSubmit={event => event.preventDefault()}>
        <div class="filters-head">
          <h2 class="filters-title">Filtry</h2>
          <button type="button" class="link-button" onClick={resetFilters} disabled={emptyFilters}>
            Wyczyść
          </button>
        </div>
        <a class="skip-results" href="#wyniki">
          Przejdź do wyników
        </a>

        <FilterGroup legend="Transakcja">
          <div class="choice-row">
            <Choice
              radio
              name="transakcja"
              label="Obie"
              checked={filters.transaction === null}
              onChange={() => setTransaction(null)}
            />
            {(['sprzedaz', 'wynajem'] as const).map(value => (
              <Choice
                radio
                key={value}
                name="transakcja"
                label={transactionLabel[value]}
                checked={filters.transaction === value}
                onChange={() => setTransaction(value)}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup legend="Rodzaj">
          <div class="choice-row">
            <Choice
              radio
              name="typ"
              label="Oba"
              checked={filters.type === null}
              onChange={() => change({ type: null })}
            />
            {(['mieszkanie', 'dom'] as const satisfies readonly PropertyType[]).map(value => (
              <Choice
                radio
                key={value}
                name="typ"
                label={typeLabel[value]}
                checked={filters.type === value}
                onChange={() => change({ type: value })}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup legend="Pokoje">
          <div class="choice-row">
            {roomOptions.map(count => (
              <Choice
                key={count}
                name="pokoje"
                label={count >= maxRoomsFilter ? `${count}+` : String(count)}
                checked={filters.rooms.includes(count)}
                onChange={() => change({ rooms: toggleInOrder(filters.rooms, count, roomOptions) })}
              />
            ))}
          </div>
        </FilterGroup>

        {hasTransaction ? (
          <FilterGroup legend={filters.transaction === 'wynajem' ? 'Czynsz najmu' : 'Cena'}>
            <div class="amount-pair">
              <AmountField
                id="price-min"
                label="Od"
                value={filters.priceMin}
                unit={priceUnit}
                placeholder={pricePlaceholder}
                onChange={input => setAmount('priceMin', input)}
              />
              <AmountField
                id="price-max"
                label="Do"
                value={filters.priceMax}
                unit={priceUnit}
                placeholder="bez limitu"
                onChange={input => setAmount('priceMax', input)}
              />
            </div>
          </FilterGroup>
        ) : (
          <div class="filter-group">
            <p class="field-label">Cena</p>
            <p class="field-hint">
              Wybierz sprzedaż lub wynajem, żeby ustawić cenę. Ceny sprzedaży i najmu różnią się o
              rząd wielkości.
            </p>
          </div>
        )}

        <FilterGroup legend="Powierzchnia">
          <div class="amount-pair">
            <AmountField
              id="area-min"
              label="Od"
              value={filters.areaMin}
              unit="m²"
              placeholder="30"
              onChange={input => setAmount('areaMin', input)}
            />
            <AmountField
              id="area-max"
              label="Do"
              value={filters.areaMax}
              unit="m²"
              placeholder="bez limitu"
              onChange={input => setAmount('areaMax', input)}
            />
          </div>
        </FilterGroup>

        <FilterDisclosure legend="Dzielnica" selected={filters.districts.length}>
          <div class="district-list">
            {districts
              .filter(district => cards.some(card => card.district === district.id))
              .map(district => {
                const checked = filters.districts.includes(district.id);
                const count = districtCounts.get(district.id) ?? 0;
                return (
                  <CheckOption
                    key={district.id}
                    name="dzielnica"
                    label={district.name}
                    count={count}
                    checked={checked}
                    disabled={count === 0 && !checked}
                    onChange={() =>
                      change({
                        districts: toggleInOrder<DistrictId>(
                          filters.districts,
                          district.id,
                          districtIds,
                        ),
                      })
                    }
                  />
                );
              })}
          </div>
        </FilterDisclosure>

        <FilterDisclosure legend="Piętro" selected={filters.floors.length}>
          <div class="check-list">
            {floorBands.map(band => (
              <CheckOption
                key={band}
                name="pietro"
                label={floorBandLabel[band]}
                checked={filters.floors.includes(band)}
                onChange={() => change({ floors: toggleInOrder(filters.floors, band, floorBands) })}
              />
            ))}
          </div>
        </FilterDisclosure>

        <FilterDisclosure legend="Udogodnienia" selected={filters.extras.length}>
          <div class="check-list">
            {extraOrder.map((extra: Extra) => (
              <CheckOption
                key={extra}
                name="dodatki"
                label={extraLabel[extra]}
                checked={filters.extras.includes(extra)}
                onChange={() =>
                  change({ extras: toggleInOrder(filters.extras, extra, extraOrder) })
                }
              />
            ))}
          </div>
        </FilterDisclosure>

        <div class="filters-apply">
          <button
            type="button"
            class="btn btn-primary btn-block"
            onClick={() => setPanelOpen(false)}>
            Pokaż {offersLabel(results.length)}
          </button>
        </div>
      </form>

      <div class="browser-main" id="wyniki" tabIndex={-1}>
        <div class="toolbar">
          <p class="result-count" role="status" aria-live="polite" aria-atomic="true">
            {resultLabel}
          </p>
          <div class="toolbar-controls">
            <div class="field field-inline">
              <label for="sort">Sortuj</label>
              <select
                class="select"
                id="sort"
                value={filters.sort}
                onChange={event => change({ sort: event.currentTarget.value as SortKey })}>
                {sortKeys.map(key => (
                  <option key={key} value={key}>
                    {sortLabel[key]}
                  </option>
                ))}
              </select>
            </div>
            <div class="view-toggle" role="group" aria-label="Widok wyników">
              <button
                type="button"
                class="view-button"
                aria-pressed={view === 'karty'}
                onClick={() => setView('karty')}>
                <Icon name="list" size={18} />
                Karty
              </button>
              <button
                type="button"
                class="view-button"
                aria-pressed={view === 'mapa'}
                onClick={() => setView('mapa')}>
                <Icon name="map" size={18} />
                Mapa
              </button>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div class="empty-state">
            <h2>Nic nie pasuje do tych filtrów</h2>
            <p>
              Spróbuj poszerzyć przedział ceny albo odznaczyć część dzielnic. Jeśli szukasz czegoś
              konkretnego, napisz do nas, bo nie wszystko, o co pytają klienci, od razu trafia na
              stronę.
            </p>
            <button type="button" class="btn btn-primary" onClick={resetFilters}>
              Wyczyść filtry
            </button>
          </div>
        ) : (
          view === 'karty' && (
            <ul class="sheet-grid results-grid">
              {results.map(card => (
                <li key={card.slug}>
                  <Sheet
                    card={card}
                    headingLevel={2}
                    saved={favourites.slugs.includes(card.slug)}
                    onToggleSave={favourites.toggle}
                  />
                </li>
              ))}
            </ul>
          )
        )}

        <div class="map-view" hidden={view !== 'mapa'}>
          <figure class="map-figure">
            <div class="map">
              {children}
              {view === 'mapa' && (
                <MapPins cards={results} activeSlug={activeSlug} onActivate={setActiveSlug} />
              )}
            </div>
            <ul class="map-legend">
              <li>
                <span class="legend-pin" aria-hidden="true"></span>Sprzedaż
              </li>
              <li>
                <span class="legend-pin legend-pin-rent" aria-hidden="true"></span>Wynajem
              </li>
              <li>
                <span class="legend-pin legend-pin-area" aria-hidden="true"></span>Osiedle z ofertą
              </li>
            </ul>
            <figcaption class="map-caption">
              Uproszczona mapa Wrocławia. Pinezka stoi na ulicy oferty, nie pod numerem domu.
            </figcaption>
          </figure>
          {view === 'mapa' && results.length > 0 && (
            <ol class="result-rows" aria-label="Lista ofert z mapy">
              {results.map(card => {
                const isSale = card.transaction === 'sprzedaz';
                return (
                  <li
                    key={card.slug}
                    class={card.slug === activeSlug ? 'result-row is-active' : 'result-row'}
                    onMouseEnter={() => setActiveSlug(card.slug)}
                    onMouseLeave={() => setActiveSlug(null)}>
                    <a
                      href={offerHref(card.slug)}
                      onFocus={() => setActiveSlug(card.slug)}
                      onBlur={() => setActiveSlug(null)}>
                      <span class={isSale ? 'tag tag-sale' : 'tag'}>
                        {transactionLabel[card.transaction]}
                      </span>
                      <span class="row-main">
                        <strong>{card.street}</strong>
                        <span>{placeLine(card)}</span>
                      </span>
                      <span class="row-price">
                        {isSale ? formatPrice(card.price) : formatMonthlyPrice(card.price)}
                      </span>
                      <span class="row-facts">
                        {roomsLabel(card.rooms)}, {formatArea(card.area)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
