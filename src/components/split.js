import React from 'react';
import { m } from 'framer-motion';
import { tie } from '../i18n';
import { duration, ease, stagger } from '../motion';

const line = {
  shown: { transition: { staggerChildren: stagger.words } },
};

const word = {
  hidden: { y: '112%' },
  shown: { y: '0%', transition: { duration: duration.words, ease: ease.out } },
};

export default function Split({ text, as = 'span', className, onView, ...rest }) {
  const parts = tie(text).split(' ');
  let index = 0;
  const words = parts.map((part, i) => {
    if (part === '|') return <br key={i} />;
    const gap = i < parts.length - 1 && parts[i + 1] !== '|' ? ' ' : null;
    const inner = onView ? (
      <m.span className="wi" variants={word}>
        {part}
      </m.span>
    ) : (
      <span className="wi" style={{ '--i': index++ }}>
        {part}
      </span>
    );
    return (
      <React.Fragment key={i}>
        <span className="w">{inner}</span>
        {gap}
      </React.Fragment>
    );
  });

  if (!onView) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {words}
      </Tag>
    );
  }

  const Tag = m[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      variants={line}
      {...rest}>
      {words}
    </Tag>
  );
}
