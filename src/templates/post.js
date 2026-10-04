import React, { useEffect, useRef, useState } from 'react';
import { graphql, Link } from 'gatsby';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { postDate, postPath } from '../components/posts';
import { blogPath, routes, tie } from '../i18n';

const focusableCode = html => html.replace(/<pre(?=[\s>])/g, '<pre tabindex="0"');

const plain = text =>
  text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const slugOf = text =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

const withAnchors = html => {
  const seen = new Set();
  const sections = [];
  const body = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    const title = plain(inner);
    let id = slugOf(title);
    while (seen.has(id)) id += '-2';
    seen.add(id);
    sections.push({ id, title });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { body, sections };
};

function Contents({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);
  const box = useRef(null);
  useEffect(() => {
    if (window.innerWidth < 900) box.current?.removeAttribute('open');
  }, []);
  useEffect(() => {
    const heads = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const update = () => {
      let current = heads[0]?.id;
      heads.forEach(head => {
        if (head.getBoundingClientRect().top <= window.innerHeight * 0.3) current = head.id;
      });
      setActive(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [sections]);
  return (
    <nav className="toc" aria-label="Contents">
      <details className="toc__box" ref={box} open>
        <summary className="toc__label">In this article</summary>
        <ol className="toc__list">
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
                {title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}

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
          <Link className="link" to={routes.cli.en}>
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
