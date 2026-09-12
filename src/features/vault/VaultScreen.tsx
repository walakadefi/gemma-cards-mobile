import { useState } from 'react';
import { FlatList, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '../../components/AppScreen';
import { AppHeader } from '../../components/AppHeader';
import { EmptyState } from '../../components/EmptyState';
import { DemoCard } from '../../domain/demoCollection';
import { formatEuro } from '../../domain/catalog';
import { colors, radii, spacing } from '../../theme/tokens';
import { shippingQuote } from './shippingQuote';

export function VaultScreen({ cards, onBrowsePacks }: { cards: DemoCard[]; onBrowsePacks?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState('');
  const chosen = cards.filter((card) => selected.includes(card.id));
  const quote = shippingQuote(chosen);
  return <AppScreen><AppHeader balance={1000} />
    <FlatList data={cards} keyExtractor={(card) => card.id} contentContainerStyle={styles.content}
      ListHeaderComponent={<>
        <Text style={styles.eyebrow}>VAULT</Text><Text accessibilityRole="header" style={styles.title}>Bring your cards home</Text>
        <Text style={styles.body}>Select cards to preview Gemma’s shipping cost.</Text>
        <View style={styles.summary}>
          <Text style={styles.eyebrow}>SHIPPING PREVIEW</Text>
          <Text accessibilityLiveRegion="polite" style={styles.total}>{formatEuro(quote.totalCents)}</Text>
          <Text style={styles.body}>{chosen.length} {chosen.length === 1 ? 'card selected' : 'cards selected'}</Text>
          {quote.standardCount > 0 ? <Text style={styles.body}>First three cards worth €10+ · {formatEuro(quote.baseCents)}</Text> : null}
          {quote.extraCents > 0 ? <Text style={styles.body}>Additional cards worth €10+ · {formatEuro(quote.extraCents)}</Text> : null}
          {quote.smallCount > 0 ? <Text style={styles.body}>Cards under €10 ({quote.smallCount}) · {formatEuro(quote.smallCents)}</Text> : null}
          <Text style={styles.note}>Demo estimate only. No payment or shipment is created.</Text>
        </View>
        {chosen.length > 0 ? <View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel="Review shipping selection" onPress={() => setReviewing(true)} style={styles.review}><Text style={styles.reviewText}>Review shipping</Text></Pressable><Pressable accessibilityRole="button" onPress={() => setSelected([])} style={styles.clear}><Text style={styles.link}>Clear selection</Text></Pressable></View> : null}
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      </>}
      renderItem={({ item }) => <Pressable accessibilityRole="checkbox" accessibilityLabel={`Select ${item.name} for shipping`} accessibilityState={{ checked: selected.includes(item.id) }} onPress={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} style={[styles.card, selected.includes(item.id) && styles.selected]}>
        <View style={styles.row}><Text style={styles.name}>{item.name}</Text><Text style={styles.link}>{selected.includes(item.id) ? '✓' : '+'}</Text></View>
        <Text style={styles.body}>{item.setName}</Text><Text style={styles.value}>{formatEuro(item.marketValueCents)}</Text>
      </Pressable>}
      ListEmptyComponent={<EmptyState eyebrow="YOUR FIRST DELIVERY" title="Your cards start in the Binder" body="Reveal a demo pack to preview shipping for your cards here." actionLabel={onBrowsePacks ? "Browse packs" : undefined} onAction={onBrowsePacks} />}
      ListFooterComponent={<View style={styles.summary}><Text style={styles.name}>How shipping is calculated</Text><Text style={styles.body}>€10 covers up to three cards worth €10 or more. Each extra card costs €5. Cards under €10 cost €5 each and do not use those first three places.</Text><Pressable accessibilityRole="link" onPress={() => void Linking.openURL('https://www.gemma.cards/shipping')} style={styles.clear}><Text style={styles.link}>Shipping details on Gemma ↗</Text></Pressable></View>}
    />
    <Modal transparent visible={reviewing} animationType="slide" onRequestClose={() => setReviewing(false)}><View style={styles.backdrop}><View accessibilityViewIsModal style={styles.reviewSheet}>
      <Text style={styles.eyebrow}>SHIPPING REVIEW</Text><Text style={styles.reviewHeading}>Cards heading home</Text>
      {chosen.map((card) => <View key={card.id} accessibilityLabel={`Shipping review card ${card.name}`} style={styles.reviewCard}><View><Text style={styles.name}>{card.name}</Text><Text style={styles.body}>{card.setName}</Text></View><Text style={styles.value}>{formatEuro(card.marketValueCents)}</Text></View>)}
      <View style={styles.reviewTotal}><Text style={styles.eyebrow}>ESTIMATED SHIPPING</Text><Text style={styles.total}>{formatEuro(quote.totalCents)}</Text></View>
      <Text style={styles.note}>Prototype only. No address, payment, or shipping request is sent.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Create demo shipping request" onPress={() => { setReviewing(false); setMessage('Shipping preview saved. No shipment or payment was created.'); }} style={styles.review}><Text style={styles.reviewText}>Create demo request</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Close shipping review" onPress={() => setReviewing(false)} style={styles.clear}><Text style={styles.link}>Back to Vault</Text></Pressable>
    </View></View></Modal>
  </AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  eyebrow: { color: colors.violet, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginVertical: spacing.sm },
  body: { color: colors.textMuted, lineHeight: 21, marginTop: spacing.sm },
  summary: { backgroundColor: colors.surfaceRaised, padding: spacing.lg, borderRadius: radii.lg, marginVertical: spacing.md },
  total: { color: colors.text, fontSize: 36, fontWeight: '900', marginTop: spacing.sm },
  note: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: spacing.md, borderRadius: radii.md, marginBottom: spacing.sm },
  selected: { borderColor: colors.violet, backgroundColor: '#21182F' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  name: { color: colors.text, fontSize: 17, fontWeight: '800', flexShrink: 1 },
  value: { color: colors.emerald, marginTop: spacing.sm, fontWeight: '800' },
  clear: { minHeight: 44, justifyContent: 'center' }, link: { color: colors.violet, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' }, review: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violetStrong }, reviewText: { color: colors.text, fontWeight: '900' }, message: { color: colors.emerald, fontWeight: '800', marginBottom: spacing.sm },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.7)' }, reviewSheet: { padding: spacing.xl, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.surface }, reviewHeading: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: spacing.sm, marginBottom: spacing.md }, reviewCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }, reviewTotal: { marginVertical: spacing.md, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceRaised },
});
