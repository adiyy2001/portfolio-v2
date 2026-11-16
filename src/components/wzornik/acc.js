import React from 'react';

const links = ['kalendarz', 'cennik', 'pytania', 'kontakt'];
const clients = [
  ['K-0107', 'Ewa Rutkowska Fotografia', 'jdg, 14 faktur'],
  ['K-0112', 'Studio Brzoza', 'jdg, 85 faktur'],
  ['K-0131', 'Dev Nova sp. z o.o.', 'spółka, 99 faktur'],
  ['K-0144', 'Drukarnia Pod Dębem', 'spółka, 96 faktur'],
];
const rows = [
  ['vat do zapłaty', '5 758,96', 'śr 25.11'],
  ['zaliczka PIT', '4 391,32', 'pt 20.11'],
  ['składki zus', '2 359,30', 'pt 20.11'],
];
const due = [
  ['ZUS', '2 359,30 zł', 'za 5 dni'],
  ['zaliczka PIT', '4 391,32 zł', 'za 5 dni'],
  ['VAT i JPK_V7', '5 758,96 zł', 'za 10 dni'],
];

export default function Acc() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Biuro Rachunkowe Gajowice</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
        <span className="mk-acc__clock">nd 15.11 14:07</span>
      </div>
      <div className="mk-acc__grid">
        <ul className="mk-acc__clients">
          {clients.map(([id, name, kind]) => (
            <li key={id} className={id === 'K-0112' ? 'is-on' : undefined}>
              <small>{id}</small>
              <b>{name}</b>
              <span>{kind}</span>
            </li>
          ))}
        </ul>
        <div className="mk-acc__sum">
          <span className="mk-acc__label">razem do zapłaty za październik 2026</span>
          <p className="mk__h">12 509,58 zł</p>
          <span className="mk-acc__ruler" aria-hidden="true">
            <i />
          </span>
          <ul className="mk-acc__rows">
            {rows.map(([label, amount, date]) => (
              <li key={label}>
                <span>{label}</span>
                <b>{amount}</b>
                <span>{date}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mk-acc__due">
          {due.map(([label, amount, left], i) => (
            <li key={label} className={i < 2 ? 'is-on' : undefined}>
              <b>{label}</b>
              <b>{amount}</b>
              <span>{left}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="mk__btn">E-mail do wyceny</span>
    </>
  );
}
