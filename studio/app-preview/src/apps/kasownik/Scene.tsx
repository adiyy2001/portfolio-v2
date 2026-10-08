import { Easing, interpolate } from 'remotion';
import { StatusBar } from '../../shared/StatusBar';
import { bezierAt, mix, springAt, window01 } from '../../shared/motion';
import { bridgeT } from '../../shared/loop';
import { color, fade, hero, live, press, push, scrim, sheet } from './tokens';
import { liveTicket, route, times } from './content';
import { storyboard } from './storyboard';
import { T, hookRemaining } from './timeline';
import { fontFamily } from './components/ui';
import { TicketCard } from './components/TicketCard';
import { Home } from './screens/Home';
import { BuySheet } from './screens/BuySheet';
import { MyTickets, cardSlot } from './screens/MyTickets';
import { LiveTicket, liveSlot } from './screens/LiveTicket';
import { RouteSheet } from './screens/RouteSheet';
import { Inspector } from './screens/Inspector';
import { Launch, launchIcon } from './screens/Launch';
import { Scrim } from './components/ui';

const layer = { position: 'absolute', inset: 0 } as const;
const inOut = Easing.bezier(0.45, 0, 0.55, 1);

const tap = (f: number, at: number) => bezierAt(press, f, at) * (1 - springAt(push, f, at + 4));

const remainingAt = (f: number) =>
  f < T.liveStart ? liveTicket.lengthSeconds : liveTicket.lengthSeconds - (f - T.liveStart) / 30;

const hookCard = (f: number) => ({
  frame: f,
  live: 1,
  validated: 1,
  remaining: hookRemaining - f / 30,
  shimmer: interpolate(f, [8, 44], [-0.25, 1.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut }),
});

export const liveCardAt = (f: number) => ({
  frame: f,
  live: bezierAt(fade, f, T.liveStart - 6),
  validated: 1,
  hold: 1,
  remaining: remainingAt(f),
  wave: bezierAt(live, f, T.waveFrom),
});

const timeAt = (f: number) => (f < T.dismiss ? times.hook : f < 225 ? times.buy : times.validate);

const HookScreen = ({ f, time }: { f: number; time: string }) => (
  <LiveTicket time={time} card={hookCard(f)} />
);

export const Scene = ({ frame, hideCard = false }: { frame: number; hideCard?: boolean }) => {
  const f = frame;
  const time = timeAt(f);
  const bar = <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />;

  if (f >= storyboard.duration) {
    const t = bridgeT(f, storyboard.duration, storyboard.bridge);
    const u = inOut(t);
    const show = Math.min(1, Math.max(0, (u - 0.25) / 0.6));
    const rect = {
      left: mix((443 - launchIcon.size) / 2, liveSlot.left, u),
      top: mix(launchIcon.top, liveSlot.top, u),
      width: mix(launchIcon.size, liveSlot.width, u),
      height: mix(launchIcon.size, 46, u),
    };
    return (
      <div style={layer}>
        <div style={layer}>
          <HookScreen f={0} time="" />
        </div>
        <div style={{ ...layer, opacity: 1 - show }}>
          <Launch icon={1} name={Math.max(0, 1 - t * 2.5)} />
        </div>
        <div
          style={{
            position: 'absolute',
            ...rect,
            background: color.brand,
            borderRadius: `${mix(29, 18, u)}px ${mix(29, 18, u)}px ${mix(29, 0, u)}px ${mix(29, 0, u)}px`,
            opacity: 1 - Math.max(0, (u - 0.8) / 0.2),
          }}
        />
        <div style={{ ...layer, opacity: show }}>{<StatusBar time={times.hook} color={color.ink} fontFamily={fontFamily} />}</div>
      </div>
    );
  }

  if (f < T.dismiss) {
    return (
      <div style={layer}>
        <HookScreen f={f} time="" />
        {bar}
      </div>
    );
  }

  if (f < T.pushMine + 30) {
    const d = springAt(push, f, T.dismiss);
    const scroll = 64 * springAt(sheet, f, T.scroll);
    const highlight = bezierAt(fade, f, T.highlight) * (1 - bezierAt(fade, f, T.sheetDown));
    const rise = springAt(sheet, f, T.sheetUp) - springAt(sheet, f, T.sheetDown);
    const dim = bezierAt(scrim, f, T.sheetUp) * (1 - bezierAt(scrim, f, T.sheetDown));
    const m = springAt(push, f, T.pushMine);
    const land = springAt(hero, f, T.land);
    return (
      <div style={layer}>
        <div style={{ ...layer, transform: `translateX(${-m * 443 * 0.3}px) scale(${mix(0.96, 1, d)})` }}>
          <Home time="" scroll={scroll} highlight={highlight} press={tap(f, T.tapCard)} />
          <Scrim amount={dim} />
          {rise > 0.001 && (
            <BuySheet rise={rise} press={tap(f, T.payPress)} morph={springAt(push, f, T.morph)} check={bezierAt(fade, f, T.check)} />
          )}
          {m > 0 && <div style={{ ...layer, background: `rgba(0,0,0,${m * 0.08})` }} />}
        </div>
        {m > 0 && (
          <div style={{ ...layer, transform: `translateX(${(1 - m) * 443}px)`, boxShadow: '-8px 0 24px rgba(16,20,24,0.08)' }}>
            <MyTickets time="" land={land} card={{ frame: f }} />
          </div>
        )}
        {d < 1 && (
          <div style={{ ...layer, transform: `translateY(${d * 960}px)` }}>
            <HookScreen f={f} time="" />
          </div>
        )}
        {bar}
      </div>
    );
  }

  if (f < T.hero) {
    const land = springAt(hero, f, T.land);
    const touch = bezierAt(fade, f, T.touch) * (1 - bezierAt(fade, f, T.holdTo + 4));
    const hold = interpolate(f, [T.holdFrom, T.holdTo], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut });
    const validated = bezierAt(fade, f, T.holdTo);
    const swap = interpolate(f, [T.holdTo, T.holdTo + 11], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut });
    const bump = tap(f, T.holdTo);
    return (
      <div style={layer}>
        <MyTickets time="" land={land} bump={bump} card={{ frame: f, hold, validated, touch, swap }} />
        {bar}
      </div>
    );
  }

  const e = springAt(hero, f, T.hero);
  const card = liveCardAt(f);

  if (f < T.inspector) {
    const rect = {
      left: mix(cardSlot.left, liveSlot.left, e),
      top: mix(cardSlot.top, liveSlot.top, e),
      width: mix(cardSlot.width, liveSlot.width, e),
      height: mix(cardSlot.height, liveSlot.height, e),
    };
    const rise = springAt(sheet, f, T.routeUp) - springAt(sheet, f, T.routeDown);
    const dim = bezierAt(scrim, f, T.routeUp) * (1 - bezierAt(scrim, f, T.routeDown));
    const minutes = Math.round(mix(45, route.pillMinutes, bezierAt(live, f, T.pill)));
    return (
      <div style={layer}>
        {f < T.hero + 30 && <MyTickets time="" land={1} hideCard tabHide={e / 0.85} />}
        <div style={{ ...layer, opacity: Math.min(1, e * 1.4) }}>
          <LiveTicket time="" card={card} hideCard chrome={window01(e, 0.5, 1)} pressInspector={tap(f, T.inspectorPress)} />
        </div>
        {!hideCard && (
          <div style={{ position: 'absolute', ...rect }}>
            <TicketCard {...card} expand={e} />
          </div>
        )}
        <Scrim amount={dim} />
        {rise > 0.001 && <RouteSheet rise={rise} minutes={minutes} rows={i => bezierAt(fade, f, T.rows + i * 1.2)} />}
        {bar}
      </div>
    );
  }

  if (f < T.white + 15) {
    const p = springAt(hero, f, T.inspector);
    const bloom = Math.sin(Math.PI * window01(f, T.inspector, T.inspector + 32)) * 0.55;
    const white = bezierAt(fade, f, T.white);
    return (
      <div style={layer}>
        <LiveTicket time="" card={{ ...card, hideQr: true, hideClock: true }} chrome={1 - p} />
        <div style={{ ...layer, background: `rgba(255,255,255,${Math.min(1, p)})` }} />
        <Inspector time="" progress={p} frame={f} remaining={remainingAt(f)} solid={false} />
        <div style={{ ...layer, background: `radial-gradient(circle at 50% 40%, rgba(255,255,255,${bloom}) 0%, rgba(255,255,255,${bloom * 0.5}) 70%)` }} />
        {bar}
        <div style={{ ...layer, background: `rgba(255,255,255,${white})` }} />
      </div>
    );
  }

  return (
    <div style={layer}>
      <Launch icon={springAt(hero, f, T.launchIcon)} name={bezierAt(fade, f, T.launchName)} />
    </div>
  );
};
