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
    if (window.innerWidth >= 900) box.current?.setAttribute('open', '');
  }, []);
  useEffect(() => {
    const heads = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!heads.length || !('IntersectionObserver' in window)) return undefined;
    const update = () => {
      const line = window.innerHeight * 0.3;
      const passed = heads.filter(head => head.getBoundingClientRect().top <= line);
      setActive((passed.pop() ?? heads[0]).id);
    };
    const watchers = ['0px 0px -70% 0px', '0px'].map(
      rootMargin => new IntersectionObserver(update, { rootMargin }),
    );
    heads.forEach(head => watchers.forEach(watcher => watcher.observe(head)));
    return () => watchers.forEach(watcher => watcher.disconnect());
  }, [sections]);
  return (
    <nav className="toc" aria-label="Contents">
      <details className="toc__box" ref={box}>
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
