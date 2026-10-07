import type { ComponentProps } from 'react';
import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, radius } from '../tokens';
import { myTickets } from '../content';
import { Abs, LargeTitle, ScreenBase, SectionHeader, TabBar, fontFamily, text } from '../components/ui';
import { TicketCard, compactCard } from '../components/TicketCard';
import { mix } from '../../../shared/motion';

export const cardSlot = { left: 16, top: 156, width: compactCard.width, height: compactCard.height } as const;

export const MyTickets = ({
  time,
  land = 1,
  hideCard = false,
  bump = 0,
  card,
}: {
  time: string;
  land?: number;
  hideCard?: boolean;
  bump?: number;
  card?: ComponentProps<typeof TicketCard>;
}) => {
  const shift = mix(0, compactCard.height + 28, Math.min(1, land));
  return (
    <ScreenBase background={color.grouped}>
      {time && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
      <LargeTitle title={myTickets.title} y={98} />
      {!hideCard && land > 0 && (
        <Abs
          style={{
            ...cardSlot,
            top: cardSlot.top - 70 * (1 - land),
            opacity: Math.min(1, land * 1.6),
            transform: `scale(${mix(0.94, 1, land) + bump * 0.02})`,
          }}>
          <TicketCard frame={0} {...card} />
        </Abs>
      )}
      <Abs style={{ left: 0, right: 0, top: shift }}>
        <SectionHeader label={myTickets.usedTitle} y={164} />
        <Abs style={{ left: 16, right: 16, top: 188, borderRadius: radius.row, background: color.surface, overflow: 'hidden' }}>
          {myTickets.used.map((item, i) => (
            <div key={item.title} style={{ position: 'relative', height: 64, padding: '11px 16px', boxSizing: 'border-box' }}>
              <div style={text('body', { fontWeight: 500, color: color.secondary })}>{item.title}</div>
              <div style={text('caption', { fontWeight: 400, color: color.secondary })}>{item.meta}</div>
              {i === 0 && <Abs style={{ left: 16, right: 0, bottom: 0, height: 1, background: color.separator }} />}
            </div>
          ))}
        </Abs>
      </Abs>
      <TabBar active="Moje" />
      <HomeIndicator color={color.ink} />
    </ScreenBase>
  );
};
