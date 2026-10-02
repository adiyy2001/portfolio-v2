import React from 'react';
import { m, useReducedMotion, useSpring } from 'framer-motion';
import { spring } from '../motion';

export default function Magnet({ children, ...rest }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring.magnet);
  const y = useSpring(0, spring.magnet);

  const pull = event => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left - box.width / 2) * 0.22);
    y.set((event.clientY - box.top - box.height / 2) * 0.3);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.a style={{ x, y }} onPointerMove={pull} onPointerLeave={release} {...rest}>
      {children}
    </m.a>
  );
}
