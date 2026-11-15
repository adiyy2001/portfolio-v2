import React from 'react';

const links = [
  ['I', 'Pokoje'],
  ['II', 'Doba'],
  ['III', 'Adres'],
];

export default function Stay() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__links">
          {links.map(([number, link]) => (
            <span key={link}>
              <small>{number}</small>
              {link}
            </span>
          ))}
        </span>
        <span className="mk-stay__book">Rezerwacja</span>
      </div>
      <div className="mk-stay__label">
        <svg className="mk-stay__fob" viewBox="0 0 40 56" aria-hidden="true">
          <circle cx="20" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="20" cy="31" rx="16" ry="22" fill="currentColor" />
          <ellipse cx="20" cy="31" rx="13" ry="19" fill="none" stroke="#f1e7cf" strokeWidth="0.8" />
          <text x="20" y="40" textAnchor="middle" fill="#f1e7cf" fontSize="24">
            B
          </text>
        </svg>
        <p className="mk__logo">Brelok</p>
        <span className="mk-stay__year">1912</span>
        <p className="mk__h">
          Czternaście pokoi
          <br />i jeden klucz do miasta.
        </p>
        <span className="mk__btn">Sprawdź termin</span>
      </div>
    </>
  );
}
