import React from 'react';
import { Link } from 'gatsby';
import { useGuides } from './guides';
import { usePosts } from './posts';
import { blogPath, guidePath, routes, ui } from '../i18n';
import { letters, needle } from '../wordmark';

export default function Header({ lang, view }) {
  const t = ui[lang];
  const here = routes[view] || routes.home;
  const hasBlog = usePosts().length > 0;
  const showGuide = useGuides().length > 0 && lang === 'pl' && view !== 'rec';
  return (
    <header className="top">
      <Link className="mark" to={routes.home[lang]} aria-label={t.markAria}>
        <svg className="wm" viewBox="0 60 5000 880" aria-hidden="true" focusable="false">
          <path d={letters} />
          <g className="wm__drop">
            <path className="needle" fillRule="evenodd" d={needle} />
          </g>
        </svg>
      </Link>
      <nav className="ed" aria-label={t.edAria}>
        <span className="ed__for">{t.edFor}</span>
        <Link to={routes.rec[lang]} aria-current={view === 'rec' ? 'page' : undefined}>
          {t.edRec}
        </Link>
        <Link
          to={routes.home[lang]}
          aria-current={view === 'home' || view === 'cli' ? 'page' : undefined}>
          {t.edCli}
        </Link>
      </nav>
      {showGuide && (
        <Link
          className="top__blog"
          to={guidePath}
          aria-current={view === 'guide' ? 'page' : undefined}>
          Poradnik
        </Link>
      )}
      {hasBlog && !showGuide && (
        <Link
          className="top__blog"
          to={blogPath}
          hrefLang="en"
          aria-current={view === 'blog' ? 'page' : undefined}>
          Blog
        </Link>
      )}
      {view !== 'blog' && view !== 'guide' && (
        <nav className="lang" aria-label={t.langAria}>
          {['pl', 'en'].map(l => (
            <Link
              key={l}
              to={here[l]}
              lang={l}
              hrefLang={l}
              aria-current={l === lang ? 'true' : undefined}>
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
