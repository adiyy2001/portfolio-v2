import type { CSSProperties, ReactNode } from 'react';
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
import { T } from './timeline';

const T_HOOK_HOP = T.hookHop;

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
  host: { x: number; y: number; w: number; from?: number };
  swing: number;
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
    phone: { scale: 0.8, left: 1010, top: 210 },
    text: { left: 120, top: 280, width: 800, title: 96, line: 36, kicker: 26, align: 'left' },
    seat: { x: 0.66, w: 140 },
    host: { x: 1530, y: 590, w: 340, from: 0 },
    swing: 60,
    outro: { cy: 500, icon: 230, name: 128, tagline: 38 },
    props: [
      { kind: 'blob', x: 1230, y: 620, size: 900, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'blob', x: 120, y: 130, size: 260, depth: 0.25, phase: 2, tone: 'butter' },
      { kind: 'pot', x: 150, y: 860, size: 190, depth: 0.9, phase: 1, species: 'monstera' },
      { kind: 'pot', x: 780, y: 930, size: 150, depth: 0.7, phase: 3, species: 'sansevieria' },
      { kind: 'drop', x: 52, y: 600, size: 66, depth: 0.5, phase: 0.5 },
      { kind: 'drop', x: 880, y: 150, size: 46, depth: 0.6, phase: 2.2 },
      { kind: 'leaf', x: 520, y: 990, size: 110, depth: 1.3, phase: 1.6, rot: -30, front: true },
      { kind: 'leaf', x: 1010, y: 1010, size: 90, depth: 0.8, phase: 4, rot: 20 },
      { kind: 'drop', x: 1860, y: 300, size: 54, depth: 1.2, phase: 3.3, front: true },
    ],
  },
  '9x16': {
    phone: { scale: 0.98, left: 541, top: 520 },
    text: { left: 80, top: 190, width: 720, title: 84, line: 34, kicker: 28, align: 'left' },
    seat: { x: 0.66, w: 170 },
    host: { x: 10, y: 1110, w: 420, from: 0 },
    swing: 60,
    outro: { cy: 900, icon: 280, name: 150, tagline: 42 },
    props: [
      { kind: 'blob', x: 640, y: 1040, size: 1000, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'blob', x: 960, y: 170, size: 280, depth: 0.25, phase: 2, tone: 'butter' },
      { kind: 'pot', x: 975, y: 1800, size: 150, depth: 0.7, phase: 3, species: 'calathea', front: true },
      { kind: 'drop', x: 90, y: 760, size: 64, depth: 1.1, phase: 0.5 },
      { kind: 'drop', x: 1010, y: 1580, size: 50, depth: 1.2, phase: 3.3, front: true },
      { kind: 'leaf', x: 470, y: 1690, size: 100, depth: 1.3, phase: 1.6, rot: -30, front: true },
      { kind: 'leaf', x: 900, y: 660, size: 80, depth: 0.6, phase: 4, rot: 30 },
    ],
  },
  '1x1': {
    phone: { scale: 1, left: 520, top: 170 },
    text: { left: 56, top: 90, width: 430, title: 60, line: null, kicker: 24, align: 'left' },
    seat: { x: 0.72, w: 112 },
    host: { x: 36, y: 700, w: 250 },
    swing: 40,
    outro: { cy: 500, icon: 200, name: 112, tagline: 32 },
    props: [
      { kind: 'blob', x: 780, y: 640, size: 820, depth: 0.15, phase: 0, tone: 'card' },
      { kind: 'blob', x: 120, y: 80, size: 240, depth: 0.25, phase: 2, tone: 'butter' },
      { kind: 'pot', x: 260, y: 520, size: 140, depth: 0.7, phase: 3, species: 'sansevieria' },
      { kind: 'drop', x: 440, y: 640, size: 54, depth: 1.1, phase: 0.5 },
      { kind: 'drop', x: 1030, y: 590, size: 46, depth: 1.2, phase: 3.3, front: true },
      { kind: 'leaf', x: 430, y: 1030, size: 90, depth: 1.3, phase: 1.6, rot: -30, front: true },
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
        if (f < beat.from || f > (i < marketingBeats.length - 1 ? beat.to + 4 : beat.to)) return null;
        const first = i === 0;
        const start = first ? -999 : beat.from - 1;
        const out = i < marketingBeats.length - 1 ? leave(f, beat.to - 1, 5) : {};
        const words = beat.title.split(' ');
        return (
          <div key={beat.title} style={{ position: 'absolute', left: text.left, top: text.top, width: text.width, textAlign: text.align, ...out }}>
            <div style={{ display: 'flex', justifyContent: text.align === 'center' ? 'center' : 'flex-start', ...puffIn(f, start, first, '0% 50%'), ...(f > beat.to ? { opacity: 0 } : {}) }}>
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

const beatOf = (f: number) => {
  const i = marketingBeats.findIndex(beat => f >= beat.from && f <= beat.to);
  return i < 0 ? marketingBeats.length - 1 : i;
};
const swingDirections = [0, -1, 1, -1, 1] as const;
const swingAt = (f: number, layout: Layout) => {
  const i = beatOf(f);
  if (i === 0 || f >= marketing.outro) return 0;
  return (1 - bounceAt(f, marketingBeats[i].from)) * swingDirections[i] * layout.swing;
};

const Host = ({ f, layout }: { f: number; layout: Layout }) => {
  const { host } = layout;
  const from = host.from ?? marketingBeats[1].from - 5;
  if (host.w === 0 || f < from || f >= marketing.outro + 10) return null;
  const hops = [...(host.from === 0 ? [T_HOOK_HOP] : []), ...marketingBeats.slice(1).map(beat => beat.from)];
  const body = hops.reduce<Body>((acc, at) => (f >= at - 2 && f < at + 40 ? combine(acc, combine(landing(f, at + 14), hop(f, at, 44))) : acc), rest);
  const enterT = from === 0 ? 1 : progress(f, from, 16, easeOut);
  const sink = f >= marketing.outro ? progress(f, marketing.outro, 10, easeIn) : 0;
  const pose = mascotPose(f, 'host');
  return (
    <Mascot x={host.x} y={host.y + (1 - enterT) * 320 + sink * 400} w={host.w} body={body} pose={{ ...pose, mood: hops.some(at => f >= at && f < at + 36) ? 'cheer' : 'smile' }} style={{ zIndex: 25 }} />
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
  const swing = swingAt(f, layout);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${po.x}px, ${po.y}px)` }}>
        <div style={{ position: 'absolute', left: p.left, top: p.top, transform: `translate(${swing}px, ${sink * 500}px)`, opacity: 1 - sink }}>
          <ClayPhone scale={p.scale} frame={Math.min(f, marketing.outro + 11)} hideMascot={hidden} />
        </div>
        <MascotOut f={f} layout={layout} />
        <Host f={f} layout={layout} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - sink }}>
        <Copy f={Math.min(f, marketing.outro - 1)} layout={layout} />
      </div>
    </>
  );
};

const Pattern = ({ f, format }: { f: number; format: Format }) => {
  const { width, height } = formats[format];
  const { outro } = layouts[format];
  const o = marketing.outro;
  const step = format === '1x1' ? 170 : 190;
  const rows = Math.ceil(height / (step * 0.9)) + 1;
  const cols = Math.ceil(width / step) + 1;
  const items: ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = (c + (r % 2 ? 0.5 : 0)) * step;
      const y = r * step * 0.9 + step * 0.3;
      const clearX = Math.abs(x - width / 2) < outro.name * 2.7;
      const clearY = y > outro.cy - outro.icon - 40 && y < outro.cy + outro.name * 1.25 + outro.tagline * 2.2;
      if (clearX && clearY) continue;
      const k = r * cols + c;
      const dist = Math.hypot(x - width / 2, y - outro.cy);
      const pop = bounceAt(f, o + 4 + dist * 0.05);
      const rot = ((k * 37) % 70) - 35 + Math.sin((2 * Math.PI * f) / 90 + k) * 4;
      const leaf = (r * 7 + c * 3) % 3 !== 0;
      const size = leaf ? 84 : 42;
      items.push(
        <div
          key={k}
          style={{ position: 'absolute', left: x - size / 2, top: y - (leaf ? size * 0.3 : size * 0.65), width: size, height: leaf ? size * 0.6 : size * 1.3, opacity: Math.min(1, pop * 2), transform: `rotate(${rot}deg) scale(${pop})` }}
          dangerouslySetInnerHTML={{ __html: leaf ? leafSvg(`pat-${format}-${k}`) : dropSvg(`pat-${format}-${k}`) }}
        />,
      );
    }
  }
  return <div style={{ position: 'absolute', inset: 0 }}>{items}</div>;
};

const Outro = ({ f, format }: { f: number; format: Format }) => {
  const { outro } = layouts[format];
  const o = marketing.outro;
  const s = bounceAt(f, o + 6);
  const top = outro.cy - outro.icon;
  return (
    <>
      <Pattern f={f} format={format} />
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
