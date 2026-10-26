import React, { useEffect, useRef, useState } from 'react';

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
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

export const withAnchors = html => {
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

export default function Contents({ sections, label = 'In this article', aria = 'Contents' }) {
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
    <nav className="toc" aria-label={aria}>
      <details className="toc__box" ref={box}>
        <summary className="toc__label">{label}</summary>
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
