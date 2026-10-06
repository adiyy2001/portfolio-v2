import { useRef, useState } from 'preact/hooks';
import { hashSeed, imprint, mulberry32 } from './lib/stamp';

interface Props {
  ring: string;
  loaf: { body: string; cuts: string; dots: string };
  limit?: number;
}

interface Mark {
  n: number;
  x: number;
  y: number;
}

const markSize = 150;

export default function StampPress({ ring, loaf, limit = 14 }: Props) {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [count, setCount] = useState(0);
  const pad = useRef<HTMLButtonElement>(null);

  const press = (event: MouseEvent) => {
    const box = pad.current?.getBoundingClientRect();
    if (!box) return;
    const n = count + 1;
    let x: number;
    let y: number;
    if (event.detail === 0) {
      const rng = mulberry32(hashSeed(`miejsce-${n}`));
      x = markSize / 2 + rng() * (box.width - markSize);
      y = markSize / 2 + rng() * (box.height - markSize);
    } else {
      x = Math.min(Math.max(event.clientX - box.left, markSize / 2), box.width - markSize / 2);
      y = Math.min(Math.max(event.clientY - box.top, markSize / 2), box.height - markSize / 2);
    }
    setCount(n);
    setMarks(list => [...list, { n, x, y }].slice(-limit));
  };

  const clear = () => {
    setMarks([]);
    setCount(0);
  };

  return (
    <div class="press">
      <button
        ref={pad}
        type="button"
        class="press__pad"
        onClick={press}
        aria-label="Przybij pieczątkę"
        aria-describedby="press-hint">
        <span
          class={count === 0 ? 'press__label' : 'press__label press__label--gone'}
          aria-hidden="true">
          Kliknij w papier
        </span>
        {marks.map(mark => {
          const print = imprint(mark.n);
          return (
            <svg
              key={mark.n}
              class="press__mark"
              viewBox="0 0 400 400"
              width={markSize}
              height={markSize}
              aria-hidden="true"
              style={{
                left: `${mark.x - markSize / 2 + print.offsetX}px`,
                top: `${mark.y - markSize / 2 + print.offsetY}px`,
                transform: `rotate(${print.rotation}deg)`,
                opacity: print.opacity,
              }}>
              <g fill="#3a3128" fill-rule="evenodd">
                <path d={print.art.band + print.art.specks} />
                <path d={print.art.thin} />
                <path d={ring} />
                <path d={loaf.body + loaf.cuts + loaf.dots} />
              </g>
            </svg>
          );
        })}
      </button>
      <div class="press__bar">
        <p id="press-hint" class="press__hint">
          Każdy odcisk ma trochę inny brzeg, ale ten sam numer zawsze wygląda tak samo.
        </p>
        <p class="press__count" role="status">
          Odbitek: {count}
        </p>
        <button type="button" class="press__clear" onClick={clear} disabled={count === 0}>
          Wyczyść papier
        </button>
      </div>
    </div>
  );
}
