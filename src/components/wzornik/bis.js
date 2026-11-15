import React from 'react';
import { withPrefix } from 'gatsby';
import { tie } from '../../i18n';

const links = ['Karta', 'Tydzień'];

export default function Bis() {
  return (
    <>
      <div className="mk-bis__photo">
        <img
          src={withPrefix('/media/wzornik/szczypta-dish.webp')}
          alt=""
          width="600"
          height="727"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mk__nav">
        <span className="mk__logo">Szczypta</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
          <b className="mk-bis__table">Stolik</b>
        </span>
      </div>
      <span className="mk-bis__kicker">Z karty kolacji, od 17:00</span>
      <p className="mk__h">{tie('Polędwiczki w sosie pieprzowym')}</p>
      <p className="mk-bis__note">Pieprz mielony przy stole.</p>
      <p className="mk-bis__price">
        <span>Kolacja</span>
        <i />
        <b>42 zł</b>
      </p>
      <span className="mk__btn">Zarezerwuj stolik</span>
      <div className="mk-bis__card">
        <span>Danie dnia, w poniedziałek</span>
        <b>Pierogi ruskie, sześć sztuk</b>
        <em>{tie('W zestawie żurek z białą kiełbasą.')}</em>
        <span className="mk-bis__set">
          <span>Drugie danie 21 zł</span>
          <span>Zestaw 32 zł</span>
        </span>
      </div>
    </>
  );
}
