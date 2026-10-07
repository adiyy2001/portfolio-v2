import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contrastRatio, describeColor, evaluatePair, requiredRatio } from './color.mjs';
import { findComments, findDashes } from './guard.mjs';
import { logoVariants, names, pngSizes } from './convention.mjs';
import { fitCurve } from './curve-fit.mjs';
import { checkLogoSvg, viewBoxOf } from './svg.mjs';

test('contrast ratio of black on white is 21', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
});

test('required ratios by kind', () => {
  assert.equal(requiredRatio('text'), 4.5);
  assert.equal(requiredRatio('large'), 3);
  assert.equal(requiredRatio('decorative'), 0);
});

test('decorative pairs always pass and text pairs are checked', () => {
  const colors = { a: '#3A3128', b: '#F2EDE2', c: '#A08B6D' };
  assert.equal(evaluatePair({ id: 'x', use: 'text', fg: 'a', bg: 'b', kind: 'text' }, colors).pass, true);
  assert.equal(evaluatePair({ id: 'y', use: 'text', fg: 'c', bg: 'b', kind: 'text' }, colors).pass, false);
  assert.equal(evaluatePair({ id: 'z', use: 'line', fg: 'c', bg: 'b', kind: 'decorative' }, colors).pass, true);
});

test('describeColor gives hex, rgb, oklch and approximate cmyk', () => {
  const info = describeColor('#3a3128');
  assert.equal(info.rgbCss, 'rgb(58 49 40)');
  assert.match(info.oklchCss, /^oklch\(/);
  assert.match(info.cmykApproxText, /^C \d+ M \d+ Y \d+ K \d+$/);
});

test('file names follow the convention', () => {
  const file = names('skibka');
  assert.equal(file.logoSvg('primary'), 'logo/skibka-primary.svg');
  assert.equal(file.logoPng('symbol', 512), 'logo/png/skibka-symbol-512.png');
  assert.equal(file.zip, 'skibka-identyfikacja.zip');
  assert.equal(logoVariants.length, 6);
  assert.deepEqual(pngSizes, [512, 1024, 2048]);
});

test('logo svg check rejects text and missing viewBox', () => {
  assert.equal(checkLogoSvg('<svg viewBox="0 0 10 10"><path d="M0 0h1"/></svg>').ok, true);
  assert.equal(checkLogoSvg('<svg viewBox="0 0 10 10"><text>x</text></svg>').ok, false);
  assert.equal(checkLogoSvg('<svg><path d="M0 0"/></svg>').ok, false);
  assert.deepEqual(viewBoxOf('<svg viewBox="0 0 400 300"></svg>'), [0, 0, 400, 300]);
});

test('guard finds dashes and comments', () => {
  assert.equal(findDashes('a\nb \u2014 c').length, 1);
  assert.equal(findDashes('plain text').length, 0);
  assert.equal(findComments('x.mjs', 'const a = 1; // note').length, 1);
  assert.equal(findComments('x.mjs', 'const a = "//";').length, 0);
});

test('curve fit returns cubic segments for a smooth contour', () => {
  const points = Array.from({ length: 12 }, (_, i) => [Math.cos((i / 12) * Math.PI), Math.sin((i / 12) * Math.PI)]);
  const beziers = fitCurve(points, 0.01, [0, 1], [0, 1]);
  assert.ok(beziers.length >= 1);
  assert.equal(beziers[0].length, 4);
});
