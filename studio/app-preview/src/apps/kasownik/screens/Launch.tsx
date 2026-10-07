import { color } from '../tokens';
import { app } from '../content';
import { Abs, ScreenBase, fontFamily } from '../components/ui';
import { iconSvg } from '../icon';

export const launchIcon = { size: 128, top: 360 } as const;

export const Launch = ({ icon = 1, name = 1 }: { icon?: number; name?: number }) => (
  <ScreenBase background={color.surface}>
    <Abs
      style={{
        left: (443 - launchIcon.size) / 2,
        top: launchIcon.top,
        width: launchIcon.size,
        height: launchIcon.size,
        transform: `scale(${icon})`,
        opacity: Math.min(1, icon * 2),
      }}>
      <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'launch' }) }} />
    </Abs>
    <Abs
      style={{
        left: 0,
        right: 0,
        top: launchIcon.top + launchIcon.size + 26,
        textAlign: 'center',
        fontFamily,
        fontSize: 32,
        lineHeight: '38px',
        fontWeight: 800,
        letterSpacing: -0.6,
        color: color.ink,
        opacity: name,
        transform: `translateY(${(1 - name) * 10}px)`,
      }}>
      {app.name}
    </Abs>
  </ScreenBase>
);
