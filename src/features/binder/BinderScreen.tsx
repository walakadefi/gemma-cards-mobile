import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { EmptyState } from '../../components/EmptyState';
import { formatEuro } from '../../domain/catalog';
import { DemoCard } from '../../domain/demoCollection';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

export function BinderScreen({ cards }: { cards: DemoCard[] }) {
  return <AppScreen scroll><AppHeader balance={1000} /><View style={styles.content}><Text style={styles.eyebrow}>BINDER</Text><Text accessibilityRole="header" style={styles.title}>Your collection</Text>
    {cards.length === 0 ? <EmptyState eyebrow="DEMO BINDER" title="Your pulls will live here" body="Reveal a demo pack to add its fixture card." /> : cards.map((card) => <View key={card.id} style={styles.card}><Text style={styles.rarity}>{card.rarity}</Text><Text style={styles.name}>{card.name}</Text><Text style={styles.set}>{card.setName}</Text><Text style={styles.value}>{formatEuro(card.marketValueCents)}</Text></View>)}
  </View></AppScreen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontWeight: '900' }, title: { color: colors.text, fontSize: fontSizes.title, fontWeight: '900' }, card: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, rarity: { color: colors.violet, fontWeight: '900' }, name: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: spacing.sm }, set: { color: colors.textMuted, marginTop: spacing.xs }, value: { color: colors.emerald, fontSize: fontSizes.title, fontWeight: '900', marginTop: spacing.md } });
