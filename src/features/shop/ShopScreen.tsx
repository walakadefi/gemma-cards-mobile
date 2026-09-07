import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useMemo, useState } from 'react';

import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { FilterChip } from '../../components/FilterChip';
import { PackCard } from '../../components/PackCard';
import { GameFilter, filterExpansions } from '../../domain/catalog';
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

export function ShopScreen({ onOpenPack = () => undefined }: ShopScreenProps) {
  const [filter, setFilter] = useState<GameFilter>('all');
  const { width } = useWindowDimensions();
  const columns = width >= 380 ? 2 : 1;
  const visibleExpansions = useMemo(() => filterExpansions(expansions, filter), [filter]);

  return (
    <AppScreen>
      <AppHeader balance={1000} />
      <FlatList
        key={columns}
        data={visibleExpansions}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        ListHeaderComponent={
          <>
            <View style={styles.featured}>
              <Text style={styles.demo}>DEMO CATALOG</Text>
              <Text style={styles.eyebrow}>POKÉMON & ONE PIECE</Text>
              <Text style={styles.hero}>Rip real packs,{`\n`}online.</Text>
              <Text style={styles.subhead}>Every card is yours—ship it home or trade it back for coins.</Text>
              <View style={styles.trustRow}>
                <Text style={styles.trust}>✓ Provably fair</Text>
                <Text style={styles.trust}>✓ Live values</Text>
              </View>
            </View>
            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionEyebrow}>EXPANSIONS</Text>
                <Text style={styles.sectionTitle}>Pick your pack</Text>
              </View>
              <Text style={styles.count}>{visibleExpansions.length} sets</Text>
            </View>
            <View style={styles.filters}>
              {filters.map((item) => (
                <FilterChip key={item.value} label={item.label} accessibilityLabel={item.accessibilityLabel} selected={filter === item.value} onPress={() => setFilter(item.value)} />
              ))}
            </View>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>No packs match this filter. Try another game.</Text>}
        renderItem={({ item }) => <View style={styles.cardSlot}><PackCard expansion={item} onPress={() => onOpenPack(item.id)} /></View>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  featured: { padding: spacing.lg, overflow: 'hidden', backgroundColor: colors.surfaceRaised, borderRadius: 24, borderWidth: 1, borderColor: '#3C2A68', marginBottom: spacing.xl },
  demo: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, overflow: 'hidden', color: colors.text, backgroundColor: colors.violetStrong, borderRadius: radii.pill, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { marginTop: spacing.lg, color: colors.emerald, fontSize: fontSizes.caption, fontWeight: '900', letterSpacing: 1.2 },
  hero: { marginTop: spacing.sm, color: colors.text, fontSize: fontSizes.hero, lineHeight: 38, fontWeight: '900', letterSpacing: -1.2 },
  subhead: { marginTop: spacing.md, maxWidth: 380, color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22 },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  trust: { color: colors.text, fontSize: fontSizes.caption, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionEyebrow: { color: colors.violet, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  sectionTitle: { marginTop: 3, color: colors.text, fontSize: fontSizes.title, fontWeight: '900' },
  count: { color: colors.textMuted, fontSize: fontSizes.caption },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.md },
  row: { gap: spacing.md },
  cardSlot: { flex: 1, marginBottom: spacing.md },
  empty: { paddingVertical: spacing.xxl, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
