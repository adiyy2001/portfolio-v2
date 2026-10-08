import { health } from '../content';
import { color, glow } from '../tokens';
import { T } from '../timeline';
import { Abs, Check, Label, NavBar, Scramble, Screen, drawAt, inOut, inner, progress, side, toneColor } from '../components/ui';

const ring = { cx: 221.5, cy: 214, r: 88, w: 10 } as const;
const listTop = 476;
const rowH = 46;

export const scoreAt = (f: number) => Math.round(health.from + (health.to - health.from) * progress(f, T.scoreFrom, T.scoreTo - T.scoreFrom, inOut));

export const HealthScreen = ({ f, still = false }: { f: number; still?: boolean }) => {
  const g = still ? 9999 : f;
  const score = still ? health.to : scoreAt(f);
  const fixed = T.strikes.filter(at => g >= at + 6).length;
  const healthy = g >= T.healthy;
  const arcColor = score >= 90 ? color.cyan : color.warn;
  const circumference = 2 * Math.PI * ring.r;
  const countAt = (i: number) => {
    const item = health.counts[i];
    if (fixed >= 5) return item.to;
    if (i === 2) return Math.max(item.to, item.from - fixed);
    if (i === 1) return fixed >= 4 ? item.from - 1 : item.from;
    return fixed >= 3 ? item.from - 1 : item.from;
  };
  return (
    <Screen time={health.time}>
      <Abs style={{ left: side, right: side, top: 62, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 24 }}>{health.title}</span>
        <Label>214 wpisów</Label>
      </Abs>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width="443" height="340" viewBox="0 0 443 340">
        <circle cx={ring.cx} cy={ring.cy} r={ring.r + 16} fill="none" stroke={color.dim} strokeWidth="1" strokeDasharray="2 6" />
        <circle cx={ring.cx} cy={ring.cy} r={ring.r} fill={color.panel} stroke={color.grid} strokeWidth={ring.w} />
        <circle
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          fill="none"
          stroke={arcColor}
          strokeWidth={ring.w}
          strokeDasharray={`${(circumference * score) / 100} ${circumference}`}
          transform={`rotate(-90 ${ring.cx} ${ring.cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${arcColor})` }}
        />
      </svg>
      <Abs style={{ left: 0, right: 0, top: ring.cy - 44, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 800, fontSize: 64, lineHeight: '64px', color: color.text }}>{score}</div>
        <div style={{ fontSize: 13, lineHeight: '18px', color: color.muted, marginTop: 4 }}>{health.label}</div>
      </Abs>
      <Abs style={{ left: side, right: side, top: 324, textAlign: 'center', fontWeight: 700, fontSize: 17, lineHeight: '24px' }}>
        {healthy ? (
          <Scramble text={health.healthy} f={g} start={still ? -999 : T.healthy} fill={color.cyan} opts={{ step: 1, min: 4, max: 7 }} />
        ) : (
          <span style={{ color: color.warn }}>Wymaga uwagi</span>
        )}
      </Abs>
      {health.counts.map((item, i) => {
        const w = (inner - 16) / 3;
        const value = countAt(i);
        const c = value === 0 ? color.cyan : toneColor(item.tone);
        return (
          <div key={item.label} style={{ position: 'absolute', left: side + i * (w + 8), top: 368, width: w, height: 70, borderRadius: 4, background: color.panel, boxShadow: `inset 0 0 0 1px ${value === 0 ? color.dim : c}`, padding: '10px 12px', boxSizing: 'border-box' }}>
            <div style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 600, fontSize: 28, lineHeight: '30px', color: c }}>{value}</div>
            <div style={{ fontSize: 11, lineHeight: '16px', marginTop: 4, color: color.muted }}>{item.label.toLowerCase()}</div>
          </div>
        );
      })}
      <Abs style={{ left: side, top: 452 }}>
        <Label>{health.listTitle}</Label>
      </Abs>
      {health.issues.map((item, i) => {
        const at = T.strikes[i];
        const strike = still ? 1 : drawAt(g, at, 10);
        const done = g >= at + 6;
        const c = toneColor(item.tone);
        return (
          <div key={item.name} style={{ position: 'absolute', left: side, top: listTop + i * rowH, width: inner, height: rowH, borderBottom: `1px solid ${color.grid}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ position: 'relative', fontSize: 14, fontWeight: 700, color: done ? color.muted : color.text, whiteSpace: 'nowrap' }}>
              {item.name}
              <span style={{ position: 'absolute', left: -2, right: -2, top: '50%', height: 1.5, background: color.muted, transform: `scaleX(${strike})`, transformOrigin: '0 50%' }} />
            </span>
            {done ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: color.cyan }}>
                <Check size={16} t={still ? 1 : drawAt(g, at + 4, 10)} />
                naprawione
              </span>
            ) : (
              <span style={{ fontSize: 12, color: c, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 1, background: c, boxShadow: glow(c, 0.5, 6) }} />
                {item.issue}
              </span>
            )}
          </div>
        );
      })}
      <Abs style={{ left: side, right: side, top: 796, fontSize: 13, lineHeight: '19px', color: color.muted, opacity: healthy ? 1 : 0 }}>{health.left}</Abs>
      <NavBar active="Zdrowie" />
    </Screen>
  );
};
