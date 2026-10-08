import type { CSSProperties, ReactNode } from 'react';
import { Easing } from 'remotion';
import { useFonts } from '../../shared/fonts';
import { OverlayLabel } from '../../shared/OverlayLabel';
import { color, fonts } from './tokens';
import { storyboard } from './storyboard';
import { Scene } from './Scene';
import { fontFamily } from './components/ui';

export const AppRoot = ({ children, background = color.grouped }: { children: ReactNode; background?: string }) => {
  useFonts(fonts);
  return (
    <div style={{ position: 'absolute', inset: 0, background, fontFamily, overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
      {children}
    </div>
  );
};

const overlayStyle: CSSProperties = {
  background: 'rgba(16,20,24,0.92)',
  color: '#fff',
  fontFamily,
  fontSize: 20,
  lineHeight: '26px',
  fontWeight: 700,
  letterSpacing: -0.2,
  padding: '12px 22px',
  borderRadius: 16,
  maxWidth: 411,
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const ease = Easing.bezier(0.25, 0.1, 0.25, 1);

export const StoreFrame = ({ frame, hideCard = false, overlays = true }: { frame: number; hideCard?: boolean; overlays?: boolean }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: 443, height: 960, overflow: 'hidden', background: color.surface }}>
    <Scene frame={frame} hideCard={hideCard} />
    {overlays &&
      storyboard.shots.map(shot =>
        shot.overlay ? <OverlayLabel key={shot.id} overlay={shot.overlay} frame={frame} ease={ease} style={overlayStyle} /> : null,
      )}
  </div>
);
