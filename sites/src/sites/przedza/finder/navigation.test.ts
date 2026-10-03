import { describe, expect, it } from 'vitest';
import { flats } from '../data';
import { directionForKey, firstInReadingOrder, moveFocus } from './navigation';

const at = (floor: number, column: number) =>
  flats.find(flat => flat.floor === floor && flat.column === column);

const position = (floor: number, column: number) => ({
  floor: floor as 0 | 1 | 2 | 3 | 4,
  column,
});

describe('moving between windows', () => {
  it('goes left and right inside a floor', () => {
    expect(moveFocus(flats, position(2, 5), 'right')).toBe(at(2, 6));
    expect(moveFocus(flats, position(2, 5), 'left')).toBe(at(2, 4));
    expect(moveFocus(flats, position(2, 10), 'right')).toBeUndefined();
    expect(moveFocus(flats, position(2, 1), 'left')).toBeUndefined();
  });

  it('jumps over the gate on the ground floor', () => {
    expect(moveFocus(flats, position(0, 4), 'right')).toBe(at(0, 7));
    expect(moveFocus(flats, position(0, 7), 'left')).toBe(at(0, 4));
  });

  it('goes to the ends of a row', () => {
    expect(moveFocus(flats, position(3, 5), 'rowStart')).toBe(at(3, 1));
    expect(moveFocus(flats, position(3, 5), 'rowEnd')).toBe(at(3, 10));
  });

  it('goes up and down keeping the column, or the closest one over the gate', () => {
    expect(moveFocus(flats, position(2, 4), 'up')).toBe(at(3, 4));
    expect(moveFocus(flats, position(2, 4), 'down')).toBe(at(1, 4));
    expect(moveFocus(flats, position(1, 5), 'down')).toBe(at(0, 4));
    expect(moveFocus(flats, position(1, 6), 'down')).toBe(at(0, 7));
    expect(moveFocus(flats, position(4, 3), 'up')).toBeUndefined();
    expect(moveFocus(flats, position(0, 3), 'down')).toBeUndefined();
  });

  it('skips floors without matching flats', () => {
    const sparse = flats.filter(flat => flat.floor === 0 || flat.floor === 4);
    expect(moveFocus(sparse, position(4, 2), 'down')).toBe(at(0, 2));
    expect(moveFocus(sparse, position(0, 2), 'up')).toBe(at(4, 2));
  });

  it('goes to the first and the last floor', () => {
    expect(moveFocus(flats, position(2, 3), 'top')).toBe(at(4, 3));
    expect(moveFocus(flats, position(2, 3), 'bottom')).toBe(at(0, 3));
  });

  it('returns nothing when no flat matches', () => {
    expect(moveFocus([], position(2, 3), 'top')).toBeUndefined();
    expect(moveFocus([], position(2, 3), 'right')).toBeUndefined();
  });
});

describe('reading order and keys', () => {
  it('starts at the top left window', () => {
    expect(firstInReadingOrder(flats)).toBe(at(4, 1));
    expect(firstInReadingOrder([])).toBeUndefined();
  });

  it('maps navigation keys', () => {
    expect(directionForKey('ArrowLeft')).toBe('left');
    expect(directionForKey('PageDown')).toBe('bottom');
    expect(directionForKey('Enter')).toBeUndefined();
  });
});
