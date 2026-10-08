import { color, radius } from '../tokens';
import { purchase } from '../content';
import { Abs, Sheet, fontFamily, text } from '../components/ui';
import { CardGlyph, Check, Chevron } from '../components/glyphs';
import { mix } from '../../../shared/motion';
import { HomeIndicator } from '../../../shared/HomeIndicator';

export const buySheetHeight = 482;

export const BuySheet = ({
  rise,
  press = 0,
  morph = 0,
  check = 0,
}: {
  rise: number;
  press?: number;
  morph?: number;
  check?: number;
}) => {
  const top = mix(960, 960 - buySheetHeight, rise);
  const buttonWidth = mix(411, 56, morph);
  return (
    <Sheet top={top} height={buySheetHeight + 40}>
      <Abs style={{ left: 18, top: 28, ...text('title') }}>{purchase.title}</Abs>
      <Abs style={{ left: 18, top: 58, ...text('callout', { fontWeight: 400, color: color.secondary }) }}>{purchase.subtitle}</Abs>
      <Abs
        style={{
          right: 16,
          top: 24,
          width: 30,
          height: 30,
          borderRadius: 15,
          background: color.grouped,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 2l8 8M10 2l-8 8" stroke={color.secondary} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Abs>
      <Abs style={{ left: 16, right: 16, top: 98, height: 36, borderRadius: 10, background: color.grouped, display: 'flex', padding: 2, boxSizing: 'border-box' }}>
        {purchase.kinds.map((kind, i) => (
          <div
            key={kind}
            style={{
              flex: 1,
              borderRadius: 8,
              background: i === 0 ? color.surface : 'transparent',
              boxShadow: i === 0 ? '0 1px 3px rgba(16,20,24,0.12)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...text('callout', { fontSize: 15, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? color.ink : color.secondary }),
            }}>
            {kind}
          </div>
        ))}
      </Abs>
      <Abs style={{ left: 16, right: 16, top: 152 }}>
        <div style={{ height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${color.separator}` }}>
          <span style={text('body')}>{purchase.quantityLabel}</span>
          <span style={{ display: 'flex', alignItems: 'center', borderRadius: 9, background: color.grouped, height: 34 }}>
            <span style={{ width: 44, textAlign: 'center', ...text('title', { fontWeight: 500, color: color.tertiary }) }}>−</span>
            <span style={{ width: 28, textAlign: 'center', ...text('headline') }}>{purchase.quantity}</span>
            <span style={{ width: 44, textAlign: 'center', ...text('title', { fontWeight: 500, color: color.brand }) }}>+</span>
          </span>
        </div>
        <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${color.separator}` }}>
          <span style={{ flex: 1, ...text('body') }}>{purchase.payment}</span>
          <CardGlyph />
          <span style={text('body', { color: color.secondary })}>{purchase.card}</span>
          <Chevron />
        </div>
        <div style={{ height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={text('body', { color: color.secondary })}>{purchase.totalLabel}</span>
          <span style={{ fontFamily, fontSize: 26, lineHeight: '32px', fontWeight: 800, letterSpacing: -0.3 }}>{purchase.total}</span>
        </div>
      </Abs>
      <Abs style={{ left: 16, right: 16, top: 360, height: 56, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: buttonWidth,
            height: 56,
            borderRadius: mix(radius.button, 28, morph),
            background: press > 0.5 && morph === 0 ? color.brandDeep : color.brand,
            transform: `scale(${1 - press * 0.03})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            ...text('headline'),
          }}>
          {morph < 0.5 ? <span style={{ opacity: 1 - morph * 2 }}>{purchase.pay}</span> : <Check size={30} progress={check} width={3.2} />}
        </div>
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 428, textAlign: 'center', opacity: check, ...text('callout', { color: color.brandDeep, fontWeight: 600 }) }}>
        {purchase.paid}
      </Abs>
      <Abs style={{ left: 0, right: 0, top: 0, height: buySheetHeight }}>
        <HomeIndicator color={color.ink} />
      </Abs>
    </Sheet>
  );
};
