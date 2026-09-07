export type TabRoute = 'index' | 'packs' | 'binder' | 'vault' | 'rewards';

const tabIcons = {
  index: ['storefront', 'storefront-outline'],
  packs: ['cube', 'cube-outline'],
  binder: ['albums', 'albums-outline'],
  vault: ['diamond', 'diamond-outline'],
  rewards: ['gift', 'gift-outline'],
} as const;

export function getTabIconName(route: TabRoute, focused: boolean) {
  return tabIcons[route][focused ? 0 : 1];
}
