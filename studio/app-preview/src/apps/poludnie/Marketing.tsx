import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { PhoneFrame, phone, type PhoneTheme } from '../../shared/PhoneFrame';
import { formats } from '../../shared/formats';
import { bridgeT } from '../../shared/loop';
import { app } from './content';
import { color, fontFamily, hue, num, semi, slab, type Hue } from './tokens';
import { marketing, marketingBeats } from './storyboard';
import { AppRoot, StoreFrame } from './Frame';
import { facts, today } from './data';
import { iconSvg } from './icon';
import { T } from './timeline';
import { Box, Flow, HouseScene, nodes, type Tag, type Weights } from './components/House';
import { C, P } from './components/iso';
import { area, line, makeScale, series } from './components/charts';
import { countAt, drawAt, easeIn, focusAt, mixN, progress, riseAt, riseIn, trackAt } from './components/motion';
import { batteryLevel } from './screens/Battery';
import { liveFlows } from './Scene';

export const loopTotal = marketing.duration + marketing.bridge;

export const phoneTheme: PhoneTheme = {
  body: color.card,
  edge: color.right,
  bezel: color.ink,
  button: color.right,
  camera: color.secondary,
  shadow: `0 10px 0 ${color.right}, 0 40px 80px rgba(21,32,43,0.12)`,
};

type Part = (typeof marketingBeats)[number]['part'];

interface Layout {
  copy: { left: number; top: number; width: number; title: number; line: number | null; kicker: number };
  world: { cx: number; cy: number; scale: number };
  phone: { scale: number; left: number; top: number };
  wire: 'right' | 'down';
  outro: { cy: number; icon: number; name: number; tagline: number };
  tag: number;
}

const layouts: Record<Format, Layout> = {
  '16x9': {
    copy: { left: 96, top: 300, width: 540, title: 84, line: 32, kicker: 24 },
    world: { cx: 1030, cy: 610, scale: 2.0 },
    phone: { scale: 0.8, left: 1528, top: 143 },
    wire: 'right',
    outro: { cy: 480, icon: 230, name: 128, tagline: 38 },
    tag: 15,
  },
  '9x16': {
    copy: { left: 80, top: 236, width: 900, title: 88, line: 34, kicker: 26 },
    world: { cx: 540, cy: 860, scale: 2.05 },
    phone: { scale: 0.62, left: Math.round((1080 - phone.width * 0.62) / 2), top: 1176 },
    wire: 'down',
    outro: { cy: 860, icon: 280, name: 150, tagline: 42 },
    tag: 15,
  },
  '1x1': {
    copy: { left: 64, top: 56, width: 700, title: 64, line: null, kicker: 22 },
    world: { cx: 420, cy: 650, scale: 1.95 },
    phone: { scale: 0.5, left: 806, top: 500 },
    wire: 'right',
    outro: { cy: 470, icon: 210, name: 112, tagline: 32 },
    tag: 13,
  },
};

const parts: Record<Part, { x: number; y: number; zoom: number }> = {
  roof: { x: 24, y: 60, zoom: 1 },
  battery: { x: 96, y: 118, zoom: 1.3 },
  chart: { x: 100, y: -62, zoom: 0.92 },
  washer: { x: -36, y: 92, zoom: 1.15 },
  grid: { x: 70, y: 110, zoom: 1.1 },
};

const beatHue: Hue[] = ['sun', 'battery', 'sun', 'home', 'battery'];

const beatAt = (f: number) => {
  const i = marketingBeats.findIndex(beat => f >= beat.from && f <= beat.to);
  return i < 0 ? marketingBeats.length - 1 : i;
};

const cameraAt = (f: number, layout: Layout) => {
  const i = beatAt(f);
  const beat = marketingBeats[i];
  const to = parts[beat.part];
  const from = i ? parts[marketingBeats[i - 1].part] : to;
  const t = i ? trackAt(f, beat.from) : 1;
  return {
    x: mixN(from.x, to.x, t),
    y: mixN(from.y, to.y, t),
    scale: layout.world.scale * mixN(from.zoom, to.zoom, t),
  };
};

const phoneFrameAt = (f: number) => {
  if (f >= marketing.outro) return T.balance + 149;
  const beat = marketingBeats[beatAt(f)];
  return beat.store[0] + Math.min(f - beat.from, beat.store[1] - beat.store[0]);
};

const weightsAt = (f: number): Weights => {
  const i = beatAt(f);
  const lead = beatHue[i];
  const t = i ? focusAt(f, marketingBeats[i].from) : 1;
  const prev = i ? beatHue[i - 1] : lead;
  const w = (h: Hue) => (h === lead ? mixN(h === prev ? 1 : 0.4, 1, t) : mixN(h === prev ? 1 : 0.4, 0.4, t));
  return { sun: w('sun'), battery: w('battery'), home: w('home'), grid: w('grid') };
};

const window = (f: number, from: number, to: number) => Math.min(progress(f, from + 6, 10), 1 - progress(f, to - 10, 10));

const tagsAt = (f: number): Tag[] => {
  const b = marketingBeats;
  return [
    { hue: 'sun', value: '6,4 kW', label: 'z dachu, teraz', at: nodes.roof, dx: 30, dy: -104, opacity: f < 6 ? 1 : window(f, -40, b[0].to) },
    { hue: 'battery', value: '95%', label: 'pełny o 13:40', at: nodes.batteryTop, dx: 70, dy: -58, opacity: window(f, b[1].from, b[1].to) },
    { hue: 'home', value: '12:30 do 14:00', label: 'pralka, nadwyżka 4,1 kW', at: P(53, 157, 34), dx: -40, dy: -76, opacity: window(f, b[3].from + 20, b[3].to) },
  ];
};

const Billboard = ({ f, id }: { f: number; id: string }) => {
  const b = marketingBeats[2];
  if (f < b.from || f > b.to + 14) return null;
  const s = riseAt(f, b.from + 6) * (1 - progress(f, b.to + 1, 12, easeIn));
  const sf = phoneFrameAt(Math.min(f, b.to));
  const prodT = f > b.to ? 1 : drawAt(sf, T.prodDraw);
  const useT = f > b.to ? 1 : drawAt(sf, T.useDraw);
  const fill = f > b.to ? 1 : focusAt(sf, T.surplus);
  const value = f > b.to ? facts.day.prod : countAt(sf, T.prodDraw, 0, facts.day.prod, 40);
  const sc = makeScale(202, 76, 7);
  const prod = series(today, row => row.prod);
  const use = series(today, row => row.use, 0, 21 + 40 / 60);
  const useAt = (hh: number) => today[Math.min(287, Math.max(0, Math.round(hh * 12)))].use;
  const surplus = series(today, row => Math.max(row.prod, row.use));
  const m = `matrix(${C} 0.5 0 1 ${(38 * C).toFixed(2)} -191)`;
  return (
    <g opacity={Math.min(1, s * 1.5)} transform={`translate(0 ${((1 - s) * 30).toFixed(2)})`}>
      <Box x={40} y={-9} z={0} dx={6} dy={4} dz={118} />
      <Box x={224} y={-9} z={0} dx={6} dy={4} dz={118} />
      <Box x={20} y={-10} z={116} dx={230} dy={6} dz={112} left={color.card} />
      <g transform={m}>
        <defs>
          <clipPath id={`${id}-bp`}>
            <rect x={-2} y={-30} width={sc.w * prodT + 2} height={110} />
          </clipPath>
          <clipPath id={`${id}-bu`}>
            <rect x={-2} y={-30} width={sc.w * useT + 2} height={110} />
          </clipPath>
        </defs>
        <text x={0} y={-6} fontFamily={fontFamily} fontSize={13} fontWeight={800} fill={color.ink} style={{ fontStretch: '75%', fontVariantNumeric: 'tabular-nums' }}>
          {`${value.toFixed(1).replace('.', ',')} kWh z dachu`}
        </text>
        <line x1={0} x2={sc.w} y1={sc.h} y2={sc.h} stroke={color.left} />
        <path d={area(surplus, sc, useAt)} fill={color.sunTint} opacity={fill} />
        <path d={line(prod, sc)} fill="none" stroke={color.sun} strokeWidth={2.2} strokeLinejoin="round" clipPath={`url(#${id}-bp)`} />
        <path d={line(use, sc)} fill="none" stroke={color.home} strokeWidth={1.6} strokeLinejoin="round" clipPath={`url(#${id}-bu)`} />
        {[0, 6, 12, 18, 24].map(h => (
          <text key={h} x={sc.x(h)} y={sc.h + 10} textAnchor="middle" fontFamily={fontFamily} fontSize={6.5} fill={color.secondary}>
            {`${h}:00`}
          </text>
        ))}
      </g>
    </g>
  );
};

const Washer3d = ({ f, frame }: { f: number; frame: number }) => {
  const b = marketingBeats[3];
  if (f < b.from) return null;
  const s = riseAt(f, b.from + 8);
  const m = `matrix(${C} 0.5 0 1 ${(-130 * C).toFixed(2)} 75)`;
  return (
    <g opacity={Math.min(1, s * 1.5)} transform={`translate(0 ${((1 - s) * 24).toFixed(2)})`}>
      <Flow route={[[120, 170, 2], [53, 170, 2]]} kw={f < b.from + 20 ? 0 : 2} frame={frame} hueId="home" weight={1} />
      <Box x={40} y={144} z={0} dx={26} dy={26} dz={30} />
      <g transform={m}>
        <rect x={3} y={3} width={20} height={3} fill={color.right} />
        <circle cx={13} cy={17} r={8.5} fill={color.card} />
        <circle cx={13} cy={17} r={6.2} fill={color.homeTint} stroke={color.home} strokeWidth={1.4} />
      </g>
    </g>
  );
};

const balanceCols = [
  { x: 216, v: facts.day.fromRoof, top: color.sunTint, left: color.sun, right: color.sunText, hueId: 'sun' as Hue, label: 'z dachu', dx: -72, dy: -46 },
  { x: 233, v: facts.day.fromBattery, top: color.batteryTint, left: color.battery, right: color.batteryText, hueId: 'battery' as Hue, label: 'z magazynu', dx: 30, dy: -86 },
  { x: 250, v: facts.day.fromGrid, top: color.left, left: color.grid, right: color.gridText, hueId: 'grid' as Hue, label: 'z sieci', dx: 74, dy: -20 },
];

const Columns = ({ f }: { f: number }) => {
  const b = marketingBeats[4];
  if (f < b.from) return null;
  return (
    <g>
      {balanceCols.map((col, i) => {
        const h = countAt(f, b.from + 10 + i * 4, 0, col.v * 8, 30);
        return <Box key={col.label} x={col.x} y={168} z={0} dx={13} dy={14} dz={Math.max(0.5, h)} top={col.top} left={col.left} right={col.right} />;
      })}
    </g>
  );
};

const columnTagsAt = (f: number): Tag[] => {
  const b = marketingBeats[4];
  if (f < b.from) return [];
  return balanceCols.map((col, i) => ({
    hue: col.hueId,
    value: `${col.v.toFixed(1).replace('.', ',')} kWh`,
    label: col.label,
    at: P(col.x + 6.5, 175, col.v * 8),
    dx: col.dx,
    dy: col.dy,
    opacity: progress(f, b.from + 34 + i * 4, 10),
  }));
};

const TagSvg = ({ tag, size }: { tag: Tag; size: number }) => {
  const w = size * 6.4;
  const h = size * 2.4;
  const [x, y] = tag.at;
  const bx = x + tag.dx - w / 2;
  const by = y + tag.dy - h / 2;
  return (
    <g opacity={tag.opacity ?? 1}>
      <line x1={x} y1={y} x2={x + tag.dx} y2={y + tag.dy} stroke={color.right} strokeWidth={size * 0.09} />
      <circle cx={x} cy={y} r={size * 0.18} fill={hue[tag.hue].line} />
      <rect x={bx} y={by + size * 0.2} width={w} height={h} rx={size * 0.3} fill={color.right} />
      <rect x={bx} y={by} width={w} height={h} rx={size * 0.3} fill={color.card} />
      <text x={bx + size * 0.45} y={by + size * 1.15} fontFamily={fontFamily} fontSize={size} fontWeight={800} style={{ fontStretch: '75%', fontVariantNumeric: 'tabular-nums' }} fill={hue[tag.hue].text}>
        {tag.value}
      </text>
      <text x={bx + size * 0.45} y={by + size * 2} fontFamily={fontFamily} fontSize={size * 0.6} fontWeight={500} fill={color.secondary}>
        {tag.label}
      </text>
    </g>
  );
};

const Wire = ({ from, to, mode, clock, opacity }: { from: [number, number]; to: [number, number]; mode: 'right' | 'down'; clock: number; opacity: number }) => {
  const [hx, hy] = from;
  const [tx, ty] = to;
  let d: string;
  if (mode === 'right') {
    const bx = tx - 40;
    const run = Math.max(0, bx - hx);
    const up = ty < hy ? -1 : 1;
    const by = hy + up * run * 0.57735;
    d = `M${hx} ${hy} L${bx} ${by} L${bx} ${ty} L${tx} ${ty}`;
  } else {
    const run = Math.max(0, tx - hx);
    const by = hy + run * 0.57735;
    d = `M${hx} ${hy} L${tx} ${by} L${tx} ${ty}`;
  }
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
      <g opacity={opacity}>
        <path d={d} fill="none" stroke={color.left} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />
        <path d={d} fill="none" stroke={color.sun} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="16 20" strokeDashoffset={-clock * facts.now.prod * 2} />
      </g>
    </svg>
  );
};

const Copy = ({ f, layout }: { f: number; layout: Layout }) => {
  const { copy } = layout;
  return (
    <>
      {marketingBeats.map((beat, i) => {
        if (f < beat.from || f > beat.to) return null;
        const first = i === 0;
        const start = first ? -999 : beat.from + 4;
        const out = i < marketingBeats.length - 1 ? progress(f, beat.to - 8, 8, easeIn) : 0;
        const words = beat.title.split(' ');
        return (
          <div key={beat.title} style={{ position: 'absolute', left: copy.left - copy.kicker * 1.2, top: copy.top - copy.kicker * 1.2, width: copy.width + copy.kicker * 2.4, padding: copy.kicker * 1.2, boxSizing: 'border-box', borderRadius: copy.kicker * 0.8, background: color.card, boxShadow: slab(6), opacity: 1 - out, transform: `translateY(${-out * 10}px)` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: copy.kicker * 0.4, padding: `${copy.kicker * 0.4}px ${copy.kicker * 0.7}px`, borderRadius: copy.kicker * 0.4, background: color.ground, fontSize: copy.kicker, ...semi, ...riseIn(f, start, first) }}>
              <span style={{ width: copy.kicker * 0.45, height: copy.kicker * 0.45, borderRadius: copy.kicker, background: hue[beatHue[i]].line }} />
              {beat.kicker}
            </div>
            <div style={{ marginTop: copy.kicker * 0.9, fontSize: copy.title, lineHeight: 1, ...num, letterSpacing: -copy.title * 0.01, textWrap: 'balance' }}>
              {words.map((word, w) => (
                <span key={w} style={{ display: 'inline-block', marginRight: '0.22em', ...riseIn(f, start + 4 + w * 3, first, copy.title * 0.25) }}>
                  {word}
                </span>
              ))}
            </div>
            {copy.line && (
              <div style={{ marginTop: copy.title * 0.3, fontSize: copy.line, lineHeight: 1.35, color: color.secondary, maxWidth: copy.width * 0.86, textWrap: 'balance', ...riseIn(f, start + 10 + words.length * 3, first) }}>
                {beat.line}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

const Stage = ({ f, clock, format }: { f: number; clock: number; format: Format }) => {
  const layout = layouts[format];
  const { width, height } = formats[format];
  const cam = cameraAt(f, layout);
  const sf = phoneFrameAt(f);
  const level = f >= marketingBeats[1].from && f <= marketingBeats[1].to ? batteryLevel(sf) : 0.955;
  const toStage = ([x, y]: readonly [number, number] | [number, number]): [number, number] => [layout.world.cx + (x - cam.x) * cam.scale, layout.world.cy + (y - cam.y) * cam.scale];
  const hub = toStage(nodes.hub);
  const p = layout.phone;
  const inset = (phone.bezel + phone.edge) * p.scale;
  const target: [number, number] =
    layout.wire === 'right' ? [p.left, p.top + inset + 150 * p.scale] : [p.left + (phone.width * p.scale) / 2, p.top];
  const sink = f >= marketing.outro ? progress(f, marketing.outro, 12, easeIn) : 0;
  const id = `m-${format}`;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - sink, transform: `translateY(${sink * 60}px)` }}>
      <HouseScene
        width={width}
        height={height}
        style={{ left: layout.world.cx - width / 2, top: layout.world.cy - height / 2 }}
        camera={cam}
        frame={clock}
        level={level}
        flows={liveFlows}
        focus={weightsAt(f)}
        sunAngle={clock * 0.3}
        glint={progress(f, 30, 40)}
        sunAt={P(258, 20, 176)}
        back={<Billboard f={f} id={id} />}
        extra={
          <>
            <Washer3d f={f} frame={clock} />
            <Columns f={f} />
          </>
        }
      />
      <Wire from={hub} to={target} mode={layout.wire} clock={clock} opacity={1} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', overflow: 'visible', left: layout.world.cx - width / 2, top: layout.world.cy - height / 2 }}>
        <g transform={`translate(${width / 2} ${height / 2}) scale(${cam.scale}) translate(${-cam.x} ${-cam.y})`}>
          {[...columnTagsAt(f), ...tagsAt(f)].map(tag => (tag.opacity && tag.opacity > 0.01 ? <TagSvg key={tag.label} tag={tag} size={layout.tag} /> : null))}
        </g>
      </svg>
      <div style={{ position: 'absolute', left: p.left, top: p.top }}>
        <PhoneFrame scale={p.scale} theme={phoneTheme}>
          <StoreFrame frame={sf} clock={clock} overlays={false} />
        </PhoneFrame>
      </div>
      <Copy f={Math.min(f, marketing.outro - 1)} layout={layout} />
    </div>
  );
};

const Outro = ({ f, format }: { f: number; format: Format }) => {
  const { outro } = layouts[format];
  const o = marketing.outro;
  const s = riseAt(f, o + 6);
  const sun = progress(f, o + 18, 18);
  const top = outro.cy - outro.icon;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{ width: outro.icon, height: outro.icon, borderRadius: outro.icon * 0.2227, overflow: 'hidden', boxShadow: `0 ${outro.icon * 0.035}px 0 ${color.right}`, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 40}px)` }}
          dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: `outro-${format}`, sun, lift: (1 - s) * 60 }).replace('fill="#EEF2F6"', `fill="${color.card}"`) }}
        />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + outro.icon * 0.16, textAlign: 'center', fontSize: outro.name, fontWeight: 800, fontStretch: '87.5%', lineHeight: 1.1, ...riseIn(f, o + 20, false, 20) }}>{app.name}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: outro.cy + outro.icon * 0.16 + outro.name * 1.25, textAlign: 'center', fontSize: outro.tagline, ...semi, color: color.secondary, ...riseIn(f, o + 28, false, 16) }}>{app.category}</div>
    </>
  );
};

const GroundGrid = ({ format }: { format: Format }) => {
  const { width, height } = formats[format];
  const step = 64;
  const lines: ReactNode[] = [];
  const span = width + height * 2;
  for (let k = -span; k < span; k += step) {
    lines.push(<line key={`a${k}`} x1={k} y1={0} x2={k + height / 0.57735} y2={height} />);
    lines.push(<line key={`b${k}`} x1={k} y1={0} x2={k - height / 0.57735} y2={height} />);
  }
  return (
    <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} stroke={color.left} strokeWidth={1} opacity={0.7}>
      {lines}
    </svg>
  );
};

export const Marketing = ({ format }: { format: Format; loop: boolean }) => {
  const f = useCurrentFrame();
  const { width, height } = formats[format];
  let body: ReactNode;
  if (f >= marketing.duration) {
    const t = bridgeT(f, marketing.duration, marketing.bridge);
    const gone = progress(t, 0, 0.4, easeIn);
    const back = progress(t, 0.3, 0.75);
    body = (
      <>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - gone, transform: `scale(${1 - 0.2 * gone})` }}>
          <Outro f={marketing.duration - 1} format={format} />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: back, transform: `translateY(${(1 - back) * 50}px)` }}>
          <Stage f={0} clock={f - loopTotal} format={format} />
        </div>
      </>
    );
  } else if (f >= marketing.outro) {
    body = (
      <>
        <Stage f={f} clock={f} format={format} />
        <Outro f={f} format={format} />
      </>
    );
  } else {
    body = <Stage f={f} clock={f} format={format} />;
  }
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 0, top: 0, width, height, background: color.ground, fontFamily, overflow: 'hidden' }}>
        <GroundGrid format={format} />
        {body}
      </div>
    </AppRoot>
  );
};

