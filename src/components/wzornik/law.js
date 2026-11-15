import React from 'react';
import { tie } from '../../i18n';

const contents = [
  ['§ 1', 'Rodzina, spółki, spadki, umowy'],
  ['§ 2', 'Zgłoszenie, dokumenty, opinia'],
  ['§ 3', 'Co zabrać na spotkanie'],
  ['§ 4', 'Anna Wierzbicka i Marek Zawada'],
];

export default function Law() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Sygnet</span>
        <span className="mk-law__since">
          Kancelaria prawna
          <br />
          od 2009 roku
        </span>
      </div>
      <p className="mk__h">{tie('Prowadzimy sprawy rodzinne, spadkowe, spółek i umów.')}</p>
      <div className="mk-law__toc">
        <b>Spis treści</b>
        <ol>
          {contents.map(([mark, title]) => (
            <li key={mark}>
              <span>{mark}</span>
              {title}
            </li>
          ))}
        </ol>
      </div>
      <div className="mk-law__band">
        <span className="mk__btn">Umów rozmowę</span>
        <span className="mk-law__phone">+48 71 555 01 58</span>
        <span className="mk-law__first">Pierwsza rozmowa: 20 minut, 0 zł.</span>
      </div>
    </>
  );
}
