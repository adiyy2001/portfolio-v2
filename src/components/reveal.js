import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { duration, ease, instant } from '../motion';

export default function Reveal({ as = 'div', children, ...rest }) {
  const Tag = m[as];
  const reduce = useReducedMotion();
  return (
    <Tag
      data-reveal
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? instant : { duration: duration.reveal, ease: ease.out }}
      {...rest}>
      {children}
    </Tag>
  );
}
