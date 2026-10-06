import { useState } from 'preact/hooks';
import {
  blend,
  canAdd,
  canRemove,
  defaultPicks,
  defaultVintage,
  promote,
  summary,
  toggle,
} from './composer';
import { extras, grapes, vintages } from './content';

interface Props {
  logo: string;
}

export default function LabelComposer({ logo }: Props) {
  const [picks, setPicks] = useState<string[]>(defaultPicks);
  const [vintage, setVintage] = useState<number>(defaultVintage);
  const parts = blend(picks);

  return (
    <div class="composer">
      <div class="composer__stage">
        <div class="lab-wrap">
          <div class="lab" role="img" aria-label={summary(picks, vintage)}>
            <img class="lab__logo" src={logo} alt="" width="560" height="270" />
            <p class="lab__year">{vintage}</p>
            <p class="lab__grapes caps">
              {parts.map((part, index) => (
                <span key={part.id}>
                  {index > 0 && <i aria-hidden="true"></i>}
                  {part.name} {part.share}
                </span>
              ))}
            </p>
            <div class="lab__prop" aria-hidden="true">
              {parts.map(part => (
                <b key={part.id} style={{ flex: part.share }}></b>
              ))}
            </div>
            <p class="lab__app caps">{extras.label.appellation}</p>
            <p class="lab__note">{extras.label.note}</p>
            <p class="lab__foot caps">
              <span>{extras.label.volume}</span>
              <span>{extras.label.strength}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="composer__controls">
        <fieldset>
          <legend>Odmiany, od dwóch do trzech</legend>
          <ul class="chips">
            {grapes.map(grape => {
              const on = picks.includes(grape.id);
              const locked = on ? !canRemove(picks) : !canAdd(picks);
              return (
                <li key={grape.id}>
                  <button
                    type="button"
                    class="chip"
                    aria-pressed={on}
                    disabled={locked}
                    onClick={() => setPicks(list => toggle(list, grape.id))}>
                    <span class="chip__name">{grape.name}</span>
                    <span class="chip__note">{grape.note}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <fieldset>
          <legend>Rocznik</legend>
          <ul class="years">
            {vintages.map(year => (
              <li key={year}>
                <button
                  type="button"
                  class="year"
                  aria-pressed={vintage === year}
                  onClick={() => setVintage(year)}>
                  {year}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
        <div class="composer__blend">
          <p class="composer__label caps">Proporcje</p>
          <ol class="blend">
            {parts.map((part, index) => (
              <li key={part.id}>
                <span class="blend__share">{part.share}</span>
                <span class="blend__name">{part.name}</span>
                {index > 0 ? (
                  <button
                    type="button"
                    class="blend__up"
                    onClick={() => setPicks(list => promote(list, part.id))}>
                    Na pierwsze miejsce
                    <span class="sr-only">: {part.name}</span>
                  </button>
                ) : (
                  <span class="blend__lead">dominuje</span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <p class="composer__summary" role="status">
          {summary(picks, vintage)}
        </p>
      </div>
    </div>
  );
}
