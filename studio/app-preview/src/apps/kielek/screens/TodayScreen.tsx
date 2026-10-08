import type { CSSProperties } from 'react';
import { mix } from '../../../shared/motion';
import { clayFlat, color } from '../tokens';
import { plural, today } from '../content';
import { T } from '../timeline';
import { Box, Drop, DropGlyph, Mascot, Pill, PlantAvatar, Splash, Text, Touch } from '../components/ui';
import { arc, blinkAt, combine, dropFall, enter, hop, inOut, landing, leave, pressAt, progress, puffAt, puffIn, rest, wiggleAt, type Body } from '../components/motion';
import type { Mood } from '../components/art';

export const hookCard = { x: 34, y: 430, w: 375, h: 196 } as const;
export const heroCard = { x: 24, y: 136, w: 395, h: 176 } as const;
export const mascotBig = { x: 103, y: 146, w: 236 } as const;
export const mascotSmall = { x: 284, y: 151, w: 124 } as const;
export const cardTop = (i: number) => 368 + i * 108;
export const flight = { from: 64, frames: 18 } as const;

export const mascotPose = (f: number, id: string) => {
  const cheering = f >= T.cheer && f < T.cheerEnd;
  const mood: Mood = cheering ? 'cheer' : 'smile';
  return {
    id,
    mood,
    blink: blinkAt(f, T.hookBlink) + blinkAt(f, T.blink2),
    leafL: wiggleAt(f, 50, 0),
    leafR: wiggleAt(f, 50, 17),
  };
};

export const mascotPlace = (f: number) => {
  if (f < flight.from) return { ...mascotBig, body: hop(f, T.hookHop, 40) };
  const land = flight.from + flight.frames;
  if (f < land) {
    const t = progress(f, flight.from, flight.frames, inOut);
    const w = mix(mascotBig.w, mascotSmall.w, t);
    return { x: mix(mascotBig.x, mascotSmall.x, t), y: mix(mascotBig.y, mascotSmall.y, t) + arc(t, 46), w, body: { y: 0, sx: 0.97, sy: 1.04 } as Body };
  }
  const body = f >= T.cheerHop - 4 ? combine(landing(f, land), hop(f, T.cheerHop, 26)) : landing(f, land);
  return { ...mascotSmall, body };
};

export const cardTravel = 16;

const rect = (f: number, still: boolean) => {
  if (still) return { ...heroCard, body: rest };
  const c = progress(f, T.compact, cardTravel, inOut);
  return {
    x: mix(hookCard.x, heroCard.x, c),
    y: mix(hookCard.y, heroCard.y, c),
    w: mix(hookCard.w, heroCard.w, c),
    h: mix(hookCard.h, heroCard.h, c),
    body: landing(f, T.compact + cardTravel),
  };
};

const watered = (f: number, still: boolean, done: boolean) => done || (!still && f >= T.reveal);

const PlantCard = ({ i, f, still, done, settled }: { i: number; f: number; still: boolean; done: boolean; settled: boolean }) => {
  const plant = today.list[i];
  const top = cardTop(i);
  const first = i === 0;
  const isWet = first && watered(f, still, done);
  const reveal = first ? (done || still ? (done ? 1 : 0) : puffAt(f, T.reveal)) : 0;
  const press = first && !still ? pressAt(f, T.tap) : 0;
  const button = first && isWet ? (done ? 0 : 1 - progress(f, T.reveal, 4)) : 1;
  const check = first && isWet ? (done ? 1 : puffAt(f, T.check)) : 0;
  const wetText = first && (done || (!still && f >= T.count));
  const style: CSSProperties = enter(f, T.cards[i], still || settled);
  return (
    <div style={{ position: 'absolute', left: 24, top, width: 395, height: 94, ...style }}>
      <Box x={0} y={0} w={395} h={94} style={{ overflow: 'hidden' }}>
        {reveal > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 47 - 440 * reveal,
              top: 47 - 440 * reveal,
              width: 880 * reveal,
              height: 880 * reveal,
              borderRadius: '50%',
              background: color.pistachio,
            }}
          />
        )}
        {reveal > 0 && <div style={{ position: 'absolute', inset: 0, borderRadius: 28, boxShadow: clayFlat(1.2) }} />}
      </Box>
      <PlantAvatar plant={plant} size={62} id={`today-${i}`} x={16} y={16} />
      <div style={{ position: 'absolute', left: 92, top: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 19, fontWeight: 900, lineHeight: '26px' }}>{plant.name}</span>
        <Pill size={12} tone={isWet ? 'card' : 'water'}>
          <DropGlyph size={10} id={`pill-${i}`} />
          {plant.ml} ml
        </Pill>
      </div>
      {wetText ? (
        <Text x={92} y={52} size={14} weight={800} tone={color.ink} style={puffIn(f, T.count, still || done, '0% 50%')}>
          {today.done}
        </Text>
      ) : (
        <Text x={92} y={52} size={14} tone={color.inkSoft}>
          {plant.species.split(' ')[0]} · {plant.room}
        </Text>
      )}
      {button > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 395 - 16 - 104,
            top: 26,
            width: 104,
            height: 42,
            borderRadius: 21,
            background: color.pistachio,
            boxShadow: press > 0.3 ? '' : `inset 3px 3px 6px rgba(255,255,255,0.65), inset -3px -4px 8px rgba(74,44,42,0.12), 0 4px 10px rgba(74,44,42,0.16)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 800,
            transform: `scale(${(1 - press * 0.08) * button}, ${(1 - press * 0.12) * button})`,
          }}>
          {today.button}
        </div>
      )}
      {check > 0.01 && (
        <div style={{ position: 'absolute', left: 395 - 16 - 48 - 28, top: 23, width: 48, height: 48, transform: `scale(${check})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: color.card, boxShadow: '0 4px 10px rgba(74,44,42,0.16), inset 3px 3px 6px rgba(255,255,255,0.8), inset -3px -4px 8px rgba(74,44,42,0.1)' }} />
          <svg viewBox="0 0 24 24" style={{ position: 'absolute', inset: 10 }}>
            <path d="M5.5 12.5l4.2 4.2L18.5 7.5" fill="none" stroke={color.ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const TodayScreen = ({
  f,
  still = false,
  done = false,
  hideMascot = false,
  greet = 1,
  content = 1,
  settled = false,
  cardShow = 1,
}: {
  settled?: boolean;
  f: number;
  still?: boolean;
  done?: boolean;
  hideMascot?: boolean;
  greet?: number;
  content?: number;
  cardShow?: number;
}) => {
  const r = rect(f, still || done || settled);
  const hookText = still || done || settled ? 0 : 1 - progress(f, T.hookTextOut, 5);
  const cardIn = still || done || settled ? 1 : cardShow;
  const nudge = still || done || settled || f >= T.compact ? rest : landing(f, T.hookHop + 17);
  const counted = done || (!still && f >= T.count + 2);
  const count = counted ? today.countTo : today.countFrom;
  const ml = counted ? today.mlTo : today.mlFrom;
  const countStyle = !still && !done && f >= T.count - 4 && f < T.count + 2 ? leave(f, T.count - 4, 6) : counted && !done ? puffIn(f, T.count + 2, false, '0% 60%') : {};
  const place = still || done ? { ...mascotSmall, body: rest } : settled && f < T.cheerHop - 4 ? { ...mascotSmall, body: rest } : mascotPlace(f);
  const pose = mascotPose(still || done ? 250 : f, 'today');
  const fall = dropFall(f, T.dropLand, 170);
  const absorb = progress(f, T.dropLand + 4, 7);
  const showDrop = !still && !done && fall.visible && absorb < 1;
  const avatar = { x: 24 + 16 + 31, y: cardTop(0) + 18 };
  const tapAt = { x: 419 - 16 - 52, y: cardTop(0) + 47 };
  const touch = still || done ? 0 : progress(f, T.tap - 2, 3) * (1 - progress(f, T.tap + 7, 5));
  return (
    <>
      <div style={{ opacity: greet }}>
        <Text x={24} y={62} size={14} weight={800} tone={color.inkSoft}>
          {today.date}
        </Text>
        <Text x={24} y={82} size={28} weight={900}>
          {today.hello}
        </Text>
      </div>
      <div style={{ opacity: content }}>
        {cardIn > 0.001 && (
          <Box
            x={r.x}
            y={r.y}
            w={r.w}
            h={r.h}
            tone="butter"
            style={{ transform: `scale(${cardIn * (1 + (r.body.sx - 1) * 0.5) * (1 + (nudge.sx - 1) * 0.4)}, ${cardIn * (1 + (r.body.sy - 1) * 0.5) * (1 + (nudge.sy - 1) * 0.4)})`, transformOrigin: '50% 0%', opacity: Math.min(1, cardIn * 3) }}>
            {hookText > 0.01 && (
              <div style={{ position: 'absolute', inset: 0, opacity: hookText, textAlign: 'center' }}>
                <Text x={0} y={24} w={r.w} align="center" size={20} weight={800} tone={color.inkSoft}>
                  {today.kicker}
                </Text>
                <Text x={0} y={50} w={r.w} align="center" size={56} weight={900} line={1.1}>
                  {today.countFrom} {plural(today.countFrom)}
                </Text>
                <Text x={0} y={132} w={r.w} align="center" size={16} weight={800} tone={color.inkSoft}>
                  {today.hookLine}
                </Text>
              </div>
            )}
            {hookText < 0.99 && (
              <div style={{ position: 'absolute', inset: 0, ...(still || done ? {} : puffIn(f, T.cardText, settled, '0% 50%')) }}>
                <Text x={22} y={22} size={17} weight={800} tone={color.inkSoft}>
                  {counted ? 'Zostały' : today.kicker}
                </Text>
                <Text x={22} y={44} size={40} weight={900} line={1.15} style={{ transformOrigin: '0% 60%', ...countStyle }}>
                  {count} {plural(count)}
                </Text>
                <div style={{ position: 'absolute', left: 22, top: 114 }}>
                  <Pill size={14} tone="water">
                    <DropGlyph size={12} id="hero-ml" />
                    {counted ? `jeszcze ${ml} ml` : `razem ${ml} ml`}
                  </Pill>
                </div>
              </div>
            )}
          </Box>
        )}
        <div style={{ ...(still || done || settled ? {} : enter(f, T.section, false, 34, 342)) }}>
          <Text x={24} y={330} size={18} weight={900}>
            {today.section}
          </Text>
          <div style={{ position: 'absolute', left: 140, top: 328 }}>
            <Pill size={13} tone="card" flat={false}>
              {count}
            </Pill>
          </div>
        </div>
        {[0, 1, 2].map(i => (
          <PlantCard key={i} i={i} f={f} still={still} done={done} settled={settled} />
        ))}
        <Touch x={tapAt.x} y={tapAt.y} t={touch} />
        {showDrop && (
          <Drop
            x={avatar.x}
            y={avatar.y + 30 + fall.y}
            w={34}
            id="fall"
            body={fall.y < 0 ? fall.body : { y: 0, sx: fall.body.sx * (1 - absorb), sy: fall.body.sy * (1 - absorb) }}
            style={{ zIndex: 30 }}
          />
        )}
        {!still && !done && <Splash x={avatar.x} y={avatar.y + 22} t={progress(f, T.dropLand, 12, t => t)} id="splash" />}
      </div>
      {!hideMascot && <Mascot x={place.x} y={place.y} w={place.w} body={place.body} pose={pose} style={{ zIndex: 20, opacity: content }} />}
    </>
  );
};
