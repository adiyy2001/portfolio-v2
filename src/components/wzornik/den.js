import React from 'react';
import { tie } from '../../i18n';

const links = ['Leczenie', 'Implanty', 'Cennik', 'Zespół'];
const shades = [
  ['A1', '#fbf8f1'],
  ['A2', '#f5eddd'],
  ['A3', '#eedfc4'],
  ['B1', '#f6f2e8'],
  ['B2', '#efe5cf'],
  ['C1', '#e8e0cf'],
  ['C2', '#ddd2bb'],
  ['D2', '#e7dfd1'],
];

export default function Den() {
  return (
    <>
      <div className="mk-den__panel">
        <p className="mk-den__cap">Kolor dobieramy do twoich zębów, nie do katalogu.</p>
        <ul className="mk-den__guide">
          {shades.map(([name, tone]) => (
            <li key={name} className={name === 'B1' ? 'on' : undefined}>
              <i style={{ '--t': tone }} />
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mk__nav">
        <span className="mk__logo">Szkliwo</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <p className="mk__h">
        Uśmiech
        <br />
        bez pośpiechu.
      </p>
      <p className="mk__p">
        {tie('Leczenie, implanty i ortodoncja. Plan leczenia z ceną, zanim zaczniemy.')}
      </p>
      <span className="mk__btn">Umów wizytę</span>
    </>
  );
}
