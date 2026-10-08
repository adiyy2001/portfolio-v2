import type { ReactNode } from 'react';
import { Easing } from 'remotion';
import { mix } from '../../shared/motion';
import { bridgeT } from '../../shared/loop';
import { storyboard } from './storyboard';
import { T, leaveFrames } from './timeline';
import { today } from './content';
import { Mascot, Screen, TabBar } from './components/ui';
import { arc, bounceAt, easeIn, inOut, progress, wiggleAt } from './components/motion';
import { TodayScreen, mascotBig } from './screens/TodayScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { DiagnosisScreen } from './screens/DiagnosisScreen';
import { RoomsScreen } from './screens/RoomsScreen';
import { LaunchScreen, launchMascot } from './screens/LaunchScreen';

const timeAt = (f: number) => (f < T.calendar ? today.time : f < T.diagnosis ? '7:53' : f < T.rooms ? '7:55' : '7:56');

const cardPop = Easing.out(Easing.back(1.6));

const Out = ({ f, at, children }: { f: number; at: number; children: ReactNode }) => {
  if (f >= at + leaveFrames) return null;
  const t = progress(f, at, leaveFrames, easeIn);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - t, transform: `translateX(${-150 * t}px) scale(${1 - 0.06 * t}, ${1 - 0.03 * t})`, transformOrigin: '0% 50%' }}>
      {children}
    </div>
  );
};

const In = ({ f, at, children }: { f: number; at: number; children: ReactNode }) => {
  const s = bounceAt(f, at);
  const squash = Math.max(0, s - 1);
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - s) * 190}px) scale(${1 - squash * 0.25}, ${1 + squash * 0.2})`, transformOrigin: '100% 50%' }}>
      {children}
    </div>
  );
};

const Bridge = ({ f }: { f: number }) => {
  const t = bridgeT(f, storyboard.duration, storyboard.bridge);
  const u = inOut(t);
  const from = launchMascot();
  const words = 1 - progress(t, 0, 0.35, x => x);
  const tile = 1 - progress(t, 0.05, 0.3, x => x);
  const greet = progress(t, 0.45, 0.55, x => x);
  const bar = progress(t, 0.25, 0.75, inOut);
  return (
    <Screen time={today.time}>
      <LaunchScreen f={T.end - 1} hideMascot words={words} tile={tile} />
      <TodayScreen f={0} hideMascot greet={greet} cardShow={cardPop(progress(t, 0.35, 0.65, x => x))} />
      <TabBar f={0} from="today" to="today" at={0} style={{ transform: `translateY(${(1 - bar) * 130}px)` }} />
      <Mascot
        x={mix(from.x, mascotBig.x, u)}
        y={mix(from.y, mascotBig.y, u) + arc(u, 70)}
        w={mix(from.w, mascotBig.w, u)}
        body={{ y: 0, sx: 1 - 0.04 * Math.sin(Math.PI * u), sy: 1 + 0.06 * Math.sin(Math.PI * u) }}
        pose={{ id: 'bridge', leafL: wiggleAt(f, 50, 0), leafR: wiggleAt(f, 50, 17) }}
        style={{ zIndex: 20 }}
      />
    </Screen>
  );
};

export const Scene = ({ frame, hideMascot = false, settled = false }: { frame: number; hideMascot?: boolean; settled?: boolean }) => {
  const f = frame;
  if (f >= T.end) return <Bridge f={f} />;
  const time = timeAt(f);
  const tab = (() => {
    if (f >= T.launch) {
      const drop = progress(f, T.launch, 10, easeIn);
      return <TabBar f={f} from="diagnosis" to="rooms" at={T.rooms} style={{ transform: `translateY(${drop * 130}px)` }} />;
    }
    if (f >= T.rooms) return <TabBar f={f} from="diagnosis" to="rooms" at={T.rooms} />;
    if (f >= T.diagnosis) return <TabBar f={f} from="calendar" to="diagnosis" at={T.diagnosis} />;
    if (f >= T.calendar) return <TabBar f={f} from="today" to="calendar" at={T.calendar} />;
    return <TabBar f={f} from="today" to="today" at={0} />;
  })();
  let body: ReactNode;
  if (f < T.calendar) body = <TodayScreen f={f} hideMascot={hideMascot} settled={settled} />;
  else if (f < T.diagnosis)
    body = (
      <>
        <Out f={f} at={T.calendar}>
          <TodayScreen f={f} hideMascot={hideMascot} />
        </Out>
        <In f={f} at={T.calendar}>
          <CalendarScreen f={f} />
        </In>
      </>
    );
  else if (f < T.rooms)
    body = (
      <>
        <Out f={f} at={T.diagnosis}>
          <CalendarScreen f={f} />
        </Out>
        <In f={f} at={T.diagnosis}>
          <DiagnosisScreen f={f} />
        </In>
      </>
    );
  else if (f < T.launch)
    body = (
      <>
        <Out f={f} at={T.rooms}>
          <DiagnosisScreen f={f} />
        </Out>
        <In f={f} at={T.rooms}>
          <RoomsScreen f={f} />
        </In>
      </>
    );
  else
    body = (
      <>
        <Out f={f} at={T.launch}>
          <RoomsScreen f={f} />
        </Out>
        <LaunchScreen f={f} />
      </>
    );
  return (
    <Screen time={time}>
      {body}
      {tab}
    </Screen>
  );
};
