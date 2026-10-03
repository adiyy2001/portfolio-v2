import { Icon } from './Icon';

interface Props {
  saved: boolean;
  onToggle: () => void;
  label: string;
  class?: string;
}

export const SaveButton = ({ saved, onToggle, label, class: className }: Props) => (
  <button
    type="button"
    class={className ? `save-button ${className}` : 'save-button'}
    aria-pressed={saved}
    aria-label={label}
    onClick={onToggle}>
    <Icon name="heart" size={22} />
  </button>
);
