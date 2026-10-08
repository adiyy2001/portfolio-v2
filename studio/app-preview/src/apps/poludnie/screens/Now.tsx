import { color, hue, num, semi, type Hue } from '../tokens';
import { facts, pl } from '../data';
import { kw, now } from '../content';
import { Big, Card, Dot, Header } from '../components/ui';
import { fadeOut } from '../components/motion';

export const nowLayout = { sceneTop: 236, sceneHeight: 366, rowsTop: 606 } as const;

const rowHeight = 54;

const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);

export const mixHex = (a: string, b: string, t: number) =>
  `#${[0, 1, 2]
    .map(i => Math.round(channel(a, i) + (channel(b, i) - channel(a, i)) * Math.max(0, Math.min(1, t))))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')}`;

const flowOf = (id: Hue) => (id === 'home' ? facts.now.home : id === 'battery' ? facts.now.battery : id === 'grid' ? facts.now.grid : facts.now.prod);

export const NowBody = ({
  f,
  leaveAt = 99999,
  rows = () => 1,
  press = 0,
  count = 1,
}: {
  f: number;
  leaveAt?: number;
  rows?: (hue: string) => number;
  press?: number;
  count?: number;
}) => {
  const out = fadeOut(f, leaveAt, 10);
  return (
    <div style={{ position: 'absolute', inset: 0, ...out }}>
      <Header title={now.title} sub={now.sub} />
      <Big x={22} y={132} value={pl(facts.now.prod * count)} unit="kW" />
      <div style={{ position: 'absolute', left: 24, top: 218, display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, ...semi, color: color.sunText }}>
        <Dot hueId="sun" size={10} />
        {now.label}, {Math.round((facts.now.prod / 8.2) * 100 * count)}% mocy instalacji
      </div>
      <Card x={16} y={nowLayout.rowsTop} w={411} h={rowHeight * 3 + 12}>
        {now.rows.map((row, i) => {
          const quiet = Math.max(0, Math.min(1, (1 - rows(row.hue)) / 0.6));
          const pressed = row.hue === 'battery' ? press : 0;
          return (
            <div key={row.name} style={{ position: 'absolute', left: 0, right: 0, top: 6 + i * rowHeight, height: rowHeight, display: 'flex', alignItems: 'center', padding: '0 18px', boxShadow: i ? `inset 0 1px 0 ${color.left}` : undefined, background: pressed ? `rgba(220,227,235,${0.9 * pressed})` : undefined, transform: `scale(${1 - 0.02 * pressed})` }}>
              <Dot hueId={row.hue} size={12} />
              <div style={{ marginLeft: 14, flex: 1 }}>
                <div style={{ fontSize: 17, lineHeight: '21px', ...semi, color: mixHex(color.ink, color.secondary, quiet) }}>{row.name}</div>
                <div style={{ fontSize: 13, lineHeight: '17px', color: color.secondary }}>{row.note}</div>
              </div>
              <div style={{ ...num, fontSize: 28 - 4 * quiet, fontWeight: 800 - 200 * quiet, color: mixHex(hue[row.hue].text, color.gridText, quiet) }}>{kw(flowOf(row.hue) * count)}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
