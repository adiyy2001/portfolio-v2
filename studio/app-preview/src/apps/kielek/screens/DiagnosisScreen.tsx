import { color } from '../tokens';
import { diagnosis } from '../content';
import { T } from '../timeline';
import { Box, Chip, DropGlyph, Mascot, Pill, PlantAvatar, Text, Touch } from '../components/ui';
import { blinkAt, enter, landing, pressAt, progress, puffIn, rest, wiggleAt, type Body } from '../components/motion';
import type { Mood } from '../components/art';

const symptomPos = [
  { x: 24, y: 254 },
  { x: 222, y: 254 },
  { x: 24, y: 308 },
  { x: 204, y: 308 },
];
const soilPos = [
  { x: 24, y: 402 },
  { x: 130, y: 402 },
];

const helperPose = (f: number, still: boolean) => {
  if (still) return { mood: 'smile' as Mood, nod: 0, tilt: 0, body: rest };
  const worried = f < T.worryEnd;
  const nod = T.nods.reduce((sum, at) => sum + 7 * Math.sin(Math.PI * progress(f, at, 10, t => t)), 0);
  const body: Body = f < T.helper + 14 ? landing(f, T.helper + 6) : rest;
  return { mood: (worried ? 'worry' : 'smile') as Mood, nod, tilt: worried ? -6 * progress(f, T.helper + 6, 8) : 0, body };
};

export const DiagnosisScreen = ({ f, still = false }: { f: number; still?: boolean }) => {
  const symptomOn = still || f >= T.tapSymptom + 3 ? 1 : 0;
  const soilOn = still || f >= T.tapSoil + 3 ? 1 : 0;
  const answerStyle = puffIn(f, T.answer, still, '120px 474px');
  const helper = helperPose(f, still);
  const touchA = still ? 0 : progress(f, T.tapSymptom - 2, 3) * (1 - progress(f, T.tapSymptom + 6, 5));
  const touchB = still ? 0 : progress(f, T.tapSoil - 2, 3) * (1 - progress(f, T.tapSoil + 6, 5));
  const helperIn = still || f >= T.helper;
  return (
    <>
      <div style={enter(f, T.diaHeader, still, 34, 90)}>
        <Text x={24} y={62} size={28} weight={900}>
          {diagnosis.title}
        </Text>
        <Text x={24} y={98} size={15} tone={color.inkSoft}>
          {diagnosis.subtitle}
        </Text>
      </div>
      <div style={enter(f, T.diaPlant, still, 34, 169)}>
        <Box x={24} y={130} w={395} h={78} lift={0.7}>
          <PlantAvatar plant={diagnosis.plant} size={52} id="dia-plant" x={14} y={13} />
          <Text x={80} y={16} size={18} weight={900}>
            {diagnosis.plant.name}
          </Text>
          <Text x={80} y={42} size={13} tone={color.inkSoft}>
            {diagnosis.plant.species} · {diagnosis.plant.room}
          </Text>
        </Box>
      </div>
      <div style={enter(f, T.diaQ1, still, 34, 234)}>
        <Text x={24} y={224} size={17} weight={900}>
          {diagnosis.question}
        </Text>
      </div>
      {diagnosis.symptoms.map((label, i) => (
        <div key={label} style={{ position: 'absolute', left: symptomPos[i].x, top: symptomPos[i].y, ...enter(f, T.diaChips + i * T.chipStep, still, 20) }}>
          <Chip label={label} on={i === 0 ? symptomOn : 0} press={i === 0 && !still ? pressAt(f, T.tapSymptom) : 0} />
        </div>
      ))}
      <div style={enter(f, T.diaQ2, still, 34, 382)}>
        <Text x={24} y={372} size={17} weight={900}>
          {diagnosis.soilQuestion}
        </Text>
      </div>
      {diagnosis.soil.map((label, i) => (
        <div key={label} style={{ position: 'absolute', left: soilPos[i].x, top: soilPos[i].y, ...enter(f, T.diaSoil + i * T.chipStep, still, 20) }}>
          <Chip label={label} on={i === 0 ? soilOn : 0} press={i === 0 && !still ? pressAt(f, T.tapSoil) : 0} />
        </div>
      ))}
      <Touch x={symptomPos[0].x + 90} y={symptomPos[0].y + 22} t={touchA} />
      <Touch x={soilPos[0].x + 44} y={soilPos[0].y + 22} t={touchB} />
      {(still || f >= T.answer) && (
        <div style={answerStyle}>
          <Box x={24} y={474} w={395} h={248} tone="blush">
            <Text x={24} y={24} size={13} weight={800} style={{ letterSpacing: 0.4 }}>
              ODPOWIEDŹ KIEŁKA
            </Text>
            <Text x={24} y={46} size={26} weight={900}>
              {diagnosis.answerTitle}
            </Text>
            <Text x={24} y={88} w={300} size={15} line={1.45}>
              {diagnosis.answer}
            </Text>
            <div style={{ position: 'absolute', left: 24, top: 186 }}>
              <Pill size={14} tone="card" flat={false}>
                <DropGlyph size={12} id="dia-next" />
                {diagnosis.next}
              </Pill>
            </div>
          </Box>
        </div>
      )}
      {helperIn && (
        <div style={still ? {} : puffIn(f, T.helper, false, '367px 500px')}>
          <Mascot
            x={322}
            y={396}
            w={90}
            body={helper.body}
            pose={{ id: 'dia-helper', mood: helper.mood, nod: helper.nod, tilt: helper.tilt, blink: blinkAt(f, 466), leafL: wiggleAt(f, 50, 5), leafR: wiggleAt(f, 50, 22), lookX: -3, lookY: 3 }}
            style={{ zIndex: 20 }}
          />
        </div>
      )}
    </>
  );
};

