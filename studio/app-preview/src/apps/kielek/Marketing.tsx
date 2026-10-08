import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { formats } from '../../shared/formats';
import { mix } from '../../shared/motion';
import { bridgeT } from '../../shared/loop';
import { app } from './content';
import { clay, color, fontFamily } from './tokens';
import { marketing, marketingBeats } from './storyboard';
import { AppRoot, StoreFrame } from './Frame';
import { Mascot } from './components/ui';
import { dropSvg, iconSvg, plantSvg } from './components/art';
import { arc, bounceAt, combine, easeIn, easeOut, enter, hop, inOut, landing, leave, progress, puffIn, rest, wiggleAt, type Body } from './components/motion';
import { mascotPose, mascotSmall } from './screens/TodayScreen';
import type { Species } from './content';

export const loopTotal = marketing.duration + marketing.bridge;
const pad = 22;
export const outer = { w: phone.width + pad * 2, h: phone.height + pad * 2, r: phone.radius + pad } as const;

export const phoneTheme: PhoneTheme = {
  body: color.blush,
  edge: color.blush,
  bezel: color.card,
  button: color.blush,
  camera: color.ink,
  shadow: 'none',
};

interface Layout {
  phone: { scale: number; left: number; top: number };
  text: { left: number; top: number; width: number; title: number; line: number | null; kicker: number; align: 'left' | 'center' };
  seat: { x: number; w: number };
  outro: { cy: number; icon: number; name: number; tagline: number };
  props: Prop[];
}

interface Prop {
  kind: 'pot' | 'drop' | 'leaf' | 'blob';
  x: number;
  y: number;
  size: number;
  depth: number;
  phase: number;
  rot?: number;
  species?: Species;
  front?: boolean;
  tone?: 'card' | 'butter' | 'water' | 'pistachio';
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    phone: { scale: 0.8, left: 350, top: 206 },
    text: { left: 960, top: 340, width: 840, title: 96, line: 36, kicker: 26, align: 'left' },
    seat: { x: 0.68, w: 140 },
    outro: { cy: 500, icon: 230, name: 128, tagline: 38 },
    props: [
      { kind: 'blob', x: 470, y: 560, size: 760, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'blob', x: 1640, y: 160, size: 300, depth: 0.25, phase: 2, tone: 'butter' },
      { kind: 'pot', x: 150, y: 820, size: 190, depth: 0.9, phase: 1, species: 'monstera' },
      { kind: 'pot', x: 1790, y: 860, size: 150, depth: 0.7, phase: 3, species: 'sansevieria' },
      { kind: 'drop', x: 210, y: 240, size: 70, depth: 1.1, phase: 0.5 },
      { kind: 'drop', x: 900, y: 140, size: 46, depth: 0.6, phase: 2.2 },
      { kind: 'leaf', x: 860, y: 900, size: 110, depth: 1.3, phase: 1.6, rot: -30, front: true },
      { kind: 'leaf', x: 1520, y: 980, size: 90, depth: 0.8, phase: 4, rot: 20 },
      { kind: 'drop', x: 1840, y: 470, size: 54, depth: 1.2, phase: 3.3, front: true },
    ],
  },
  '9x16': {
    phone: { scale: 1, left: (1080 - phone.width - pad * 2) / 2, top: 790 },
    text: { left: 80, top: 236, width: 860, title: 92, line: 36, kicker: 28, align: 'left' },
    seat: { x: 0.7, w: 170 },
    outro: { cy: 900, icon: 280, name: 150, tagline: 42 },
    props: [
      { kind: 'blob', x: 540, y: 1300, size: 980, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'blob', x: 930, y: 180, size: 300, depth: 0.25, phase: 2, tone: 'butter' },
      { kind: 'pot', x: 130, y: 1500, size: 190, depth: 0.9, phase: 1, species: 'monstera', front: true },
      { kind: 'pot', x: 960, y: 1700, size: 160, depth: 0.7, phase: 3, species: 'calathea', front: true },
      { kind: 'drop', x: 150, y: 860, size: 70, depth: 1.1, phase: 0.5 },
      { kind: 'drop', x: 960, y: 1040, size: 54, depth: 1.2, phase: 3.3, front: true },
      { kind: 'leaf', x: 110, y: 1180, size: 110, depth: 1.3, phase: 1.6, rot: -30, front: true },
      { kind: 'leaf', x: 860, y: 640, size: 80, depth: 0.6, phase: 4, rot: 30 },
    ],
  },
  '1x1': {
    phone: { scale: 0.62, left: (1080 - (phone.width + pad * 2) * 0.62) / 2, top: 400 },
    text: { left: 60, top: 50, width: 960, title: 66, line: null, kicker: 24, align: 'center' },
    seat: { x: 0.72, w: 112 },
    outro: { cy: 500, icon: 200, name: 112, tagline: 32 },
    props: [
      { kind: 'blob', x: 540, y: 760, size: 760, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'pot', x: 150, y: 880, size: 170, depth: 0.9, phase: 1, species: 'monstera' },
      { kind: 'pot', x: 930, y: 900, size: 150, depth: 0.7, phase: 3, species: 'sansevieria' },
      { kind: 'drop', x: 170, y: 520, size: 64, depth: 1.1, phase: 0.5 },
      { kind: 'drop', x: 920, y: 560, size: 50, depth: 1.2, phase: 3.3, front: true },
      { kind: 'leaf', x: 860, y: 1030, size: 90, depth: 1.3, phase: 1.6, rot: -30, front: true },
    ],
  },
};

const orbit = (f: number, depth: number) => {
  const a = (2 * Math.PI * f) / loopTotal;
  return { x: Math.cos(a) * 22 * depth - 22 * depth, y: Math.sin(a) * 12 * depth };
};

const leafSvg = (id: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100%" height="100%" overflow="visible"><defs><radialGradient id="lh-${id}" cx="30%" cy="25%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="0.7"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="ls-${id}" cx="70%" cy="80%" r="75%"><stop offset="0.35" stop-color="${color.ink}" stop-opacity="0"/><stop offset="1" stop-color="${color.ink}" stop-opacity="0.24"/></radialGradient></defs><ellipse cx="50" cy="30" rx="48" ry="28" fill="${color.leaf}"/><ellipse cx="50" cy="30" rx="48" ry="28" fill="url(#ls-${id})"/><ellipse cx="50" cy="30" rx="48" ry="28" fill="url(#lh-${id})"/><path d="M10 31Q50 22 90 31" fill="none" stroke="${color.pistachio}" stroke-width="5" stroke-linecap="round"/></svg>`;

const PropView = ({ prop, f, i, format }: { prop: Prop; f: number; i: number; format: Format }) => {
  const o = orbit(f, prop.depth);
  const bob = Math.sin((2 * Math.PI * f * 2) / loopTotal + prop.phase) * 14 * prop.depth;
  const turn = Math.sin((2 * Math.PI * f) / loopTotal + prop.phase) * 6;
  const id = `${format}-p${i}`;
  const move = `translate(${(o.x).toFixed(2)}px, ${(o.y + bob).toFixed(2)}px)`;
  const base: CSSProperties = { position: 'absolute', left: prop.x - prop.size / 2, top: prop.y - prop.size / 2, width: prop.size, height: prop.size, willChange: 'transform', transform: move };
  if (prop.kind === 'blob')
    return <div style={{ ...base, borderRadius: '50%', background: color[prop.tone ?? 'card'], boxShadow: clay(1.4, 1.6) }} />;
  if (prop.kind === 'pot')
    return (
      <div style={{ ...base, borderRadius: '50%', background: color.pistachio, boxShadow: clay(0.9, 1.2), transform: `${move} rotate(${turn}deg)` }}>
        <div style={{ position: 'absolute', left: prop.size * 0.12, top: prop.size * 0.06, width: prop.size * 0.76, height: prop.size * 0.76 }} dangerouslySetInnerHTML={{ __html: plantSvg(prop.species ?? 'monstera', id) }} />
      </div>
    );
  if (prop.kind === 'drop')
    return <div style={{ ...base, height: prop.size * 1.3, transform: `${move} rotate(${turn}deg)` }} dangerouslySetInnerHTML={{ __html: dropSvg(id) }} />;
  return <div style={{ ...base, height: prop.size * 0.6, transform: `${move} rotate(${(prop.rot ?? 0) + turn * 2}deg)` }} dangerouslySetInnerHTML={{ __html: leafSvg(id) }} />;
};

const Props = ({ f, format, front }: { f: number; format: Format; front: boolean }) => (
  <>
    {layouts[format].props.map((prop, i) => (Boolean(prop.front) === front ? <PropView key={i} prop={prop} f={f} i={i} format={format} /> : null))}
  </>
);

const Copy = ({ f, layout }: { f: number; layout: Layout }) => {
  const { text } = layout;
  return (
    <>
      {marketingBeats.map((beat, i) => {
        if (f < beat.from || f > beat.to) return null;
        const first = i === 0;
        const start = first ? -999 : beat.from + 2;
        const out = i < marketingBeats.length - 1 ? leave(f, beat.to - 7, 7) : {};
        const words = beat.title.split(' ');
        return (
          <div key={beat.title} style={{ position: 'absolute', left: text.left, top: text.top, width: text.width, textAlign: text.align, ...out }}>
            <div style={{ display: 'flex', justifyContent: text.align === 'center' ? 'center' : 'flex-start', ...puffIn(f, start, first, '0% 50%') }}>
              <span style={{ display: 'inline-block', padding: `${text.kicker * 0.45}px ${text.kicker * 0.9}px`, borderRadius: text.kicker * 2, background: color.butter, boxShadow: clay(0.6, 0.9), fontSize: text.kicker, fontWeight: 800, lineHeight: 1 }}>{beat.kicker}</span>
            </div>
            <div style={{ marginTop: text.kicker * 0.9, fontSize: text.title, lineHeight: 1.06, fontWeight: 900, letterSpacing: -text.title * 0.015, textWrap: 'balance' }}>
              {words.map((word, w) => (
                <span key={w} style={{ display: 'inline-block', marginRight: '0.24em', ...enter(f, start + 4 + w * 3, first, text.title * 0.4) }}>
                  {word}
                </span>
              ))}
            </div>
            {text.line && (
              <div style={{ marginTop: text.title * 0.28, fontSize: text.line, lineHeight: 1.35, fontWeight: 500, color: color.inkSoft, maxWidth: text.width * 0.9, textWrap: 'balance', ...enter(f, start + 10 + words.length * 3, first, 20) }}>
                {beat.line}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

const breakout = { out: 142, seat: 160, cheer: 170, back: 182, home: 200 } as const;

const screenToStage = (layout: Layout, x: number, y: number) => {
  const { scale, left, top } = layout.phone;
  const inset = pad + phone.bezel + phone.edge;
  return { x: left + (inset + x) * scale, y: top + (inset + y) * scale };
};

const MascotOut = ({ f, layout }: { f: number; layout: Layout }) => {
  if (f < breakout.out || f >= breakout.home) return null;
  const { scale, left, top } = layout.phone;
  const slot = screenToStage(layout, mascotSmall.x, mascotSmall.y);
  const slotW = mascotSmall.w * scale;
  const seatW = layout.seat.w;
  const seatH = (seatW * 240) / 200;
  const seat = { x: left + outer.w * scale * layout.seat.x - seatW / 2, y: top - seatH + 18 * scale };
  let x = seat.x;
  let y = seat.y;
  let w = seatW;
  let body: Body = rest;
  if (f < breakout.seat) {
    const t = progress(f, breakout.out, breakout.seat - breakout.out, inOut);
    x = mix(slot.x, seat.x, t);
    y = mix(slot.y, seat.y, t) + arc(t, 160);
    w = mix(slotW, seatW, t);
    body = { y: 0, sx: 0.95, sy: 1.06 };
  } else if (f < breakout.back) {
    body = combine(landing(f, breakout.seat), hop(f, breakout.cheer, 40));
  } else {
    const t = progress(f, breakout.back, breakout.home - breakout.back, inOut);
    x = mix(seat.x, slot.x, t);
    y = mix(seat.y, slot.y, t) + arc(t, 120);
    w = mix(seatW, slotW, t);
    body = { y: 0, sx: 0.95, sy: 1.06 };
  }
  const pose = mascotPose(f, 'out');
  return <Mascot x={x} y={y} w={w} body={body} pose={{ ...pose, mood: f < breakout.back ? 'cheer' : 'smile' }} style={{ zIndex: 30 }} />;
};

export const ClayPhone = ({ scale, frame, hideMascot = false, settled = false }: { scale: number; frame: number; hideMascot?: boolean; settled?: boolean }) => {
  const button = (side: 'left' | 'right', top: number, height: number) => (
    <div style={{ position: 'absolute', [side]: -9, top, width: 16, height, borderRadius: 8, background: color.blush, boxShadow: clay(0.4, 0.7) }} />
  );
  return (
    <div style={{ position: 'relative', width: outer.w * scale, height: outer.h * scale }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: outer.w, height: outer.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        {button('left', 210, 70)}
        {button('left', 296, 70)}
        {button('right', 250, 110)}
        <div style={{ position: 'absolute', inset: 0, borderRadius: outer.r, background: color.blush, boxShadow: clay(1.6, 1.6) }} />
        <div style={{ position: 'absolute', left: pad, top: pad }}>
          <PhoneFrame scale={1} theme={phoneTheme}>
            <StoreFrame frame={frame} overlays={false} hideMascot={hideMascot} settled={settled} />
          </PhoneFrame>
        </div>
        <div style={{ position: 'absolute', left: pad + phone.edge, top: pad + phone.edge, width: phone.width - 2 * phone.edge, height: phone.height - 2 * phone.edge, borderRadius: phone.radius - phone.edge, boxShadow: 'inset 2px 3px 6px rgba(74,44,42,0.14)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

const Stage = ({ f, format }: { f: number; format: Format }) => {
  const layout = layouts[format];
  const p = layout.phone;
  const po = orbit(f, 0.4);
  const sink = f >= marketing.outro ? progress(f, marketing.outro, 12, easeIn) : 0;
  const hidden = f >= breakout.out && f < breakout.home;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${po.x}px, ${po.y}px)` }}>
        <div style={{ position: 'absolute', left: p.left, top: p.top, transform: `translateY(${sink * 500}px)`, opacity: 1 - sink }}>
          <ClayPhone scale={p.scale} frame={Math.min(f, marketing.outro + 11)} hideMascot={hidden} />
        </div>
        <MascotOut f={f} layout={layout} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - sink }}>
        <Copy f={Math.min(f, marketing.outro - 1)} layout={layout} />
      </div>
    </>
  );
};

const Outro = ({ f, format }: { f: number; format: Format }) => {
  const { outro } = layouts[format];
  const o = marketing.outro;
  const s = bounceAt(f, o + 6);
  const top = outro.cy - outro.icon;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: outro.icon, height: outro.icon, transform: `scale(${s})`, opacity: Math.min(1, s * 3) }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: outro.icon * 0.2227, boxShadow: clay(outro.icon / 110) }} />
          <div
            style={{ position: 'absolute', inset: 0 }}
            dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: `outro-${format}`, pose: { leafL: wiggleAt(f, 50, 0), leafR: wiggleAt(f, 50, 17), mood: f > o + 30 ? 'cheer' : 'smile' } }) }}
          />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + outro.icon * 0.14, textAlign: 'center', fontSize: outro.name, fontWeight: 900, lineHeight: 1.1, ...puffIn(f, o + 18, false, '50% 50%') }}>{app.name}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + outro.icon * 0.14 + outro.name * 1.25, textAlign: 'center', fontSize: outro.tagline, fontWeight: 800, color: color.inkSoft, ...puffIn(f, o + 28, false, '50% 50%') }}>
        {app.category}
      </div>
    </>
  );
};

export const Marketing = ({ format }: { format: Format; loop: boolean }) => {
  const f = useCurrentFrame();
  const { width, height } = formats[format];
  const o = marketing.outro;
  let body;
  if (f >= marketing.duration) {
    const t = bridgeT(f, marketing.duration, marketing.bridge);
    const gone = progress(t, 0, 0.4, easeIn);
    const back = progress(t, 0.3, 0.7, easeOut);
    body = (
      <>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - gone, transform: `scale(${1 - 0.25 * gone})` }}>
          <Outro f={marketing.duration - 1} format={format} />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: back, transform: `translateY(${(1 - back) * 80}px)` }}>
          <Stage f={0} format={format} />
        </div>
      </>
    );
  } else if (f >= o) {
    body = (
      <>
        <Stage f={f} format={format} />
        <Outro f={f} format={format} />
      </>
    );
  } else {
    body = <Stage f={f} format={format} />;
  }
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, background: color.ground, fontFamily, overflow: 'hidden' }}>
        <Props f={f} format={format} front={false} />
        {body}
        <Props f={f} format={format} front />
      </div>
    </AppRoot>
  );
};
