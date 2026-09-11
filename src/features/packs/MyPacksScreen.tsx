import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { EmptyState } from '../../components/EmptyState';
import { DemoPack } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';

export function MyPacksScreen({ packs, onOpen }: { packs: DemoPack[]; onOpen: (id: string) => void }) {
  return <AppScreen scroll><AppHeader balance={1000} />
    <View style={styles.content}>
      <Text style={styles.eyebrow}>MY PACKS</Text><Text accessibilityRole="header" style={styles.title}>Your sealed pulls</Text>
      {packs.length === 0 ? <EmptyState eyebrow="DEMO MODE" title="Nothing sealed yet" body="Choose a pack in Shop to prepare a local demo reveal." /> : [...packs].reverse().map((pack) => {
        const expansion = expansions.find((item) => item.id === pack.expansionId);
        const name = expansion?.name ?? pack.expansionId;
        return <View key={pack.id} style={styles.card}>
          {expansion ? <Image accessibilityLabel={`${name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={{ height: 180, width: '100%', marginBottom: spacing.md }} /> : null}
          <Text style={styles.status}>{pack.status === 'sealed' ? 'SEALED DEMO PACK' : 'OPENED · 10 CARDS'}</Text>
          <Text style={styles.name}>{name}</Text><Text numberOfLines={1} style={styles.hash}>Commitment {pack.commitment}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Open ${name} demo pack`} onPress={() => onOpen(pack.id)} style={styles.action}><Text style={styles.actionText}>{pack.status === 'sealed' ? 'Choose & reveal' : 'View result'}</Text></Pressable>
        </View>;
      })}
    </View>
  </AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: fontSizes.title, fontWeight: '900', marginBottom: spacing.sm },
  card: { padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, status: { color: colors.emerald, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, name: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: spacing.sm }, hash: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm },
  action: { marginTop: spacing.md, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' },
});
