import type { CSSProperties, ReactNode } from 'react';
import { color, fontFamily, hue, num, type Hue } from '../tokens';
import { P, faces, pathOf, pts, type V3 } from './iso';

export interface Camera {
  x: number;
  y: number;
  scale: number;
}

export type Weights = Record<Hue, number>;
export type Flows = Record<Hue, number>;

export const allOn: Weights = { sun: 1, battery: 1, home: 1, grid: 1 };

export const nodes = {
  roof: P(130, 118, 83),
  battery: P(234, 108, 26),
  batteryTop: P(234, 108, 56),
  home: P(120, 140, 26),
  grid: P(19, 179, 112),
  hub: P(206, 154, 20),
  center: P(135, 100, 30),
} as const;

export const routes: Record<Hue, V3[]> = {
  sun: [
    [190, 141, 61],
    [190, 141, 2],
    [190, 154, 2],
    [199, 154, 2],
  ],
  battery: [
    [206, 154, 2],
    [234, 154, 2],
    [234, 121, 2],
  ],
  home: [
    [202, 154, 2],
    [202, 170, 2],
    [120, 170, 2],
    [120, 141, 2],
  ],
  grid: [
    [210, 154, 2],
    [210, 186, 2],
    [30, 186, 2],
    [30, 181, 2],
  ],
};

export const Box = ({ x, y, z, dx, dy, dz, top = color.card, left = color.left, right = color.right, opacity = 1 }: { x: number; y: number; z: number; dx: number; dy: number; dz: number; top?: string; left?: string; right?: string; opacity?: number }) => {
  const f = faces({ x, y, z, dx, dy, dz });
  return (
    <g opacity={opacity}>
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
      <polygon points={f.top} fill={top} />
    </g>
  );
};

const slope = (u: number, s: number): V3 => [u, 140 - 45 * s, 62 + 42 * s];

const Panels = ({ glint }: { glint: number }) => {
  const cells: ReactNode[] = [];
  const cols = 10;
  const u0 = 74;
  const span = 112;
  const w = span / cols;
  const rows: [number, number][] = [
    [0.07, 0.47],
    [0.53, 0.93],
  ];
  rows.forEach(([s0, s1], r) => {
    for (let c = 0; c < cols; c += 1) {
      const a = u0 + c * w + 0.7;
      const b = u0 + (c + 1) * w - 0.7;
      cells.push(<polygon key={`${r}-${c}`} points={pts([slope(a, s0), slope(b, s0), slope(b, s1), slope(a, s1)])} fill={color.panel} />);
    }
  });
  const g0 = u0 + span * glint;
  return (
    <g>
      {cells}
      {glint > 0 && glint < 1 && (
        <polygon points={pts([slope(g0, 0.07), slope(g0 + 6, 0.07), slope(g0 + 14, 0.93), slope(g0 + 8, 0.93)])} fill={color.card} opacity={0.35} />
      )}
    </g>
  );
};

const House = ({ focus }: { focus: Weights }) => {
  const front = faces({ x: 70, y: 50, z: 0, dx: 120, dy: 90, dz: 62 });
  const win = (x0: number, x1: number, z0: number, z1: number, y = 140) => pts([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]);
  const sideWin = (y0: number, y1: number, z0: number, z1: number) => pts([[190, y0, z0], [190, y1, z0], [190, y1, z1], [190, y0, z1]]);
  const glow = 0.4 + 0.6 * focus.home;
  return (
    <g>
      <polygon points={pts([[70, 50, 62], [190, 50, 62], [190, 95, 104], [70, 95, 104]])} fill={color.card} />
      <polygon points={front.left} fill={color.left} />
      <polygon points={front.right} fill={color.right} />
      <polygon points={win(80, 100, 28, 46)} fill={color.homeTint} />
      <polygon points={win(150, 176, 28, 46)} fill={color.homeTint} />
      <polygon points={win(112, 128, 0, 30)} fill={color.card} />
      <polygon points={win(114, 126, 0, 27)} fill={color.right} />
      <polygon points={win(80, 100, 28, 46)} fill={color.home} opacity={0.5 * glow} />
      <polygon points={win(150, 176, 28, 46)} fill={color.home} opacity={0.5 * glow} />
      <polygon points={sideWin(70, 96, 28, 46)} fill={color.homeTint} />
      <polygon points={sideWin(70, 96, 28, 46)} fill={color.home} opacity={0.35 * glow} />
      <polygon points={pts([[70, 140, 62], [190, 140, 62], [190, 95, 104], [70, 95, 104]])} fill={color.card} />
      <polygon points={pts([[190, 50, 62], [190, 140, 62], [190, 95, 104]])} fill={color.right} />
      <polygon points={pts([[70, 140, 62], [190, 140, 62], [190, 140, 60], [70, 140, 60]])} fill={color.right} />
    </g>
  );
};

const Battery = ({ level, focus, frame }: { level: number; focus: Weights; frame: number }) => {
  const x0 = 218;
  const x1 = 250;
  const z0 = 5;
  const z1 = 47;
  const zl = z0 + (z1 - z0) * Math.max(0, Math.min(1, level));
  const face = (a: number, b: number, c: number, d: number) => pts([[a, 120, c], [b, 120, c], [b, 120, d], [a, 120, d]]);
  const ticks = [0.25, 0.5, 0.75].map(t => z0 + (z1 - z0) * t);
  const stripe = ((frame % 30) / 30) * (z1 - z0);
  return (
    <g>
      <Box x={214} y={96} z={0} dx={40} dy={24} dz={54} />
      <polygon points={face(x0, x1, z0, z1)} fill={color.card} />
      <g opacity={0.4 + 0.6 * focus.battery}>
        <polygon points={face(x0, x1, z0, zl)} fill={color.battery} />
        {level < 1 && frame >= 0 && (
          <polygon points={face(x0, x1, Math.min(zl, z0 + stripe), Math.min(zl, z0 + stripe + 3))} fill={color.batteryTint} opacity={0.55} />
        )}
      </g>
      {ticks.map(z => (
        <polygon key={z} points={face(x0, x1, z - 0.6, z + 0.6)} fill={color.left} opacity={0.9} />
      ))}
      <polygon points={pts([[226, 96, 54], [242, 96, 54], [242, 108, 54], [226, 108, 54]])} fill={color.left} />
    </g>
  );
};

const Pole = ({ focus }: { focus: Weights }) => {
  const o = 0.4 + 0.6 * focus.grid;
  const [a, b] = P(4, 179, 106);
  const [c, d] = P(34, 179, 106);
  return (
    <g>
      <Box x={24} y={170} z={0} dx={12} dy={10} dz={22} />
      <polygon points={pts([[26, 180, 8], [34, 180, 8], [34, 180, 18], [26, 180, 18]])} fill={color.grid} opacity={o} />
      <Box x={16} y={176} z={0} dx={6} dy={6} dz={112} left={color.grid} right={color.gridText} top={color.right} />
      <Box x={4} y={177} z={104} dx={30} dy={4} dz={4} left={color.grid} right={color.gridText} top={color.right} />
      <path d={`M${a} ${b}Q${a - 22} ${b + 8} ${a - 40} ${b - 6}`} fill="none" stroke={color.grid} strokeWidth={1.2} opacity={o} />
      <path d={`M${c} ${d}Q${c - 26} ${d + 10} ${c - 48} ${d - 2}`} fill="none" stroke={color.grid} strokeWidth={1.2} opacity={o} />
    </g>
  );
};

export const Flow = ({ route, kw, frame, hueId, weight, width = 3.4, period = 18 }: { route: V3[]; kw: number; frame: number; hueId: Hue; weight: number; width?: number; period?: number }) => {
  const d = pathOf(route);
  const offset = -frame * kw;
  const active = Math.abs(kw) > 0.05;
  return (
    <g>
      <path d={d} fill="none" stroke={color.left} strokeWidth={width + 3.6} strokeLinecap="round" strokeLinejoin="round" />
      {active && (
        <path
          d={d}
          fill="none"
          stroke={hue[hueId].line}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`8 ${period - 8}`}
          strokeDashoffset={offset}
          opacity={0.4 + 0.6 * weight}
        />
      )}
    </g>
  );
};

export const Sun = ({ x, y, r = 15, angle = 0, weight = 1 }: { x: number; y: number; r?: number; angle?: number; weight?: number }) => (
  <g transform={`translate(${x} ${y})`} opacity={0.4 + 0.6 * weight}>
    <g transform={`rotate(${angle})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={-1.6} y={-r - 11} width={3.2} height={7} rx={1.6} fill={color.sun} transform={`rotate(${i * 45})`} />
      ))}
    </g>
    <circle r={r} fill={color.sun} />
  </g>
);

export interface Tag {
  hue: Hue;
  value: string;
  label: string;
  at: [number, number];
  dx: number;
  dy: number;
  opacity?: number;
}

export const TagView = ({ tag, size }: { tag: Tag; size: number }) => {
  const w = size * 4.6;
  const h = size * 2.3;
  const [x, y] = tag.at;
  const bx = x + tag.dx - w / 2;
  const by = y + tag.dy - h / 2;
  return (
    <g opacity={tag.opacity ?? 1}>
      <line x1={x} y1={y} x2={x + tag.dx} y2={y + tag.dy} stroke={color.right} strokeWidth={size * 0.09} />
      <circle cx={x} cy={y} r={size * 0.16} fill={hue[tag.hue].line} />
      <rect x={bx} y={by + size * 0.18} width={w} height={h} rx={size * 0.3} fill={color.right} />
      <rect x={bx} y={by} width={w} height={h} rx={size * 0.3} fill={color.card} />
      <text x={bx + size * 0.4} y={by + size * 1.12} fontFamily={fontFamily} fontSize={size} fontWeight={800} style={{ fontStretch: '75%', fontVariantNumeric: num.fontVariantNumeric }} fill={hue[tag.hue].text}>
        {tag.value}
      </text>
      <text x={bx + size * 0.4} y={by + size * 1.95} fontFamily={fontFamily} fontSize={size * 0.58} fontWeight={500} fill={color.secondary}>
        {tag.label}
      </text>
    </g>
  );
};

export const HouseScene = ({
  width,
  height,
  camera,
  frame,
  level,
  focus = allOn,
  flows,
  tags = [],
  tagSize = 13,
  sunAngle = 0,
  glint = 0,
  extra,
  back,
  sunAt,
  style,
}: {
  width: number;
  height: number;
  camera: Camera;
  frame: number;
  level: number;
  focus?: Weights;
  flows: Flows;
  tags?: Tag[];
  tagSize?: number;
  sunAngle?: number;
  glint?: number;
  extra?: ReactNode;
  back?: ReactNode;
  sunAt?: [number, number];
  style?: CSSProperties;
}) => {
  const plate = faces({ x: 0, y: 0, z: -10, dx: 262, dy: 196, dz: 10 });
  const [sx, sy] = sunAt ?? P(150, 60, 150);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <g transform={`translate(${width / 2} ${height / 2}) scale(${camera.scale}) translate(${-camera.x} ${-camera.y})`}>
        <polygon points={plate.left} fill={color.left} />
        <polygon points={plate.right} fill={color.right} />
        <polygon points={plate.top} fill={color.card} />
        {back}
        <Sun x={sx} y={sy} angle={sunAngle} weight={focus.sun} />
        <Flow route={routes.grid} kw={flows.grid} frame={frame} hueId="grid" weight={focus.grid} />
        <Flow route={routes.home} kw={flows.home} frame={frame} hueId="home" weight={focus.home} />
        <Flow route={routes.battery} kw={flows.battery} frame={frame} hueId="battery" weight={focus.battery} />
        <House focus={focus} />
        <g opacity={0.55 + 0.45 * focus.sun}>
          <Panels glint={glint} />
        </g>
        <Flow route={routes.sun} kw={flows.sun} frame={frame} hueId="sun" weight={focus.sun} />
        <Pole focus={focus} />
        <Battery level={level} focus={focus} frame={frame} />
        <Box x={198} y={146} z={0} dx={16} dy={16} dz={20} />
        <polygon points={pts([[201, 162, 12], [211, 162, 12], [211, 162, 15], [201, 162, 15]])} fill={color.sun} opacity={0.4 + 0.6 * focus.sun} />
        {extra}
        {tags.map(tag => (
          <TagView key={tag.label} tag={tag} size={tagSize} />
        ))}
      </g>
    </svg>
  );
};
