export const slotIds = ['01', '02', '03', '04', '05', '06'];

export const stores = {
  appstore: {
    dir: 'app-store',
    prefix: 'appstore',
    title: 'App Store, iPhone 6,9″',
    width: 1320,
    height: 2868,
    css: { width: 440, height: 956, scale: 3 },
  },
  play: {
    dir: 'google-play',
    prefix: 'play',
    title: 'Google Play, telefon',
    width: 1080,
    height: 1920,
    css: { width: 360, height: 640, scale: 3 },
  },
  ipad: {
    dir: 'ipad',
    prefix: 'ipad',
    title: 'App Store, iPad 13″',
    width: 2064,
    height: 2752,
    css: { width: 1032, height: 1376, scale: 2 },
  },
  feature: {
    dir: 'feature-graphic',
    prefix: 'feature',
    title: 'Google Play, feature graphic',
    width: 1024,
    height: 500,
    css: { width: 512, height: 250, scale: 2 },
  },
};

export const iconSpecs = {
  appstore: { size: 1024, channels: 3 },
  play: { size: 512, channels: 4 },
};

export const languages = ['pl', 'en'];

export const nameFor = (slug, { store, lang, slot, variant }) => {
  if (store === 'feature') return `${slug}-feature-${lang}`;
  const id = variant === 'b' ? `${slot}b` : slot;
  return `${slug}-${stores[store].prefix}-${lang}-${id}`;
};

export const relPath = (slug, { store, lang, slot, variant, ext }) => {
  const file = `${nameFor(slug, { store, lang, slot, variant })}.${ext}`;
  if (store === 'feature') return `feature-graphic/${file}`;
  if (variant === 'b') return `variant-b/${file}`;
  return `${stores[store].dir}/${lang}/${file}`;
};

export const iconPaths = slug => ({
  appstore: `icons/${slug}-icon-appstore-1024.png`,
  play: `icons/${slug}-icon-play-512.png`,
  svg: `icons/${slug}-icon.svg`,
  background: `icons/layers/${slug}-icon-background.png`,
  foreground: `icons/layers/${slug}-icon-foreground.png`,
});

export const textPaths = slug => ({
  csv: `${slug}-teksty.csv`,
  pl: 'teksty/pl.json',
  en: 'teksty/en.json',
});

export const groupMeta = {
  appstore: { title: stores.appstore.title },
  play: { title: stores.play.title },
  variantB: { title: 'Wariant B pierwszego screenshotu' },
  feature: { title: stores.feature.title },
  icons: { title: 'Ikony' },
  ipad: { title: stores.ipad.title },
  texts: { title: 'Teksty nagłówków' },
};

export const expectedFiles = app => {
  const ext = app.format === 'jpg' ? 'jpg' : 'png';
  const files = [];
  const add = (path, group, extra) => files.push({ path, group, ...extra });
  for (const lang of languages) {
    for (const slot of slotIds) {
      for (const store of ['appstore', 'play']) {
        add(relPath(app.slug, { store, lang, slot, ext }), store, {
          store,
          lang,
          slot,
          width: stores[store].width,
          height: stores[store].height,
          type: ext,
        });
      }
      if (app.ipad) {
        add(relPath(app.slug, { store: 'ipad', lang, slot, ext }), 'ipad', {
          store: 'ipad',
          lang,
          slot,
          width: stores.ipad.width,
          height: stores.ipad.height,
          type: ext,
        });
      }
    }
    for (const store of ['appstore', 'play']) {
      add(relPath(app.slug, { store, lang, slot: '01', variant: 'b', ext }), 'variantB', {
        store,
        lang,
        slot: '01',
        variant: 'b',
        width: stores[store].width,
        height: stores[store].height,
        type: ext,
      });
    }
    add(relPath(app.slug, { store: 'feature', lang, ext }), 'feature', {
      store: 'feature',
      lang,
      width: stores.feature.width,
      height: stores.feature.height,
      type: ext,
    });
  }
  const icons = iconPaths(app.slug);
  add(icons.appstore, 'icons', { width: 1024, height: 1024, type: 'png', icon: 'appstore' });
  add(icons.play, 'icons', { width: 512, height: 512, type: 'png', icon: 'play' });
  add(icons.svg, 'icons', { type: 'svg', icon: 'svg' });
  add(icons.background, 'icons', { width: 1024, height: 1024, type: 'png', icon: 'background' });
  add(icons.foreground, 'icons', { width: 1024, height: 1024, type: 'png', icon: 'foreground' });
  const texts = textPaths(app.slug);
  add(texts.csv, 'texts', { type: 'csv' });
  add(texts.pl, 'texts', { type: 'json' });
  add(texts.en, 'texts', { type: 'json' });
  return files;
};

export const groupOrder = ['appstore', 'play', 'variantB', 'feature', 'icons', 'ipad', 'texts'];

export const webPath = ({ store, lang, slot, variant }) => {
  if (store === 'feature') return `web/feature-${lang}.webp`;
  return `web/${store}-${lang}-${variant === 'b' ? `${slot}b` : slot}.webp`;
};
