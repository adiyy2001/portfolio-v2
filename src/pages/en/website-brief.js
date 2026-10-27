import React from 'react';
import { Link } from 'gatsby';
import Close from '../../components/close';
import Contents from '../../components/contents';
import Hero from '../../components/hero';
import Magnet from '../../components/magnet';
import Seo from '../../components/seo';
import { postDate } from '../../components/posts';
import { quoteId } from '../../components/quote';
import { briefPath, routes, tie } from '../../i18n';
import { brief, costColumns, costSheet, files, published } from '../../brief';

const copy = {
  seoTitle: 'Website brief template and guide, Adrian Turbiński',
  headline: 'Website brief template and guide',
  description:
    'Free website brief template: a one-page project brief, a cost sheet and a short guide to ordering a company website or web app from a freelance developer.',
  tags: [
    'website brief',
    'website brief template',
    'project brief template',
    'freelance developer',
  ],
  title: 'Website brief | template and guide.',
  kicker: 'A free kit by Adrian Turbiński, freelance web developer',
  pdf: 'Download the guide (PDF)',
  csv: 'Download the cost sheet (CSV)',
  free: 'Free, no email needed',
  contents: 'In this guide',
  templateTag: 'Project brief template',
  costCaption: 'Cost sheet: one row for each typical feature',
  hireTag: 'Send the brief',
  hireTitle: 'Brief filled in? Send it.',
  hireText:
    'Send the brief through the quote form below and I will reply with questions within two working days.',
  hireCta: 'Send the brief',
  hireMore: 'Services and prices',
};

function Block({ block: [type, value] }) {
  if (type === 'h3') return <h3>{tie(value)}</h3>;
  if (type === 'p') return <p>{tie(value)}</p>;
  const List = type;
  return (
    <List>
      {value.map(item => (
        <li key={item}>{tie(item)}</li>
      ))}
    </List>
  );
}

function Template() {
  return (
    <div className="slip">
      <p className="slip__tag">{copy.templateTag}</p>
      <dl>
        {brief.template.map(({ label, hint }) => (
          <div className="slip__row" key={label}>
            <dt className="slip__label">{label}</dt>
            <dd className="slip__hint">{tie(hint)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Costs() {
  return (
    <div className="costs">
      <table>
        <caption>{copy.costCaption}</caption>
        <thead>
          <tr>
            {costColumns.map(column => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {costSheet.map(row => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              <td data-label={costColumns[1]}>{row.involves}</td>
              <td data-label={costColumns[2]}>{row.questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cta">
        <a className="btn" href={files.csv} download data-cta="brief-csv-table">
          {tie(copy.csv)}
        </a>
      </p>
    </div>
  );
}

const extras = { 'brief-template': Template, 'cost-sheet': Costs };

export default function WebsiteBrief() {
  const { sections } = brief;
  return (
    <article className="post brief" aria-labelledby="brief-h">
      <Hero id="brief-h" kicker={copy.kicker} title={copy.title} size="post">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(brief.lead)}
        </p>
        <div className="cta" data-rise style={{ '--r': 1 }}>
          <a className="btn" href={files.pdf} download data-cta="brief-pdf">
            {tie(copy.pdf)}
          </a>
          <a className="btn btn--line" href={files.csv} download data-cta="brief-csv">
            {tie(copy.csv)}
          </a>
        </div>
        <p className="post__meta" data-rise style={{ '--r': 2 }}>
          <span>{copy.free}</span>
          <time dateTime={published}>{postDate(published)}</time>
        </p>
      </Hero>
      <div className="post__layout">
        <Contents
          sections={sections.map(({ id, title }) => ({ id, title }))}
          label={copy.contents}
        />
        <div className="prose post__body">
          {brief.intro.map(text => (
            <p key={text}>{tie(text)}</p>
          ))}
          {sections.map(({ id, title, blocks }) => {
            const Extra = extras[id];
            return (
              <React.Fragment key={id}>
                <h2 id={id}>{tie(title)}</h2>
                {blocks.map((block, index) => (
                  <Block key={`${block[0]}-${index}`} block={block} />
                ))}
                {Extra && <Extra />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <aside className="post__hire" aria-labelledby="brief-hire-h">
        <p className="post__hire-tag">{copy.hireTag}</p>
        <h2 className="post__hire-h" id="brief-hire-h">
          {tie(copy.hireTitle)}
        </h2>
        <p className="post__hire-text">{tie(copy.hireText)}</p>
        <p className="cta">
          <Magnet className="btn" href={`#${quoteId.en}`} data-cta="brief-quote">
            {tie(copy.hireCta)}
          </Magnet>
          <Link className="link" to={routes.services.en} data-cta="brief-services">
            {copy.hireMore}
          </Link>
        </p>
      </aside>
      <Close lang="en" edition="cli" />
    </article>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="brief"
    path={briefPath}
    title={copy.seoTitle}
    description={copy.description}
    post={{ type: 'Article', headline: copy.headline, published, tags: copy.tags }}
  />
);
