import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../src/components/AppScreen';
import { formatEuro } from '../src/domain/catalog';
import { useDemoCollection } from '../src/state/DemoCollectionContext';
import { colors, radii, spacing } from '../src/theme/tokens';

export default function SwapRoute() {
  const router = useRouter();
  const { cards } = useDemoCollection();
  const best = cards.reduce<typeof cards[number] | undefined>((hit, card) => !hit || card.marketValueCents > hit.marketValueCents ? card : hit, undefined);
  return <AppScreen scroll><View style={styles.content}><Text style={styles.eyebrow}>SWAP · DEMO</Text><Text accessibilityRole="header" style={styles.title}>Trade a pull</Text><Text style={styles.body}>Choose a card from your Binder and see a fair-value trade preview. No trade is created in this prototype.</Text>{best ? <View style={styles.card}><Text style={styles.label}>YOUR FEATURED PULL</Text><Text style={styles.name}>{best.name}</Text><Text style={styles.meta}>{best.setName} · {best.rarity}</Text><Text style={styles.value}>{formatEuro(best.marketValueCents)}</Text></View> : <Text style={styles.body}>Open a pack first to add cards to your Binder.</Text>}<Pressable accessibilityRole="button" onPress={() => router.push('/binder')} style={styles.action}><Text style={styles.actionText}>Choose a card from Binder</Text></Pressable><Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Text style={styles.actionText}>Back</Text></Pressable></View></AppScreen>;
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: 32, fontWeight: '900' }, body: { color: colors.textMuted, lineHeight: 22 }, card: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.violet }, label: { color: colors.textMuted, fontSize: 10, fontWeight: '900' }, name: { marginTop: spacing.sm, color: colors.text, fontSize: 24, fontWeight: '900' }, meta: { marginTop: spacing.xs, color: colors.textMuted }, value: { marginTop: spacing.md, color: colors.emerald, fontSize: 24, fontWeight: '900' }, action: { minHeight: 54, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, back: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.surfaceRaised }, actionText: { color: colors.text, fontWeight: '900' } });
