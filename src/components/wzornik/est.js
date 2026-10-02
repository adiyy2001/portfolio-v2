import React from 'react';
import { tie } from '../../i18n';

const links = ['Mieszkania', 'Lokalizacja', 'Galeria', 'Kontakt'];
const filters = [
  ['2 pokoje', false],
  ['3 pokoje', true],
  ['4 pokoje', false],
];
const rows = [96, 152, 208, 264];
const columns = [24, 84, 144, 204, 264, 324];

export default function Est() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Przędza</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <div className="mk-est__chips">
        {filters.map(([label, on]) => (
          <span key={label} className={on ? 'on' : undefined}>
            {label}
          </span>
        ))}
      </div>
      <svg className="mk-est__bld" viewBox="0 0 400 330" aria-hidden="true">
        <path
          d="M8 322V86L64 46V86L128 46V86L192 46V86L256 46V86L320 46V86L392 46V322Z"
          fill="#c4c5bf"
          stroke="#161616"
          strokeWidth="3"
        />
        {rows.flatMap(y =>
          columns.map(x => {
            const chosen = x === 204 && y === 152;
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="44"
                height="38"
                fill={chosen ? '#b4462e' : '#161616'}
                opacity={chosen ? 1 : 0.82}
              />
            );
          }),
        )}
        <g transform="translate(208 92)">
          <rect
            x="0"
            y="-62"
            width="150"
            height="50"
            fill="#fff"
            stroke="#161616"
            strokeWidth="2"
          />
          <text
            className="mk-est__unit"
            x="12"
            y="-40"
            fontSize="14"
            fontWeight="600"
            fill="#161616">
            M 2.14
          </text>
          <text className="mk-est__size" x="12" y="-21" fontSize="12" fill="#161616">
            3 pokoje, 62 m²
          </text>
          <path d="M14 -12L22 0L30 -12" fill="#fff" stroke="#161616" strokeWidth="2" />
        </g>
        <path d="M0 322H400" stroke="#161616" strokeWidth="4" />
      </svg>
      <p className="mk__h">
        Mieszkania
        <br />w dawnej
        <br />
        przędzalni.
      </p>
      <p className="mk__p">{tie('48 mieszkań, od 2 do 4 pokoi. Oddanie w 2027.')}</p>
      <span className="mk__btn">Znajdź mieszkanie</span>
    </>
  );
}
