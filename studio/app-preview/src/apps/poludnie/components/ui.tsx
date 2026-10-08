import type { CSSProperties, ReactNode } from 'react';
import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, fontFamily, hue, num, semi, slab, type Hue } from '../tokens';
import { tabs, type TabId } from '../content';
import { mixN, trackAt } from './motion';

export const layer: CSSProperties = { position: 'absolute', inset: 0 };

export const Screen = ({ time, children, bar = true }: { time: string; children: ReactNode; bar?: boolean }) => (
  <div style={{ ...layer, background: color.ground, fontFamily, color: color.ink }}>
    {children}
    {bar && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
    <HomeIndicator color={color.ink} />
  </div>
);

export const Txt = ({
  x,
  y,
  size,
  weight = 400,
  tone = color.ink,
  w,
  align = 'left',
  line = 1.25,
  numeric = false,
  stretch,
  style,
  children,
}: {
  x: number;
  y: number;
  size: number;
  weight?: number;
  tone?: string;
  w?: number;
  align?: 'left' | 'center' | 'right';
  line?: number;
  numeric?: boolean;
  stretch?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      fontSize: size,
      lineHeight: line,
      fontWeight: weight,
      color: tone,
      textAlign: align,
      whiteSpace: 'nowrap',
      ...(numeric ? num : {}),
      ...(stretch ? { fontStretch: stretch } : {}),
      ...style,
    }}>
    {children}
  </div>
);

export const Card = ({ x, y, w, h, children, style, tone = color.card }: { x: number; y: number; w: number; h: number; children?: ReactNode; style?: CSSProperties; tone?: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, background: tone, boxShadow: slab(), ...style }}>{children}</div>
);

export const Dot = ({ hueId, size = 10, style }: { hueId: Hue; size?: number; style?: CSSProperties }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: size / 2, background: hue[hueId].line, ...style }} />
);

export const Header = ({ title, sub, back, style }: { title: string; sub?: string; back?: string; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: 22, top: back ? 60 : 64, right: 22, ...style }}>
    {back && (
      <div style={{ fontSize: 15, ...semi, color: color.secondary, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
        <svg width="10" height="16" viewBox="0 0 10 16">
          <path d="M8 2L2 8l6 6" fill="none" stroke={color.secondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {back}
      </div>
    )}
    <div style={{ fontSize: 30, lineHeight: '36px', fontWeight: 700, letterSpacing: -0.3 }}>{title}</div>
    {sub && <div style={{ marginTop: 4, fontSize: 15, lineHeight: '20px', color: color.secondary }}>{sub}</div>}
  </div>
);

const icon = (id: TabId, stroke: string) => {
  const common = { fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'now')
    return (
      <svg width="26" height="26" viewBox="0 0 26 26">
        <path d="M4 12l9-7 9 7v10H4z" {...common} />
        <path d="M14 11l-3 5h4l-3 5" {...common} />
      </svg>
    );
  if (id === 'day')
    return (
      <svg width="26" height="26" viewBox="0 0 26 26">
        <path d="M3 21h20" {...common} />
        <path d="M4 19c4 0 5-13 9-13s5 13 9 13" {...common} />
      </svg>
    );
  if (id === 'tips')
    return (
      <svg width="26" height="26" viewBox="0 0 26 26">
        <circle cx="13" cy="13" r="9" {...common} />
        <path d="M13 8v5l3 3" {...common} />
      </svg>
    );
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r="9" {...common} />
      <path d="M13 4v9h9" {...common} />
    </svg>
  );
};

export const tabBarTop = 876;

export const TabBar = ({ f, from, to, at, style }: { f: number; from: TabId; to: TabId; at: number; style?: CSSProperties }) => {
  const t = trackAt(f, at, 12);
  const index = (id: TabId) => tabs.findIndex(tab => tab.id === id);
  const slot = 443 / tabs.length;
  const pos = mixN(index(from), index(to), t);
  return (
    <div style={{ position: 'absolute', left: 0, top: tabBarTop, width: 443, height: 84, background: color.card, boxShadow: `0 -1px 0 ${color.left}`, zIndex: 40, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: pos * slot + slot / 2 - 18, width: 36, height: 3, borderRadius: 2, background: color.sun }} />
      {tabs.map((tab, i) => {
        const active = Math.max(0, 1 - Math.abs(pos - i));
        const tone = active > 0.5 ? color.ink : color.secondary;
        return (
          <div key={tab.id} style={{ position: 'absolute', left: i * slot, top: 10, width: slot, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {icon(tab.id, tone)}
            <span style={{ fontSize: 12, fontWeight: active > 0.5 ? 600 : 500, color: tone }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Big = ({ x, y, value, unit, tone = color.ink, size = 88, style }: { x: number; y: number; value: string; unit: string; tone?: string; size?: number; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'baseline', gap: size * 0.08, color: tone, ...style }}>
    <span style={{ ...num, fontSize: size, lineHeight: 0.95, letterSpacing: -size * 0.01 }}>{value}</span>
    <span style={{ ...num, fontSize: size * 0.4, lineHeight: 1 }}>{unit}</span>
  </div>
);

export const Chip = ({ children, hueId, style }: { children: ReactNode; hueId: Hue; style?: CSSProperties }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 14, background: hue[hueId].tint, color: color.ink, fontSize: 13, ...semi, whiteSpace: 'nowrap', ...style }}>
    <Dot hueId={hueId} size={8} />
    {children}
  </span>
);

const wp = (x: number, y: number, z: number) => [32 + (x - y) * 0.866, 30 + (x + y) / 2 - z] as const;
const wpoly = (list: [number, number, number][]) => list.map(v => wp(...v).map(n => n.toFixed(1)).join(',')).join(' ');

export const Washer = ({ size = 60 }: { size?: number }) => {
  const [ox, oy] = wp(0, 24, 0);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <polygon points={wpoly([[0, 0, 32], [30, 0, 32], [30, 24, 32], [0, 24, 32]])} fill={color.card} />
      <polygon points={wpoly([[0, 24, 0], [30, 24, 0], [30, 24, 32], [0, 24, 32]])} fill={color.left} />
      <polygon points={wpoly([[30, 0, 0], [30, 24, 0], [30, 24, 32], [30, 0, 32]])} fill={color.right} />
      <g transform={`matrix(0.866 0.5 0 -1 ${ox.toFixed(1)} ${oy.toFixed(1)})`}>
        <rect x={3} y={25} width={24} height={4} fill={color.right} />
        <circle cx={15} cy={12} r={8.5} fill={color.card} />
        <circle cx={15} cy={12} r={6.2} fill={color.homeTint} stroke={color.home} strokeWidth={1.6} />
        <circle cx={24} cy={27} r={1.4} fill={color.home} />
      </g>
    </svg>
  );
};
