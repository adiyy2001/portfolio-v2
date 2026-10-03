import React from 'react';
import { Link } from 'gatsby';
import Posts, { usePosts } from './posts';
import Split from './split';
import { blogPath, tie } from '../i18n';

const copy = {
  pl: {
    title: 'Ostatnio | piszę.',
    side: 'Artykuły po angielsku o tym, czego uczę się przy pracy.',
    all: 'Wszystkie artykuły',
  },
  en: {
    title: 'Lately | writing.',
    side: 'Articles about what I learn while I work.',
    all: 'All articles',
  },
};

export default function Writing({ lang }) {
  const posts = usePosts().slice(0, 3);
  if (!posts.length) return null;
  const t = copy[lang];
  return (
    <section className="writing" aria-labelledby="writing-h">
      <div className="sec-head">
        <h2 className="h2" id="writing-h">
          <Split text={t.title} onView />
        </h2>
        <p className="sec-head__side">{tie(t.side)}</p>
      </div>
      <Posts posts={posts} lang={lang} heading="h3" />
      <Link className="link writing__all" to={blogPath} hrefLang="en">
        {t.all}
      </Link>
    </section>
  );
}
