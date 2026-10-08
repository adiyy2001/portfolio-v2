import { entry } from '../content';
import { color, glow } from '../tokens';
import { Abs, Back, Button, Label, Panel, Screen, inner, side } from '../components/ui';

const fields: [string, string, string?][] = [
  ['Login', entry.login],
  ['E-mail', entry.email],
  ['Hasło', entry.password, 'secret'],
  ['Zmienione', entry.changed],
];

export const EntryScreen = () => (
  <Screen time={entry.time}>
    <Back title="Wpis" right={<Label fill={color.cyan}>zmienione dziś</Label>} />
    <Abs style={{ left: side, right: side, top: 120, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 64, height: 64, flex: 'none', borderRadius: 6, background: color.panel, boxShadow: `inset 0 0 0 1.5px ${color.cyan}, ${glow(color.cyan, 0.4, 12)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Oxanium', sans-serif", fontWeight: 800, fontSize: 24, color: color.cyan }}>
        FW
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 18, lineHeight: '24px' }}>{entry.name}</div>
        <div style={{ fontSize: 12, lineHeight: '18px', color: color.muted, marginTop: 2 }}>{entry.domain}</div>
      </div>
    </Abs>
    <Panel style={{ left: side, top: 220, width: inner, height: 4 * 74 + 8 }}>
      {fields.map(([term, value, kind], i) => (
        <div key={term} style={{ position: 'absolute', left: 16, right: 16, top: 4 + i * 74, height: 74, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, borderTop: i ? `1px solid ${color.grid}` : undefined }}>
          <Label>{term}</Label>
          <div style={{ fontSize: kind ? 17 : 15, fontWeight: kind ? 500 : 500, letterSpacing: kind ? 0.6 : 0, whiteSpace: 'nowrap' }}>
            {kind
              ? [...value].map((ch, k) => (
                  <span key={k} style={{ color: /[a-zA-Z]/.test(ch) ? color.text : color.cyan }}>
                    {ch}
                  </span>
                ))
              : value}
          </div>
        </div>
      ))}
    </Panel>
    <Abs style={{ left: side, right: side, top: 548, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Label>siła</Label>
      <span style={{ fontSize: 14, fontWeight: 700, color: color.cyan }}>{entry.bits}</span>
    </Abs>
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} style={{ position: 'absolute', left: side + i * ((inner - 24) / 5 + 6), top: 574, width: (inner - 24) / 5, height: 8, borderRadius: 2, background: color.cyan, boxShadow: glow(color.cyan, 0.45, 8) }} />
    ))}
    <Abs style={{ left: side, right: side, top: 610, fontSize: 13, lineHeight: '19px', color: color.muted }}>
      Poprzednie hasło było w wycieku z 2.10.2026 i powtarzało się w dwóch serwisach. Oba też zmienione.
    </Abs>
    <Button
      label={entry.copy}
      top={792}
      icon={
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color.void} strokeWidth="1.8" strokeLinejoin="round">
          <rect x="6" y="6" width="9" height="10" rx="1.5" />
          <path d="M12 6V3.5A1.5 1.5 0 0 0 10.5 2h-6A1.5 1.5 0 0 0 3 3.5v8A1.5 1.5 0 0 0 4.5 13H6" />
        </svg>
      }
    />
    <Abs style={{ left: side, right: side, top: 860, textAlign: 'center', fontSize: 12, color: color.muted }}>{entry.copyNote}</Abs>
  </Screen>
);
