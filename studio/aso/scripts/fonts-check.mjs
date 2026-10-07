import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as fontkit from 'fontkit';
import { launch } from '../lib/browser.mjs';
import { fetchFamily, polish } from '../lib/fontsrc.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const studio = resolve(here, '..', '..');
const srcRoot = process.env.WZ_FONTS_SRC ?? join(studio, 'out', 'fonts-src');
const outDir = join(studio, 'out', 'aso', 'fonts');

export const families = {
  gran: [
    {
      dir: 'overpass',
      file: 'Overpass[wght].ttf',
      css: 'Overpass',
      instances: [{ wght: 400 }, { wght: 600 }, { wght: 800 }, { wght: 900 }],
    },
  ],
  szyld: [
    {
      dir: 'monasans',
      file: 'MonaSans[wdth,wght].ttf',
      css: 'Mona Sans',
      instances: [
        { wght: 400, wdth: 100 },
        { wght: 600, wdth: 100 },
        { wght: 700, wdth: 100 },
        { wght: 800, wdth: 125 },
        { wght: 900, wdth: 125 },
      ],
    },
  ],
  margines: [
    {
      dir: 'caveat',
      file: 'Caveat[wght].ttf',
      css: 'Caveat',
      instances: [{ wght: 500 }, { wght: 600 }, { wght: 700 }],
    },
    {
      dir: 'lexend',
      file: 'Lexend[wght].ttf',
      css: 'Lexend',
      instances: [{ wght: 400 }, { wght: 500 }, { wght: 700 }],
    },
  ],
  chochla: [
    { dir: 'bangers', file: 'Bangers-Regular.ttf', css: 'Bangers', instances: [{}] },
    {
      dir: 'figtree',
      file: 'Figtree[wght].ttf',
      css: 'Figtree',
      instances: [{ wght: 500 }, { wght: 700 }, { wght: 800 }],
    },
  ],
  kruszec: [
    {
      dir: 'instrumentserif',
      file: 'InstrumentSerif-Regular.ttf',
      css: 'Instrument Serif',
      instances: [{}],
    },
    {
      dir: 'instrumentserif',
      file: 'InstrumentSerif-Italic.ttf',
      css: 'Instrument Serif',
      style: 'italic',
      instances: [{}],
    },
    {
      dir: 'manrope',
      file: 'Manrope[wght].ttf',
      css: 'Manrope',
      instances: [{ wght: 400 }, { wght: 500 }, { wght: 600 }, { wght: 700 }],
    },
  ],
  bis: [
    { dir: 'modak', file: 'Modak-Regular.ttf', css: 'Modak', instances: [{}] },
    {
      dir: 'quicksand',
      file: 'Quicksand[wght].ttf',
      css: 'Quicksand',
      instances: [{ wght: 500 }, { wght: 600 }, { wght: 700 }],
    },
  ],
};

const renders = (font, ch) => {
  const glyph = font.glyphForCodePoint(ch.codePointAt(0));
  return glyph.id !== 0 && glyph.path.commands.length > 0;
};

const verifyApp = app => {
  const rows = [];
  for (const family of families[app]) {
    const base = fontkit.openSync(join(srcRoot, family.dir, family.file));
    for (const coords of family.instances) {
      const font = Object.keys(coords).length ? base.getVariation(coords) : base;
      const bad = [...polish].filter(ch => ch !== ' ' && !renders(font, ch)).join('');
      rows.push({ app, family, coords, ok: bad === '', bad });
    }
  }
  return rows;
};

const sample = 'Zażółć gęślą jaźń. ŁÓDŹ, ŚNIEŻKA, ŹRÓDŁO';

const sheet = rows => {
  const faces = new Map();
  for (const { family } of rows) {
    const url = pathToFileURL(join(srcRoot, family.dir, family.file)).href;
    faces.set(
      url,
      `@font-face{font-family:'${family.css}';src:url('${url}');font-weight:100 900;font-stretch:75% 125%;font-style:${family.style ?? 'normal'}}`,
    );
  }
  const lines = rows
    .map(({ app, family, coords }) => {
      const weight = coords.wght ?? 400;
      const stretch = coords.wdth ? `${coords.wdth}%` : '100%';
      const label = `${app} | ${family.css}${family.style ? ' italic' : ''} | ${JSON.stringify(coords)}`;
      const style = `font-family:'${family.css}';font-weight:${weight};font-stretch:${stretch};font-style:${family.style ?? 'normal'}`;
      return `<section><p class="l">${label}</p><p class="g" style="${style}">${polish}</p><p class="s" style="${style}">${sample}</p></section>`;
    })
    .join('');
  return `<!doctype html><meta charset="utf-8"><style>${[...faces.values()].join('')}body{margin:0;padding:24px;background:#fff;color:#111;width:1352px}section{border-top:1px solid #ccc;padding:8px 0}.l{font:13px monospace;margin:0;color:#555}.g{font-size:56px;margin:4px 0;line-height:1.25}.s{font-size:30px;margin:0;line-height:1.3}</style>${lines}`;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const wantSheet = args.includes('--sheet');
  const apps = args.filter(a => !a.startsWith('--'));
  const chosen = apps.length ? apps : Object.keys(families);
  for (const family of chosen.flatMap(app => families[app])) await fetchFamily(family.dir, [family.file]);
  const rows = chosen.flatMap(verifyApp);
  for (const r of rows)
    console.log(
      `${r.app} | ${r.family.css}${r.family.style ? ' italic' : ''} | ${JSON.stringify(r.coords)} | ${r.ok ? 'ok' : `MISSING ${r.bad}`}`,
    );
  if (wantSheet) {
    mkdirSync(outDir, { recursive: true });
    const file = join(outDir, 'sheet.html');
    writeFileSync(file, sheet(rows));
    const browser = await launch();
    const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(outDir, 'sheet.png'), fullPage: true });
    await browser.close();
    console.log(join(outDir, 'sheet.png'));
  }
  process.exit(rows.every(r => r.ok) ? 0 : 1);
}
