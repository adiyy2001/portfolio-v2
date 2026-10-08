import { color, num, semi } from '../tokens';
import { pl, tomorrow } from '../data';
import { tips } from '../content';
import { Card, Dot, Header, Txt, Washer } from '../components/ui';
import { Plot, area, line, makeScale, series } from '../components/charts';
import { countAt, drawAt, focusAt, riseIn } from '../components/motion';
import { T } from '../timeline';

export const TipsBody = ({ f, still = false, id = 'tip' }: { f: number; still?: boolean; id?: string }) => {
  const s = makeScale(343, 150, 7);
  const prod = series(tomorrow, row => row.prod, 0, 24);
  const use = series(tomorrow, row => row.use, 0, 24);
  const drawT = still ? 1 : drawAt(f, T.fcDraw);
  const band = still ? 1 : focusAt(f, T.band);
  const m = tips.main;
  const inBand = series(tomorrow, row => row.prod, m.fromH, m.toH);
  const surplus = still ? m.surplus : countAt(f, T.surplusCount, 0, m.surplus);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={riseIn(f, T.tipHead, still)}>
        <Header title={tips.title} sub={tips.sub} />
      </div>
      <Card x={16} y={142} w={411} h={246} style={riseIn(f, T.tipCard, still)}>
        <Txt x={18} y={16} size={15} weight={600} stretch="87.5%">
          {tips.forecast}
        </Txt>
        <Plot id={id} left={50} top={62} width={343} height={150} scale={s} yTicks={[0, 2, 4, 6]} yUnit="kW" reveal={drawT}>
          {clip => (
            <>
              <g opacity={band}>
                <rect x={s.x(m.fromH)} y={-26} width={s.x(m.toH) - s.x(m.fromH)} height={s.h + 26} fill={color.sunTint} />
                <path d={area(inBand, s, () => 0)} fill={color.sun} opacity={0.28} />
                <text x={(s.x(m.fromH) + s.x(m.toH)) / 2} y={-11} textAnchor="middle" fontSize={12} fontWeight={700} fill={color.ink}>
                  {m.name}
                </text>
              </g>
              <path d={line(use, s)} fill="none" stroke={color.home} strokeWidth={2} strokeLinejoin="round" clipPath={clip} />
              <path d={line(prod, s)} fill="none" stroke={color.sun} strokeWidth={3} strokeLinejoin="round" clipPath={clip} />
            </>
          )}
        </Plot>
      </Card>
      <Card x={16} y={408} w={411} h={176} style={riseIn(f, T.mainCard, still)}>
        <div style={{ position: 'absolute', left: 12, top: 16 }}>
          <Washer size={64} />
        </div>
        <Txt x={84} y={20} size={17} weight={600} stretch="87.5%">
          {m.name}
        </Txt>
        <Txt x={84} y={44} size={40} numeric line={1}>
          {`${m.from} do ${m.to}`}
        </Txt>
        <div style={{ position: 'absolute', left: 84, top: 96, display: 'flex', alignItems: 'baseline', gap: 6, color: color.sunText }}>
          <span style={{ fontSize: 15, ...semi }}>nadwyżka z dachu</span>
          <span style={{ ...num, fontSize: 26 }}>{pl(surplus)} kW</span>
        </div>
        <Txt x={84} y={134} size={14} tone={color.secondary}>
          {`${pl(m.kwh)} kWh ze słońca, około ${m.savedZl.toFixed(2).replace('.', ',')} zł taniej`}
        </Txt>
      </Card>
      <Card x={16} y={604} w={411} h={132}>
        {tips.more.map((item, i) => (
          <div key={item.name} style={{ position: 'absolute', left: 0, right: 0, top: 6 + i * 60, height: 60, display: 'flex', alignItems: 'center', padding: '0 18px', boxShadow: i ? `inset 0 1px 0 ${color.left}` : undefined, ...riseIn(f, T.more[i], still) }}>
            <Dot hueId="home" size={10} />
            <div style={{ marginLeft: 12, flex: 1 }}>
              <div style={{ fontSize: 16, ...semi }}>{item.name}</div>
              <div style={{ fontSize: 13, color: color.secondary }}>{`nadwyżka ${pl(item.surplus)} kW`}</div>
            </div>
            <span style={{ ...num, fontSize: 22 }}>{`${item.from} do ${item.to}`}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
