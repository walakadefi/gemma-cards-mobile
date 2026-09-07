import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { EmptyState } from '../../components/EmptyState';
import { formatCoins, formatEuro } from '../../domain/catalog';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

interface PackDetailScreenProps {
  expansionId: string;
  onClose?: () => void;
  onAddDemoPack?: (expansionId: string) => void;
}

export function PackDetailScreen({ expansionId, onClose, onAddDemoPack }: PackDetailScreenProps) {
  const [prepared, setPrepared] = useState(false);
  const expansion = expansions.find((item) => item.id === expansionId);

  if (!expansion) {
    return (
      <AppScreen>
        <EmptyState eyebrow="PACK NOT FOUND" title="That pack left the shelf" body="This demo expansion does not exist. Return to Shop and choose an available pack." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll>
      <View style={styles.content}>
        {onClose ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Close pack details" onPress={onClose} style={styles.closeButton}>
            <Ionicons testID="pack-details-close-icon" name="close" color={colors.text} size={25} />
          </Pressable>
        ) : null}
        <Text style={styles.eyebrow}>{expansion.game === 'pokemon' ? 'POKÉMON' : 'ONE PIECE'} · {expansion.code}</Text>
        <Text accessibilityRole="header" style={styles.title}>{expansion.name}</Text>
        <Text style={styles.description}>{expansion.description}</Text>

        <View style={[styles.packVisual, { borderColor: expansion.accent }]}>
          <Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} />
        </View>

        <View style={styles.summary}>
          <View>
            <Text style={styles.metricLabel}>PACK PRICE</Text>
            <Text style={styles.metricValue}>◆ {formatCoins(expansion.coinPrice)}</Text>
          </View>
          <View style={styles.metricRight}>
            <Text style={styles.metricLabel}>TOP CARD</Text>
            <Text style={styles.positiveValue}>{formatEuro(expansion.topCardValueCents)}</Text>
          </View>
        </View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>What this demo mirrors</Text>
        <View style={styles.factsCard}>
          <Text style={styles.fact}>10 cards revealed one at a time</Text>
          <Text style={styles.fact}>Every pull lands in your Binder</Text>
          <Text style={styles.fact}>The outcome is sealed before the reveal</Text>
        </View>

        <View style={styles.fairness}>
          <Text style={styles.fairnessEyebrow}>PROVABLY FAIR</Text>
          <Text style={styles.fairnessTitle}>Sealed before the reveal.</Text>
          <Text style={styles.fairnessBody}>For a real purchase, Gemma shows the outcome commitment before payment and discloses the seed after the reveal so the result can be verified.</Text>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Add demo pack" accessibilityHint="Prepares a local demonstration and charges no coins" onPress={() => { setPrepared(true); onAddDemoPack?.(expansion.id); }} style={styles.action}>
          <Text style={styles.actionText}>Add demo pack</Text>
          <Text style={styles.actionMeta}>No charge · prototype only</Text>
        </Pressable>
        {prepared ? <Text accessibilityRole="alert" style={styles.prepared}>Demo pack prepared — no coins charged.</Text> : null}
        <Text style={styles.disclosure}>18+ only. Gemma coins are platform credit, not cash, and cannot be converted back into money.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  closeButton: { width: 44, height: 44, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  eyebrow: { color: colors.violet, fontSize: fontSizes.caption, fontWeight: '900', letterSpacing: 1.2 },
  title: { marginTop: spacing.sm, color: colors.text, fontSize: fontSizes.hero, lineHeight: 39, fontWeight: '900', letterSpacing: -1 },
  description: { marginTop: spacing.sm, color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  packVisual: { height: 240, marginVertical: spacing.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: 24, borderWidth: 1, backgroundColor: colors.surface },
  packImage: { width: '100%', height: '100%' },
  summary: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  metricRight: { alignItems: 'flex-end' },
  metricLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  metricValue: { marginTop: 4, color: colors.text, fontSize: fontSizes.label, fontWeight: '900' },
  positiveValue: { marginTop: 4, color: colors.emerald, fontSize: fontSizes.label, fontWeight: '900' },
  sectionTitle: { marginTop: spacing.xl, color: colors.text, fontSize: fontSizes.title, fontWeight: '900' },
  factsCard: { marginTop: spacing.md, gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border },
  fact: { color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  fairness: { marginTop: spacing.lg, padding: spacing.lg, backgroundColor: '#10221C', borderRadius: radii.lg, borderWidth: 1, borderColor: '#1E5A46' },
  fairnessEyebrow: { color: colors.emerald, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  fairnessTitle: { marginTop: spacing.sm, color: colors.text, fontSize: fontSizes.label, fontWeight: '900' },
  fairnessBody: { marginTop: spacing.sm, color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  action: { minHeight: 58, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet },
  actionText: { color: colors.text, fontSize: fontSizes.label, fontWeight: '900' },
  actionMeta: { marginTop: 2, color: '#E4DAFF', fontSize: 10, fontWeight: '700' },
  prepared: { marginTop: spacing.md, padding: spacing.md, overflow: 'hidden', color: colors.emerald, backgroundColor: '#10221C', borderRadius: radii.md, textAlign: 'center', fontWeight: '800' },
  disclosure: { marginTop: spacing.lg, color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 18, textAlign: 'center' },
});
