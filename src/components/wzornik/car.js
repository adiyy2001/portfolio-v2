import React from 'react';
import { tie } from '../../i18n';

const links = ['Cennik', 'Klucz', 'Proces', 'Kontakt'];
const hours = ['pn do pt 8:00 do 17:00', 'sob 8:00 do 12:00', 'ul. Szybowcowa 27'];

export default function Car() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Warsztat Szybowcowa</span>
      </div>
      <div className="mk-car__tag">
        <small>Koło, moment dokręcenia</small>
        <b>110</b>
      </div>
      <p className="mk__h">Nm</p>
      <p className="mk__p">
        {tie('Każdą śrubę dokręcamy kluczem dynamometrycznym, a wartość zapisujemy w karcie auta.')}
      </p>
      <svg className="mk-car__wrench" viewBox="0 0 200 40" aria-hidden="true">
        <path d="M18 8a12 12 0 1 0 0 24l4-6h-6l-4-6 4-6h6zM30 16H182a4 4 0 0 1 0 8H30z" />
      </svg>
      <div className="mk-car__price">
        <span>
          Przegląd od <b>189 zł</b>
        </span>
        <strong>71 555 01 96</strong>
        <ul>
          {hours.map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <span className="mk__btn">Umów przegląd</span>
      </div>
      <span className="mk__links">
        {links.map(link => (
          <span key={link}>{link}</span>
        ))}
      </span>
    </>
  );
}
