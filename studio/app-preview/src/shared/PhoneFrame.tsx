import type { CSSProperties, ReactNode } from 'react';
import { canvas } from './formats';

export interface PhoneTheme {
  body: string;
  edge: string;
  bezel: string;
  button: string;
  camera: string;
  shadow: string;
}

export const phone = {
  bezel: 13,
  edge: 3,
  radius: 68,
  screenRadius: 54,
  get width() {
    return canvas.width + 2 * (this.bezel + this.edge);
  },
  get height() {
    return canvas.height + 2 * (this.bezel + this.edge);
  },
};

export const PhoneFrame = ({
  scale,
  theme,
  children,
  style,
}: {
  scale: number;
  theme: PhoneTheme;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const inset = phone.bezel + phone.edge;
  const button = (side: 'left' | 'right', top: number, height: number) => (
    <div
      style={{
        position: 'absolute',
        [side]: -3,
        top,
        width: 4,
        height,
        borderRadius: 2,
        background: theme.button,
      }}
    />
  );
  return (
    <div style={{ width: phone.width * scale, height: phone.height * scale, ...style }}>
      <div
        style={{
          position: 'relative',
          width: phone.width,
          height: phone.height,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}>
        {button('left', 190, 64)}
        {button('left', 270, 64)}
        {button('right', 230, 104)}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: phone.radius,
            background: theme.body,
            boxShadow: `inset 0 0 0 ${phone.edge}px ${theme.edge}, ${theme.shadow}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: phone.edge,
            borderRadius: phone.radius - phone.edge,
            background: theme.bezel,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: inset,
            top: inset,
            width: canvas.width,
            height: canvas.height,
            borderRadius: phone.screenRadius,
            overflow: 'hidden',
            isolation: 'isolate',
          }}>
          {children}
          <div
            style={{
              position: 'absolute',
              left: canvas.width / 2 - 7,
              top: 16,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: theme.camera,
            }}
          />
        </div>
      </div>
    </div>
  );
};
