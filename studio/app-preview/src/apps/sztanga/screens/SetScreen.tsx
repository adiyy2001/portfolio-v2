import { lifts, session, setScreen, plan, type LiftId } from '../content';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, capRatio, fitSize } from '../components/type';
import { Button, Chrome, Markers, Meta, Row, W, side } from '../components/chrome';

export const numberTop = 162;

export interface SetState {
  lift: LiftId;
  set: number;
  done: number;
  wdth: number;
  number?: number;
  kg?: number;
  setRow?: number;
  pressed?: boolean;
  inverted?: boolean;
  signalSet?: boolean;
}

export const SetScreen = ({ lift, set, done, wdth, number = 1, kg = 1, setRow = 1, pressed = false, inverted = false, signalSet = false }: SetState) => {
  const data = lifts[lift];
  const ink = inverted ? color.ground : color.ink;
  const dim = inverted ? color.ground : color.secondary;
  const size = fitSize(data.load, wdth, W, 250);
  const setText = `${set}/${data.sets}`;
  const setFill = signalSet && !inverted ? color.signal : ink;
  return (
    <Screen background={inverted ? color.signal : color.ground}>
      <Meta left={`${session.week} · ${session.day}`} right={`BÓJ ${plan.indexOf(lift) + 1}/${plan.length}`} fill={dim} />
      <Abs style={{ left: side, top: 98 }}>
        <Cap text={data.name} size={44} wdth={100} fill={ink} />
      </Abs>
      {number > 0 && (
        <Abs style={{ left: side, top: numberTop }}>
          <Cap text={data.load} size={size} wdth={wdth} fill={ink} scale={number} origin="left top" />
        </Abs>
      )}
      {kg > 0 && (
        <>
          <Abs style={{ left: side, top: 342 }}>
            <Cap text="KG" size={52} wdth={150} fill={ink} scale={kg} origin="left center" />
          </Abs>
          <Abs style={{ right: side, top: 354 }}>
            <Label fill={dim} size={17}>
              {data.percent} 1RM
            </Label>
          </Abs>
        </>
      )}
      <Abs style={{ left: side, right: side, top: 404, height: 2, background: inverted ? color.ground : color.divider }} />
      {setRow > 0 && (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${setRow})`, transformOrigin: '68px 490px' }}>
          <Abs style={{ left: side, top: 424 }}>
            <Label fill={dim}>{setScreen.set}</Label>
          </Abs>
          <Abs style={{ left: side, top: 452 }}>
            <Cap text={setText} size={112} wdth={75} fill={setFill} />
          </Abs>
          <Abs style={{ left: 268, top: 424 }}>
            <Label fill={dim}>{setScreen.reps}</Label>
          </Abs>
          <Abs style={{ left: 268, top: 452 }}>
            <Cap text={String(data.reps)} size={112} wdth={75} fill={ink} />
          </Abs>
        </div>
      )}
      <Markers total={data.sets} done={done} current={set} top={452 + 112 * capRatio + 28} fill={ink} empty={inverted ? color.ground : color.divider} />
      <Row term={setScreen.lastWeek} value={data.last} top={620} fill={ink} dim={dim} />
      <Abs style={{ left: side, right: side, top: 660, height: 2, background: inverted ? color.ground : color.divider }} />
      <Button label={setScreen.done} tone={inverted ? 'black' : pressed ? 'pressed' : 'signal'} check={pressed} />
      <Chrome dark={!inverted} />
    </Screen>
  );
};
