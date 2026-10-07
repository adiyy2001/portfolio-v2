import { Easing, useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { formats } from '../../shared/formats';
import { app, launch } from './content';
import { color, punch } from './tokens';
import { marketing, marketingBeats, marketingCards } from './storyboard';
import { AppRoot, StoreFrame } from './Frame';
import { Cap, capRatio, emWidth, fitSize, slamScale, vf, widthAt } from './components/type';
import { iconSvg } from './icon';

export const phoneTheme: PhoneTheme = {
  body: color.raised,
  edge: color.divider,
  bezel: color.ground,
  button: color.divider,
  camera: color.raised,
  shadow: '0 0 0 0 transparent',
};

interface Layout {
  phone: { scale: number; left: number; top: number };
  word: { left: number; top: number; maxW: number; maxCap: number; anchor: 'center' | 'top' };
  line: { size: number; gap: number; width: number };
  card: { cx: number; cy: number; maxW: number; maxCap: number; wdth: number };
  outro: { cy: number; icon: number; name: number; tagline: number };
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    phone: { scale: 0.84, left: 1390, top: 123 },
    word: { left: 120, top: 500, maxW: 1180, maxCap: 360, anchor: 'center' },
    line: { size: 40, gap: 44, width: 1100 },
    card: { cx: 960, cy: 540, maxW: 1460, maxCap: 560, wdth: 100 },
    outro: { cy: 600, icon: 196, name: 190, tagline: 34 },
  },
  '9x16': {
    phone: { scale: 1, left: 302, top: 556 },
    word: { left: 80, top: 250, maxW: 920, maxCap: 170, anchor: 'top' },
    line: { size: 40, gap: 26, width: 920 },
    card: { cx: 540, cy: 880, maxW: 840, maxCap: 860, wdth: 50 },
    outro: { cy: 940, icon: 220, name: 166, tagline: 34 },
  },
  '1x1': {
    phone: { scale: 0.8, left: 350, top: 392 },
    word: { left: 80, top: 70, maxW: 920, maxCap: 196, anchor: 'top' },
    line: { size: 32, gap: 24, width: 920 },
    card: { cx: 540, cy: 540, maxW: 840, maxCap: 620, wdth: 75 },
    outro: { cy: 600, icon: 180, name: 150, tagline: 30 },
  },
};

const punchEase = Easing.bezier(...punch.points);
const wordWidths = [100, 150, 60, 125, 80, 140];

const zoomAt = (f: number) => {
  if (f >= marketing.outro) return 1;
  const local = f % 60;
  if (local < 4) return 1 + 0.12 * punchEase(local / 4);
  if (local < 14) return 1 + 0.12 * (1 - punchEase((local - 4) / 10));
  return 1;
};

const cardAt = (f: number) => marketingCards.find(card => f >= card.from && f <= card.to);

const Phone = ({ scale, frame }: { scale: number; frame: number }) => (
  <div style={{ position: 'relative', width: phone.width * scale, height: phone.height * scale }}>
    <PhoneFrame scale={scale} theme={phoneTheme}>
      <StoreFrame frame={frame} overlays={false} />
    </PhoneFrame>
    <div style={{ position: 'absolute', left: (phone.width - 1) * scale, top: 230 * scale, width: 4 * scale, height: 104 * scale, borderRadius: 2 * scale, background: color.signal }} />
  </div>
);

const Word = ({ f, layout }: { f: number; layout: Layout }) => {
  const i = marketingBeats.findIndex(beat => f >= beat.from && f <= beat.to);
  if (i < 0) return null;
  const beat = marketingBeats[i];
  const card = marketingCards.find(c => c.from === beat.from);
  const start = card ? card.to + 1 : beat.from;
  if (f < start) return null;
  const keys = [{ at: start, w: wordWidths[0] }];
  for (let at = start + 30, k = 1; at <= beat.to; at += 30, k += 1) keys.push({ at, w: wordWidths[k % wordWidths.length] });
  const wdth = widthAt(f, keys);
  const { word, line } = layout;
  const size = fitSize(beat.word, wdth, word.maxW, word.maxCap);
  const cap = size * capRatio;
  const gap = Math.max(line.gap, size * 0.28);
  const top = word.anchor === 'center' ? word.top - cap / 2 - (gap + line.size) / 2 : word.top;
  const scale = i === 0 && start === 0 ? 1 : slamScale(f, start);
  const lineScale = slamScale(f, start + 15);
  return (
    <>
      <div style={{ position: 'absolute', left: word.left, top }}>
        <Cap text={beat.word} size={size} wdth={wdth} scale={scale} origin="left center" />
      </div>
      {lineScale > 0 && (
        <div
          style={{
            position: 'absolute',
            left: word.left,
            top: top + cap + gap,
            width: line.width,
            fontSize: line.size,
            lineHeight: 1.15,
            color: color.ink,
            transform: `scale(${lineScale})`,
            transformOrigin: 'left top',
            ...vf(600, 100),
          }}>
          {beat.line}
        </div>
      )}
    </>
  );
};

const Card = ({ f, layout, text, invert }: { f: number; layout: Layout; text: string; invert: boolean }) => {
  const { card } = layout;
  const wdth = text.length <= 3 ? Math.min(75, card.wdth) : card.wdth;
  const size = fitSize(text, wdth, card.maxW, card.maxCap);
  const w = emWidth(text, wdth) * size;
  const h = size * capRatio;
  const from = marketingCards.find(c => c.text === text)?.from ?? f;
  return (
    <>
      {invert && <div style={{ position: 'absolute', inset: 0, background: color.signal }} />}
      <div style={{ position: 'absolute', left: card.cx - w / 2, top: card.cy - h / 2 }}>
        <Cap text={text} size={size} wdth={wdth} fill={invert ? color.ground : color.ink} scale={slamScale(f, from)} origin="center center" />
      </div>
    </>
  );
};

const Stage = ({ f, layout }: { f: number; layout: Layout }) => {
  const card = cardAt(f);
  const { phone: p } = layout;
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoomAt(f)})`, transformOrigin: '50% 50%' }}>
      {card ? (
        <Card f={f} layout={layout} text={card.text} invert={card.invert} />
      ) : (
        <>
          <Word f={f} layout={layout} />
          <div style={{ position: 'absolute', left: p.left, top: p.top }}>
            <Phone scale={p.scale} frame={f} />
          </div>
        </>
      )}
    </div>
  );
};

const Outro = ({ f, layout, width }: { f: number; layout: Layout; width: number }) => {
  const { outro } = layout;
  const wdth = widthAt(f, [
    { at: marketing.outro, w: 150 },
    { at: marketing.outro + 1, w: 100 },
  ]);
  const name = app.name.toUpperCase();
  const nameW = emWidth(name, wdth) * outro.name;
  const cap = outro.name * capRatio;
  const icon = slamScale(f, marketing.outro + 15);
  const tagline = slamScale(f, marketing.outro + 30);
  const top = outro.cy - cap / 2;
  return (
    <>
      {icon > 0 && (
        <div
          style={{
            position: 'absolute',
            left: (width - outro.icon) / 2,
            top: top - outro.icon - outro.icon * 0.3,
            width: outro.icon,
            height: outro.icon,
            borderRadius: outro.icon * 0.2227,
            boxShadow: `0 0 0 3px ${color.divider}`,
            transform: `scale(${icon})`,
          }}
          dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'outro' }) }}
        />
      )}
      <div style={{ position: 'absolute', left: (width - nameW) / 2, top }}>
        <Cap text={name} size={outro.name} wdth={wdth} />
      </div>
      {tagline > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: top + cap + outro.tagline * 1.4,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${tagline})`,
          }}>
          <div style={{ ...vf(700, 75), fontSize: outro.tagline, letterSpacing: outro.tagline * 0.08, color: color.secondary }}>{launch.tagline}</div>
        </div>
      )}
    </>
  );
};

export const Marketing = ({ format }: { format: Format; loop: boolean }) => {
  const f = useCurrentFrame();
  const layout = layouts[format];
  const { width } = formats[format];
  if (f >= marketing.duration) {
    const local = f - marketing.duration;
    return <AppRoot>{local < 8 ? <div style={{ position: 'absolute', inset: 0, background: color.signal }} /> : <Stage f={0} layout={layout} />}</AppRoot>;
  }
  return <AppRoot>{f >= marketing.outro ? <Outro f={f} layout={layout} width={width} /> : <Stage f={f} layout={layout} />}</AppRoot>;
};

