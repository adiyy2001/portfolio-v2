import type { ReactNode } from 'react';
import { color, radius } from '../tokens';
import { route } from '../content';
import { Abs, Sheet, fontFamily, text } from '../components/ui';
import { Tram, Walk } from '../components/glyphs';
import { mix } from '../../../shared/motion';
import { HomeIndicator } from '../../../shared/HomeIndicator';

export const routeSheetHeight = 676;

const Row = ({ shown, children, height = 34 }: { shown: number; children: ReactNode; height?: number }) => (
  <div style={{ height, opacity: shown, transform: `translateY(${(1 - shown) * 8}px)`, position: 'relative' }}>{children}</div>
);

const LineBadge = ({ line }: { line: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 26,
      padding: '0 8px',
      borderRadius: 7,
      background: color.brand,
      color: '#fff',
      ...text('callout', { fontWeight: 700, fontSize: 15 }),
    }}>
    <Tram />
    {line}
  </span>
);

export const RouteSheet = ({
  rise,
  rows = 1,
  minutes = route.pillMinutes,
}: {
  rise: number;
  rows?: number | ((i: number) => number);
  minutes?: number;
}) => {
  const top = mix(960, 960 - routeSheetHeight, rise);
  const shown = (i: number) => (typeof rows === 'number' ? rows : rows(i));
  let index = 0;
  const next = () => shown(index++);
  const stop = (time: string, name: string, edge: 'first' | 'mid' | 'last', strong = false) => (
    <Row shown={next()} key={`${time}${name}`}>
      <Abs style={{ left: 0, top: 6, width: 48, ...text('callout', { fontWeight: strong ? 700 : 500, color: strong ? color.ink : color.secondary }) }}>{time}</Abs>
      <Abs style={{ left: 63, top: edge === 'first' ? 15 : 0, bottom: edge === 'last' ? 19 : 0, width: 4, background: color.brand, borderRadius: 2 }} />
      <Abs
        style={{
          left: 58,
          top: 10,
          width: 14,
          height: 14,
          borderRadius: 7,
          boxSizing: 'border-box',
          background: strong ? color.brand : color.surface,
          border: `3px solid ${color.brand}`,
        }}
      />
      <Abs style={{ left: 88, top: 6, ...text('callout', { fontWeight: strong ? 700 : 500 }) }}>{name}</Abs>
    </Row>
  );
  const [first, second] = route.legs;
  return (
    <Sheet top={top} height={routeSheetHeight + 40}>
      <Abs style={{ left: 18, top: 28, ...text('title') }}>{route.title}</Abs>
      <Abs style={{ left: 18, top: 58, ...text('callout', { fontWeight: 400, color: color.secondary }) }}>
        {route.from} → {route.to}
      </Abs>
      <Abs
        style={{
          left: 16,
          top: 96,
          height: 40,
          padding: '0 14px',
          borderRadius: radius.pill,
          background: color.brandTint,
          color: color.brandDeep,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          ...text('callout', { fontWeight: 600, fontSize: 15 }),
        }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color.brandDeep} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="9" r="7" />
          <path d="M9 5v4.2l2.8 1.8" />
        </svg>
        Zdążysz: zostanie {minutes} min biletu
      </Abs>
      <Abs style={{ left: 18, right: 18, top: 160, fontFamily }}>
        <Row shown={next()} height={42}>
          <LineBadge line={first.line} />
          <span style={{ marginLeft: 10, ...text('callout', { color: color.secondary, fontWeight: 500 }) }}>
            {first.kind}, {first.direction}
          </span>
        </Row>
        {first.stops.map(([time, name], i) => stop(time, name, i === 0 ? 'first' : i === first.stops.length - 1 ? 'last' : 'mid', i === 0 || i === first.stops.length - 1))}
        <Row shown={next()} height={50}>
          <Abs
            style={{
              left: 0,
              right: 0,
              top: 6,
              height: 38,
              borderRadius: 10,
              background: color.grouped,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 12px',
              ...text('callout', { fontWeight: 500, fontSize: 15, color: color.secondary }),
            }}>
            <Walk tint={color.secondary} />
            {route.transfer}
          </Abs>
        </Row>
        <Row shown={next()} height={42}>
          <Abs style={{ left: 0, top: 8 }}>
            <LineBadge line={second.line} />
            <span style={{ marginLeft: 10, ...text('callout', { color: color.secondary, fontWeight: 500 }) }}>
              {second.kind}, {second.direction}
            </span>
          </Abs>
        </Row>
        {second.stops.map(([time, name], i) => stop(time, name, i === 0 ? 'first' : i === second.stops.length - 1 ? 'last' : 'mid', i === 0 || i === second.stops.length - 1))}
        <Row shown={next()} height={40}>
          <Abs style={{ left: 0, right: 0, top: 14, ...text('caption', { fontWeight: 500, color: color.secondary }) }}>{route.arrival}</Abs>
        </Row>
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 0, height: routeSheetHeight }}>
        <HomeIndicator color={color.ink} />
      </Abs>
    </Sheet>
  );
};

export const routeRowCount = 1 + route.legs[0].stops.length + 1 + 1 + route.legs[1].stops.length + 1;
