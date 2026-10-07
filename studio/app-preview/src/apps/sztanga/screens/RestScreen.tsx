import { lifts, rest } from '../content';
import { clock } from '../timeline';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, fitSize } from '../components/type';
import { Button, Chrome, Meta, W, side } from '../components/chrome';

export const RestScreen = ({ seconds }: { seconds: number }) => {
  const size = fitSize('3:00', 50, W, 220);
  const elapsed = 1 - seconds / rest.seconds;
  return (
    <Screen>
      <Meta left={lifts.squat.name} right="SERIA 3/5 ZALICZONA" />
      <Abs style={{ left: side, top: 98 }}>
        <Cap text={rest.title} size={44} wdth={100} />
      </Abs>
      <Abs style={{ left: side, top: 168 }}>
        <Cap text={clock(seconds)} size={size} wdth={50} />
      </Abs>
      <Abs style={{ left: side, top: 400, width: W, height: 14, background: color.divider }}>
        <div style={{ width: `${elapsed * 100}%`, height: '100%', background: color.signal }} />
      </Abs>
      <Abs style={{ left: side, right: side, top: 426, display: 'flex', justifyContent: 'space-between' }}>
        <Label>0:00</Label>
        <Label>3:00</Label>
      </Abs>
      <Abs style={{ left: side, top: 486 }}>
        <Label>{rest.next}</Label>
      </Abs>
      <Abs style={{ left: side, top: 516 }}>
        <Cap text={rest.nextSet} size={76} wdth={75} />
      </Abs>
      <Abs style={{ left: side, top: 588 }}>
        <Label size={18} fill={color.ink} wght={700} wdth={100}>
          {rest.nextLoad}
        </Label>
      </Abs>
      <Abs style={{ left: side, right: side, top: 636, height: 2, background: color.divider }} />
      <Button label={rest.add} tone="raised" width={(W - 12) / 2} />
      <Button label={rest.skip} tone="raised" left={side + (W - 12) / 2 + 12} width={(W - 12) / 2} />
      <Chrome />
    </Screen>
  );
};
