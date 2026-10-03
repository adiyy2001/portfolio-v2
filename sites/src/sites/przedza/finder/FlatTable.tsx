import { link } from '../../../shared/link';
import { floorName } from '../building';
import {
  flatCode,
  flatKey,
  flatPath,
  formatArea,
  formatPrice,
  formatPricePerM2,
  roomsLabel,
  statusLabel,
} from '../flats';
import { outdoorText } from '../outdoor';
import type { Flat } from '../types';

interface FlatTableProps {
  rows: readonly Flat[];
  selectedKey: number | undefined;
  onHover: (key: number | undefined) => void;
  onFocusFlat: (key: number | undefined) => void;
}

export default function FlatTable({ rows, selectedKey, onHover, onFocusFlat }: FlatTableProps) {
  return (
    <table class="flats" role="table">
      <caption class="visually-hidden">Lista mieszkań z ceną, powierzchnią i statusem</caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">
            Mieszkanie
          </th>
          <th role="columnheader" scope="col">
            Pokoje
          </th>
          <th role="columnheader" scope="col">
            Powierzchnia
          </th>
          <th role="columnheader" scope="col">
            Piętro
          </th>
          <th role="columnheader" scope="col">
            Na zewnątrz
          </th>
          <th role="columnheader" scope="col">
            Status
          </th>
          <th role="columnheader" scope="col">
            Cena
          </th>
          <th role="columnheader" scope="col">
            Cena za m²
          </th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        {rows.map(flat => {
          const key = flatKey(flat);
          return (
            <tr
              role="row"
              data-status={flat.status}
              data-selected={key === selectedKey}
              onPointerEnter={event => {
                if (event.pointerType !== 'touch') onHover(key);
              }}
              onPointerLeave={() => onHover(undefined)}
              onFocusIn={() => onFocusFlat(key)}
              onFocusOut={() => onFocusFlat(undefined)}>
              <th role="rowheader" scope="row" class="flats__code">
                <a href={link(flatPath(flat))}>{flatCode(flat)}</a>
              </th>
              <td role="cell" class="flats__rooms">
                {roomsLabel(flat.rooms)}
              </td>
              <td role="cell" class="flats__area num">
                {formatArea(flat.area)}
              </td>
              <td role="cell" class="flats__floor">
                {floorName(flat.floor)}
              </td>
              <td role="cell" class="flats__outdoor num" data-empty={!flat.outdoor}>
                {outdoorText(flat)}
              </td>
              <td role="cell" class="flats__status">
                <span class="status" data-status={flat.status}>
                  {statusLabel[flat.status]}
                </span>
              </td>
              <td role="cell" class="flats__price num">
                {flat.status === 'sold' ? (
                  <span class="muted">cena niedostępna</span>
                ) : (
                  formatPrice(flat.price)
                )}
              </td>
              <td role="cell" class="flats__per num">
                {flat.status === 'sold' ? '' : formatPricePerM2(flat)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
