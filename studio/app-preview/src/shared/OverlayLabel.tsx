import type { CSSProperties } from 'react';
import { interpolate } from 'remotion';
import { overlayRules, wordCount } from './rules';
import type { Overlay } from './types';

export const OverlayLabel = ({
  overlay,
  frame,
  ease,
  style,
}: {
  overlay: Overlay;
  frame: number;
  ease: (t: number) => number;
  style: CSSProperties;
}) => {
  if (wordCount(overlay.text) > overlayRules.maxWords) throw new Error(`overlay too long: ${overlay.text}`);
  if (overlay.to - overlay.from + 1 < overlayRules.minFrames) throw new Error(`overlay too short: ${overlay.text}`);
  if (frame < overlay.from || frame > overlay.to) return null;
  const inT = ease(interpolate(frame, [overlay.from, overlay.from + 8], [0, 1], { extrapolateRight: 'clamp' }));
  const outT = ease(interpolate(frame, [overlay.to - 6, overlay.to], [0, 1], { extrapolateLeft: 'clamp' }));
  const opacity = Math.min(inT, 1 - outT);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: overlay.top,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 80,
        opacity,
        transform: `translateY(${(1 - inT) * 14 - outT * 6}px)`,
      }}>
      <div style={style}>{overlay.text}</div>
    </div>
  );
};
