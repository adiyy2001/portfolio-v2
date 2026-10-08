import type { ReactNode } from 'react';
import { color, fontFamily } from '../tokens';
import type { Sample } from '../data';

export interface Scale {
  x: (h: number) => number;
  y: (v: number) => number;
  w: number;
  h: number;
}

export const makeScale = (w: number, h: number, yMax: number, x0 = 0, x1 = 24): Scale => ({
  x: hour => ((hour - x0) / (x1 - x0)) * w,
  y: v => h - (v / yMax) * h,
  w,
  h,
});

export const series = (rows: Sample[], pick: (row: Sample) => number, from = 0, to = 24) => {
  const out: [number, number][] = [];
  for (const row of rows) {
    const start = row.t - 1 / 24;
    if (start < from - 1e-6 || start > to + 1e-6) continue;
    out.push([start, pick(row)]);
  }
  return out;
};

export const line = (points: [number, number][], s: Scale) =>
  points.map(([hh, v], i) => `${i ? 'L' : 'M'}${s.x(hh).toFixed(2)} ${s.y(v).toFixed(2)}`).join(' ');

export const area = (points: [number, number][], s: Scale, base: (hh: number) => number = () => 0) => {
  if (!points.length) return '';
  const top = points.map(([hh, v]) => `${s.x(hh).toFixed(2)} ${s.y(v).toFixed(2)}`);
  const bottom = [...points].reverse().map(([hh]) => `${s.x(hh).toFixed(2)} ${s.y(base(hh)).toFixed(2)}`);
  return `M${top.join(' L')} L${bottom.join(' L')} Z`;
};

export const Plot = ({
  id,
  left,
  top,
  width,
  height,
  scale,
  yTicks,
  yUnit,
  xTicks = [0, 6, 12, 18, 24],
  reveal = 1,
  children,
}: {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scale: Scale;
  yTicks: number[];
  yUnit: string;
  xTicks?: number[];
  reveal?: number;
  children: (clip: string) => ReactNode;
}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left, top, overflow: 'visible', fontFamily }}>
    <defs>
      <clipPath id={`${id}-clip`}>
        <rect x={-4} y={-40} width={Math.max(0, scale.w * reveal + 4)} height={scale.h + 44} />
      </clipPath>
    </defs>
    {yTicks.map(v => (
      <g key={v}>
        <line x1={0} x2={scale.w} y1={scale.y(v)} y2={scale.y(v)} stroke={color.left} strokeWidth={1} />
        <text x={-8} y={scale.y(v) + 4} textAnchor="end" fontSize={11} fill={color.secondary} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {v}
        </text>
      </g>
    ))}
    <text x={-8} y={-12} textAnchor="end" fontSize={11} fill={color.secondary}>
      {yUnit}
    </text>
    {xTicks.map(hh => (
      <text key={hh} x={scale.x(hh)} y={scale.h + 18} textAnchor="middle" fontSize={11} fill={color.secondary} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {`${hh}:00`}
      </text>
    ))}
    {children(`url(#${id}-clip)`)}
  </svg>
);
