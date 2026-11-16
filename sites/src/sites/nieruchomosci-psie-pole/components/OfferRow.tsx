import { link } from '../../../shared/link';
import { agents } from '../data/agents';
import type { Offer } from '../data/offers';
import { factsLine, formatPrice, formatPricePerM2, offerPath, placeLine } from '../lib/format';
import { offerImageSet } from '../lib/images';
import FavButton from './FavButton';

interface Props {
  offer: Offer;
  pressed: boolean;
  onToggle: (slug: string) => void;
}

const rowSizes = '(max-width: 899px) 46vw, (max-width: 1100px) 46vw, 31vw';

export const OfferRow = ({ offer, pressed, onToggle }: Props) => {
  const agent = agents[offer.agent];
  const image = offerImageSet(offer.image);
  return (
    <li class="row" id={`nr-${offer.number}`}>
      <figure>
        <img
          src={image.src}
          srcset={image.srcset}
          sizes={rowSizes}
          width={offer.image.width}
          height={offer.image.height}
          alt={offer.image.alt}
          loading="lazy"
          decoding="async"
          style={offer.image.position ? { objectPosition: offer.image.position } : undefined}
        />
      </figure>
      <div class="row-text">
        <span class="no">Nr {offer.number}</span>
        <h3>
          <a class="row-link" href={link(offerPath(offer))}>
            {placeLine(offer)}
          </a>
        </h3>
        <p class="facts">{factsLine(offer)}</p>
        <p class="row-price">
          <strong>{formatPrice(offer.priceZl)}</strong> <span>{formatPricePerM2(offer)}</span>
        </p>
        <a class="row-call" href={agent.phoneHref}>
          Zapytaj o ofertę przy {offer.streetLocative}
        </a>{' '}
        <span class="row-who">Prowadzi {agent.name}</span>{' '}
        <FavButton pressed={pressed} street={offer.street} onToggle={() => onToggle(offer.slug)} />
      </div>
    </li>
  );
};

export default OfferRow;
