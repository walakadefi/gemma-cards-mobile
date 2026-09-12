import { unopenedPackBadge } from './navigationBadges';

describe('unopenedPackBadge', () => {
  it.each([
    [0, undefined],
    [1, '1'],
    [9, '9'],
    [10, '9+'],
  ])('formats %i sealed packs as %s', (count, expected) => {
    expect(unopenedPackBadge(count)).toBe(expected);
  });
});
