import React from 'react';
import { withPrefix } from 'gatsby';
import { tie } from '../../i18n';

const links = ['Cennik', 'Wizyta', 'Kontakt'];
const shades = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Den() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">
          <svg className="mk-den__mark" viewBox="0 0 20 22" aria-hidden="true">
            <path d="M4 2C1 2 1 7 2 10C3 13 4 20 6 20C8 20 8 13 10 13C12 13 12 20 14 20C16 20 17 13 18 10C19 7 19 2 16 2C13 2 12 4 10 4C8 4 7 2 4 2Z" />
          </svg>
          Emalia
        </span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
        <span className="mk-den__pill">Rejestracja</span>
      </div>
      <span className="mk-den__kicker">Gabinet stomatologiczny, Krzyki</span>
      <p className="mk__h">
        Zęby, o których możesz <mark>zapomnieć.</mark>
      </p>
      <div className="mk-den__arc" aria-hidden="true">
        <span className="mk-den__word">Emalia</span>
      </div>
      <img
        className="mk-den__tooth"
        src={withPrefix('/media/wzornik/emalia-tooth.webp')}
        alt=""
        width="420"
        height="573"
        loading="lazy"
        decoding="async"
      />
      <p className="mk__p">
        {tie('Leczymy bez pośpiechu. Przed każdym zabiegiem mówimy, co zrobimy i ile to kosztuje.')}
      </p>
      <span className="mk__btn">Umów wizytę</span>
      <ul className="mk-den__shades">
        {shades.map(shade => (
          <li key={shade} className={shade === 'A1' ? 'is-on' : undefined}>
            {shade}
          </li>
        ))}
      </ul>
    </>
  );
}
