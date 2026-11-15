import type { LoftType, TypeKey } from './data';
import { comma, floorInline } from './format';

interface InnerDoor {
  x: number;
  length: number;
}

interface PlanSpec {
  viewW: number;
  viewH: number;
  outer: { x: number; y: number; w: number; h: number };
  livingY: number;
  northH: number;
  northWidths: number[];
  entranceX: number;
  southWindows: [number, number][];
  westWindow?: [number, number];
  innerDoors: InnerDoor[];
  dimW: string;
  dimD: string;
  northArrowX: number;
  stove?: boolean;
  core?: { x: number; y: number; size: number };
  terrace?: { y: number; h: number; labelX: number; labelY: number };
}

const origin = 40;

const specs: Record<TypeKey, PlanSpec> = {
  '37': {
    viewW: 392,
    viewH: 507,
    outer: { x: origin, y: origin, w: 312, h: 426.9 },
    livingY: 220,
    northH: 180,
    northWidths: [172, 84, 56],
    entranceX: 297,
    southWindows: [[142, 250]],
    innerDoors: [
      { x: 150, length: 44 },
      { x: 224, length: 42 },
      { x: 304, length: 44 },
    ],
    dimW: '5,20 m',
    dimD: '7,12 m',
    northArrowX: 370,
    stove: true,
  },
  '52': {
    viewW: 464,
    viewH: 568,
    outer: { x: origin, y: origin, w: 384, h: 487.5 },
    livingY: 283.8,
    northH: 243.8,
    northWidths: [183.1, 76.8, 65, 59.1],
    entranceX: 305.4,
    southWindows: [
      [112, 208],
      [256, 352],
    ],
    innerDoors: [
      { x: 120, length: 44 },
      { x: 252, length: 42 },
      { x: 310, length: 42 },
      { x: 372, length: 42 },
    ],
    dimW: '6,40 m',
    dimD: '8,13 m',
    northArrowX: 442,
    core: { x: 199.1, y: 259.8, size: 48 },
  },
  '64': {
    viewW: 512,
    viewH: 613,
    outer: { x: origin, y: origin, w: 432, h: 533.3 },
    livingY: 323.3,
    northH: 283.3,
    northWidths: [180.4, 99.1, 71.2, 81.3],
    entranceX: 404.3,
    southWindows: [
      [94, 190],
      [226, 322],
      [358, 454],
    ],
    innerDoors: [
      { x: 130, length: 44 },
      { x: 240, length: 44 },
      { x: 335, length: 42 },
      { x: 410, length: 44 },
    ],
    dimW: '7,20 m',
    dimD: '8,89 m',
    northArrowX: 490,
  },
  '112': {
    viewW: 656,
    viewH: 868,
    outer: { x: origin, y: origin, w: 576, h: 700 },
    livingY: 440,
    northH: 400,
    northWidths: [180, 126, 108, 72, 90],
    entranceX: 544,
    southWindows: [
      [88, 172],
      [214, 298],
      [340, 424],
      [466, 550],
    ],
    westWindow: [496, 664],
    innerDoors: [
      { x: 120, length: 48 },
      { x: 240, length: 48 },
      { x: 370, length: 48 },
      { x: 466, length: 48 },
      { x: 550, length: 48 },
    ],
    dimW: '9,60 m',
    dimD: '11,67 m',
    northArrowX: 634,
    terrace: { y: 740, h: 87.5, labelX: 328, labelY: 791 },
  },
};

const n = (value: number) => value.toFixed(1);

const bottomOf = (spec: PlanSpec) => spec.outer.y + spec.outer.h;

export const planSpec = (key: TypeKey) => specs[key];

export interface PlanModel {
  key: TypeKey;
  viewBox: string;
  width: number;
  title: string;
  markup: string;
}

export const planTitle = (type: LoftType) =>
  `Rzut lofta ${type.area} m², ${floorInline(type.floor)}`;

const roomLabels = (spec: PlanSpec, type: LoftType) => {
  const out: string[] = [];
  const living = type.roomList[0];
  const livingH = bottomOf(spec) - spec.livingY;
  const lcx = spec.outer.x + spec.outer.w / 2;
  const lcy = spec.livingY + livingH / 2;
  out.push(
    `<text class="num" x="${n(lcx)}" y="${n(lcy - 8)}" text-anchor="middle">1</text>`,
    `<text class="area" x="${n(lcx)}" y="${n(lcy + 18)}" text-anchor="middle">${comma(living.area)}</text>`,
  );
  let x = spec.outer.x;
  spec.northWidths.forEach((w, i) => {
    const room = type.roomList[i + 1];
    const cx = x + w / 2;
    const cy = spec.outer.y + spec.northH / 2;
    out.push(
      `<text class="num" x="${n(cx)}" y="${n(cy - 8)}" text-anchor="middle">${i + 2}</text>`,
      `<text class="area" x="${n(cx)}" y="${n(cy + 18)}" text-anchor="middle">${comma(room.area)}</text>`,
    );
    x += w;
  });
  return out;
};

const innerDoorMarkup = (spec: PlanSpec) =>
  spec.innerDoors.map(door => {
    const y = spec.livingY;
    const { x, length } = door;
    return (
      `<rect class="gap" x="${n(x)}" y="${n(y - 3)}" width="${n(length)}" height="6"/>` +
      `<line class="door" x1="${n(x)}" y1="${n(y)}" x2="${n(x)}" y2="${n(y - length)}"/>` +
      `<path class="swing" d="M${n(x + length)} ${n(y)} A${n(length)} ${n(length)} 0 0 0 ${n(x)} ${n(y - length)}"/>`
    );
  });

export const buildPlan = (type: LoftType): PlanModel => {
  const spec = specs[type.key];
  const { outer } = spec;
  const bottom = bottomOf(spec);
  const parts: string[] = [];

  parts.push(
    `<defs><pattern id="h-${type.key}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" class="hatch"/></pattern></defs>`,
  );
  parts.push(
    `<rect class="room" x="${n(outer.x)}" y="${n(spec.livingY)}" width="${n(outer.w)}" height="${n(bottom - spec.livingY)}"/>`,
  );
  let x = outer.x;
  for (const w of spec.northWidths) {
    parts.push(
      `<rect class="room" x="${n(x)}" y="${n(outer.y)}" width="${n(w)}" height="${n(spec.northH)}"/>`,
    );
    x += w;
  }
  if (spec.core) {
    const c = spec.core;
    parts.push(
      `<rect class="core" x="${n(c.x)}" y="${n(c.y)}" width="${n(c.size)}" height="${n(c.size)}" fill="url(#h-${type.key})"/>`,
    );
  }
  if (spec.terrace) {
    const t = spec.terrace;
    parts.push(
      `<rect class="terrace" x="${n(outer.x)}" y="${n(t.y)}" width="${n(outer.w)}" height="${n(t.h)}"/>`,
      `<text class="area" x="${n(t.labelX)}" y="${n(t.labelY)}" text-anchor="middle">Taras ${comma(type.terrace)} m²</text>`,
    );
  }
  parts.push(
    `<rect class="outer" x="${n(outer.x)}" y="${n(outer.y)}" width="${n(outer.w)}" height="${n(outer.h)}"/>`,
  );
  parts.push(
    `<rect class="gap" x="${n(spec.entranceX)}" y="36" width="54" height="8"/>`,
    `<line class="door" x1="${n(spec.entranceX)}" y1="36" x2="${n(spec.entranceX)}" y2="44"/>`,
    `<line class="door" x1="${n(spec.entranceX + 54)}" y1="36" x2="${n(spec.entranceX + 54)}" y2="44"/>`,
  );
  for (const [a, b] of spec.southWindows) {
    parts.push(
      `<rect class="gap" x="${n(a)}" y="${n(bottom - 4)}" width="${n(b - a)}" height="8"/>`,
      `<line class="win" x1="${n(a)}" y1="${n(bottom - 2.5)}" x2="${n(b)}" y2="${n(bottom - 2.5)}"/>`,
      `<line class="win" x1="${n(a)}" y1="${n(bottom + 2.5)}" x2="${n(b)}" y2="${n(bottom + 2.5)}"/>`,
    );
  }
  if (spec.westWindow) {
    const [a, b] = spec.westWindow;
    parts.push(
      `<rect class="gap" x="36" y="${n(a)}" width="8" height="${n(b - a)}"/>`,
      `<line class="win" x1="37.5" y1="${n(a)}" x2="37.5" y2="${n(b)}"/>`,
      `<line class="win" x1="42.5" y1="${n(a)}" x2="42.5" y2="${n(b)}"/>`,
    );
  }
  parts.push(...innerDoorMarkup(spec));
  if (spec.stove) {
    parts.push(
      '<g class="stove"><rect x="292" y="421" width="33" height="33"/><circle cx="308.5" cy="437.5" r="7.2"/><text x="284" y="443.5" text-anchor="end">piec</text></g>',
    );
  }
  parts.push(...roomLabels(spec, type));
  const midY = (outer.y + bottom) / 2;
  parts.push(
    `<text class="dim" x="${n(outer.x + outer.w / 2)}" y="22" text-anchor="middle">${spec.dimW}</text>`,
    `<text class="dim" x="16" y="${n(midY)}" text-anchor="middle" transform="rotate(-90 16 ${n(midY)})">${spec.dimD}</text>`,
  );
  const ax = spec.northArrowX;
  parts.push(
    `<g class="north"><line x1="${ax}" y1="34" x2="${ax}" y2="10"/><path d="M${ax} 6 L${ax - 5} 16 L${ax + 5} 16 Z"/><text x="${ax}" y="56" text-anchor="middle">N</text></g>`,
  );

  return {
    key: type.key,
    viewBox: `0 0 ${spec.viewW} ${spec.viewH}`,
    width: spec.viewW,
    title: planTitle(type),
    markup: parts.join(''),
  };
};
