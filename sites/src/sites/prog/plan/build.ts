import type { PlanNode, PlanRoom, PlanSplit, RoomKind } from './types';

const kindRules: readonly (readonly [RegExp, RoomKind])[] = [
  [/^salon/i, 'living'],
  [/^(kuchnia|aneks)/i, 'kitchen'],
  [/^(sypialnia|pokój)/i, 'bedroom'],
  [/^gabinet/i, 'office'],
  [/^(łazienka|wc|toaleta)/i, 'bath'],
  [/^(przedpokój|hol|korytarz)/i, 'hall'],
  [/^(garderoba|spiżarnia|komórka|pralnia|kotłownia|schowek)/i, 'storage'],
  [/^garaż/i, 'garage'],
];

export const isKnownRoomName = (name: string): boolean =>
  kindRules.some(([pattern]) => pattern.test(name));

export const kindOf = (name: string): RoomKind =>
  kindRules.find(([pattern]) => pattern.test(name))?.[1] ?? 'storage';

export const room = (name: string, area: number): PlanRoom => ({ name, area });

export const row = (...children: PlanNode[]): PlanSplit => ({ direction: 'row', children });

export const column = (...children: PlanNode[]): PlanSplit => ({ direction: 'column', children });

export const isRoom = (node: PlanNode): node is PlanRoom => 'name' in node;

export const nodeArea = (node: PlanNode): number =>
  isRoom(node) ? node.area : node.children.reduce((sum, child) => sum + nodeArea(child), 0);

export const roomsOf = (node: PlanNode): PlanRoom[] =>
  isRoom(node) ? [node] : node.children.flatMap(roomsOf);

const roundTenth = (value: number): number => Math.round(value * 10) / 10;

export const totalPlanArea = (nodes: readonly PlanNode[]): number =>
  roundTenth(nodes.reduce((sum, node) => sum + nodeArea(node), 0));
