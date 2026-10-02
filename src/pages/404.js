import React from 'react';
import { Link } from 'gatsby';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { routes, tie } from '../i18n';
import { needle } from '../wordmark';

const pattern =
  'M220 256.2L50 256.2Q36 256.2 45.2 245.6L169.6 102.6Q178.8 92 178.8 106L178.8 316Q178.8 330 192.8 330L366 330C412.4 330 450 276.7 450 211C450 145.3 412.4 92 366 92C319.6 92 282 145.3 282 211C282 276.7 319.6 330 366 330L644.8 330Q658.8 330 658.8 316L658.8 106Q658.8 92 649.6 102.6L525.2 245.6Q516 256.2 530 256.2L700 256.2';

const run =
  'M-310 0L-480 0Q-494 0 -484.8 -10.6L-360.4 -153.6Q-351.2 -164.2 -351.2 -150.2L-351.2 59.8Q-351.2 73.8 -337.2 73.8L-164 73.8C-117.6 73.8 -80 20.5 -80 -45.2C-80 -110.9 -117.6 -164.2 -164 -164.2C-210.4 -164.2 -248 -110.9 -248 -45.2C-248 20.5 -210.4 73.8 -164 73.8L114.8 73.8Q128.8 73.8 128.8 59.8L128.8 -150.2Q128.8 -164.2 119.6 -153.6L-4.8 -10.6Q-14 0 0 0';

const tail = 'M-29.3 -72.5C-36.3 -58.5 -24.3 -41.7 -30.3 -27.7C-32.3 -22.1 -31.3 -18.7 -32.3 -16.5';

const fray = 'M-32.3 -16.5l-5.5 7M-32.3 -16.5l.5 8.5M-32.3 -16.5l6 6.5';

const arrow = 'M488 70C474 100 492 130 502 156M504 142L502 156L491 147';

function Stitch() {
  return (
    <div className="nf-art" aria-hidden="true">
      <svg viewBox="0 -24 720 360" focusable="false">
        <defs>
          <mask id="nf-sewn" maskUnits="userSpaceOnUse" x="0" y="-24" width="720" height="360">
            <path
              className="nf-reveal"
              d={pattern}
              pathLength="1"
              fill="none"
              stroke="#fff"
              strokeWidth="16"
              strokeDasharray="1 1"
              strokeDashoffset="0.0724"
            />
          </mask>
        </defs>
        <path
          className="nf-guide"
          d={pattern}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g
          className="nf-sewn"
          mask="url(#nf-sewn)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path className="nf-shadow" d={pattern} transform="translate(0 2.4)" />
          <path className="nf-thread" d={pattern} stroke="currentColor" />
        </g>
        <circle className="nf-knot" cx="220" cy="256.2" r="5.5" fill="currentColor" />
        <path
          className="nf-arrow"
          d={arrow}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g transform="translate(530 256.2)">
          <g className="nf-needle" style={{ offsetPath: `path('${run}')` }}>
            <g className="nf-pierce">
              <path
                className="nf-body"
                d={needle}
                fillRule="evenodd"
                transform="rotate(14) scale(-0.34 0.34) translate(-3110 -328)"
              />
              <g
                className="nf-stub"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path className="nf-tail" d={tail} />
                <path className="nf-fray" d={fray} />
              </g>
            </g>
          </g>
        </g>
      </svg>
      <p className="note nf-note">
        <span className="nf-hand">
          tu skończyła się nitka
          <small lang="en">the thread ran out here</small>
        </span>
      </p>
    </div>
  );
}

export default function NotFound() {
  return (
    <Hero id="nf-h" sr="404. " title="Nie ma takiej strony." size="nf" aside={<Stitch />}>
      <p className="lead" data-rise style={{ '--r': 0 }}>
        Tu nic nie uszyłem.
      </p>
      <p className="lead2" data-rise style={{ '--r': 1 }}>
        {tie('Literówka w adresie albo coś przeniosłem.')}
      </p>
      <div className="cta" data-rise style={{ '--r': 2 }}>
        <Link className="btn" to={routes.home.pl}>
          Strona główna
        </Link>
        <Link className="link" to={routes.rec.pl}>
          Szyte dla rekrutera
        </Link>
        <Link className="link" to={routes.cli.pl}>
          Szyte dla klienta
        </Link>
      </div>
      <div className="nf-en" lang="en" data-rise style={{ '--r': 3 }}>
        <h2 className="nf-en__head">No such page.</h2>
        <p className="lead2">
          {tie("I haven't sewn anything here. A typo in the address, or I moved something.")}
        </p>
        <div className="cta">
          <Link className="btn btn--line" to={routes.home.en} hrefLang="en">
            Home in English
          </Link>
          <Link className="link" to={routes.rec.en} hrefLang="en">
            Cut for recruiters
          </Link>
          <Link className="link" to={routes.cli.en} hrefLang="en">
            Cut for clients
          </Link>
        </div>
      </div>
    </Hero>
  );
}

export const Head = () => <Seo lang="pl" title="Nie ma takiej strony, Adrian Turbiński" noindex />;
