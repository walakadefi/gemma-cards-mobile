import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatEuro } from '../../domain/catalog';
import { DemoPack } from '../../domain/demoCollection';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

export function RevealScreen({ pack, onReveal, onClose }: { pack: DemoPack; onReveal: (index: number) => void; onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return <AppScreen scroll><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close reveal" onPress={onClose} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable>
    <Text style={styles.eyebrow}>{pack.status === 'sealed' ? 'SEALED DEMO' : 'YOUR PULL'}</Text>
    <Text accessibilityRole="header" style={styles.title}>{pack.status === 'sealed' ? 'Pick a pack position' : pack.revealedCard?.name}</Text>
    {pack.status === 'sealed' ? <>
      <Text style={styles.body}>The result is already committed. Choose one of three positions before revealing it.</Text>
      <View style={styles.commitment}><Text style={styles.label}>Commitment</Text><Text selectable style={styles.code}>{pack.commitment}</Text></View>
      <View style={styles.positions}>{[0, 1, 2].map((index) => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Choose pack position ${index + 1}`} onPress={() => setSelected(index)} style={[styles.position, selected === index && styles.positionSelected]}><Text style={styles.positionText}>{index + 1}</Text></Pressable>)}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Reveal selected demo pack" accessibilityState={{ disabled: selected === null }} disabled={selected === null} onPress={() => selected !== null && onReveal(selected)} style={[styles.reveal, selected === null && styles.disabled]}><Text style={styles.revealText}>Reveal demo pack</Text></Pressable>
    </> : <>
      <View style={styles.card}><Text style={styles.rarity}>{pack.revealedCard?.rarity}</Text><Text style={styles.cardName}>{pack.revealedCard?.name}</Text><Text style={styles.set}>{pack.revealedCard?.setName}</Text><Text style={styles.value}>{formatEuro(pack.revealedCard?.marketValueCents ?? 0)}</Text></View>
      <View style={styles.commitment}><Text style={styles.label}>Verification</Text><Text style={styles.code}>Revealed seed {pack.verification?.revealedSeed}</Text><Text style={styles.code}>Position {(pack.verification?.selectedIndex ?? 0) + 1} · {pack.verification?.algorithmVersion}</Text><Text style={styles.code}>Previous chain {pack.verification?.previousChainFingerprint}</Text></View>
      <Text style={styles.body}>Added to your demo Binder. No coins or real cards changed hands.</Text>
    </>}
  </View></AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl }, close: { alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surfaceRaised }, closeText: { color: colors.text, fontSize: 28 }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: fontSizes.hero, fontWeight: '900', marginTop: spacing.sm }, body: { color: colors.textMuted, lineHeight: 22, marginTop: spacing.md },
  commitment: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, label: { color: colors.emerald, fontWeight: '900' }, code: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm }, positions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }, position: { flex: 1, aspectRatio: 0.75, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, backgroundColor: colors.surfaceRaised, borderWidth: 2, borderColor: colors.border }, positionSelected: { borderColor: colors.violet }, positionText: { color: colors.text, fontSize: 28, fontWeight: '900' }, reveal: { minHeight: 56, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, disabled: { opacity: 0.4 }, revealText: { color: colors.text, fontWeight: '900' },
  card: { height: 300, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#24183D', borderWidth: 1, borderColor: colors.violet }, rarity: { color: colors.emerald, fontWeight: '900' }, cardName: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.md }, set: { color: colors.textMuted, marginTop: spacing.sm }, value: { color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: spacing.lg },
});
