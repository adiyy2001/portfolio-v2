import { useRef, useState } from 'preact/hooks';
import { nudge, scatter, tidy } from './lib/scatter';
import type { Placement } from './lib/scatter';

interface Piece {
  id: string;
  name: string;
  width: number;
  height: number;
  svg: string;
}

interface Props {
  pieces: Piece[];
  area: { width: number; height: number };
}

interface Drag {
  id: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

const step = 12;
const bigStep = 36;

export default function StickerLaptop({ pieces, area }: Props) {
  const [round, setRound] = useState(0);
  const [placements, setPlacements] = useState<Placement[]>(() => scatter(pieces, area, 0));
  const [order, setOrder] = useState<string[]>(() => pieces.map(piece => piece.id));
  const [note, setNote] = useState('');
  const lid = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

  const pieceOf = (id: string) => pieces.find(piece => piece.id === id)!;
  const placementOf = (id: string) => placements.find(item => item.id === id)!;

  const update = (id: string, next: Placement) =>
    setPlacements(list => list.map(item => (item.id === id ? next : item)));

  const raise = (id: string) => setOrder(list => [...list.filter(item => item !== id), id]);

  const scale = () => {
    const box = lid.current?.getBoundingClientRect();
    return box && box.width > 0 ? area.width / box.width : 1;
  };

  const onPointerDown = (event: PointerEvent, id: string) => {
    const current = placementOf(id);
    drag.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    raise(id);
  };

  const onPointerMove = (event: PointerEvent, id: string) => {
    const active = drag.current;
    if (!active || active.id !== id) return;
    const factor = scale();
    const base = placementOf(id);
    const moved = nudge(
      { ...base, x: active.originX, y: active.originY },
      (event.clientX - active.startX) * factor,
      (event.clientY - active.startY) * factor,
      pieceOf(id),
      area,
    );
    update(id, { ...moved, x: Math.round(moved.x), y: Math.round(moved.y) });
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (event: KeyboardEvent, id: string) => {
    const amount = event.shiftKey ? bigStep : step;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-amount, 0],
      ArrowRight: [amount, 0],
      ArrowUp: [0, -amount],
      ArrowDown: [0, amount],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      update(id, nudge(placementOf(id), move[0], move[1], pieceOf(id), area));
      raise(id);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      raise(id);
      setNote(`Naklejka ${pieceOf(id).name} wyciągnięta na wierzch.`);
    }
  };

  const mix = () => {
    const next = round + 1;
    setRound(next);
    setPlacements(scatter(pieces, area, next));
    setNote('Naklejki wymieszane.');
  };

  const clean = () => {
    setPlacements(tidy(pieces, area));
    setNote('Naklejki ułożone w rzędach.');
  };

  return (
    <div class="laptop">
      <div class="laptop__lid" ref={lid} style={{ aspectRatio: `${area.width} / ${area.height}` }}>
        <span class="laptop__brand" aria-hidden="true">
          {'{ }'}
        </span>
        {pieces.map(piece => {
          const id = piece.id;
          const place = placementOf(id);
          return (
            <div
              key={id}
              class="laptop__sticker"
              role="button"
              tabIndex={0}
              aria-label={`Naklejka ${piece.name}. Przeciągnij albo użyj strzałek, żeby ją przesunąć.`}
              style={{
                left: `${(place.x / area.width) * 100}%`,
                top: `${(place.y / area.height) * 100}%`,
                width: `${(piece.width / area.width) * 100}%`,
                zIndex: order.indexOf(id) + 1,
                transform: `rotate(${place.rotation}deg)`,
              }}
              onPointerDown={event => onPointerDown(event, id)}
              onPointerMove={event => onPointerMove(event, id)}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={event => onKeyDown(event, id)}
              dangerouslySetInnerHTML={{ __html: piece.svg }}
            />
          );
        })}
      </div>
      <div class="laptop__base" aria-hidden="true"></div>
      <div class="laptop__bar">
        <button type="button" class="laptop__button" onClick={mix}>
          Wymieszaj
        </button>
        <button type="button" class="laptop__button laptop__button--alt" onClick={clean}>
          Posprzątaj
        </button>
        <p class="laptop__hint">
          Przeciągaj naklejki myszą albo palcem. Z klawiatury: Tab wybiera naklejkę, strzałki ją
          przesuwają, Shift przesuwa dalej.
        </p>
        <p class="sr-only" role="status" aria-live="polite">
          {note}
        </p>
      </div>
    </div>
  );
}
