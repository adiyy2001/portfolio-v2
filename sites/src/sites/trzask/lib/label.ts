import { processLabels, roastLabels, roastOrder } from '../data/facets';
import type { Accessory, AccessoryArt, Coffee, RoastLevel, WeightGrams } from '../data/types';
import { glyphWidths } from './glyph-widths';
import type { GlyphWeight } from './glyph-widths';
import { formatClock, roastPath } from './roast';
import type { PointMapper } from './roast';

export type LabelField = 'lime' | 'amber' | 'brown' | 'paper';

export interface LabelLine {
  text: string;
  size: number;
  y: number;
  width: number;
}

export interface CoffeeLabelModel {
  kind: 'coffee';
  field: LabelField;
  lot: string;
  title: LabelLine[];
  region: LabelLine;
  curve: {
    path: string;
    crack: { x: number; y: number };
    second: { x: number; y: number } | null;
    caption: LabelLine;
  };
  notes: LabelLine[];
  scale: Array<{ x: number; filled: boolean }>;
  footLeft: LabelLine;
  footRight: LabelLine;
  aria: string;
}

export interface AccessoryLabelModel {
  kind: 'accessory';
  field: LabelField;
  lot: string;
  title: LabelLine[];
  region: LabelLine;
  art: AccessoryArt;
  footLeft: LabelLine;
  footRight: LabelLine;
  aria: string;
}

export type LabelModel = CoffeeLabelModel | AccessoryLabelModel;

export const labelSize = { width: 300, height: 400, margin: 14, inner: 272 } as const;

export const fieldColors: Record<LabelField, { fill: string; ink: string }> = {
  lime: { fill: '#d3f33a', ink: '#0e110f' },
  amber: { fill: '#ffa21f', ink: '#0e110f' },
  brown: { fill: '#2a170e', ink: '#d3f33a' },
  paper: { fill: '#ffffff', ink: '#0e110f' },
};

const capRatio = 0.8;
const unknownGlyphEm = 0.56;

const fieldByRoast: Record<RoastLevel, LabelField> = {
  jasne: 'lime',
  srednie: 'amber',
  ciemne: 'brown',
};

export const measureEm = (text: string, weight: GlyphWeight): number => {
  const table = glyphWidths[weight];
  return [...text].reduce((sum, char) => sum + (table[char] ?? unknownGlyphEm * 1000), 0) / 1000;
};

export const measureWidth = (
  text: string,
  weight: GlyphWeight,
  size: number,
  spacing = 0,
): number => measureEm(text, weight) * size + spacing * Math.max(0, [...text].length - 1);

export const fitSize = (
  text: string,
  weight: GlyphWeight,
  maxWidth: number,
  maxSize: number,
  spacing = 0,
): number => {
  const available = maxWidth - spacing * Math.max(0, [...text].length - 1);
  const size = available / measureEm(text, weight);
  return Math.min(maxSize, Math.floor(size * 10) / 10);
};

export const weightLabel = (grams: WeightGrams): string => (grams === 1000 ? '1 KG' : `${grams} G`);

const line = (
  text: string,
  weight: GlyphWeight,
  size: number,
  y: number,
  spacing = 0,
): LabelLine => ({
  text,
  size,
  y,
  width: Math.round(measureWidth(text, weight, size, spacing) * 10) / 10,
});

const titleLines = (
  lines: string[],
  top: number,
  bottom: number,
  maxSingle: number,
): LabelLine[] => {
  const fitted = Math.min(...lines.map(text => fitSize(text, 900, labelSize.inner, 999)));
  const size = Math.min(fitted, lines.length === 1 ? maxSingle : maxSingle * 0.55);
  const cap = size * capRatio;
  const gap = lines.length > 1 ? size * 0.16 : 0;
  const total = cap * lines.length + gap * (lines.length - 1);
  const first = top + (bottom - top - total) / 2 + cap;
  return lines.map((text, index) => line(text, 900, size, first + index * (cap + gap)));
};

const trimEnd = (value: number): number => Math.round(value * 100) / 100;

export const regionOf = (coffee: Coffee): string => {
  if (coffee.country === 'mieszanka') return coffee.region.toUpperCase();
  return (coffee.region.split(',')[0] ?? coffee.region).trim().toUpperCase();
};

export const buildCoffeeLabel = (coffee: Coffee, weight: WeightGrams = 250): CoffeeLabelModel => {
  const double = coffee.labelLines.length > 1;
  const top = double ? 46 : 50;
  const bottom = double ? 170 : 148;
  const regionBaseline = double ? 194 : 176;
  const curveTop = double ? 206 : 196;
  const curveHeight = double ? 54 : 64;
  const title = titleLines(coffee.labelLines, top, bottom, 120);

  const regionText = regionOf(coffee);
  const regionSize = fitSize(regionText, 700, labelSize.inner, 20, 2);
  const region = line(regionText, 700, regionSize, regionBaseline, 2);

  const profile = coffee.profile;
  const map: PointMapper = (seconds, temp) => [
    trimEnd(labelSize.margin + (seconds / profile.drop.at) * labelSize.inner),
    trimEnd(curveTop + ((235 - temp) / 155) * curveHeight),
  ];
  const [crackX, crackY] = map(profile.firstCrack.at, profile.firstCrack.temp);
  const second = profile.secondCrack ? map(profile.secondCrack.at, profile.secondCrack.temp) : null;
  const captionText = `PIERWSZY TRZASK ${formatClock(profile.firstCrack.at)}`;
  const caption = line(captionText, 700, 12, curveTop + curveHeight - 1, 1.5);

  const notes = coffee.notes.map((note, index) => {
    const text = note.toUpperCase();
    const size = fitSize(text, 800, labelSize.inner, 25);
    return line(text, 800, size, 290 + index * 26);
  });

  const roastIndex = roastOrder.indexOf(coffee.roast);
  const scale = [0, 1, 2].map(index => ({
    x: labelSize.margin + index * 40,
    filled: index <= roastIndex,
  }));

  const processText =
    coffee.process === 'mieszana' ? 'MIESZANKA' : processLabels[coffee.process].toUpperCase();
  const footRightText = `${processText} · ${weightLabel(weight)}`;
  const footRightSize = fitSize(footRightText, 700, 190, 15, 1.5);

  return {
    kind: 'coffee',
    field: fieldByRoast[coffee.roast],
    lot: `LOT ${coffee.lot}`,
    title,
    region,
    curve: {
      path: roastPath(profile, map),
      crack: { x: crackX, y: crackY },
      second: second ? { x: second[0], y: second[1] } : null,
      caption,
    },
    notes,
    scale,
    footLeft: line(roastLabels[coffee.roast].toUpperCase(), 700, 15, 388, 1.5),
    footRight: line(footRightText, 700, footRightSize, 388, 1.5),
    aria: `Etykieta kawy ${coffee.name}: palenie ${roastLabels[coffee.roast].toLowerCase()}, obróbka ${processLabels[coffee.process].toLowerCase()}, nuty ${coffee.notes.join(', ').toLowerCase()}.`,
  };
};

export const buildAccessoryLabel = (accessory: Accessory): AccessoryLabelModel => {
  const title = titleLines(accessory.labelLines, 50, 148, 120);
  const regionSize = fitSize(accessory.labelRegion, 700, labelSize.inner, 20, 2);
  const footSize = fitSize(accessory.labelFoot, 700, 190, 15, 1.5);
  return {
    kind: 'accessory',
    field: 'paper',
    lot: 'AKCESORIA',
    title,
    region: line(accessory.labelRegion, 700, regionSize, 176, 2),
    art: accessory.art,
    footLeft: line('DO PARZENIA', 700, 15, 388, 1.5),
    footRight: line(accessory.labelFoot, 700, footSize, 388, 1.5),
    aria: `Etykieta produktu ${accessory.name}.`,
  };
};
