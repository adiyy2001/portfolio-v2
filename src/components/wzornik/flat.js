import React from 'react';
import { withPrefix } from 'gatsby';

const offers = [
  {
    file: 'klamka-sredzka',
    size: [360, 480],
    price: '429 000 zł',
    street: 'ul. Średzka, Leśnica',
    note: 'Nr 04. 41 m², 2 pokoje, 2 piętro.',
  },
  {
    file: 'klamka-czajkowskiego',
    size: [480, 300],
    price: '1 089 000 zł',
    street: 'ul. Czajkowskiego, Karłowice',
    note: 'Nr 01. 86 m², 4 pokoje, balkon.',
  },
  {
    file: 'klamka-wroblewskiego',
    size: [360, 480],
    price: '749 000 zł',
    street: 'ul. Wróblewskiego, Dąbie',
    note: 'Nr 03. Kamienica, 57 m², parter.',
  },
];
const issue = ['Katalog ofert', 'Reportaż: od wyceny do kluczy', 'Rynek: ceny z osiedli'];

export default function Flat() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Klamka</span>
        <span className="mk-flat__issue">
          <small>Magazyn ofert, Wrocław</small>
          Numer 11, listopad 2026
        </span>
        <span className="mk-flat__phone">+48 71 555 01 24</span>
      </div>
      <div className="mk-flat__spread">
        {offers.map(({ file, size: [width, height], price, street, note }) => (
          <figure key={file} className={`mk-flat__offer mk-flat__offer--${file.slice(7)}`}>
            <img
              src={withPrefix(`/media/wzornik/${file}.webp`)}
              alt=""
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <b>{price}</b>
              <span>{street}</span>
              <small>{note}</small>
            </figcaption>
          </figure>
        ))}
        <div className="mk-flat__toc">
          <small>W numerze</small>
          <ul>
            {issue.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
