import { getTabIconName } from './navigationIcons';

describe('getTabIconName', () => {
  it.each([
    ['index', 'storefront', 'storefront-outline'],
    ['packs', 'cube', 'cube-outline'],
    ['binder', 'albums', 'albums-outline'],
    ['vault', 'diamond', 'diamond-outline'],
    ['rewards', 'gift', 'gift-outline'],
  ] as const)('uses filled and outlined icons for the %s tab', (tab, activeIcon, inactiveIcon) => {
    expect(getTabIconName(tab, true)).toBe(activeIcon);
    expect(getTabIconName(tab, false)).toBe(inactiveIcon);
  });
});
