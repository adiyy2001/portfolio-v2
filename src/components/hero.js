import React from 'react';
import Skew from './skew';
import Split from './split';

export default function Hero({
  id,
  sr,
  kicker,
  title,
  size,
  titleClass,
  contact,
  aside,
  children,
}) {
  return (
    <section className={`hero hero--${size}`} aria-labelledby={id}>
      {kicker && <p className="hero__kicker">{kicker}</p>}
      <h1 id={id} tabIndex={-1}>
        {sr && <span className="sr">{sr}</span>}
        <Skew>
          <Split
            className={titleClass ? `title title--${size} ${titleClass}` : `title title--${size}`}
            text={title}
          />
        </Skew>
      </h1>
      {contact && <p className="print-only">{contact}</p>}
      <div className="ruler" aria-hidden="true" />
      <div className="hero__body">
        <div className="hero__text">{children}</div>
        {aside}
      </div>
    </section>
  );
}
