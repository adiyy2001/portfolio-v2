import { color, num, semi } from '../tokens';
import { socAt, today } from '../data';
import { battery } from '../content';
import { Card, Chip, Header, Txt } from '../components/ui';
import { Plot, area, line, makeScale, series } from '../components/charts';
import { drawAt, riseIn } from '../components/motion';
import { T } from '../timeline';

export const batteryLayout = { sceneTop: 126, sceneHeight: 290 } as const;

const minH = 6.25;
const nowH = 13 + 10 / 60;
const fullH = 13 + 40 / 60;

export const headHour = (f: number, still = false) => (still ? nowH : minH + (nowH - minH) * drawAt(f, T.socDraw));

export const batteryLevel = (f: number, still = false) => {
  if (still || f < T.rewind) return socAt(nowH);
  if (f < T.socDraw) {
    const t = drawAt(f, T.rewind, T.socDraw - T.rewind - 2);
    return socAt(nowH) + (socAt(minH) - socAt(nowH)) * t;
  }
  return socAt(headHour(f));
};

export const BatteryBody = ({ f, still = false, id = 'bat' }: { f: number; still?: boolean; id?: string }) => {
  const head = headHour(f, still);
  const level = batteryLevel(f, still);
  const s = makeScale(347, 132, 100);
  const pts = series(today, row => row.soc * 100, 0, nowH);
  const reveal = (head - 0) / 24;
  const plan = `M${s.x(nowH)} ${s.y(socAt(nowH) * 100)} L${s.x(fullH)} ${s.y(100)} L${s.x(15)} ${s.y(100)}`;
  const showPlan = still || f >= T.fullChip;
  const planO = still ? 1 : Math.min(1, (f - T.fullChip) / 8);
  const shown = Math.round(level * 100);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={riseIn(f, T.batteryHead, still)}>
        <Header title={battery.title} back={battery.back} />
      </div>
      <div style={{ position: 'absolute', left: 22, top: 420, ...riseIn(f, T.batteryNumber, still) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ ...num, fontSize: 84, lineHeight: 0.95, color: color.ink }}>{shown}%</span>
          <span style={{ ...num, fontSize: 26, color: color.secondary }}>{still || f >= T.socDraw + 40 ? battery.stored : `${(level * 10.2).toFixed(1).replace('.', ',')} z 10,2 kWh`}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 17, ...semi, color: color.batteryText }}>{battery.rate}</div>
      </div>
      <Card x={16} y={556} w={411} h={236} style={riseIn(f, T.batteryCard, still)}>
        <Txt x={18} y={16} size={15} weight={600} stretch="87.5%">
          {battery.chart}
        </Txt>
        <div style={{ position: 'absolute', right: 14, top: 12, opacity: planO, transform: `translateY(${(1 - planO) * 6}px)` }}>
          {showPlan && <Chip hueId="battery">{battery.full}</Chip>}
        </div>
        <Plot id={id} left={46} top={60} width={347} height={132} scale={s} yTicks={[0, 50, 100]} yUnit="%" reveal={reveal}>
          {clip => (
            <>
              <line x1={0} x2={s.w} y1={s.y(30)} y2={s.y(30)} stroke={color.batteryText} strokeWidth={1.2} strokeDasharray="3 4" opacity={0.7} />
              <text x={s.w - 2} y={s.y(30) - 5} textAnchor="end" fontSize={11} fill={color.batteryText}>
                rezerwa 30%
              </text>
              <path d={area(pts, s)} fill={color.batteryTint} clipPath={clip} />
              <path d={line(pts, s)} fill="none" stroke={color.battery} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" clipPath={clip} />
              {showPlan && <path d={plan} fill="none" stroke={color.battery} strokeWidth={2} strokeDasharray="4 5" opacity={planO} />}
              <circle cx={s.x(head)} cy={s.y(socAt(head) * 100)} r={5.5} fill={color.card} stroke={color.battery} strokeWidth={3} />
              <text x={s.x(head)} y={s.y(socAt(head) * 100) - 12} textAnchor="middle" fontSize={12} fontWeight={600} fill={color.ink} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {still || f >= T.socDraw + 40 ? 'teraz' : clock(head)}
              </text>
            </>
          )}
        </Plot>
      </Card>
      <Txt x={22} y={800} size={13} tone={color.secondary} style={{ opacity: still ? 1 : Math.min(1, Math.max(0, (f - T.rate) / 8)) }}>
        {battery.reserve}
      </Txt>
    </div>
  );
};

export const clock = (h: number) => {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${hh}:${String(mm).padStart(2, '0')}`;
};

