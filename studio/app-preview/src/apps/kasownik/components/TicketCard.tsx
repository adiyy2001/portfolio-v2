import { color, radius, shadow } from '../tokens';
import { liveTicket, myTickets } from '../content';
import { Abs, LiveBand, QrCode, Ring, clockText, fontFamily, text } from './ui';
import { Check } from './glyphs';
import { mix, window01 } from '../../../shared/motion';

export const compactCard = { width: 411, height: 200 } as const;
export const fullCard = { width: 411, height: 560, qr: 232, qrTop: 72 } as const;

export const TicketCard = ({
  frame,
  expand = 0,
  hold = 0,
  validated = 0,
  live = 0,
  remaining = liveTicket.lengthSeconds,
  wave = 1,
  shimmer = -1,
  hideQr = false,
  hideClock = false,
  touch = 0,
  swap,
}: {
  frame: number;
  expand?: number;
  hold?: number;
  validated?: number;
  live?: number;
  remaining?: number;
  wave?: number;
  shimmer?: number;
  hideQr?: boolean;
  hideClock?: boolean;
  touch?: number;
  swap?: number;
}) => {
  const label = swap ?? validated;
  const bandHeight = mix(36, 46, expand);
  const compactOpacity = Math.max(0, 1 - expand * 2.6);
  const fullOpacity = Math.min(1, Math.max(0, (expand - 0.4) / 0.45));
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: radius.card,
        background: color.surface,
        boxShadow: shadow.card,
        overflow: 'hidden',
      }}>
      <LiveBand frame={frame} live={live} label={liveTicket.band} height={bandHeight} fill={validated} />
      {live < 1 && (
        <>
          <Abs
            style={{
              left: 16,
              top: 0,
              height: bandHeight,
              display: 'flex',
              alignItems: 'center',
              color: color.brandDeep,
              opacity: (1 - window01(validated, 0, 0.45)) * (1 - live),
              ...text('caption', { fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase' }),
            }}>
            {myTickets.ready}
          </Abs>
          <Abs
            style={{
              left: 16,
              top: 0,
              height: bandHeight,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#fff',
              opacity: window01(validated, 0.55, 1) * (1 - live),
              ...text('caption', { fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase' }),
            }}>
            <Check size={16} progress={validated} width={3.4} />
            {myTickets.validated}
          </Abs>
        </>
      )}
      {compactOpacity > 0 && (
        <Abs style={{ inset: 0, opacity: compactOpacity }}>
          <Abs style={{ left: 16, top: 50, ...text('title') }}>{myTickets.card.title}</Abs>
          <Abs style={{ right: 16, top: 52, ...text('headline') }}>{myTickets.card.price}</Abs>
          <Abs style={{ left: 16, top: 82, ...text('callout', { fontWeight: 400, color: color.secondary }) }}>
            {myTickets.card.meta}
          </Abs>
          <Abs
            style={{
              left: 16,
              right: 16,
              top: 128,
              height: 54,
              borderRadius: radius.button,
              background: color.brandTint,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 16px',
              color: color.brandDeep,
              transform: `scale(${1 - touch * 0.025})`,
              ...text('headline'),
            }}>
            <Ring progress={hold} />
            <span style={{ position: 'relative', flex: 1, height: 22 }}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  whiteSpace: 'nowrap',
                  opacity: 1 - window01(label, 0, 0.4),
                  transform: `translateY(${-6 * window01(label, 0, 0.4)}px)`,
                }}>
                {myTickets.hold}
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  whiteSpace: 'nowrap',
                  opacity: window01(label, 0.55, 1),
                  transform: `translateY(${6 * (1 - window01(label, 0.55, 1))}px)`,
                }}>
                {myTickets.done}
              </span>
            </span>
          </Abs>
          {touch > 0 && (
            <Abs
              style={{
                left: 47 - 22 * touch,
                top: 155 - 22 * touch,
                width: 44 * touch,
                height: 44 * touch,
                borderRadius: 999,
                background: 'rgba(16,20,24,0.14)',
              }}
            />
          )}
        </Abs>
      )}
      {fullOpacity > 0 && (
        <Abs style={{ left: 0, top: 0, width: fullCard.width, height: fullCard.height, opacity: fullOpacity }}>
          {!hideQr && (
            <Abs style={{ left: (fullCard.width - fullCard.qr) / 2, top: fullCard.qrTop }}>
              <QrCode data={liveTicket.qr} size={fullCard.qr} wave={wave} shimmer={shimmer} />
            </Abs>
          )}
          {!hideClock && (
            <Abs style={{ left: 0, right: 0, top: 318, textAlign: 'center', ...text('clock'), letterSpacing: -1 }}>
              {clockText(remaining)}
            </Abs>
          )}
          <Abs
            style={{
              left: 0,
              right: 0,
              top: 384,
              textAlign: 'center',
              ...text('callout', { fontWeight: 500, color: color.secondary }),
            }}>
            {liveTicket.remainingLabel} · {liveTicket.validUntil.toLowerCase()}
          </Abs>
          <Abs style={{ left: 16, right: 16, top: 422, height: 1, background: color.separator }} />
          {liveTicket.rows.map(([label, value], i) => (
            <Abs
              key={label}
              style={{
                left: 16,
                right: 16,
                top: 436 + i * 30,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily,
                fontSize: 15,
                lineHeight: '22px',
              }}>
              <span style={{ color: color.secondary }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </Abs>
          ))}
          <Abs style={{ left: 0, right: 0, top: 530, textAlign: 'center', ...text('caption', { color: color.secondary }) }}>
            {liveTicket.number}
          </Abs>
        </Abs>
      )}
    </div>
  );
};
