import type { CSSProperties, ReactNode } from 'react';
import { Easing, interpolate } from 'remotion';
import { advanceSteps, advances } from '../advances';
import { color, family, slam, stretch } from '../tokens';

export const fontFamily = `'${family}', sans-serif`;

export const capRatio = 0.675;
export const capTop = 0.1025;

export const vf = (wght: number, wdth: number): CSSProperties => ({
  fontFamily,
  fontWeight: wght,
  fontStretch: `${wdth}%`,
  fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}`,
  fontFeatureSettings: "'tnum'",
});

const advanceAt = (ch: string, wdth: number) => {
  const row = advances[ch] ?? advances[ch.toUpperCase()] ?? advanceSteps.map(step => 0.62 * (step / 100));
  const w = Math.min(150, Math.max(50, wdth));
  const i = Math.min(advanceSteps.length - 2, Math.floor((w - 50) / 25));
  const t = (w - advanceSteps[i]) / 25;
  return row[i] + (row[i + 1] - row[i]) * t;
};

export const emWidth = (text: string, wdth: number) => [...text].reduce((sum, ch) => sum + advanceAt(ch, wdth), 0);

const dot = { size: 0.121, rise: 0.7565 };

const dotCentres = (text: string, wdth: number) => {
  const chars = [...text];
  return chars.flatMap((ch, i) => (ch === 'Ż' ? [emWidth(chars.slice(0, i).join(''), wdth) + advanceAt(ch, wdth) / 2] : []));
};

export const fitSize = (text: string, wdth: number, maxWidth: number, maxCap = Infinity) =>
  Math.min(maxWidth / (emWidth(text, wdth) * 1.015), maxCap / capRatio);

export const fitWdth = (text: string, size: number, maxWidth: number) => {
  let lo = 50;
  let hi = 150;
  if (emWidth(text, lo) * size * 1.015 > maxWidth) return 50;
  if (emWidth(text, hi) * size * 1.015 <= maxWidth) return 150;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (emWidth(text, mid) * size * 1.015 <= maxWidth) lo = mid;
    else hi = mid;
  }
  return lo;
};

const slamEase = Easing.bezier(...slam.points);
const stretchEase = Easing.bezier(...stretch.points);
export const slamFrames = 8;
export const stretchFrames = 12;

export const slamScale = (frame: number, start: number) =>
  frame < start ? 0 : 1.4 - 0.4 * slamEase(Math.min(1, (frame - start) / slamFrames));

export const shown = (frame: number, start: number) => frame >= start;

export const widthAt = (frame: number, keys: { at: number; w: number }[]) => {
  let value = keys[0].w;
  for (let i = 1; i < keys.length; i += 1) {
    const key = keys[i];
    if (frame < key.at) break;
    const t = stretchEase(interpolate(frame, [key.at, key.at + stretchFrames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
    value = keys[i - 1].w + (key.w - keys[i - 1].w) * t;
  }
  return value;
};

export const Cap = ({
  text,
  size,
  wdth,
  wght = 900,
  fill = color.ink,
  scale = 1,
  origin = 'left bottom',
  style,
}: {
  text: string;
  size: number;
  wdth: number;
  wght?: number;
  fill?: string;
  scale?: number;
  origin?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'relative',
      height: size * capRatio,
      width: emWidth(text, wdth) * size,
      transform: scale === 1 ? undefined : `scale(${scale})`,
      transformOrigin: origin,
      ...style,
    }}>
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: -size * capTop,
        whiteSpace: 'nowrap',
        fontSize: size,
        lineHeight: `${size}px`,
        color: fill,
        ...vf(wght, wdth),
      }}>
      {wdth > 100 ? text.replace(/Ż/g, 'Z') : text}
    </span>
    {wdth > 100 &&
      dotCentres(text, wdth).map(x => (
        <div
          key={x}
          style={{
            position: 'absolute',
            left: (x - dot.size / 2) * size,
            top: (capRatio - dot.rise - dot.size / 2) * size,
            width: dot.size * size,
            height: dot.size * size,
            borderRadius: '50%',
            background: fill,
          }}
        />
      ))}
  </div>
);

export const Label = ({
  children,
  fill = color.secondary,
  size = 15,
  wght = 700,
  wdth = 75,
  style,
}: {
  children: ReactNode;
  fill?: string;
  size?: number;
  wght?: number;
  wdth?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: `${Math.round(size * 1.2)}px`,
      letterSpacing: size * 0.06,
      color: fill,
      whiteSpace: 'nowrap',
      ...vf(wght, wdth),
      ...style,
    }}>
    {children}
  </div>
);

export const Abs = ({ style, children }: { style: CSSProperties; children?: ReactNode }) => (
  <div style={{ position: 'absolute', ...style }}>{children}</div>
);

export const Screen = ({ background = color.ground, children }: { background?: string; children: ReactNode }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background, color: color.ink, fontFamily }}>{children}</div>
);

export const Check = ({ size, stroke }: { size: number; stroke: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={stroke} strokeWidth="3.6" strokeLinecap="square" />
  </svg>
);
