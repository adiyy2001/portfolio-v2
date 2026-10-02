import React from 'react';
import { m, useReducedMotion, useSpring } from 'framer-motion';
import { graphql, useStaticQuery } from 'gatsby';
import { tie } from '../i18n';
import { spring } from '../motion';

const copy = {
  name: 'Adrian Turbiński',
  city: 'Wrocław',
  pl: {
    photoAlt: 'Adrian Turbiński',
    role: 'programista, freelancer',
    availName: 'Biorę zlecenia',
    availRole: 'aplikacje webowe i dostępność',
    availMeta: 'w zawodzie od 2019',
    pointer: 'to ja',
  },
  en: {
    photoAlt: 'Adrian Turbiński',
    role: 'developer, freelancer',
    availName: 'Taking on projects',
    availRole: 'web apps and accessibility',
    availMeta: 'in the trade since 2019',
    pointer: "that's me",
  },
};

function Tag({ n, tilt, offset, children }) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, spring.tilt);
  const rotateY = useSpring(0, spring.tilt);

  const lean = event => {
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

  return (
    <div
      className={offset ? 'tags__tag tags__tag--offset' : 'tags__tag'}
      style={{ '--tilt': `${tilt}deg`, '--n': n }}
      onPointerMove={lean}
      onPointerLeave={release}>
      <svg className="tags__grain" aria-hidden="true" focusable="false">
        <filter id={`tags-grain-${n}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0.3" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#tags-grain-${n})`} />
      </svg>
      <m.div className="tags__in" style={{ rotateX, rotateY }}>
        {children}
      </m.div>
    </div>
  );
}

export default function Tags({ lang }) {
  const t = copy[lang];
  const { photo } = useStaticQuery(graphql`
    query {
      photo: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "me.jpg" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 92, height: 92, quality: 90, placeholder: NONE)
        }
      }
    }
  `);
  const { images } = photo.childImageSharp.gatsbyImageData;

  return (
    <div className="tags">
      <div className="tags__stack">
        <Tag n={0} tilt={-2}>
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
              width="92"
              height="92"
              alt={t.photoAlt}
            />
          </picture>
          <div>
            <p className="tags__name">{tie(copy.name)}</p>
            <p className="tags__role">{tie(t.role)}</p>
            <p className="tags__meta">{tie(copy.city)}</p>
          </div>
        </Tag>
        <Tag n={1} tilt={1.4} offset>
          <div>
            <p className="tags__name">{tie(t.availName)}</p>
            <p className="tags__role">{tie(t.availRole)}</p>
            <p className="tags__meta">{tie(t.availMeta)}</p>
          </div>
        </Tag>
      </div>
      <div className="tags__pointer" aria-hidden="true">
        <svg viewBox="0 0 56 30">
          <path
            className="stroke tags__arrow"
            pathLength="1"
            strokeWidth="2"
            d="M54 22C40 26 22 20 8 9M7 19L6 8L17 6"
          />
        </svg>
        <p className="note">{t.pointer}</p>
      </div>
    </div>
  );
}
