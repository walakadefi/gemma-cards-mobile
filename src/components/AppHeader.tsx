import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCoins } from '../domain/catalog';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';

interface AppHeaderProps {
  balance: number;
  onProfilePress?: () => void;
}

export function AppHeader({ balance, onProfilePress = () => router.push('/profile') }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brand} accessibilityLabel="GemmaCards">
        <View style={styles.gem} />
        <Text style={styles.wordmark}>
          Gemma<Text style={styles.wordmarkAccent}>Cards</Text>
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${formatCoins(balance)} Gemma coins`} style={styles.balance}>
          <Text style={styles.coinGlyph}>◆</Text>
          <Text style={styles.balanceText}>{formatCoins(balance)}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={onProfilePress} style={styles.iconButton}>
          <Text style={styles.profileGlyph}>●</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 64, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gem: { width: 22, height: 22, backgroundColor: colors.violet, borderRadius: 7, transform: [{ rotate: '45deg' }] },
  wordmark: { color: colors.text, fontWeight: '800', fontSize: fontSizes.label },
  wordmarkAccent: { color: colors.violet },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  balance: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  balanceText: { color: colors.text, fontWeight: '700' },
  coinGlyph: { color: colors.violet, fontSize: 14 },
  profileGlyph: { color: colors.text, fontSize: 16 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
});
