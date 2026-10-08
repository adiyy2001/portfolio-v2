import { PhoneFrame } from '../../shared/PhoneFrame';
import { AppRoot, StoreFrame } from './Frame';
import { phoneTheme } from './Marketing';
import { iconSvg } from './icon';
import { color } from './tokens';
import { app } from './content';
import { storyboard } from './storyboard';
import { Cap, Label, vf } from './components/type';
import { SetScreen } from './screens/SetScreen';
import { PlanScreen } from './screens/PlanScreen';
import { PlatesScreen } from './screens/PlatesScreen';
import { RestScreen } from './screens/RestScreen';
import { RecordScreen } from './screens/RecordScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { finalWdth } from './Scene';

const ScreenState = ({ screen }: { screen: number }) => {
  if (screen === 1) return <SetScreen lift="squat" set={3} done={2} wdth={finalWdth} />;
  if (screen === 2) return <PlanScreen />;
  if (screen === 3) return <PlatesScreen />;
  if (screen === 4) return <RestScreen seconds={180} />;
  if (screen === 5) return <RecordScreen frame={999} start={0} letterStep={2} lift={1} result={1} rm={1} previous />;
  return <HistoryScreen />;
};

export const ScreenStill = ({ screen }: { screen: number }) => (
  <AppRoot>
    <ScreenState screen={screen} />
  </AppRoot>
);

export const IconStill = ({ rounded }: { rounded: boolean }) => (
  <AppRoot background="transparent">
    <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded, id: 'still' }) }} />
  </AppRoot>
);

const seconds = (frame: number) => (frame / storyboard.fps).toFixed(1).replace('.', ',');

const beats = storyboard.duration / 15;

const Ruler = ({ width }: { width: number }) => {
  const step = width / beats;
  return (
    <div style={{ position: 'relative', width, height: 220 }}>
      {Array.from({ length: beats }, (_, i) => {
        const start = storyboard.shots.find(shot => shot.from === i * 15);
        return (
          <div key={i}>
            <div style={{ position: 'absolute', left: i * step, top: start ? 40 : 70, width: Math.max(2, step - 4), height: start ? 70 : 40, background: start ? color.signal : color.divider }} />
            {start && (
              <div style={{ position: 'absolute', left: i * step, top: 0, ...vf(800, 75), fontSize: 18, color: color.ink }}>
                {storyboard.shots.indexOf(start) + 1}
              </div>
            )}
          </div>
        );
      })}
      {storyboard.shots.map(shot =>
        shot.overlay ? (
          <div
            key={shot.id}
            style={{ position: 'absolute', left: (shot.overlay.from / 15) * step, top: 128, width: ((shot.overlay.to - shot.overlay.from + 1) / 15) * step, height: 14, background: color.ink }}
          />
        ) : null,
      )}
      <div style={{ position: 'absolute', left: 0, top: 160, ...vf(600, 100), fontSize: 16, lineHeight: '22px', color: color.secondary, width }}>
        Każdy prostokąt to jedno uderzenie, 15 klatek. Pomarańczowe: początki ujęć. Białe paski: napisy.
      </div>
    </div>
  );
};

export const Board = () => {
  const thumb = 0.62;
  const cellW = 443 * thumb;
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 56, top: 44 }}>
        <Cap text={`${app.name.toUpperCase()}: STORYBOARD`} size={52} wdth={100} />
        <Label size={19} wght={600} wdth={100} fill={color.secondary} style={{ marginTop: 16, letterSpacing: 0.2 }}>
          886×1920, 30 kl./s, {storyboard.duration / storyboard.fps} s, {storyboard.duration} klatek, {beats} uderzeń po 15 klatek
        </Label>
      </div>
      <div style={{ position: 'absolute', left: 56, top: 150, display: 'grid', gridTemplateColumns: `repeat(4, ${cellW}px)`, columnGap: 40, rowGap: 36 }}>
        {storyboard.shots.map((shot, i) => (
          <div key={shot.id} style={{ width: cellW }}>
            <div style={{ position: 'relative', width: cellW, height: 960 * thumb, overflow: 'hidden', boxShadow: `0 0 0 2px ${color.divider}` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, transform: `scale(${thumb})`, transformOrigin: '0 0' }}>
                <StoreFrame frame={shot.key} />
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'baseline', ...vf(900, 75), fontSize: 24, color: color.ink }}>
              <span style={{ color: color.signal }}>{i + 1}</span>
              <span>{shot.name.toUpperCase()}</span>
            </div>
            <div style={{ marginTop: 4, ...vf(600, 100), fontSize: 15, color: color.secondary }}>
              {seconds(shot.from)} do {seconds(shot.to + 1)} s, klatki {shot.from} do {shot.to}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2', paddingTop: 40 }}>
          <Cap text="SIATKA 120 BPM" size={44} wdth={100} />
          <div style={{ height: 40 }} />
          <Ruler width={cellW * 2 + 40} />
        </div>
      </div>
    </AppRoot>
  );
};

export const Og = () => (
  <AppRoot>
    <div style={{ position: 'absolute', left: 80, top: 120 }}>
      <div style={{ width: 104, height: 104, borderRadius: 23, boxShadow: `0 0 0 2px ${color.divider}` }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'og' }) }} />
      <div style={{ marginTop: 40 }}>
        <Cap text={app.name.toUpperCase()} size={120} wdth={100} />
      </div>
      <div style={{ marginTop: 30, width: 600, ...vf(600, 100), fontSize: 32, lineHeight: 1.25, color: color.ink }}>
        App preview dziennika treningu siłowego
      </div>
    </div>
    <div style={{ position: 'absolute', left: 800, top: 22 }}>
      <PhoneFrame scale={0.6} theme={phoneTheme}>
        <StoreFrame frame={storyboard.poster} overlays={false} />
      </PhoneFrame>
    </div>
  </AppRoot>
);
