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
  const ripShakeX = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const cardLiftY = useRef(new Animated.Value(72)).current;
  const finalPulse = useRef(new Animated.Value(1)).current;
  const hitPulse = useRef(new Animated.Value(1)).current;
  const transitioning = useRef(false);
  const hasRipped = useRef(pack.status === 'revealed');
  const mounted = useRef(true);
  const swipeAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const ripAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const ripImpactAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const cardEntranceAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const hitAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const expansion = expansions.find((item) => item.id === pack.expansionId);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; swipeAnimation.current?.stop(); ripAnimation.current?.stop(); ripImpactAnimation.current?.stop(); cardEntranceAnimation.current?.stop(); hitAnimation.current?.stop(); };
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
    const sequence = Animated.parallel([
      Animated.sequence(Array.from({ length: 10 }, (_, index) => Animated.timing(shakeX, { toValue: index % 2 ? 6 : -6, duration: FINAL_CARD_SUSPENSE_MS / 10, useNativeDriver: true }))),
      Animated.sequence([
        Animated.timing(finalPulse, { toValue: 1.035, duration: FINAL_CARD_SUSPENSE_MS / 2, useNativeDriver: true }),
        Animated.timing(finalPulse, { toValue: 1, duration: FINAL_CARD_SUSPENSE_MS / 2, useNativeDriver: true }),
      ]),
    ]);
    sequence.start(({ finished }) => { shakeX.setValue(0); finalPulse.setValue(1); if (finished) dispatch({ type: 'SUSPENSE_FINISHED' }); });
    return () => sequence.stop();
  }, [finalPulse, reduceMotion, shakeX, state.phase]);

  useEffect(() => {
    if (state.phase !== 'browsing') return;
    cardLiftY.setValue(72);
    if (reduceMotion) { cardLiftY.setValue(0); return; }
    cardEntranceAnimation.current = Animated.timing(cardLiftY, { toValue: 0, duration: 260, useNativeDriver: true });
    cardEntranceAnimation.current.start();
    return () => cardEntranceAnimation.current?.stop();
  }, [cardLiftY, reduceMotion, state.phase, state.visibleIndex]);

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
    ripAnimation.current = Animated.timing(ripProgress, { toValue: 1, duration: 820, useNativeDriver: true });
    ripImpactAnimation.current = Animated.sequence([
      Animated.delay(250),
      Animated.sequence(Array.from({ length: 4 }, (_, index) => Animated.timing(ripShakeX, { toValue: index % 2 ? 4 : -4, duration: 42, useNativeDriver: true }))),
      Animated.timing(ripShakeX, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]);
    ripImpactAnimation.current.start();
    ripAnimation.current.start(({ finished }) => { if (finished && mounted.current) dispatch({ type: 'RIP_OPENED' }); });
  }, [onRip, reduceMotion, ripProgress, ripShakeX, state.phase]);
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
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'sealed' && gesture.dx < -4,
    onPanResponderMove: (_, gesture) => tearX.setValue(Math.min(0, Math.max(-190, gesture.dx))),
    onPanResponderRelease: (_, gesture) => gesture.dx < -120 ? rip() : Animated.spring(tearX, { toValue: 0, useNativeDriver: true }).start(),
  }), [rip, state.phase, tearX]);

  const cardResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => state.phase === 'browsing' && !transitioning.current && Math.abs(gesture.dx) > 8,
    onPanResponderMove: (_, gesture) => swipeX.setValue(Math.min(0, gesture.dx)),
    onPanResponderRelease: (_, gesture) => gesture.dx < -70 ? next() : Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start(),
  }), [next, state.phase, swipeX]);

  const card = state.visibleIndex === null ? undefined : pack.revealedCards?.[state.visibleIndex];
  const isChasePull = card?.rarity === 'Illustration Rare';
  const isRarePull = card?.rarity === 'Rare' || isChasePull;
  useEffect(() => {
    if (!isRarePull || reduceMotion) return;
    hitPulse.setValue(1);
    hitAnimation.current = Animated.sequence([
      Animated.timing(hitPulse, { toValue: isChasePull ? 1.035 : 1.018, duration: 180, useNativeDriver: true }),
      Animated.timing(hitPulse, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]);
    hitAnimation.current.start();
    return () => hitAnimation.current?.stop();
  }, [card?.id, hitPulse, isChasePull, isRarePull, reduceMotion]);
  const isOpening = state.phase === 'tearing';
  return <AppScreen scroll><View style={styles.content}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close reveal" onPress={onClose} style={styles.close}><Ionicons testID="reveal-close-icon" name="close" color={colors.text} size={25} /></Pressable>
    {state.phase === 'sealed' || state.phase === 'tearing' ? <>
      <View pointerEvents="none" style={styles.starField}>{stars.map(([left, top, size], index) => <View key={index} style={[styles.star, { left: `${left}%`, top: `${top}%`, width: size, height: size }]} />)}</View>
      <Text style={styles.eyebrow}>SEALED · COMMITTED</Text><Text accessibilityRole="header" style={styles.title}>Rip the pack open</Text>
      <View style={styles.packStage}>
        {isOpening ? <Animated.View pointerEvents="none" style={[styles.foilGlow, { opacity: ripProgress.interpolate({ inputRange: [0, 0.3, 0.8, 1], outputRange: [0, 0.7, 0.45, 0] }), transform: [{ scale: ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.35] }) }] }]} /> : null}
        {isOpening ? <Animated.View pointerEvents="none" style={[styles.emergingCard, { opacity: ripProgress.interpolate({ inputRange: [0, 0.45, 0.7, 1], outputRange: [0, 0, 1, 1] }), transform: [{ perspective: 900 }, { translateY: ripProgress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [110, 110, -46] }) }, { scale: ripProgress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0.86, 0.86, 1] }) }, { rotateY: ripProgress.interpolate({ inputRange: [0, 0.68, 1], outputRange: ['0deg', '0deg', '360deg'] }) }] }]}><Text style={styles.emergingGem}>◆</Text></Animated.View> : null}
        {expansion ? <Animated.View style={{ opacity: isOpening ? ripProgress.interpolate({ inputRange: [0, 0.48, 0.82, 1], outputRange: [1, 1, 0.28, 0] }) : 1, transform: [{ translateX: isOpening ? ripShakeX : 0 }, { translateY: isOpening ? ripProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 42] }) : 0 }] }}><Image accessibilityLabel={`${expansion.name} booster pack artwork`} source={{ uri: expansion.imageUri }} resizeMode="contain" style={styles.packImage} /></Animated.View> : null}
        {state.phase === 'sealed' ? <View accessibilityLabel="Slide along the pack top edge to tear it open" {...tearResponder.panHandlers} style={styles.tearZone}><View style={styles.tearSeam} /><View style={styles.tearNotch} /><Animated.View style={[styles.tearTrail, { transform: [{ scaleX: tearX.interpolate({ inputRange: [-190, 0], outputRange: [1, 0] }) }] }]} /><Animated.View style={[styles.tearHandle, { transform: [{ translateX: tearX }] }]}><Text style={styles.tearText}>←</Text></Animated.View></View> : null}
      </View>
      {state.phase === 'sealed' ? <><Text style={styles.ripInstruction}>Slide along the top edge to tear it open</Text><Text style={styles.ripDirection}>Start at the tear notch, then drag left.</Text><Pressable accessibilityRole="button" accessibilityLabel="Rip it" onPress={rip} style={styles.ripAction}><Text style={styles.actionText}>Rip it</Text></Pressable><Text selectable style={styles.commitmentCode}>Commitment · {pack.commitment}</Text></> : null}
    </> : state.phase === 'suspense' ? <Animated.View style={[styles.suspense, { transform: [{ translateX: shakeX }, { scale: finalPulse }] }]}><Text style={styles.eyebrow}>FINAL CARD · HOLD YOUR BREATH</Text><Text accessibilityRole="header" style={styles.title}>Something is hiding…</Text><Text style={styles.finalHint}>The last card is fighting its way out.</Text><View style={styles.cardBack}><Text style={styles.gem}>◆</Text></View></Animated.View> : <>
      <Text style={styles.eyebrow}>CARD {(state.visibleIndex ?? 0) + 1} OF 10</Text><Text accessibilityRole="header" style={styles.title}>{state.phase === 'complete' ? 'The final pull' : 'Swipe for the next card'}</Text>
      <View style={styles.cardRevealStage}>
        {state.phase === 'browsing' ? <View pointerEvents="none" style={styles.cardStack}><View style={[styles.stackCard, styles.stackCardBack]} /><View style={[styles.stackCard, styles.stackCardFront]} /></View> : null}
        {isRarePull ? <Animated.View pointerEvents="none" style={[styles.hitHalo, { opacity: hitPulse.interpolate({ inputRange: [1, 1.035], outputRange: [0.25, 0.7] }), transform: [{ scale: hitPulse.interpolate({ inputRange: [1, 1.035], outputRange: [0.95, 1.12] }) }] }]} /> : null}
        <Animated.View accessibilityLabel={state.phase === 'browsing' ? 'Swipe left to throw this card forward' : undefined} {...cardResponder.panHandlers} style={[styles.card, isRarePull && styles.rareCard, { transform: [{ translateX: swipeX }, { translateY: state.phase === 'browsing' ? cardLiftY : 0 }, { rotate: state.phase === 'browsing' ? swipeX.interpolate({ inputRange: [-420, 0], outputRange: ['-13deg', '0deg'] }) : '0deg' }, { scale: isRarePull ? hitPulse : swipeX.interpolate({ inputRange: [-420, 0], outputRange: [0.96, 1] }) }] }]}>{isRarePull ? <Text style={[styles.hitBadge, isChasePull && styles.chaseBadge]}>{isChasePull ? 'CHASE PULL' : 'RARE PULL'}</Text> : null}<Text style={[styles.rarity, isRarePull && styles.rareRarity]}>{card?.rarity}</Text><Text style={styles.cardName}>{card?.name ?? 'Preparing card…'}</Text><Text style={styles.set}>{card?.setName}</Text><Text style={[styles.value, isRarePull && styles.rareValue]}>{card ? formatEuro(card.marketValueCents) : ''}</Text></Animated.View>
      </View>
      {state.phase === 'browsing' ? <Text style={styles.stackCount}>{9 - (state.visibleIndex ?? 0)} cards remain in the stack</Text> : null}
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
  commitment: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, label: { color: colors.emerald, fontWeight: '900' }, code: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm }, starField: { position: 'absolute', top: 52, left: 0, right: 0, height: 630 }, star: { position: 'absolute', borderRadius: radii.pill, backgroundColor: '#B88CFF', opacity: 0.55 }, packStage: { height: 420, marginTop: spacing.md, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }, packImage: { width: 220, height: 390 }, foilGlow: { position: 'absolute', width: 260, height: 260, borderRadius: radii.pill, backgroundColor: '#7C42F4', opacity: 0.5, shadowColor: '#A670FF', shadowOpacity: 1, shadowRadius: 44, elevation: 12 }, emergingCard: { position: 'absolute', width: 188, height: 266, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24183D', borderWidth: 2, borderColor: colors.violet, shadowColor: colors.violet, shadowOpacity: 0.55, shadowRadius: 18, elevation: 8 }, emergingGem: { color: '#D7C0FF', fontSize: 42 }, tearZone: { position: 'absolute', top: 31, width: 220, height: 38, justifyContent: 'center' }, tearSeam: { height: 2, width: '100%', backgroundColor: '#F6E7A3', shadowColor: '#F6E7A3', shadowOpacity: 0.9, shadowRadius: 7, elevation: 3 }, tearNotch: { position: 'absolute', right: -4, width: 10, height: 18, borderRadius: radii.pill, backgroundColor: '#F6E7A3', shadowColor: '#F6E7A3', shadowOpacity: 0.8, shadowRadius: 8 }, tearTrail: { position: 'absolute', right: 0, height: 3, width: 190, backgroundColor: '#C796FF', shadowColor: '#C796FF', shadowOpacity: 1, shadowRadius: 8 }, tearHandle: { position: 'absolute', right: -28, width: 34, height: 34, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C42F4', borderWidth: 1, borderColor: '#D7C0FF' }, tearText: { color: colors.text, fontWeight: '900', fontSize: 16 }, ripInstruction: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm }, ripDirection: { color: '#B88CFF', fontSize: 12, textAlign: 'center', marginTop: 6 }, ripAction: { alignSelf: 'center', minWidth: 156, minHeight: 48, marginTop: spacing.md, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violet }, commitmentCode: { color: colors.textMuted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.md },
  action: { minHeight: 56, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, backgroundColor: colors.violet }, actionText: { color: colors.text, fontWeight: '900' }, cardRevealStage: { position: 'relative', height: 410, marginTop: spacing.xl }, cardStack: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, stackCard: { position: 'absolute', left: 0, right: 0, height: 410, borderRadius: 24, backgroundColor: '#171222', borderWidth: 1, borderColor: '#5B388E' }, stackCardBack: { transform: [{ translateY: 18 }, { rotate: '2deg' }], opacity: 0.6 }, stackCardFront: { transform: [{ translateY: 9 }, { rotate: '-1deg' }], opacity: 0.82 }, hitHalo: { position: 'absolute', top: 34, left: 34, right: 34, height: 340, borderRadius: 36, backgroundColor: '#B76CFF', shadowColor: '#D6ADFF', shadowOpacity: 1, shadowRadius: 34, elevation: 7 }, card: { height: 410, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#24183D', borderWidth: 1, borderColor: colors.violet }, rareCard: { borderColor: '#F3D273', borderWidth: 2, backgroundColor: '#302045' }, hitBadge: { position: 'absolute', top: spacing.lg, color: '#C796FF', fontSize: 11, fontWeight: '900', letterSpacing: 1.7 }, chaseBadge: { color: '#F3D273' }, stackCount: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.md }, rarity: { color: colors.emerald, fontWeight: '900' }, rareRarity: { color: '#F3D273' }, cardName: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.md, textAlign: 'center' }, set: { color: colors.textMuted, marginTop: spacing.sm }, value: { color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: spacing.lg }, rareValue: { color: '#F3D273' }, suspense: { alignItems: 'center', marginTop: spacing.xl }, finalHint: { color: colors.textMuted, marginTop: spacing.sm }, cardBack: { width: 250, height: 350, marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.violet }, gem: { color: colors.violet, fontSize: 72 },
});
