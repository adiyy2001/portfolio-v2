import type { CSSProperties } from 'react';
import { Easing, useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { bezierAt, mix, springAt, window01 } from '../../shared/motion';
import { bridgeT } from '../../shared/loop';
import { formats } from '../../shared/formats';
import { color, fade, hero, push, shadow } from './tokens';
import { app } from './content';
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
  breakout: { cx: number; cy: number; height: number };
  outro: { cy: number; icon: number; name: number; tagline: number; width: number };
  glide: number;
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    phone: { scale: 0.9, left: 1200, top: 92 },
    text: { left: 150, top: 390, width: 900, align: 'left', kicker: 30, title: 108 },
    breakout: { cx: 1414, cy: 540, height: 980 },
    outro: { cy: 500, icon: 200, name: 120, tagline: 38, width: 1400 },
    glide: 28,
  },
  '9x16': {
    phone: { scale: 1.32, left: 226, top: 610 },
    text: { left: 80, top: 250, width: 860, align: 'left', kicker: 34, title: 100 },
    breakout: { cx: 520, cy: 1180, height: 1110 },
    outro: { cy: 860, icon: 240, name: 128, tagline: 40, width: 860 },
    glide: 22,
  },
  '1x1': {
    phone: { scale: 0.95, left: 314, top: 280 },
    text: { left: 60, top: 64, width: 960, align: 'center', kicker: 28, title: 82 },
    breakout: { cx: 540, cy: 665, height: 820 },
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
            <div style={{ fontFamily, fontSize: text.kicker, fontWeight: 700, color: color.brandDeep, letterSpacing: 0.5, marginBottom: text.kicker * 0.6 }}>
              {beat.kicker}
            </div>
            <div style={{ fontFamily, fontSize: text.title, lineHeight: 1.02, fontWeight: 800, color: color.ink, letterSpacing: -text.title * 0.03, textWrap: 'balance' }}>
              {beat.title}
            </div>
          </div>
        );
      })}
    </>
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
  const icon = springAt(hero, f, marketing.outro + 5);
  const name = bezierAt(fade, f, marketing.outro + 14);
  const tagline = bezierAt(fade, f, marketing.outro + 24);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy - outro.icon, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{ width: outro.icon, height: outro.icon, transform: `scale(${icon})`, opacity: Math.min(1, icon * 2), filter: 'drop-shadow(0 18px 30px rgba(0,134,79,0.22))' }}
        dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'outro' }) }}
      />
      <div style={{ marginTop: outro.icon * 0.16, fontFamily, fontSize: outro.name, lineHeight: 1, fontWeight: 800, letterSpacing: -outro.name * 0.03, color: color.ink, opacity: name, transform: `translateY(${(1 - name) * 16}px)` }}>
        {app.name}
      </div>
      <div style={{ marginTop: outro.tagline * 0.7, maxWidth: outro.width, textAlign: 'center', fontFamily, fontSize: outro.tagline, lineHeight: 1.25, fontWeight: 500, color: color.secondary, opacity: tagline, transform: `translateY(${(1 - tagline) * 12}px)` }}>
        {app.category}. {app.zone}.
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
