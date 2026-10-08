import type { ReactNode } from 'react';
import { useFonts } from '../../shared/fonts';
import { overlayRules, readingFrames, wordCount } from '../../shared/rules';
import type { Overlay } from '../../shared/types';
import { clay, color, fontFamily, fonts } from './tokens';
import { storyboard } from './storyboard';
import { Scene } from './Scene';
import { easeIn, progress, puffAt } from './components/motion';

export const AppRoot = ({ children, background = color.ground }: { children: ReactNode; background?: string }) => {
  useFonts(fonts);
  return (
    <div style={{ position: 'absolute', inset: 0, background, fontFamily, color: color.ink, overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {children}
    </div>
  );
};

export const Caption = ({ overlay, frame }: { overlay: Overlay; frame: number }) => {
  const frames = overlay.to - overlay.from + 1;
  if (wordCount(overlay.text) > overlayRules.maxWords) throw new Error(`overlay too long: ${overlay.text}`);
  if (frames < overlayRules.minFrames || frames < readingFrames(overlay.text)) throw new Error(`overlay too short: ${overlay.text}`);
  if (frame < overlay.from || frame > overlay.to) return null;
  const s = puffAt(frame, overlay.from);
  const out = progress(frame, overlay.to - 6, 7, easeIn);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: overlay.top, display: 'flex', justifyContent: 'center', zIndex: 80 }}>
      <div
        style={{
          background: color.card,
          boxShadow: clay(0.9),
          borderRadius: 27,
          height: 54,
          padding: '0 26px',
          display: 'flex',
          alignItems: 'center',
          fontFamily,
          fontWeight: 900,
          fontSize: 21,
          color: color.ink,
          whiteSpace: 'nowrap',
          transform: `scale(${s * (1 - out * 0.4)})`,
          opacity: Math.min(1, (frame - overlay.from) / 3) * (1 - out),
        }}>
        {overlay.text}
      </div>
    </div>
  );
};

export const storeLoop = storyboard.duration + storyboard.bridge;

export const StoreFrame = ({ frame, overlays = true, hideMascot = false, settled = false }: { frame: number; overlays?: boolean; hideMascot?: boolean; settled?: boolean }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, overflow: 'hidden', background: color.ground }}>
    <Scene frame={frame} hideMascot={hideMascot} settled={settled} />
    {overlays && storyboard.shots.map(shot => (shot.overlay ? <Caption key={shot.id} overlay={shot.overlay} frame={frame} /> : null))}
  </div>
);
