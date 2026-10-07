import { slotIds, stores } from './convention.mjs';

const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const slotCopy = (copy, slot, variant) => {
  if (variant === 'b') return copy.variantB;
  if (slot === 'feature') return copy.feature;
  return copy.slots.find(item => item.id === slot);
};

export const textRows = (app, { ipad = false } = {}) => {
  const rows = [];
  const add = (store, slot, variant) => {
    const pl = slotCopy(app.copy.pl, slot, variant);
    const en = slotCopy(app.copy.en, slot, variant);
    const label = variant === 'b' ? `${slot}b` : slot;
    rows.push({
      slot: `${stores[store].prefix}-${label}`,
      store: stores[store].title,
      headlinePl: pl.headline,
      subtitlePl: pl.subtitle ?? '',
      headlineEn: en.headline,
      subtitleEn: en.subtitle ?? '',
      altPl: pl.alt,
      altEn: en.alt,
    });
  };
  for (const store of ['appstore', 'play']) {
    for (const slot of slotIds) add(store, slot);
    add(store, '01', 'b');
  }
  if (ipad) for (const slot of slotIds) add('ipad', slot);
  add('feature', 'feature');
  return rows;
};

export const textsCsv = (app, options) => {
  const header = ['slot', 'store', 'headline_pl', 'subtitle_pl', 'headline_en', 'subtitle_en', 'alt_pl', 'alt_en'];
  const lines = [header.join(',')];
  for (const row of textRows(app, options)) {
    lines.push(
      [row.slot, row.store, row.headlinePl, row.subtitlePl, row.headlineEn, row.subtitleEn, row.altPl, row.altEn]
        .map(quote)
        .join(','),
    );
  }
  return `${lines.join('\n')}\n`;
};
