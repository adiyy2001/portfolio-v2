import FavButton from '../components/FavButton';
import { useFavourites } from '../lib/use-favourites';

interface Props {
  slug: string;
  street: string;
}

export const OfferFavourite = ({ slug, street }: Props) => {
  const { slugs, toggle } = useFavourites();
  return <FavButton pressed={slugs.includes(slug)} street={street} onToggle={() => toggle(slug)} />;
};

export default OfferFavourite;
