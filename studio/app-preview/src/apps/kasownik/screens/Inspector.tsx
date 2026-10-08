import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, radius } from '../tokens';
import { inspector, liveTicket } from '../content';
import { Abs, LiveBand, QrCode, ScreenBase, clockText, fontFamily, text } from '../components/ui';
import { Sun } from '../components/glyphs';
import { fullCard } from '../components/TicketCard';
import { liveSlot } from './LiveTicket';
import { mix } from '../../../shared/motion';

const tintRgb = [227, 244, 236];

export const Inspector = ({
  time,
  progress,
  frame,
  remaining,
  shimmer = -1,
  solid = true,
}: {
  time: string;
  progress: number;
  frame: number;
  remaining: number;
  shimmer?: number;
  solid?: boolean;
}) => {
  const p = progress;
  const qrSize = mix(fullCard.qr, 340, p);
  const qrLeft = mix(liveSlot.left + (fullCard.width - fullCard.qr) / 2, (443 - 340) / 2, p);
  const qrTop = mix(liveSlot.top + fullCard.qrTop, 196, p);
  const clockSize = mix(56, 76, p);
  const clockTop = mix(liveSlot.top + 318, 556, p);
  const rest = Math.min(1, Math.max(0, (p - 0.35) / 0.5));
  const bg = tintRgb.map(v => Math.round(mix(v, 255, p))).join(',');
  return (
    <ScreenBase background={solid ? `rgb(${bg})` : 'transparent'}>
      {solid && time && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
      <Abs style={{ left: 0, right: 0, top: 54, height: 46, opacity: rest }}>
        <LiveBand frame={frame} live={1} label={liveTicket.band} height={46} radiusTop={0} />
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 130, textAlign: 'center', opacity: rest, ...text('title') }}>{inspector.title}</Abs>
      <Abs style={{ left: qrLeft, top: qrTop }}>
        <QrCode data={liveTicket.qr} size={qrSize} shimmer={shimmer} />
      </Abs>
      <Abs
        style={{
          left: 0,
          right: 0,
          top: clockTop,
          textAlign: 'center',
          fontFamily,
          fontSize: clockSize,
          lineHeight: `${clockSize * 1.08}px`,
          fontWeight: 700,
          letterSpacing: -1,
          fontFeatureSettings: "'tnum'",
        }}>
        {clockText(remaining)}
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 646, textAlign: 'center', opacity: rest, ...text('callout', { color: color.secondary }) }}>
        {liveTicket.remainingLabel} · {liveTicket.validUntil.toLowerCase()}
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 678, textAlign: 'center', opacity: rest, ...text('callout', { fontWeight: 600 }) }}>
        45 minut, normalny · strefa A
      </Abs>
      <Abs
        style={{
          left: 70,
          right: 70,
          top: 742,
          height: 40,
          borderRadius: radius.pill,
          background: color.grouped,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: rest,
          ...text('callout', { fontSize: 15, color: color.secondary }),
        }}>
        <Sun tint={color.secondary} />
        {inspector.brightness}
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 800, textAlign: 'center', opacity: rest, ...text('caption', { color: color.secondary }) }}>
        {inspector.hint}
      </Abs>
      {solid && <HomeIndicator color={color.ink} />}
    </ScreenBase>
  );
};
