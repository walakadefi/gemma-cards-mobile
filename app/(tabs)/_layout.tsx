import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '../../src/theme/tokens';

const icons = {
  index: 'storefront-outline',
  packs: 'albums-outline',
  binder: 'book-outline',
  vault: 'shield-checkmark-outline',
  rewards: 'gift-outline',
} as const;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.violet, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 68, paddingTop: 7, paddingBottom: 8 } }}>
      {Object.entries({ index: 'Shop', packs: 'My Packs', binder: 'Binder', vault: 'Vault', rewards: 'Rewards' }).map(([name, title]) => (
        <Tabs.Screen key={name} name={name} options={{ title, tabBarAccessibilityLabel: `${title} tab`, tabBarIcon: ({ color, size }) => <Ionicons name={icons[name as keyof typeof icons]} color={color} size={size} /> }} />
      ))}
    </Tabs>
  );
}
