import { useCurrentFrame } from 'remotion';
import { AppRoot } from './Frame';
import { color } from './tokens';
import { lifts } from './content';
import { Cap, Label, capRatio, fitSize, widthAt } from './components/type';

export const tileWidths = [50, 150, 75, 125, 60, 150, 100, 50];

export const Tile = () => {
  const f = useCurrentFrame();
  const wdth = widthAt(
    f,
    tileWidths.map((w, i) => ({ at: i * 15, w })),
  );
  const size = fitSize(lifts.squat.load, wdth, 432);
  const bottom = 404;
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 24, top: bottom - size * capRatio }}>
        <Cap text={lifts.squat.load} size={size} wdth={wdth} />
      </div>
      <div style={{ position: 'absolute', left: 24, right: 24, top: 426, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Cap text="KG" size={44} wdth={150} fill={color.signal} />
        <Label size={17}>PRZYSIAD · SERIA 3/5</Label>
      </div>
    </AppRoot>
  );
};
