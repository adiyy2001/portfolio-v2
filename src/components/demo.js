import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { withPrefix } from 'gatsby';
import { useReducedMotion } from 'framer-motion';
import Reveal from './reveal';
import { tie } from '../i18n';

const copy = {
  pl: {
    label: name => `Nagranie demo ${name}`,
    play: 'Odtwórz nagranie',
    pause: 'Zatrzymaj nagranie',
    source: 'Nagranie z repozytorium, bez dźwięku.',
  },
  en: {
    label: name => `${name} demo recording`,
    play: 'Play the recording',
    pause: 'Pause the recording',
    source: 'Recording from the repository, no sound.',
  },
};

const noop = () => () => {};

export default function Demo({ id, name, lang, clip, note, width, height }) {
  const t = copy[lang];
  const video = useRef(null);
  const held = useRef(false);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  useEffect(() => {
    const element = video.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        watch.disconnect();
      },
      { rootMargin: '400px 0px' },
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  useEffect(() => {
    const element = video.current;
    if (reduce || !element || !('IntersectionObserver' in window)) return undefined;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !held.current) element.play().catch(() => {});
        if (!entry.isIntersecting) element.pause();
      },
      { threshold: 0.35 },
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, [reduce]);

  const toggle = () => {
    const element = video.current;
    if (element.paused) {
      held.current = false;
      element.play().catch(() => {});
    } else {
      held.current = true;
      element.pause();
    }
  };

  const media = path => withPrefix(`/media/${id}-${path}`);
  const descId = `${id}-clip`;

  return (
    <section className="demo" aria-label={t.label(name)}>
      <Reveal as="figure" className="demo__fig" aria-describedby={descId}>
        <div className="demo__frame" style={{ aspectRatio: `${width} / ${height}` }}>
          <video
            ref={video}
            width={width}
            height={height}
            poster={near ? media('poster.webp') : undefined}
            preload="none"
            muted
            loop
            playsInline
            controls={!hydrated}
            aria-label={t.label(name)}
            aria-describedby={descId}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}>
            <source src={media('demo.webm')} type="video/webm" />
            <source src={media('demo.mp4')} type="video/mp4" />
          </video>
        </div>
        <figcaption className="demo__cap">
          <p id={descId}>{tie(clip)}</p>
          <p className="demo__note">
            {tie(note)} {tie(t.source)}
          </p>
          <button
            type="button"
            className="link demo__toggle"
            onClick={toggle}
            disabled={!hydrated}
            style={hydrated ? undefined : { visibility: 'hidden' }}>
            {playing ? t.pause : t.play}
          </button>
        </figcaption>
      </Reveal>
    </section>
  );
}
