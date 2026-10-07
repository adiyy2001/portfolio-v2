import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listFlag, requireSlug } from '../lib/args.mjs';
import { formatsOrder, masterName } from '../lib/convention.mjs';
import { loadMeta } from '../lib/meta.mjs';
import { appPaths, ensureDir } from '../lib/paths.mjs';
import { makeBundle, still, video } from '../lib/remotion.mjs';

const parts = ['stills', 'store', 'marketing', 'tile'];

export const render = async (slug, { only = parts, concurrency = 3, formats = formatsOrder, screens } = {}) => {
  const paths = appPaths(slug);
  const meta = await loadMeta(slug);
  ensureDir(paths.masters);
  ensureDir(paths.stills);
  const timingsFile = join(paths.qa, 'render-times.json');
  ensureDir(paths.qa);
  const timings = existsSync(timingsFile) ? JSON.parse(readFileSync(timingsFile, 'utf8')) : {};
  const serveUrl = await makeBundle();
  if (only.includes('stills')) {
    const started = Date.now();
    await still(serveUrl, { id: `${slug}-icon`, props: { rounded: false }, output: join(paths.stills, 'icon-1024.png') });
    await still(serveUrl, { id: `${slug}-icon`, props: { rounded: true }, output: join(paths.stills, 'icon-512.png'), scale: 0.5 });
    await still(serveUrl, { id: `${slug}-board`, output: join(paths.stills, 'storyboard.png') });
    await still(serveUrl, { id: `${slug}-og`, output: join(paths.stills, 'og.png') });
    const wanted = screens ?? meta.gallery.map(item => item.n);
    for (const n of wanted) {
      await still(serveUrl, { id: `${slug}-screen`, props: { screen: n }, output: join(paths.stills, `screen-${n}.png`), scale: 2 });
    }
    timings.stills = Math.round((Date.now() - started) / 1000);
    console.log(`stills ${timings.stills} s`);
  }
  if (only.includes('store')) {
    const result = await video(serveUrl, {
      id: `${slug}-store`,
      props: { loop: true },
      output: join(paths.masters, masterName('store')),
      scale: 2,
      concurrency,
    });
    timings.store = result.seconds;
    console.log(`store ${result.frames} frames in ${result.seconds} s`);
  }
  if (only.includes('marketing')) {
    for (const format of formats) {
      const result = await video(serveUrl, {
        id: `${slug}-marketing`,
        props: { format, loop: true },
        output: join(paths.masters, masterName(`marketing-${format}`)),
        concurrency,
      });
      timings[`marketing-${format}`] = result.seconds;
      console.log(`marketing ${format} ${result.frames} frames in ${result.seconds} s`);
    }
  }
  if (only.includes('tile')) {
    const result = await video(serveUrl, { id: `${slug}-tile`, output: join(paths.masters, masterName('tile', false)), concurrency });
    timings.tile = result.seconds;
    console.log(`tile ${result.frames} frames in ${result.seconds} s`);
  }
  writeFileSync(timingsFile, JSON.stringify(timings, null, 2));
  return timings;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { slug, flags } = requireSlug();
  await render(slug, {
    only: listFlag(flags.only, parts),
    concurrency: Number(flags.concurrency ?? 3),
    formats: listFlag(flags.formats, formatsOrder),
    screens: flags.screens ? String(flags.screens).split(',').map(Number) : undefined,
  });
}
