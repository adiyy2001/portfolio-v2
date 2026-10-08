import { StatusBar } from '../../../shared/StatusBar';
import { HomeIndicator } from '../../../shared/HomeIndicator';
import { color, radius, shadow } from '../tokens';
import { suggested, tickets, app } from '../content';
import { Abs, LargeTitle, NavTitle, ScreenBase, SectionHeader, TabBar, fontFamily, text } from '../components/ui';
import { Chevron } from '../components/glyphs';

export const Home = ({
  time,
  scroll = 0,
  highlight = 0,
  press = 0,
}: {
  time: string;
  scroll?: number;
  highlight?: number;
  press?: number;
}) => {
  const collapse = Math.min(1, scroll / 64);
  return (
    <ScreenBase background={color.grouped}>
      {time && <StatusBar time={time} color={color.ink} fontFamily={fontFamily} />}
      <NavTitle title="Bilety" collapse={collapse} background="242,244,246" />
      <Abs style={{ left: 0, right: 0, top: -scroll, height: 1200 }}>
        <LargeTitle title="Bilety" y={98} collapse={collapse} />
        <Abs
          style={{
            left: 16,
            top: 148,
            height: 32,
            padding: '0 14px 0 10px',
            borderRadius: radius.pill,
            background: color.surface,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 1px 2px rgba(16,20,24,0.06)',
            ...text('callout', { fontSize: 15 }),
          }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 13s4.5-4.2 4.5-7.4a4.5 4.5 0 0 0-9 0C2.5 8.8 7 13 7 13z" fill={color.brand} />
            <circle cx="7" cy="5.6" r="1.7" fill="#fff" />
          </svg>
          {app.zone}
        </Abs>
        <Abs
          style={{
            left: 16,
            right: 16,
            top: 196,
            height: 172,
            borderRadius: radius.card,
            background: color.surface,
            boxShadow: highlight > 0 ? `0 0 0 ${2.5 * highlight}px ${color.brand}, ${shadow.lift}` : shadow.card,
            transform: `scale(${1 - press * 0.03 + highlight * 0.012})`,
          }}>
          <Abs style={{ left: 18, top: 18, ...text('caption', { color: color.brandDeep, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }) }}>
            {suggested.kicker}
          </Abs>
          <Abs style={{ left: 18, top: 42, ...text('title') }}>{suggested.title}</Abs>
          <Abs style={{ left: 18, top: 74, ...text('callout', { fontWeight: 400, color: color.secondary }) }}>{suggested.detail}</Abs>
          <Abs style={{ left: 18, top: 114, fontFamily, fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: -0.4 }}>
            {suggested.price}
          </Abs>
          <Abs
            style={{
              right: 16,
              top: 110,
              width: 100,
              height: 44,
              borderRadius: radius.pill,
              background: color.brand,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...text('headline'),
            }}>
            {suggested.cta}
          </Abs>
        </Abs>
        <SectionHeader label="Wszystkie bilety" y={392} />
        <Abs style={{ left: 16, right: 16, top: 416, borderRadius: radius.row, background: color.surface, overflow: 'hidden' }}>
          {tickets.map((ticket, i) => (
            <div key={ticket.id} style={{ position: 'relative', height: 62, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={text('body', { fontWeight: 500 })}>{ticket.label}</div>
                <div style={text('caption', { fontWeight: 400, color: color.secondary })}>{ticket.note}</div>
              </div>
              <div style={text('headline')}>{ticket.price}</div>
              <Chevron />
              {i < tickets.length - 1 && <Abs style={{ left: 16, right: 0, bottom: 0, height: 1, background: color.separator }} />}
            </div>
          ))}
        </Abs>
        <Abs style={{ left: 34, right: 34, top: 674, ...text('caption', { fontWeight: 400, color: color.secondary }) }}>
          Bilety ulgowe kosztują połowę ceny. Ceny dotyczą strefy A.
        </Abs>
      </Abs>
      <TabBar active="Bilety" />
      <HomeIndicator color={color.ink} />
    </ScreenBase>
  );
};
