import { history } from '../content';
import { color } from '../tokens';
import { Abs, Cap, Label, Screen, fitWdth } from '../components/type';
import { Chrome, Meta, W, side } from '../components/chrome';

const base = 700;
const maxH = 400;
const lo = 160;
const hi = 197;

export const HistoryScreen = ({ bars = 8 }: { bars?: number }) => {
  const gap = 7;
  const w = (W - gap * 7) / 8;
  return (
    <Screen>
      <Meta left={history.lift} right="8 TYGODNI" />
      <Abs style={{ left: side, top: 98 }}>
        <Cap text={history.title} size={60} wdth={fitWdth(history.title, 60, W)} />
      </Abs>
      <Abs style={{ left: side, top: 154 }}>
        <Label>{history.subtitle}</Label>
      </Abs>
      {history.weeks.map((week, i) => {
        if (i >= bars) return null;
        const h = (maxH * (week.value - lo)) / (hi - lo);
        const last = i === history.weeks.length - 1;
        const left = side + i * (w + gap);
        return (
          <div key={week.date}>
            <Abs style={{ left, top: base - h, width: w, height: h, background: last ? color.signal : color.ink }} />
            <Abs style={{ left, width: w, top: base - h - 30, display: 'flex', justifyContent: 'center' }}>
              <Cap text={String(week.value)} size={last ? 30 : 24} wdth={50} fill={last ? color.signal : color.ink} />
            </Abs>
            <Abs style={{ left, width: w, top: base + 12, display: 'flex', justifyContent: 'center' }}>
              <Label size={12} wdth={75}>
                {week.date}
              </Label>
            </Abs>
          </div>
        );
      })}
      <Abs style={{ left: side, right: side, top: base, height: 2, background: color.divider }} />
      {bars >= 8 && (
        <>
          <Abs style={{ left: side, top: 784 }}>
            <Cap text="+21 KG" size={64} wdth={75} />
          </Abs>
          <Abs style={{ left: side, top: 838 }}>
            <Label size={15}>OD SIERPNIA, TEN SAM BÓJ</Label>
          </Abs>
        </>
      )}
      <Chrome />
    </Screen>
  );
};
