import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Expansion, formatCoins } from '../domain/catalog';
import { colors, radii, spacing } from '../theme/tokens';

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
      <View style={styles.pack}>
        <Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} />
      </View>
      <Text style={styles.game}>{expansion.game === 'pokemon' ? 'PKM' : 'OP'}</Text>
      <Text numberOfLines={2} style={styles.name}>{expansion.name}</Text>
      <View style={styles.priceBadge}><Text style={styles.coins}>◆ {formatCoins(expansion.coinPrice)}</Text></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minWidth: 0, flex: 1, padding: spacing.sm, backgroundColor: colors.surfaceRaised, borderRadius: radii.lg, boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.28)' },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.88 },
  pack: { height: 126, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: '#0B0B0D', marginBottom: spacing.sm },
  packImage: { width: '100%', height: '100%' },
  game: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  name: { minHeight: 36, marginTop: 4, color: colors.text, fontSize: 14, lineHeight: 18, fontWeight: '800' },
  priceBadge: { alignSelf: 'flex-start', marginTop: spacing.sm, paddingHorizontal: 7, paddingVertical: 4, borderRadius: radii.pill, backgroundColor: '#24211A' },
  coins: { color: '#F5C451', fontSize: 11, fontWeight: '900' },
});
