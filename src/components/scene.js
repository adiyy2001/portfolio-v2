import React, { useCallback, useEffect, useRef } from 'react';
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { tie } from '../i18n';
import { spring } from '../motion';
import Split from './split';

const pinQuery =
  'screen and (min-width: 900px) and (min-height: 760px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';
const wideQuery = '(min-width: 900px)';
const samples = 11;
const apart = { a: [], b: [], closeBy: 0 };

const pieces = {
  front: {
    outline:
      'M130 30L330 58C292 112 286 192 352 262L372 488C300 498 150 500 72 488L44 252C46 160 84 76 130 30Z',
    details: [
      'M132 36C160 120 150 200 112 270',
      'M204 280L222 410L240 280',
      'M81 330a7 7 0 1 0 14 0a7 7 0 1 0-14 0',
      'M79 392a7 7 0 1 0 14 0a7 7 0 1 0-14 0',
      'M250 432L332 438',
      'M150 310V448M142 322L150 308L158 322M142 436L150 450L158 436',
      'M300 130L316 136M304 196L320 190',
      'M72 504V518M372 504V518M72 511H372',
    ],
    edge: 'M330 58C292 112 286 192 352 262',
    mark: { x: 190, y: 200 },
    windows: {
      outline: [0.02, 0.26],
      detail: [0.14, 0.3],
      stitch: [0.2, 0.32],
      mark: [0.18, 0.26],
      caption: [0.1, 0.2],
    },
  },
  back: {
    outline: 'M110 40C190 18 285 26 332 72C350 170 332 300 304 482L152 482C104 350 28 206 110 40Z',
    details: [
      'M86 276C150 292 250 290 318 272',
      'M142 436L307 436',
      'M216 120V250M208 134L216 118L224 134M208 236L216 252L224 236',
      'M200 27L200 44M262 38L258 55',
      'M152 504V518M304 504V518M152 511H304',
    ],
    edge: 'M110 40C69 123 67.5 200.5 82.25 273.75',
    mark: { x: 150, y: 380 },
    windows: {
      outline: [0.3, 0.54],
      detail: [0.42, 0.58],
      stitch: [0.5, 0.6],
      mark: [0.5, 0.58],
      caption: [0.38, 0.48],
    },
  },
};

const copy = {
  frontEnd: 'Front-end',
  backEnd: 'Back-end',
  pl: {
    id: 'przod-tyl',
    title: 'Przód i tył szyję sam.',
    lead: 'W krawiectwie przód i tył to dwie części kroju. W aplikacji też. Zszywam je w jedną całość.',
    front: 'przód',
    back: 'tył',
    frontCaption:
      'Interfejsy w Angularze i Reakcie, także te trudne: diagramy, edytory, widoki 3D. Działają też z klawiatury.',
    backCaption:
      'Node.js, bazy danych i integracje. Do tego wdrożenie, CI i testy, żeby nowe zmiany nie psuły starych.',
    seam: 'jedna aplikacja',
  },
  en: {
    id: 'front-back',
    title: 'I sew the front and the back.',
    lead: 'In tailoring, the front and the back are two pattern pieces. In an app too. I stitch them into one.',
    front: 'front',
    back: 'back',
    frontCaption:
      'Interfaces in Angular and React, the hard ones too: diagrams, editors, 3D views. They work from the keyboard too.',
    backCaption:
      "Node.js, databases and integrations. Plus deployment, CI and tests, so new changes don't break old ones.",
    seam: 'one app',
  },
};

const smooth = t => t * t * (3 - 2 * t);

const span = (value, from, to) => Math.min(1, Math.max(0, (value - from) / (to - from)));

const levelOf = (value, on) => (on ? value : 1);

const appearOf = level => span(level, 0.6, 0.78);

const pullOf = level => smooth(span(level, 0.76, 0.94));

const shiftOf = element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;

function sample(edge, frame, box) {
  const matrix = edge.ownerSVGElement.getScreenCTM();
  const shift = shiftOf(frame);
  const length = edge.getTotalLength();
  return Array.from({ length: samples }, (_, i) => {
    const point = edge.getPointAtLength((length * (i + 0.5)) / samples);
    return {
      x: matrix.a * point.x + matrix.c * point.y + matrix.e - box.left - shift,
      y: matrix.b * point.x + matrix.d * point.y + matrix.f - box.top,
    };
  });
}

function stitches({ a, b, closeBy }, shown, pulled) {
  const shift = closeBy * pulled;
  return a
    .map((from, i) => {
      const to = b[i];
      const reach = smooth(span(shown, (i / samples) * 0.7, (i / samples) * 0.7 + 0.3));
      if (reach <= 0) return '';
      const x = from.x + shift;
      const dx = to.x - shift - x;
      const dy = to.y - from.y;
      return `M${x.toFixed(1)} ${from.y.toFixed(1)}l${(dx * reach).toFixed(1)} ${(dy * reach).toFixed(1)}`;
    })
    .join('');
}

function Stroke({ progress, range, className, d }) {
  const offset = useTransform(progress, range, [1, 0], { ease: smooth });
  return <m.path className={className} pathLength="1" d={d} style={{ strokeDashoffset: offset }} />;
}

function Piece({ data, label, progress, shift, frame, edge }) {
  const { windows, mark } = data;
  const stitch = useTransform(progress, windows.stitch, [0, 0.85]);
  const writing = useTransform(progress, windows.mark, [0, 1]);
  return (
    <m.div className="scene__piece" ref={frame} style={{ x: shift }}>
      <svg viewBox="0 0 400 520" aria-hidden="true" focusable="false">
        <g className="stroke" strokeWidth="2.4">
          <Stroke
            className="scene__draw"
            progress={progress}
            range={windows.outline}
            d={data.outline}
          />
          {data.details.map((d, i) => (
            <Stroke
              key={d}
              className="scene__draw scene__fine"
              progress={progress}
              range={[windows.detail[0] + i * 0.012, windows.detail[1] + i * 0.012]}
              d={d}
            />
          ))}
        </g>
        <g transform="translate(12 15.6) scale(.94)">
          <m.path className="scene__stitch" d={data.outline} style={{ opacity: stitch }} />
        </g>
        <g transform={`rotate(-6 ${mark.x} ${mark.y})`}>
          <m.text className="scene__mark" x={mark.x} y={mark.y} style={{ opacity: writing }}>
            {label}
          </m.text>
        </g>
        <path ref={edge} className="scene__edge" d={data.edge} />
      </svg>
    </m.div>
  );
}

function Caption({ progress, range, title, text }) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [18, 0]);
  return (
    <m.div className="scene__cap" style={{ opacity, y }}>
      <h3>{title}</h3>
      <p>{tie(text)}</p>
    </m.div>
  );
}

export default function Scene({ lang }) {
  const t = copy[lang];
  const section = useRef(null);
  const table = useRef(null);
  const frameA = useRef(null);
  const frameB = useRef(null);
  const edgeA = useRef(null);
  const edgeB = useRef(null);
  const bound = useRef(false);
  const arm = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const followed = useSpring(scrollYProgress, spring.skew);
  const pinned = useMotionValue(0);
  const progress = useTransform([followed, pinned], ([value, on]) => levelOf(value, on));
  const geometry = useMotionValue(apart);
  const roots = [followed, pinned, geometry];
  const shiftA = useTransform(
    roots,
    ([value, on, { closeBy }]) => closeBy * pullOf(levelOf(value, on)),
  );
  const shiftB = useTransform(
    roots,
    ([value, on, { closeBy }]) => 0 - closeBy * pullOf(levelOf(value, on)),
  );
  const seam = useTransform(roots, ([value, on, edges]) => {
    const level = levelOf(value, on);
    return stitches(edges, appearOf(level), pullOf(level));
  });
  const noteOpacity = useTransform(progress, [0.92, 0.99], [0, 1]);
  const noteArrow = useTransform(progress, [0.92, 0.99], [1, 0]);
  const tape = useTransform(progress, [0, 1], [0, 1]);

  const attach = useCallback(node => {
    if (!node || !document.documentElement.classList.contains('motion')) return;
    bound.current = true;
    queueMicrotask(() => arm.current?.());
  }, []);

  useEffect(() => {
    const pin = window.matchMedia(pinQuery);
    const wide = window.matchMedia(wideQuery);

    const measure = () => {
      if (!wide.matches) {
        geometry.set(apart);
        return;
      }
      const box = table.current.getBoundingClientRect();
      const a = sample(edgeA.current, frameA.current, box);
      const b = sample(edgeB.current, frameB.current, box);
      const gap = b.reduce((sum, point, i) => sum + point.x - a[i].x, 0) / samples;
      const left = frameA.current.getBoundingClientRect();
      const right = frameB.current.getBoundingClientRect();
      const room = right.left - shiftOf(frameB.current) - (left.right - shiftOf(frameA.current));
      geometry.set({ a, b, closeBy: Math.max(0, Math.min((gap - 64) / 2, (room - 56) / 2)) });
    };

    const sync = () => {
      pinned.set(pin.matches ? 1 : 0);
      measure();
    };

    const onChange = () => {
      if (bound.current) sync();
    };

    const observer = new ResizeObserver(measure);
    [table, frameA, frameB].forEach(ref => observer.observe(ref.current));
    pin.addEventListener('change', onChange);
    wide.addEventListener('change', onChange);
    arm.current = sync;
    if (bound.current) sync();

    return () => {
      arm.current = null;
      observer.disconnect();
      pin.removeEventListener('change', onChange);
      wide.removeEventListener('change', onChange);
    };
  }, [geometry, pinned]);

  return (
    <section className="scene" id={t.id} aria-labelledby="scene-h" ref={section}>
      <div className="scene__stage">
        <div className="sec-head">
          <h2 className="h2" id="scene-h">
            <Split text={t.title} onView />
          </h2>
          <p className="sec-head__side">{tie(t.lead)}</p>
        </div>
        <div className="scene__table" ref={table}>
          <div className="scene__col scene__col--a">
            <Piece
              data={pieces.front}
              label={t.front}
              progress={progress}
              shift={shiftA}
              frame={frameA}
              edge={edgeA}
            />
            <Caption
              progress={progress}
              range={pieces.front.windows.caption}
              title={copy.frontEnd}
              text={t.frontCaption}
            />
          </div>
          <div className="scene__col scene__col--b">
            <Piece
              data={pieces.back}
              label={t.back}
              progress={progress}
              shift={shiftB}
              frame={frameB}
              edge={edgeB}
            />
            <Caption
              progress={progress}
              range={pieces.back.windows.caption}
              title={copy.backEnd}
              text={t.backCaption}
            />
          </div>
          <svg className="scene__seam" aria-hidden="true" focusable="false">
            <m.path d={seam} />
          </svg>
          <m.p className="note scene__note" aria-hidden="true" style={{ opacity: noteOpacity }}>
            <svg viewBox="0 0 46 44">
              <m.path
                className="stroke scene__draw"
                pathLength="1"
                strokeWidth="2"
                d="M23 42C14 32 28 22 22 10M12 17L22 6L32 16"
                style={{ strokeDashoffset: noteArrow }}
              />
            </svg>
            <span>{tie(t.seam)}</span>
          </m.p>
        </div>
        <div className="scene__tape" aria-hidden="true">
          <m.i ref={attach} style={{ scaleX: tape }} />
        </div>
      </div>
    </section>
  );
}
