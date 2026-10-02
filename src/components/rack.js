import React from 'react';
import { Link } from 'gatsby';
import { useReducedMotion } from 'framer-motion';
import { tie } from '../i18n';

const threads = ['M6 2C2 24 10 46 6 62C4 70 8 76 6 80', 'M6 2C10 22 2 44 6 62C8 70 4 76 6 80'];

function Label({ label, n }) {
  const { to, tilt } = label;
  const reduce = useReducedMotion();

  const sway = event => {
    if (reduce || event.pointerType !== 'mouse') return;
    event.currentTarget.animate(
      [0, 5, -2.6, 1.2, 0].map(step => ({
        transform: `rotate(${tilt + step}deg)`,
        easing: 'ease-in-out',
      })),
      { duration: 1200 },
    );
  };

  return (
    <div className="hang">
      <svg className="hang__thread" viewBox="0 0 12 82" aria-hidden="true">
        <path className="stroke" strokeWidth="1.6" d={threads[n]} />
      </svg>
      <Link
        className="label"
        to={to}
        style={{ '--tilt': `${tilt}deg`, '--n': n }}
        onPointerEnter={sway}>
        <span className="label__card">
          <span className="label__hole" aria-hidden="true" />
          <span className="label__for">{label.for}</span>
          <span className="label__who">{label.who}</span>
          <span className="label__what">{tie(label.what)}</span>
          <span className="label__go">
            <span>{label.go}</span>
            <svg viewBox="0 0 28 14" aria-hidden="true">
              <path className="stroke" strokeWidth="1.8" d="M1 7H26M20 1L26 7L20 13" />
            </svg>
          </span>
        </span>
      </Link>
      <span className="label__note" aria-hidden="true">
        {label.note}
      </span>
    </div>
  );
}

export default function Rack({ labels }) {
  return (
    <div className="rack">
      <svg
        className="rack__rail"
        viewBox="0 0 600 18"
        preserveAspectRatio="none"
        aria-hidden="true">
        <path
          className="stroke"
          strokeWidth="2"
          d="M2 4C200 16 400 16 598 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {labels.map((label, n) => (
        <Label key={label.to} label={label} n={n} />
      ))}
    </div>
  );
}
