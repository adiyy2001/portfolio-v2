import { describe, expect, it } from 'vitest';
import {
  ARRIVAL_END,
  CLOSING_START,
  SESSION_MINUTES,
  minuteToX,
  waveAmplitude,
  wavePath,
  wavePoints,
} from './wave';

describe('waveAmplitude', () => {
  it('is calm at the start and at the end', () => {
    expect(waveAmplitude(0)).toBe(0);
    expect(waveAmplitude(SESSION_MINUTES)).toBe(0);
  });

  it('stays at full height through the conversation', () => {
    expect(waveAmplitude(ARRIVAL_END)).toBe(1);
    expect(waveAmplitude(27)).toBe(1);
    expect(waveAmplitude(CLOSING_START)).toBe(1);
  });

  it('rises during the arrival and falls during the closing', () => {
    const rising = [0, 2, 4, 6, 8, 10].map(waveAmplitude);
    const falling = [45, 46, 47, 48, 49, 50].map(waveAmplitude);
    expect([...rising].sort((a, b) => a - b)).toEqual(rising);
    expect([...falling].sort((a, b) => b - a)).toEqual(falling);
  });

  it('stays within 0 and 1 for every minute, also outside the session', () => {
    for (let minute = -5; minute <= 60; minute += 0.5) {
      expect(waveAmplitude(minute)).toBeGreaterThanOrEqual(0);
      expect(waveAmplitude(minute)).toBeLessThanOrEqual(1);
    }
  });
});

describe('wavePoints', () => {
  it('spans the whole width with one more point than samples', () => {
    const points = wavePoints(1000, 200, 100);
    expect(points).toHaveLength(101);
    expect(points[0]?.x).toBe(0);
    expect(points[100]?.x).toBe(1000);
  });

  it('starts and ends on the baseline', () => {
    const points = wavePoints(1000, 200, 100);
    expect(points[0]?.y).toBeCloseTo(100, 6);
    expect(points[100]?.y).toBeCloseTo(100, 6);
  });

  it('never leaves the drawing area', () => {
    wavePoints(1000, 200, 400, 1.3).forEach(point => {
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(200);
    });
  });

  it('shifts with the phase', () => {
    const plain = wavePoints(1000, 200, 100);
    const shifted = wavePoints(1000, 200, 100, Math.PI / 2);
    const largestShift = Math.max(
      ...plain.map((point, index) => Math.abs(point.y - (shifted[index]?.y ?? point.y))),
    );
    expect(largestShift).toBeGreaterThan(20);
  });
});

describe('wavePath', () => {
  it('draws a single line through all points', () => {
    expect(
      wavePath([
        { x: 0, y: 10 },
        { x: 5, y: 20.123 },
        { x: 10, y: 10 },
      ]),
    ).toBe('M0.0 10.0 L5.0 20.1 L10.0 10.0');
  });

  it('is empty without points', () => {
    expect(wavePath([])).toBe('');
  });
});

describe('minuteToX', () => {
  it('places the phase boundaries proportionally', () => {
    expect(minuteToX(ARRIVAL_END, 1000)).toBe(200);
    expect(minuteToX(CLOSING_START, 1000)).toBe(900);
    expect(minuteToX(SESSION_MINUTES, 1000)).toBe(1000);
  });
});
