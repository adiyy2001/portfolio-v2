import type { ComponentProps } from 'react';
import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, radius } from '../tokens';
import { liveTicket } from '../content';
import { Abs, Button, ScreenBase, fontFamily, text } from '../components/ui';
import { Close } from '../components/glyphs';
import { TicketCard, fullCard } from '../components/TicketCard';

export const liveSlot = { left: 16, top: 108, width: fullCard.width, height: fullCard.height } as const;

export const LiveTicket = ({
  time,
  card,
  hideCard = false,
  chrome = 1,
  pressInspector = 0,
}: {
  time: string;
  card: ComponentProps<typeof TicketCard>;
  hideCard?: boolean;
  chrome?: number;
  pressInspector?: number;
}) => (
  <ScreenBase background={color.brandTint}>
    {time && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
    <Abs style={{ inset: 0, opacity: chrome }}>
      <Abs
        style={{
          left: 16,
          top: 60,
          width: 34,
          height: 34,
          borderRadius: 17,
          background: color.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Close tint={color.ink} />
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 66, textAlign: 'center', ...text('headline') }}>{liveTicket.nav}</Abs>
      <Button label={liveTicket.inspector} pressed={pressInspector} style={{ left: 16, right: 16, top: 690 }} />
      <Button label={liveTicket.route} kind="tinted" style={{ left: 16, right: 16, top: 754, borderRadius: radius.button }} />
    </Abs>
    {!hideCard && (
      <Abs style={liveSlot}>
        <TicketCard {...card} expand={1} />
      </Abs>
    )}
    <HomeIndicator color={color.ink} />
  </ScreenBase>
);
