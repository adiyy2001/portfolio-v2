import { describe, expect, it } from 'vitest';
import { parseChecked, progressText, serializeChecked, withChecked } from './checklist';

const ids = ['access', 'permissions', 'tool'];

describe('parseChecked', () => {
  it('reads stored ids', () => {
    expect(parseChecked('["access","tool"]', ids)).toEqual(new Set(['access', 'tool']));
  });

  it('returns an empty set for missing, broken or foreign data', () => {
    expect(parseChecked(null, ids)).toEqual(new Set());
    expect(parseChecked('{not json', ids)).toEqual(new Set());
    expect(parseChecked('{"access":true}', ids)).toEqual(new Set());
  });

  it('drops ids that are not on the list', () => {
    expect(parseChecked('["access",7,"gone"]', ids)).toEqual(new Set(['access']));
  });
});

describe('withChecked', () => {
  it('adds and removes ids without touching the original', () => {
    const start = new Set(['access']);
    expect(withChecked(start, 'tool', true)).toEqual(new Set(['access', 'tool']));
    expect(withChecked(start, 'access', false)).toEqual(new Set());
    expect(start).toEqual(new Set(['access']));
  });
});

describe('serializeChecked', () => {
  it('round trips through parseChecked', () => {
    const checked = new Set(['permissions', 'tool']);
    expect(parseChecked(serializeChecked(checked), ids)).toEqual(checked);
  });
});

describe('progressText', () => {
  it('counts the finished items', () => {
    expect(progressText(0, 8)).toBe('Zrobione: 0 z 8');
    expect(progressText(3, 8)).toBe('Zrobione: 3 z 8');
  });

  it('says so when everything is done', () => {
    expect(progressText(8, 8)).toBe('Wszystko zrobione: 8 z 8');
  });
});
