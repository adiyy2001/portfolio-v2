import { useEffect, useRef, useState } from 'preact/hooks';
import {
  clearSpace,
  gutterFor,
  logoHeight,
  place,
  toMm,
  variants,
  verdict,
  type VariantId,
} from './lib/grid';

interface Props {
  sources: Record<VariantId, string>;
}

const columnOptions = [4, 8, 12];
const variantIds = Object.keys(variants) as VariantId[];
const pad = 24;

const numberPl = (value: number) => String(Number(value.toFixed(1))).replace('.', ',');

export default function GridTester({ sources }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(960);
  const [cols, setCols] = useState(12);
  const [variant, setVariant] = useState<VariantId>('horizontal');
  const [showGrid, setShowGrid] = useState(true);
  const [showClear, setShowClear] = useState(true);
  const [snap, setSnap] = useState(true);
  const [start, setStart] = useState(1);
  const [span, setSpan] = useState(6);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const measure = () => setStageWidth(node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const gutter = gutterFor(stageWidth);
  const placed = place({ width: stageWidth, cols, gutter, start, span, snap });
  const height = logoHeight(variant, placed.width);
  const clear = clearSpace(variant, placed.width);
  const stageHeight = Math.round(Math.max(height + clear * 2 + pad * 2, 240));
  const state = verdict(variant, placed.width);
  const minimum = variants[variant].minimum;

  const changeCols = (next: number) => {
    setCols(next);
    setStart(value => Math.min(value, next - 1));
    setSpan(value => Math.min(value, next));
  };

  return (
    <div class="gt">
      <div class="gt__controls">
        <fieldset>
          <legend>Kolumny</legend>
          {columnOptions.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="gt-cols"
                checked={cols === option}
                onChange={() => changeCols(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Wariant logo</legend>
          {variantIds.map(id => (
            <label key={id}>
              <input
                type="radio"
                name="gt-variant"
                checked={variant === id}
                onChange={() => setVariant(id)}
              />
              {variants[id].name}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Pomoce</legend>
          <label>
            <input type="checkbox" checked={showGrid} onChange={() => setShowGrid(!showGrid)} />
            Siatka
          </label>
          <label>
            <input type="checkbox" checked={showClear} onChange={() => setShowClear(!showClear)} />
            Pole ochronne
          </label>
          <label>
            <input type="checkbox" checked={snap} onChange={() => setSnap(!snap)} />
            Przyciągaj do kolumn
          </label>
        </fieldset>
        <label class="gt__range">
          <span>Początek: kolumna {numberPl(placed.start + 1)}</span>
          <input
            type="range"
            min="0"
            max={cols - 1}
            step={snap ? 1 : 0.1}
            value={placed.start}
            onInput={event => setStart(Number((event.target as HTMLInputElement).value))}
          />
        </label>
        <label class="gt__range">
          <span>
            Szerokość: {numberPl(placed.span)} z {cols} kolumn
          </span>
          <input
            type="range"
            min="1"
            max={cols}
            step={snap ? 1 : 0.1}
            value={placed.span}
            onInput={event => setSpan(Number((event.target as HTMLInputElement).value))}
          />
        </label>
      </div>
      <div class="gt__stage" ref={stage} style={{ height: `${stageHeight}px` }}>
        {showGrid && (
          <div
            class="gt__cols"
            aria-hidden="true"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              columnGap: `${gutter}px`,
            }}>
            {Array.from({ length: cols }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        )}
        <div
          class="gt__logo"
          style={{
            left: `${placed.left}px`,
            top: `${(stageHeight - height) / 2}px`,
            width: `${placed.width}px`,
            height: `${height}px`,
          }}>
          {showClear && (
            <span class="gt__clear" aria-hidden="true" style={{ inset: `${-clear}px` }}></span>
          )}
          <img
            src={sources[variant]}
            alt={`Logo Rzut, wariant ${variants[variant].name.toLowerCase()}`}
          />
        </div>
      </div>
      <p class="gt__readout" role="status">
        Logo ma {Math.round(placed.width)} px, czyli {numberPl(toMm(placed.width))} mm przy 96 ppi.
        Minimum dla tego wariantu to {minimum} px.{' '}
        <strong class={state === 'ok' ? 'is-ok' : 'is-small'}>
          {state === 'ok'
            ? 'Rozmiar jest poprawny.'
            : 'Za mało miejsca, użyj sygnetu albo poszerz logo.'}
        </strong>
      </p>
    </div>
  );
}
