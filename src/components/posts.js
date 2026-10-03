import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Reveal from './reveal';
import { blogPath, tie } from '../i18n';

const locales = { pl: 'pl-PL', en: 'en-GB' };

export const postPath = slug => `${blogPath}${slug}/`;

export const postDate = (date, lang = 'en') =>
  new Date(date).toLocaleDateString(locales[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Warsaw',
  });

export function usePosts() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/blog/" }
          frontmatter: { draft: { ne: true } }
        }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          frontmatter {
            title
            description
            date
            slug
          }
        }
      }
    }
  `);
  return allMarkdownRemark.nodes.map(node => node.frontmatter);
}

export default function Posts({ posts, lang = 'en', heading = 'h2' }) {
  const Heading = heading;
  return (
    <ol className="posts">
      {posts.map(post => (
        <Reveal as="li" key={post.slug} className="posts__item" lang="en">
          <time className="posts__date" dateTime={post.date}>
            {postDate(post.date, lang)}
          </time>
          <Heading className="posts__title">
            <Link to={postPath(post.slug)} hrefLang="en">
              {tie(post.title)}
            </Link>
          </Heading>
          <p className="posts__desc">{tie(post.description)}</p>
        </Reveal>
      ))}
    </ol>
  );
}
