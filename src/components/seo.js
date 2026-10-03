import React from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { routes } from '../i18n';

const locales = { pl: 'pl_PL', en: 'en_US' };

const pageTypes = { rec: 'ProfilePage', work: 'CollectionPage' };

const graph = ({ url, lang, view, title, description, canonical }) => {
  const person = {
    '@type': 'Person',
    '@id': url('/#adrian'),
    name: 'Adrian Turbiński',
    url: url('/'),
    email: 'mailto:adrian.turbinski@gmail.com',
    jobTitle:
      lang === 'pl' ? 'Programista front-end i full-stack' : 'Front-end and full-stack developer',
    address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
    knowsAbout: ['Angular', 'TypeScript', 'RxJS', 'Node.js'],
    sameAs: [
      'https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6',
      'https://github.com/adiyy2001',
    ],
  };
  const site = {
    '@type': 'WebSite',
    '@id': url('/#site'),
    url: url('/'),
    name: 'Adrian Turbiński',
    inLanguage: ['pl', 'en'],
    publisher: { '@id': person['@id'] },
  };
  const page = {
    '@type': pageTypes[view] ?? 'WebPage',
    '@id': `${url(canonical)}#page`,
    url: url(canonical),
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': site['@id'] },
    about: { '@id': person['@id'] },
    primaryImageOfPage: url(`/og/${view}-${lang}.jpg`),
  };
  if (view === 'rec') page.mainEntity = { '@id': person['@id'] };
  const nodes = [person, site, page];
  if (view === 'case') {
    nodes.push({
      '@type': 'CreativeWork',
      '@id': `${url(canonical)}#work`,
      name: 'TailorCloth',
      description,
      inLanguage: lang,
      url: url(canonical),
      contributor: { '@id': person['@id'] },
      about: { '@type': 'Organization', name: 'TailorCloth', url: 'https://tailorcloth.com/' },
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
};

export default function Seo({ lang, view, path, title, description, noindex }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  const url = to => site.siteMetadata.siteUrl + withPrefix(to);
  const pair = routes[view];
  const canonical = pair ? pair[lang] : path;
  const other = lang === 'pl' ? 'en' : 'pl';
  const image = pair && url(`/og/${view}-${lang}.jpg`);
  return (
    <>
      <html lang={lang} />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
      <meta name="theme-color" content="#5a1424" />
      <link rel="icon" href={withPrefix('/favicon.svg')} type="image/svg+xml" />
      <link rel="apple-touch-icon" href={withPrefix('/apple-touch-icon.png')} />
      {canonical && <link rel="canonical" href={url(canonical)} />}
      {pair && <link rel="alternate" hrefLang="pl" href={url(pair.pl)} />}
      {pair && <link rel="alternate" hrefLang="en" href={url(pair.en)} />}
      {pair && <link rel="alternate" hrefLang="x-default" href={url(pair.pl)} />}
      {pair && <meta property="og:type" content="website" />}
      {pair && <meta property="og:site_name" content="Adrian Turbiński" />}
      {pair && <meta property="og:title" content={title} />}
      {pair && description && <meta property="og:description" content={description} />}
      {pair && <meta property="og:url" content={url(canonical)} />}
      {pair && <meta property="og:locale" content={locales[lang]} />}
      {pair && <meta property="og:locale:alternate" content={locales[other]} />}
      {pair && <meta property="og:image" content={image} />}
      {pair && <meta property="og:image:width" content="1200" />}
      {pair && <meta property="og:image:height" content="630" />}
      {pair && <meta property="og:image:alt" content={title} />}
      {pair && <meta name="twitter:card" content="summary_large_image" />}
      {pair && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              graph({ url, lang, view, title, description, canonical }),
            ).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </>
  );
}
