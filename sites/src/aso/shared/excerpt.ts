import type { AsoCopy } from './types';

export const copyExcerpt = (copy: AsoCopy, count = 3) => {
  const slots = copy.slots
    .slice(0, count)
    .map(slot => `    { "headline": "${slot.headline}" }`)
    .join(',\n');
  return `{\n  "lang": "${copy.lang}",\n  "slots": [\n${slots},\n    …\n  ],\n  "variantB": { "headline": "${copy.variantB.headline}" }\n}`;
};

export const uiKeys = (copy: AsoCopy) => Object.keys(copy.ui).length;
