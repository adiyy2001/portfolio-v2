import React from 'react';
import { graphql, Link } from 'gatsby';
import Contents, { withAnchors } from '../components/contents';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { postDate, postPath } from '../components/posts';
import { blogPath, routes, tie } from '../i18n';

const focusableCode = html => html.replace(/<pre(?=[\s>])/g, '<pre tabindex="0"');

export default function Post({ data }) {
  const { html, timeToRead, frontmatter: post } = data.markdownRemark;
  const { body, sections } = withAnchors(html);
  return (
    <article className="post" aria-labelledby="post-h">
      <Hero id="post-h" title={post.title} size="post">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(post.description)}
        </p>
        <p className="post__meta" data-rise style={{ '--r': 1 }}>
          <time dateTime={post.date}>{postDate(post.date)}</time>
          <span>{timeToRead} min read</span>
        </p>
      </Hero>
      <div className="post__layout">
        {sections.length > 1 && <Contents sections={sections} />}
        <div
          className="prose post__body"
          dangerouslySetInnerHTML={{ __html: focusableCode(body) }}
        />
      </div>
      <aside className="post__hire" aria-labelledby="post-hire-h">
        <p className="post__hire-tag">Made to measure</p>
        <h2 className="post__hire-h" id="post-hire-h">
          {tie('Need something like this built for your company?')}
        </h2>
        <p className="post__hire-text">
          {tie(
            'I build websites and web apps for companies and fix accessibility in existing ones. B2B invoice, written quote within two working days.',
          )}
        </p>
        <p className="cta">
          <Link className="btn" to={`${routes.services.en}#quote`} data-cta="post-quote">
            Get a quote
          </Link>
          <Link className="link" to={routes.services.en} data-cta="post-services">
            Services and prices
          </Link>
        </p>
      </aside>
      <aside className="post__end" aria-label="About the author">
        <p>
          {tie(
            'Adrian Turbiński is a senior frontend developer and tech lead from Wrocław, building with Angular, TypeScript, RxJS and Node.js since 2019.',
          )}
        </p>
        <p className="cta">
          <Link className="link" to={routes.rec.en}>
            For recruiters
          </Link>
          <Link className="link" to={routes.home.en}>
            For clients
          </Link>
          <Link className="link" to={blogPath}>
            All articles
          </Link>
        </p>
      </aside>
    </article>
  );
}

export const Head = ({ data }) => {
  const { frontmatter: post } = data.markdownRemark;
  return (
    <Seo
      lang="en"
      view="blog"
      path={postPath(post.slug)}
      title={`${post.title}, Adrian Turbiński`}
      description={post.description}
      post={{
        headline: post.title,
        published: post.date,
        modified: post.updated,
        tags: post.tags,
        image: post.ogImage?.publicURL,
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
        date
        updated
        slug
        tags
        ogImage {
          publicURL
        }
      }
    }
  }
`;
