import type { CSSProperties, ReactNode } from 'react';
import qrcode from 'qrcode-generator';
import { Easing } from 'remotion';
import { color, family, liveCycleFrames, radius, shadow, type } from '../tokens';
import { tabs } from '../content';
import { TabIcon } from './glyphs';

export const fontFamily = `'${family}', sans-serif`;

export const text = (role: keyof typeof type, extra: CSSProperties = {}): CSSProperties => ({
  fontFamily,
  fontSize: type[role].size,
  lineHeight: `${type[role].line}px`,
  fontWeight: type[role].weight,
  ...extra,
});

export const Abs = ({ style, children }: { style: CSSProperties; children?: ReactNode }) => (
  <div style={{ position: 'absolute', ...style }}>{children}</div>
);

export const ScreenBase = ({ background, children, style }: { background: string; children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background,
      color: color.ink,
      fontFamily,
      fontFeatureSettings: "'tnum'",
      ...style,
    }}>
    {children}
  </div>
);

export const TabBar = ({ active }: { active: (typeof tabs)[number] }) => (
  <Abs
    style={{
      left: 0,
      right: 0,
      bottom: 0,
      height: 86,
      background: 'rgba(255,255,255,0.96)',
      borderTop: `1px solid ${color.separator}`,
      display: 'flex',
      justifyContent: 'space-around',
      paddingTop: 8,
      boxSizing: 'border-box',
      zIndex: 20,
    }}>
    {tabs.map(tab => {
      const tint = tab === active ? color.brand : color.secondary;
      return (
        <div key={tab} style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <TabIcon name={tab} tint={tint} />
          <span style={{ fontFamily, fontSize: 11, fontWeight: 600, color: tint }}>{tab}</span>
        </div>
      );
    })}
  </Abs>
);

export const NavTitle = ({ title, collapse, background }: { title: string; collapse: number; background: string }) => {
  const shown = Math.min(1, Math.max(0, (collapse - 0.55) / 0.35));
  return (
    <Abs
      style={{
        left: 0,
        right: 0,
        top: 0,
        height: 98,
        zIndex: 15,
        background: `rgba(${background},${shown * 0.94})`,
        borderBottom: `1px solid rgba(228,231,235,${shown})`,
      }}>
      <Abs style={{ left: 0, right: 0, top: 64, textAlign: 'center', opacity: shown, ...text('headline') }}>{title}</Abs>
    </Abs>
  );
};

export const LargeTitle = ({ title, y, collapse = 0 }: { title: string; y: number; collapse?: number }) => (
  <Abs style={{ left: 18, top: y, ...text('largeTitle'), letterSpacing: -0.6, opacity: Math.max(0, 1 - collapse * 1.6) }}>{title}</Abs>
);

export const SectionHeader = ({ label, y }: { label: string; y: number }) => (
  <Abs style={{ left: 34, top: y, ...text('caption'), color: color.secondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>
    {label}
  </Abs>
);

export const Button = ({
  label,
  kind = 'primary',
  pressed = 0,
  style,
  children,
}: {
  label?: string;
  kind?: 'primary' | 'tinted' | 'plain';
  pressed?: number;
  style: CSSProperties;
  children?: ReactNode;
}) => {
  const palette = {
    primary: { bg: pressed > 0.5 ? color.brandDeep : color.brand, fg: '#fff' },
    tinted: { bg: color.surface, fg: color.brand },
    plain: { bg: color.brandTint, fg: color.brandDeep },
  }[kind];
  return (
    <Abs
      style={{
        height: 54,
        borderRadius: radius.button,
        background: palette.bg,
        color: palette.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transform: `scale(${1 - pressed * 0.03})`,
        boxShadow: kind === 'tinted' ? shadow.card : 'none',
        ...text('headline'),
        ...style,
      }}>
      {children ?? label}
    </Abs>
  );
};

export const Scrim = ({ amount }: { amount: number }) =>
  amount <= 0 ? null : <Abs style={{ inset: 0, background: `rgba(0,0,0,${amount * 0.3})`, zIndex: 30 }} />;

export const Sheet = ({ top, children, height }: { top: number; height: number; children: ReactNode }) => (
  <Abs
    style={{
      left: 0,
      right: 0,
      top,
      height,
      background: color.surface,
      borderTopLeftRadius: radius.sheet,
      borderTopRightRadius: radius.sheet,
      boxShadow: shadow.sheet,
      zIndex: 40,
      overflow: 'hidden',
    }}>
    <Abs style={{ left: '50%', top: 6, width: 38, height: 5, marginLeft: -19, borderRadius: 3, background: '#D4D8DD' }} />
    {children}
  </Abs>
);

const liveEase = Easing.bezier(0.45, 0, 0.55, 1);

export const liveOffset = (frame: number, period: number) => {
  const cycle = Math.floor(frame / liveCycleFrames);
  const t = (frame - cycle * liveCycleFrames) / liveCycleFrames;
  return ((cycle + liveEase(t)) * period) % period;
};

export const LiveBand = ({
  frame,
  live,
  label,
  height,
  fill = 1,
  radiusTop = radius.card,
}: {
  frame: number;
  live: number;
  label: string;
  height: number;
  fill?: number;
  radiusTop?: number;
}) => {
  const period = 28 / Math.sin((115 * Math.PI) / 180);
  const word = 250;
  const offset = liveOffset(frame, period);
  const textOffset = liveOffset(frame, word);
  return (
    <Abs
      style={{
        left: 0,
        right: 0,
        top: 0,
        height,
        overflow: 'hidden',
        borderTopLeftRadius: radiusTop,
        borderTopRightRadius: radiusTop,
        background: color.brandTint,
      }}>
      <Abs style={{ left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: color.brand, overflow: 'hidden' }}>
        <Abs
          style={{
            left: -period * 2 + offset,
            top: 0,
            bottom: 0,
            width: 900,
            backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0) 0 14px, rgba(255,255,255,0.13) 14px 28px)`,
            opacity: live,
          }}
        />
        <Abs
          style={{
            left: -word + textOffset,
            top: 0,
            height,
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            color: '#fff',
            ...text('caption', { fontWeight: 700, letterSpacing: 1.1 }),
            opacity: live,
          }}>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} style={{ display: 'inline-block', width: word, paddingLeft: 16, boxSizing: 'border-box' }}>
              {label}
            </span>
          ))}
        </Abs>
      </Abs>
    </Abs>
  );
};

const qrCache = new Map<string, boolean[][]>();

export const qrMatrix = (data: string) => {
  const known = qrCache.get(data);
  if (known) return known;
  const qr = qrcode(0, 'M');
  qr.addData(data);
  qr.make();
  const n = qr.getModuleCount();
  const grid = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => qr.isDark(r, c)));
  qrCache.set(data, grid);
  return grid;
};

export const QrCode = ({
  data,
  size,
  wave = 1,
  shimmer = -1,
}: {
  data: string;
  size: number;
  wave?: number;
  shimmer?: number;
}) => {
  const grid = qrMatrix(data);
  const n = grid.length;
  const quiet = 2;
  const total = n + quiet * 2;
  const centre = (n - 1) / 2;
  const maxDist = Math.hypot(centre, centre);
  const cells: ReactNode[] = [];
  grid.forEach((row, r) =>
    row.forEach((dark, c) => {
      if (!dark) return;
      const dist = Math.hypot(r - centre, c - centre) / maxDist;
      const appear = Math.min(1, Math.max(0, (wave * 1.35 - dist) / 0.35));
      if (appear <= 0) return;
      const diag = (r + c) / (2 * (n - 1));
      const glow = shimmer < 0 ? 0 : Math.max(0, 1 - Math.abs(diag - shimmer) / 0.12);
      const s = 0.55 + 0.45 * appear;
      const inset = (1 - s) / 2;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c + quiet + inset}
          y={r + quiet + inset}
          width={s + 0.02}
          height={s + 0.02}
          rx={0.12}
          fill={glow > 0.05 ? color.brand : color.ink}
          opacity={appear}
        />,
      );
    }),
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} style={{ display: 'block' }}>
      {cells}
    </svg>
  );
};

export const Ring = ({ progress, size = 30, stroke = 3.2 }: { progress: number; size?: number; stroke?: number }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,107,63,0.22)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color.brand}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

export const clockText = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
