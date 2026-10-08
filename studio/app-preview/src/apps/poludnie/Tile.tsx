import { useCurrentFrame } from 'remotion';
import { AppRoot } from './Frame';
import { HouseScene } from './components/House';
import { P } from './components/iso';
import { color, num, semi } from './tokens';
import { facts, pl } from './data';
import { tile } from './storyboard';
import { liveFlows } from './Scene';
import { progress } from './components/motion';

const quant = (kw: number) => (Math.round((kw * tile.duration) / 18) * 18) / tile.duration;

export const Tile = () => {
  const f = useCurrentFrame();
  const flows = { sun: quant(liveFlows.sun), home: quant(liveFlows.home), battery: quant(liveFlows.battery), grid: quant(liveFlows.grid) };
  return (
    <AppRoot>
      <div style={{ position: 'absolute', left: 28, top: 124 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ ...num, fontSize: 64, lineHeight: 0.95 }}>{pl(facts.now.prod)}</span>
          <span style={{ ...num, fontSize: 26 }}>kW</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 16, ...semi, color: color.sunText }}>z dachu, teraz</div>
      </div>
      <HouseScene width={480} height={600} style={{ left: 0, top: 0 }} camera={{ x: 22, y: 22, scale: 1.08 }} frame={f} level={0.955} flows={flows} sunAngle={f * 0.3} glint={progress(f, 40, 50)} sunAt={P(258, 20, 176)} />
    </AppRoot>
  );
};
