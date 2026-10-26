import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Reveal from './reveal';
import Split from './split';
import { postDate } from './posts';
import { guidePath, tie } from '../i18n';

export const guidePostPath = slug => `${guidePath}${slug}/`;

export function useGuides() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/poradnik/" }
          frontmatter: { draft: { ne: true } }
        }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            title
            answer
            date
            slug
          }
        }
      }
    }
  `);
  return allMarkdownRemark.nodes.map(node => node.frontmatter);
}

export function Guides({ guides, heading = 'h2' }) {
  const Heading = heading;
  return (
    <ol className="guides">
      {guides.map((guide, i) => (
        <Reveal as="li" key={guide.slug} className="guides__item" style={{ '--i': i }}>
          <span className="guides__mark" aria-hidden="true">
            ?
          </span>
          <Heading className="guides__title">
            <Link to={guidePostPath(guide.slug)}>{tie(guide.title)}</Link>
          </Heading>
          <p className="guides__answer">{tie(guide.answer)}</p>
          <time className="guides__date" dateTime={guide.date}>
            {postDate(guide.date, 'pl')}
          </time>
        </Reveal>
      ))}
    </ol>
  );
}

export default function GuideShelf({ skip, title = 'Zanim | zamówisz.' }) {
  const guides = useGuides()
    .filter(guide => guide.slug !== skip)
    .slice(0, 3);
  if (!guides.length) return null;
  return (
    <section className="guide-shelf" aria-labelledby="guide-shelf-h">
      <div className="sec-head">
        <h2 className="h2" id="guide-shelf-h">
          <Split text={title} onView />
        </h2>
        <p className="sec-head__side">
          {tie('Poradnik: krótkie odpowiedzi na pytania, które klienci zadają najczęściej.')}
        </p>
      </div>
      <Guides guides={guides} heading="h3" />
      <Link className="link guide-shelf__all" to={guidePath}>
        Wszystkie pytania w poradniku
      </Link>
    </section>
  );
}
