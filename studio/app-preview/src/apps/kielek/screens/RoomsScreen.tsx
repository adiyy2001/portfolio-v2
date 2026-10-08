import { clay, clayPressed, color } from '../tokens';
import { rooms } from '../content';
import { T } from '../timeline';
import { Box, DropGlyph, Pill, PlantAvatar, Text } from '../components/ui';
import { bounceAt, enter, progress, puffIn } from '../components/motion';

const tiles = [
  { y: 134, h: 122 },
  { y: 270, h: 236 },
  { y: 520, h: 122 },
];

const bar = { x: 20, y: 152, w: 355, h: 26 } as const;

export const RoomsScreen = ({ f, still = false }: { f: number; still?: boolean }) => {
  const focus = still ? 1 : bounceAt(f, T.focus);
  const fill = still ? 1 : progress(f, T.bar, 22);
  const humidity = Math.round(rooms.list[1].humidity * fill);
  return (
    <>
      <div style={enter(f, T.roomHeader, still, 34, 90)}>
        <Text x={24} y={62} size={28} weight={900}>
          {rooms.title}
        </Text>
        <Text x={24} y={98} size={15} tone={color.inkSoft}>
          {rooms.subtitle}
        </Text>
      </div>
      {rooms.list.map((room, i) => {
        const tile = tiles[i];
        const isFocus = room.id === rooms.focus;
        const ring = isFocus ? Math.min(1, focus) : 0;
        const bump = isFocus && !still ? 1 + 0.025 * Math.sin(Math.PI * Math.min(1, progress(f, T.focus, 12, t => t))) : 1;
        return (
          <div key={room.id} style={enter(f, T.tiles[i], still, 34, tile.y + tile.h / 2)}>
            <div style={{ position: 'absolute', left: 24, top: tile.y, width: 395, height: tile.h, transform: `scale(${bump})` }}>
              <Box x={0} y={0} w={395} h={tile.h} r={32} style={ring > 0 ? { boxShadow: `0 0 0 ${4 * ring}px ${color.blush}, ${clay()}` } : undefined}>
                <Text x={20} y={16} size={21} weight={900}>
                  {room.name}
                </Text>
                <Text x={20} y={46} size={13} tone={color.inkSoft}>
                  {room.window} · {room.light}
                </Text>
                <div style={{ position: 'absolute', right: 18, top: 16 }}>
                  <Pill size={14} tone={isFocus && ring > 0.5 ? 'blush' : 'water'} flat={false}>
                    <DropGlyph size={12} id={`room-${room.id}`} />
                    {isFocus ? `${still ? room.humidity : Math.max(humidity, 0)}%` : `${room.humidity}%`}
                  </Pill>
                </div>
                <div style={{ position: 'absolute', left: 20, top: 74, display: 'flex', gap: 8 }}>
                  {room.plants.map(plant => (
                    <PlantAvatar key={plant.id} plant={plant} size={36} id={`room-${room.id}-${plant.id}`} />
                  ))}
                </div>
                {isFocus && (
                  <>
                    <Text x={20} y={126} size={13} weight={800}>
                      Wilgotność powietrza
                    </Text>
                    <div style={{ position: 'absolute', left: bar.x, top: bar.y, width: bar.w, height: bar.h, borderRadius: 13, background: color.ground, boxShadow: clayPressed }} />
                    <div
                      style={{
                        position: 'absolute',
                        left: bar.x + 3,
                        top: bar.y + 3,
                        width: Math.max(0, (bar.w - 6) * (rooms.list[1].humidity / 100) * fill),
                        height: bar.h - 6,
                        borderRadius: 10,
                        background: color.water,
                        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7)',
                      }}
                    />
                    <div style={{ position: 'absolute', left: bar.x + bar.w * (rooms.wants / 100) - 2, top: bar.y - 6, width: 4, height: bar.h + 12, borderRadius: 2, background: color.ink, opacity: still ? 1 : progress(f, T.flag - 6, 6) }} />
                    <div style={{ position: 'absolute', left: bar.x + bar.w * (rooms.wants / 100) - 92, top: bar.y + 38, ...puffIn(f, T.flag, still, '70% 0%') }}>
                      <Pill size={14} tone="blush" flat={false}>
                        {rooms.flag}
                      </Pill>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </div>
        );
      })}
      <div style={puffIn(f, T.tip, still, '221px 714px')}>
        <Box x={24} y={662} w={395} h={104} tone="butter">
          <div style={{ position: 'absolute', left: 18, top: 26, width: 52, height: 52, borderRadius: 26, background: color.card, boxShadow: clay(0.3, 0.7), display: 'grid', placeItems: 'center' }}>
            <svg viewBox="0 0 24 24" width="26" height="26">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke={color.ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Text x={84} y={20} w={292} size={15} weight={800} line={1.4}>
            {rooms.tip}
          </Text>
        </Box>
      </div>
    </>
  );
};
