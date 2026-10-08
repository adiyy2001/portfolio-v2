import { clay, color } from '../tokens';
import { app, launch } from '../content';
import { T } from '../timeline';
import { Mascot, Text } from '../components/ui';
import { iconMascotBox, iconSvg } from '../components/art';
import { blinkAt, bounceAt, puffIn, wiggleAt } from '../components/motion';

export const launchIcon = { size: 184, x: (443 - 184) / 2, y: 292 } as const;

export const launchMascot = () => {
  const k = launchIcon.size / 1024;
  return { x: launchIcon.x + iconMascotBox.x * k, y: launchIcon.y + iconMascotBox.y * k, w: iconMascotBox.w * k };
};

export const launchPose = (f: number, id: string) => ({
  id,
  blink: blinkAt(f, T.launchBlink),
  leafL: wiggleAt(f, 50, 0),
  leafR: wiggleAt(f, 50, 17),
});

export const LaunchScreen = ({ f, still = false, hideMascot = false, words = 1, tile = 1 }: { f: number; still?: boolean; hideMascot?: boolean; words?: number; tile?: number }) => {
  const s = still ? 1 : bounceAt(f, T.icon);
  const m = launchMascot();
  const { size, x, y } = launchIcon;
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, transform: `scale(${s})`, opacity: Math.min(1, s * 3) }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: size * 0.2227, boxShadow: clay(1.4), opacity: tile }} />
        <div style={{ position: 'absolute', inset: 0, opacity: tile }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'launch', mascot: false }) }} />
        {!hideMascot && <Mascot x={m.x - x} y={m.y - y} w={m.w} pose={{ ...launchPose(still ? 0 : f, 'launch-m'), shadow: true }} />}
      </div>
      <div style={{ opacity: words }}>
        <div style={puffIn(f, T.name, still, '221px 540px')}>
          <Text x={0} y={508} w={443} align="center" size={54} weight={900}>
            {app.name}
          </Text>
        </div>
        <div style={puffIn(f, T.tagline, still, '221px 594px')}>
          <Text x={0} y={582} w={443} align="center" size={17} weight={800} tone={color.inkSoft}>
            {launch.tagline}
          </Text>
        </div>
      </div>
    </>
  );
};

