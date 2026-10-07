const stems = ['najlepsz', 'darmow', 'gwarant', 'rabat'];

const phrases = [
  'nr 1',
  '#1',
  'numer jeden',
  'za darmo',
  'best',
  'top',
  'free',
  'nowość',
  'new',
  'promocja',
  'sale',
  'discount',
  'pobierz teraz',
  'download now',
  'install now',
  'guarantee',
];

export const financeWords = ['zysk', 'zarob', 'stopa zwrotu', 'zwrot', 'return', 'profit', 'earn'];

const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matcher = (term, prefix) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${escape(term)}${prefix ? '' : '(?![\\p{L}\\p{N}])'}`, 'iu');

export const bannedMatchers = (extra = []) => [
  ...stems.map(term => ({ term, regex: matcher(term, true) })),
  ...phrases.map(term => ({ term, regex: matcher(term, false) })),
  ...extra.map(term => ({ term, regex: matcher(term, term.length <= 6 && !term.includes(' ')) })),
];

export const wordCount = text => text.trim().split(/\s+/).filter(Boolean).length;

const textsOf = (copy, lang) => {
  const items = [];
  const push = (where, field, value) => {
    if (typeof value === 'string' && value.length > 0) items.push({ where, field, value });
  };
  copy.slots.forEach(slot => {
    push(`slot ${slot.id}`, 'headline', slot.headline);
    push(`slot ${slot.id}`, 'subtitle', slot.subtitle);
    push(`slot ${slot.id}`, 'alt', slot.alt);
  });
  ['variantB', 'feature'].forEach(key => {
    push(key, 'headline', copy[key].headline);
    push(key, 'subtitle', copy[key].subtitle);
    push(key, 'alt', copy[key].alt);
  });
  return items.map(item => ({ ...item, lang }));
};

export const checkCopy = (app, extraBanned = []) => {
  const errors = [];
  const matchers = bannedMatchers([...(app.bannedExtra ?? []), ...extraBanned]);
  for (const lang of Object.keys(app.copy)) {
    const copy = app.copy[lang];
    if (!Array.isArray(copy.slots) || copy.slots.length !== 6) errors.push(`copy ${lang}: needs 6 slots`);
    for (const item of textsOf(copy, lang)) {
      const label = `copy ${lang} ${item.where} ${item.field}`;
      if (/[\u2013\u2014]/.test(item.value)) errors.push(`${label}: contains an em or en dash`);
      if (item.field === 'headline' && wordCount(item.value) > 6) errors.push(`${label}: more than 6 words (${item.value})`);
      if (item.field === 'subtitle' && wordCount(item.value) > 8) errors.push(`${label}: more than 8 words (${item.value})`);
      if (item.field === 'alt' && item.value.length > 140) errors.push(`${label}: alt text over 140 characters`);
      for (const { term, regex } of matchers) {
        if (regex.test(item.value)) errors.push(`${label}: banned term "${term}" in "${item.value}"`);
      }
    }
    const headlines = copy.slots.map(slot => slot.headline.toLowerCase());
    if (new Set(headlines).size !== headlines.length) errors.push(`copy ${lang}: duplicate headlines`);
    copy.slots.forEach(slot => {
      if (slot.subtitle && slot.subtitle.toLowerCase() === slot.headline.toLowerCase()) errors.push(`copy ${lang} slot ${slot.id}: subtitle repeats the headline`);
    });
  }
  return errors;
};
