import React from 'react';
import { withPrefix } from 'gatsby';

export default function Psy() {
  return (
    <>
      <div className="mk__nav">
        <span className="mk__logo">Otoczak</span>
      </div>
      <img
        className="mk-psy__stone"
        src={withPrefix('/media/wzornik/otoczak-stone.webp')}
        alt=""
        width="480"
        height="605"
        loading="lazy"
        decoding="async"
      />
      <div className="mk-psy__ask">
        <i className="mk-psy__dot" />
        <p className="mk__h">Od czego chcesz zacząć?</p>
        <span className="mk__btn">Umów pierwsze spotkanie</span>
        <span className="mk-psy__phone">+48 71 555 01 72</span>
      </div>
      <span className="mk-psy__where">Psychoterapia na Biskupinie</span>
    </>
  );
}
