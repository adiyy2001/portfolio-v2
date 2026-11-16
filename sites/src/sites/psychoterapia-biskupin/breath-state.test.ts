import { describe, expect, it } from 'vitest';
import { controlEvent, controlLabel, nextBreathState } from './breath-state';

describe('nextBreathState', () => {
  it('starts when the disc becomes visible', () => {
    expect(nextBreathState('idle', 'visible')).toBe('running');
  });

  it('ignores visibility after the start', () => {
    expect(nextBreathState('paused', 'visible')).toBe('paused');
    expect(nextBreathState('done', 'visible')).toBe('done');
  });

  it('pauses and resumes', () => {
    expect(nextBreathState('running', 'toggle')).toBe('paused');
    expect(nextBreathState('paused', 'toggle')).toBe('running');
  });

  it('does not toggle before the start or after the end', () => {
    expect(nextBreathState('idle', 'toggle')).toBe('idle');
    expect(nextBreathState('done', 'toggle')).toBe('done');
  });

  it('ends only from the running state', () => {
    expect(nextBreathState('running', 'ended')).toBe('done');
    expect(nextBreathState('paused', 'ended')).toBe('paused');
  });

  it('restarts only from the done state', () => {
    expect(nextBreathState('done', 'restart')).toBe('running');
    expect(nextBreathState('running', 'restart')).toBe('running');
  });
});

describe('controlLabel', () => {
  it.each([
    ['idle', 'Zatrzymaj animację'],
    ['running', 'Zatrzymaj animację'],
    ['paused', 'Wznów animację'],
    ['done', 'Powtórz'],
  ] as const)('labels the %s state', (state, label) => {
    expect(controlLabel(state)).toBe(label);
  });
});

describe('controlEvent', () => {
  it('restarts after the end and toggles otherwise', () => {
    expect(controlEvent('done')).toBe('restart');
    expect(controlEvent('running')).toBe('toggle');
    expect(controlEvent('paused')).toBe('toggle');
  });
});
