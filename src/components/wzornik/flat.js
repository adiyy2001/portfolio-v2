import React from 'react';
import { tie } from '../../i18n';

const links = ['Oferty', 'Sprzedaj z nami', 'Zespół', 'Kontakt'];
const houses = [
  { x: 0, top: 46, width: 92, fill: '#e7c27a', roof: 'gable', cols: 3, rows: 3 },
  { x: 98, top: 22, width: 92, fill: '#a9c4dd', roof: 'flat', cols: 3, rows: 4, lit: [1, 1] },
  { x: 196, top: 54, width: 100, fill: '#e3a7a0', roof: 'mansard', cols: 4, rows: 3 },
  { x: 302, top: 34, width: 98, fill: '#b9c7a8', roof: 'flat', cols: 3, rows: 4 },
];
const ground = 160;

function House({ x, top, width, fill, roof, cols, rows, lit }) {
  const step = width / cols;
  const rise = (ground - top - 12) / rows;
  return (
    <g>
      {roof === 'gable' && (
        <path d={`M${x} ${top}L${x + width / 2} ${top - 26}L${x + width} ${top}Z`} fill="#5b3a2e" />
      )}
      {roof === 'mansard' && (
        <path
          d={`M${x} ${top}L${x + 12} ${top - 18}H${x + width - 12}L${x + width} ${top}Z`}
          fill="#3b3346"
        />
      )}
      <rect x={x} y={top} width={width} height={ground - top} fill={fill} />
      {roof === 'flat' && (
        <rect x={x - 3} y={top - 5} width={width + 6} height={6} fill="#17151f" />
      )}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const marked = lit && lit[0] === row && lit[1] === col;
          return (
            <rect
              key={`${row}-${col}`}
              x={x + col * step + step * 0.28}
              y={top + 10 + row * rise}
              width={step * 0.44}
              height={rise * 0.56}
              fill={marked ? '#ffe8a3' : '#17151f'}
              stroke={marked ? '#4b30e8' : 'none'}
              strokeWidth={marked ? 4 : 0}
            />
          );
        }),
      )}
    </g>
  );
}

export default function Flat() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">
          <i className="mk-flat__door" />
          Próg
        </span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <svg className="mk-flat__street" viewBox="0 -30 400 194" aria-hidden="true">
        {houses.map(house => (
          <House key={house.x} {...house} />
        ))}
        <rect x="0" y={ground} width="400" height="4" fill="#17151f" />
      </svg>
      <p className="mk__h">
        Które okno
        <br />
        będzie twoje?
      </p>
      <p className="mk__p">
        {tie('Trzyosobowe biuro z ulicy Sienkiewicza. Mieszkania i domy we Wrocławiu.')}
      </p>
      <span className="mk__btn">Pokaż oferty</span>
    </>
  );
}
