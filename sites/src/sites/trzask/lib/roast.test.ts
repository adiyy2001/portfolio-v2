import { describe, expect, it } from 'vitest';
import { coffees } from '../data/catalog';
import {
  beanColor,
  buildSegments,
  chartPath,
  developmentRatio,
  formatClock,
  markers,
  monotoneSlopes,
  phaseAt,
  phases,
  profileKnots,
  riseAt,
  roastPath,
  tempAt,
} from './roast';

const gedeb = coffees[0].profile;
const sumatra = coffees.find(coffee => coffee.id === 'indonezja-sumatra')?.profile ?? gedeb;

describe('monotone spline', () => {
  it('passes through every key point', () => {
    for (const profile of [gedeb, sumatra]) {
      for (const knot of profileKnots(profile)) {
        expect(tempAt(profile, knot.x)).toBeCloseTo(knot.y, 6);
      }
    }
  });

  it('never overshoots between rising key points', () => {
    const segments = buildSegments(profileKnots(gedeb));
    for (const segment of segments.slice(1)) {
      for (let step = 0; step <= 20; step += 1) {
        const seconds = segment.x0 + ((segment.x1 - segment.x0) * step) / 20;
        const temp = tempAt(gedeb, seconds);
        expect(temp).toBeGreaterThanOrEqual(segment.y0 - 1e-6);
        expect(temp).toBeLessThanOrEqual(segment.y1 + 1e-6);
      }
    }
  });

  it('turns around at the turning point', () => {
    const turning = gedeb.turningPoint;
    expect(tempAt(gedeb, turning.at - 10)).toBeGreaterThan(turning.temp);
    expect(tempAt(gedeb, turning.at + 10)).toBeGreaterThan(turning.temp);
    const slopes = monotoneSlopes(profileKnots(gedeb));
    expect(slopes[1]).toBe(0);
  });

  it('climbs steadily after the turning point', () => {
    let previous = tempAt(gedeb, gedeb.turningPoint.at);
    for (let seconds = gedeb.turningPoint.at + 5; seconds <= gedeb.drop.at; seconds += 5) {
      const temp = tempAt(gedeb, seconds);
      expect(temp).toBeGreaterThanOrEqual(previous - 1e-9);
      previous = temp;
    }
  });

  it('clamps the time outside the roast', () => {
    expect(tempAt(gedeb, -50)).toBeCloseTo(gedeb.charge, 6);
    expect(tempAt(gedeb, 9999)).toBeCloseTo(gedeb.drop.temp, 6);
  });

  it('slows the rate of rise through the roast', () => {
    expect(riseAt(gedeb, 150)).toBeGreaterThan(riseAt(gedeb, 400));
    expect(riseAt(gedeb, 400)).toBeGreaterThan(riseAt(gedeb, 560));
  });
});

describe('chart path', () => {
  it('draws one cubic segment per interval', () => {
    const light = chartPath(gedeb);
    const dark = chartPath(sumatra);
    expect(light.startsWith('M0 ')).toBe(true);
    expect((light.match(/C/g) ?? []).length).toBe(4);
    expect((dark.match(/C/g) ?? []).length).toBe(5);
  });

  it('maps through the given mapper', () => {
    const path = roastPath(gedeb, (seconds, temp) => [seconds * 2, temp + 1]);
    expect(path.startsWith(`M0 ${gedeb.charge + 1}C`)).toBe(true);
  });
});

describe('phases', () => {
  it('splits the roast into drying, Maillard and development', () => {
    const list = phases(gedeb);
    expect(list.map(phase => phase.id)).toEqual(['drying', 'maillard', 'development']);
    expect(list[0].from).toBe(0);
    expect(list[2].to).toBe(gedeb.drop.at);
    expect(list[0].to).toBe(list[1].from);
    expect(list[1].to).toBe(list[2].from);
  });

  it('names the phase at a given second', () => {
    expect(phaseAt(gedeb, 10)).toBe('drying');
    expect(phaseAt(gedeb, gedeb.dryEnd.at)).toBe('maillard');
    expect(phaseAt(gedeb, gedeb.firstCrack.at)).toBe('development');
  });

  it('computes the development ratio from first crack to drop', () => {
    expect(developmentRatio(gedeb)).toBe(14.4);
  });

  it('lists the markers in time order', () => {
    const list = markers(sumatra).map(marker => marker.id);
    expect(list).toEqual(['charge', 'turning', 'dry', 'first', 'second', 'drop']);
  });
});

describe('formatClock', () => {
  it('writes minutes and padded seconds', () => {
    expect(formatClock(512)).toBe('8:32');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(0)).toBe('0:00');
  });
});

describe('beanColor', () => {
  it('goes from green to near black', () => {
    expect(beanColor(20)).toBe('#7d9a3b');
    expect(beanColor(300)).toBe('#2a170e');
  });

  it('interpolates between the stops', () => {
    expect(beanColor(150)).toBe('#c4b640');
    expect(beanColor(125)).toBe('#a1a83e');
  });
});

describe('coffee data', () => {
  it('has a believable roast profile for every coffee', () => {
    for (const coffee of coffees) {
      const { profile } = coffee;
      expect(profile.turningPoint.at).toBeGreaterThan(30);
      expect(profile.dryEnd.at).toBeGreaterThan(profile.turningPoint.at);
      expect(profile.firstCrack.at).toBeGreaterThan(profile.dryEnd.at);
      expect(profile.drop.at).toBeGreaterThan(profile.firstCrack.at);
      expect(profile.drop.at).toBeLessThanOrEqual(720);
      expect(profile.drop.temp).toBeLessThanOrEqual(235);
      expect(profile.drop.temp).toBeGreaterThan(profile.firstCrack.temp);
      const ratio = developmentRatio(profile);
      expect(ratio).toBeGreaterThan(8);
      expect(ratio).toBeLessThan(32);
    }
  });
});
