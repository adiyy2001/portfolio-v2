import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import type { FontFaceSpec } from './types';

const cache = new Map<string, Promise<void>>();

const loadFace = (spec: FontFaceSpec) => {
  const key = `${spec.family}|${spec.file}|${spec.weight ?? ''}|${spec.stretch ?? ''}`;
  const known = cache.get(key);
  if (known) return known;
  const face = new FontFace(spec.family, `url('${staticFile(spec.file)}') format('truetype')`, {
    weight: spec.weight ?? 'normal',
    stretch: spec.stretch ?? 'normal',
    style: spec.style ?? 'normal',
  });
  const promise = face.load().then(loaded => {
    document.fonts.add(loaded);
  });
  cache.set(key, promise);
  return promise;
};

export const useFonts = (specs: FontFaceSpec[]) => {
  const [handle] = useState(() => delayRender(`fonts ${specs.map(s => s.family).join(', ')}`));
  useEffect(() => {
    Promise.all(specs.map(loadFace))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(error => cancelRender(error));
  }, [handle, specs]);
};
