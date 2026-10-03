import { useEffect, useMemo, useState } from 'preact/hooks';
import { flats } from '../data';
import {
  defaultState,
  filterAndSort,
  hasFilters,
  matchesFilters,
  parseQuery,
  resultText,
  sortOptions,
  toQuery,
  type FinderState,
  type SortKey,
} from '../finder';
import { flatCode, flatKey, formatArea, roomsLabel } from '../flats';
import Elevation, { WindowGlyph } from './Elevation';
import FlatTable from './FlatTable';
import Filters from './Filters';
import { tagAlign, tagAnchor } from './geometry';
import { firstInReadingOrder } from './navigation';
import Panel from './Panel';
import './finder.css';

const featuredKey = 206;

const legendItems = [
  { status: 'available', label: 'Wolne' },
  { status: 'reserved', label: 'Zarezerwowane' },
  { status: 'sold', label: 'Sprzedane' },
] as const;

const legendBox = { x: 1, y: 1, width: 30, height: 46 };

export default function Finder() {
  const [state, setState] = useState<FinderState>(defaultState);
  const [ready, setReady] = useState(false);
  const [selectedKey, setSelectedKey] = useState<number | undefined>(featuredKey);
  const [tabStop, setTabStop] = useState<number | undefined>(undefined);

  useEffect(() => {
    setState(parseQuery(window.location.search));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const { pathname, hash } = window.location;
    window.history.replaceState(null, '', `${pathname}${toQuery(state)}${hash}`);
  }, [state, ready]);

  const rows = useMemo(() => filterAndSort(flats, state), [state]);
  const matchingList = useMemo(() => flats.filter(flat => matchesFilters(flat, state)), [state]);
  const matching = useMemo(() => new Set(matchingList.map(flatKey)), [matchingList]);

  const selectedFlat = matchingList.find(flat => flatKey(flat) === selectedKey);
  const tabStopFlat =
    matchingList.find(flat => flatKey(flat) === tabStop) ?? firstInReadingOrder(matchingList);

  const select = (key: number | undefined) => {
    if (key !== undefined) setSelectedKey(key);
  };

  const focusFlat = (key: number | undefined) => {
    if (key === undefined) return;
    setTabStop(key);
    setSelectedKey(key);
  };

  const filtered = hasFilters(state);

  return (
    <>
      <div class="finder">
        <div class="finder__controls">
          <Filters state={state} onChange={setState} />
          <div class="finder__summary">
            <p class="finder__count" role="status">
              {resultText(rows.length, flats.length)}
            </p>
            {filtered && (
              <button type="button" class="link-button" onClick={() => setState(defaultState)}>
                Wyczyść filtry
              </button>
            )}
          </div>
        </div>
        <figure class="finder__drawing">
          <a class="finder__skip" href="#lista">
            Pomiń elewację i przejdź do listy mieszkań
          </a>
          <div class="finder__stage">
            <Elevation
              list={flats}
              matching={matching}
              selectedKey={selectedFlat ? flatKey(selectedFlat) : undefined}
              tabStopKey={tabStopFlat ? flatKey(tabStopFlat) : undefined}
              onHover={select}
              onFocusFlat={focusFlat}
              onTouchSelect={select}
            />
            {selectedFlat && (
              <div
                class="tag"
                aria-hidden="true"
                data-align={tagAlign(selectedFlat.column)}
                style={`--x:${tagAnchor(selectedFlat).x}%;--y:${tagAnchor(selectedFlat).y}%`}>
                <strong>{flatCode(selectedFlat)}</strong>
                <span class="num">
                  {roomsLabel(selectedFlat.rooms)}, {formatArea(selectedFlat.area)}
                </span>
              </div>
            )}
          </div>
          <figcaption class="finder__legend">
            <ul>
              {legendItems.map(item => (
                <li>
                  <svg
                    viewBox="0 0 32 48"
                    width="16"
                    height="24"
                    aria-hidden="true"
                    focusable="false">
                    <g class="win" data-status={item.status} data-match="true">
                      <WindowGlyph flat={{ rooms: 3, status: item.status }} box={legendBox} />
                    </g>
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>
            <p>Wskaż okno, żeby zobaczyć mieszkanie. Liczba szyb w oknie to liczba pokoi.</p>
          </figcaption>
        </figure>
        <div class="finder__panel">
          <Panel flat={selectedFlat} />
        </div>
      </div>

      <section class="list" id="lista" aria-labelledby="lista-title">
        <div class="list__head">
          <h2 id="lista-title" class="list__title">
            Wszystkie mieszkania
          </h2>
          <div class="field list__sort">
            <label class="field__label" for="sortowanie">
              Sortuj
            </label>
            <select
              id="sortowanie"
              value={state.sort}
              onChange={event =>
                setState({ ...state, sort: event.currentTarget.value as SortKey })
              }>
              {sortOptions.map(option => (
                <option value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        {rows.length > 0 ? (
          <FlatTable
            rows={rows}
            selectedKey={selectedFlat ? flatKey(selectedFlat) : undefined}
            onHover={select}
            onFocusFlat={focusFlat}
          />
        ) : (
          <div class="list__empty">
            <p>Żadne mieszkanie nie pasuje do tych filtrów. Zmień liczbę pokoi lub piętro.</p>
            <button type="button" class="btn" onClick={() => setState(defaultState)}>
              Wyczyść filtry
            </button>
          </div>
        )}
      </section>
    </>
  );
}
