import { app, launch } from '../content';
import { color } from '../tokens';
import { iconSvg } from '../icon';
import { Abs, Cap, Label, Screen, emWidth } from '../components/type';
import { Chrome } from '../components/chrome';

export const launchIcon = { size: 132, top: 310 } as const;
export const launchName = { size: 62, top: 486 } as const;

export const LaunchScreen = ({ wdth = 100, icon = 1, tagline = true }: { wdth?: number; icon?: number; tagline?: boolean }) => {
  const name = app.name.toUpperCase();
  const width = emWidth(name, wdth) * launchName.size;
  return (
    <Screen>
      {icon > 0 && (
        <Abs
          style={{
            left: (443 - launchIcon.size) / 2,
            top: launchIcon.top,
            width: launchIcon.size,
            height: launchIcon.size,
            borderRadius: launchIcon.size * 0.2227,
            boxShadow: `0 0 0 2px ${color.divider}`,
            transform: `scale(${icon})`,
          }}>
          <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: iconSvg({ rounded: true, id: 'launch' }) }} />
        </Abs>
      )}
      <Abs style={{ left: (443 - width) / 2, top: launchName.top }}>
        <Cap text={name} size={launchName.size} wdth={wdth} />
      </Abs>
      {tagline && (
        <Abs style={{ left: 0, right: 0, top: launchName.top + 66, display: 'flex', justifyContent: 'center' }}>
          <Label size={16}>{launch.tagline}</Label>
        </Abs>
      )}
      <Chrome />
    </Screen>
  );
};
