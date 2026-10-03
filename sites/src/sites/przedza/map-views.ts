export interface MapView {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const mapViews = {
  wide: { x: -1250, y: -850, width: 3200, height: 2500 },
  close: { x: -660, y: -560, width: 1100, height: 1100 },
} as const satisfies Record<string, MapView>;

export const insideView = (view: MapView, point: { x: number; y: number }) =>
  point.x >= view.x &&
  point.x <= view.x + view.width &&
  point.y >= view.y &&
  point.y <= view.y + view.height;
