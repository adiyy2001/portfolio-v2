import React from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { blogPath, routes } from '../i18n';

const locales = { pl: 'pl_PL', en: 'en_US' };

const pageTypes = { rec: 'ProfilePage', work: 'CollectionPage', blog: 'CollectionPage' };

const services = {
  pl: [
    [
      'Aplikacje webowe',
      'Całe aplikacje webowe dla firm: front, back, wdrożenie i utrzymanie, rozliczenie na fakturę B2B.',
    ],
    [
      'Strony internetowe',
      'Strony internetowe dla firm z Wrocławia i całej Polski, szybkie i dostępne z klawiatury.',
    ],
    [
      'Dostępność WCAG',
      'Audyt i poprawki dostępności według WCAG 2.1 AA: klawiatura, czytniki ekranu, kontrast, fokus i formularze.',
    ],
    [
      'Programowanie Angular',
      'Aplikacje w Angularze i TypeScripcie, z RxJS i NgRx, od architektury po wdrożenie.',
    ],
  ],
  en: [
    [
      'Web applications',
      'Complete web applications for companies: front end, back end, deployment and maintenance, invoiced B2B.',
    ],
    ['Websites', 'Websites for companies, fast and usable from the keyboard.'],
    [
      'WCAG accessibility',
      'Accessibility audits and fixes against WCAG 2.1 AA: keyboard, screen readers, contrast, focus and forms.',
    ],
    [
      'Angular development',
      'Angular and TypeScript applications with RxJS and NgRx, from architecture to deployment.',
    ],
  ],
};

const crumbLabels = {
  pl: {
    home: 'Strona główna',
    work: 'Archiwum',
    blog: 'Blog',
    rec: 'Dla rekrutera',
    cli: 'Dla klienta',
  },
  en: {
    home: 'Home',
    work: 'Archive',
    blog: 'Blog',
    rec: 'For recruiters',
    cli: 'For clients',
  },
};

const crumbTrail = ({ lang, view, title, canonical, post, code }) => {
  const labels = crumbLabels[lang];
  const home = [labels.home, routes.home[lang]];
  if (post) return [home, [labels.blog, blogPath], [post.headline, canonical]];
  if (view === 'blog') return [home, [labels.blog, canonical]];
  if (code || view === 'case') {
    return [home, [labels.work, routes.work[lang]], [code?.name ?? 'TailorCloth', canonical]];
  }
  if (view === 'work') return [home, [labels.work, canonical]];
  if (view !== 'home' && canonical) return [home, [labels[view] ?? title, canonical]];
  return null;
};

const graph = ({ url, lang, view, title, description, canonical, image, post, code }) => {
  const person = {
    '@type': 'Person',
    '@id': url('/#adrian'),
    name: 'Adrian Turbiński',
    url: url('/'),
    email: 'mailto:adrian.turbinski@gmail.com',
    jobTitle:
      lang === 'pl' ? 'Programista front-end i full-stack' : 'Front-end and full-stack developer',
    address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
    knowsAbout: [
      'Angular',
      'TypeScript',
      'RxJS',
      'NgRx',
      'Node.js',
      'Frontend architecture',
      'Web accessibility',
      'WCAG',
    ],
    workLocation: { '@type': 'City', name: 'Wrocław' },
    sameAs: [
      'https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6',
      'https://github.com/adiyy2001',
      'https://dev.to/adrian_turbiski_f62044ad',
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
  if (view === 'home' || view === 'cli') {
    nodes.push({
      '@type': 'ProfessionalService',
      '@id': url('/#service'),
      name: 'Adrian Turbiński',
      url: url('/'),
      logo: url('/apple-touch-icon.png'),
      image: url(`/og/cli-${lang}.jpg`),
      email: 'mailto:adrian.turbinski@gmail.com',
      founder: { '@id': person['@id'] },
      address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
      areaServed: [
        { '@type': 'City', name: 'Wrocław' },
        { '@type': 'AdministrativeArea', name: 'Dolnośląskie' },
        { '@type': 'Country', name: 'Poland' },
      ],
      knowsLanguage: ['pl', 'en'],
      serviceType:
        lang === 'pl'
          ? ['Aplikacje webowe', 'Strony internetowe', 'Dostępność WCAG', 'Programowanie Angular']
          : ['Web applications', 'Websites', 'WCAG accessibility', 'Angular development'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'pl' ? 'Usługi' : 'Services',
        itemListElement: services[lang].map(([name, text]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description: text },
        })),
      },
    });
  }
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
  if (code) {
    const work = `${url(canonical)}#code`;
    page.mainEntity = { '@id': work };
    nodes.push({
      '@type': 'SoftwareSourceCode',
      '@id': work,
      name: code.name,
      description,
      inLanguage: lang,
      url: url(canonical),
      codeRepository: code.repo,
      programmingLanguage: code.languages,
      license: 'https://opensource.org/licenses/MIT',
      author: { '@id': person['@id'] },
      mainEntityOfPage: { '@id': page['@id'] },
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
  const trail = crumbTrail({ lang, view, title, canonical, post, code });
  if (trail) {
    page.breadcrumb = { '@id': `${url(canonical)}#breadcrumb` };
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': page.breadcrumb['@id'],
      itemListElement: trail.map(([name, to], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: url(to),
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
};

export default function Seo({ lang, view, path, title, description, noindex, post, code }) {
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
              graph({ url, lang, view, title, description, canonical, image, post, code }),
            ).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </>
  );
}
