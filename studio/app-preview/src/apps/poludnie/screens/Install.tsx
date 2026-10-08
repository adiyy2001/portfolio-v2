import { color, num, semi } from '../tokens';
import { install } from '../content';
import { Card, Header } from '../components/ui';
import { HouseScene } from '../components/House';
import { facts } from '../data';

export const InstallBody = () => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <Header title={install.title} sub={install.sub} back="Bilans" />
    <HouseScene width={443} height={230} style={{ left: 0, top: 128 }} camera={{ x: 30, y: 92, scale: 0.68 }} frame={0} level={facts.day.socEvening / 100} flows={{ sun: 0, home: 0, battery: 0, grid: 0 }} />
    <Card x={16} y={366} w={411} h={486}>
      {install.rows.map(([term, value], i) => (
        <div key={term} style={{ position: 'absolute', left: 18, right: 18, top: 6 + i * 52.6, height: 52.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, boxShadow: i ? `inset 0 1px 0 ${color.left}` : undefined }}>
          <span style={{ fontSize: 15, color: color.secondary, whiteSpace: 'nowrap' }}>{term}</span>
          <span style={{ fontSize: i === 0 ? 22 : 15, ...(i === 0 ? num : semi), textAlign: 'right' }}>{value}</span>
        </div>
      ))}
    </Card>
  </div>
);
