import React, { useEffect } from 'react';
import { Link, graphql, useStaticQuery, withPrefix } from 'gatsby';
import Hero from './hero';
import { routes, tie } from '../i18n';

const copy = {
  pl: {
    title: 'Ta strona | zmieniła adres.',
    lead: 'Oferta dla klientów jest teraz na stronie głównej.',
    link: 'Przejdź na stronę główną',
  },
  en: {
    title: 'This page | has moved.',
    lead: 'The page for clients is now the home page.',
    link: 'Go to the home page',
  },
};

export default function Moved({ lang }) {
  const t = copy[lang];
  const target = routes.home[lang];

  useEffect(() => {
    window.location.replace(withPrefix(target) + window.location.hash);
  }, [target]);

  return (
    <Hero id="moved-h" sr="Adrian Turbiński, " title={t.title} size="cli">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        {tie(t.lead)}
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={target}>
          {tie(t.link)}
        </Link>
      </div>
    </Hero>
  );
}

export function MovedHead({ lang }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  const { siteUrl } = site.siteMetadata;
  const href = siteUrl + withPrefix(routes.home[lang]);
  return (
    <>
      <html lang={lang} />
      <title>{copy[lang].title.replace(' | ', ' ')}</title>
      <meta name="robots" content="noindex" />
      <link rel="canonical" href={href} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${href}`} />
      </noscript>
    </>
  );
}
