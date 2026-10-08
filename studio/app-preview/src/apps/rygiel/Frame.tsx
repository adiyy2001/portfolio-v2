import type { ReactNode } from 'react';
import { useFonts } from '../../shared/fonts';
import { overlayRules, readingFrames, wordCount } from '../../shared/rules';
import type { Overlay } from '../../shared/types';
import { color, fonts, glow } from './tokens';
import { storyboard } from './storyboard';
import { Scene } from './Scene';
import { GridClock, Scramble, fontMono, progress, inOut } from './components/ui';

export const AppRoot = ({ children, background = color.void }: { children: ReactNode; background?: string }) => {
  useFonts(fonts);
  return (
    <div style={{ position: 'absolute', inset: 0, background, fontFamily: fontMono, color: color.text, overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {children}
    </div>
  );
};

export const overlayOpts = { step: 0.5, min: 4, max: 7, rate: 2, seed: 5 };

export const Caption = ({ overlay, frame }: { overlay: Overlay; frame: number }) => {
  const frames = overlay.to - overlay.from + 1;
  if (wordCount(overlay.text) > overlayRules.maxWords) throw new Error(`overlay too long: ${overlay.text}`);
  if (frames < overlayRules.minFrames || frames < readingFrames(overlay.text)) throw new Error(`overlay too short: ${overlay.text}`);
  if (frame < overlay.from || frame > overlay.to) return null;
  const box = progress(frame, overlay.from, 6, inOut);
  const out = progress(frame, overlay.to - 5, 6, inOut);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: overlay.top, display: 'flex', justifyContent: 'center', zIndex: 80, opacity: 1 - out }}>
      <div
        style={{
          background: color.void,
          boxShadow: `inset 0 0 0 1.5px ${color.cyan}, ${glow(color.cyan, 0.45, 16)}`,
          borderRadius: 4,
          padding: '13px 20px 12px',
          fontFamily: fontMono,
          fontWeight: 500,
          fontSize: 19,
          lineHeight: '24px',
          color: color.text,
          whiteSpace: 'nowrap',
          clipPath: `inset(0 ${(1 - box) * 50}% 0 ${(1 - box) * 50}%)`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
        <span style={{ width: 8, height: 18, background: color.cyan, boxShadow: glow(color.cyan, 0.5, 6) }} />
        <Scramble text={overlay.text} f={frame} start={overlay.from + 3} opts={overlayOpts} />
      </div>
    </div>
  );
};

export const storeLoop = storyboard.duration + storyboard.bridge;

export const StoreFrame = ({
  frame,
  overlays = true,
  gridFrame = frame,
  gridTotal = storeLoop,
}: {
  frame: number;
  overlays?: boolean;
  gridFrame?: number;
  gridTotal?: number;
}) => (
  <GridClock.Provider value={{ frame: gridFrame, total: gridTotal }}>
    <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, overflow: 'hidden', background: color.void }}>
      <Scene frame={frame} />
      {overlays && storyboard.shots.map(shot => (shot.overlay ? <Caption key={shot.id} overlay={shot.overlay} frame={frame} /> : null))}
    </div>
  </GridClock.Provider>
);
