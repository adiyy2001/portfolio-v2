import { clay, clayPressed, color } from '../tokens';
import { addPlant, plantScreen } from '../content';
import { Avatar, Box, Chip, DropGlyph, Pill, PlantAvatar, Text } from '../components/ui';

export const PlantScreen = () => {
  const p = plantScreen.plant;
  const r = 92;
  const c = 2 * Math.PI * r;
  return (
    <>
      <Text x={24} y={62} size={15} weight={800} tone={color.inkSoft}>
        ‹ Dziś
      </Text>
      <Text x={24} y={86} size={34} weight={900}>
        {p.name}
      </Text>
      <Text x={24} y={130} size={14} tone={color.inkSoft}>
        {p.species} · {p.latin}
      </Text>
      <div style={{ position: 'absolute', left: 221 - 116, top: 162, width: 232, height: 232, borderRadius: 116, background: color.card, boxShadow: clay(1) }} />
      <svg width="232" height="232" viewBox="0 0 232 232" style={{ position: 'absolute', left: 221 - 116, top: 162 }}>
        <circle cx="116" cy="116" r={r} fill="none" stroke={color.ground} strokeWidth="18" />
        <circle cx="116" cy="116" r={r} fill="none" stroke={color.water} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${c * 0.999} ${c}`} transform="rotate(-90 116 116)" />
      </svg>
      <PlantAvatar plant={p} size={146} id="plant-big" x={221 - 73} y={278 - 73} />
      <Text x={0} y={408} w={443} align="center" size={15} weight={800} tone={color.inkSoft}>
        Następne podlewanie za {plantScreen.ringLeft} dni
      </Text>
      <Text x={0} y={432} w={443} align="center" size={22} weight={900}>
        {plantScreen.next}
      </Text>
      {plantScreen.facts.map((fact, i) => (
        <Box key={fact.label} x={24 + (i % 2) * 205} y={474 + Math.floor(i / 2) * 124} w={190} h={112} r={26} lift={0.7}>
          <Text x={16} y={14} size={12} weight={800} tone={color.inkSoft}>
            {fact.label.toUpperCase()}
          </Text>
          <Text x={16} y={33} w={164} size={16} weight={900} line={1.2}>
            {fact.value}
          </Text>
          <Text x={16} y={84} w={164} size={12} tone={color.inkSoft}>
            {fact.note}
          </Text>
        </Box>
      ))}
      <Text x={24} y={728} size={15} weight={900}>
        Ostatnio podlana
      </Text>
      <div style={{ position: 'absolute', left: 24, top: 756, display: 'flex', gap: 8 }}>
        {plantScreen.history.map((day, i) => (
          <Pill key={day} size={14} tone={i === 0 ? 'pistachio' : 'card'} flat={false}>
            <DropGlyph size={11} id={`hist-${i}`} />
            {day}
          </Pill>
        ))}
      </div>
    </>
  );
};

export const AddScreen = () => (
  <>
    <Text x={24} y={62} size={28} weight={900}>
      {addPlant.title}
    </Text>
    <div style={{ position: 'absolute', left: 24, top: 108, width: 395, height: 58, borderRadius: 29, background: color.card, boxShadow: clayPressed, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', boxSizing: 'border-box', fontSize: 18, fontWeight: 800 }}>
      <svg viewBox="0 0 24 24" width="22" height="22">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke={color.ink} strokeWidth="2.6" />
        <path d="M15.5 15.5 20 20" stroke={color.ink} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span>{addPlant.query}</span>
      <span style={{ width: 2.5, height: 24, borderRadius: 2, background: color.ink, marginLeft: -10 }} />
    </div>
    <Text x={24} y={186} size={13} weight={800} tone={color.inkSoft}>
      3 GATUNKI
    </Text>
    {addPlant.results.map((item, i) => (
      <Box key={item.name} x={24} y={212 + i * 102} w={395} h={90} tone={i === 0 ? 'butter' : 'card'} lift={i === 0 ? 1 : 0.6}>
        <Avatar species={item.glyph} tone={item.tone} size={58} id={`add-${i}`} x={14} y={16} />
        <Text x={86} y={14} size={17} weight={900}>
          {item.name}
        </Text>
        <Text x={86} y={38} size={13} tone={color.inkSoft}>
          {item.latin}
        </Text>
        <Text x={86} y={58} w={290} size={13} weight={800}>
          {item.care}
        </Text>
      </Box>
    ))}
    <Text x={24} y={534} size={17} weight={900}>
      {addPlant.roomsTitle}
    </Text>
    {addPlant.rooms.map((room, i) => (
      <div key={room} style={{ position: 'absolute', left: [24, 134, 266][i], top: 566 }}>
        <Chip label={room} on={i === 0 ? 1 : 0} />
      </div>
    ))}
    <div style={{ position: 'absolute', left: 24, top: 650, width: 395, height: 62, borderRadius: 31, background: color.pistachio, boxShadow: clay(0.9), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>
      {addPlant.cta}
    </div>
  </>
);
