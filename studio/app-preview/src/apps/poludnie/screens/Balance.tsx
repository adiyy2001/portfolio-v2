import { color, hue, num, semi } from '../tokens';
import { facts, pl } from '../data';
import { balance, month, zl } from '../content';
import { Card, Dot, Header, Txt } from '../components/ui';
import { countAt, drawAt, riseIn } from '../components/motion';
import { T } from '../timeline';

const Segmented = ({ active }: { active: 0 | 1 }) => (
  <div style={{ position: 'absolute', left: 22, top: 112, width: 200, height: 34, borderRadius: 10, background: color.left, padding: 3, boxSizing: 'border-box', display: 'flex' }}>
    {balance.segments.map((label, i) => (
      <div key={label} style={{ flex: 1, display: 'grid', placeItems: 'center', borderRadius: 8, background: i === active ? color.card : 'transparent', fontSize: 14, ...semi, color: i === active ? color.ink : color.secondary, boxShadow: i === active ? `0 1px 0 ${color.right}` : undefined }}>
        {label}
      </div>
    ))}
  </div>
);

const Ring = ({ t, cx, cy, r, stroke }: { t: number; cx: number; cy: number; r: number; stroke: number }) => {
  const use = facts.day.use;
  const parts = [
    { hue: 'sun' as const, share: facts.day.fromRoof / use },
    { hue: 'battery' as const, share: facts.day.fromBattery / use },
  ];
  const own = facts.day.selfSufficiency / 100;
  const shown = own * t;
  const c = 2 * Math.PI * r;
  let start = 0;
  return (
    <svg width={2 * (r + stroke)} height={2 * (r + stroke)} style={{ position: 'absolute', left: cx - r - stroke, top: cy - r - stroke }}>
      <g transform={`translate(${r + stroke} ${r + stroke}) rotate(-90)`}>
        <circle r={r} fill="none" stroke={color.left} strokeWidth={stroke} />
        {parts.map(part => {
          const scaled = (part.share / (parts[0].share + parts[1].share)) * own;
          const from = start;
          start += scaled;
          const visible = Math.max(0, Math.min(scaled, shown - from));
          if (visible <= 0) return null;
          return <circle key={part.hue} r={r} fill="none" stroke={hue[part.hue].line} strokeWidth={stroke} strokeDasharray={`${visible * c} ${c}`} strokeDashoffset={-from * c} />;
        })}
      </g>
    </svg>
  );
};

export const BalanceBody = ({ f, still = false }: { f: number; still?: boolean }) => {
  const t = still ? 1 : drawAt(f, T.ring, 30);
  const pct = still ? facts.day.selfSufficiency : Math.round(countAt(f, T.ring, 0, facts.day.selfSufficiency));
  const value = still ? facts.day.valueZl : countAt(f, T.valueCount, 0, facts.day.valueZl);
  const legend = [
    { hue: 'sun' as const, label: 'z dachu', value: facts.day.fromRoof },
    { hue: 'battery' as const, label: 'z magazynu', value: facts.day.fromBattery },
    { hue: 'grid' as const, label: 'z sieci', value: facts.day.fromGrid },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={riseIn(f, T.balHead, still)}>
        <Header title={balance.title} />
        <Segmented active={0} />
      </div>
      <Ring t={t} cx={221} cy={296} r={104} stroke={24} />
      <div style={{ position: 'absolute', left: 0, width: 443, top: 238, textAlign: 'center' }}>
        <div style={{ ...num, fontSize: 76, lineHeight: 1, color: color.ink }}>{pct}%</div>
        <div style={{ fontSize: 15, ...semi, marginTop: 4 }}>{balance.ringLabel}</div>
        <div style={{ fontSize: 13, color: color.secondary, marginTop: 2 }}>{balance.ringSub}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 443, top: 434, display: 'flex', justifyContent: 'center', gap: 18, fontSize: 13, color: color.secondary, ...riseIn(f, T.legend, still) }}>
        {legend.map(item => (
          <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Dot hueId={item.hue} size={9} />
            <span style={{ ...num, fontSize: 17, color: color.ink }}>{pl(item.value)} kWh</span>
            {item.label}
          </span>
        ))}
      </div>
      <Card x={16} y={484} w={411} h={262} style={riseIn(f, T.valueCard, still)}>
        <Txt x={18} y={18} size={15} weight={600} stretch="87.5%">
          {balance.value}
        </Txt>
        <Txt x={18} y={44} size={56} numeric line={1}>
          {zl(value)}
        </Txt>
        <Txt x={18} y={108} size={13} tone={color.secondary}>
          {`${balance.prices}: zakup 1,08 zł, sprzedaż 0,24 zł za kWh`}
        </Txt>
        {balance.rows.map((row, i) => (
          <div key={row.label} style={{ position: 'absolute', left: 18, right: 18, top: 146 + i * 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: `inset 0 1px 0 ${color.left}`, ...riseIn(f, T.rows[i], still) }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <Dot hueId={i ? 'grid' : 'sun'} size={8} />
              {row.label}
            </span>
            <span style={{ ...num, fontSize: 22 }}>{row.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

export const MonthBody = () => {
  const days = facts.month.days;
  const max = 50;
  const barW = 18;
  const gap = (343 - days.length * barW) / (days.length - 1);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Header title={month.title} />
      <Segmented active={1} />
      <div style={{ position: 'absolute', left: 22, top: 164, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ ...num, fontSize: 72, lineHeight: 1 }}>{pl(facts.month.prod)}</span>
        <span style={{ ...num, fontSize: 28 }}>kWh</span>
      </div>
      <div style={{ position: 'absolute', left: 24, top: 240, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, ...semi, color: color.sunText }}>
        <Dot hueId="sun" size={10} />z dachu, {month.label.toLowerCase()}
      </div>
      <Card x={16} y={284} w={411} h={262}>
        <Txt x={18} y={16} size={15} weight={600} stretch="87.5%">
          Produkcja dzień po dniu
        </Txt>
        <svg width={343} height={170} style={{ position: 'absolute', left: 50, top: 56, overflow: 'visible' }}>
          {[0, 25, 50].map(v => (
            <g key={v}>
              <line x1={0} x2={343} y1={150 - (v / max) * 150} y2={150 - (v / max) * 150} stroke={color.left} />
              <text x={-8} y={154 - (v / max) * 150} textAnchor="end" fontSize={11} fill={color.secondary}>
                {v}
              </text>
            </g>
          ))}
          <text x={-8} y={-12} textAnchor="end" fontSize={11} fill={color.secondary}>
            kWh
          </text>
          {days.map((v, i) => {
            const h = (v / max) * 150;
            const x = i * (barW + gap);
            const last = i === days.length - 1;
            const d = 6;
            const top = last ? color.sunTint : color.card;
            const left = last ? color.sun : color.left;
            const right = last ? color.sunText : color.right;
            return (
              <g key={i}>
                <polygon points={`${x},${150 - h} ${x + barW - d},${150 - h} ${x + barW - d},150 ${x},150`} fill={left} />
                <polygon points={`${x + barW - d},${150 - h} ${x + barW},${150 - h - d / 2} ${x + barW},${150 - d / 2} ${x + barW - d},150`} fill={right} />
                <polygon points={`${x},${150 - h} ${x + d},${150 - h - d / 2} ${x + barW},${150 - h - d / 2} ${x + barW - d},${150 - h}`} fill={top} />
                {(i === 0 || last || i === 6) && (
                  <text x={x + barW / 2} y={168} textAnchor="middle" fontSize={11} fill={color.secondary}>
                    {`${i + 1}.05`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </Card>
      <Card x={16} y={566} w={411} h={194}>
        {month.stats.map((stat, i) => (
          <div key={stat.label} style={{ position: 'absolute', left: 18, right: 18, top: 8 + i * 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: i ? `inset 0 1px 0 ${color.left}` : undefined }}>
            <span style={{ fontSize: 15, color: color.secondary }}>{stat.label}</span>
            <span style={{ ...num, fontSize: 28 }}>{stat.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
