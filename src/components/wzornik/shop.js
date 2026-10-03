import React from 'react';

const links = ['Sklep', 'Subskrypcja', 'O palarni'];
const labels = [
  { origin: 'Etiopia', notes: 'Brzoskwinia, jaśmin', roast: 'Jasne', tone: 'light' },
  { origin: 'Kolumbia', notes: 'Karmel, jabłko', roast: 'Średnie', tone: 'medium' },
];

export default function Shop() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Trzask</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
          <b className="mk-shop__cart">Koszyk 0</b>
        </span>
      </div>
      <p className="mk-shop__mark">Trzask</p>
      <div className="mk-shop__labels">
        {labels.map(label => (
          <div key={label.origin} className={`mk-shop__label mk-shop__label--${label.tone}`}>
            <b>{label.origin}</b>
            <svg viewBox="0 0 100 32" aria-hidden="true">
              <path d="M2 6C10 28 22 27 42 20S78 11 98 9" />
              <circle cx="80" cy="11" r="3" />
            </svg>
            <span>{label.notes}</span>
            <small>{label.roast}</small>
          </div>
        ))}
      </div>
      <p className="mk__h">
        Palimy we wtorki
        <br />i czwartki.
      </p>
      <span className="mk__btn">Zobacz kawy</span>
    </>
  );
}
