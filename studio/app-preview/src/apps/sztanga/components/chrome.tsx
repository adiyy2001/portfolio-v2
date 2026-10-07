import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { session } from '../content';
import { color } from '../tokens';
import { Abs, Label, fontFamily, vf, Cap, Check } from './type';

export const W = 395;
export const side = 24;

export const Chrome = ({ dark = true }: { dark?: boolean }) => {
  const fill = dark ? color.ink : color.ground;
  return (
    <>
      <StatusBar time={session.time} color={fill} fontFamily={fontFamily} />
      <HomeIndicator color={fill} />
    </>
  );
};

export const Meta = ({ left, right, fill = color.secondary }: { left: string; right: string; fill?: string }) => (
  <Abs style={{ left: side, right: side, top: 64, display: 'flex', justifyContent: 'space-between' }}>
    <Label fill={fill}>{left}</Label>
    <Label fill={fill}>{right}</Label>
  </Abs>
);

export const Button = ({
  label,
  tone,
  top = 812,
  left = side,
  width = W,
  check = false,
}: {
  label: string;
  tone: 'signal' | 'pressed' | 'raised' | 'black';
  top?: number;
  left?: number;
  width?: number;
  check?: boolean;
}) => {
  const bg = tone === 'signal' ? color.signal : tone === 'raised' ? color.raised : color.ground;
  const fg = tone === 'signal' ? color.ground : tone === 'raised' ? color.ink : color.signal;
  return (
    <Abs
      style={{
        left,
        top,
        width,
        height: 72,
        background: bg,
        boxShadow: tone === 'pressed' ? `inset 0 0 0 3px ${color.signal}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}>
      <Cap text={label} size={30} wdth={100} fill={fg} />
      {check && <Check size={30} stroke={fg} />}
    </Abs>
  );
};

export const Markers = ({ total, done, current, top, fill, empty }: { total: number; done: number; current: number; top: number; fill: string; empty: string }) => {
  const gap = 8;
  const w = (W - gap * (total - 1)) / total;
  return (
    <Abs style={{ left: side, top, display: 'flex', gap }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: w,
            height: 12,
            background: i < done ? fill : 'transparent',
            boxShadow: i < done ? undefined : i + 1 === current ? `inset 0 0 0 2px ${fill}` : `inset 0 0 0 2px ${empty}`,
          }}
        />
      ))}
    </Abs>
  );
};

export const Row = ({ term, value, top, fill = color.ink, dim = color.secondary }: { term: string; value: string; top: number; fill?: string; dim?: string }) => (
  <Abs style={{ left: side, right: side, top, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <Label fill={dim}>{term}</Label>
    <div style={{ ...vf(700, 100), fontSize: 18, color: fill, letterSpacing: 0.4 }}>{value}</div>
  </Abs>
);
