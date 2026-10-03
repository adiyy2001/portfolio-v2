import type { Product, WeightGrams } from '../data/types';
import { buildAccessoryLabel, buildCoffeeLabel, fieldColors, labelSize } from '../lib/label';
import type { LabelLine } from '../lib/label';
import { AccessoryArt } from './AccessoryArt';

interface LabelProps {
  product: Product;
  weight?: WeightGrams;
  decorative?: boolean;
}

interface TextProps {
  line: LabelLine;
  tone: 7 | 8 | 9;
  anchor?: 'end';
  spacing?: number;
  stretch?: boolean;
}

const LabelText = ({ line, tone, anchor, spacing, stretch }: TextProps) => (
  <text
    class={`lb-t lt${tone}`}
    x={anchor === 'end' ? labelSize.width - labelSize.margin : labelSize.margin}
    y={line.y}
    font-size={line.size}
    text-anchor={anchor}
    letter-spacing={spacing}
    textLength={stretch ? line.width : undefined}
    lengthAdjust={stretch ? 'spacingAndGlyphs' : undefined}>
    {line.text}
  </text>
);

const Frame = ({ lot, valve }: { lot: string; valve: boolean }) => (
  <>
    <path class="lb-strip" d="M0 0H264L300 36V40H0Z" />
    <text class="lb-mark" x="14" y="29">
      TRZASK
    </text>
    <text class="lb-lot" x={valve ? 240 : 268} y="25" text-anchor="end">
      {lot}
    </text>
    {valve && (
      <>
        <circle class="lb-valve" cx="262" cy="19" r="8" />
        <circle class="lb-valve-dot" cx="262" cy="19" r="2.5" />
      </>
    )}
  </>
);

export const Label = ({ product, weight = 250, decorative = false }: LabelProps) => {
  const model =
    product.kind === 'coffee' ? buildCoffeeLabel(product, weight) : buildAccessoryLabel(product);
  const colors = fieldColors[model.field];
  const a11y = decorative
    ? { 'aria-hidden': 'true' as const }
    : { role: 'img' as const, 'aria-label': model.aria };
  return (
    <svg
      class="label"
      viewBox={`0 0 ${labelSize.width} ${labelSize.height}`}
      focusable="false"
      style={{ '--f': colors.fill, '--i': colors.ink }}
      {...a11y}>
      <path class="lb-f" d="M0 0H264L300 36V400H0Z" />
      <Frame lot={model.lot} valve={model.kind === 'coffee'} />
      {model.title.map(line => (
        <LabelText key={line.text} line={line} tone={9} stretch />
      ))}
      <LabelText line={model.region} tone={7} spacing={2} />
      {model.kind === 'coffee' ? (
        <>
          <path class="lb-c" d={model.curve.path} />
          <circle class="lb-ring" cx={model.curve.crack.x} cy={model.curve.crack.y} r="6" />
          {model.curve.second && (
            <circle class="lb-dot" cx={model.curve.second.x} cy={model.curve.second.y} r="3.5" />
          )}
          <LabelText line={model.curve.caption} tone={7} anchor="end" spacing={1.5} />
          {model.notes.map(note => (
            <LabelText key={note.text} line={note} tone={8} />
          ))}
          {model.scale.map(cell => (
            <rect
              key={cell.x}
              class={cell.filled ? 'lb-on' : 'lb-off'}
              x={cell.x}
              y="356"
              width="36"
              height="6"
            />
          ))}
        </>
      ) : (
        <g transform="translate(14 196)">
          <AccessoryArt art={model.art} />
        </g>
      )}
      <LabelText line={model.footLeft} tone={7} spacing={1.5} />
      <LabelText line={model.footRight} tone={7} anchor="end" spacing={1.5} />
    </svg>
  );
};
