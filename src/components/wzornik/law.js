import React from 'react';
import { tie } from '../../i18n';

const links = ['Specjalizacje', 'Zespół', 'Wiedza', 'Kontakt'];
const areas = ['Prawo spółek', 'Umowy', 'Spory sądowe', 'Nieruchomości'];
const ring = 'KANCELARIA RADCY PRAWNEGO  WROCŁAW  ';

export default function Law() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Rozwaga</span>
        <span className="mk__links">
          {links.map(link => (
            <span key={link}>{link}</span>
          ))}
        </span>
      </div>
      <svg className="mk-law__seal" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="wz-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#b3122a" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#fff" strokeWidth="1.5" />
        <text
          className="mk-law__ring"
          fill="#fff"
          fontSize="15"
          fontWeight="600"
          letterSpacing="3.2">
          <textPath href="#wz-ring">{ring}</textPath>
        </text>
        <text
          className="mk-law__initial"
          x="100"
          y="128"
          fill="#fff"
          textAnchor="middle"
          fontSize="80"
          fontWeight="500">
          R
        </text>
      </svg>
      <ul className="mk-law__list">
        {areas.map(area => (
          <li key={area}>{area}</li>
        ))}
      </ul>
      <p className="mk__h">
        Umowa, która
        <br />
        wytrzyma spór.
      </p>
      <p className="mk__p">{tie('Kancelaria radcy prawnego dla firm. Wrocław i online.')}</p>
      <span className="mk__btn">Umów konsultację</span>
    </>
  );
}
