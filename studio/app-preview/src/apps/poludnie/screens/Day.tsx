import { color, hue, num, semi } from '../tokens';
import { facts, pl, today } from '../data';
import { day } from '../content';
import { Big, Card, Dot, Header } from '../components/ui';
import { Plot, area, line, makeScale, series } from '../components/charts';
import { countAt, drawAt, focusAt, riseIn } from '../components/motion';
import { T } from '../timeline';

const until = 21 + 40 / 60;

const Split = ({ title, total, parts, f, at, still }: { title: string; total: number; parts: readonly { hue: 'sun' | 'battery' | 'home' | 'grid'; name: string; value: number }[]; f: number; at: number; still: boolean }) => {
  const width = 375;
  let x = 0;
  return (
    <div style={{ position: 'relative', height: 82, ...riseIn(f, at, still) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, ...semi }}>
        <span>{title}</span>
        <span style={{ ...num, fontSize: 18 }}>{pl(total)} kWh</span>
      </div>
      <div style={{ position: 'relative', marginTop: 6, height: 12 }}>
        {parts.map(part => {
          const w = (part.value / total) * width;
          const left = x;
          x += w;
          return <div key={part.name} style={{ position: 'absolute', left: left + 1, top: 0, width: Math.max(2, w - 2), height: 12, borderRadius: 3, background: hue[part.hue].line }} />;
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 9, fontSize: 13, color: color.secondary, whiteSpace: 'nowrap' }}>
        {parts.map(part => (
          <span key={part.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Dot hueId={part.hue} size={8} />
            <span style={{ ...num, fontSize: 15, color: color.ink }}>{pl(part.value)}</span> {part.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export const DayBody = ({ f, still = false, id = 'day' }: { f: number; still?: boolean; id?: string }) => {
  const s = makeScale(343, 214, 7);
  const prod = series(today, row => row.prod, 0, 24);
  const use = series(today, row => row.use, 0, until);
  const prodT = still ? 1 : drawAt(f, T.prodDraw);
  const useT = still ? 1 : drawAt(f, T.useDraw);
  const fill = still ? 1 : focusAt(f, T.surplus);
  const peakIn = still ? 1 : Math.min(1, Math.max(0, (f - T.peak) / 8));
  const useAt = (hh: number) => today[Math.min(287, Math.max(0, Math.round(hh * 12)))].use;
  const surplus = series(today, row => Math.max(row.prod, row.use), 0, 24);
  const value = still ? facts.day.prod : countAt(f, T.prodDraw, 0, facts.day.prod, 40);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={riseIn(f, T.dayHead, still)}>
        <Header title={day.title} sub={day.sub} />
      </div>
      <div style={riseIn(f, T.dayNumber, still)}>
        <Big x={22} y={132} value={pl(value)} unit="kWh" />
        <div style={{ position: 'absolute', left: 24, top: 218, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, ...semi, color: color.sunText }}>
          <Dot hueId="sun" size={10} />
          {day.label}
        </div>
      </div>
      <Card x={16} y={254} w={411} h={300} style={riseIn(f, T.dayCard, still)}>
        <div style={{ position: 'absolute', left: 18, top: 16, display: 'flex', gap: 16, fontSize: 13, color: color.secondary }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: color.sun }} /> produkcja
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: still ? 1 : Math.min(1, Math.max(0, (f - T.useDraw) / 6)) }}>
            <span style={{ width: 16, height: 3, borderRadius: 2, background: color.home }} /> zużycie
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: fill }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: color.sunTint }} /> nadwyżka
          </span>
        </div>
        <Plot id={id} left={50} top={52} width={343} height={214} scale={s} yTicks={[0, 2, 4, 6]} yUnit="kW">
          {() => (
            <>
              <defs>
                <clipPath id={`${id}-p`}>
                  <rect x={-4} y={-40} width={s.w * prodT + 4} height={s.h + 44} />
                </clipPath>
                <clipPath id={`${id}-u`}>
                  <rect x={-4} y={-40} width={s.w * useT + 4} height={s.h + 44} />
                </clipPath>
              </defs>
              <path d={area(surplus, s, hh => useAt(hh))} fill={color.sunTint} opacity={fill} />
              <path d={line(prod, s)} fill="none" stroke={color.sun} strokeWidth={3} strokeLinejoin="round" clipPath={`url(#${id}-p)`} />
              <path d={line(use, s)} fill="none" stroke={color.home} strokeWidth={2.4} strokeLinejoin="round" clipPath={`url(#${id}-u)`} />
              {useT > 0.98 && <circle cx={s.x(until)} cy={s.y(use.at(-1)?.[1] ?? 0)} r={4} fill={color.home} />}
              <g opacity={peakIn} transform={`translate(${s.x(13 + 10 / 60)} ${s.y(6.4)})`}>
                <circle r={5.5} fill={color.card} stroke={color.sun} strokeWidth={3} />
                <rect x={-176} y={-14} width={160} height={28} rx={6} fill={color.ink} />
                <text x={-164} y={5} fontSize={13} fontWeight={700} fill={color.card} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {`szczyt ${day.peak}`}
                </text>
              </g>
            </>
          )}
        </Plot>
      </Card>
      <Card x={16} y={574} w={411} h={204} style={riseIn(f, T.split, still)}>
        <div style={{ position: 'absolute', left: 18, top: 16, right: 18, display: 'grid', gap: 12 }}>
          <Split title="Produkcja: dokąd poszła" total={facts.day.prod} parts={day.prodSplit} f={f} at={T.split + 4} still={still} />
          <Split title="Zużycie domu: skąd przyszło" total={facts.day.use} parts={day.useSplit} f={f} at={T.split + 10} still={still} />
        </div>
      </Card>
    </div>
  );
};
