import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Expansion, formatCoins, formatEuro } from '../domain/catalog';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';

interface PackCardProps {
  expansion: Expansion;
  onPress: () => void;
}

export function PackCard({ expansion, onPress }: PackCardProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${expansion.name} details`}
      accessibilityHint={`${expansion.game === 'pokemon' ? 'Pokémon' : 'One Piece'} pack, ${formatCoins(expansion.coinPrice)} coins`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && !reduceMotion && styles.pressed]}
    >
      <View style={[styles.pack, { borderColor: expansion.accent }]}>
        <Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} />
      </View>
      <Text style={styles.game}>{expansion.game === 'pokemon' ? 'POKÉMON' : 'ONE PIECE'}</Text>
      <Text numberOfLines={2} style={styles.name}>{expansion.name}</Text>
      <View style={styles.metaRow}>
        <View>
          <Text style={styles.metaLabel}>PACK</Text>
          <Text style={styles.coins}>◆ {formatCoins(expansion.coinPrice)}</Text>
        </View>
        <View style={styles.metaRight}>
          <Text style={styles.metaLabel}>TOP CARD</Text>
          <Text style={styles.value}>{formatEuro(expansion.topCardValueCents)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 160, flex: 1, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.88 },
  pack: { height: 154, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, borderWidth: 1, backgroundColor: colors.surfaceRaised, marginBottom: spacing.md },
  packImage: { width: '100%', height: '100%' },
  game: { color: colors.violet, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  name: { minHeight: 44, marginTop: 4, color: colors.text, fontSize: fontSizes.label, lineHeight: 21, fontWeight: '800' },
  metaRow: { marginTop: spacing.sm, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  metaRight: { alignItems: 'flex-end' },
  metaLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  coins: { color: colors.text, marginTop: 3, fontWeight: '800' },
  value: { color: colors.emerald, marginTop: 3, fontWeight: '800' },
});
