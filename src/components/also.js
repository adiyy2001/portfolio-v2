import React from 'react';
import { Link, withPrefix } from 'gatsby';
import Reveal from './reveal';
import { tie } from '../i18n';

const cases = [
  {
    id: 'work-also-h',
    to: '/archive/rewektor/',
    name: 'ReWektor',
    image: '/media/rewektor/strona.webp',
    alt: 'Strona rewektor.com.pl z wpisem Stolik z maszyny',
    tag: 'Prawdziwe wdrożenie, strona i panel',
    meta: 'Rodzinna firma stolarska z Wrocławia',
    desc: 'Strona z wystawą odnowionych mebli i panel, w którym właściciel sam dodaje kolejne. Te same pola w panelu i na stronie.',
    tech: 'PHP, MySQL, JavaScript, GSAP',
  },
  {
    id: 'work-psipawer-h',
    to: '/archive/psi-pawer/',
    name: 'Psi Pawer',
    image: '/media/psipawer/strona.webp',
    alt: 'Nowa strona główna Psi Pawer z nagłówkiem Pracuję z wariatami',
    tag: 'Prawdziwe wdrożenie, przeróbka strony',
    meta: 'Behawiorystka psów z Wrocławia',
    desc: 'Stara strona na Wixie wzięta do przeróbki: nowy krój, czytelna oferta i pomiary przed i po, także te gorsze.',
    tech: 'Wix Harmony, Lighthouse, schema.org',
  },
];

const arrow = (
  <svg viewBox="0 0 40 18" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
  </svg>
);

export default function Also({ go, as: Name = 'h2' }) {
  return cases.map(item => (
    <div className="work__row work__row--also" key={item.to}>
      <img
        className="work__also"
        src={withPrefix(item.image)}
        width="1200"
        height="595"
        loading="lazy"
        decoding="async"
        alt={item.alt}
      />
      <Reveal className="work__text">
        <p className="work__tag">{tie(item.tag)}</p>
        <Name className="work__name" id={item.id}>
          <Link className="work__link" to={item.to}>
            {item.name}
          </Link>
        </Name>
        <p className="work__meta">{tie(item.meta)}</p>
        <p className="work__desc">{tie(item.desc)}</p>
        <p className="work__tech">{item.tech}</p>
        <p className="work__go" aria-hidden="true">
          <span>{go}</span>
          {arrow}
        </p>
      </Reveal>
      <Link className="work__cover" to={item.to} aria-hidden="true" tabIndex={-1} />
    </div>
  ));
}
