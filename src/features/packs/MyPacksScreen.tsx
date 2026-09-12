import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { EmptyState } from '../../components/EmptyState';
import { DemoPack } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

export function MyPacksScreen({ packs, onOpen }: { packs: DemoPack[]; onOpen: (id: string) => void }) {
  const sealedPacks = packs.filter((pack) => pack.status === 'sealed').reverse();
  const openedPacks = packs.filter((pack) => pack.status === 'revealed').reverse();
  const renderPack = (pack: DemoPack) => {
    const expansion = expansions.find((item) => item.id === pack.expansionId);
    const name = expansion?.name ?? pack.expansionId;
    const cards = pack.revealedCards ?? [];
    const bestPull = cards.reduce<typeof cards[number] | undefined>((best, card) => !best || card.marketValueCents > best.marketValueCents ? card : best, undefined);
    return <View key={pack.id} style={styles.card}>
      {expansion ? <Image accessibilityLabel={`${name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={{ height: 180, width: '100%', marginBottom: spacing.md }} /> : null}
      <Text style={styles.status}>{pack.status === 'sealed' ? 'SEALED DEMO PACK' : 'OPENED · 10 CARDS'}</Text>
      <Text style={styles.name}>{name}</Text>
      {pack.status === 'revealed' ? <View style={styles.historyStats}><Text style={styles.bestPull}>Best pull · {bestPull?.name ?? '—'}</Text><Text style={styles.cardCount}>{cards.length} cards collected</Text></View> : <Text numberOfLines={1} style={styles.hash}>Commitment {pack.commitment}</Text>}
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${name} demo pack`} onPress={() => onOpen(pack.id)} style={styles.action}><Text style={styles.actionText}>{pack.status === 'sealed' ? 'Choose & reveal' : 'View result'}</Text></Pressable>
    </View>;
  };
  return <AppScreen scroll><AppHeader balance={1000} />
    <View style={styles.content}>
      <Text style={styles.eyebrow}>MY PACKS</Text><Text accessibilityRole="header" style={styles.title}>{sealedPacks.length ? 'Ready to rip' : 'Your pack collection'}</Text>
      {packs.length === 0 ? <EmptyState eyebrow="DEMO MODE" title="Nothing sealed yet" body="Choose a pack in Shop to prepare a local demo reveal." /> : null}
      {sealedPacks.length ? <><Text style={styles.sectionLabel}>READY TO OPEN</Text>{sealedPacks.map(renderPack)}</> : null}
      {openedPacks.length ? <><Text style={styles.sectionLabel}>PACK HISTORY</Text><Text style={styles.sectionHint}>Your past rips, best pulls, and full reveal results.</Text>{openedPacks.map(renderPack)}</> : null}
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: fontSizes.title, fontWeight: '900', marginBottom: spacing.sm },
  card: { padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, status: { color: colors.emerald, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, name: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: spacing.sm }, hash: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm },
  sectionLabel: { color: colors.violet, fontWeight: '900', fontSize: 11, letterSpacing: 1.1, marginTop: spacing.sm }, sectionHint: { color: colors.textMuted, marginTop: -spacing.sm }, historyStats: { marginTop: spacing.sm, gap: 3 }, bestPull: { color: colors.text, fontWeight: '800' }, cardCount: { color: colors.textMuted, fontSize: 12 },
  action: { marginTop: spacing.md, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' },
});
