import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { getTabIconName, TabRoute } from '../../src/components/navigationIcons';
import { unopenedPackBadge } from '../../src/components/navigationBadges';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';
import { colors } from '../../src/theme/tokens';

export default function TabsLayout() {
  const { packs } = useDemoCollection();
  const sealedPackCount = packs.filter((pack) => pack.status === 'sealed').length;
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.violet, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 68, paddingTop: 7, paddingBottom: 8 } }}>
      {Object.entries({ index: 'Shop', packs: 'My Packs', binder: 'Binder', vault: 'Vault', rewards: 'Rewards' }).map(([name, title]) => (
        <Tabs.Screen key={name} name={name} options={{ title, tabBarBadge: name === 'packs' ? unopenedPackBadge(sealedPackCount) : undefined, tabBarAccessibilityLabel: name === 'packs' && sealedPackCount ? `${title} tab, ${sealedPackCount} ${sealedPackCount === 1 ? 'pack' : 'packs'} ready to open` : `${title} tab`, tabBarIcon: ({ color, focused, size }) => <Ionicons name={getTabIconName(name as TabRoute, focused)} color={color} size={size} /> }} />
      ))}
    </Tabs>
  );
}
