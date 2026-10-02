import React from 'react';
import { tie } from '../../i18n';

const links = ['Usługi', 'Cennik', 'KSeF', 'Kontakt'];
const month = [
  ['Faktury z KSeF', 'pobrane'],
  ['VAT', 'policzony'],
  ['ZUS', 'wysłany'],
];

export default function Acc() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">
          <i className="mk-acc__mark" />
          Rubryka
        </span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <div className="mk-acc__card">
        <b>Twój listopad</b>
        <ul>
          {month.map(([label, state]) => (
            <li key={label}>
              {label}
              <span>{state}</span>
            </li>
          ))}
          <li>
            JPK
            <span className="due">do 25.11</span>
          </li>
        </ul>
      </div>
      <p className="mk__h">
        Księgowość
        <br />
        bez zgadywania.
      </p>
      <p className="mk__p">
        {tie('Pełna księgowość, kadry i KSeF dla małych firm. Stała cena za miesiąc.')}
      </p>
      <span className="mk__btn">Wyceń księgowość</span>
    </>
  );
}
