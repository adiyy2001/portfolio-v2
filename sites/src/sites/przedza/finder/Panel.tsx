import { link } from '../../../shared/link';
import { ceilingText, exposureText, floorName } from '../building';
import {
  flatCode,
  flatPath,
  formatArea,
  formatPrice,
  formatPricePerM2,
  roomsLabel,
  statusLabel,
} from '../flats';
import { outdoorText } from '../outdoor';
import type { Flat } from '../types';

export default function Panel({ flat }: { flat: Flat | undefined }) {
  if (!flat) {
    return (
      <section class="panel panel--empty" aria-label="Wybrane mieszkanie">
        <p class="panel__hint">
          Wskaż okno na elewacji albo wiersz na liście, żeby zobaczyć mieszkanie.
        </p>
      </section>
    );
  }

  return (
    <section class="panel" aria-labelledby="panel-title">
      <div class="panel__head">
        <p class="label">Wybrane mieszkanie</p>
        <span class="status" data-status={flat.status}>
          {statusLabel[flat.status]}
        </span>
      </div>
      <div class="panel__name">
        <h3 class="panel__title" id="panel-title">
          {flatCode(flat)}
        </h3>
        <p class="panel__lead num">
          {roomsLabel(flat.rooms)}, {formatArea(flat.area)}
        </p>
      </div>
      <dl class="panel__facts">
        <div>
          <dt>Piętro</dt>
          <dd>{floorName(flat.floor)}</dd>
        </div>
        <div>
          <dt>Wysokość</dt>
          <dd class="num">{ceilingText(flat.floor)}</dd>
        </div>
        <div>
          <dt>Ekspozycja</dt>
          <dd>{exposureText(flat.column)}</dd>
        </div>
        <div>
          <dt>Na zewnątrz</dt>
          <dd class="num">{outdoorText(flat)}</dd>
        </div>
      </dl>
      <div class="panel__buy">
        <p class="panel__price num">
          {flat.status === 'sold' ? (
            <span class="panel__sold">Mieszkanie sprzedane</span>
          ) : (
            <>
              <strong>{formatPrice(flat.price)}</strong>
              <span>{formatPricePerM2(flat)}</span>
            </>
          )}
        </p>
        <a class="btn btn--primary btn--arrow" href={link(flatPath(flat))}>
          {flat.status === 'sold' ? 'Znajdź podobne' : 'Zobacz mieszkanie'}
        </a>
      </div>
    </section>
  );
}
