import React from 'react';
import { graphql, Link } from 'gatsby';
import Close from '../components/close';
import Contents, { withAnchors } from '../components/contents';
import GuideShelf, { guidePostPath } from '../components/guides';
import Hero from '../components/hero';
import Magnet from '../components/magnet';
import Seo from '../components/seo';
import Split from '../components/split';
import { postDate } from '../components/posts';
import { quoteId } from '../components/quote';
import { routes, tie } from '../i18n';
import { services } from '../services';

export default function GuidePost({ data }) {
  const { html, timeToRead, frontmatter: post } = data.markdownRemark;
  const { body, sections } = withAnchors(html);
  const s = services[post.service].pl;
  return (
    <article className="post guide" aria-labelledby="post-h">
      <Hero id="post-h" title={post.title} size="post">
        <div className="answer" data-rise style={{ '--r': 0 }}>
          <p className="answer__tag">Krótka odpowiedź</p>
          <p className="answer__text">{tie(post.answer)}</p>
        </div>
        <p className="post__meta" data-rise style={{ '--r': 1 }}>
          <time dateTime={post.date}>{postDate(post.date, 'pl')}</time>
          {post.updated && (
            <span>
              aktualizacja <time dateTime={post.updated}>{postDate(post.updated, 'pl')}</time>
            </span>
          )}
          <span>{timeToRead} min czytania</span>
        </p>
      </Hero>
      <div className="post__layout">
        {sections.length > 1 && (
          <Contents sections={sections} label="W tym artykule" aria="Spis treści" />
        )}
        <div className="prose post__body" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      <aside className="post__hire" aria-labelledby="post-hire-h">
        <p className="post__hire-tag">{tie(s.name)}</p>
        <h2 className="post__hire-h" id="post-hire-h">
          {tie(`${s.price} ${s.priceNote}.`)}
        </h2>
        <p className="post__hire-text">{tie(s.lead)}</p>
        <p className="cta">
          <Magnet className="btn" href={`#${quoteId.pl}`} data-cta="guide-quote">
            Wyceń projekt
          </Magnet>
          <Link className="link" to={routes[`svc-${post.service}`].pl} data-cta="guide-service">
            {tie(`Szczegóły usługi: ${s.name.toLowerCase()}`)}
          </Link>
        </p>
      </aside>
      <section className="faq" aria-labelledby="faq-h">
        <div className="sec-head">
          <h2 className="h2" id="faq-h">
            <Split text="Pytania." onView />
          </h2>
        </div>
        <div className="faq__list">
          {post.faq.map(({ q, a }) => (
            <details className="faq__item" key={q}>
              <summary className="faq__q">{tie(q)}</summary>
              <p className="faq__a">{tie(a)}</p>
            </details>
          ))}
        </div>
      </section>
      <GuideShelf skip={post.slug} title="Inne | pytania." />
      <Close lang="pl" edition="cli" service={post.service} />
    </article>
  );
}

export const Head = ({ data }) => {
  const { frontmatter: post } = data.markdownRemark;
  return (
    <Seo
      lang="pl"
      view="guide"
      path={guidePostPath(post.slug)}
      title={`${post.title}, Adrian Turbiński`}
      description={post.description}
      post={{
        headline: post.title,
        published: post.date,
        modified: post.updated,
        tags: post.tags,
        image: post.ogImage?.publicURL,
        faq: post.faq,
      }}
    />
  );
};

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      frontmatter {
        title
        description
        answer
        service
        date
        updated
        slug
        tags
        faq {
          q
          a
        }
        ogImage {
          publicURL
        }
      }
    }
  }
`;
