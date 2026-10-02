import React from 'react';
import { Link } from 'gatsby';
import { m, useReducedMotion } from 'framer-motion';
import { routes, ui } from '../i18n';
import { duration, ease, instant } from '../motion';
import { letters, needle, thread } from '../wordmark';

const seen = { once: true, amount: 0.6 };

export default function Footer({ lang }) {
  const t = ui[lang];
  const reduce = useReducedMotion();
  return (
    <footer className="mini">
      <svg
        className="mini__wm"
        viewBox="0 -10 5120 950"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
        focusable="false">
        <path d={letters} />
        <m.path
          className="mini__thread"
          d={thread}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={seen}
          transition={reduce ? instant : { duration: duration.thread, ease: ease.draw }}
        />
        <m.circle
          className="mini__knot"
          cx="5040"
          cy="70"
          r="22"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={seen}
          transition={
            reduce
              ? instant
              : { duration: duration.knot, delay: duration.thread - 0.1, ease: ease.out }
          }
        />
        <path fillRule="evenodd" d={needle} />
      </svg>
      <p>{t.footerName}</p>
      <p className="mini__links">
        <Link to={routes.work[lang]}>{t.footerWork}</Link>
        <a href="mailto:adrian.turbinski@gmail.com">{t.footerMail}</a>
        <a href="https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6" rel="noopener">
          LinkedIn
        </a>
        <a href="https://github.com/adiyy2001" rel="noopener">
          GitHub
        </a>
      </p>
    </footer>
  );
}
