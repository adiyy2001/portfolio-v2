import type { ReactNode } from 'react';
import { AppRoot, StoreFrame } from './Frame';
import { iconSvg } from './icon';
import { color, num, semi, slab } from './tokens';
import { app, type TabId } from './content';
import { facts } from './data';
import { storyboard } from './storyboard';
import { T } from './timeline';
import { Screen, TabBar } from './components/ui';
import { HouseScene, allOn, nodes } from './components/House';
import { LiveScene, liveFlows } from './Scene';
import { NowBody } from './screens/Now';
import { BatteryBody } from './screens/Battery';
import { DayBody } from './screens/Day';
import { TipsBody } from './screens/Tips';
import { BalanceBody, MonthBody } from './screens/Balance';
import { InstallBody } from './screens/Install';

const states: Record<number, { time: string; tab: TabId; node: ReactNode }> = {
  1: {
    time: facts.now.time,
    tab: 'now',
    node: (
      <>
        <LiveScene f={0} clock={12} t={0} still weights={allOn} />
        <NowBody f={0} />
      </>
    ),
  },
  2: {
    time: facts.now.time,
    tab: 'now',
    node: (
      <>
        <LiveScene f={0} clock={12} t={1} still weights={{ sun: 0.4, battery: 1, home: 0.4, grid: 0.4 }} />
        <BatteryBody f={999} still id="s-bat" />
      </>
    ),
  },
  3: { time: facts.day.time, tab: 'day', node: <DayBody f={999} still id="s-day" /> },
  4: { time: facts.tip.time, tab: 'tips', node: <TipsBody f={999} still id="s-tip" /> },
  5: { time: facts.month.time, tab: 'balance', node: <BalanceBody f={999} still /> },
  6: { time: facts.month.time, tab: 'balance', node: <MonthBody /> },
  7: { time: facts.install.time, tab: 'balance', node: <InstallBody /> },
};

export const ScreenStill = ({ screen }: { screen: number }) => {
  const state = states[screen] ?? states[1];
  return (
    <AppRoot>
      <Screen time={state.time}>
        {state.node}
        <TabBar f={0} from={state.tab} to={state.tab} at={0} />
      </Screen>
    </AppRoot>
  );
};

export const IconStill = ({ rounded }: { rounded: boolean }) => (
  <AppRoot background="transparent">
    <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded, id: 'still' }) }} />
  </AppRoot>
);

const seconds = (frame: number) => (frame / storyboard.fps).toFixed(1).replace('.', ',');

const marks = [
  { at: 0, label: 'przepływy na żywo', tone: color.sun },
  { at: T.track, label: 'kamera do magazynu', tone: color.battery },
  { at: T.socDraw, label: 'krzywa naładowania', tone: color.battery },
  { at: T.prodDraw, label: 'produkcja', tone: color.sun },
  { at: T.useDraw, label: 'zużycie', tone: color.home },
  { at: T.fcDraw, label: 'prognoza', tone: color.sun },
  { at: T.surplusCount, label: '4,1 kW', tone: color.sun },
  { at: T.ring, label: '92%', tone: color.battery },
  { at: T.valueCount, label: '23,10 zł', tone: color.ink },
  { at: T.icon, label: 'ikona', tone: color.ink },
];

const Timeline = ({ width }: { width: number }) => {
  const k = width / storyboard.duration;
  return (
    <div style={{ position: 'relative', width, height: 360, fontSize: 16 }}>
      {storyboard.shots.map((shot, i) => (
        <div key={shot.id} style={{ position: 'absolute', left: shot.from * k + 2, top: 34, width: (shot.to - shot.from + 1) * k - 4, height: 44, borderRadius: 8, background: i === 0 ? color.sunTint : color.card, boxShadow: slab(4), display: 'flex', alignItems: 'center', paddingLeft: 12, boxSizing: 'border-box', ...num, fontSize: 20 }}>
          {i + 1}
        </div>
      ))}
      {storyboard.shots.map(shot =>
        shot.overlay ? <div key={shot.id} style={{ position: 'absolute', left: shot.overlay.from * k, top: 98, width: (shot.overlay.to - shot.overlay.from + 1) * k, height: 10, borderRadius: 5, background: color.ink }} /> : null,
      )}
      {marks.map(mark => (
        <div key={mark.label} style={{ position: 'absolute', left: mark.at * k - 1, top: 122, width: 3, height: 18, borderRadius: 2, background: mark.tone }} />
      ))}
      <div style={{ position: 'absolute', left: 0, top: 0, color: color.secondary, fontSize: 15, ...semi }}>0 s</div>
      <div style={{ position: 'absolute', right: 0, top: 0, color: color.secondary, fontSize: 15, ...semi }}>{storyboard.duration / storyboard.fps} s</div>
      <div style={{ position: 'absolute', left: 0, top: 168, width, display: 'grid', gap: 10, color: color.secondary, lineHeight: '24px' }}>
        <div>
          <b style={{ color: color.ink, ...semi }}>klocki</b> ujęcia 1 do 6, jasnożółty to hak z przepływami
        </div>
        <div>
          <b style={{ color: color.ink, ...semi }}>ciemne paski</b> napisy, każdy co najmniej 2,2 s
        </div>
        <div>
          <b style={{ color: color.ink, ...semi }}>kreski</b> starty rysowania i liczenia, kolor mówi, czego dotyczą
        </div>
      </div>
    </div>
  );
};

export const Board = () => {
  const thumb = 0.58;
  const cellW = 443 * thumb;
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 84, top: 44 }}>
        <div style={{ fontWeight: 800, fontStretch: '87.5%', fontSize: 56, lineHeight: '64px' }}>
          {app.name}
          <span style={{ color: color.secondary, fontWeight: 500, fontStretch: '100%', fontSize: 30, marginLeft: 20 }}>storyboard</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 20, ...semi, color: color.secondary }}>
          886×1920, 30 kl./s, {storyboard.duration / storyboard.fps} s, {storyboard.duration} klatek, sześć ujęć, jedna informacja na ujęcie
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, top: 162, display: 'grid', gridTemplateColumns: `repeat(4, ${cellW}px)`, columnGap: 64, rowGap: 40 }}>
        {storyboard.shots.map((shot, i) => (
          <div key={shot.id} style={{ width: cellW }}>
            <div style={{ position: 'relative', width: cellW, height: 960 * thumb, overflow: 'hidden', borderRadius: 18, boxShadow: slab(6) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, transform: `scale(${thumb})`, transformOrigin: '0 0' }}>
                <StoreFrame frame={shot.key} />
              </div>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center', fontSize: 23, ...semi }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 34, height: 34, borderRadius: 8, background: i === 0 ? color.sunTint : color.card, boxShadow: slab(3), ...num, fontSize: 18 }}>{i + 1}</span>
              <span>{shot.name}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 16, lineHeight: '23px', color: color.secondary }}>
              {seconds(shot.from)} do {seconds(shot.to + 1)} s
              <br />
              klatki {shot.from} do {shot.to}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2', paddingTop: 30 }}>
          <div style={{ fontWeight: 700, fontSize: 34, marginBottom: 22 }}>Oś czasu</div>
          <Timeline width={cellW * 2 + 64} />
        </div>
      </div>
    </AppRoot>
  );
};

export const ogTags = [
  { hue: 'sun' as const, value: '6,4 kW', label: 'z dachu', at: nodes.roof, dx: -96, dy: -70 },
  { hue: 'battery' as const, value: '95%', label: 'magazyn', at: nodes.batteryTop, dx: 70, dy: -50 },
  { hue: 'home' as const, value: '0,5 kW', label: 'dom', at: nodes.home, dx: -70, dy: 48 },
  { hue: 'grid' as const, value: '4,6 kW', label: 'do sieci', at: nodes.grid, dx: -40, dy: -44 },
];

export const Og = () => (
  <AppRoot>
    <div style={{ position: 'absolute', left: 80, top: 120 }}>
      <div style={{ width: 120, height: 120, borderRadius: 27, overflow: 'hidden', boxShadow: slab(5) }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'og' }).replace('fill="#EEF2F6"', `fill="${color.card}"`) }} />
      <div style={{ marginTop: 34, fontWeight: 800, fontStretch: '87.5%', fontSize: 112, lineHeight: 1, letterSpacing: -1 }}>{app.name}</div>
      <div style={{ marginTop: 22, width: 480, fontSize: 30, lineHeight: 1.3, ...semi, color: color.secondary }}>App preview aplikacji do domowej fotowoltaiki z magazynem energii</div>
    </div>
    <HouseScene width={640} height={630} style={{ left: 580, top: 0 }} camera={{ x: 30, y: 100, scale: 1.45 }} frame={10} level={0.955} flows={liveFlows} tags={ogTags} tagSize={15} />
  </AppRoot>
);
