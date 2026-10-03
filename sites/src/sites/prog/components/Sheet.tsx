import { link } from '../../../shared/link';
import { districtById } from '../data/districts';
import { extraLabel, transactionLabel, typeLabel } from '../data/labels';
import type { ListingCard } from '../data/types';
import { Facade } from '../facade/Facade';
import {
  floorLabel,
  formatArea,
  formatDecimal,
  formatMonthlyPrice,
  formatPrice,
  roomsLabel,
} from '../lib/format';
import { pricePerSquareMeter } from '../lib/price';
import { SaveButton } from './SaveButton';

interface Props {
  card: ListingCard;
  saved?: boolean;
  onToggleSave?: (slug: string) => void;
  active?: boolean;
  onActivate?: (slug: string | null) => void;
  headingLevel?: 2 | 3;
}

export const offerHref = (slug: string): string => link(`/prog/oferty/${slug}/`);

export const placeLine = (card: ListingCard): string =>
  `${typeLabel[card.type]}, ${districtById(card.district).name}`;

export const Sheet = ({
  card,
  saved,
  onToggleSave,
  active = false,
  onActivate,
  headingLevel = 3,
}: Props) => {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const isSale = card.transaction === 'sprzedaz';
  const facts = [
    roomsLabel(card.rooms),
    formatArea(card.area),
    card.type === 'dom' && card.plotArea
      ? `działka ${formatArea(card.plotArea)}`
      : floorLabel(card.floor),
  ];
  const extras = card.extras.slice(0, 3);
  return (
    <article
      class={active ? 'sheet is-active' : 'sheet'}
      data-slug={card.slug}
      onMouseEnter={onActivate ? () => onActivate(card.slug) : undefined}
      onMouseLeave={onActivate ? () => onActivate(null) : undefined}
      onFocusIn={onActivate ? () => onActivate(card.slug) : undefined}
      onFocusOut={onActivate ? () => onActivate(null) : undefined}>
      <div class="sheet-art">
        <span class={isSale ? 'tag tag-sale' : 'tag'}>{transactionLabel[card.transaction]}</span>
        <Facade spec={card.facade} />
      </div>
      {onToggleSave && (
        <SaveButton
          class="sheet-save"
          saved={saved === true}
          onToggle={() => onToggleSave(card.slug)}
          label={
            saved ? `Usuń z ulubionych: ${card.street}` : `Zapisz w ulubionych: ${card.street}`
          }
        />
      )}
      <div class="sheet-body">
        <p class="sheet-price">
          {isSale ? formatPrice(card.price) : formatMonthlyPrice(card.price)}
          {isSale && (
            <small>{formatDecimal(pricePerSquareMeter(card.price, card.area), 0)} zł/m²</small>
          )}
        </p>
        <Heading class="sheet-title">
          <a href={offerHref(card.slug)}>{card.street}</a>
        </Heading>
        <p class="sheet-place">{placeLine(card)}</p>
        <ul class="sheet-facts">
          {facts.map(fact => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        {extras.length > 0 && (
          <ul class="sheet-extras" aria-label="Udogodnienia">
            {extras.map(extra => (
              <li key={extra}>{extraLabel[extra]}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};
