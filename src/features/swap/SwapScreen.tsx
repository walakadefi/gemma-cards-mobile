import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatEuro } from '../../domain/catalog';
import { DemoCard } from '../../domain/demoCollection';
import { colors, radii, spacing } from '../../theme/tokens';
import { createSwapOffers, createTradeReceipt } from './swapFlow';

export function SwapScreen({ cards, onClose }: { cards: DemoCard[]; onClose: () => void }) {
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id);
  const [selectedOfferId, setSelectedOfferId] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);
  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const offers = useMemo(() => (selectedCard ? createSwapOffers(selectedCard) : []), [selectedCard]);
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId);
  const receipt = selectedCard && selectedOffer ? createTradeReceipt(selectedCard, selectedOffer) : undefined;

  return (
    <AppScreen scroll>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>SWAP · DEMO</Text>
            <Text accessibilityRole="header" style={styles.title}>Make a trade</Text>
            <Text style={styles.body}>Pick one of your pulls, then choose the kind of trade you want to explore.</Text>
          </View>
          <Pressable accessibilityLabel="Close swap" accessibilityRole="button" onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        {cards.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyTitle}>No pulls to trade yet</Text><Text style={styles.body}>Rip a pack first, then your cards will appear here.</Text></View>
        ) : confirmed && receipt ? (
          <View style={styles.receipt}>
            <Text style={styles.receiptEyebrow}>{receipt.status.toUpperCase()}</Text>
            <Text style={styles.receiptTitle}>{receipt.from}</Text>
            <Text style={styles.receiptArrow}>↓</Text>
            <Text style={styles.receiptTitle}>{receipt.to}</Text>
            <Text style={styles.receiptValue}>{formatEuro(receipt.valueCents)} estimated value</Text>
            <Text style={styles.receiptNote}>This is a prototype receipt — no cards have moved from your Binder.</Text>
            <Pressable accessibilityRole="button" onPress={() => { setConfirmed(false); setSelectedOfferId(undefined); }} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Explore another trade</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.section}><Text style={styles.sectionLabel}>1 · YOUR CARD</Text><Text style={styles.sectionTitle}>Choose a pull</Text></View>
            <View style={styles.cardList}>
              {cards.slice(0, 8).map((card) => {
                const selected = card.id === selectedCardId;
                return <Pressable key={card.id} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => { setSelectedCardId(card.id); setSelectedOfferId(undefined); }} style={[styles.collectionCard, selected && styles.collectionCardSelected]}>
                  <View style={styles.cardText}><Text numberOfLines={1} style={styles.cardName}>{card.name}</Text><Text numberOfLines={1} style={styles.cardMeta}>{card.setName} · {card.rarity}</Text></View>
                  <Text style={styles.cardValue}>{formatEuro(card.marketValueCents)}</Text>
                </Pressable>;
              })}
            </View>

            {selectedCard ? <>
              <View style={styles.section}><Text style={styles.sectionLabel}>2 · TRADE STYLE</Text><Text style={styles.sectionTitle}>Pick an offer</Text></View>
              <View style={styles.offerList}>{offers.map((offer) => {
                const selected = offer.id === selectedOfferId;
                return <Pressable key={offer.id} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setSelectedOfferId(offer.id)} style={[styles.offer, selected && styles.offerSelected]}>
                  <View style={styles.cardText}><Text style={styles.offerTitle}>{offer.title}</Text><Text style={styles.cardMeta}>{offer.description}</Text></View>
                  <Text style={styles.offerValue}>{formatEuro(offer.valueCents)}</Text>
                </Pressable>;
              })}</View>
              <Pressable accessibilityRole="button" disabled={!selectedOffer} onPress={() => setConfirmed(true)} style={[styles.primaryAction, !selectedOffer && styles.primaryActionDisabled]}>
                <Text style={styles.primaryActionText}>{selectedOffer ? 'Confirm demo trade' : 'Choose an offer to continue'}</Text>
              </Pressable>
            </> : null}
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }, headerCopy: { flex: 1, gap: spacing.xs },
  eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.3, fontSize: 12 }, title: { color: colors.text, fontSize: 32, lineHeight: 38, fontWeight: '900' }, body: { color: colors.textMuted, lineHeight: 21 },
  close: { alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceRaised }, closeText: { color: colors.text, fontSize: 28, lineHeight: 31 },
  section: { marginTop: spacing.sm, gap: 3 }, sectionLabel: { color: colors.violet, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  cardList: { gap: spacing.sm }, collectionCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised }, collectionCardSelected: { borderColor: colors.violet, backgroundColor: '#211A35' }, cardText: { flex: 1, gap: 3 }, cardName: { color: colors.text, fontSize: 15, fontWeight: '800' }, cardMeta: { color: colors.textMuted, fontSize: 12 }, cardValue: { color: colors.emerald, fontWeight: '900' },
  offerList: { gap: spacing.sm }, offer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised }, offerSelected: { borderColor: colors.emerald, backgroundColor: '#11281F' }, offerTitle: { color: colors.text, fontSize: 16, fontWeight: '900' }, offerValue: { color: colors.emerald, fontWeight: '900' },
  primaryAction: { minHeight: 56, justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm, borderRadius: radii.md, backgroundColor: colors.violet }, primaryActionDisabled: { opacity: 0.45 }, primaryActionText: { color: colors.text, fontWeight: '900' },
  empty: { gap: spacing.sm, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surfaceRaised }, emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  receipt: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.emerald, backgroundColor: '#102319' }, receiptEyebrow: { color: colors.emerald, fontSize: 11, fontWeight: '900', letterSpacing: 1.1 }, receiptTitle: { color: colors.text, fontSize: 25, textAlign: 'center', fontWeight: '900' }, receiptArrow: { color: colors.violet, fontSize: 28, fontWeight: '900' }, receiptValue: { color: colors.emerald, fontWeight: '900' }, receiptNote: { color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginTop: spacing.sm }, secondaryAction: { minHeight: 48, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', marginTop: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceRaised }, secondaryActionText: { color: colors.text, fontWeight: '900' },
});
