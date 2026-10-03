import { useFavourites } from '../lib/use-favourites';
import { Icon } from './Icon';

interface Props {
  slug: string;
  street: string;
}

export const FavouriteButton = ({ slug, street }: Props) => {
  const { slugs, toggle } = useFavourites();
  const saved = slugs.includes(slug);
  return (
    <div class="favourite">
      <button
        type="button"
        class={saved ? 'btn btn-saved' : 'btn'}
        aria-pressed={saved}
        onClick={() => toggle(slug)}>
        <Icon name="heart" size={20} />
        <span>{saved ? 'Zapisane w ulubionych' : 'Zapisz w ulubionych'}</span>
      </button>
      <p class="visually-hidden" role="status">
        {saved ? `Zapisano w ulubionych: ${street}.` : ''}
      </p>
    </div>
  );
};

export default FavouriteButton;
