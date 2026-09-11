import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useMemo, useState } from 'react';

import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { FilterChip } from '../../components/FilterChip';
import { PackCard } from '../../components/PackCard';
import { browseExpansions, Expansion, ExpansionSort, GameFilter } from '../../domain/catalog';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

interface ShopScreenProps {
  onOpenPack?: (id: string) => void;
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

export function ShopScreen({ onOpenPack = () => undefined }: ShopScreenProps) {
  const [filter, setFilter] = useState<GameFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ExpansionSort>('newest');
  const { width } = useWindowDimensions();
  const columns = width >= 380 ? 2 : 1;
  const visibleExpansions = useMemo(() => browseExpansions(expansions, { filter, query, sort }), [filter, query, sort]);
  const rows = useMemo(() => groupIntoRows(visibleExpansions, columns), [columns, visibleExpansions]);
  const resultLabel = `${visibleExpansions.length} ${visibleExpansions.length === 1 ? 'set' : 'sets'}`;

  return (
    <AppScreen>
      <AppHeader balance={1000} />
      <ScrollView contentContainerStyle={styles.content} stickyHeaderIndices={[1]} keyboardShouldPersistTaps="handled">
        <View style={styles.featured}>
          <Text style={styles.demo}>DEMO CATALOG</Text>
          <Text style={styles.eyebrow}>POKÉMON & ONE PIECE</Text>
          <Text style={styles.hero}>Rip real packs,{`\n`}online.</Text>
          <Text style={styles.subhead}>Every card is yours—ship it home or trade it back for coins.</Text>
          <View style={styles.trustRow}>
            <Text style={styles.trust}>✓ Provably fair</Text>
            <Text style={styles.trust}>✓ Live values</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Start your first rip" onPress={() => onOpenPack(expansions[0].id)} style={styles.firstRip}><Text style={styles.firstRipText}>Start your first rip</Text></Pressable>
        </View>

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
  demo: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, overflow: 'hidden', color: colors.text, backgroundColor: colors.violetStrong, borderRadius: radii.pill, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { marginTop: spacing.lg, color: colors.emerald, fontSize: fontSizes.caption, fontWeight: '900', letterSpacing: 1.2 },
  hero: { marginTop: spacing.sm, color: colors.text, fontSize: fontSizes.hero, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2 },
  subhead: { marginTop: spacing.md, maxWidth: 380, color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  trust: { color: colors.text, fontSize: fontSizes.caption, fontWeight: '700' },
  firstRip: { alignSelf: 'flex-start', minHeight: 46, marginTop: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violet }, firstRipText: { color: colors.text, fontWeight: '900' },
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
