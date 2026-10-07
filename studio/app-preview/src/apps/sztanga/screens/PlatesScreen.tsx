import { lifts, plates, session } from '../content';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, fitSize } from '../components/type';
import { Button, Chrome, Meta, W, side } from '../components/chrome';

const barY = 420;
const plateSpec: Record<number, { w: number; h: number; fill: string; text: string }> = {
  25: { w: 66, h: 340, fill: color.signal, text: color.ground },
  10: { w: 44, h: 232, fill: color.ink, text: color.ground },
};

export const PlatesScreen = ({ steps = [1, 1, 1], sum = 1 }: { steps?: number[]; sum?: number }) => {
  const squat = lifts.squat;
  const titleSize = fitSize(plates.title, 100, W, 66);
  let x = 104;
  const placed = squat.plates.map((kg, i) => {
    const spec = plateSpec[kg];
    const left = x;
    x += spec.w + 6;
    return { kg, spec, left, scale: steps[i] ?? 0 };
  });
  return (
    <Screen>
      <Meta left={`${squat.name} · ${squat.load} KG`} right={`SZTANGA ${session.bar} KG`} />
      <Abs style={{ left: side, top: 100 }}>
        <Cap text={plates.title} size={titleSize} wdth={100} />
      </Abs>
      <Abs style={{ left: side, top: 100 + titleSize * 0.675 + 14 }}>
        <Label size={17} fill={color.ink}>
          {plates.subtitle}, OD ŚRODKA SZTANGI
        </Label>
      </Abs>
      <Abs style={{ left: 0, width: 92, top: barY - 9, height: 18, background: color.secondary }} />
      <Abs style={{ left: 84, width: 16, top: barY - 34, height: 68, background: color.secondary }} />
      <Abs style={{ left: 100, width: 330, top: barY - 13, height: 26, background: color.divider }} />
      {placed.map(({ kg, spec, left, scale }) =>
        scale > 0 ? (
          <Abs
            key={left}
            style={{
              left,
              top: barY - spec.h / 2,
              width: spec.w,
              height: spec.h,
              background: spec.fill,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}>
            <Cap text={String(kg)} size={kg === 25 ? 40 : 30} wdth={50} fill={spec.text} />
          </Abs>
        ) : null,
      )}
      {sum > 0 && (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${sum})`, transformOrigin: `${side}px 680px` }}>
          <Abs style={{ left: side, top: 622, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <Cap text={plates.perSide} size={120} wdth={75} />
            <Cap text="KG" size={52} wdth={150} />
          </Abs>
          <Abs style={{ left: side, top: 728 }}>
            <Label size={16}>{plates.formula}</Label>
          </Abs>
        </div>
      )}
      <Button label="ZAŁOŻONE" tone="raised" />
      <Chrome />
    </Screen>
  );
};
