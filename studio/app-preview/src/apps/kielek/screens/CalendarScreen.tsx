import { mix } from '../../../shared/motion';
import { clay, clayPressed, color } from '../tokens';
import { calendar, dayLabel } from '../content';
import { T } from '../timeline';
import { Box, Drop, DropGlyph, PlantAvatar, Text } from '../components/ui';
import { arc, bounceAt, dropFall, enter, inOut, landing, leave, progress, puffIn, rest, type Body } from '../components/motion';

const col = (c: number) => 24 + c * 57.5;
const row = (r: number) => 296 + r * 64;
const pill = { w: 50, h: 56 } as const;

const cell = (day: number) => {
  const i = day - calendar.firstDay;
  return { c: i % 7, r: Math.floor(i / 7) };
};

const dropBase = (day: number) => {
  const { c, r } = cell(day);
  return { x: col(c) + pill.w / 2, y: row(r) + 50 };
};

interface DropState {
  key: string;
  x: number;
  y: number;
  body: Body;
  opacity: number;
}

const drops = (f: number, still: boolean): DropState[] => {
  if (still) return calendar.winter.days.map(day => ({ key: `w${day}`, ...dropBase(day), body: rest, opacity: 1 }));
  const out: DropState[] = [];
  calendar.summer.days.forEach((day, i) => {
    const land = T.drops[i];
    const fall = dropFall(f, land, 64);
    if (!fall.visible) return;
    const base = dropBase(day);
    if (i === 1 || i === 2) {
      const at = T.hops[i - 1];
      const target = dropBase(calendar.winter.days[i]);
      if (f >= at) {
        const frames = 13;
        const t = progress(f, at, frames, inOut);
        const body = f < at + frames ? { y: 0, sx: 0.94, sy: 1.08 } : landing(f, at + frames);
        out.push({ key: `s${day}`, x: mix(base.x, target.x, t), y: mix(base.y, target.y, t) + arc(t, 46), body, opacity: 1 });
        return;
      }
    }
    if (i === 3 && f >= T.vanish) {
      const t = progress(f, T.vanish, 8);
      if (t >= 1) return;
      out.push({ key: `s${day}`, ...base, body: { y: 0, sx: 1 - t, sy: 1 - t }, opacity: 1 - t });
      return;
    }
    out.push({ key: `s${day}`, x: base.x, y: base.y + fall.y, body: fall.body, opacity: 1 });
  });
  return out;
};

export const CalendarScreen = ({ f, still = false }: { f: number; still?: boolean }) => {
  const winter = still ? 1 : bounceAt(f, T.seasonSwitch);
  const thumbX = 29 + mix(0, 192, winter);
  const days = Array.from({ length: calendar.rows * 7 }, (_, i) => calendar.firstDay + i);
  return (
    <>
      <div style={enter(f, T.calHeader, still, 34, 110)}>
        <Text x={24} y={62} size={28} weight={900}>
          {calendar.title}
        </Text>
        <PlantAvatar plant={calendar.plant} size={46} id="cal-plant" x={24} y={106} />
        <Text x={82} y={106} size={18} weight={900}>
          {calendar.plant.name}
        </Text>
        <Text x={82} y={130} size={13} tone={color.inkSoft}>
          {calendar.plant.species} · {calendar.plant.ml} ml
        </Text>
      </div>
      <div style={enter(f, T.calSeason, still, 34, 197)}>
        <div style={{ position: 'absolute', left: 24, top: 168, width: 395, height: 58, borderRadius: 29, background: color.card, boxShadow: clayPressed }} />
        <div style={{ position: 'absolute', left: thumbX, top: 174, width: 190, height: 46, borderRadius: 23, background: color.butter, boxShadow: clay(0.4, 0.8) }} />
        {[calendar.summer, calendar.winter].map((season, i) => (
          <div key={season.label} style={{ position: 'absolute', left: 29 + i * 192, top: 176, width: 190, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 900, lineHeight: '20px' }}>{season.label}</div>
            <div style={{ fontSize: 12, fontWeight: 800, lineHeight: '17px', color: color.inkSoft }}>{season.every}</div>
          </div>
        ))}
      </div>
      <div style={enter(f, T.calRows - 4, still, 34, 262)}>
        <Text x={24} y={242} size={17} weight={900}>
          {calendar.month}
        </Text>
        {calendar.weekdays.map((d, c) => (
          <Text key={d} x={col(c)} y={268} w={pill.w} align="center" size={12} weight={800} tone={color.inkSoft}>
            {d}
          </Text>
        ))}
      </div>
      {days.map(day => {
        const { c, r } = cell(day);
        const isToday = day === calendar.today;
        const muted = day < calendar.today || day > 31;
        return (
          <div key={day} style={enter(f, T.calRows + r * T.rowStep + c * 0.6, still, 22, row(r) + pill.h / 2)}>
            <Box x={col(c)} y={row(r)} w={pill.w} h={pill.h} r={18} tone={isToday ? 'butter' : 'card'} lift={0.35}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 5, textAlign: 'center', fontSize: 14, fontWeight: 900, color: muted ? color.inkSoft : color.ink }}>{dayLabel(day)}</div>
            </Box>
          </div>
        );
      })}
      {drops(f, still).map(d => (
        <Drop key={d.key} x={d.x} y={d.y} w={20} id={`cal-${d.key}`} body={d.body} style={{ opacity: d.opacity, zIndex: 10 }} />
      ))}
      <div style={still ? {} : puffIn(f, T.note, false, '221px 640px')}>
        <Box x={24} y={570} w={395} h={140} tone="water">
          <div style={{ position: 'absolute', left: 20, top: 22, width: 46, height: 46, borderRadius: 23, background: color.card, boxShadow: clay(0.3, 0.7), display: 'grid', placeItems: 'center' }}>
            <DropGlyph size={18} id="note-drop" />
          </div>
          <Text x={80} y={20} size={19} weight={900}>
            {calendar.noteTitle}
          </Text>
          <Text x={80} y={50} w={290} size={14} tone={color.inkSoft} line={1.45}>
            {calendar.note}
          </Text>
        </Box>
      </div>
    </>
  );
};

export const calendarLeave = (f: number) => leave(f, T.diagnosis);
