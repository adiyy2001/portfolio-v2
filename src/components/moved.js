import React, { useEffect } from 'react';
import { Link, graphql, useStaticQuery, withPrefix } from 'gatsby';
import Hero from './hero';
import { routes, tie } from '../i18n';

const copy = {
  client: {
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
  },
  contact: {
    pl: {
      title: 'Kontakt | jest na stronie głównej.',
      lead: 'Formularz wyceny i dane kontaktowe znajdziesz na stronie głównej.',
      link: 'Przejdź do formularza',
    },
    en: {
      title: 'Contact | is on the home page.',
      lead: 'The quote form and contact details are on the home page.',
      link: 'Go to the form',
    },
  },
};

export default function Moved({ lang, kind = 'client', hash = '' }) {
  const t = copy[kind][lang];
  const target = routes.home[lang];

  useEffect(() => {
    window.location.replace(withPrefix(target) + (window.location.hash || hash));
  }, [target, hash]);

  return (
    <Hero id="moved-h" sr="Adrian Turbiński, " title={t.title} size="cli">
      <p className="lead" data-rise style={{ '--r': 0 }}>
        {tie(t.lead)}
      </p>
      <div className="cta" data-rise style={{ '--r': 1 }}>
        <Link className="btn" to={target + hash}>
          {tie(t.link)}
        </Link>
      </div>
    </Hero>
  );
}

export function MovedHead({ lang, kind = 'client', hash = '' }) {
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
      <title>{copy[kind][lang].title.replace(' | ', ' ')}</title>
      <meta name="robots" content="noindex" />
      <link rel="canonical" href={href} />
      {/* Gatsby Head zapisuje dzieci noscript jako tekst, wiec meta refresh stoi wprost (31.10.2026).
          1 s zwloki: z JS wczesniej przekierowuje location.replace i zachowuje hash uzytkownika. */}
      <meta httpEquiv="refresh" content={`1; url=${href}${hash}`} />
    </>
  );
}
