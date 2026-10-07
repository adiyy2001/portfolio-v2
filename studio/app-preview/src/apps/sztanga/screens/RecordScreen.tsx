import { record } from '../content';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, emWidth, fitSize, fitWdth, slamScale } from '../components/type';
import { Chrome, Meta, W, side } from '../components/chrome';

export interface RecordState {
  frame: number;
  start: number;
  letterStep: number;
  lift: number;
  result: number;
  rm: number;
  previous: boolean;
}

export const recordWdth = 50;

export const RecordScreen = ({ frame, start, letterStep, lift, result, rm, previous }: RecordState) => {
  const ink = color.ground;
  const size = fitSize(record.title, recordWdth, W, 130);
  const letters = [...record.title];
  let x = 0;
  const liftSize = 52;
  const rmSize = 54;
  return (
    <Screen background={color.signal}>
      <Meta left="MARTWY CIĄG · SERIA 1/1" right="6.10" fill={ink} />
      <Abs style={{ left: side, top: 98, width: W, height: size * 0.675 }}>
        {letters.map((ch, i) => {
          const left = x;
          x += emWidth(ch, recordWdth) * size;
          const scale = slamScale(frame, start + i * letterStep);
          return scale > 0 ? (
            <Abs key={i} style={{ left, top: 0 }}>
              <Cap text={ch} size={size} wdth={recordWdth} fill={ink} scale={scale} origin="center bottom" />
            </Abs>
          ) : null;
        })}
      </Abs>
      {lift > 0 && (
        <Abs style={{ left: side, top: 256 }}>
          <Cap text={record.lift} size={liftSize} wdth={fitWdth(record.lift, liftSize, W)} fill={ink} scale={lift} origin="left center" />
        </Abs>
      )}
      {result > 0 && (
        <Abs style={{ left: side, top: 322 }}>
          <Cap text={record.result} size={fitSize(record.result, 75, W, 120)} wdth={75} fill={ink} scale={result} origin="left center" />
        </Abs>
      )}
      {rm > 0 && (
        <Abs style={{ left: side, top: 470 }}>
          <Cap text={record.oneRm} size={rmSize} wdth={fitWdth(record.oneRm, rmSize, W)} fill={ink} scale={rm} origin="left center" />
        </Abs>
      )}
      {previous && (
        <>
          <Abs style={{ left: side, right: side, top: 538, height: 3, background: ink }} />
          <Abs style={{ left: side, top: 558 }}>
            <Label fill={ink} size={17} wght={800}>
              {record.previous}
            </Label>
          </Abs>
          <Abs style={{ left: side, top: 588 }}>
            <Label fill={ink} size={15} wght={600} wdth={100}>
              {record.formula}
            </Label>
          </Abs>
          <Abs style={{ left: side, top: 800 }}>
            <Cap text="+5 KG" size={64} wdth={75} fill={ink} />
          </Abs>
          <Abs style={{ left: side, top: 854 }}>
            <Label fill={ink} size={15} wght={800}>
              DO SZACOWANEGO 1RM
            </Label>
          </Abs>
        </>
      )}
      <Chrome dark={false} />
    </Screen>
  );
};
