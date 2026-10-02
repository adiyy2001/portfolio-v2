import React, { useContext } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { m } from 'framer-motion';
import { Swap, glideTransition } from './layout';
import { tie } from '../i18n';

const copy = {
  layoutId: 'tailorcloth-shot',
  width: 880,
  height: 595,
  pl: {
    alt: 'Formularz zamówienia koszuli na miarę w platformie TailorCloth: tkanina główna, tkanina kontrastowa i miejsce kontrastu na kołnierzu',
    caption: 'Formularz zamówienia na miarę, zrzut z tailorcloth.com',
  },
  en: {
    alt: 'Made-to-measure shirt order form in the TailorCloth platform: main fabric, contrast fabric and where the contrast goes on the collar',
    caption: 'The made-to-measure order form, screenshot from tailorcloth.com',
  },
};

export default function Shot({ lang, sizes }) {
  const t = copy[lang];
  const { order } = useStaticQuery(graphql`
    query {
      order: file(
        sourceInstanceName: { eq: "images" }
        relativePath: { eq: "tailorcloth-order.webp" }
      ) {
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, width: 880, quality: 82, placeholder: NONE)
        }
      }
    }
  `);
  const { images } = order.childImageSharp.gatsbyImageData;
  const { land } = useContext(Swap);

  return (
    <figure className="shot">
      <m.div
        className="shot__frame"
        layoutId={copy.layoutId}
        data-shared
        transition={{ layout: glideTransition }}
        onLayoutAnimationComplete={land}>
        <picture>
          {images.sources.map(source => (
            <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
          ))}
          <img
            src={images.fallback.src}
            srcSet={images.fallback.srcSet}
            sizes={sizes}
            width={copy.width}
            height={copy.height}
            decoding="async"
            alt={t.alt}
          />
        </picture>
      </m.div>
      <figcaption className="shot__cap">{tie(t.caption)}</figcaption>
    </figure>
  );
}
