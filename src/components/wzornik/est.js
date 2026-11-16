import React from 'react';
import { tie } from '../../i18n';

const arches = [
  [430, 'M370 300V196a60 60 0 0 1 120 0V300Z'],
  [700, 'M640 300V196a60 60 0 0 1 120 0V300Z'],
];

export default function Est() {
  return (
    <>
      <svg className="mk-est__hall" viewBox="0 0 800 500" aria-hidden="true">
        <defs>
          <pattern id="wz-brick" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect width="24" height="12" fill="#3a1c10" />
            <path d="M0 0.5H24M0 6.5H24M6 0.5V6.5M18 6.5V12.5" stroke="#170b06" strokeWidth="1.2" />
          </pattern>
          <radialGradient id="wz-dusk" cx="0.62" cy="0.3" r="0.75">
            <stop offset="0" stopColor="#080504" stopOpacity="0" />
            <stop offset="1" stopColor="#080504" stopOpacity="0.85" />
          </radialGradient>
          <linearGradient id="wz-fade" x1="0" x2="1">
            <stop offset="0" stopColor="#080504" stopOpacity="0.92" />
            <stop offset="0.55" stopColor="#080504" stopOpacity="0.35" />
            <stop offset="1" stopColor="#080504" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="#1d1612" />
        <path d="M-20 80L400 -10L820 80V520H-20Z" fill="url(#wz-brick)" />
        <path
          d="M-20 80L400 -10L820 80"
          fill="none"
          stroke="#4d2817"
          strokeWidth="10"
          strokeLinejoin="bevel"
        />
        <circle cx="560" cy="70" r="30" fill="#140c08" stroke="#5a301c" strokeWidth="8" />
        {arches.map(([x, d]) => (
          <g key={x}>
            <path d={d} fill="#0c0807" stroke="#55301d" strokeWidth="10" />
            <path
              d={d}
              fill="none"
              stroke="#2a1d16"
              strokeWidth="2"
              transform={`translate(${x} 250) scale(0.86) translate(${-x} -250)`}
            />
            <path
              d={`M${x - 52} 236H${x + 52}M${x - 52} 270H${x + 52}M${x - 17} 150V300M${x + 17} 150V300`}
              stroke="#2a1d16"
              strokeWidth="2"
            />
          </g>
        ))}
        <rect width="800" height="500" fill="url(#wz-dusk)" />
        <rect width="800" height="500" fill="url(#wz-fade)" />
      </svg>
      <span className="mk-est__kicker">Lofty Cegielniane</span>
      <p className="mk__h">{tie('W 1894 roku wypalono tu pierwszą cegłę.')}</p>
      <p className="mk__p">{tie('67 loftów w dawnej cegielni na Ołbinie, od 37 do 112 m².')}</p>
      <span className="mk__btn">Umów pokaz</span>
    </>
  );
}
