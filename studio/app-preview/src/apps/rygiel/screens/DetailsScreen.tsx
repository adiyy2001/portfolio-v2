import { breach, details } from '../content';
import { color, glow } from '../tokens';
import { T } from '../timeline';
import { Abs, Back, Button, Dot, Label, Panel, Scramble, Screen, Tag, Warn, drawAt, inner, pulseAt, side } from '../components/ui';

const nodeY = [210, 290, 370];
const rowOpts = { step: 0.5, min: 4, max: 7 };

export const DetailsScreen = ({ f, press = 0, still = false }: { f: number; press?: number; still?: boolean }) => {
  const at = (frame: number) => (still ? -999 : frame);
  const p = pulseAt(f);
  const lineT = still ? 1 : Math.min(1, Math.max(0, (f - T.timelineNodes[0]) / (T.timelineNodes[2] - T.timelineNodes[0] + 18)));
  const highlight = still ? 1 : drawAt(f, T.detectedGlow, 12);
  return (
    <Screen time={details.time}>
      <Back
        title={details.title}
        right={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot fill={color.alert} glowAlpha={p} />
            <Label fill={color.alert}>alert</Label>
          </span>
        }
      />
      <Abs style={{ left: side, right: side, top: 118 }}>
        <div style={{ fontWeight: 700, fontSize: 20, lineHeight: '26px' }}>{breach.service}</div>
        <div style={{ fontSize: 13, lineHeight: '20px', color: color.muted, marginTop: 4 }}>{breach.domain}</div>
      </Abs>
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width="443" height="460" viewBox="0 0 443 460">
        <line x1="40" y1={nodeY[0]} x2="40" y2={nodeY[2]} stroke={color.dim} strokeWidth="2" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineT} />
        {nodeY.map((y, i) => {
          const t = still ? 1 : drawAt(f, T.timelineNodes[i]);
          const c = i === 0 ? color.alert : color.cyan;
          return (
            <g key={y} opacity={t > 0 ? 1 : 0}>
              {i === 2 && <circle cx="40" cy={y} r="12" fill="none" stroke={color.cyan} strokeWidth="3" opacity={p * t} style={{ filter: 'blur(3px)' }} />}
              <circle cx="40" cy={y} r="8" fill={i === 2 ? color.void : c} stroke={c} strokeWidth="2" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
            </g>
          );
        })}
      </svg>
      {details.timeline.map((node, i) => {
        const start = at(T.timelineNodes[i] + 4);
        const detected = i === 1;
        return (
          <Abs key={node.what} style={{ left: 64, right: side, top: nodeY[i] - 12 }}>
            <span
              style={{
                display: 'inline-block',
                padding: detected ? '0 6px' : 0,
                marginLeft: detected ? -6 : 0,
                borderRadius: 3,
                boxShadow: detected && highlight > 0 ? `inset 0 0 0 1px ${color.cyan}, ${glow(color.cyan, 0.45 * highlight, 10)}` : undefined,
              }}>
              <Label fill={detected ? color.cyan : i === 0 ? color.alert : color.muted}>
                <Scramble text={node.when} f={f} start={start} fill={detected ? color.cyan : i === 0 ? color.alert : color.muted} opts={rowOpts} />
              </Label>
            </span>
            <div style={{ fontWeight: 700, fontSize: 16, lineHeight: '22px', marginTop: 4 }}>
              <Scramble text={node.what} f={f} start={start + 4} opts={rowOpts} />
            </div>
            <div style={{ fontSize: 13, lineHeight: '18px', color: color.muted, marginTop: 2 }}>
              <Scramble text={node.note} f={f} start={start + 10} fill={color.muted} opts={rowOpts} />
            </div>
          </Abs>
        );
      })}
      {[
        { title: details.leakedTitle, items: breach.items, tone: 'alert', start: T.leaked, left: side },
        { title: details.safeTitle, items: breach.safe, tone: 'muted', start: T.safe, left: side + inner / 2 + 6 },
      ].map(col => (
        <Abs key={col.title} style={{ left: col.left, top: 452, width: inner / 2 - 6 }}>
          <Label fill={col.tone === 'alert' ? color.alert : color.muted}>
            <Scramble text={col.title} f={f} start={at(col.start)} fill={col.tone === 'alert' ? color.alert : color.muted} opts={rowOpts} />
          </Label>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {col.items.map((item, i) => {
              const s = at(col.start + 6 + i * 3);
              const on = f >= s;
              return (
                <div
                  key={item}
                  style={{
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0 12px',
                    borderRadius: 3,
                    background: color.panel,
                    boxShadow: on ? `inset 0 0 0 1px ${col.tone === 'alert' ? color.alert : color.dim}` : undefined,
                    fontSize: 14,
                    color: col.tone === 'alert' ? color.text : color.muted,
                    opacity: on ? 1 : 0,
                  }}>
                  {col.tone === 'alert' ? <Dot fill={color.alert} size={6} glowAlpha={0} /> : <span style={{ width: 6, height: 1.5, background: color.muted }} />}
                  <Scramble text={item} f={f} start={s} fill={col.tone === 'alert' ? color.text : color.muted} opts={rowOpts} />
                </div>
              );
            })}
          </div>
        </Abs>
      ))}
      {(still || f >= T.entry) && (
        <Panel style={{ left: side, top: 604, width: inner, height: 96 }} outline={color.warn}>
          <Abs style={{ left: 16, right: 16, top: 12 }}>
            <Label>
              <Scramble text={details.entry.title} f={f} start={at(T.entry)} fill={color.muted} opts={rowOpts} />
            </Label>
            <div style={{ fontSize: 14, lineHeight: '20px', marginTop: 6, fontWeight: 700 }}>
              <Scramble text={`${details.entry.name} · ${details.entry.login}`} f={f} start={at(T.entry + 3)} opts={rowOpts} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, color: color.warn }}>
              <Warn />
              <Scramble text={details.entry.warning} f={f} start={at(T.entry + 8)} fill={color.warn} opts={rowOpts} />
            </div>
          </Abs>
        </Panel>
      )}
      <Button label={details.primary} top={792} press={press} />
      <Abs style={{ left: side, right: side, top: 862, textAlign: 'center' }}>
        <Tag text="skrót hasła mógł zostać złamany" tone="muted" />
      </Abs>
    </Screen>
  );
};
