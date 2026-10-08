import { color, semi } from '../tokens';
import { app, launch } from '../content';
import { iconSvg } from '../icon';
import { progress, riseAt, riseIn, drawEase } from '../components/motion';
import { T } from '../timeline';

export const launchIcon = { size: 168, x: (443 - 168) / 2, y: 300 } as const;

export const LaunchBody = ({ f, still = false, words = 1, iconOpacity = 1 }: { f: number; still?: boolean; words?: number; iconOpacity?: number }) => {
  const s = still ? 1 : riseAt(f, T.icon);
  const sun = still ? 1 : progress(f, T.disc, 18, drawEase);
  const { size, x, y } = launchIcon;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size * 0.2227,
          overflow: 'hidden',
          boxShadow: `0 6px 0 ${color.right}, 0 18px 30px rgba(21,32,43,0.08)`,
          opacity: Math.min(1, s * 2) * iconOpacity,
          transform: `translateY(${(1 - s) * 24}px)`,
        }}
        dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'launch', sun, lift: (1 - s) * 60 }).replace('fill="#EEF2F6"', `fill="${color.card}"`) }}
      />
      <div style={{ opacity: words }}>
        <div style={{ position: 'absolute', left: 0, width: 443, top: 506, textAlign: 'center', fontSize: 56, lineHeight: 1, fontWeight: 800, fontStretch: '87.5%', letterSpacing: -0.5, ...riseIn(f, T.name, still) }}>{app.name}</div>
        <div style={{ position: 'absolute', left: 0, width: 443, top: 576, textAlign: 'center', fontSize: 17, ...semi, color: color.secondary, ...riseIn(f, T.tagline, still) }}>{launch.tagline}</div>
      </div>
    </div>
  );
};
