import React from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { routes } from '../i18n';

const locales = { pl: 'pl_PL', en: 'en_US' };

const pageTypes = { rec: 'ProfilePage', work: 'CollectionPage', blog: 'CollectionPage' };

const graph = ({ url, lang, view, title, description, canonical, image, post }) => {
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
    primaryImageOfPage: image,
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
  if (post) {
    page['@type'] = 'WebPage';
    nodes.push({
      '@type': 'BlogPosting',
      '@id': `${url(canonical)}#post`,
      headline: post.headline,
      description,
      url: url(canonical),
      image,
      datePublished: post.published,
      dateModified: post.modified ?? post.published,
      inLanguage: lang,
      keywords: post.tags?.join(', '),
      author: { '@id': person['@id'] },
      publisher: { '@id': person['@id'] },
      mainEntityOfPage: { '@id': page['@id'] },
      isPartOf: { '@id': url('/blog/#page') },
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
};

export default function Seo({ lang, view, path, title, description, noindex, post }) {
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
  const blog = view === 'blog';
  const shared = Boolean(pair || blog);
  const canonical = pair ? pair[lang] : path;
  const other = lang === 'pl' ? 'en' : 'pl';
  const image = post?.image
    ? site.siteMetadata.siteUrl + post.image
    : shared && url(`/og/${pair ? view : 'home'}-${lang}.jpg`);
  const shareTitle = post?.headline ?? title;
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
      {blog && (
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Adrian Turbiński, blog"
          href={url('/blog/rss.xml')}
        />
      )}
      {shared && <meta property="og:type" content={post ? 'article' : 'website'} />}
      {shared && <meta property="og:site_name" content="Adrian Turbiński" />}
      {shared && <meta property="og:title" content={shareTitle} />}
      {shared && description && <meta property="og:description" content={description} />}
      {shared && <meta property="og:url" content={url(canonical)} />}
      {shared && <meta property="og:locale" content={locales[lang]} />}
      {pair && <meta property="og:locale:alternate" content={locales[other]} />}
      {shared && <meta property="og:image" content={image} />}
      {shared && <meta property="og:image:width" content="1200" />}
      {shared && <meta property="og:image:height" content="630" />}
      {shared && <meta property="og:image:alt" content={shareTitle} />}
      {post && <meta property="article:published_time" content={post.published} />}
      {post?.modified && <meta property="article:modified_time" content={post.modified} />}
      {post?.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      {shared && <meta name="twitter:card" content="summary_large_image" />}
      {shared && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              graph({ url, lang, view, title, description, canonical, image, post }),
            ).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </>
  );
}
