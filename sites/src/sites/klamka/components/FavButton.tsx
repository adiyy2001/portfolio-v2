interface Props {
  pressed: boolean;
  street: string;
  onToggle: () => void;
}

export const FavButton = ({ pressed, street, onToggle }: Props) => (
  <button
    type="button"
    class="fav-btn"
    aria-pressed={pressed ? 'true' : 'false'}
    onClick={onToggle}>
    <span class="fav-mark" aria-hidden="true"></span>
    <span>
      Ulubione<span class="vh"> {street}</span>
    </span>
  </button>
);

export default FavButton;
