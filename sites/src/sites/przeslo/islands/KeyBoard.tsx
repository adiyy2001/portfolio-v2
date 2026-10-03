import type { PickerText } from '../content/picker';
import { roomsOfType } from '../data/rooms';
import type { RoomTypeId } from '../data/rooms';
import { typeAvailability } from '../lib/availability';
import type { Day } from '../lib/dates';

export interface BoardStay {
  arrival: Day;
  nights: number;
}

interface Props {
  text: PickerText;
  stay: BoardStay;
  guests: number;
  title: string;
  caption: string;
  headingLevel?: 2 | 3;
  highlight?: RoomTypeId | null;
  assigned?: number | null;
}

export const KeyBoard = ({
  text,
  stay,
  guests,
  title,
  caption,
  headingLevel = 3,
  highlight = null,
  assigned = null,
}: Props) => {
  const rows = typeAvailability(stay.arrival, stay.nights);
  const usable = rows.filter(row => row.type.capacity >= guests);
  const free = usable.reduce((sum, row) => sum + row.free.length, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const RowHeading = headingLevel === 2 ? 'h3' : 'h4';
  return (
    <section class="board" aria-labelledby="board-title">
      <Heading id="board-title">{title}</Heading>
      <p class="board-caption">{caption}</p>
      <p class="board-count" role="status">
        {text.board.freeCount(free, total)}
      </p>
      <div class="board-rows">
        {rows.map(row => {
          const fits = row.type.capacity >= guests;
          const freeNumbers = new Set(row.free.map(room => room.number));
          return (
            <div
              class="board-row"
              data-fits={fits ? 'true' : 'false'}
              data-highlight={highlight === row.type.id ? 'true' : undefined}
              key={row.type.id}>
              <div class="board-row-head">
                <RowHeading>{text.board.rowNames[row.type.id]}</RowHeading>
                <p>
                  {fits
                    ? text.board.rowCount(row.free.length, row.total)
                    : text.board.tooSmall(guests)}
                </p>
              </div>
              <ul class="hooks">
                {roomsOfType(row.type.id).map((room, index) => {
                  const hanging = fits && freeNumbers.has(room.number);
                  return (
                    <li
                      class="hook"
                      data-state={hanging ? 'free' : 'taken'}
                      data-yours={assigned === room.number ? 'true' : undefined}
                      style={{ '--delay': `${index * 25}ms` }}
                      key={`${room.number}-${hanging}`}>
                      <span class="hook-peg" aria-hidden="true" />
                      <span class="hook-tag">
                        <span aria-hidden="true">{room.number}</span>
                        <span class="visually-hidden">
                          {text.board.room} {room.number},{' '}
                          {hanging ? text.board.freeKey : text.board.takenKey}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <p class="board-explainer">{text.board.explainer}</p>
    </section>
  );
};
