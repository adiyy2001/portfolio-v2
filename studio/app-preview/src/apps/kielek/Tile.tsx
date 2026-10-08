import { useCurrentFrame } from 'remotion';
import { AppRoot } from './Frame';
import { ClayPhone, outer } from './Marketing';
import { tile } from './storyboard';
import { clay, color } from './tokens';
import { dropSvg } from './components/art';
import { hop } from './components/motion';

const scale = 0.78;
const left = (480 - outer.w * scale) / 2;
const top = -80;

export const Tile = () => {
  const f = useCurrentFrame();
  const apex = tile.hop + 9;
  const frame = f < apex ? tile.from + Math.min(f, tile.cut - 1) : tile.from;
  const body = hop(f, tile.hop, 54, 9, 9);
  const bob = (k: number) => Math.sin((2 * Math.PI * f) / tile.duration + k) * 8;
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: -120, top: 260, width: 720, height: 720, borderRadius: '50%', background: color.card, boxShadow: clay(4, 5) }} />
      <div style={{ position: 'absolute', left, top, transform: `translateY(${body.y}px) scale(${body.sx}, ${body.sy})`, transformOrigin: '50% 100%' }}>
        <ClayPhone scale={scale} frame={frame} settled />
      </div>
      <div style={{ position: 'absolute', left: 14, top: 470 + bob(0), width: 34, height: 44 }} dangerouslySetInnerHTML={{ __html: dropSvg('tile-a') }} />
      <div style={{ position: 'absolute', left: 430, top: 380 + bob(2), width: 26, height: 34 }} dangerouslySetInnerHTML={{ __html: dropSvg('tile-b') }} />
    </AppRoot>
  );
};
