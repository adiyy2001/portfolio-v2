import { PhoneFrame } from '../../shared/PhoneFrame';
import { StatusBar } from '../../shared/StatusBar';
import { AppRoot, StoreFrame } from './Frame';
import { phoneTheme } from './Marketing';
import { iconSvg } from './icon';
import { color } from './tokens';
import { app, liveTicket, times } from './content';
import { storyboard } from './storyboard';
import { fontFamily, Scrim } from './components/ui';
import { Home } from './screens/Home';
import { BuySheet } from './screens/BuySheet';
import { MyTickets } from './screens/MyTickets';
import { LiveTicket } from './screens/LiveTicket';
import { RouteSheet } from './screens/RouteSheet';
import { Inspector } from './screens/Inspector';

const live = { frame: 400, live: 1, validated: 1, hold: 1, remaining: liveTicket.lengthSeconds - 55 };


const ScreenState = ({ screen }: { screen: number }) => {
  if (screen === 1) return <Home time={times.buy} />;
  if (screen === 2)
    return (
      <>
        <Home time={times.buy} highlight={1} />
        <Scrim amount={1} />
        <BuySheet rise={1} />
      </>
    );
  if (screen === 3) return <MyTickets time={times.validate} card={{ frame: 0 }} />;
  if (screen === 4) return <MyTickets time={times.validate} card={{ frame: 0, hold: 0.62, touch: 1 }} />;
  if (screen === 5) return <LiveTicket time={times.validate} card={live} />;
  if (screen === 6)
    return (
      <>
        <LiveTicket time={times.validate} card={live} />
        <Scrim amount={1} />
        <RouteSheet rise={1} />
        <StatusBar time={times.validate} color={color.ink} fontFamily={fontFamily} />
      </>
    );
  return <Inspector time={times.validate} progress={1} frame={640} remaining={liveTicket.lengthSeconds - 70} />;
};

export const ScreenStill = ({ screen }: { screen: number }) => (
  <AppRoot background={color.surface}>
    <ScreenState screen={screen} />
  </AppRoot>
);

export const IconStill = ({ rounded }: { rounded: boolean }) => (
  <AppRoot background="transparent">
    <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded, id: 'still' }) }} />
  </AppRoot>
);

const seconds = (frame: number) => (frame / storyboard.fps).toFixed(1).replace('.', ',');

export const Board = () => {
  const thumb = 0.62;
  const cellW = 443 * thumb;
  return (
    <AppRoot background={color.surface}>
      <div style={{ position: 'absolute', left: 56, top: 44, fontFamily, color: color.ink }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.6 }}>{app.name}: storyboard wersji sklepowej</div>
        <div style={{ fontSize: 19, fontWeight: 500, color: color.secondary, marginTop: 6 }}>
          886×1920, 30 kl./s, {storyboard.duration / storyboard.fps} s, {storyboard.duration} klatek. Klatka kluczowa każdego ujęcia.
        </div>
      </div>
      <div style={{ position: 'absolute', left: 56, top: 150, display: 'grid', gridTemplateColumns: `repeat(4, ${cellW}px)`, columnGap: 40, rowGap: 36 }}>
        {storyboard.shots.map((shot, i) => (
          <div key={shot.id} style={{ fontFamily, width: cellW }}>
            <div style={{ position: 'relative', width: cellW, height: 960 * thumb, borderRadius: 22, overflow: 'hidden', boxShadow: `0 0 0 1px ${color.separator}` }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, transform: `scale(${thumb})`, transformOrigin: '0 0' }}>
                <StoreFrame frame={shot.key} />
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, color: color.ink }}>
              <span style={{ color: color.brand }}>{i + 1}</span> {shot.name}
            </div>
            <div style={{ marginTop: 2, fontSize: 15, fontWeight: 500, color: color.secondary, fontFeatureSettings: "'tnum'" }}>
              {seconds(shot.from)} do {seconds(shot.to + 1)} s, klatki {shot.from} do {shot.to}
            </div>
          </div>
        ))}
      </div>
    </AppRoot>
  );
};

export const Og = () => (
  <AppRoot background={color.grouped}>
    <div style={{ position: 'absolute', left: 80, top: 150, width: 640, fontFamily, color: color.ink }}>
      <div style={{ width: 96, height: 96 }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'og' }) }} />
      <div style={{ marginTop: 28, fontSize: 88, lineHeight: 1, fontWeight: 800, letterSpacing: -2.6 }}>{app.name}</div>
      <div style={{ marginTop: 18, fontSize: 32, lineHeight: 1.25, fontWeight: 600, color: color.secondary, maxWidth: 600 }}>
        App preview aplikacji z biletami komunikacji miejskiej
      </div>
    </div>
    <div style={{ position: 'absolute', left: 790, top: 46 }}>
      <PhoneFrame scale={0.64} theme={phoneTheme}>
        <StoreFrame frame={storyboard.poster} overlays={false} />
      </PhoneFrame>
    </div>
  </AppRoot>
);
