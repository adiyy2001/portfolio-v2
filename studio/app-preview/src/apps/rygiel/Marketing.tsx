import { useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { formats } from '../../shared/formats';
import { app, log } from './content';
import { color, glow } from './tokens';
import { marketing, marketingBeats } from './storyboard';
import { AppRoot, StoreFrame } from './Frame';
import { iconSvg } from './icon';
import { Grid, Wipe, drawAt, fontDisplay, inOut, progress, scanEase, toneColor } from './components/ui';
import { scrambleGlyphs } from './components/scramble';

export const phoneTheme: PhoneTheme = {
  body: 'transparent',
  edge: color.cyan,
  bezel: color.void,
  button: color.dim,
  camera: color.grid,
  shadow: `${glow(color.cyan, 0.4, 18)}, ${glow(color.cyan, 0.18, 48)}`,
};

export const loopTotal = marketing.duration + marketing.bridge;

interface Layout {
  phone: { scale: number; left: number; top: number };
  text: { left: number; top: number; width: number; size: number; line: number; kicker: number; align: 'left' | 'center' };
  log?: { left: number; top: number; width: number; size: number; rows: number };
  outro: { cy: number; icon: number; name: number; tagline: number };
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    phone: { scale: 0.94, left: 1250, top: 74 },
    text: { left: 140, top: 300, width: 1090, size: 88, line: 32, kicker: 22, align: 'left' },
    log: { left: 140, top: 700, width: 940, size: 26, rows: 5 },
    outro: { cy: 520, icon: 200, name: 120, tagline: 30 },
  },
  '9x16': {
    phone: { scale: 1.08, left: 283, top: 462 },
    text: { left: 80, top: 190, width: 920, size: 70, line: 32, kicker: 26, align: 'left' },
    outro: { cy: 900, icon: 240, name: 128, tagline: 32 },
  },
  '1x1': {
    phone: { scale: 1, left: 562, top: 44 },
    text: { left: 56, top: 84, width: 420, size: 54, line: 24, kicker: 20, align: 'left' },
    outro: { cy: 500, icon: 180, name: 104, tagline: 26 },
  },
};

const kickers = ['07:12 ALERT WYCIEKU', '07:15 GENERATOR', '07:16 SEJF', '21:38 ZDROWIE SEJFU'];

const beatAt = (f: number) => {
  const i = marketingBeats.findIndex(beat => f >= beat.from && f <= beat.to);
  return i < 0 ? marketingBeats.length - 1 : i;
};

const Morph = ({ text, prev, f, start, fill, step = 1 }: { text: string; prev: string; f: number; start: number; fill: string; step?: number }) => {
  const glyphs = scrambleGlyphs(text, f, start, { step, min: 6, max: 10, seed: 13 });
  const length = Math.max(text.length, prev.length);
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {Array.from({ length }, (_, i) => {
        const g = glyphs[i];
        if (!g || g.state === 'hidden') {
          const old = prev[i] ?? ' ';
          const gone = f >= start + i * step;
          return (
            <span key={i} style={{ color: gone ? 'transparent' : color.muted }}>
              {old}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: g.state === 'done' ? fill : color.cyan }}>
            {g.ch}
          </span>
        );
      })}
    </span>
  );
};

const Planes = ({ f, push, width, height }: { f: number; push: number; width: number; height: number }) => {
  const far = ((f % loopTotal) / loopTotal) * 4 * 48;
  const near = ((f % loopTotal) / loopTotal) * 3 * 144;
  return (
    <>
      <div style={{ position: 'absolute', inset: -96, transform: `scale(${1 + 0.02 * push})` }}>
        <Grid cell={48} offset={far} line={1.5} style={{ backgroundPosition: `${(width % 48) / 2}px ${far}px` }} />
      </div>
      <div style={{ position: 'absolute', inset: -288, transform: `scale(${1 + 0.1 * push})` }}>
        <Grid cell={144} offset={near} line={2} lineColor={color.dim} style={{ backgroundPosition: `${(width % 144) / 2}px ${near}px`, opacity: 0.6 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: height * 0.18, background: `linear-gradient(${color.void}, transparent)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.18, background: `linear-gradient(transparent, ${color.void})` }} />
    </>
  );
};

const Phone = ({ f, layout }: { f: number; layout: Layout }) => {
  const { scale, left, top } = layout.phone;
  return (
    <div style={{ position: 'absolute', left, top, width: phone.width * scale, height: phone.height * scale }}>
      <PhoneFrame scale={scale} theme={phoneTheme}>
        <StoreFrame frame={Math.min(f, marketing.outro + 20)} overlays={false} gridFrame={f} gridTotal={loopTotal} />
      </PhoneFrame>
      {[0, 1, 2, 3].map(k => {
        const m = 26;
        const len = 56 * Math.max(1, scale);
        const w = 4;
        const right = k % 2 === 1;
        const bottom = k > 1;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              [right ? 'right' : 'left']: -m,
              [bottom ? 'bottom' : 'top']: -m,
              width: len,
              height: len,
              [`border${bottom ? 'Bottom' : 'Top'}`]: `${w}px solid ${color.cyan}`,
              [`border${right ? 'Right' : 'Left'}`]: `${w}px solid ${color.cyan}`,
              filter: `drop-shadow(0 0 6px ${color.cyan})`,
              opacity: 0.85,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: (phone.edge + 5) * scale,
          borderRadius: (phone.radius - phone.edge - 5) * scale,
          boxShadow: `inset 0 0 0 ${Math.max(1, scale)}px ${color.dim}`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

const Copy = ({ f, layout }: { f: number; layout: Layout }) => {
  const i = beatAt(f);
  const beat = marketingBeats[i];
  const prev = i > 0 ? marketingBeats[i - 1].title : '';
  const first = i === 0;
  const start = first ? -999 : beat.from;
  const { text } = layout;
  const fill = first ? color.alert : color.cyan;
  const out = first ? 0 : progress(f, beat.from, 6, inOut);
  const into = first ? 1 : progress(f, beat.from + 5, 8, inOut);
  const lineOf = (k: number, o: number) => (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: o }}>{marketingBeats[k].line}</div>
  );
  return (
    <div style={{ position: 'absolute', left: text.left, top: text.top, width: text.width, textAlign: text.align }}>
      <div style={{ fontSize: text.kicker, lineHeight: 1.3, fontWeight: 500, letterSpacing: text.kicker * 0.14, color: color.muted }}>
        <Morph text={kickers[i]} prev={first ? '' : kickers[i - 1]} f={f} start={start} fill={color.muted} step={0.5} />
      </div>
      <div style={{ marginTop: text.kicker * 0.8, fontSize: text.size, lineHeight: 1.08, fontWeight: 700, letterSpacing: -text.size * 0.02 }}>
        <span style={{ color: color.cyan }}>{'> '}</span>
        <Morph text={beat.title} prev={prev} f={f} start={start + 3} fill={fill} />
        <span style={{ display: 'inline-block', width: '0.5em', height: '0.78em', marginLeft: '0.12em', marginRight: '-0.62em', background: color.cyan, verticalAlign: '-0.04em', opacity: f % 30 < 18 ? 1 : 0 }} />
      </div>
      <div style={{ position: 'relative', marginTop: text.size * 0.3, fontSize: text.line, lineHeight: 1.35, fontWeight: 400, color: color.text, minHeight: text.line * 2.7 }}>
        {i > 0 && lineOf(i - 1, 1 - out)}
        {lineOf(i, first ? 1 : into)}
      </div>
    </div>
  );
};

const Log = ({ f, layout }: { f: number; layout: Layout }) => {
  if (!layout.log) return null;
  const { left, top, width, size, rows } = layout.log;
  const shown = log.filter(item => item.at === 0 || f >= item.at).slice(-rows);
  return (
    <div style={{ position: 'absolute', left, top, width, borderTop: `1px solid ${color.dim}`, paddingTop: size }}>
      {shown.map((item, k) => {
        const latest = k === shown.length - 1;
        const glyphs = scrambleGlyphs(item.text, f, item.at === 0 ? -999 : item.at, { step: 0.5, min: 4, max: 7, seed: 17 });
        const tone = latest ? toneColor(item.tone) : color.muted;
        return (
          <div key={item.time} style={{ display: 'flex', gap: size, fontSize: size, lineHeight: `${size * 1.8}px`, whiteSpace: 'pre' }}>
            <span style={{ color: color.muted }}>{item.time}</span>
            <span>
              {glyphs.map((g, j) => (
                <span key={j} style={{ color: g.state === 'done' ? (item.tone === 'alert' ? color.alert : tone) : g.state === 'cycling' ? color.cyan : 'transparent' }}>
                  {g.ch}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Stage = ({ f, format }: { f: number; format: Format }) => {
  const layout = layouts[format];
  const { width, height } = formats[format];
  const push = inOut(Math.min(1, f / (marketing.outro - 1)));
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.void, overflow: 'hidden' }}>
      <Planes f={f} push={push} width={width} height={height} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + 0.05 * push})`, transformOrigin: `${layout.phone.left + (phone.width * layout.phone.scale) / 2}px 50%` }}>
        <Copy f={f} layout={layout} />
        <Log f={f} layout={layout} />
        <Phone f={f} layout={layout} />
      </div>
    </div>
  );
};

const Outro = ({ f, format }: { f: number; format: Format }) => {
  const { outro } = layouts[format];
  const { width, height } = formats[format];
  const o = marketing.outro;
  const drawn = drawAt(f, o + 14, 18);
  const shut = progress(f, o + 36, 10, scanEase);
  const top = outro.cy - outro.icon - 20;
  const name = scrambleGlyphs(app.name.toUpperCase(), f, o + 38, { step: 2, min: 6, max: 9, seed: 3 });
  const tagline = scrambleGlyphs(app.category, f, o + 50, { step: 0.5, min: 3, max: 5, seed: 9 });
  return (
    <div style={{ position: 'absolute', inset: 0, background: color.void, overflow: 'hidden' }}>
      <Planes f={f} push={1} width={width} height={height} />
      <div
        style={{ position: 'absolute', left: (width - outro.icon) / 2, top, width: outro.icon, height: outro.icon, borderRadius: outro.icon * 0.2227, overflow: 'hidden', background: color.void, boxShadow: `inset 0 0 0 2px ${color.dim}`, opacity: drawAt(f, o + 8, 18) }}
        dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: `outro-${format}`, shut, drawn, bg: false }) }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + 30, textAlign: 'center', fontFamily: fontDisplay, fontWeight: 800, fontSize: outro.name, lineHeight: 1, letterSpacing: outro.name * 0.16, paddingLeft: outro.name * 0.16, whiteSpace: 'pre' }}>
        {name.map((g, i) => (
          <span key={i} style={{ color: g.state === 'done' ? color.text : g.state === 'cycling' ? color.cyan : 'transparent' }}>
            {g.ch}
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + 30 + outro.name * 1.25, textAlign: 'center', fontSize: outro.tagline, lineHeight: 1.3, color: color.muted, whiteSpace: 'pre' }}>
        {tagline.map((g, i) => (
          <span key={i} style={{ color: g.state === 'done' ? color.muted : g.state === 'cycling' ? color.cyan : 'transparent' }}>
            {g.ch}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Marketing = ({ format }: { format: Format; loop: boolean }) => {
  const f = useCurrentFrame();
  const { width, height } = formats[format];
  const o = marketing.outro;
  let body;
  if (f >= marketing.duration) {
    const t = progress(f, marketing.duration, marketing.bridge - 1, scanEase);
    body = <Wipe t={t} width={width} height={height} from={<Outro f={marketing.duration - 1} format={format} />} to={<Stage f={0} format={format} />} />;
  } else if (f >= o + 24) {
    body = <Outro f={f} format={format} />;
  } else if (f >= o) {
    body = <Wipe t={progress(f, o, 24, scanEase)} width={width} height={height} from={<Stage f={f} format={format} />} to={<Outro f={f} format={format} />} />;
  } else {
    body = <Stage f={f} format={format} />;
  }
  return <AppRoot>{body}</AppRoot>;
};
