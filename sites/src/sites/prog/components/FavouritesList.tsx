import { useMemo } from 'preact/hooks';
import { link } from '../../../shared/link';
import type { ListingCard } from '../data/types';
import { cheapestPerSquareMeter, compareRows } from '../lib/compare';
import { offersLabel } from '../lib/format';
import { useFavourites } from '../lib/use-favourites';
import { Sheet, offerHref } from './Sheet';

interface Props {
  cards: readonly ListingCard[];
}

export const FavouritesList = ({ cards }: Props) => {
  const { slugs, ready, toggle, clear } = useFavourites();
  const saved = useMemo(
    () =>
      slugs.flatMap(slug => {
        const card = cards.find(item => item.slug === slug);
        return card ? [card] : [];
      }),
    [slugs, cards],
  );
  const rows = useMemo(() => compareRows(saved), [saved]);
  const bestSlug = useMemo(() => cheapestPerSquareMeter(saved), [saved]);

  if (!ready) {
    return (
      <p class="favourites-status" role="status">
        Wczytuję zapisane oferty.
      </p>
    );
  }

  if (saved.length === 0) {
    return (
      <div class="favourites-empty">
        <p class="lead">Nie zapisałeś jeszcze żadnej oferty.</p>
        <p>
          Przy każdej ofercie jest serduszko. Zapisane oferty trafią tutaj i zostaną w tej
          przeglądarce, bo nie mamy kont ani serwera.
        </p>
        <a class="btn btn-primary" href={link('/prog/oferty/')}>
          Przejrzyj oferty
        </a>
      </div>
    );
  }

  return (
    <div class="favourites">
      <div class="favourites-bar">
        <p role="status">Zapisane: {offersLabel(saved.length)}.</p>
        <button type="button" class="btn btn-quiet" onClick={clear}>
          Usuń wszystkie
        </button>
      </div>
      <h2 class="visually-hidden">Zapisane oferty</h2>
      <div class="sheet-grid favourites-grid">
        {saved.map(card => (
          <Sheet key={card.slug} card={card} saved onToggleSave={toggle} />
        ))}
        {saved.length < 3 && (
          <a class="favourites-add" href={link('/prog/oferty/')}>
            <span class="favourites-add-mark" aria-hidden="true">
              +
            </span>
            <span class="favourites-add-text">
              Dodaj kolejną ofertę
              <small>
                {saved.length === 1
                  ? 'Przy dwóch zapisanych ofertach pokażemy porównanie.'
                  : 'Porównanie obejmie też trzecią ofertę.'}
              </small>
            </span>
          </a>
        )}
      </div>
      {saved.length > 1 && (
        <section class="compare" aria-labelledby="compare-title">
          <h2 id="compare-title">Porównanie</h2>
          <div class="compare-scroll" role="region" aria-label="Porównanie ofert" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <td></td>
                  {saved.map(card => (
                    <th scope="col" key={card.slug}>
                      <a href={offerHref(card.slug)}>{card.street}</a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, index) => {
                      const card = saved[index];
                      const best = row.label === 'Cena za m²' && card?.slug === bestSlug;
                      return (
                        <td key={card?.slug ?? index} class={best ? 'is-best' : undefined}>
                          {value}
                          {best && <span class="compare-flag">najniższa za m²</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default FavouritesList;
