import type { CSSProperties } from 'react';
import { Easing, useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { bezierAt, mix, springAt, window01 } from '../../shared/motion';
import { bridgeT } from '../../shared/loop';
import { formats } from '../../shared/formats';
import { color, fade, hero, push, shadow } from './tokens';
import { app, liveTicket } from './content';
import { marketing, marketingBeats } from './storyboard';
import { AppRoot, StoreFrame } from './Frame';
import { TicketCard } from './components/TicketCard';
import { liveSlot } from './screens/LiveTicket';
import { liveCardAt } from './Scene';
import { fontFamily } from './components/ui';
import { iconSvg } from './icon';

export const phoneTheme: PhoneTheme = {
  body: '#E3E6EA',
  edge: '#C7CDD4',
  bezel: '#0E1114',
  button: '#C9CED4',
  camera: '#05070A',
  shadow: '0 40px 80px rgba(16,20,24,0.16), 0 8px 20px rgba(16,20,24,0.08)',
};

interface Layout {
  phone: { scale: number; left: number; top: number };
  text: { left: number; top: number; width: number; align: 'left' | 'center'; kicker: number; title: number };
  line: { x: number; y: number; length: number; vertical: boolean; label: number };
  breakout: { cx: number; cy: number; height: number };
  outro: { cy: number; icon: number; name: number; tagline: number; width: number };
  glide: number;
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    phone: { scale: 0.9, left: 1200, top: 92 },
    text: { left: 150, top: 410, width: 900, align: 'left', kicker: 30, title: 108 },
    line: { x: 150, y: 330, length: 860, vertical: false, label: 30 },
    breakout: { cx: 1414, cy: 540, height: 980 },
    outro: { cy: 500, icon: 200, name: 120, tagline: 38, width: 1400 },
    glide: 28,
  },
  '9x16': {
    phone: { scale: 1.32, left: 226, top: 520 },
    text: { left: 80, top: 238, width: 920, align: 'left', kicker: 40, title: 116 },
    line: { x: 80, y: 168, length: 920, vertical: false, label: 32 },
    breakout: { cx: 540, cy: 1130, height: 1150 },
    outro: { cy: 960, icon: 240, name: 128, tagline: 40, width: 860 },
    glide: 22,
  },
  '1x1': {
    phone: { scale: 1.2, left: 484, top: 56 },
    text: { left: 52, top: 80, width: 400, align: 'left', kicker: 28, title: 62 },
    line: { x: 60, y: 520, length: 270, vertical: true, label: 28 },
    breakout: { cx: 770, cy: 560, height: 860 },
    outro: { cy: 470, icon: 180, name: 104, tagline: 34, width: 900 },
    glide: 24,
  },
};

const ease = Easing.bezier(0.25, 0.1, 0.25, 1);
export const breakout = { out: 335, back: 395 } as const;
const inOut = Easing.bezier(0.45, 0, 0.55, 1);
const glides = [0, -1, 1, 0];

const beatIndex = (f: number) => {
  const i = marketingBeats.findIndex(beat => f >= beat.from && f <= beat.to);
  return i < 0 ? marketingBeats.length - 1 : i;
};

const camera = (f: number, layout: Layout) => {
  const i = beatIndex(f);
  const beat = marketingBeats[i];
  const progress = inOut(window01(f, beat.from, beat.to));
  const g = i === 0 ? 1 : springAt(push, f, beat.from);
  const zoom = 1 + 0.06 * (g * progress + (1 - g) * 1);
  const prevX = i === 0 ? 0 : glides[i - 1] * layout.glide;
  const x = mix(prevX, glides[i] * layout.glide, g);
  return { zoom: i === 0 ? 1 + 0.06 * progress : zoom, x };
};

const Headline = ({ f, layout, first }: { f: number; layout: Layout; first: boolean }) => {
  const { text } = layout;
  return (
    <>
      {marketingBeats.map((beat, i) => {
        if (f < beat.from - 2 || f > beat.to + 1) return null;
        const enter = i === 0 && first ? 1 : ease(window01(f, beat.from, beat.from + 12));
        const exit = ease(window01(f, beat.to - 9, beat.to));
        const opacity = Math.min(enter, 1 - exit);
        const style: CSSProperties = {
          position: 'absolute',
          left: text.left,
          top: text.top,
          width: text.width,
          textAlign: text.align,
          opacity,
          transform: `translateY(${(1 - enter) * 24 - exit * 16}px)`,
        };
        return (
          <div key={beat.title} style={style}>
            <div style={{ fontFamily, fontSize: text.title, lineHeight: 1.02, fontWeight: 800, color: color.ink, letterSpacing: -text.title * 0.03, textWrap: 'balance' }}>
              {beat.title}
            </div>
          </div>
        );
      })}
    </>
  );
};

const RouteLine = ({ f, layout, out }: { f: number; layout: Layout; out: number }) => {
  const { line } = layout;
  const count = marketingBeats.length;
  const i = beatIndex(Math.min(f, marketing.outro - 1));
  const from = i === 0 ? 0 : i - 1;
  const p = mix(from, i, springAt(push, Math.min(f, marketing.outro - 1), marketingBeats[i].from));
  const step = line.vertical ? line.length / (count - 1) : (line.length - 200) / (count - 1);
  const at = (k: number) => (line.vertical ? { x: line.x, y: line.y + k * step } : { x: line.x + k * step, y: line.y });
  const head = at(p);
  const tail = at(0);
  const thick = line.vertical ? 8 : 10;
  const dot = line.vertical ? 24 : 28;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - out }}>
      <div
        style={{
          position: 'absolute',
          left: line.vertical ? line.x - thick / 2 : tail.x,
          top: line.vertical ? line.y : line.y - thick / 2,
          width: line.vertical ? thick : step * (count - 1),
          height: line.vertical ? step * (count - 1) : thick,
          background: color.separator,
          borderRadius: thick,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: line.vertical ? line.x - thick / 2 : tail.x,
          top: line.vertical ? line.y : line.y - thick / 2,
          width: line.vertical ? thick : head.x - tail.x,
          height: line.vertical ? head.y - tail.y : thick,
          background: color.brand,
          borderRadius: thick,
        }}
      />
      {marketingBeats.map((beat, k) => {
        const c = at(k);
        const passed = p >= k - 0.001;
        const active = Math.abs(p - k) < 0.5;
        return (
          <div key={beat.kicker}>
            <div
              style={{
                position: 'absolute',
                left: c.x - dot / 2,
                top: c.y - dot / 2,
                width: dot,
                height: dot,
                borderRadius: dot / 2,
                background: passed ? color.brand : color.grouped,
                border: `${thick * 0.55}px solid ${passed ? color.brand : '#C9CED4'}`,
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: line.vertical ? c.x + dot : c.x - dot / 2,
                top: line.vertical ? c.y - line.label * 0.62 : c.y + dot * 0.75,
                fontFamily,
                fontSize: line.label,
                lineHeight: 1.2,
                fontWeight: active ? 800 : 600,
                color: active ? color.ink : color.secondary,
                whiteSpace: 'nowrap',
              }}>
              {beat.kicker}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: head.x - dot,
          top: head.y - dot,
          width: dot * 2,
          height: dot * 2,
          borderRadius: dot,
          background: 'rgba(0,134,79,0.18)',
        }}
      />
    </div>
  );
};

const screenOrigin = (layout: Layout, zoom: number, x: number) => {
  const { scale, left, top } = layout.phone;
  const w = phone.width * scale;
  const h = phone.height * scale;
  const cx = left + w / 2;
  const cy = top + h / 2;
  const inset = (phone.bezel + phone.edge) * scale;
  return {
    map: (px: number, py: number) => ({
      x: cx + (left + inset + px * scale - cx) * zoom + x,
      y: cy + (top + inset + py * scale - cy) * zoom,
    }),
    unit: scale * zoom,
  };
};

const Stage = ({ f, layout, first }: { f: number; layout: Layout; first: boolean }) => {
  const { zoom, x } = camera(Math.min(f, marketing.outro - 1), layout);
  const out = f >= marketing.outro ? springAt(push, f, marketing.outro) : 0;
  const b = springAt(hero, f, breakout.out) - springAt(hero, f, breakout.back);
  const breaking = f >= breakout.out && f < marketing.outro && b > 0.002;
  const origin = screenOrigin(layout, zoom, x);
  const start = origin.map(liveSlot.left, liveSlot.top);
  const startW = liveSlot.width * origin.unit;
  const startH = liveSlot.height * origin.unit;
  const bigH = layout.breakout.height;
  const bigW = (bigH * liveSlot.width) / liveSlot.height;
  const rect = {
    left: mix(start.x, layout.breakout.cx - bigW / 2, b),
    top: mix(start.y, layout.breakout.cy - bigH / 2, b),
    width: mix(startW, bigW, b),
  };
  const cardScale = rect.width / liveSlot.width;
  const sceneFrame = Math.min(f, marketing.outro - 1);
  const { phone: p } = layout;
  return (
    <>
      <Headline f={f} layout={layout} first={first} />
      <RouteLine f={f} layout={layout} out={out} />
      <div
        style={{
          position: 'absolute',
          left: p.left,
          top: p.top,
          transform: `translate(${x}px, ${out * 260}px) scale(${zoom})`,
          transformOrigin: 'center center',
          opacity: (1 - out) * (1 - b * 0.35),
        }}>
        <PhoneFrame scale={p.scale} theme={phoneTheme}>
          <StoreFrame frame={sceneFrame} hideCard={breaking} overlays={false} />
        </PhoneFrame>
      </div>
      {breaking && (
        <div
          style={{
            position: 'absolute',
            left: rect.left,
            top: rect.top,
            width: liveSlot.width,
            height: liveSlot.height,
            transform: `scale(${cardScale})`,
            transformOrigin: '0 0',
            borderRadius: 18,
            boxShadow: b > 0.05 ? shadow.lift : 'none',
          }}>
          <TicketCard {...liveCardAt(f)} expand={1} />
        </div>
      )}
    </>
  );
};

const Outro = ({ f, layout }: { f: number; layout: Layout }) => {
  const { outro } = layout;
  const rise = springAt(hero, f, marketing.outro + 2);
  const icon = springAt(hero, f, marketing.outro + 10);
  const name = bezierAt(fade, f, marketing.outro + 18);
  const tagline = bezierAt(fade, f, marketing.outro + 28);
  const stripe = ((f - marketing.outro) * 1.6) % 56;
  const width = outro.width;
  const k = outro.icon / 240;
  const bandH = 64 * k + 18;
  const notch = 34 * k + 8;
  const body = outro.icon + outro.name * 0.5 + 150 * k + outro.tagline * 3;
  const top = outro.cy - (bandH + body) / 2 + (1 - rise) * 500;
  const cut = bandH + outro.icon + outro.name * 1.15 + 100 * k;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: Math.min(1, rise * 3) }}>
      <div style={{ position: 'relative', width, background: color.surface, borderRadius: 36 * k + 12, boxShadow: shadow.lift, overflow: 'hidden', paddingBottom: 40 * k + 10 }}>
        <div
          style={{
            height: bandH,
            background: color.brand,
            backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.14) 0 ${28}px, rgba(255,255,255,0) ${28}px 56px)`,
            backgroundPosition: `${stripe}px 0`,
            color: '#fff',
            fontFamily,
            fontWeight: 800,
            fontSize: outro.tagline * 0.78,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 40 * k + 10,
          }}>
          {liveTicket.band}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 44 * k + 10 }}>
          <div
            style={{ width: outro.icon, height: outro.icon, transform: `scale(${icon})`, opacity: Math.min(1, icon * 2), filter: 'drop-shadow(0 14px 24px rgba(0,134,79,0.2))' }}
            dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'outro' }) }}
          />
          <div style={{ marginTop: outro.icon * 0.14, fontFamily, fontSize: outro.name, lineHeight: 1, fontWeight: 800, letterSpacing: -outro.name * 0.03, color: color.ink, opacity: name, transform: `translateY(${(1 - name) * 16}px)` }}>
            {app.name}
          </div>
        </div>
        <div style={{ position: 'absolute', left: notch, right: notch, top: cut, borderTop: `4px dashed ${color.separator}` }} />
        <div style={{ position: 'absolute', left: -notch / 2, top: cut - notch / 2 + 2, width: notch, height: notch, borderRadius: notch / 2, background: color.grouped }} />
        <div style={{ position: 'absolute', right: -notch / 2, top: cut - notch / 2 + 2, width: notch, height: notch, borderRadius: notch / 2, background: color.grouped }} />
        <div style={{ marginTop: 40 * k + 10, textAlign: 'center', fontFamily, fontSize: outro.tagline, lineHeight: 1.3, fontWeight: 600, color: color.secondary, opacity: tagline, transform: `translateY(${(1 - tagline) * 12}px)` }}>
          <div>{app.category}</div>
          <div style={{ color: color.brandDeep, fontWeight: 800 }}>{app.zone}</div>
        </div>
      </div>
    </div>
  );
};

export const Marketing = ({ format }: { format: Format; loop: boolean }) => {
  const f = useCurrentFrame();
  const layout = layouts[format];
  const { width, height } = formats[format];
  if (f >= marketing.duration) {
    const t = bridgeT(f, marketing.duration, marketing.bridge);
    const u = inOut(t);
    return (
      <AppRoot>
        <div style={{ position: 'absolute', width, height, opacity: 1 - u, transform: `scale(${mix(1, 0.97, u)})` }}>
          <Outro f={marketing.duration - 1} layout={layout} />
        </div>
        <div style={{ position: 'absolute', width, height, opacity: u, transform: `translateY(${(1 - u) * 40}px)` }}>
          <Stage f={0} layout={layout} first />
        </div>
      </AppRoot>
    );
  }
  return (
    <AppRoot>
      <Stage f={f} layout={layout} first />
      {f >= marketing.outro && <Outro f={f} layout={layout} />}
    </AppRoot>
  );
};
