import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { getTabIconName, TabRoute } from '../../src/components/navigationIcons';
import { colors } from '../../src/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.violet, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 68, paddingTop: 7, paddingBottom: 8 } }}>
      {Object.entries({ index: 'Shop', packs: 'My Packs', binder: 'Binder', vault: 'Vault', rewards: 'Rewards' }).map(([name, title]) => (
        <Tabs.Screen key={name} name={name} options={{ title, tabBarAccessibilityLabel: `${title} tab`, tabBarIcon: ({ color, focused, size }) => <Ionicons name={getTabIconName(name as TabRoute, focused)} color={color} size={size} /> }} />
      ))}
    </Tabs>
  );
}
