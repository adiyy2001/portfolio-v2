import React from 'react';
import { tie } from '../../i18n';

const links = ['Karta', 'Wydarzenia', 'O nas'];
const menu = [
  ['Pierogi z kaszanką i jabłkiem', '34 zł'],
  ['Żurek na zakwasie', '22 zł'],
  ['Kopytka, masło szałwiowe', '29 zł'],
];

export default function Bis() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Kminek</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
          <span className="mk-bis__lang">
            <b>PL</b>
            <span>EN</span>
          </span>
        </span>
      </div>
      <div className="mk-bis__menu">
        <b>Dziś w karcie</b>
        <ul>
          {menu.map(([dish, price]) => (
            <li key={dish}>
              {tie(dish)}
              <em>{price}</em>
            </li>
          ))}
        </ul>
      </div>
      <p className="mk__h">
        Kuchnia polska,
        <br />
        podana od nowa.
      </p>
      <p className="mk__p">{tie('Bistro na Nadodrzu. Od wtorku do niedzieli, od 12 do 22.')}</p>
      <span className="mk__btn">Zarezerwuj stolik</span>
    </>
  );
}
