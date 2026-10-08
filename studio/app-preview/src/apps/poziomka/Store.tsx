import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { hex, C } from './tokens';
import { sceneFb } from './Scene';
import { Pixels } from './pixel/Pixels';

export const PixelRoot = ({ children, background = hex[C.ink] }: { children: React.ReactNode; background?: string }) => (
  <AbsoluteFill style={{ background, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

export const StoreFrame = ({ frame, overlays = true }: { frame: number; overlays?: boolean }) => (
  <Pixels fb={sceneFb(frame, { overlays })} scale={2} />
);

export const Store = () => {
  const frame = useCurrentFrame();
  return (
    <PixelRoot>
      <StoreFrame frame={frame} />
    </PixelRoot>
  );
};
