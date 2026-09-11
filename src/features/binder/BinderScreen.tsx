import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { FilterChip } from '../../components/FilterChip';
import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { EmptyState } from '../../components/EmptyState';
import { formatCoins, formatEuro } from '../../domain/catalog';
import { DemoCard } from '../../domain/demoCollection';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

export function BinderScreen({ cards }: { cards: DemoCard[] }) {
  const [query, setQuery] = useState('');
  const [rarity, setRarity] = useState('All');
  const [highestFirst, setHighestFirst] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailCard, setDetailCard] = useState<DemoCard | null>(null);
  const selectedCards = cards.filter((card) => selectedIds.includes(card.id));
  // Prototype estimate: round each card down to whole coins, not a live offer.
  const buybackCoins = selectedCards.reduce((sum, card) => sum + Math.floor(card.marketValueCents * 0.75), 0);
  const columns = useWindowDimensions().width >= 400 ? 2 : 1;
  const total = cards.reduce((sum, card) => sum + card.marketValueCents, 0);
  const best = cards.reduce<DemoCard | undefined>((hit, card) => !hit || card.marketValueCents > hit.marketValueCents ? card : hit, undefined);
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = cards.filter((card) => (rarity === 'All' || card.rarity === rarity) && `${card.name} ${card.setName}`.toLowerCase().includes(term));
    return highestFirst ? result.sort((a, b) => b.marketValueCents - a.marketValueCents) : result;
  }, [cards, query, rarity, highestFirst]);
  return <AppScreen><AppHeader balance={1000} /><FlatList
    key={columns} data={visible} numColumns={columns} keyExtractor={(card) => card.id}
    keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}
    columnWrapperStyle={columns > 1 ? discovery.row : undefined}
    ListHeaderComponent={<>
      <Text style={styles.eyebrow}>BINDER</Text><Text accessibilityRole="header" style={styles.title}>Your collection</Text>
      <View style={discovery.summary}>
        <Text style={styles.set}>COLLECTION VALUE · DEMO</Text>
        <Text accessibilityLabel={`Total collection value ${formatEuro(total)}`} style={discovery.total}>{formatEuro(total)}</Text>
        <Text style={styles.set}>{cards.length} {cards.length === 1 ? 'card' : 'cards'} collected</Text>
        {best ? <Text style={discovery.best}>Best pull · {best.name}</Text> : null}
      </View>
      {cards.length > 0 ? <>
        <View style={discovery.summary}>
          <Text style={styles.eyebrow}>BUYBACK · PREVIEW</Text>
          <Text style={styles.name}>Keep it or keep ripping</Text>
          <Text style={styles.set}>Select cards below to estimate a 75% return in coins. Your cards stay in your Binder.</Text>
          <Text accessibilityLiveRegion="polite" accessibilityLabel={`Estimated buyback ${formatCoins(buybackCoins)} coins`} style={styles.value}>{formatCoins(buybackCoins)} coins</Text>
          <Text style={styles.set}>{selectedCards.length} {selectedCards.length === 1 ? 'card' : 'cards'} selected</Text>
          <Text style={styles.set}>Demo values · 100 coins = €1 · rounded down per card. No cash payout or wallet credit.</Text>
          {selectedCards.length > 0 ? <Pressable accessibilityRole="button" accessibilityLabel="Clear buyback selection" onPress={() => setSelectedIds([])} style={discovery.reset}><Text style={discovery.best}>Clear selection</Text></Pressable> : null}
        </View>
        <TextInput accessibilityLabel="Search collection" placeholder="Search cards or sets" placeholderTextColor={colors.textMuted} value={query} onChangeText={setQuery} autoCapitalize="none" autoCorrect={false} style={discovery.search} />
        <View style={discovery.filters}>{['All', 'Common', 'Rare', 'Illustration Rare'].map((item) => <FilterChip key={item} label={item} accessibilityLabel={`Filter collection: ${item}`} selected={rarity === item} onPress={() => setRarity(item)} />)}</View>
        <View style={discovery.filters}><FilterChip label="Collection order" selected={!highestFirst} onPress={() => setHighestFirst(false)} /><FilterChip label="Highest value" selected={highestFirst} onPress={() => setHighestFirst(true)} /></View>
        <Text accessibilityLiveRegion="polite" style={discovery.results}>{visible.length} of {cards.length} cards</Text>
      </> : null}
    </>}
    ListEmptyComponent={cards.length === 0 ? <EmptyState eyebrow="YOUR FIRST PULL" title="Your pulls will live here" body="Open a pack from My Packs to add all ten cards to your collection." /> : <View style={discovery.summary}><Text style={styles.name}>No matching cards</Text><Text style={styles.set}>Try another name, set, or rarity.</Text><Pressable accessibilityRole="button" onPress={() => { setQuery(''); setRarity('All'); }} style={discovery.reset}><Text style={discovery.best}>Show all cards</Text></Pressable></View>}
    renderItem={({ item: card }) => <View testID="binder-card" style={[styles.card, discovery.card, { borderColor: card.rarity === 'Illustration Rare' ? '#F5C451' : card.rarity === 'Rare' ? colors.violet : colors.border }]}><Text style={[styles.rarity, card.rarity === 'Illustration Rare' && discovery.best]}>{card.rarity}</Text><Text style={styles.name}>{card.name}</Text><Text style={styles.set}>{card.setName}</Text><Text style={styles.value}>{formatEuro(card.marketValueCents)}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`View details for ${card.name}`} onPress={() => setDetailCard(card)} style={discovery.details}><Text style={discovery.selectText}>View details</Text></Pressable>
      <Pressable accessibilityRole="checkbox" accessibilityLabel={`Preview buyback for ${card.name}`} accessibilityState={{ checked: selectedIds.includes(card.id) }} onPress={() => setSelectedIds((ids) => ids.includes(card.id) ? ids.filter((id) => id !== card.id) : [...ids, card.id])} style={[discovery.select, selectedIds.includes(card.id) && discovery.selected]}>
        <Text style={discovery.selectText}>{selectedIds.includes(card.id) ? '✓ Selected' : '+ Buyback preview'}</Text>
      </Pressable>
    </View>}
    ListFooterComponent={cards.length > 0 ? <View style={discovery.summary}><Text style={styles.name}>Your pull, your call</Text><Text style={styles.set}>Keep your cards here and revisit your best pulls. Shipping and trading will be available when the app is connected to Gemma.</Text></View> : null}
  /><Modal transparent visible={detailCard !== null} animationType="slide" onRequestClose={() => setDetailCard(null)}><View style={discovery.modalBackdrop}><View accessibilityViewIsModal style={discovery.detailSheet}>{detailCard ? <><Text style={styles.eyebrow}>CARD DETAILS</Text><Text style={styles.name}>{detailCard.name}</Text><Text style={styles.set}>{detailCard.setName} · {detailCard.rarity}</Text><Text style={styles.value}>{formatEuro(detailCard.marketValueCents)}</Text><Text style={styles.set}>Market value · demo estimate</Text><View style={discovery.detailActions}><Pressable accessibilityRole="button" accessibilityLabel={`Sell ${detailCard.name}`} onPress={() => { setSelectedIds((ids) => ids.includes(detailCard.id) ? ids : [...ids, detailCard.id]); setDetailCard(null); }} style={discovery.detailAction}><Text style={discovery.selectText}>Sell</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Ship ${detailCard.name}`} style={discovery.detailAction}><Text style={discovery.selectText}>Ship</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Trade ${detailCard.name}`} style={discovery.detailAction}><Text style={discovery.selectText}>Trade</Text></Pressable></View><Text style={styles.set}>Demo actions only — no sale, shipment, or trade is created.</Text><Pressable accessibilityRole="button" accessibilityLabel="Close card details" onPress={() => setDetailCard(null)} style={discovery.close}><Text style={discovery.selectText}>Done</Text></Pressable></> : null}</View></View></Modal></AppScreen>;
}
const discovery = StyleSheet.create({
  row: { gap: spacing.md }, card: { flex: 1, minWidth: 0 },
  select: { minHeight: 48, marginTop: spacing.md, padding: spacing.sm, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, details: { minHeight: 42, marginTop: spacing.md, padding: spacing.sm, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.violet, borderColor: colors.violet },
  selectText: { color: colors.text, fontWeight: '700', textAlign: 'center' },
  summary: { padding: spacing.lg, marginVertical: spacing.md, backgroundColor: colors.surfaceRaised, borderRadius: radii.lg },
  total: { color: colors.text, fontSize: 32, fontWeight: '900', marginTop: spacing.sm },
  best: { color: '#F5C451', fontWeight: '800', marginTop: spacing.sm },
  search: { minHeight: 48, paddingHorizontal: spacing.md, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, marginBottom: spacing.md },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  results: { color: colors.textMuted, marginBottom: spacing.md }, reset: { minHeight: 44, justifyContent: 'center' }, modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }, detailSheet: { padding: spacing.xl, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, backgroundColor: colors.surface }, detailActions: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.lg }, detailAction: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, close: { minHeight: 50, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.surfaceRaised },
});
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontWeight: '900' }, title: { color: colors.text, fontSize: fontSizes.title, fontWeight: '900' }, card: { padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, rarity: { color: colors.violet, fontWeight: '900' }, name: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: spacing.sm }, set: { color: colors.textMuted, marginTop: spacing.xs }, value: { color: colors.emerald, fontSize: fontSizes.title, fontWeight: '900', marginTop: spacing.md } });
