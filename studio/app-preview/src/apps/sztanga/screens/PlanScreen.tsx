import { lifts, plan, session } from '../content';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, fitSize, fitWdth } from '../components/type';
import { Button, Chrome, Meta, W, side } from '../components/chrome';

const rowTop = 214;
const rowHeight = 156;
const nameSize = 50;
const statSize = 40;

export const PlanScreen = ({ rows = [1, 1, 1] }: { rows?: number[] }) => {
  const titleSize = fitSize(session.day, 150, W, 64);
  return (
    <Screen>
      <Meta left={session.week} right="PLAN DNIA" />
      <Abs style={{ left: side, top: 100 }}>
        <Cap text={session.day} size={titleSize} wdth={150} />
      </Abs>
      {plan.map((id, i) => {
        const lift = lifts[id];
        const scale = rows[i] ?? 0;
        const top = rowTop + i * rowHeight;
        return (
          <div key={id}>
            <Abs style={{ left: side, right: side, top: top - 22, height: 2, background: color.divider }} />
            {scale > 0 && (
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: `${side}px ${top + 30}px` }}>
                <Abs style={{ left: side, top }}>
                  <Cap text={lift.name} size={nameSize} wdth={fitWdth(lift.name, nameSize, W)} />
                </Abs>
                <Abs style={{ left: side, top: top + 62, display: 'flex', alignItems: 'flex-end', gap: 22 }}>
                  <Cap text={`${lift.sets} × ${lift.reps}`} size={statSize} wdth={75} />
                  <Cap text={`${lift.load} KG`} size={statSize} wdth={75} fill={i === 0 ? color.signal : color.ink} />
                </Abs>
                <Abs style={{ right: side, top: top + 72 }}>
                  <Label size={16}>{lift.percent} 1RM</Label>
                </Abs>
              </div>
            )}
          </div>
        );
      })}
      <Abs style={{ left: side, right: side, top: rowTop + 3 * rowHeight - 22, height: 2, background: color.divider }} />
      <Abs style={{ left: side, top: rowTop + 3 * rowHeight + 2 }}>
        <Label size={16}>11 SERII · OK. 70 MIN · PRZERWY 3:00</Label>
      </Abs>
      <Button label="ZACZNIJ" tone="raised" />
      <Chrome />
    </Screen>
  );
};
