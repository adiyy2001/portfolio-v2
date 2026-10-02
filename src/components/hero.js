import React from 'react';
import Skew from './skew';
import Split from './split';

export default function Hero({ id, sr, title, size, children }) {
  return (
    <section className="hero" aria-labelledby={id}>
      <h1 id={id} tabIndex={-1}>
        {sr && <span className="sr">{sr}</span>}
        <Skew>
          <Split className={`title title--${size}`} text={title} />
        </Skew>
      </h1>
      <div className="ruler" aria-hidden="true" />
      <div className="hero__body">
        <div className="hero__text">{children}</div>
      </div>
    </section>
  );
}
