import React from 'react';
import { graphql, useStaticQuery, withPrefix } from 'gatsby';
import { blogPath, guidePath, routes } from '../i18n';
import { phone, serviceKeys, services, servicesIndex } from '../services';

const locales = { pl: 'pl_PL', en: 'en_US' };

const pageTypes = {
  rec: 'ProfilePage',
  work: 'CollectionPage',
  blog: 'CollectionPage',
  guide: 'CollectionPage',
};

const crumbLabels = {
  pl: {
    home: 'Strona główna',
    work: 'Archiwum',
    blog: 'Blog',
    guide: 'Poradnik',
    rec: 'Dla rekrutera',
    cli: 'Dla klienta',
    services: 'Usługi',
  },
  en: {
    home: 'Home',
    work: 'Archive',
    blog: 'Blog',
    guide: 'Guide',
    rec: 'For recruiters',
    cli: 'For clients',
    services: 'Services',
  },
};

const crumbTrail = ({ lang, view, title, canonical, post, code }) => {
  const labels = crumbLabels[lang];
  const home = [labels.home, routes.home[lang]];
  const section = view === 'guide' ? [labels.guide, guidePath] : [labels.blog, blogPath];
  if (post) return [home, section, [post.headline, canonical]];
  if (view === 'blog' || view === 'guide') return [home, [section[0], canonical]];
  if (code || view === 'case') {
    return [home, [labels.work, routes.work[lang]], [code?.name ?? 'TailorCloth', canonical]];
  }
  if (view === 'work') return [home, [labels.work, canonical]];
  if (view?.startsWith('svc-')) {
    return [home, [labels.services, routes.services[lang]], [title.split(',')[0], canonical]];
  }
  if (view !== 'home' && canonical) return [home, [labels[view] ?? title, canonical]];
  return null;
};

const amount = price => Number(price.replace(/\D/g, ''));

const isOffer = view => ['home', 'cli', 'services'].includes(view) || view?.startsWith('svc-');

const ogView = view =>
  !view ? 'home' : (isOffer(view) && view !== 'home') || view === 'guide' ? 'cli' : view;

const graph = ({ url, lang, view, title, description, canonical, image, post, code, service }) => {
  const person = {
    '@type': 'Person',
    '@id': url('/#adrian'),
    name: 'Adrian Turbiński',
    url: url('/'),
    email: 'mailto:adrian.turbinski@gmail.com',
    telephone: phone.intl,
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
  if (isOffer(view)) {
    nodes.push({
      '@type': 'ProfessionalService',
      '@id': url('/#service'),
      name: 'Adrian Turbiński',
      url: url('/'),
      logo: url('/apple-touch-icon.png'),
      image: url(`/og/cli-${lang}.jpg`),
      email: 'mailto:adrian.turbinski@gmail.com',
      telephone: phone.intl,
      priceRange: lang === 'pl' ? 'od 300 zł do 80 000 zł' : 'PLN 300 to PLN 80,000',
      founder: { '@id': person['@id'] },
      address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
      areaServed: [
        { '@type': 'City', name: 'Wrocław' },
        { '@type': 'AdministrativeArea', name: 'Dolnośląskie' },
        { '@type': 'Country', name: 'Poland' },
      ],
      knowsLanguage: ['pl', 'en'],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      sameAs: [
        'https://maps.google.com/?cid=14709967096891217800',
        'https://www.facebook.com/profile.php?id=61596114922198',
        'https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6',
      ],
      serviceType: serviceKeys.map(key => services[key][lang].name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: servicesIndex[lang].label,
        url: url(routes.services[lang]),
        itemListElement: serviceKeys.map(key => ({
          '@type': 'Offer',
          url: url(routes[`svc-${key}`][lang]),
          priceCurrency: 'PLN',
          price: amount(services[key][lang].price),
          itemOffered: {
            '@type': 'Service',
            '@id': url(`${routes[`svc-${key}`][lang]}#service`),
            name: services[key][lang].name,
            description: services[key][lang].short,
          },
        })),
      },
    });
  }
  if (service) {
    page.mainEntity = { '@id': `${url(canonical)}#service` };
    nodes.push(
      {
        '@type': 'Service',
        '@id': `${url(canonical)}#service`,
        name: service.name,
        description,
        url: url(canonical),
        serviceType: service.name,
        provider: { '@id': url('/#service') },
        areaServed: [
          { '@type': 'City', name: 'Wrocław' },
          { '@type': 'AdministrativeArea', name: 'Dolnośląskie' },
          { '@type': 'Country', name: 'Poland' },
        ],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PLN',
          price: amount(service.price),
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'PLN',
            minPrice: amount(service.price),
            valueAddedTaxIncluded: false,
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url(canonical)}#faq`,
        isPartOf: { '@id': page['@id'] },
        mainEntity: service.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    );
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
      isPartOf: { '@id': url(`${view === 'guide' ? guidePath : blogPath}#page`) },
    });
  }
  if (post?.faq?.length) {
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${url(canonical)}#faq`,
      isPartOf: { '@id': page['@id'] },
      inLanguage: lang,
      mainEntity: post.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
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

export default function Seo({
  lang,
  view,
  path,
  title,
  description,
  noindex,
  post,
  code,
  service,
}) {
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
  const shared = Boolean(pair || blog || view === 'guide');
  const canonical = pair ? pair[lang] : path;
  const other = lang === 'pl' ? 'en' : 'pl';
  const image = post?.image
    ? site.siteMetadata.siteUrl + post.image
    : shared && url(`/og/${ogView(pair ? view : view === 'guide' && view)}-${lang}.jpg`);
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
              graph({ url, lang, view, title, description, canonical, image, post, code, service }),
            ).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </>
  );
}
