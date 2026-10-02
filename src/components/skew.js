import React from 'react';
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { spring } from '../motion';

export default function Skew({ children }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const range = reduce ? [0, 0, 0] : [3, 0, -3];
  const skew = useSpring(useTransform(velocity, [-3000, 0, 3000], range), spring.skew);
  return (
    <m.span className="skew" style={{ skewX: skew }}>
      {children}
    </m.span>
  );
}
