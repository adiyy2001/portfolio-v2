import { generator } from '../content';
import { color, glow } from '../tokens';
import { T } from '../timeline';
import { Abs, Back, Button, Check, Label, Scramble, Screen, drawAt, inner, side } from '../components/ui';
import { scrambleGlyphs, settledAt } from '../components/scramble';

const cell = { w: 36, h: 50, gap: 3.5, top: 150 } as const;
const cellsLeft = (443 - (10 * cell.w + 9 * cell.gap)) / 2;
const passOpts = { step: T.cellStep, min: 6, max: 10, seed: 11 };

export const passwordSettled = settledAt(generator.password, T.cells, passOpts);

const tint = (ch: string) => (/[a-zA-Z]/.test(ch) ? color.text : color.cyan);

export const GeneratorScreen = ({ f, press = 0, done = 0, still = false }: { f: number; press?: number; done?: number; still?: boolean }) => {
  const start = still ? -999 : T.cells;
  const glyphs = scrambleGlyphs(generator.password, f, start, passOpts);
  const lit = still ? 5 : Math.max(0, Math.min(5, Math.floor((f - T.segments) / T.segmentStep) + 1));
  const bitsStart = still ? -999 : T.bits;
  const sliderT = 0.5;
  return (
    <Screen time={generator.time}>
      <Back title={generator.title} right={<Label>20 znaków</Label>} />
      <Abs style={{ left: side, right: side, top: 112, fontSize: 13, color: color.muted }}>dla: {generator.for}</Abs>
      {glyphs.map((g, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const settled = g.state === 'done';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cellsLeft + col * (cell.w + cell.gap),
              top: cell.top + row * (cell.h + 6),
              width: cell.w,
              height: cell.h,
              borderRadius: 3,
              background: color.panel,
              boxShadow: `inset 0 0 0 1px ${g.state === 'cycling' ? color.cyan : settled ? color.dim : color.grid}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 500,
              color: g.state === 'hidden' ? 'transparent' : g.state === 'cycling' ? color.cyan : tint(g.ch),
            }}>
            {g.ch}
          </div>
        );
      })}
      <Abs style={{ left: side, right: side, top: 286, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Label>siła</Label>
        <span style={{ fontSize: 14, fontWeight: 700, color: lit === 5 ? color.cyan : color.muted }}>{lit === 5 ? generator.strength : ' '}</span>
      </Abs>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: side + i * ((inner - 24) / 5 + 6),
            top: 312,
            width: (inner - 24) / 5,
            height: 8,
            borderRadius: 2,
            background: i < lit ? color.cyan : color.panel,
            boxShadow: i < lit ? glow(color.cyan, 0.45, 8) : `inset 0 0 0 1px ${color.dim}`,
          }}
        />
      ))}
      <Abs style={{ left: side, right: side, top: 338, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontSize: 15, color: color.muted }}>
          <Scramble text="ok." f={f} start={bitsStart} fill={color.muted} opts={{ step: 1 }} />
        </span>
        <span style={{ fontFamily: "'Oxanium', sans-serif", fontWeight: 800, fontSize: 60, lineHeight: '64px', color: color.text }}>
          <Scramble text="131" f={f} start={bitsStart + 2} opts={{ step: 2, min: 6, max: 9 }} />
        </span>
        <span style={{ fontSize: 15, color: color.muted }}>
          <Scramble text="bitów" f={f} start={bitsStart + 6} fill={color.muted} opts={{ step: 1 }} />
        </span>
      </Abs>
      <Abs style={{ left: side, right: side, top: 408, fontSize: 12, color: color.muted }}>
        <Scramble text={generator.formula} f={f} start={bitsStart + 10} fill={color.muted} opts={{ step: 1, min: 3, max: 5 }} />
      </Abs>
      <Abs style={{ left: side, right: side, top: 456, display: 'flex', justifyContent: 'space-between' }}>
        <Label>długość</Label>
        <span style={{ fontSize: 15, fontWeight: 700 }}>{generator.length}</span>
      </Abs>
      <div style={{ position: 'absolute', left: side, top: 494, width: inner, height: 2, background: color.dim }} />
      <div style={{ position: 'absolute', left: side, top: 494, width: inner * sliderT, height: 2, background: color.cyan, boxShadow: glow(color.cyan, 0.4, 6) }} />
      <div style={{ position: 'absolute', left: side + inner * sliderT - 10, top: 485, width: 20, height: 20, borderRadius: 3, background: color.void, boxShadow: `inset 0 0 0 2px ${color.cyan}, ${glow(color.cyan, 0.45, 10)}` }} />
      <Abs style={{ left: side, right: side, top: 512, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: color.muted }}>
        <span>8</span>
        <span>32</span>
      </Abs>
      <Abs style={{ left: side, top: 552 }}>
        <Label>znaki</Label>
      </Abs>
      {generator.classes.map((name, i) => (
        <div
          key={name}
          style={{
            position: 'absolute',
            left: side + i * ((inner - 30) / 4 + 10),
            top: 578,
            width: (inner - 30) / 4,
            height: 44,
            borderRadius: 3,
            background: color.panel,
            boxShadow: `inset 0 0 0 1.5px ${color.cyan}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 15,
            fontWeight: 700,
          }}>
          <Check size={14} />
          {name}
        </div>
      ))}
      <Abs style={{ left: side, right: side, top: 646, fontSize: 13, lineHeight: '19px', color: color.muted }}>
        Hasło trafi do sejfu i do formularza zmiany hasła na forum.
      </Abs>
      {done > 0 ? (
        <Button label={generator.done} top={792} tone="done" icon={<Check size={20} t={still ? 1 : drawAt(f, T.done + 2)} />} f={f} start={still ? -999 : T.done} />
      ) : (
        <Button label={generator.primary} top={792} press={press} />
      )}
    </Screen>
  );
};
