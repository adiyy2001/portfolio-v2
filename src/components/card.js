import React from 'react';
import { m, useReducedMotion, useSpring } from 'framer-motion';
import { graphql, useStaticQuery } from 'gatsby';
import { tie } from '../i18n';
import { spring } from '../motion';

const copy = {
  name: 'Adrian Turbiński',
  role: 'Senior Frontend & Fullstack Engineer',
  position: 'Senior Software Engineer, PSE Innowacje',
  stackLabel: 'Stack',
  stack: 'Angular, TypeScript, RxJS, Node.js, Quarkus',
  city: 'Wrocław',
  pl: {
    cardTitle: 'Karta miar',
    cardDate: 'stan na październik 2026',
    photoAlt: 'Adrian Turbiński',
    f1: 'Stanowisko',
    f2: 'Profil',
    f2v: 'frontend i fullstack, tech lead',
    f4: 'W zawodzie',
    f4v: 'od 2019',
    f5: 'Miasto',
    f6: 'Szukam',
    f6v: 'nowej roli albo zlecenia',
  },
  en: {
    cardTitle: 'Measurements',
    cardDate: 'as of October 2026',
    photoAlt: 'Adrian Turbiński',
    f1: 'Position',
    f2: 'Profile',
    f2v: 'frontend and fullstack, tech lead',
    f4: 'Working since',
    f4v: '2019',
    f5: 'City',
    f6: 'Looking for',
    f6v: 'a new role or a contract',
  },
};

export default function Card({ lang }) {
  const t = copy[lang];
  const { photo } = useStaticQuery(graphql`
    query {
      photo: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "me.jpg" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 76, height: 76, quality: 90, placeholder: NONE)
        }
      }
    }
  `);
  const { images } = photo.childImageSharp.gatsbyImageData;
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, spring.tilt);
  const rotateY = useSpring(0, spring.tilt);

  const tilt = event => {
    if (reduce || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    rotateX.set(-ny * 7);
    rotateY.set(nx * 7);
  };

  const release = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const rows = [
    [t.f1, copy.position],
    [t.f2, t.f2v],
    [copy.stackLabel, copy.stack],
    [t.f4, t.f4v],
    [t.f5, copy.city],
    [t.f6, t.f6v],
  ];

  return (
    <div className="card" onPointerMove={tilt} onPointerLeave={release}>
      <svg className="card__grain" aria-hidden="true" focusable="false">
        <filter id="card-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0.3" />
        </filter>
        <rect width="100%" height="100%" filter="url(#card-grain)" />
      </svg>
      <m.div className="card__in" style={{ rotateX, rotateY }}>
        <div className="card__head">
          <p className="card__title">{tie(t.cardTitle)}</p>
          <p className="card__date">{tie(t.cardDate)}</p>
        </div>
        <div className="card__who">
          <picture className="photo">
            {images.sources.map(source => (
              <source
                key={source.type}
                type={source.type}
                srcSet={source.srcSet}
                sizes={source.sizes}
              />
            ))}
            <img
              src={images.fallback.src}
              srcSet={images.fallback.srcSet}
              sizes={images.fallback.sizes}
              width="76"
              height="76"
              alt={t.photoAlt}
            />
          </picture>
          <div>
            <p className="card__name">{tie(copy.name)}</p>
            <p className="card__role">{tie(copy.role)}</p>
          </div>
        </div>
        <dl>
          {rows.map(([term, value]) => (
            <div key={term}>
              <dt>{tie(term)}</dt>
              <dd>{tie(value)}</dd>
            </div>
          ))}
        </dl>
      </m.div>
    </div>
  );
}
