import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useMemo, useState } from 'react';

import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { FilterChip } from '../../components/FilterChip';
import { PackCard } from '../../components/PackCard';
import { browseExpansions, Expansion, ExpansionSort, GameFilter } from '../../domain/catalog';
import { DemoCard } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

interface ShopScreenProps {
  onOpenPack?: (id: string) => void;
  recentCards?: DemoCard[];
  sealedPackCount?: number;
  onViewMyPacks?: () => void;
}

const filters: { label: string; value: GameFilter; accessibilityLabel: string }[] = [
  { label: 'All', value: 'all', accessibilityLabel: 'Show all packs' },
  { label: 'Pokémon', value: 'pokemon', accessibilityLabel: 'Show Pokémon packs' },
  { label: 'One Piece', value: 'onepiece', accessibilityLabel: 'Show One Piece packs' },
];

const sorts: { label: string; value: ExpansionSort; accessibilityLabel: string }[] = [
  { label: 'Newest', value: 'newest', accessibilityLabel: 'Sort by newest' },
  { label: 'Lowest price', value: 'price', accessibilityLabel: 'Sort by lowest price' },
  { label: 'Top value', value: 'top-value', accessibilityLabel: 'Sort by top card value' },
];

const groupIntoRows = (items: Expansion[], columns: number): Expansion[][] => {
  const rows: Expansion[][] = [];
  for (let index = 0; index < items.length; index += columns) {
    rows.push(items.slice(index, index + columns));
  }
  return rows;
};

export const shopGridColumns = (_width: number) => 3;
export const shopControlsStickyIndex = (recentCardCount: number) => recentCardCount > 0 ? 2 : 1;

export function ShopScreen({ onOpenPack = () => undefined, recentCards = [], sealedPackCount = 0, onViewMyPacks }: ShopScreenProps) {
  const [filter, setFilter] = useState<GameFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ExpansionSort>('newest');
  const { width } = useWindowDimensions();
  const columns = shopGridColumns(width);
  const visibleExpansions = useMemo(() => browseExpansions(expansions, { filter, query, sort }), [filter, query, sort]);
  const rows = useMemo(() => groupIntoRows(visibleExpansions, columns), [columns, visibleExpansions]);
  const resultLabel = `${visibleExpansions.length} ${visibleExpansions.length === 1 ? 'set' : 'sets'}`;

  return (
    <AppScreen>
      <AppHeader balance={1000} />
      <ScrollView contentContainerStyle={styles.content} stickyHeaderIndices={[shopControlsStickyIndex(recentCards.length)]} keyboardShouldPersistTaps="handled">
        <View style={styles.featured}>
          <Text style={styles.demo}>DEMO CATALOG</Text>
          <View style={styles.featuredDrop}><Text style={styles.featuredDropLabel}>FEATURED DROP</Text><Text style={styles.featuredPackName}>{expansions[0].name}</Text></View>
          <Text style={styles.eyebrow}>POKÉMON & ONE PIECE</Text>
          <Text style={styles.hero}>Rip real packs,{`\n`}online.</Text>
          <Text style={styles.subhead}>Every card is yours—ship it home or trade it back for coins.</Text>
          <View style={styles.trustRow}>
            <Text style={styles.trust}>✓ Provably fair</Text>
            <Text style={styles.trust}>✓ Live values</Text>
          </View>
          {sealedPackCount > 0 && onViewMyPacks ? <View style={styles.readyPack}><Text style={styles.readyPackCount}>{sealedPackCount} {sealedPackCount === 1 ? 'pack' : 'packs'} ready to rip</Text><Pressable accessibilityRole="button" accessibilityLabel="View ready packs" onPress={onViewMyPacks} style={styles.readyPackAction}><Text style={styles.firstRipText}>View ready packs</Text></Pressable></View> : <Pressable accessibilityRole="button" accessibilityLabel="Start your first rip" onPress={() => onOpenPack(expansions[0].id)} style={styles.firstRip}><Text style={styles.firstRipText}>Start your first rip</Text></Pressable>}
        </View>

        {recentCards.length ? <View style={styles.recent}><View style={styles.recentHeading}><Text style={styles.sectionEyebrow}>RECENTLY PULLED</Text><Text style={styles.recentCount}>{recentCards.length} latest</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>{recentCards.slice(0, 5).map((card) => <View key={card.id} accessibilityLabel={`Recent pull ${card.name}`} style={styles.recentCard}><Text numberOfLines={1} style={styles.recentName}>{card.name}</Text><Text numberOfLines={1} style={styles.recentSet}>{card.setName}</Text><Text style={styles.recentRarity}>{card.rarity}</Text></View>)}</ScrollView></View> : null}

        <View accessibilityLabel="Pack browsing controls" style={styles.controls}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionEyebrow}>EXPANSIONS</Text>
              <Text style={styles.sectionTitle}>Pick your pack</Text>
            </View>
            <Text accessibilityLiveRegion="polite" style={styles.count}>{resultLabel}</Text>
          </View>

          <View style={styles.searchBox}>
            <Text accessible={false} style={styles.searchIcon}>⌕</Text>
            <TextInput
              accessibilityLabel="Search packs"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search name or set code"
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
            />
            {query ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear pack search" hitSlop={8} onPress={() => setQuery('')} style={styles.clearButton}>
                <Text style={styles.clearText}>×</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>GAME</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {filters.map((item) => (
                <FilterChip key={item.value} label={item.label} accessibilityLabel={item.accessibilityLabel} selected={filter === item.value} onPress={() => setFilter(item.value)} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>SORT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {sorts.map((item) => (
                <FilterChip key={item.value} label={item.label} accessibilityLabel={item.accessibilityLabel} selected={sort === item.value} onPress={() => setSort(item.value)} />
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.catalog}>
          {rows.length ? rows.map((row) => (
            <View key={row[0].id} style={styles.row}>
              {row.map((item) => (
                <View key={item.id} style={styles.cardSlot}>
                  <PackCard expansion={item} onPress={() => onOpenPack(item.id)} />
                </View>
              ))}
              {row.length < columns ? <View style={styles.cardSlot} /> : null}
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No packs found</Text>
              <Text style={styles.empty}>Try a different search or game filter.</Text>
              {query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reset pack browser"
                  onPress={() => { setQuery(''); setFilter('all'); setSort('newest'); }}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonLabel}>Show all packs</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl },
  featured: { margin: spacing.md, marginBottom: spacing.xl, padding: spacing.lg, overflow: 'hidden', backgroundColor: colors.surfaceRaised, borderRadius: 24, borderWidth: 1, borderColor: '#3C2A68' },
  featuredDrop: { marginTop: spacing.md, padding: spacing.md, borderRadius: radii.md, backgroundColor: '#211A35', borderWidth: 1, borderColor: colors.violet }, featuredDropLabel: { color: colors.violet, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, featuredPackName: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 3 },
  demo: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, overflow: 'hidden', color: colors.text, backgroundColor: colors.violetStrong, borderRadius: radii.pill, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { marginTop: spacing.lg, color: colors.emerald, fontSize: fontSizes.caption, fontWeight: '900', letterSpacing: 1.2 },
  hero: { marginTop: spacing.sm, color: colors.text, fontSize: fontSizes.hero, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2 },
  subhead: { marginTop: spacing.md, maxWidth: 380, color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  trust: { color: colors.text, fontSize: fontSizes.caption, fontWeight: '700' },
  firstRip: { alignSelf: 'flex-start', minHeight: 46, marginTop: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violet }, firstRipText: { color: colors.text, fontWeight: '900' },
  readyPack: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: '#10231D', borderWidth: 1, borderColor: '#1C5B46' }, readyPackCount: { color: colors.emerald, fontWeight: '900' }, readyPackAction: { alignSelf: 'flex-start', minHeight: 42, marginTop: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.emerald },
  recent: { paddingHorizontal: spacing.md, marginBottom: spacing.md }, recentHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }, recentCount: { color: colors.textMuted, fontSize: fontSizes.caption }, recentRow: { gap: spacing.sm, paddingRight: spacing.md }, recentCard: { width: 146, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border }, recentName: { color: colors.text, fontWeight: '900' }, recentSet: { color: colors.textMuted, fontSize: 11, marginTop: 4 }, recentRarity: { color: '#F5C451', fontSize: 10, fontWeight: '900', marginTop: spacing.sm },
  controls: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 2 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionEyebrow: { color: colors.violet, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  sectionTitle: { marginTop: 3, color: colors.text, fontSize: fontSizes.title, fontWeight: '900' },
  count: { color: colors.textMuted, fontSize: fontSizes.caption },
  searchBox: { minHeight: 46, marginTop: spacing.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  searchIcon: { color: colors.violet, fontSize: 24, marginRight: spacing.sm },
  searchInput: { flex: 1, minHeight: 44, color: colors.text, fontSize: fontSizes.body },
  clearButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  clearText: { color: colors.textMuted, fontSize: 24, lineHeight: 26 },
  controlRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  controlLabel: { width: 46, color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  chipRow: { gap: spacing.sm, paddingRight: spacing.md },
  catalog: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  cardSlot: { flex: 1, minWidth: 0, marginBottom: spacing.md },
  emptyState: { minHeight: 220, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  emptyTitle: { color: colors.text, fontSize: fontSizes.label, fontWeight: '800' },
  empty: { marginTop: spacing.sm, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  emptyButton: { minHeight: 44, marginTop: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violetStrong },
  emptyButtonLabel: { color: colors.text, fontWeight: '800' },
});
