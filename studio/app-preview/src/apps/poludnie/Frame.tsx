import type { ReactNode } from 'react';
import { interpolate } from 'remotion';
import { useFonts } from '../../shared/fonts';
import { overlayRules, readingFrames, wordCount } from '../../shared/rules';
import type { Overlay } from '../../shared/types';
import { color, fontFamily, fonts, slab } from './tokens';
import { storyboard } from './storyboard';
import { Scene } from './Scene';
import { easeIn, riseAt } from './components/motion';

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
  const s = riseAt(frame, overlay.from);
  const fade = interpolate(frame, [overlay.from, overlay.from + 6], [0, 1], { extrapolateRight: 'clamp' });
  const out = easeIn(interpolate(frame, [overlay.to - 6, overlay.to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: overlay.top, display: 'flex', justifyContent: 'center', zIndex: 80 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          height: 52,
          padding: '0 22px 0 18px',
          borderRadius: 12,
          background: color.ink,
          color: color.card,
          boxShadow: slab(4).replace(color.right, color.secondary),
          fontFamily,
          fontWeight: 700,
          fontSize: 21,
          whiteSpace: 'nowrap',
          opacity: fade * (1 - out),
          transform: `translateY(${(1 - s) * 12 - out * 6}px)`,
        }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: color.sun }} />
        {overlay.text}
      </div>
    </div>
  );
};

export const storeLoop = storyboard.duration + storyboard.bridge;

export const StoreFrame = ({ frame, clock, overlays = true }: { frame: number; clock?: number; overlays?: boolean }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, overflow: 'hidden', background: color.ground }}>
    <Scene frame={frame} clock={clock} />
    {overlays && storyboard.shots.map(shot => (shot.overlay ? <Caption key={shot.id} overlay={shot.overlay} frame={frame} /> : null))}
  </div>
);
