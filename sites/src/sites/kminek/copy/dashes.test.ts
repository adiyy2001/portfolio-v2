import { describe, expect, it } from 'vitest';
import { allergens } from '../data/allergens';
import { events } from '../data/events';
import { dishes, sections } from '../data/menu';
import { team } from '../data/team';
import { homeCopy } from './home';
import { menuCopy } from './menu';
import { shellCopy } from './shell';

const dashes = new RegExp(`[${String.fromCharCode(8211, 8212)}]`);

describe('site text', () => {
  it('contains no en dash or em dash', () => {
    const everything = [allergens, events, dishes, sections, team, homeCopy, menuCopy, shellCopy];
    expect(dashes.test(JSON.stringify(everything))).toBe(false);
  });
});
