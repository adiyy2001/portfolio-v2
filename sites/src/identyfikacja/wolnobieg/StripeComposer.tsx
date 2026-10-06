import { useState } from 'preact/hooks';
import {
  clampParams,
  composerBox,
  composerStripes,
  composerSvg,
  defaultParams,
  describeParams,
  presets,
  stripeColors,
  wearFilter,
} from './lib/stripes';
import type { StripeParams } from './lib/stripes';

const download = (params: StripeParams) => {
  const url = URL.createObjectURL(new Blob([composerSvg(params)], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wolnobieg-pasy.svg';
  link.click();
  URL.revokeObjectURL(url);
};

export default function StripeComposer() {
  const [params, setParams] = useState<StripeParams>(defaultParams);
  const safe = clampParams(params);
  const stripes = composerStripes(safe);
  const update = (patch: Partial<StripeParams>) => setParams(current => ({ ...current, ...patch }));
  const setColor = (index: number, id: string) =>
    update({ colors: safe.colors.map((value, position) => (position === index ? id : value)) });

  return (
    <div class="composer">
      <div class="composer__stage">
        <svg
          viewBox={`0 0 ${composerBox.width} ${composerBox.height}`}
          role="img"
          aria-label={describeParams(safe)}>
          {safe.wear && <defs dangerouslySetInnerHTML={{ __html: wearFilter }} />}
          <g filter={safe.wear ? 'url(#wear)' : undefined}>
            {stripes.map(stripe => (
              <path key={stripe.id + stripe.d} d={stripe.d} fill={stripe.color} />
            ))}
          </g>
        </svg>
      </div>
      <div class="composer__controls">
        <div class="composer__presets" role="group" aria-label="Gotowe zestawy">
          {presets.map(preset => (
            <button type="button" key={preset.name} onClick={() => setParams(preset.params)}>
              {preset.name}
            </button>
          ))}
        </div>
        <label class="composer__field">
          <span>Liczba pasów: {safe.count}</span>
          <input
            type="range"
            min="2"
            max="5"
            step="1"
            value={safe.count}
            onInput={event => update({ count: Number(event.currentTarget.value) })}
          />
        </label>
        <label class="composer__field">
          <span>Łuk: {Math.round(safe.curvature * 100)} procent</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(safe.curvature * 100)}
            onInput={event => update({ curvature: Number(event.currentTarget.value) / 100 })}
          />
        </label>
        <div class="composer__colors">
          {safe.colors.slice(0, safe.count).map((id, index) => (
            <label class="composer__field" key={index}>
              <span>Pas {index + 1}</span>
              <select value={id} onChange={event => setColor(index, event.currentTarget.value)}>
                {stripeColors.map(color => (
                  <option value={color.id} key={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label class="composer__check">
          <input
            type="checkbox"
            checked={safe.wear}
            onChange={event => update({ wear: event.currentTarget.checked })}
          />
          <span>Lekkie zużycie</span>
        </label>
        <p class="composer__note" role="status">
          {describeParams(safe)}
        </p>
        <button type="button" class="composer__save" onClick={() => download(safe)}>
          Pobierz pasy jako SVG
        </button>
      </div>
    </div>
  );
}
