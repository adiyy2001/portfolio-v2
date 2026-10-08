import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import { Easing, interpolate } from 'remotion';
import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, display, glow, gridCell, mono, rgba } from '../tokens';
import { scrambleGlyphs, type ScrambleOptions } from './scramble';

export const fontMono = `'${mono}', monospace`;
export const fontDisplay = `'${display}', sans-serif`;
export const W = 443;
export const H = 960;
export const side = 24;
export const inner = W - side * 2;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const scanEase = Easing.bezier(0.65, 0, 0.35, 1);
export const drawEase = Easing.bezier(0.33, 1, 0.68, 1);
export const inOut = Easing.bezier(0.37, 0, 0.63, 1);

export const progress = (f: number, from: number, frames: number, ease: (t: number) => number = t => t) =>
  ease(interpolate(f, [from, from + frames], [0, 1], clamp));

export const drawAt = (f: number, from: number, frames = 18) => progress(f, from, frames, drawEase);

export const pulseAt = (f: number, period = 36) => 0.35 + 0.25 * (0.5 - 0.5 * Math.cos((2 * Math.PI * f) / period));

export const GridClock = createContext({ frame: 0, total: 735 });

export const gridOffset = (frame: number, total: number, cell = gridCell) => {
  const cells = Math.max(1, Math.round(total / 4 / cell));
  return (((frame % total) + total) % total) / total * cells * cell;
};

export const Grid = ({ cell = gridCell, offset = 0, lineColor = color.grid, line = 1, style }: { cell?: number; offset?: number; lineColor?: string; line?: number; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `linear-gradient(${lineColor} ${line}px, transparent ${line}px), linear-gradient(90deg, ${lineColor} ${line}px, transparent ${line}px)`,
      backgroundSize: `${cell}px ${cell}px`,
      backgroundPosition: `${(W % cell) / 2}px ${offset}px`,
      ...style,
    }}
  />
);

export const Abs = ({ style, children }: { style: CSSProperties; children?: ReactNode }) => (
  <div style={{ position: 'absolute', ...style }}>{children}</div>
);

export const Screen = ({ time, children, grid = true }: { time: string; children: ReactNode; grid?: boolean }) => {
  const clock = useContext(GridClock);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: color.void, color: color.text, fontFamily: fontMono, fontFeatureSettings: "'tnum'" }}>
      {grid && <Grid offset={gridOffset(clock.frame, clock.total)} />}
      {children}
      <StatusBar time={time} color={color.text} fontFamily={fontMono} />
      <HomeIndicator color={color.dim} />
    </div>
  );
};

export const Scramble = ({
  text,
  f,
  start,
  opts,
  fill = color.text,
  cycle = color.cyan,
  style,
}: {
  text: string;
  f: number;
  start: number;
  opts?: ScrambleOptions;
  fill?: string;
  cycle?: string;
  style?: CSSProperties;
}) => {
  const glyphs = scrambleGlyphs(text, f, start, opts);
  return (
    <span style={{ whiteSpace: 'pre', ...style }}>
      {glyphs.map((g, i) => (
        <span key={i} style={{ color: g.state === 'done' ? fill : g.state === 'cycling' ? cycle : 'transparent' }}>
          {g.ch}
        </span>
      ))}
    </span>
  );
};

export const Label = ({ children, fill = color.muted, size = 12, style }: { children: ReactNode; fill?: string; size?: number; style?: CSSProperties }) => (
  <span style={{ fontFamily: fontMono, fontWeight: 500, fontSize: size, lineHeight: `${Math.round(size * 1.35)}px`, letterSpacing: size * 0.12, textTransform: 'uppercase', color: fill, ...style }}>
    {children}
  </span>
);

export const Panel = ({
  style,
  outline = color.dim,
  glowAlpha = 0,
  children,
}: {
  style: CSSProperties;
  outline?: string;
  glowAlpha?: number;
  children?: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      background: color.panel,
      boxShadow: [`inset 0 0 0 1.5px ${outline}`, glowAlpha > 0 ? glow(outline, glowAlpha, 14) : null].filter(Boolean).join(', '),
      borderRadius: 4,
      ...style,
    }}>
    {children}
  </div>
);

export const ScanLine = ({ y, width = W }: { y: number; width?: number }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: y - 56, width, height: 56, background: `linear-gradient(${rgba(color.cyan, 0)}, ${rgba(color.cyan, 0.12)})`, pointerEvents: 'none', zIndex: 60 }} />
    <div style={{ position: 'absolute', left: 0, top: y - 1, width, height: 2, background: color.cyan, boxShadow: `${glow(color.cyan, 0.6, 10)}, ${glow(color.cyan, 0.35, 24)}`, zIndex: 61 }} />
  </>
);

export const scanY = (t: number, height = H) => -12 + (height + 40) * t;

export const Wipe = ({ t, from, to, height = H, width = W }: { t: number; from: ReactNode; to: ReactNode; height?: number; width?: number }) => {
  const y = scanY(t, height);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>{from}</div>
      <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 1, clipPath: `inset(0 0 ${Math.max(0, height - y)}px 0)` }}>{to}</div>
      {t > 0 && t < 1 && <ScanLine y={y} width={width} />}
    </>
  );
};

export const Button = ({
  label,
  top,
  tone = 'primary',
  press = 0,
  icon,
  left = side,
  width = inner,
  height = 56,
  f,
  start,
}: {
  label: string;
  top: number;
  tone?: 'primary' | 'ghost' | 'done';
  press?: number;
  icon?: ReactNode;
  left?: number;
  width?: number;
  height?: number;
  f?: number;
  start?: number;
}) => {
  const primary = tone === 'primary';
  const fill = primary ? color.cyan : color.panel;
  const ink = primary ? color.void : tone === 'done' ? color.cyan : color.text;
  const ring = primary ? color.cyan : tone === 'done' ? color.cyan : color.dim;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        background: fill,
        borderRadius: 4,
        boxShadow: [`inset 0 0 0 1.5px ${ring}`, primary || tone === 'done' ? glow(color.cyan, 0.3 + press * 0.35, 12 + press * 14) : null].filter(Boolean).join(', '),
        transform: `scale(${1 - press * 0.025})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: fontMono,
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: 0.4,
        color: ink,
      }}>
      {icon}
      {f !== undefined && start !== undefined ? <Scramble text={label} f={f} start={start} fill={ink} cycle={ink} opts={{ step: 1, min: 4, max: 6 }} /> : label}
    </div>
  );
};

export const pressAt = (f: number, at: number) => {
  if (f < at) return 0;
  const local = f - at;
  if (local < 3) return local / 3;
  return Math.max(0, 1 - (local - 3) / 9);
};

export const Back = ({ title, right, f, start }: { title: string; right?: ReactNode; f?: number; start?: number }) => (
  <Abs style={{ left: side, right: side, top: 62, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.5 3.5L6 9l5.5 5.5" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 17, color: color.text }}>
        {f !== undefined && start !== undefined ? <Scramble text={title} f={f} start={start} opts={{ step: 1 }} /> : title}
      </span>
    </div>
    {right}
  </Abs>
);

export const Wordmark = ({ size = 16 }: { size?: number }) => (
  <span style={{ fontFamily: fontDisplay, fontWeight: 800, fontSize: size, letterSpacing: size * 0.2, color: color.cyan }}>RYGIEL</span>
);

export const Dot = ({ fill, size = 8, glowAlpha = 0.5 }: { fill: string; size?: number; glowAlpha?: number }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: size / 2, background: fill, boxShadow: glow(fill, glowAlpha, 8) }} />
);

export const Check = ({ size = 18, stroke = color.cyan, t = 1, width = 2 }: { size?: number; stroke?: string; t?: number; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10.5l4 4 8-9" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
  </svg>
);

export const Warn = ({ size = 14, stroke = color.warn }: { size?: number; stroke?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
    <path d="M8 2L15 14H1z" />
    <path d="M8 6.5v3.5M8 12v.2" />
  </svg>
);

export const toneColor = (tone: string) =>
  tone === 'alert' ? color.alert : tone === 'warn' ? color.warn : tone === 'cyan' ? color.cyan : tone === 'muted' ? color.muted : color.text;

export const Tag = ({ text, tone, style }: { text: string; tone: string; style?: CSSProperties }) => {
  const c = toneColor(tone);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 7px',
        borderRadius: 3,
        boxShadow: `inset 0 0 0 1px ${tone === 'muted' ? color.dim : c}`,
        fontFamily: fontMono,
        fontWeight: 500,
        fontSize: 11,
        letterSpacing: 0.3,
        color: c,
        whiteSpace: 'nowrap',
        ...style,
      }}>
      {text}
    </span>
  );
};

export const NavBar = ({ active }: { active: string }) => {
  const items = ['Sejf', 'Alerty', 'Generator', 'Zdrowie'];
  return (
    <Abs style={{ left: 0, right: 0, top: 872, height: 64, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 10, boxSizing: 'border-box', background: color.void, borderTop: `1px solid ${color.grid}`, zIndex: 40 }}>
      {items.map(item => (
        <div key={item} style={{ display: 'grid', justifyItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: item === active ? color.cyan : color.muted }}>
          <span>{item}</span>
          <span style={{ width: 22, height: 2, background: item === active ? color.cyan : 'transparent', boxShadow: item === active ? glow(color.cyan, 0.5, 6) : undefined }} />
        </div>
      ))}
    </Abs>
  );
};
