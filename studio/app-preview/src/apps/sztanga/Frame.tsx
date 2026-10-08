import type { ReactNode } from 'react';
import { useFonts } from '../../shared/fonts';
import { overlayRules, readingFrames, wordCount } from '../../shared/rules';
import type { Overlay } from '../../shared/types';
import { color, fonts } from './tokens';
import { storyboard } from './storyboard';
import { Scene } from './Scene';
import { fontFamily, slamScale, vf } from './components/type';

export const AppRoot = ({ children, background = color.ground }: { children: ReactNode; background?: string }) => {
  useFonts(fonts);
  return (
    <div style={{ position: 'absolute', inset: 0, background, fontFamily, overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {children}
    </div>
  );
};

const captionWidth = (text: string) => (text.length > 28 ? 62 : 75);

export const Caption = ({ overlay, frame }: { overlay: Overlay; frame: number }) => {
  const frames = overlay.to - overlay.from + 1;
  if (wordCount(overlay.text) > overlayRules.maxWords) throw new Error(`overlay too long: ${overlay.text}`);
  if (frames < overlayRules.minFrames || frames < readingFrames(overlay.text)) throw new Error(`overlay too short: ${overlay.text}`);
  if (frame < overlay.from || frame > overlay.to) return null;
  const scale = slamScale(frame, overlay.from);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: overlay.top, display: 'flex', justifyContent: 'center', zIndex: 80 }}>
      <div
        style={{
          background: color.ink,
          color: color.ground,
          ...vf(900, captionWidth(overlay.text)),
          fontSize: 25,
          lineHeight: '30px',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          padding: '12px 18px 11px',
          whiteSpace: 'nowrap',
          transform: `scale(${scale})`,
        }}>
        {overlay.text}
      </div>
    </div>
  );
};

export const StoreFrame = ({ frame, overlays = true }: { frame: number; overlays?: boolean }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, overflow: 'hidden', background: color.ground }}>
    <Scene frame={frame} />
    {overlays && storyboard.shots.map(shot => (shot.overlay ? <Caption key={shot.id} overlay={shot.overlay} frame={frame} /> : null))}
  </div>
);
