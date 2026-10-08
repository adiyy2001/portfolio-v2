import { PhoneFrame } from '../../shared/PhoneFrame';
import { AppRoot, StoreFrame } from './Frame';
import { phoneTheme } from './Marketing';
import { iconSvg } from './icon';
import { color, glow } from './tokens';
import { app } from './content';
import { storyboard } from './storyboard';
import { T } from './timeline';
import { Grid, fontDisplay } from './components/ui';
import { AlertScreen } from './screens/AlertScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { GeneratorScreen } from './screens/GeneratorScreen';
import { VaultScreen } from './screens/VaultScreens';
import { HealthScreen } from './screens/HealthScreen';
import { EntryScreen } from './screens/EntryScreen';

const ScreenState = ({ screen }: { screen: number }) => {
  if (screen === 1) return <AlertScreen f={18} />;
  if (screen === 2) return <DetailsScreen f={999} still />;
  if (screen === 3) return <GeneratorScreen f={999} still />;
  if (screen === 4) return <VaultScreen f={999} still />;
  if (screen === 5) return <HealthScreen f={999} still />;
  return <EntryScreen />;
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

const scans = [
  { at: T.hookScan, label: 'skan' },
  { at: T.details, label: 'skan' },
  { at: T.generator, label: 'skan' },
  { at: T.lock, label: 'skan' },
  { at: T.vaultScan, label: 'odblokowanie' },
  { at: T.health, label: 'skan' },
  { at: T.launch, label: 'skan' },
];

const Timeline = ({ width }: { width: number }) => {
  const k = width / storyboard.duration;
  return (
    <div style={{ position: 'relative', width, height: 330, fontSize: 15 }}>
      {storyboard.shots.map((shot, i) => (
        <div key={shot.id} style={{ position: 'absolute', left: shot.from * k + 1, top: 30, width: (shot.to - shot.from + 1) * k - 3, height: 46, boxShadow: `inset 0 0 0 1.5px ${i === 0 ? color.alert : color.cyan}`, borderRadius: 3, display: 'flex', alignItems: 'center', paddingLeft: 8, boxSizing: 'border-box', color: i === 0 ? color.alert : color.cyan, fontWeight: 700 }}>
          {i + 1}
        </div>
      ))}
      {storyboard.shots.map(shot =>
        shot.overlay ? (
          <div key={shot.id} style={{ position: 'absolute', left: shot.overlay.from * k, top: 96, width: (shot.overlay.to - shot.overlay.from + 1) * k, height: 12, background: color.text, borderRadius: 2 }} />
        ) : null,
      )}
      {scans.map(item => (
        <div key={item.at} style={{ position: 'absolute', left: item.at * k, top: 124, width: 2, height: 30, background: color.cyan, boxShadow: glow(color.cyan, 0.6, 8) }} />
      ))}
      <div style={{ position: 'absolute', left: 0, top: 0, color: color.muted, fontSize: 14 }}>0 s</div>
      <div style={{ position: 'absolute', right: 0, top: 0, color: color.muted, fontSize: 14 }}>{storyboard.duration / storyboard.fps} s</div>
      <div style={{ position: 'absolute', left: 0, top: 176, width, display: 'grid', gap: 10, color: color.muted, lineHeight: '22px' }}>
        <div>
          <span style={{ color: color.cyan }}>ramki</span> ujęcia 1 do 6, czerwona to hak z alertem
        </div>
        <div>
          <span style={{ color: color.text }}>białe paski</span> napisy, każdy co najmniej 2 s
        </div>
        <div>
          <span style={{ color: color.cyan }}>pionowe linie</span> skany, każdy 20 lub 30 klatek
        </div>
      </div>
    </div>
  );
};

export const Board = () => {
  const thumb = 0.62;
  const cellW = 443 * thumb;
  return (
    <AppRoot>
      <Grid cell={40} />
      <div style={{ position: 'absolute', left: 56, top: 40 }}>
        <div style={{ fontFamily: fontDisplay, fontWeight: 800, fontSize: 52, lineHeight: '60px', letterSpacing: 52 * 0.08, color: color.text }}>
          {app.name.toUpperCase()}
          <span style={{ color: color.muted, fontFamily: "'Azeret Mono', monospace", fontWeight: 500, fontSize: 28, letterSpacing: 0, marginLeft: 20 }}>storyboard</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 19, color: color.muted }}>
          886×1920, 30 kl./s, {storyboard.duration / storyboard.fps} s, {storyboard.duration} klatek, sześć ujęć
        </div>
      </div>
      <div style={{ position: 'absolute', left: 56, top: 150, display: 'grid', gridTemplateColumns: `repeat(4, ${cellW}px)`, columnGap: 40, rowGap: 36 }}>
        {storyboard.shots.map((shot, i) => (
          <div key={shot.id} style={{ width: cellW }}>
            <div style={{ position: 'relative', width: cellW, height: 960 * thumb, overflow: 'hidden', borderRadius: 6, boxShadow: `0 0 0 1.5px ${i === 0 ? color.alert : color.dim}` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, transform: `scale(${thumb})`, transformOrigin: '0 0' }}>
                <StoreFrame frame={shot.key} />
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 22, fontWeight: 700, color: color.text }}>
              <span style={{ color: i === 0 ? color.alert : color.cyan }}>{i + 1}</span>
              <span>{shot.name}</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 15, lineHeight: '22px', color: color.muted }}>
              {seconds(shot.from)} do {seconds(shot.to + 1)} s
              <br />
              klatki {shot.from} do {shot.to}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2', paddingTop: 28 }}>
          <div style={{ fontFamily: fontDisplay, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: color.text, marginBottom: 24 }}>OŚ CZASU</div>
          <Timeline width={cellW * 2 + 40} />
        </div>
      </div>
    </AppRoot>
  );
};

export const Og = () => (
  <AppRoot>
    <Grid cell={40} />
    <div style={{ position: 'absolute', left: 80, top: 110 }}>
      <div style={{ width: 104, height: 104, borderRadius: 23, overflow: 'hidden', boxShadow: `0 0 0 1.5px ${color.dim}` }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'og' }) }} />
      <div style={{ marginTop: 40, fontFamily: fontDisplay, fontWeight: 800, fontSize: 112, lineHeight: 1, letterSpacing: 112 * 0.12, color: color.text }}>
        {app.name.toUpperCase()}
      </div>
      <div style={{ marginTop: 28, width: 620, fontSize: 30, lineHeight: 1.3, color: color.text }}>{'App preview menedżera haseł z\u00a0alertami wycieków'}</div>
    </div>
    <div style={{ position: 'absolute', left: 830, top: 24 }}>
      <PhoneFrame scale={0.6} theme={phoneTheme}>
        <StoreFrame frame={storyboard.poster} overlays={false} />
      </PhoneFrame>
    </div>
  </AppRoot>
);
