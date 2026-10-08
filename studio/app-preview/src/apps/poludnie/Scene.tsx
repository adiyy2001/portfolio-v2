import type { ReactNode } from 'react';
import { bridgeT } from '../../shared/loop';
import { storyboard } from './storyboard';
import { T, outFrames } from './timeline';
import { facts, socAt } from './data';
import { HouseScene, type Flows, type Weights } from './components/House';
import { Screen, TabBar } from './components/ui';
import { easeIn, fadeOut, focusAt, mixN, progress, trackAt } from './components/motion';
import { NowBody, nowLayout } from './screens/Now';
import { BatteryBody, batteryLayout, batteryLevel } from './screens/Battery';
import { DayBody } from './screens/Day';
import { TipsBody } from './screens/Tips';
import { BalanceBody } from './screens/Balance';
import { LaunchBody, launchIcon } from './screens/Launch';

export const liveFlows: Flows = { sun: facts.now.prod, home: facts.now.home, battery: facts.now.battery, grid: facts.now.grid };

export const cameras = {
  now: { x: 30, y: 98, scale: 1.04 },
  battery: { x: 104, y: 120, scale: 1.6 },
} as const;

const timeAt = (f: number) => (f < T.day ? facts.now.time : f < T.tip ? facts.day.time : f < T.balance ? facts.tip.time : facts.month.time);

export const hookWeights: Weights = { sun: 1, battery: 0.4, home: 0.4, grid: 0.4 };

export const liveWeights = (f: number): Weights => {
  const b = focusAt(f, T.track + 4);
  return { sun: mixN(1, 0.4, b), battery: mixN(0.4, 1, b), home: 0.4, grid: 0.4 };
};

export const storeSun: [number, number] = [150, -30];

export const glintAt = (f: number) => progress(f, 18, 34);

export const LiveScene = ({ f, clock, t, still = false, weights }: { f: number; clock: number; t: number; still?: boolean; weights: Weights }) => {
  const top = mixN(nowLayout.sceneTop, batteryLayout.sceneTop, t);
  const height = mixN(nowLayout.sceneHeight, batteryLayout.sceneHeight, t);
  const camera = {
    x: mixN(cameras.now.x, cameras.battery.x, t),
    y: mixN(cameras.now.y, cameras.battery.y, t),
    scale: mixN(cameras.now.scale, cameras.battery.scale, t),
  };
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 443, height, overflow: 'hidden' }}>
      <HouseScene width={443} height={height} camera={camera} frame={clock} level={still ? socAt(13 + 10 / 60) : batteryLevel(f)} flows={liveFlows} focus={weights} sunAngle={clock * 0.3} glint={still ? 0 : glintAt(f)} sunAt={storeSun} />
    </div>
  );
};

const Out = ({ f, at, children }: { f: number; at: number; children: ReactNode }) =>
  f < at + outFrames ? <div style={{ position: 'absolute', inset: 0, ...fadeOut(f, at, outFrames) }}>{children}</div> : null;

const rowsAt = (f: number) => (hueId: string) => {
  if (hueId !== 'battery') return 0.4;
  return mixN(0.4, 1, focusAt(f, T.tap));
};

const pressAt = (f: number) => {
  if (f < T.tap) return 0;
  const down = progress(f, T.tap, 4, easeIn);
  const up = progress(f, T.tap + 6, 8);
  return Math.max(0, down - up);
};

const Live = ({ f, clock }: { f: number; clock: number }) => {
  const t = trackAt(f, T.track);
  return (
    <>
      <LiveScene f={f} clock={clock} t={t} weights={f < T.track ? hookWeights : liveWeights(f)} />
      {f < T.track + 10 && <NowBody f={f} leaveAt={T.track} rows={rowsAt(f)} press={pressAt(f)} />}
      {f >= T.track && <BatteryBody f={f} />}
    </>
  );
};

const Bridge = ({ f }: { f: number }) => {
  const t = bridgeT(f, storyboard.duration, storyboard.bridge);
  const clock = f - storyboard.duration - storyboard.bridge;
  const words = 1 - progress(t, 0, 0.35, x => x);
  const icon = 1 - progress(t, 0.1, 0.55, x => x);
  const show = progress(t, 0.25, 0.8);
  const bar = progress(t, 0.2, 0.75);
  const shrink = progress(t, 0, 0.6);
  return (
    <Screen time={t < 0.5 ? facts.month.time : facts.now.time}>
      <div style={{ position: 'absolute', inset: 0, opacity: show, transform: `translateY(${(1 - show) * 12}px)` }}>
        <LiveScene f={0} clock={clock} t={0} weights={hookWeights} />
        <NowBody f={0} rows={rowsAt(0)} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(0px, ${shrink * 90}px) scale(${1 - 0.45 * shrink})`, transformOrigin: `${launchIcon.x + launchIcon.size / 2}px ${launchIcon.y + launchIcon.size / 2}px` }}>
        <LaunchBody f={T.end - 1} words={words} iconOpacity={icon} />
      </div>
      <TabBar f={0} from="now" to="now" at={0} style={{ transform: `translateY(${(1 - bar) * 100}px)` }} />
    </Screen>
  );
};

export const Scene = ({ frame, clock }: { frame: number; clock?: number }) => {
  const f = frame;
  const c = clock ?? f;
  if (f >= T.end) return <Bridge f={f} />;
  let body: ReactNode;
  let tab: ReactNode;
  if (f < T.day) {
    body = <Live f={f} clock={c} />;
    tab = <TabBar f={f} from="now" to="now" at={0} />;
  } else if (f < T.tip) {
    body = (
      <>
        <Out f={f} at={T.day}>
          <Live f={T.day - 1} clock={c} />
        </Out>
        <DayBody f={f} />
      </>
    );
    tab = <TabBar f={f} from="now" to="day" at={T.day} />;
  } else if (f < T.balance) {
    body = (
      <>
        <Out f={f} at={T.tip}>
          <DayBody f={f} />
        </Out>
        <TipsBody f={f} />
      </>
    );
    tab = <TabBar f={f} from="day" to="tips" at={T.tip} />;
  } else if (f < T.launch) {
    body = (
      <>
        <Out f={f} at={T.balance}>
          <TipsBody f={f} />
        </Out>
        <BalanceBody f={f} />
      </>
    );
    tab = <TabBar f={f} from="tips" to="balance" at={T.balance} />;
  } else {
    const drop = progress(f, T.launch, 10, easeIn);
    body = (
      <>
        <Out f={f} at={T.launch}>
          <BalanceBody f={f} />
        </Out>
        <LaunchBody f={f} />
      </>
    );
    tab = <TabBar f={f} from="tips" to="balance" at={T.balance} style={{ transform: `translateY(${drop * 100}px)` }} />;
  }
  return (
    <Screen time={timeAt(f)}>
      {body}
      {tab}
    </Screen>
  );
};
