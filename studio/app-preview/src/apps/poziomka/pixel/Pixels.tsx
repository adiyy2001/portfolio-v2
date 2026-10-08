import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import type { FB } from './fb';

export const Pixels = ({ fb, scale, style }: { fb: FB; scale: number; style?: CSSProperties }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(fb.w, fb.h);
    fb.toRgba(image.data);
    ctx.putImageData(image, 0, 0);
  });
  return (
    <canvas
      ref={ref}
      width={fb.w}
      height={fb.h}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: fb.w * scale,
        height: fb.h * scale,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
};
