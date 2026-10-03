import React from 'react';
import { tie } from '../../i18n';

const links = ['Start', 'Pokoje', 'Rezerwacja', 'Pakiety', 'Okolica'];
const board = [
  ['Podwórzowy', [105, 106, 205, 206], [106]],
  ['Klasyczny', [103, 104, 204, 304], [104, 204, 304]],
  ['Z widokiem', [101, 102, 201, 202], [202]],
];

export default function Stay() {
  return (
    <>
      <div className="mk-stay__rail">
        <span className="mk__logo">Przęsło</span>
        <ul>
          {links.map((link, i) => (
            <li key={link} className={i === 0 ? 'is-on' : undefined}>
              {link}
            </li>
          ))}
        </ul>
      </div>
      <p className="mk__h">
        Dwadzieścia cztery
        <br />
        klucze nad Odrą.
      </p>
      <p className="mk__p">
        {tie('Hotel w odnowionej kamienicy przy Grodzkiej. Rezerwujesz u nas, bez portalu.')}
      </p>
      <span className="mk__btn">Zarezerwuj pobyt</span>
      <div className="mk-stay__board">
        <b>Tablica recepcji</b>
        {board.map(([room, keys, free]) => (
          <div key={room} className="mk-stay__row">
            <span>{room}</span>
            <span className="mk-stay__hooks">
              {keys.map(key => (
                <i key={key} className={free.includes(key) ? 'is-free' : undefined}>
                  {key}
                </i>
              ))}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
