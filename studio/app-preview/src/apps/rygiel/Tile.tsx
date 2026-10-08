import { useCurrentFrame } from 'remotion';
import { PhoneFrame, phone } from '../../shared/PhoneFrame';
import { AppRoot, StoreFrame } from './Frame';
import { phoneTheme } from './Marketing';
import { tile } from './storyboard';
import { color } from './tokens';
import { Grid, Wipe, progress, scanEase } from './components/ui';

const scale = 0.78;
const left = (480 - phone.width * scale) / 2;
const top = -36;

const Screen = ({ f }: { f: number }) => {
  const store = (n: number) => <StoreFrame frame={n} overlays={false} gridFrame={f} gridTotal={tile.duration} />;
  if (f < tile.cut) return store(f);
  const gen = tile.from + (f - tile.cut);
  if (f < tile.cut + 15) return <Wipe t={progress(f, tile.cut, 15, scanEase)} from={store(tile.cut - 1)} to={store(gen)} />;
  if (f < tile.back) return store(gen);
  return <Wipe t={progress(f, tile.back, tile.duration - 1 - tile.back, scanEase)} from={store(tile.from + tile.back - tile.cut)} to={store(0)} />;
};

export const Tile = () => {
  const f = useCurrentFrame();
  const drift = ((f % tile.duration) / tile.duration) * 40;
  return (
    <AppRoot>
      <Grid cell={40} offset={drift} style={{ backgroundPosition: `0px ${drift}px`, opacity: 0.8 }} />
      <div style={{ position: 'absolute', left, top }}>
        <PhoneFrame scale={scale} theme={{ ...phoneTheme, shadow: phoneTheme.shadow }}>
          <Screen f={f} />
        </PhoneFrame>
      </div>
      <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 1px ${color.grid}` }} />
    </AppRoot>
  );
};
