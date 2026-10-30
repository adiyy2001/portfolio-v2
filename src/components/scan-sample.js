import React from 'react';

const copy = {
  caption: 'Przykład wpisu z raportu',
  title: 'Obraz bez tekstu alternatywnego',
  level: 'krytyczny',
  rule: 'Kryterium 1.1.1 Treść nietekstowa (poziom A)',
  text: 'Obraz nie ma atrybutu alt, więc czytnik ekranu nie powie, co przedstawia. Dla grafiki dekoracyjnej użyj pustego alt.',
  before: 'Przed',
  after: 'Po',
  beforeCode: '<img src="zespol.jpg">',
  afterCode: '<img src="zespol.jpg" alt="Zespół firmy przy stole w biurze">',
};

export default function ScanSample() {
  return (
    <figure className="card scan-sample" style={{ '--tilt': '-1.4deg' }}>
      <figcaption className="scan-sample__cap">{copy.caption}</figcaption>
      <p className="scan-sample__title">
        {copy.title}
        <span className="scan-sample__level">{copy.level}</span>
      </p>
      <p className="scan-sample__rule">{copy.rule}</p>
      <p className="scan-sample__text">{copy.text}</p>
      <dl className="scan-sample__code">
        <div>
          <dt>{copy.before}</dt>
          <dd>
            <code>{copy.beforeCode}</code>
          </dd>
        </div>
        <div>
          <dt>{copy.after}</dt>
          <dd>
            <code>{copy.afterCode}</code>
          </dd>
        </div>
      </dl>
    </figure>
  );
}
