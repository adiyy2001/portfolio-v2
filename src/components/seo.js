import React from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { routes } from '../i18n';

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
    </>
  );
}
