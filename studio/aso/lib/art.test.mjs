import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mulberry, ridgePoints, smoothPath, yAt } from '../apps/gran/art.mjs';
import { heightAt, profile } from '../apps/gran/profile.mjs';

describe('gran art helpers', () => {
  it('is deterministic', () => {
    const a = mulberry(7);
    const b = mulberry(7);
    assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
    assert.deepEqual(ridgePoints({ seed: 3, from: 0, to: 400, base: 500, amp: 40, step: 40 }), ridgePoints({ seed: 3, from: 0, to: 400, base: 500, amp: 40, step: 40 }));
  });

  it('interpolates lines and draws paths', () => {
    assert.equal(yAt([[0, 0], [10, 100]], 5), 50);
    assert.ok(smoothPath([[0, 0], [10, 10], [20, 0]]).startsWith('M0,0C'));
  });

  it('climbs from Biały Jar to the summit of Śnieżka', () => {
    assert.equal(profile[0][1], 840);
    assert.equal(profile[profile.length - 1][1], 1603);
    assert.equal(heightAt(6.8), 1603);
  });
});
