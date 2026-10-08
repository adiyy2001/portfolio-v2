import type { CSSProperties, ReactNode } from 'react';
import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { springAt } from '../../../shared/motion';
import { bounce, clay, clayFlat, clayPressed, color, fontFamily, radius, rgba, type Tone } from '../tokens';
import { tabs, type Plant, type Species, type TabId } from '../content';
import { checkSvg, dropSvg, mascotSvg, plantSvg, tabIcon, type MascotPose } from './art';
import { rest, type Body } from './motion';

export const layer: CSSProperties = { position: 'absolute', inset: 0 };

export const Svg = ({ html, style }: { html: string; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', ...style }} dangerouslySetInnerHTML={{ __html: html }} />
);

export const Screen = ({ time, children, bar = true }: { time: string; children: ReactNode; bar?: boolean }) => (
  <div style={{ ...layer, background: color.ground, fontFamily, color: color.ink }}>
    {children}
    {bar && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
    <HomeIndicator color={color.ink} />
  </div>
);

export const Box = ({
  x,
  y,
  w,
  h,
  tone = 'card',
  r = radius.card,
  lift = 1,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  tone?: Tone;
  r?: number;
  lift?: number;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: r,
      background: color[tone],
      boxShadow: lift > 0 ? clay(lift) : clayFlat(),
      boxSizing: 'border-box',
      ...style,
    }}>
    {children}
  </div>
);

export const Text = ({
  x,
  y,
  size,
  weight = 500,
  tone = color.ink,
  w,
  align = 'left',
  line = 1.25,
  style,
  children,
}: {
  x: number;
  y: number;
  size: number;
  weight?: 500 | 800 | 900;
  tone?: string;
  w?: number;
  align?: 'left' | 'center' | 'right';
  line?: number;
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
      fontWeight: weight,
      lineHeight: line,
      color: tone,
      textAlign: align,
      letterSpacing: size >= 26 ? -size * 0.01 : 0,
      ...style,
    }}>
    {children}
  </div>
);

export const Mascot = ({
  x,
  y,
  w,
  body = rest,
  pose,
  style,
}: {
  x: number;
  y: number;
  w: number;
  body?: Body;
  pose: MascotPose;
  style?: CSSProperties;
}) => {
  const h = (w * 240) / 200;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translateY(${body.y}px) scale(${body.sx}, ${body.sy})`,
        transformOrigin: '50% 95%',
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: mascotSvg(pose) }}
    />
  );
};

export const Drop = ({ x, y, w, id, body = rest, style }: { x: number; y: number; w: number; id: string; body?: Body; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - w * 1.3,
      width: w,
      height: w * 1.3,
      transform: `translateY(${body.y}px) scale(${body.sx}, ${body.sy})`,
      transformOrigin: '50% 100%',
      ...style,
    }}
    dangerouslySetInnerHTML={{ __html: dropSvg(id) }}
  />
);

export const DropGlyph = ({ size = 14, id }: { size?: number; id: string }) => (
  <span style={{ display: 'inline-block', width: size, height: size * 1.3, verticalAlign: '-0.15em' }} dangerouslySetInnerHTML={{ __html: dropSvg(id) }} />
);

export const Avatar = ({
  species,
  tone,
  size,
  id,
  x,
  y,
  style,
}: {
  species: Species;
  tone: Tone;
  size: number;
  id: string;
  x?: number;
  y?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: x === undefined ? 'relative' : 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      flex: 'none',
      borderRadius: size / 2,
      background: color[tone],
      boxShadow: clayFlat(size / 60),
      ...style,
    }}>
    <div
      style={{ position: 'absolute', left: size * 0.12, top: size * 0.06, width: size * 0.76, height: size * 0.76 }}
      dangerouslySetInnerHTML={{ __html: plantSvg(species, id) }}
    />
  </div>
);

export const PlantAvatar = ({ plant, size, id, x, y, style }: { plant: Plant; size: number; id: string; x?: number; y?: number; style?: CSSProperties }) => (
  <Avatar species={plant.glyph} tone={plant.tone} size={size} id={id} x={x} y={y} style={style} />
);

export const Pill = ({
  tone = 'water',
  children,
  size = 14,
  style,
  flat = true,
}: {
  tone?: Tone;
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
  flat?: boolean;
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: size * 2,
      padding: `0 ${size * 0.8}px`,
      borderRadius: size,
      background: color[tone],
      boxShadow: flat ? clayFlat(0.8) : clay(0.5, 0.8),
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      color: color.ink,
      ...style,
    }}>
    {children}
  </span>
);

export const Check = ({ size, tone = 'card', style }: { size: number; tone?: Tone; style?: CSSProperties }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color[tone], boxShadow: clay(0.4, 0.7), position: 'relative', ...style }}>
    <div style={{ position: 'absolute', inset: size * 0.2 }} dangerouslySetInnerHTML={{ __html: checkSvg(color.ink) }} />
  </div>
);

export const Chip = ({
  label,
  on = 0,
  press = 0,
  style,
}: {
  label: string;
  on?: number;
  press?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      height: 44,
      padding: '0 18px',
      borderRadius: 22,
      background: on > 0.5 ? color.butter : color.card,
      boxShadow: on > 0.5 ? clay(0.5, 0.9) : press > 0.2 ? clayPressed : clay(0.45, 0.8),
      fontSize: 15,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      transform: `scale(${1 - press * 0.07}, ${1 - press * 0.1})`,
      gap: 8,
      ...style,
    }}>
    {on > 0.5 && <span style={{ width: 16, height: 16, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: checkSvg(color.ink, 3.6) }} />}
    {label}
  </div>
);

export const Touch = ({ x, y, t }: { x: number; y: number; t: number }) =>
  t > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x - 28,
        top: y - 28,
        width: 56,
        height: 56,
        borderRadius: 28,
        background: rgba(color.ink, 0.14 * t),
        transform: `scale(${0.6 + 0.4 * t})`,
        zIndex: 60,
      }}
    />
  ) : null;

const tabX = (i: number) => 20 + 8 + i * ((403 - 16) / 4);
const tabW = (403 - 16) / 4;

export const tabIndex = (id: TabId) => tabs.findIndex(tab => tab.id === id);

export const TabBar = ({ f, from, to, at, style }: { f: number; from: TabId; to: TabId; at: number; style?: CSSProperties }) => {
  const a = tabIndex(from);
  const b = tabIndex(to);
  const s = springAt(bounce, f, at);
  const pos = a + (b - a) * s;
  const stretch = Math.abs(b - a) > 0 ? 1 + 0.18 * Math.sin(Math.min(1, Math.max(0, s)) * Math.PI) : 1;
  const active = s > 0.5 ? b : a;
  return (
    <div style={{ position: 'absolute', left: 20, top: 862, width: 403, height: 74, borderRadius: 37, background: color.card, boxShadow: clay(0.8), zIndex: 40, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: tabX(pos) - 20 + 4,
          top: 8,
          width: tabW - 8,
          height: 58,
          borderRadius: 29,
          background: color.butter,
          boxShadow: clay(0.35, 0.8),
          transform: `scaleX(${stretch})`,
        }}
      />
      {tabs.map((tab, i) => (
        <div key={tab.id} style={{ position: 'absolute', left: tabX(i) - 20, top: 12, width: tabW, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 26, height: 26 }} dangerouslySetInnerHTML={{ __html: tabIcon(tab.id) }} />
          <div style={{ fontSize: 12, fontWeight: i === active ? 900 : 800, color: color.ink }}>{tab.label}</div>
        </div>
      ))}
    </div>
  );
};

export const Splash = ({ x, y, t, id }: { x: number; y: number; t: number; id: string }) => {
  if (t <= 0 || t >= 1) return null;
  const dots = [
    [-1, -0.6, 9],
    [0.15, -1, 7],
    [1, -0.55, 8],
  ];
  return (
    <>
      {dots.map(([dx, dy, s], i) => (
        <div
          key={`${id}-${i}`}
          style={{
            position: 'absolute',
            left: x + dx * 30 * t - s / 2,
            top: y + dy * 26 * t + 30 * t * t - s / 2,
            width: s,
            height: s,
            borderRadius: s / 2,
            background: color.water,
            boxShadow: clayFlat(0.4),
            transform: `scale(${1 - t * 0.7})`,
          }}
        />
      ))}
    </>
  );
};
