export const mmPerPx = 25.4 / 96;

export const variants = {
  primary: { width: 511, height: 211, minimum: 280, name: 'Główne' },
  horizontal: { width: 511, height: 120, minimum: 96, name: 'Poziome' },
  vertical: { width: 351, height: 391, minimum: 200, name: 'Pionowe' },
  symbol: { width: 120, height: 120, minimum: 16, name: 'Sygnet' },
} as const;

export type VariantId = keyof typeof variants;

export const moduleUnits = 120;

export const toMm = (px: number) => Number((px * mmPerPx).toFixed(1));

export const columnWidth = (width: number, cols: number, gutter: number) =>
  (width - gutter * (cols - 1)) / cols;

export const columnLeft = (index: number, width: number, cols: number, gutter: number) =>
  index * (columnWidth(width, cols, gutter) + gutter);

export const spanWidth = (span: number, width: number, cols: number, gutter: number) =>
  span * columnWidth(width, cols, gutter) + (span - 1) * gutter;

export interface PlaceInput {
  width: number;
  cols: number;
  gutter: number;
  start: number;
  span: number;
  snap: boolean;
}

export interface Placement {
  start: number;
  span: number;
  left: number;
  width: number;
}

export const place = ({ width, cols, gutter, start, span, snap }: PlaceInput): Placement => {
  const rawStart = snap ? Math.round(start) : start;
  const safeStart = Math.min(Math.max(rawStart, 0), cols - 1);
  const rawSpan = snap ? Math.round(span) : span;
  const safeSpan = Math.min(Math.max(rawSpan, 1), cols - safeStart);
  return {
    start: safeStart,
    span: safeSpan,
    left: columnLeft(safeStart, width, cols, gutter),
    width: spanWidth(safeSpan, width, cols, gutter),
  };
};

export const logoHeight = (variant: VariantId, width: number) =>
  (width * variants[variant].height) / variants[variant].width;

export const clearSpace = (variant: VariantId, width: number) =>
  (width * (moduleUnits / 2)) / variants[variant].width;

export const verdict = (variant: VariantId, width: number) =>
  width >= variants[variant].minimum ? 'ok' : 'small';

export const gutterFor = (stageWidth: number) => (stageWidth < 600 ? 4 : 16);
