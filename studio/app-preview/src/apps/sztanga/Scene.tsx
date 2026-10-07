import { color } from './tokens';
import { T, restAt } from './timeline';
import { slamScale, widthAt } from './components/type';
import { SetScreen } from './screens/SetScreen';
import { PlanScreen } from './screens/PlanScreen';
import { PlatesScreen } from './screens/PlatesScreen';
import { RestScreen } from './screens/RestScreen';
import { RecordScreen } from './screens/RecordScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { LaunchScreen } from './screens/LaunchScreen';

export const finalWdth = 75;

export const hookWdth = (f: number) =>
  widthAt(f, [
    { at: 0, w: 50 },
    { at: T.stretchA, w: 150 },
    { at: T.stretchB, w: finalWdth },
  ]);

const Hook = ({ f }: { f: number }) => (
  <SetScreen lift="squat" set={3} done={2} wdth={hookWdth(f)} kg={slamScale(f, T.slamKg)} setRow={slamScale(f, T.slamSet)} />
);

const Flash = () => <div style={{ position: 'absolute', inset: 0, background: color.signal }} />;

export const Scene = ({ frame }: { frame: number }) => {
  const f = frame;
  if (f >= T.end) {
    if (f - T.end < T.bridgeFlash) return <Flash />;
    return <Hook f={0} />;
  }
  if (f < T.plan) return <Hook f={f} />;
  if (f < T.plates) return <PlanScreen rows={T.planRows.map(at => slamScale(f, at))} />;
  if (f < T.setBack) return <PlatesScreen steps={T.plateSteps.map(at => slamScale(f, at))} sum={slamScale(f, T.plateSum)} />;
  if (f < T.rest) {
    const pressed = f >= T.pressSquat;
    return <SetScreen lift="squat" set={3} done={pressed ? 3 : 2} wdth={finalWdth} pressed={pressed} />;
  }
  if (f < T.set4) return <RestScreen seconds={restAt(f)} />;
  if (f < T.set5Invert) return <SetScreen lift="squat" set={4} done={3} wdth={finalWdth} setRow={slamScale(f, T.set4)} />;
  if (f < T.set5) return <SetScreen lift="squat" set={5} done={4} wdth={finalWdth} inverted />;
  if (f < T.deadlift) return <SetScreen lift="squat" set={5} done={4} wdth={finalWdth} signalSet />;
  if (f < T.record) {
    const pressed = f >= T.pressDeadlift;
    const wdth = widthAt(f, [
      { at: T.deadlift, w: 150 },
      { at: T.deadlift + 1, w: finalWdth },
    ]);
    return <SetScreen lift="deadlift" set={1} done={pressed ? 1 : 0} wdth={wdth} pressed={pressed} />;
  }
  if (f < T.history)
    return (
      <RecordScreen
        frame={f}
        start={T.record}
        letterStep={T.recordLetters}
        lift={slamScale(f, T.recordLift)}
        result={slamScale(f, T.recordResult)}
        rm={slamScale(f, T.recordRm)}
        previous={f >= T.recordPrevious}
      />
    );
  if (f < T.launch) return <HistoryScreen bars={Math.min(8, Math.floor((f - T.history) / T.historyStep) + 1)} />;
  return (
    <LaunchScreen
      wdth={widthAt(f, [
        { at: T.launch, w: 150 },
        { at: T.launch + 1, w: 100 },
      ])}
      icon={slamScale(f, T.launchIcon)}
      tagline={f >= T.launchTagline}
    />
  );
};
