import { describe, expect, it } from 'vitest';
import { findMember, membersFor, team } from './team';
import { treatments } from './treatments';

describe('team', () => {
  it('has unique ids', () => {
    const ids = team.map(member => member.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists only treatments that exist', () => {
    const slugs = new Set(treatments.map(treatment => treatment.slug));
    team.forEach(member => member.treatments.forEach(slug => expect(slugs.has(slug)).toBe(true)));
  });

  it('agrees with the treatments on who treats what', () => {
    treatments.forEach(treatment => {
      const fromTeam = membersFor(treatment.slug)
        .map(member => member.id)
        .sort();
      expect(fromTeam).toEqual([...treatment.doctors].sort());
    });
  });

  it('throws on an unknown member', () => {
    expect(() => findMember('nie-ma')).toThrow('Unknown team member: nie-ma');
  });
});
