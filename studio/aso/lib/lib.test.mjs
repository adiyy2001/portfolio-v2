import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import { glue, phoneGeometry, styleOf } from '../kit/kit.mjs';
import { plan } from '../scripts/pipeline.mjs';
import { columnDiff, columnStats } from './boards.mjs';
import { frameName, validateJob } from './compose.mjs';
import { checkCopy, wordCount } from './copycheck.mjs';
import { expectedFiles, nameFor, relPath, webPath } from './convention.mjs';
import { describeImage, flattenImage } from './export.mjs';
import { textsCsv } from './texts.mjs';
import { checkBoxes } from './validate.mjs';

const slot = (id, headline) => ({ id, screen: 'x', headline, alt: `alt ${id}` });
const copy = lang => ({
  lang,
  slots: ['01', '02', '03', '04', '05', '06'].map(id => slot(id, `Nagłówek numer ${id} dla ${lang}`)),
  variantB: { headline: 'Inna obietnica', alt: 'alt b' },
  feature: { headline: 'Hasło', alt: 'alt f' },
});
const app = { slug: 'gran', format: 'png', ipad: false, copy: { pl: copy('pl'), en: copy('en') } };

describe('file names', () => {
  it('follows the convention for every group', () => {
    assert.equal(nameFor('gran', { store: 'appstore', lang: 'pl', slot: '01' }), 'gran-appstore-pl-01');
    assert.equal(relPath('gran', { store: 'play', lang: 'en', slot: '01', variant: 'b', ext: 'png' }), 'variant-b/gran-play-en-01b.png');
    assert.equal(relPath('gran', { store: 'feature', lang: 'pl', ext: 'jpg' }), 'feature-graphic/gran-feature-pl.jpg');
    assert.equal(webPath({ store: 'appstore', lang: 'en', slot: '03' }), 'web/appstore-en-03.webp');
  });

  it('expects 38 files without an iPad set and 50 with one', () => {
    assert.equal(expectedFiles(app).length, 38);
    assert.equal(expectedFiles({ ...app, ipad: true }).length, 50);
    assert.equal(new Set(expectedFiles(app).map(item => item.path)).size, 38);
  });
});

describe('copy checks', () => {
  it('counts words and passes clean copy', () => {
    assert.equal(wordCount('  Szlaki Sudetów  z czasem '), 4);
    assert.deepEqual(checkCopy(app), []);
  });

  it('blocks long headlines, dashes and banned words', () => {
    const bad = structuredClone(app);
    bad.copy.pl.slots[0].headline = 'Jeden dwa trzy cztery pięć sześć siedem';
    bad.copy.pl.slots[1].headline = `Mapa ${String.fromCodePoint(0x2014)} offline`;
    bad.copy.en.slots[2].headline = 'The best trail app';
    bad.copy.en.slots[3].headline = 'Totally free maps';
    const errors = checkCopy(bad);
    assert.ok(errors.some(e => e.includes('more than 6 words')));
    assert.ok(errors.some(e => e.includes('dash')));
    assert.ok(errors.some(e => e.includes('"best"')));
    assert.ok(errors.some(e => e.includes('"free"')));
  });

  it('matches whole words only', () => {
    const ok = structuredClone(app);
    ok.copy.en.slots[0].headline = 'Stop at the topmost newt';
    assert.deepEqual(checkCopy(ok), []);
  });

  it('applies the finance words when asked', () => {
    const money = structuredClone(app);
    money.copy.pl.slots[0].headline = 'Zysk co miesiąc';
    assert.ok(checkCopy(money, ['zysk']).some(e => e.includes('"zysk"')));
  });
});

describe('texts file', () => {
  it('has a row for every image slot', () => {
    const csv = textsCsv(app);
    assert.equal(csv.trim().split('\n').length - 1, 15);
    assert.ok(csv.startsWith('slot,store,headline_pl'));
  });
});

describe('boxes', () => {
  const job = (boxes, store = 'appstore') => [{ id: 'j', store, canvas: { width: 880, height: 956 }, strip: { frames: 2, frameWidth: 440, margin: 24, origin: 0 }, boxes }];

  it('accepts boxes inside their frame', () => {
    const errors = [];
    checkBoxes(job([{ kind: 'fg', name: 'p', x: 30, y: 10, width: 300, height: 500 }]), errors);
    assert.deepEqual(errors, []);
  });

  it('rejects a box that crosses a seam', () => {
    const errors = [];
    checkBoxes(job([{ kind: 'fg', name: 'p', x: 300, y: 10, width: 200, height: 500 }]), errors);
    assert.equal(errors.length, 1);
  });

  it('rejects one word last lines and big play headlines', () => {
    const errors = [];
    checkBoxes(job([{ kind: 'headline', name: 'h', x: 30, y: 10, width: 380, height: 300, words: 4, lines: 3, lastLineWords: 1, broken: false, overflow: false }], 'play'), errors);
    assert.ok(errors.some(e => e.includes('one word last line')));
    assert.ok(errors.some(e => e.includes('limit 20')));
  });
});

describe('render jobs', () => {
  it('names frames and checks strips', () => {
    assert.equal(frameName({ store: 'appstore', lang: 'pl' }, { slot: '01', variant: 'b' }), 'appstore-pl-01b');
    assert.equal(frameName({ store: 'feature', lang: 'en' }, { slot: 'feature' }), 'feature-en');
    assert.deepEqual(validateJob({ id: 'a', store: 'appstore', lang: 'pl', width: 2640, height: 956, scale: 3, body: '', frames: 6, frameWidth: 440, outputs: [{ frame: 0 }] }), []);
    assert.equal(validateJob({ id: 'a', store: 'appstore', lang: 'pl', width: 2600, height: 956, scale: 3, body: '', frames: 6, frameWidth: 440, outputs: [{ frame: 7 }] }).length, 2);
  });
});

describe('kit', () => {
  it('glues one letter words to the next word', () => {
    assert.equal(glue('Szlaki z czasem w górach', 'pl'), 'Szlaki z czasem w górach');
    assert.equal(glue('Get a map', 'en'), 'Get a map');
  });

  it('keeps the phone screen in the 390 by 844 ratio', () => {
    const g = phoneGeometry(262);
    assert.ok(Math.abs(g.innerHeight / g.innerWidth - 844 / 390) < 1e-9);
    assert.equal(styleOf({ left: 10.123, top: 0, color: '#fff', skip: undefined }), 'left:10.12px;top:0px;color:#fff');
  });
});

describe('pipeline plan', () => {
  it('honours from, only and skip', () => {
    assert.deepEqual(plan({ from: 'zip', skip: 'seams' }), ['zip', 'manifest', 'validate', 'board', 'thumbs']);
    assert.deepEqual(plan({ only: 'render,export' }), ['render', 'export']);
    assert.throws(() => plan({ only: 'nope' }));
  });
});

describe('export', () => {
  it('writes truecolour PNG and 3 channel JPEG without alpha', async () => {
    const input = await sharp({ create: { width: 30, height: 20, channels: 4, background: { r: 10, g: 20, b: 30, alpha: 0.5 } } }).png().toBuffer();
    const png = await describeImage(await flattenImage(input, { format: 'png', background: '#ffffff', width: 30, height: 20 }));
    assert.equal(png.png.colourType, 2);
    assert.equal(png.hasAlpha, false);
    const jpg = await describeImage(await flattenImage(input, { format: 'jpg', background: '#ffffff', width: 30, height: 20 }));
    assert.equal(jpg.format, 'jpeg');
    assert.equal(jpg.channels, 3);
  });

  it('measures column differences for the seam check', async () => {
    const image = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#808080' } }).png().toBuffer();
    const a = await columnStats(image, 0);
    const b = await columnStats(image, 3);
    assert.equal(columnDiff(a, b), 0);
  });
});
