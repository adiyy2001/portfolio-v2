import { link } from '../../../shared/link';
import OfferRow from '../components/OfferRow';
import { offers } from '../data/offers';
import { useFavourites } from '../lib/use-favourites';

export const FavouritesList = () => {
  const { slugs, ready, toggle, clear } = useFavourites();
  const saved = slugs
    .map(slug => offers.find(offer => offer.slug === slug))
    .filter((offer): offer is (typeof offers)[number] => offer !== undefined);

  if (!ready) {
    return <p class="fav-state">Wczytujemy zapisane oferty.</p>;
  }

  if (saved.length === 0) {
    return (
      <div class="fav-state">
        <p>Nie masz jeszcze zapisanych ofert. Przycisk „Ulubione” jest przy każdej ofercie.</p>
        <a class="u-link" href={link('/nieruchomosci-psie-pole/oferty/')}>
          Przejdź do katalogu ofert
        </a>
      </div>
    );
  }

  return (
    <>
      <div class="fav-bar">
        <p role="status" aria-live="polite">
          Zapisane oferty: {saved.length} z {offers.length}
        </p>
        <button type="button" class="u-link-btn" onClick={clear}>
          Wyczyść listę
        </button>
      </div>
      <ul class="index">
        {saved.map(offer => (
          <OfferRow key={offer.slug} offer={offer} pressed onToggle={toggle} />
        ))}
      </ul>
    </>
  );
};

export default FavouritesList;
