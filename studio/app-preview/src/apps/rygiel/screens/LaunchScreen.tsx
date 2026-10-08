import { app, launch } from '../content';
import { color } from '../tokens';
import { T } from '../timeline';
import { iconSvg } from '../icon';
import { Abs, Scramble, Screen, drawAt, fontDisplay, progress, scanEase } from '../components/ui';

export const launchIcon = { size: 168, top: 288 } as const;

export const LaunchScreen = ({ f, still = false }: { f: number; still?: boolean }) => {
  const drawn = still ? 1 : drawAt(f, T.iconDraw, 18);
  const shut = still ? 1 : progress(f, T.boltShut, 10, scanEase);
  const frame = still ? 1 : drawAt(f, T.iconDraw - 6, 18);
  return (
    <Screen time="21:39">
      <div
        style={{
          position: 'absolute',
          left: (443 - launchIcon.size) / 2,
          top: launchIcon.top,
          width: launchIcon.size,
          height: launchIcon.size,
          borderRadius: launchIcon.size * 0.2227,
          background: color.void,
          boxShadow: `inset 0 0 0 1.5px ${color.dim}`,
          opacity: frame,
          overflow: 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'launch', shut, drawn, bg: false }) }}
      />
      <Abs style={{ left: 0, right: 0, top: launchIcon.top + launchIcon.size + 40, textAlign: 'center', fontFamily: fontDisplay, fontWeight: 800, fontSize: 46, lineHeight: '50px', letterSpacing: 46 * 0.16, paddingLeft: 46 * 0.16 }}>
        <Scramble text={app.name.toUpperCase()} f={f} start={still ? -999 : T.name} opts={{ step: 2, min: 6, max: 9, seed: 3 }} />
      </Abs>
      <Abs style={{ left: 0, right: 0, top: launchIcon.top + launchIcon.size + 108, textAlign: 'center', fontSize: 13, letterSpacing: 13 * 0.24, paddingLeft: 13 * 0.24, color: color.muted, fontWeight: 500 }}>
        <Scramble text={launch.tagline} f={f} start={still ? -999 : T.tagline} fill={color.muted} opts={{ step: 1, min: 3, max: 5 }} />
      </Abs>
    </Screen>
  );
};
