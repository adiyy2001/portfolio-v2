import { Easing, useCurrentFrame } from 'remotion';
import { PhoneFrame } from '../../shared/PhoneFrame';
import { window01 } from '../../shared/motion';
import { AppRoot, StoreFrame } from './Frame';
import { phoneTheme } from './Marketing';
import { tile } from './storyboard';
import { color } from './tokens';

const inOut = Easing.bezier(0.45, 0, 0.55, 1);
const playFrames = 120;

export const Tile = () => {
  const f = useCurrentFrame();
  const fadeBack = inOut(window01(f, playFrames, tile.duration));
  return (
    <AppRoot background={color.brandTint}>
      <div style={{ position: 'absolute', left: 50, top: 44 }}>
        <PhoneFrame scale={0.8} theme={{ ...phoneTheme, shadow: '0 24px 48px rgba(0,107,63,0.16)' }}>
          <StoreFrame frame={tile.from} overlays={false} />
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - fadeBack }}>
            <StoreFrame frame={tile.from + Math.min(f, playFrames - 1)} overlays={false} />
          </div>
        </PhoneFrame>
      </div>
    </AppRoot>
  );
};
