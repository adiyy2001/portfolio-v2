import { describe, expect, it } from 'vitest';
import { columnCount, floors } from '../building';
import type { Rooms } from '../types';
import {
  bayWidth,
  cellBox,
  floorHeight,
  gateBox,
  tagAlign,
  tagAnchor,
  toothGlass,
  toothPath,
  teethCount,
  wallLeft,
  wallRight,
  windowBox,
  panesOf,
  view,
} from './geometry';

const everyCell = floors.flatMap(floor =>
  Array.from({ length: columnCount }, (_, index) => ({ floor, column: index + 1 })),
);

describe('windowBox and cellBox', () => {
  it('keeps every window inside its own cell', () => {
    for (const position of everyCell) {
      const window = windowBox(position);
      const cell = cellBox(position);
      expect(window.x).toBeGreaterThan(cell.x);
      expect(window.y).toBeGreaterThan(cell.y);
      expect(window.x + window.width).toBeLessThan(cell.x + cell.width);
      expect(window.y + window.height).toBeLessThan(cell.y + cell.height);
    }
  });

  it('tiles the wall with cells that share their edges', () => {
    const first = cellBox({ floor: 4, column: 1 });
    const last = cellBox({ floor: 4, column: columnCount });
    expect(first.x).toBe(wallLeft);
    expect(last.x + last.width).toBe(wallRight);
    expect(cellBox({ floor: 3, column: 1 }).y).toBe(first.y + floorHeight);
    expect(cellBox({ floor: 0, column: 2 }).x - cellBox({ floor: 0, column: 1 }).x).toBe(bayWidth);
  });

  it('puts higher floors higher on the drawing', () => {
    for (let floor = 1; floor < floors.length; floor += 1) {
      expect(windowBox({ floor: floor as 1, column: 1 }).y).toBeLessThan(
        windowBox({ floor: (floor - 1) as 0, column: 1 }).y,
      );
    }
  });
});

describe('panesOf', () => {
  it('makes as many panes as rooms and keeps them inside the window', () => {
    const box = windowBox({ floor: 2, column: 4 });
    for (const rooms of [2, 3, 4] as Rooms[]) {
      const panes = panesOf(rooms, box);
      expect(panes).toHaveLength(rooms);
      for (const pane of panes) {
        expect(pane.x).toBeGreaterThanOrEqual(box.x);
        expect(pane.x + pane.width).toBeLessThanOrEqual(box.x + box.width);
        expect(pane.y).toBeGreaterThanOrEqual(box.y);
        expect(pane.y + pane.height).toBeLessThanOrEqual(box.y + box.height);
      }
    }
  });

  it('gives every pane the same width and leaves a gap between neighbours', () => {
    const panes = panesOf(4, windowBox({ floor: 0, column: 1 }));
    for (const pane of panes) expect(pane.width).toBeCloseTo(panes[0].width, 5);
    for (let index = 1; index < panes.length; index += 1) {
      expect(panes[index].x).toBeGreaterThan(panes[index - 1].x + panes[index - 1].width);
    }
  });
});

describe('tagAnchor and tagAlign', () => {
  it('anchors the tag at the horizontal centre of the window as a percentage of the drawing', () => {
    for (const position of everyCell) {
      const anchor = tagAnchor(position);
      const window = windowBox(position);
      expect(anchor.x).toBeCloseTo(((window.x + window.width / 2) / view.width) * 100, 5);
      expect(anchor.y).toBeGreaterThan(0);
      expect(anchor.y).toBeLessThan(100);
    }
  });

  it('keeps the tag inside the drawing by flipping its alignment at both edges', () => {
    expect(tagAlign(1)).toBe('start');
    expect(tagAlign(2)).toBe('start');
    expect(tagAlign(3)).toBe('middle');
    expect(tagAlign(columnCount - 2)).toBe('middle');
    expect(tagAlign(columnCount - 1)).toBe('end');
    expect(tagAlign(columnCount)).toBe('end');
  });
});

describe('roof and gate', () => {
  it('covers the wall with one tooth per two bays', () => {
    expect(teethCount).toBe(columnCount / 2);
    expect(toothPath(0)).toContain(`M${wallLeft} `);
    const lastGlass = toothGlass(teethCount - 1);
    expect(lastGlass.x + lastGlass.width).toBe(wallRight);
  });

  it('puts the gate on the ground floor between its two columns', () => {
    const left = cellBox({ floor: 0, column: 5 });
    const right = cellBox({ floor: 0, column: 6 });
    expect(gateBox.x).toBeGreaterThan(left.x);
    expect(gateBox.x + gateBox.width).toBeLessThan(right.x + right.width);
    expect(gateBox.y).toBeGreaterThanOrEqual(left.y);
  });
});
