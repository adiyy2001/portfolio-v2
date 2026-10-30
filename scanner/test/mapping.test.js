import assert from 'node:assert/strict';
import test from 'node:test';
import {
  criteriaFromTags,
  criterionFromTag,
  isBestPracticeOnly,
  mapCriterion,
} from '../src/mapping.js';
import { describeRule, RULES_PL } from '../src/rules-pl.js';
import { WCAG_PL } from '../src/wcag-pl.js';

test('wcag tags map to criteria numbers', () => {
  assert.equal(criterionFromTag('wcag143'), '1.4.3');
  assert.equal(criterionFromTag('wcag1410'), '1.4.10');
  assert.equal(criterionFromTag('wcag2411'), '2.4.11');
  assert.equal(criterionFromTag('wcag258'), '2.5.8');
  assert.equal(criterionFromTag('wcag412'), '4.1.2');
  for (const tag of [
    'wcag2a',
    'wcag2aa',
    'wcag21aa',
    'wcag22aa',
    'best-practice',
    'EN-9.1.4.3',
    'cat.color',
  ]) {
    assert.equal(criterionFromTag(tag), null, tag);
  }
});

test('criteria carry polish names, EN clause and level', () => {
  const [contrast] = criteriaFromTags([
    'cat.color',
    'wcag2aa',
    'wcag143',
    'EN-301-549',
    'EN-9.1.4.3',
  ]);
  assert.equal(contrast.id, '1.4.3');
  assert.equal(contrast.name, 'Kontrast (minimum)');
  assert.equal(contrast.level, 'AA');
  assert.equal(contrast.clause, '9.1.4.3');
  assert.equal(contrast.isNew22, false);
  assert.match(contrast.standardLabel, /V3\.2\.1/);
});

test('new wcag 2.2 criteria are labelled for EN 301 549 V4.1.1', () => {
  const size = mapCriterion('2.5.8');
  assert.equal(size.isNew22, true);
  assert.equal(size.clause, '9.2.5.8');
  assert.equal(size.standardLabel, 'WCAG 2.2, EN 301 549 V4.1.1');
  assert.equal(size.name, 'Rozmiar celu (minimum)');
});

test('rules with several criteria keep all of them', () => {
  const criteria = criteriaFromTags(['wcag2a', 'wcag111', 'wcag412']);
  assert.deepEqual(
    criteria.map(item => item.id),
    ['1.1.1', '4.1.2'],
  );
});

test('best practice rules have no wcag criterion', () => {
  assert.equal(isBestPracticeOnly(['cat.keyboard', 'best-practice']), true);
  assert.equal(isBestPracticeOnly(['wcag2a', 'wcag412']), false);
});

test('dictionary covers every A and AA criterion of WCAG 2.2', () => {
  const expected = [
    '1.1.1',
    '1.2.1',
    '1.2.2',
    '1.2.3',
    '1.2.4',
    '1.2.5',
    '1.3.1',
    '1.3.2',
    '1.3.3',
    '1.3.4',
    '1.3.5',
    '1.4.1',
    '1.4.2',
    '1.4.3',
    '1.4.4',
    '1.4.5',
    '1.4.10',
    '1.4.11',
    '1.4.12',
    '1.4.13',
    '2.1.1',
    '2.1.2',
    '2.1.4',
    '2.2.1',
    '2.2.2',
    '2.3.1',
    '2.4.1',
    '2.4.2',
    '2.4.3',
    '2.4.4',
    '2.4.5',
    '2.4.6',
    '2.4.7',
    '2.4.11',
    '2.5.1',
    '2.5.2',
    '2.5.3',
    '2.5.4',
    '2.5.7',
    '2.5.8',
    '3.1.1',
    '3.1.2',
    '3.2.1',
    '3.2.2',
    '3.2.3',
    '3.2.4',
    '3.2.6',
    '3.3.1',
    '3.3.2',
    '3.3.3',
    '3.3.4',
    '3.3.7',
    '3.3.8',
    '4.1.2',
    '4.1.3',
  ];
  for (const id of expected) assert.ok(WCAG_PL[id], id);
});

test('rule dictionary has the common rules with before and after examples', () => {
  const required = [
    'color-contrast',
    'image-alt',
    'label',
    'link-name',
    'button-name',
    'html-has-lang',
    'document-title',
    'region',
    'landmark-one-main',
    'heading-order',
    'empty-heading',
    'list',
    'listitem',
    'frame-title',
    'meta-viewport',
    'target-size',
    'autocomplete-valid',
    'duplicate-id-aria',
    'nested-interactive',
    'scrollable-region-focusable',
    'select-name',
    'svg-img-alt',
    'role-img-alt',
    'input-button-name',
    'link-in-text-block',
    'page-has-heading-one',
    'skip-link',
    'bypass',
    'tabindex',
    'aria-hidden-focus',
    'aria-allowed-attr',
    'aria-valid-attr',
    'aria-valid-attr-value',
    'aria-required-attr',
    'aria-roles',
  ];
  assert.ok(Object.keys(RULES_PL).length >= 40);
  for (const id of required) {
    const entry = RULES_PL[id];
    assert.ok(entry, id);
    assert.ok(entry.title && entry.problem && entry.before && entry.after, id);
  }
});

test('unknown rules fall back to axe help', () => {
  const info = describeRule('brand-new-rule', { help: 'Do the thing', description: 'Longer text' });
  assert.equal(info.translated, false);
  assert.equal(info.title, 'Do the thing');
});
