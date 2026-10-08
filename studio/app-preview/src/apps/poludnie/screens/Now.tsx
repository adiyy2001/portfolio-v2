import { color, hue, num, semi } from '../tokens';
import { facts, pl } from '../data';
import { now } from '../content';
import { Big, Card, Dot, Header } from '../components/ui';
import { fadeOut } from '../components/motion';

export const nowLayout = { sceneTop: 244, sceneHeight: 336, rowsTop: 590 } as const;

export const NowBody = ({ f, leaveAt = 99999, rows = () => 1, press = 0 }: { f: number; leaveAt?: number; rows?: (hue: string) => number; press?: number }) => {
  const out = fadeOut(f, leaveAt, 10);
  return (
    <div style={{ position: 'absolute', inset: 0, ...out }}>
      <Header title={now.title} sub={now.sub} />
      <Big x={22} y={132} value={pl(facts.now.prod)} unit="kW" />
      <div style={{ position: 'absolute', left: 24, top: 218, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, ...semi, color: color.sunText }}>
        <Dot hueId="sun" size={10} />
        {now.label}, {Math.round((facts.now.prod / 8.2) * 100)}% mocy instalacji
      </div>
      <Card x={16} y={nowLayout.rowsTop} w={411} h={186}>
        {now.rows.map((row, i) => {
          const o = rows(row.hue);
          const pressed = row.hue === 'battery' ? press : 0;
          return (
            <div key={row.name} style={{ position: 'absolute', left: 0, right: 0, top: 6 + i * 58, height: 58, display: 'flex', alignItems: 'center', padding: '0 18px', boxShadow: i ? `inset 0 1px 0 ${color.left}` : undefined, opacity: o, background: pressed ? `rgba(220,227,235,${0.9 * pressed})` : undefined, transform: `scale(${1 - 0.02 * pressed})` }}>
              <Dot hueId={row.hue} size={12} />
              <div style={{ marginLeft: 14, flex: 1 }}>
                <div style={{ fontSize: 17, lineHeight: '21px', ...semi }}>{row.name}</div>
                <div style={{ fontSize: 13, lineHeight: '17px', color: color.secondary }}>{row.note}</div>
              </div>
              <div style={{ ...num, fontSize: 28, color: hue[row.hue].text }}>{row.value}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

