import React from 'react';
import { tie } from '../../i18n';

const links = ['Usługi', 'Cennik', 'Godziny', 'Kontakt'];
const chat = [
  ['bot', 'Jestem asystentem AI serwisu Docisk. W czym pomóc?'],
  ['user', 'Ile kosztuje wymiana opon?'],
  ['bot', 'Wymiana opon: 120 zł brutto. Umówić termin?'],
];

export default function Car() {
  return (
    <>
      <span className="mk-car__band" aria-hidden="true" />
      <div className="mk__nav">
        <span className="mk__logo">Docisk</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <p className="mk__h">{tie('Opony, olej, przegląd. Bez czekania na telefon.')}</p>
      <span className="mk__btn">Umów wymianę opon</span>
      <div className="mk-car__chat">
        {chat.map(([who, text]) => (
          <p key={text} className={`mk-car__bubble mk-car__bubble--${who}`}>
            {text}
          </p>
        ))}
      </div>
    </>
  );
}
