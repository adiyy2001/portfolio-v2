import { useState } from 'preact/hooks';
import type { Lang, Shot } from './types';

type StoreKey = 'appstore' | 'play';

interface Props {
  sets: Record<Lang, Record<StoreKey, Shot[]>>;
  storeLabels: Record<StoreKey, string>;
  langLabels: Record<Lang, string>;
  panorama?: boolean;
  panoramaLabel?: string;
}

export default function LangSwitch({
  sets,
  storeLabels,
  langLabels,
  panorama = false,
  panoramaLabel = 'Połącz kadry',
}: Props) {
  const [lang, setLang] = useState<Lang>('pl');
  const [store, setStore] = useState<StoreKey>('appstore');
  const [joined, setJoined] = useState(false);
  const shots = sets[lang][store];
  const langs = Object.keys(langLabels) as Lang[];
  const storeKeys = Object.keys(storeLabels) as StoreKey[];
  return (
    <div class="switch" data-lang={lang} data-store={store}>
      <div class="switch__bar">
        <div class="switch__group" role="group" aria-label="Język zestawu">
          {langs.map(item => (
            <button
              type="button"
              class="switch__btn"
              aria-pressed={item === lang}
              onClick={() => setLang(item)}>
              {langLabels[item]}
            </button>
          ))}
        </div>
        <div class="switch__group" role="group" aria-label="Sklep">
          {storeKeys.map(item => (
            <button
              type="button"
              class="switch__btn"
              aria-pressed={item === store}
              onClick={() => setStore(item)}>
              {storeLabels[item]}
            </button>
          ))}
        </div>
        {panorama && (
          <label class="switch__check">
            <input
              type="checkbox"
              checked={joined}
              onChange={event => setJoined((event.target as HTMLInputElement).checked)}
            />
            <span>{panoramaLabel}</span>
          </label>
        )}
      </div>
      <ul
        class={`strip switch__strip${joined ? ' strip--joined' : ''}`}
        aria-label={`${storeLabels[store]}, ${langLabels[lang]}`}
        aria-live="polite"
        tabIndex={0}>
        {shots.map(shot => (
          <li class="strip__item" key={`${lang}-${store}-${shot.slot}`}>
            <img
              class="strip__img"
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
