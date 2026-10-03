import { useRef } from 'preact/hooks';
import { link } from '../../../shared/link';
import { columnCount, floorName, floors } from '../building';
import {
  flatCode,
  flatKey,
  flatPath,
  formatArea,
  formatPrice,
  roomsLabel,
  statusLabel,
} from '../flats';
import type { Flat } from '../types';
import {
  bayWidth,
  cellBox,
  gateBox,
  groundY,
  panesOf,
  teethCount,
  toothPath,
  view,
  wallLeft,
  wallRight,
  wallTop,
  windowBox,
  floorY,
  floorHeight,
} from './geometry';
import { directionForKey, moveFocus } from './navigation';

export const windowLabel = (flat: Flat) => {
  const parts = [
    flatCode(flat),
    roomsLabel(flat.rooms),
    formatArea(flat.area),
    floorName(flat.floor),
    statusLabel[flat.status].toLowerCase(),
  ];
  if (flat.status !== 'sold') parts.push(formatPrice(flat.price));
  return parts.join(', ');
};

interface ElevationProps {
  list: readonly Flat[];
  matching: ReadonlySet<number>;
  selectedKey: number | undefined;
  tabStopKey: number | undefined;
  onHover: (key: number | undefined) => void;
  onFocusFlat: (key: number | undefined) => void;
  onTouchSelect: (key: number) => void;
}

const readingOrder = (list: readonly Flat[]) =>
  [...list].sort((a, b) => b.floor - a.floor || a.column - b.column);

export function WindowGlyph({
  flat,
  box,
}: {
  flat: Pick<Flat, 'rooms' | 'status'>;
  box: ReturnType<typeof windowBox>;
}) {
  const panes = panesOf(flat.rooms, box);
  const first = panes[0];
  return (
    <>
      <rect class="win__frame" x={box.x} y={box.y} width={box.width} height={box.height} />
      {panes.map(pane => (
        <rect class="win__pane" x={pane.x} y={pane.y} width={pane.width} height={pane.height} />
      ))}
      {flat.status !== 'available' && (
        <rect
          class="win__blinds"
          x={first.x}
          y={flat.status === 'sold' ? box.y + 2 : box.y + box.height / 2}
          width={box.width - 4}
          height={flat.status === 'sold' ? box.height - 4 : box.height / 2 - 2}
        />
      )}
    </>
  );
}

export default function Elevation({
  list,
  matching,
  selectedKey,
  tabStopKey,
  onHover,
  onFocusFlat,
  onTouchSelect,
}: ElevationProps) {
  const anchors = useRef(new Map<number, HTMLElement | SVGElement>());
  const touch = useRef<{ key: number; wasSelected: boolean } | undefined>(undefined);
  const ordered = readingOrder(list);
  const candidates = ordered.filter(flat => matching.has(flatKey(flat)));

  const handleKeyDown = (event: KeyboardEvent) => {
    const direction = directionForKey(event.key);
    if (!direction || tabStopKey === undefined) return;
    const from = list.find(flat => flatKey(flat) === tabStopKey);
    if (!from) return;
    event.preventDefault();
    const next = moveFocus(candidates, from, direction);
    if (next) anchors.current.get(flatKey(next))?.focus();
  };

  const levelMarks = floors.map(floor => (
    <text
      class="elevation__level"
      x={14}
      y={floorY(floor) + floorHeight / 2 + 3}
      text-anchor="middle">
      {floor === 0 ? 'P' : floor}
    </text>
  ));

  return (
    <svg
      class="elevation"
      viewBox={`0 0 ${view.width} ${view.height}`}
      role="group"
      aria-label="Elewacja wschodnia budynku. Każde okno to jedno mieszkanie. Strzałkami przechodzisz między oknami, Enter otwiera mieszkanie.">
      <defs>
        <pattern id="przedza-blinds" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect class="blinds-line" width="4" height="1.6" />
        </pattern>
        <pattern id="przedza-courses" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect class="course-line" y="5" width="6" height="1" />
        </pattern>
        <pattern
          id="przedza-ground"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)">
          <rect class="ground-line" width="1.6" height="8" />
        </pattern>
      </defs>

      <g aria-hidden="true">
        <rect
          class="elevation__wall"
          x={wallLeft}
          y={wallTop}
          width={wallRight - wallLeft}
          height={groundY - wallTop}
        />
        <rect
          class="elevation__courses"
          x={wallLeft}
          y={wallTop}
          width={wallRight - wallLeft}
          height={groundY - wallTop}
          fill="url(#przedza-courses)"
        />
        {Array.from({ length: columnCount + 1 }, (_, index) => (
          <rect
            class="elevation__pier"
            x={wallLeft + index * bayWidth - 3}
            y={wallTop}
            width={6}
            height={groundY - wallTop}
          />
        ))}
        {floors.slice(1).map(floor => (
          <rect
            class="elevation__belt"
            x={wallLeft}
            y={floorY(floor) + floorHeight - 1}
            width={wallRight - wallLeft}
            height={2}
          />
        ))}
        {Array.from({ length: teethCount }, (_, tooth) => (
          <path class="elevation__roof" d={toothPath(tooth)} />
        ))}
        <rect
          class="elevation__eave"
          x={wallLeft}
          y={wallTop - 3}
          width={wallRight - wallLeft}
          height={5}
        />
        <path
          class="elevation__chimney"
          d={`M${wallRight + 6} ${groundY}V30L${wallRight + 4} 30V16H${wallRight + 26}V30L${wallRight + 24} 30V${groundY}Z`}
        />
        <rect class="elevation__chimney-band" x={wallRight + 6} y={96} width={18} height={4} />
        <rect class="elevation__chimney-band" x={wallRight + 6} y={170} width={18} height={4} />
        <rect
          class="elevation__gate"
          x={gateBox.x}
          y={gateBox.y}
          width={gateBox.width}
          height={gateBox.height}
        />
        {Array.from({ length: 11 }, (_, index) => (
          <rect
            class="elevation__gate-bar"
            x={gateBox.x + 5 + index * 8.2}
            y={gateBox.y + 4}
            width={2}
            height={gateBox.height - 4}
          />
        ))}
        <rect
          class="elevation__ground"
          x={0}
          y={groundY}
          width={view.width}
          height={view.height - groundY}
          fill="url(#przedza-ground)"
        />
        <rect class="elevation__ground-line" x={0} y={groundY - 1} width={view.width} height={3} />
        {levelMarks}
      </g>

      <g onKeyDown={handleKeyDown}>
        {ordered.map(flat => {
          const key = flatKey(flat);
          const box = windowBox(flat);
          const cell = cellBox(flat);
          const matches = matching.has(key);
          const style = `--col:${flat.column - 1}`;
          const content = (
            <>
              <rect
                class="win__cell"
                x={cell.x}
                y={cell.y}
                width={cell.width}
                height={cell.height}
              />
              <WindowGlyph flat={flat} box={box} />
            </>
          );
          if (!matches) {
            return (
              <g
                class="win"
                data-status={flat.status}
                data-match="false"
                aria-hidden="true"
                style={style}>
                {content}
              </g>
            );
          }
          return (
            <g
              class="win"
              data-status={flat.status}
              data-match="true"
              data-selected={key === selectedKey}
              style={style}>
              <a
                href={link(flatPath(flat))}
                aria-label={windowLabel(flat)}
                tabIndex={key === tabStopKey ? 0 : -1}
                data-key={key}
                ref={node => {
                  if (node) anchors.current.set(key, node);
                  else anchors.current.delete(key);
                }}
                onFocus={() => onFocusFlat(key)}
                onBlur={() => onFocusFlat(undefined)}
                onPointerEnter={event => {
                  if (event.pointerType !== 'touch') onHover(key);
                }}
                onPointerLeave={event => {
                  if (event.pointerType !== 'touch') onHover(undefined);
                }}
                onPointerDown={event => {
                  touch.current =
                    event.pointerType === 'touch'
                      ? { key, wasSelected: key === selectedKey }
                      : undefined;
                }}
                onClick={event => {
                  const pending = touch.current;
                  touch.current = undefined;
                  if (pending && pending.key === key) {
                    onTouchSelect(key);
                    if (!pending.wasSelected) event.preventDefault();
                  }
                }}>
                {content}
              </a>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
