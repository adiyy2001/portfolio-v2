import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, withPrefix } from 'gatsby';
import Reveal from './reveal';
import { tie } from '../i18n';

const visibleFirst = 4;

const arrow = (
  <svg viewBox="0 0 40 18" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
  </svg>
);

const subscribeNever = () => () => {};

const pad = number => String(number).padStart(2, '0');

function Art({ item }) {
  if (item.shot) return <div className="cc__art cc__art--shot">{item.shot}</div>;
  const tall = item.view === 'tall';
  const image = tall ? item.phone : { src: item.image, width: 1200, height: 595, alt: item.alt };
  return (
    <div className="cc__art">
      <div className="cc__frame">
        <img
          src={withPrefix(image.src)}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          alt={image.alt}
        />
      </div>
    </div>
  );
}

function Card({ item, number, go, as: Name }) {
  const Wrap = item.shot ? 'li' : Reveal;
  const wrapProps = item.shot ? {} : { as: 'li' };
  return (
    <Wrap
      className={`cc cc--${item.view === 'tall' ? 'tall' : 'wide'}`}
      data-view={item.view === 'tall' ? 'tall' : 'wide'}
      {...wrapProps}>
      <Art item={item} />
      <div className="cc__body">
        <div className="cc__head">
          <p className="work__tag">{tie(item.tag)}</p>
          <span className="cc__no" aria-hidden="true">
            {pad(number)}
          </span>
        </div>
        <Name className="cc__name" id={item.id}>
          <Link className="cc__link" to={item.to}>
            {item.name}
          </Link>
        </Name>
        <p className="work__meta">{tie(item.meta)}</p>
        <p className="cc__desc">{tie(item.desc)}</p>
        <p className="cc__tech">
          {item.tech.split(', ').map((word, index) => (
            <React.Fragment key={word}>
              {index > 0 && <span className="sr">, </span>}
              <span className="cc__chip">{word}</span>
            </React.Fragment>
          ))}
        </p>
        <p className="cc__go" aria-hidden="true">
          <span>{go}</span>
          {arrow}
        </p>
      </div>
    </Wrap>
  );
}

export default function Cases({ items, go, title, titleId, moreLabel }) {
  const first = items.slice(0, visibleFirst);
  const rest = items.slice(visibleFirst);
  const ready = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const moreList = useRef(null);
  const focusAfterOpen = useRef(false);

  useEffect(() => {
    if (!open || !focusAfterOpen.current) return;
    focusAfterOpen.current = false;
    moreList.current?.querySelector('a')?.focus();
  }, [open]);

  const expand = () => {
    focusAfterOpen.current = true;
    setOpen(true);
  };

  return (
    <section
      className={`work__pick cases${rest.length ? '' : ' cases--solo'}`}
      aria-labelledby={titleId}
      data-ready={ready ? '' : undefined}>
      <h2 className="sr" id={titleId}>
        {title}
      </h2>
      <ul className="cases__list">
        {first.map((item, index) => (
          <Card key={item.to} item={item} number={index + 1} go={go} as="h3" />
        ))}
      </ul>
      {rest.length > 0 && (
        <>
          <ul
            className="cases__list cases__more"
            id="cases-more"
            ref={moreList}
            data-open={open ? '' : undefined}>
            {rest.map((item, index) => (
              <Card key={item.to} item={item} number={visibleFirst + index + 1} go={go} as="h3" />
            ))}
          </ul>
          {!open && (
            <div className="cases__bar">
              <button
                className="btn btn--line"
                type="button"
                aria-expanded={open}
                aria-controls="cases-more"
                onClick={expand}>
                {moreLabel}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
