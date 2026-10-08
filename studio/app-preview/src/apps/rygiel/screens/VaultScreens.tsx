import { lock, vault } from '../content';
import { color, glow } from '../tokens';
import { T } from '../timeline';
import { iconSvg } from '../icon';
import { Abs, Label, NavBar, Scramble, Screen, Tag, inner, side, toneColor } from '../components/ui';

export const LockScreen = ({ f, shut = 1 }: { f: number; shut?: number }) => {
  const open = shut < 0.5;
  return (
    <Screen time={lock.time}>
      <div
        style={{ position: 'absolute', left: (443 - 300) / 2, top: 190, width: 300, height: 300 }}
        dangerouslySetInnerHTML={{ __html: iconSvg({ id: 'lock', shut, bg: false }) }}
      />
      <Abs style={{ left: side, right: side, top: 500, textAlign: 'center', fontWeight: 700, fontSize: 24, lineHeight: '30px' }}>
        {open ? <Scramble text={lock.open} f={f} start={T.unlockText} fill={color.cyan} opts={{ step: 1, min: 4, max: 7 }} /> : lock.title}
      </Abs>
      <Abs style={{ left: side, right: side, top: 540, textAlign: 'center', fontSize: 13, color: color.muted }}>
        {lock.entries}, szyfrowanie na urządzeniu
      </Abs>
      <svg style={{ position: 'absolute', left: 443 / 2 - 34, top: 640 }} width="68" height="68" viewBox="0 0 68 68" fill="none" stroke={open ? color.cyan : color.dim} strokeWidth="2" strokeLinecap="round">
        <path d="M18 22a20 20 0 0 1 32 0" />
        <path d="M14 34a20 20 0 0 1 40 0v6" />
        <path d="M22 50V34a12 12 0 0 1 24 0v10" />
        <path d="M30 56V34a4 4 0 0 1 8 0v18" />
      </svg>
      <Abs style={{ left: side, right: side, top: 724, textAlign: 'center', fontSize: 13, color: color.muted }}>{lock.hint}</Abs>
    </Screen>
  );
};

const rowTop = 252;
const rowH = 64;

export const VaultScreen = ({ f, still = false, tagGlow = 0 }: { f: number; still?: boolean; tagGlow?: number }) => {
  const at = (frame: number) => (still ? -999 : frame);
  return (
    <Screen time={vault.time}>
      <Abs style={{ left: side, right: side, top: 62, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 24 }}>{vault.title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Label fill={color.cyan}>otwarty</Label>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color.cyan} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="12" height="8" rx="1.5" />
            <path d="M6 8V5.5a3 3 0 0 1 5.6-1.5" />
          </svg>
        </span>
      </Abs>
      <div style={{ position: 'absolute', left: side, top: 112, width: inner, height: 44, borderRadius: 4, background: color.panel, boxShadow: `inset 0 0 0 1.5px ${color.dim}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box', fontSize: 14, color: color.muted }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color.muted} strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        {vault.search}
      </div>
      {vault.filters.map((item, i) => {
        const w = (inner - 18) / 4;
        return (
          <div key={item.label} style={{ position: 'absolute', left: side + i * (w + 6), top: 170, width: w, height: 62, borderRadius: 4, background: color.panel, boxShadow: `inset 0 0 0 1px ${i === 0 ? color.cyan : color.grid}`, padding: '8px 10px', boxSizing: 'border-box' }}>
            <div style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 600, fontSize: 22, lineHeight: '24px', color: toneColor(item.tone) }}>{item.count}</div>
            <div style={{ fontSize: 10.5, lineHeight: '16px', marginTop: 4, color: color.muted, whiteSpace: 'nowrap' }}>{item.label.toLowerCase()}</div>
          </div>
        );
      })}
      {vault.rows.map((row, i) => {
        const start = at(T.rows + i * T.rowStep);
        const on = f >= start;
        const c = toneColor(row.tone);
        const highlight = i === 0 ? tagGlow : 0;
        return (
          <div key={row.name} style={{ position: 'absolute', left: side, top: rowTop + i * rowH, width: inner, height: rowH, borderBottom: `1px solid ${color.grid}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 4, background: color.panel, boxShadow: `inset 0 0 0 1px ${on ? (row.tone === 'muted' ? color.dim : c) : color.grid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oxanium', sans-serif", fontWeight: 600, fontSize: 15, color: row.tone === 'muted' ? color.text : c }}>
              <Scramble text={row.mono} f={f} start={start} fill={row.tone === 'muted' ? color.text : c} opts={{ step: 1, min: 4, max: 6 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: '20px', whiteSpace: 'nowrap' }}>
                <Scramble text={row.name} f={f} start={start + 2} opts={{ step: 0.5, min: 4, max: 7 }} />
              </div>
              <div style={{ fontSize: 12, lineHeight: '18px', color: color.muted, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <Scramble text={row.login} f={f} start={start + 4} fill={color.muted} opts={{ step: 0.5, min: 3, max: 6 }} />
              </div>
            </div>
            <div style={{ opacity: f >= start + 10 ? 1 : 0, borderRadius: 3, boxShadow: highlight > 0 ? glow(c, 0.55 * highlight, 12) : undefined }}>
              <Tag text={row.tag} tone={row.tone} />
            </div>
          </div>
        );
      })}
      <NavBar active="Sejf" />
    </Screen>
  );
};
