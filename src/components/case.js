import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { m, useReducedMotion, useSpring } from 'framer-motion';
import Reveal from './reveal';
import Split from './split';
import { routes, tie } from '../i18n';
import { spring } from '../motion';

const copy = {
  id: 'tailorcloth',
  href: 'https://tailorcloth.com/',
  tech: 'Odoo, Python, JavaScript, PostgreSQL',
  pl: {
    title: 'Na miarę, dosłownie.',
    lead: 'Aplikację na miarę zrobiliśmy już dla firmy krawieckiej.',
    alt: 'Formularz zamówienia koszuli na miarę w platformie TailorCloth: tkanina główna, tkanina kontrastowa i miejsce kontrastu na kołnierzu',
    caption: 'Formularz zamówienia na miarę, zrzut z tailorcloth.com',
    kind: 'Prawdziwe wdrożenie',
    meta: 'Firma krawiecka z Krakowa',
    desc: 'Strona na Odoo i własne moduły do zarządzania produktami. Bezpieczna platforma dla zaufanych użytkowników, faktury krajowe i zagraniczne, zautomatyzowane procesy magazynowe. Do tego zamawianie bez cen, pod indywidualne oferty.',
    team: 'Zrobione z zespołem, który prowadziłem w Media Hunters. Dziś stronę utrzymuje inna agencja.',
    more: 'Więcej o projekcie',
  },
  en: {
    title: 'Made to measure, literally.',
    lead: "We've already built a made-to-measure app for a tailoring company.",
    alt: 'Made-to-measure shirt order form in the TailorCloth platform: main fabric, contrast fabric and where the contrast goes on the collar',
    caption: 'The made-to-measure order form, screenshot from tailorcloth.com',
    kind: 'A real project',
    meta: 'A tailoring company from Kraków',
    desc: 'A website on Odoo with custom product management modules. A secure platform for trusted users, domestic and international invoicing, automated warehouse processes. Plus ordering without prices, for individual offers.',
    team: 'Built with the team I led at Media Hunters. Another agency maintains the site today.',
    more: 'More about the project',
  },
};

export default function Case({ lang }) {
  const t = copy[lang];
  const { shot } = useStaticQuery(graphql`
    query {
      shot: file(
        sourceInstanceName: { eq: "images" }
        relativePath: { eq: "tailorcloth-order.webp" }
      ) {
        childImageSharp {
          gatsbyImageData(
            layout: CONSTRAINED
            width: 560
            outputPixelDensities: [0.5, 0.75, 1, 1.5]
            sizes: "(min-width: 1230px) 560px, (min-width: 900px) 45.6vw, 91.2vw"
            formats: [WEBP, AVIF]
            quality: 80
            placeholder: NONE
          )
        }
      }
    }
  `);
  const { images, width, height } = shot.childImageSharp.gatsbyImageData;
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

  return (
    <section className="case" id={copy.id} aria-labelledby="case-h">
      <div className="sec-head">
        <h2 className="h2" id="case-h">
          <Split text={t.title} onView />
        </h2>
        <p className="sec-head__side">{tie(t.lead)}</p>
      </div>
      <article className="case__body">
        <Reveal as="figure" className="case__swatch" onPointerMove={tilt} onPointerLeave={release}>
          <m.div className="case__in" style={{ rotateX, rotateY }}>
            <picture>
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
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                alt={t.alt}
              />
            </picture>
          </m.div>
          <figcaption>{tie(t.caption)}</figcaption>
        </Reveal>
        <Reveal className="case__text">
          <p className="tag">{tie(t.kind)}</p>
          <h3 className="case__name">
            <a href={copy.href} target="_blank" rel="noopener noreferrer">
              TailorCloth
            </a>
          </h3>
          <p className="case__meta">{tie(t.meta)}</p>
          <p className="case__desc">{tie(t.desc)}</p>
          <p className="case__team">{tie(t.team)}</p>
          <p className="case__tech">{copy.tech}</p>
          <div className="case__links">
            <Link className="link" to={routes.case[lang]}>
              {tie(t.more)}
            </Link>
            <a className="link" href={copy.href} target="_blank" rel="noopener noreferrer">
              tailorcloth.com
            </a>
          </div>
        </Reveal>
      </article>
    </section>
  );
}
