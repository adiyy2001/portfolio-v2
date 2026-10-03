import type { ListingCard } from '../data/types';
import { formatMonthlyPrice, formatPrice } from '../lib/format';
import { cityWindow, toPercent, type MapWindow } from '../lib/map-view';
import { pinSpot } from '../lib/pin-spots';
import { offerHref } from './Sheet';

interface Props {
  cards: readonly ListingCard[];
  activeSlug?: string | null;
  onActivate?: (slug: string | null) => void;
  view?: MapWindow;
}

export const MapPins = ({ cards, activeSlug = null, onActivate, view = cityWindow }: Props) => (
  <ul class="map-pins">
    {cards.map(card => {
      const spot = toPercent(pinSpot(card.slug, card.position), view);
      const isSale = card.transaction === 'sprzedaz';
      const price = isSale ? formatPrice(card.price) : formatMonthlyPrice(card.price);
      return (
        <li
          key={card.slug}
          class={card.slug === activeSlug ? 'map-pin is-active' : 'map-pin'}
          style={`left:${spot.left}%;top:${spot.top}%`}>
          <a
            href={offerHref(card.slug)}
            class={isSale ? 'pin pin-sale' : 'pin pin-rent'}
            aria-label={`${isSale ? 'Sprzedaż' : 'Wynajem'}: ${card.street}, ${price}`}
            onMouseEnter={onActivate ? () => onActivate(card.slug) : undefined}
            onMouseLeave={onActivate ? () => onActivate(null) : undefined}
            onFocus={onActivate ? () => onActivate(card.slug) : undefined}
            onBlur={onActivate ? () => onActivate(null) : undefined}>
            <svg width="28" height="34" viewBox="0 0 28 34" aria-hidden="true" focusable="false">
              <path class="pin-body" d="M2 2h24v24h-7.5L14 32l-4.5-6H2z" />
              <path class="pin-door" d="M10 20V10.5h8V20z" />
            </svg>
            <span class="pin-tip" aria-hidden="true">
              <strong>{card.street}</strong>
              {price}
            </span>
          </a>
        </li>
      );
    })}
  </ul>
);
