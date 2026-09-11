import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatEuro } from '../../domain/catalog';
import { DemoPack } from '../../domain/demoCollection';
import { expansions } from '../../fixtures/catalog';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';
import { FINAL_CARD_SUSPENSE_MS, initialRipState, ripFlowReducer } from './ripFlow';

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
  return <AppScreen scroll><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close reveal" onPress={onClose} style={styles.close}><Ionicons testID="reveal-close-icon" name="close" color={colors.text} size={25} /></Pressable>
    {state.phase === 'sealed' || state.phase === 'tearing' ? <>
      <Text style={styles.eyebrow}>SEALED · COMMITTED</Text><Text accessibilityRole="header" style={styles.title}>Rip the pack open</Text>
      <Text style={styles.body}>{state.phase === 'sealed' ? 'Slide across the tear seam to rip the top off. Your 10-card demo pack is already locked.' : 'Tearing the top away…'}</Text>
      <View style={styles.commitment}><Text style={styles.label}>Commitment</Text><Text selectable style={styles.code}>{pack.commitment}</Text></View>
      <View style={styles.packStage}>{expansion ? <Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} /> : null}
        <Animated.View pointerEvents="none" style={[styles.opening, { opacity: ripProgress }]}><Text style={styles.openingText}>PACK OPENED</Text></Animated.View>
        {expansion ? <Animated.View pointerEvents="none" style={[styles.topFlap, { transform: [{ translateX: ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 72] }) }, { translateY: ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -136] }) }, { rotate: ripProgress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '14deg'] }) }] }]}><Image accessibilityLabel="Torn pack top artwork" source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.flapArtwork} /></Animated.View> : null}
        {state.phase === 'sealed' ? <View accessibilityLabel="Slide right to tear the pack open" {...tearResponder.panHandlers} style={styles.tearTrack}><Text style={styles.tearHint}>SLIDE TO RIP</Text><Animated.View style={[styles.tearHandle, { transform: [{ translateX: tearX }] }]}><Text style={styles.tearText}>→</Text></Animated.View></View> : null}
      </View>
      {state.phase === 'sealed' ? <Pressable accessibilityRole="button" accessibilityLabel="Rip pack" onPress={rip} style={styles.action}><Text style={styles.actionText}>Rip pack</Text></Pressable> : null}
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
  commitment: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, label: { color: colors.emerald, fontWeight: '900' }, code: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm }, packStage: { height: 390, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, packImage: { width: '84%', height: '100%' }, opening: { position: 'absolute', top: 45, width: '84%', height: 118, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: spacing.md, backgroundColor: '#09070D', borderTopWidth: 2, borderColor: '#F5C451' }, openingText: { color: '#F5C451', fontSize: 11, fontWeight: '900', letterSpacing: 2 }, topFlap: { position: 'absolute', top: 0, width: '84%', height: 140, overflow: 'hidden' }, flapArtwork: { width: '100%', height: 390 }, tearTrack: { position: 'absolute', top: 112, left: 38, right: 38, height: 50, borderWidth: 1, borderStyle: 'dashed', borderColor: '#F5C451', borderRadius: radii.pill, justifyContent: 'center' }, tearHint: { color: '#F5C451', fontSize: 11, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center' }, tearHandle: { position: 'absolute', left: 4, width: 42, height: 42, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.violet }, tearText: { color: colors.text, fontWeight: '900', fontSize: 20 },
  action: { minHeight: 56, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' }, card: { height: 410, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#24183D', borderWidth: 1, borderColor: colors.violet }, rarity: { color: colors.emerald, fontWeight: '900' }, cardName: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.md, textAlign: 'center' }, set: { color: colors.textMuted, marginTop: spacing.sm }, value: { color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: spacing.lg }, suspense: { alignItems: 'center', marginTop: spacing.xl }, cardBack: { width: 250, height: 350, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.violet }, gem: { color: colors.violet, fontSize: 72 },
});
