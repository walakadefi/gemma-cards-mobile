import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatEuro } from '../../domain/catalog';
import { DemoPack } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';
import { FINAL_CARD_SUSPENSE_MS, initialRipState, ripFlowReducer } from './ripFlow';

const stars = [
  [7, 14, 1], [18, 33, 2], [82, 11, 1], [91, 27, 1], [4, 55, 1], [95, 62, 2], [12, 78, 1], [78, 81, 1],
];

export function RevealScreen({ pack, onRip, onClose, onViewBinder, onBrowsePacks }: { pack: DemoPack; onRip: () => void; onClose: () => void; onViewBinder?: () => void; onBrowsePacks?: () => void }) {
  const [state, dispatch] = useReducer(ripFlowReducer, pack.status === 'revealed' ? { phase: 'complete', visibleIndex: 9 } : initialRipState);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tearX = useRef(new Animated.Value(0)).current;
  const ripProgress = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const transitioning = useRef(false);
  const hasRipped = useRef(pack.status === 'revealed');
  const mounted = useRef(true);
  const swipeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const ripAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const expansion = expansions.find((item) => item.id === pack.expansionId);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; swipeAnimation.current?.stop(); ripAnimation.current?.stop(); };
  }, []);
  useEffect(() => { transitioning.current = false; }, [state.visibleIndex, state.phase]);

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

  const rip = useCallback(() => {
    if (!mounted.current || hasRipped.current || state.phase !== 'sealed') return;
    hasRipped.current = true;
    onRip();
    dispatch({ type: 'START_RIP' });
    if (reduceMotion) {
      ripProgress.setValue(1);
      dispatch({ type: 'RIP_OPENED' });
      return;
    }
    ripAnimation.current = Animated.timing(ripProgress, { toValue: 1, duration: 420, useNativeDriver: true });
    ripAnimation.current.start(({ finished }) => { if (finished && mounted.current) dispatch({ type: 'RIP_OPENED' }); });
  }, [onRip, reduceMotion, ripProgress, state.phase]);
  const next = useCallback(() => {
    if (state.phase !== 'browsing' || transitioning.current) return;
    transitioning.current = true;
    if (reduceMotion) { dispatch({ type: 'NEXT' }); return; }
    swipeAnimation.current = Animated.timing(swipeX, { toValue: -420, duration: 180, useNativeDriver: true });
    swipeAnimation.current.start(({ finished }) => {
      if (!mounted.current) return;
      swipeX.setValue(0);
      if (finished) dispatch({ type: 'NEXT' });
      else transitioning.current = false;
    });
  }, [reduceMotion, state.phase, swipeX]);

  const tearResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'sealed' && gesture.dx > 4,
    onPanResponderMove: (_, gesture) => tearX.setValue(Math.max(0, Math.min(260, gesture.dx))),
    onPanResponderRelease: (_, gesture) => gesture.dx > 120 ? rip() : Animated.spring(tearX, { toValue: 0, useNativeDriver: true }).start(),
  }), [rip, state.phase, tearX]);

  const cardResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'browsing' && !transitioning.current && Math.abs(gesture.dx) > 8,
    onPanResponderMove: (_, gesture) => swipeX.setValue(Math.min(0, gesture.dx)),
    onPanResponderRelease: (_, gesture) => gesture.dx < -70 ? next() : Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start(),
  }), [next, state.phase, swipeX]);

  const card = state.visibleIndex === null ? undefined : pack.revealedCards?.[state.visibleIndex];
  const isOpening = state.phase === 'tearing';
  return <AppScreen scroll><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close reveal" onPress={onClose} style={styles.close}><Ionicons testID="reveal-close-icon" name="close" color={colors.text} size={25} /></Pressable>
    {state.phase === 'sealed' || state.phase === 'tearing' ? <>
      <View pointerEvents="none" style={styles.starField}>{stars.map(([left, top, size], index) => <View key={index} style={[styles.star, { left: `${left}%`, top: `${top}%`, width: size, height: size }]} />)}</View>
      <Text style={styles.eyebrow}>SEALED · COMMITTED</Text><Text accessibilityRole="header" style={styles.title}>Rip the pack open</Text>
      <View style={styles.packStage}>
        {isOpening ? <Animated.View pointerEvents="none" style={[styles.emergingCard, { opacity: ripProgress, transform: [{ translateY: ripProgress.interpolate({ inputRange: [0, 1], outputRange: [100, -46] }) }, { scale: ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }) }] }]}><Text style={styles.emergingGem}>◆</Text></Animated.View> : null}
        {expansion ? <Animated.View style={{ opacity: isOpening ? ripProgress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [1, 0.92, 0] }) : 1, transform: [{ translateY: isOpening ? ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 42] }) : 0 }] }}><Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} /></Animated.View> : null}
        {state.phase === 'sealed' ? <View accessibilityLabel="Slide along the pack top edge to tear it open" {...tearResponder.panHandlers} style={styles.tearZone}><View style={styles.tearSeam} /><Animated.View style={[styles.tearHandle, { transform: [{ translateX: tearX }] }]}><Text style={styles.tearText}>↔</Text></Animated.View></View> : null}
      </View>
      {state.phase === 'sealed' ? <><Text style={styles.ripInstruction}>Slide along the top edge to tear it open</Text><Pressable accessibilityRole="button" accessibilityLabel="Rip it" onPress={rip} style={styles.ripAction}><Text style={styles.actionText}>Rip it</Text></Pressable><Text selectable style={styles.commitmentCode}>Commitment · {pack.commitment}</Text></> : null}
    </> : state.phase === 'suspense' ? <Animated.View style={[styles.suspense, { transform: [{ translateX: shakeX }] }]}><Text style={styles.eyebrow}>FINAL CARD</Text><Text accessibilityRole="header" style={styles.title}>Something is hiding…</Text><View style={styles.cardBack}><Text style={styles.gem}>◆</Text></View></Animated.View> : <>
      <Text style={styles.eyebrow}>CARD {(state.visibleIndex ?? 0) + 1} OF 10</Text><Text accessibilityRole="header" style={styles.title}>{state.phase === 'complete' ? 'The final pull' : 'Swipe for the next card'}</Text>
      <Animated.View {...cardResponder.panHandlers} style={[styles.card, { transform: [{ translateX: swipeX }] }]}><Text style={styles.rarity}>{card?.rarity}</Text><Text style={styles.cardName}>{card?.name ?? 'Preparing card…'}</Text><Text style={styles.set}>{card?.setName}</Text><Text style={styles.value}>{card ? formatEuro(card.marketValueCents) : ''}</Text></Animated.View>
      {state.phase === 'browsing' ? <Pressable accessibilityRole="button" accessibilityLabel="Next card" onPress={next} style={styles.action}><Text style={styles.actionText}>{state.visibleIndex === 8 ? 'Reveal final card' : 'Next card'}</Text></Pressable> : <>
        {onViewBinder ? <Pressable accessibilityRole="button" onPress={onViewBinder} style={styles.action}><Text style={styles.actionText}>View Binder</Text></Pressable> : null}
        {onBrowsePacks ? <Pressable accessibilityRole="button" onPress={onBrowsePacks} style={[styles.action, { backgroundColor: colors.surfaceRaised }]}><Text style={styles.actionText}>Browse packs</Text></Pressable> : null}
        <View style={styles.commitment}><Text style={styles.label}>All 10 cards added to Binder</Text><Text style={styles.code}>Revealed seed {pack.verification?.revealedSeed}</Text><Text style={styles.code}>{pack.verification?.algorithmVersion} · {pack.verification?.cardCount} cards</Text></View>
      </>}
    </>}
  </View></AppScreen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl }, close: { alignSelf: 'flex-end', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surfaceRaised }, eyebrow: { color: colors.violet, fontWeight: '900', letterSpacing: 1.2 }, title: { color: colors.text, fontSize: fontSizes.hero, fontWeight: '900', marginTop: spacing.sm }, body: { color: colors.textMuted, lineHeight: 22, marginTop: spacing.md },
  commitment: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, label: { color: colors.emerald, fontWeight: '900' }, code: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm }, starField: { position: 'absolute', top: 52, left: 0, right: 0, height: 630 }, star: { position: 'absolute', borderRadius: radii.pill, backgroundColor: '#B88CFF', opacity: 0.55 }, packStage: { height: 420, marginTop: spacing.md, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }, packImage: { width: 220, height: 390 }, emergingCard: { position: 'absolute', width: 188, height: 266, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24183D', borderWidth: 2, borderColor: colors.violet, shadowColor: colors.violet, shadowOpacity: 0.55, shadowRadius: 18, elevation: 8 }, emergingGem: { color: '#D7C0FF', fontSize: 42 }, tearZone: { position: 'absolute', top: 31, width: 220, height: 38, justifyContent: 'center' }, tearSeam: { height: 2, width: '100%', backgroundColor: '#F6E7A3', shadowColor: '#F6E7A3', shadowOpacity: 0.9, shadowRadius: 7, elevation: 3 }, tearHandle: { position: 'absolute', left: -28, width: 34, height: 34, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C42F4', borderWidth: 1, borderColor: '#D7C0FF' }, tearText: { color: colors.text, fontWeight: '900', fontSize: 16 }, ripInstruction: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }, ripAction: { alignSelf: 'center', minWidth: 156, minHeight: 48, marginTop: spacing.md, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violet }, commitmentCode: { color: colors.textMuted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.md },
  action: { minHeight: 56, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' }, card: { height: 410, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#24183D', borderWidth: 1, borderColor: colors.violet }, rarity: { color: colors.emerald, fontWeight: '900' }, cardName: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.md, textAlign: 'center' }, set: { color: colors.textMuted, marginTop: spacing.sm }, value: { color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: spacing.lg }, suspense: { alignItems: 'center', marginTop: spacing.xl }, cardBack: { width: 250, height: 350, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.violet }, gem: { color: colors.violet, fontSize: 72 },
});
