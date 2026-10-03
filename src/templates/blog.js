import React from 'react';
import Hero from '../components/hero';
import Posts, { usePosts } from '../components/posts';
import Seo from '../components/seo';
import { blogPath, tie } from '../i18n';

export default function Blog() {
  const posts = usePosts();
  return (
    <>
      <Hero id="blog-h" sr="Blog, " title="Pattern | notes." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('What I learn while building web apps and my own tools.')}
        </p>
        <p className="lead2" data-rise style={{ '--r': 1 }}>
          {tie(
            'Frontend architecture, Angular, TypeScript and the automation I run for my own work.',
          )}
        </p>
      </Hero>
      <section className="blog" aria-label="Articles">
        <Posts posts={posts} />
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="en"
    view="blog"
    path={blogPath}
    title="Blog, Adrian Turbiński"
    description="Articles by Adrian Turbiński, a frontend developer and tech lead from Wrocław: frontend architecture, Angular, TypeScript and his own tools."
  />
);
