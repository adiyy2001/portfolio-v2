import React from 'react';
import { m } from 'framer-motion';
import { duration, ease } from '../motion';

export default function Reveal({ as = 'div', children, ...rest }) {
  const Tag = m[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: duration.reveal, ease: ease.out }}
      {...rest}>
      {children}
    </Tag>
  );
}
