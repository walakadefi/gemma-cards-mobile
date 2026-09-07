import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatEuro } from '../../domain/catalog';
import { DemoPack } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';
import { FINAL_CARD_SUSPENSE_MS, initialRipState, ripFlowReducer } from './ripFlow';

export function RevealScreen({ pack, onRip, onClose }: { pack: DemoPack; onRip: () => void; onClose: () => void }) {
  const [state, dispatch] = useReducer(ripFlowReducer, pack.status === 'revealed' ? { phase: 'complete', visibleIndex: 9 } : initialRipState);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tearX = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const expansion = expansions.find((item) => item.id === pack.expansionId);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (state.phase !== 'suspense') return;
    if (reduceMotion) {
      const timer = setTimeout(() => dispatch({ type: 'SUSPENSE_FINISHED' }), FINAL_CARD_SUSPENSE_MS);
      return () => clearTimeout(timer);
    }
    const sequence = Animated.sequence(Array.from({ length: 10 }, (_, index) => Animated.timing(shakeX, { toValue: index % 2 ? 6 : -6, duration: FINAL_CARD_SUSPENSE_MS / 10, useNativeDriver: true })));
    sequence.start(({ finished }) => { shakeX.setValue(0); if (finished) dispatch({ type: 'SUSPENSE_FINISHED' }); });
    return () => sequence.stop();
  }, [reduceMotion, shakeX, state.phase]);

  const rip = useCallback(() => { onRip(); dispatch({ type: 'RIP' }); }, [onRip]);
  const next = useCallback(() => {
    if (state.phase !== 'browsing') return;
    if (reduceMotion) { dispatch({ type: 'NEXT' }); return; }
    Animated.timing(swipeX, { toValue: -420, duration: 180, useNativeDriver: true }).start(() => { swipeX.setValue(0); dispatch({ type: 'NEXT' }); });
  }, [reduceMotion, state.phase, swipeX]);

  const tearResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'sealed' && Math.abs(gesture.dx) > 4,
    onPanResponderMove: (_, gesture) => tearX.setValue(Math.max(0, Math.min(260, gesture.dx))),
    onPanResponderRelease: (_, gesture) => gesture.dx > 120 ? Animated.timing(tearX, { toValue: 300, duration: reduceMotion ? 0 : 180, useNativeDriver: true }).start(rip) : Animated.spring(tearX, { toValue: 0, useNativeDriver: true }).start(),
  }), [reduceMotion, rip, state.phase, tearX]);

  const cardResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'browsing' && Math.abs(gesture.dx) > 8,
    onPanResponderMove: (_, gesture) => swipeX.setValue(Math.min(0, gesture.dx)),
    onPanResponderRelease: (_, gesture) => gesture.dx < -70 ? next() : Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start(),
  }), [next, state.phase, swipeX]);

  const card = state.visibleIndex === null ? undefined : pack.revealedCards?.[state.visibleIndex];
  return <AppScreen scroll><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close reveal" onPress={onClose} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable>
    {state.phase === 'sealed' ? <>
      <Text style={styles.eyebrow}>SEALED · COMMITTED</Text><Text accessibilityRole="header" style={styles.title}>Rip the pack open</Text>
      <Text style={styles.body}>Drag the tear strip all the way right. Your 10-card demo pack is already locked.</Text>
      <View style={styles.commitment}><Text style={styles.label}>Commitment</Text><Text selectable style={styles.code}>{pack.commitment}</Text></View>
      <View style={styles.packStage}>{expansion ? <Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} /> : null}
        <Animated.View accessibilityLabel="Pack tear strip" {...tearResponder.panHandlers} style={[styles.tearStrip, { transform: [{ translateX: tearX }] }]}><Text style={styles.tearText}>RIP  →</Text></Animated.View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Rip pack" onPress={rip} style={styles.action}><Text style={styles.actionText}>Rip pack</Text></Pressable>
    </> : state.phase === 'suspense' ? <Animated.View style={[styles.suspense, { transform: [{ translateX: shakeX }] }]}><Text style={styles.eyebrow}>FINAL CARD</Text><Text accessibilityRole="header" style={styles.title}>Something is hiding…</Text><View style={styles.cardBack}><Text style={styles.gem}>◆</Text></View></Animated.View> : <>
      <Text style={styles.eyebrow}>CARD {(state.visibleIndex ?? 0) + 1} OF 10</Text><Text accessibilityRole="header" style={styles.title}>{state.phase === 'complete' ? 'The final pull' : 'Swipe for the next card'}</Text>
      <Animated.View {...cardResponder.panHandlers} style={[styles.card, { transform: [{ translateX: swipeX }] }]}><Text style={styles.rarity}>{card?.rarity}</Text><Text style={styles.cardName}>{card?.name ?? 'Preparing card…'}</Text><Text style={styles.set}>{card?.setName}</Text><Text style={styles.value}>{card ? formatEuro(card.marketValueCents) : ''}</Text></Animated.View>
      {state.phase === 'browsing' ? <Pressable accessibilityRole="button" accessibilityLabel="Next card" onPress={next} style={styles.action}><Text style={styles.actionText}>{state.visibleIndex === 8 ? 'Reveal final card' : 'Next card'}</Text></Pressable> : <>
        <View style={styles.commitment}><Text style={styles.label}>All 10 cards added to Binder</Text><Text style={styles.code}>Revealed seed {pack.verification?.revealedSeed}</Text><Text style={styles.code}>{pack.verification?.algorithmVersion} · {pack.verification?.cardCount} cards</Text></View>
      </>}
    </>}
  </View></AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl }, close: { alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surfaceRaised }, closeText: { color: colors.text, fontSize: 28 }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: fontSizes.hero, fontWeight: '900', marginTop: spacing.sm }, body: { color: colors.textMuted, lineHeight: 22, marginTop: spacing.md },
  commitment: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, label: { color: colors.emerald, fontWeight: '900' }, code: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm }, packStage: { height: 390, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, packImage: { width: '84%', height: '100%' }, tearStrip: { position: 'absolute', top: 36, left: 28, right: 28, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, tearText: { color: colors.text, fontWeight: '900', letterSpacing: 2 },
  action: { minHeight: 56, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' }, card: { height: 410, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#24183D', borderWidth: 1, borderColor: colors.violet }, rarity: { color: colors.emerald, fontWeight: '900' }, cardName: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.md, textAlign: 'center' }, set: { color: colors.textMuted, marginTop: spacing.sm }, value: { color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: spacing.lg }, suspense: { alignItems: 'center', marginTop: spacing.xl }, cardBack: { width: 250, height: 350, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.violet }, gem: { color: colors.violet, fontSize: 72 },
});
