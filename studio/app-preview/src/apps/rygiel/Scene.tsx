import { T } from './timeline';
import { storyboard } from './storyboard';
import { ScanLine, Wipe, drawAt, pressAt, progress, scanEase, scanY } from './components/ui';
import { AlertScreen } from './screens/AlertScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { GeneratorScreen } from './screens/GeneratorScreen';
import { LockScreen, VaultScreen } from './screens/VaultScreens';
import { HealthScreen } from './screens/HealthScreen';
import { LaunchScreen } from './screens/LaunchScreen';

const wipeT = (f: number, at: number, frames: number = T.wipe) => progress(f, at, frames, scanEase);

const Alert = ({ f }: { f: number }) => <AlertScreen f={f} press={pressAt(f, T.pressCard)} />;
const Details = ({ f }: { f: number }) => <DetailsScreen f={f} press={pressAt(f, T.pressChange)} />;
const Generator = ({ f }: { f: number }) => <GeneratorScreen f={f} press={pressAt(f, T.pressUse)} done={f >= T.done ? 1 : 0} />;
const Lock = ({ f }: { f: number }) => <LockScreen f={f} shut={1 - progress(f, T.unlockBolt, 14, scanEase)} />;
const Vault = ({ f }: { f: number }) => <VaultScreen f={f} tagGlow={drawAt(f, T.tagGlow, 12)} />;

export const hookScanT = (f: number) => progress(f, T.hookScan, T.hookScanFrames, scanEase);

export const Hook = ({ f }: { f: number }) => {
  const t = hookScanT(f);
  return (
    <>
      <Alert f={f} />
      {t > 0 && t < 1 && <ScanLine y={scanY(t)} />}
    </>
  );
};

export const Scene = ({ frame }: { frame: number }) => {
  const f = frame;
  if (f >= T.end) {
    const t = progress(f, T.end, storyboard.bridge - 1, scanEase);
    return <Wipe t={t} from={<LaunchScreen f={T.end - 1} />} to={<Hook f={0} />} />;
  }
  if (f < T.details) return <Hook f={f} />;
  if (f < T.details + T.wipe) return <Wipe t={wipeT(f, T.details)} from={<Alert f={f} />} to={<Details f={f} />} />;
  if (f < T.generator) return <Details f={f} />;
  if (f < T.generator + T.wipe) return <Wipe t={wipeT(f, T.generator)} from={<Details f={f} />} to={<Generator f={f} />} />;
  if (f < T.lock) return <Generator f={f} />;
  if (f < T.lock + T.wipe) return <Wipe t={wipeT(f, T.lock)} from={<Generator f={f} />} to={<Lock f={f} />} />;
  if (f < T.vaultScan) return <Lock f={f} />;
  if (f < T.vaultScan + T.vaultScanFrames)
    return <Wipe t={wipeT(f, T.vaultScan, T.vaultScanFrames)} from={<Lock f={f} />} to={<Vault f={f} />} />;
  if (f < T.health) return <Vault f={f} />;
  if (f < T.health + T.wipe) return <Wipe t={wipeT(f, T.health)} from={<Vault f={f} />} to={<HealthScreen f={f} />} />;
  if (f < T.launch) return <HealthScreen f={f} />;
  if (f < T.launch + T.wipe) return <Wipe t={wipeT(f, T.launch)} from={<HealthScreen f={f} />} to={<LaunchScreen f={f} />} />;
  return <LaunchScreen f={f} />;
};
