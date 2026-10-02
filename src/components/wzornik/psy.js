import React from 'react';
import { tie } from '../../i18n';

const links = ['O mnie', 'Jak pracuję', 'Cennik', 'Kontakt'];
const rings = [
  [40, 17, 1],
  [80, 34, 0.85],
  [124, 52, 0.7],
  [170, 71, 0.55],
  [218, 92, 0.4],
  [268, 113, 0.25],
];

export default function Psy() {
  return (
    <>
      <svg
        className="mk-psy__rings"
        viewBox="0 0 400 300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true">
        {rings.map(([rx, ry, opacity]) => (
          <ellipse key={rx} cx="200" cy="200" rx={rx} ry={ry} opacity={opacity} />
        ))}
      </svg>
      <div className="mk__nav">
        <span className="mk__logo">Przystań</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <p className="mk-psy__note">
        {tie('Pierwsza konsultacja trwa 50 minut. Nie musisz wiedzieć, od czego zacząć.')}
      </p>
      <p className="mk__h">
        Możesz zacząć
        <br />
        od jednej rozmowy.
      </p>
      <p className="mk__p">
        {tie('Psychoterapia indywidualna dla dorosłych. Gabinet we Wrocławiu i spotkania online.')}
      </p>
      <span className="mk__btn">Napisz wiadomość</span>
    </>
  );
}
