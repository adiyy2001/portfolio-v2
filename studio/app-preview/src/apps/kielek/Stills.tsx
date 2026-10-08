import type { ReactNode } from 'react';
import { AppRoot, StoreFrame } from './Frame';
import { ClayPhone } from './Marketing';
import { iconSvg } from './components/art';
import { clay, color } from './tokens';
import { app, type TabId } from './content';
import { storyboard } from './storyboard';
import { T } from './timeline';
import { Screen, TabBar } from './components/ui';
import { TodayScreen } from './screens/TodayScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { DiagnosisScreen } from './screens/DiagnosisScreen';
import { RoomsScreen } from './screens/RoomsScreen';
import { AddScreen, PlantScreen } from './screens/StillScreens';

const states: Record<number, { time: string; tab: TabId; node: ReactNode }> = {
  1: { time: '7:52', tab: 'today', node: <TodayScreen f={250} done /> },
  2: { time: '8:01', tab: 'today', node: <PlantScreen /> },
  3: { time: '7:53', tab: 'calendar', node: <CalendarScreen f={999} still /> },
  4: { time: '7:55', tab: 'diagnosis', node: <DiagnosisScreen f={999} still /> },
  5: { time: '7:56', tab: 'rooms', node: <RoomsScreen f={999} still /> },
  6: { time: '8:04', tab: 'rooms', node: <AddScreen /> },
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

const landings = [
  { at: T.hookHop + 17, label: 'hop' },
  { at: T.dropLand, label: 'kropla' },
  { at: T.cheerHop + 17, label: 'hop' },
  ...T.drops.map(at => ({ at, label: 'kropla' })),
  ...T.hops.map(at => ({ at: at + 13, label: 'kropla' })),
  { at: T.answer, label: 'karta' },
  { at: T.icon, label: 'ikona' },
];

const Timeline = ({ width }: { width: number }) => {
  const k = width / storyboard.duration;
  return (
    <div style={{ position: 'relative', width, height: 340, fontSize: 16 }}>
      {storyboard.shots.map((shot, i) => (
        <div
          key={shot.id}
          style={{
            position: 'absolute',
            left: shot.from * k + 2,
            top: 34,
            width: (shot.to - shot.from + 1) * k - 4,
            height: 48,
            borderRadius: 18,
            background: i === 0 ? color.butter : color.card,
            boxShadow: clay(0.4, 0.7),
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            boxSizing: 'border-box',
            fontWeight: 900,
          }}>
          {i + 1}
        </div>
      ))}
      {storyboard.shots.map(shot =>
        shot.overlay ? (
          <div key={shot.id} style={{ position: 'absolute', left: shot.overlay.from * k, top: 100, width: (shot.overlay.to - shot.overlay.from + 1) * k, height: 14, borderRadius: 7, background: color.ink }} />
        ) : null,
      )}
      {landings.map(item => (
        <div key={`${item.label}-${item.at}`} style={{ position: 'absolute', left: item.at * k - 7, top: 132, width: 14, height: 14, borderRadius: 7, background: color.water, boxShadow: clay(0.25, 0.5) }} />
      ))}
      <div style={{ position: 'absolute', left: 0, top: 0, color: color.inkSoft, fontSize: 15, fontWeight: 800 }}>0 s</div>
      <div style={{ position: 'absolute', right: 0, top: 0, color: color.inkSoft, fontSize: 15, fontWeight: 800 }}>{storyboard.duration / storyboard.fps} s</div>
      <div style={{ position: 'absolute', left: 0, top: 178, width, display: 'grid', gap: 12, color: color.inkSoft, lineHeight: '24px', fontWeight: 500 }}>
        <div>
          <b style={{ color: color.ink, fontWeight: 900 }}>pigułki</b> ujęcia 1 do 6, żółta to hak z maskotką
        </div>
        <div>
          <b style={{ color: color.ink, fontWeight: 900 }}>ciemne paski</b> napisy, każdy co najmniej 2 s
        </div>
        <div>
          <b style={{ color: color.ink, fontWeight: 900 }}>krople</b> lądowania ze zgnieceniem, rytm całego filmu
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
        <div style={{ fontWeight: 900, fontSize: 56, lineHeight: '64px', letterSpacing: -0.5 }}>
          {app.name}
          <span style={{ color: color.inkSoft, fontWeight: 800, fontSize: 30, marginLeft: 20 }}>storyboard</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 20, fontWeight: 800, color: color.inkSoft }}>
          886×1920, 30 kl./s, {storyboard.duration / storyboard.fps} s, {storyboard.duration} klatek, sześć ujęć
        </div>
      </div>
      <div style={{ position: 'absolute', left: 84, top: 162, display: 'grid', gridTemplateColumns: `repeat(4, ${cellW}px)`, columnGap: 64, rowGap: 40 }}>
        {storyboard.shots.map((shot, i) => (
          <div key={shot.id} style={{ width: cellW }}>
            <div style={{ position: 'relative', width: cellW, height: 960 * thumb, overflow: 'hidden', borderRadius: 30, boxShadow: clay(1) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, transform: `scale(${thumb})`, transformOrigin: '0 0' }}>
                <StoreFrame frame={shot.key} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', fontSize: 23, fontWeight: 900 }}>
              <span style={{ display: 'inline-grid', placeItems: 'center', width: 36, height: 36, borderRadius: 18, background: i === 0 ? color.butter : color.card, boxShadow: clay(0.3, 0.6), fontSize: 18 }}>{i + 1}</span>
              <span>{shot.name}</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 16, lineHeight: '23px', fontWeight: 800, color: color.inkSoft }}>
              {seconds(shot.from)} do {seconds(shot.to + 1)} s
              <br />
              klatki {shot.from} do {shot.to}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2', paddingTop: 30 }}>
          <div style={{ fontWeight: 900, fontSize: 34, marginBottom: 22 }}>Oś czasu</div>
          <Timeline width={cellW * 2 + 64} />
        </div>
      </div>
    </AppRoot>
  );
};

export const Og = () => (
  <AppRoot>
    <div style={{ position: 'absolute', left: 640, top: 40, width: 760, height: 760, borderRadius: '50%', background: color.card, boxShadow: clay(4, 5) }} />
    <div style={{ position: 'absolute', left: 80, top: 110 }}>
      <div style={{ width: 120, height: 120, borderRadius: 27, overflow: 'hidden', boxShadow: clay(1.2) }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'og' }) }} />
      <div style={{ marginTop: 34, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: -1 }}>{app.name}</div>
      <div style={{ marginTop: 24, width: 560, fontSize: 32, lineHeight: 1.3, fontWeight: 800, color: color.inkSoft }}>{'App preview aplikacji do pielęgnacji roślin domowych'}</div>
    </div>
    <div style={{ position: 'absolute', left: 790, top: 40 }}>
      <ClayPhone scale={0.66} frame={storyboard.poster} />
    </div>
  </AppRoot>
);
