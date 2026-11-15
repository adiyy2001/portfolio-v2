import { link } from '../../../shared/link';
import { useFavourites } from '../lib/use-favourites';

interface Props {
  current: boolean;
}

export const FavouritesLink = ({ current }: Props) => {
  const { slugs, ready } = useFavourites();
  return (
    <a
      class="fav-link"
      href={link('/klamka/ulubione/')}
      aria-current={current ? 'page' : undefined}>
      Ulubione
      {ready && slugs.length > 0 && <span class="fav-count">{slugs.length}</span>}
    </a>
  );
};

export default FavouritesLink;
