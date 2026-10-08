import { alert, user } from '../content';
import { color, rgba } from '../tokens';
import { Abs, Button, Dot, Label, Panel, Screen, Wordmark, inner, pulseAt, side } from '../components/ui';

export const alertRing = { cx: 221.5, cy: 190, r: 62 } as const;

const rows: [string, string][] = [['Konto', user.email], ...alert.rows];

export const AlertScreen = ({ f, press = 0 }: { f: number; press?: number }) => {
  const p = pulseAt(f);
  const { cx, cy, r } = alertRing;
  return (
    <Screen time={alert.time}>
      <Abs style={{ left: side, right: side, top: 62, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Wordmark />
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dot fill={color.alert} glowAlpha={p} />
          <Label fill={color.alert}>{alert.label}</Label>
        </span>
      </Abs>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width="443" height="300" viewBox="0 0 443 300">
        <defs>
          <filter id="alert-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={r + 22} fill="none" stroke={color.dim} strokeWidth="1" strokeDasharray="2 6" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color.alert} strokeWidth="4" opacity={p} filter="url(#alert-glow)" />
        <circle cx={cx} cy={cy} r={r} fill={color.panel} stroke={color.alert} strokeWidth="2" />
        <g fill="none" stroke={color.alert} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <rect x={cx - 20} y={cy - 6} width="40" height="32" rx="4" />
          <path d={`M${cx - 12} ${cy - 6}v-10a12 12 0 0 1 21-8`} />
          <path d={`M${cx} ${cy + 4}v8`} />
        </g>
      </svg>
      <Abs style={{ left: side, right: side, top: 274, textAlign: 'center' }}>
        <Label fill={color.alert} size={12}>
          {alert.kicker}
        </Label>
      </Abs>
      <Abs style={{ left: side, right: side, top: 300, textAlign: 'center', fontWeight: 700, fontSize: 24, lineHeight: '31px', color: color.text }}>
        Twój adres e-mail
        <br />
        pojawił się w wycieku
      </Abs>
      <Panel style={{ left: side, top: 386, width: inner, height: 292 }} outline={color.alert} glowAlpha={p * 0.8}>
        {rows.map(([term, value], i) => (
          <div
            key={term}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              top: 8 + i * 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              borderTop: i ? `1px solid ${rgba(color.alert, 0.28)}` : undefined,
            }}>
            <Label>{term}</Label>
            <span style={{ fontSize: i === 1 ? 15 : 14, fontWeight: i === 1 ? 700 : 500, color: i === 4 ? color.alert : color.text, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </Panel>
      <Button label={alert.primary} top={792} />
      <Abs style={{ left: side, right: side, top: 856, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: color.cyan, transform: `scale(${1 - press * 0.03})`, textDecoration: press ? 'underline' : 'none', textUnderlineOffset: 4 }}>
        {alert.secondary}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color.cyan} strokeWidth="1.6" strokeLinecap="round">
          <path d="M5 3l4 4-4 4" />
        </svg>
      </Abs>
    </Screen>
  );
};
