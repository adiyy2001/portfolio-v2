import React, { useRef } from 'react';
import { m, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Needle from './scan-needle';

const count = 36;
const machineEnd = 0.36;
const handSpan = 0.5;
const pace = 1.6;
const sewn = 0.9;

const noise = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

const smooth = t => t * t * (3 - 2 * t);

const stitches = Array.from({ length: count }, (_, i) => {
  const t = i / (count - 1);
  const loose = smooth(Math.min(Math.max((t - machineEnd) / handSpan, 0), 1));
  const start = sewn * t ** pace;
  return {
    key: i,
    start,
    end: start + 0.1,
    x: `calc(${(noise(i, 1) * loose * 9).toFixed(2)}px * var(--jit, 1))`,
    y: `calc(${(noise(i, 2) * loose * 10).toFixed(2)}px * var(--jit, 1))`,
    rotate: noise(i, 3) * loose * 34,
    length: 1 + noise(i, 4) * loose * 0.6,
  };
});

function Stitch({ progress, start, end, x, y, rotate, length }) {
  const scaleX = useTransform(progress, [start, end], [0, length]);
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);
  return <m.i style={{ x, y, rotate, scaleX, opacity }} />;
}

const reach = value => Math.min(1, (value / sewn) ** (1 / pace));
const looseness = t => smooth(Math.min(Math.max((t - machineEnd) / handSpan, 0), 1));

const headAt = value => `${reach(value) * 100}%`;
const headRise = value => Math.sin(reach(value) * 46) * looseness(reach(value)) * 8;
const headTilt = value => Math.sin(reach(value) * 31 + 1) * looseness(reach(value)) * 14;

export default function ScanSeam({ machine, hand }) {
  const band = useRef(null);
  const reduce = useReducedMotion();
  const done = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: band,
    offset: ['start 92%', 'start 40%'],
  });
  const progress = reduce ? done : scrollYProgress;
  const head = useTransform(progress, headAt);
  const rise = useTransform(progress, headRise);
  const tilt = useTransform(progress, headTilt);

  return (
    <div className="seam" ref={band} aria-hidden="true">
      <p className="seam__note seam__note--machine">{machine}</p>
      <div className="seam__line">
        {stitches.map(({ key, ...rest }) => (
          <Stitch key={key} progress={progress} {...rest} />
        ))}
      </div>
      <m.div className="seam__head" style={{ x: head, y: rise, rotate: tilt }}>
        <Needle />
      </m.div>
      <p className="seam__note seam__note--hand">{hand}</p>
    </div>
  );
}
