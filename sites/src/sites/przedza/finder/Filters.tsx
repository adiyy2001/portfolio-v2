import { floorName } from '../building';
import { floors as allFloors } from '../building';
import { toggleValue, type FinderState } from '../finder';
import type { Floor, Rooms } from '../types';

interface FiltersProps {
  state: FinderState;
  onChange: (next: FinderState) => void;
}

const roomOptions: readonly Rooms[] = [2, 3, 4];

function Chip({
  label,
  hint,
  checked,
  onToggle,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label class="chip">
      <input type="checkbox" checked={checked} onChange={onToggle} aria-label={hint} />
      <span aria-hidden="true">{label}</span>
    </label>
  );
}

export default function Filters({ state, onChange }: FiltersProps) {
  return (
    <form class="filters" onSubmit={event => event.preventDefault()}>
      <fieldset class="filters__group">
        <legend class="label">Pokoje</legend>
        <div class="filters__row">
          {roomOptions.map(rooms => (
            <Chip
              label={String(rooms)}
              hint={`${rooms} pokoje`}
              checked={state.rooms.includes(rooms)}
              onToggle={() => onChange({ ...state, rooms: toggleValue(state.rooms, rooms) })}
            />
          ))}
        </div>
      </fieldset>
      <fieldset class="filters__group">
        <legend class="label">Piętro</legend>
        <div class="filters__row">
          {allFloors.map((floor: Floor) => (
            <Chip
              label={floor === 0 ? 'parter' : String(floor)}
              hint={floorName(floor)}
              checked={state.floors.includes(floor)}
              onToggle={() => onChange({ ...state, floors: toggleValue(state.floors, floor) })}
            />
          ))}
        </div>
      </fieldset>
      <label class="tick">
        <input
          type="checkbox"
          checked={state.onlyAvailable}
          onChange={() => onChange({ ...state, onlyAvailable: !state.onlyAvailable })}
        />
        <span>Tylko wolne mieszkania</span>
      </label>
    </form>
  );
}
