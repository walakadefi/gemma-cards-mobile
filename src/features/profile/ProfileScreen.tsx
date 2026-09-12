import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '../../components/AppScreen';
import { formatCoins } from '../../domain/catalog';
import { DemoCard, DemoPack } from '../../domain/demoCollection';
import { colors, fontSizes, radii, spacing } from '../../theme/tokens';
import { createProfileSummary } from './profileSummary';
import { bestPullShareMessage } from './profileShare';
import { AnimatedCollectionValue } from './collectionValue';

const notificationPreferenceKey = '@gemma/notification-preview';

interface ProfileScreenProps {
  balance: number;
  packs: DemoPack[];
  cards: DemoCard[];
  onClose: () => void;
  onReset: () => void;
}

export function ProfileScreen({ balance, packs, cards, onClose, onReset }: ProfileScreenProps) {
  const summary = createProfileSummary(packs, cards, balance);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notificationPreferenceChanged = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(notificationPreferenceKey).then((value) => {
      if (active && !notificationPreferenceChanged.current && value === 'enabled') setNotificationsEnabled(true);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    onReset();
    setConfirmingReset(false);
  };

  return (
    <AppScreen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>PROFILE</Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>Guest Collector</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close profile" onPress={onClose} style={styles.closeButton}>
          <Ionicons testID="profile-close-icon" name="close" color={colors.text} size={25} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.identityCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>GC</Text></View>
          <View style={styles.identityCopy}>
            <Text style={styles.badge}>PROTOTYPE ACCOUNT</Text>
            <Text style={styles.identityTitle}>Guest Collector</Text>
            <Text style={styles.identityBody}>Explore the complete pack-opening flow without creating an account.</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.cardLabel}>GEMMA COINS</Text>
            <Text style={styles.balance}>{formatCoins(summary.balance)}</Text>
          </View>
          <Ionicons name="diamond" color={colors.violet} size={28} />
        </View>

        <Text style={styles.sectionTitle}>Collection snapshot</Text>
        <View style={styles.statsGrid}>
          <Stat value={`${summary.packCount} packs`} label="Total packs" />
          <Stat value={`${summary.openedPackCount} opened`} label="Opened packs" />
          <Stat value={`${summary.cardCount} cards`} label="Binder cards" />
          <AnimatedValueStat valueCents={summary.collectionValueCents} label="Collection value" />
        </View>
        {summary.bestPullName ? <View style={styles.bestPull}><Text style={styles.cardLabel}>BEST PULL</Text><Text style={styles.bestPullName}>{summary.bestPullName}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Share ${summary.bestPullName}`} onPress={() => void Share.share({ message: bestPullShareMessage(summary.bestPullName!, summary.bestPullSetName ?? 'my Binder') })} style={styles.shareButton}><Ionicons name="share-outline" size={16} color={colors.text} /><Text style={styles.shareText}>Share pull</Text></Pressable></View> : null}

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}><Text style={styles.cardLabel}>COLLECTION GOAL</Text><Text style={styles.goalCount}>{summary.collectionGoal.current} / {summary.collectionGoal.target}</Text></View>
          <Text style={styles.goalTitle}>{summary.collectionGoal.title}</Text>
          <View accessibilityLabel={`Collection goal progress ${summary.collectionGoal.current} of ${summary.collectionGoal.target}`} style={styles.goalTrack}><View style={[styles.goalFill, { width: `${Math.min(100, (summary.collectionGoal.current / summary.collectionGoal.target) * 100)}%` }]} /></View>
          <Text style={styles.goalHint}>{Math.max(0, summary.collectionGoal.target - summary.collectionGoal.current)} more cards to go</Text>
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementList}>{summary.achievements.map((achievement) => <View key={achievement.id} accessibilityLabel={`${achievement.title} ${achievement.unlocked ? 'unlocked' : 'locked'}`} style={[styles.achievement, achievement.unlocked && styles.achievementUnlocked]}><Ionicons name={achievement.unlocked ? 'trophy' : 'lock-closed'} color={achievement.unlocked ? '#F5C451' : colors.textMuted} size={18} /><View><Text style={styles.achievementTitle}>{achievement.title}</Text><Text style={styles.achievementStatus}>{achievement.unlocked ? 'Unlocked' : 'Keep collecting'}</Text></View></View>)}</View>

        <Text style={styles.sectionTitle}>Account information</Text>
        <View style={styles.detailsCard}>
          <Detail label="Status" value="Guest demo" />
          <Detail label="Appearance" value="Dark" />
          <Detail label="Currency" value="EUR" />
          <Detail label="Version" value="Prototype 0.1.0" last />
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Local prototype data</Text>
          <Text style={styles.noticeBody}>Your packs and cards are stored locally on this device. No personal details, payments, or account credentials are collected.</Text>
        </View>

        <View style={styles.notificationCard}>
          <View style={styles.notificationCopy}><Text style={styles.notificationTitle}>Pack drops & collection updates</Text><Text style={styles.notificationBody}>Get a heads-up when there is a new reason to open GemmaCards.</Text></View>
          <Pressable accessibilityRole="switch" accessibilityLabel="Pack drop notifications" accessibilityState={{ checked: notificationsEnabled }} onPress={() => { notificationPreferenceChanged.current = true; setNotificationsEnabled((enabled) => { const next = !enabled; void AsyncStorage.setItem(notificationPreferenceKey, next ? 'enabled' : 'disabled'); return next; }); }} style={[styles.notificationSwitch, notificationsEnabled && styles.notificationSwitchEnabled]}><View style={[styles.notificationKnob, notificationsEnabled && styles.notificationKnobEnabled]} /></Pressable>
          {notificationsEnabled ? <Text accessibilityLiveRegion="polite" style={styles.notificationMessage}>Pack-drop notifications are on for this prototype.</Text> : <Text style={styles.notificationMessage}>Prototype preference only — no push permission is requested.</Text>}
        </View>

        <View style={styles.resetCard}>
          <Text style={styles.resetTitle}>Replay the demo</Text>
          <Text style={styles.resetBody}>Clear every locally saved pack and card to start the prototype again.</Text>
          {confirmingReset ? <Text accessibilityRole="alert" style={styles.resetWarning}>This cannot be undone. Tap confirm to remove the collection.</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={confirmingReset ? 'Confirm reset demo collection' : 'Reset demo collection'}
            onPress={handleReset}
            style={[styles.resetButton, confirmingReset && styles.resetButtonConfirm]}
          >
            <Ionicons name={confirmingReset ? 'trash' : 'refresh'} color={confirmingReset ? colors.text : colors.danger} size={18} />
            <Text style={[styles.resetButtonText, confirmingReset && styles.resetButtonTextConfirm]}>{confirmingReset ? 'Confirm reset' : 'Reset demo collection'}</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return <View style={styles.stat}><Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function AnimatedValueStat({ valueCents, label }: { valueCents: number; label: string }) {
  return <View style={styles.stat}><AnimatedCollectionValue valueCents={valueCents} style={[styles.statValue, styles.statValueAccent]} /><Text style={styles.statLabel}>{label}</Text></View>;
}

function Detail({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <View style={[styles.detail, last && styles.detailLast]}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  topBar: { minHeight: 76, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border },
  eyebrow: { color: colors.violet, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  pageTitle: { marginTop: 3, color: colors.text, fontSize: fontSizes.title, fontWeight: '900' },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: '#3C2A68' },
  avatar: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.violet },
  avatarText: { color: colors.text, fontSize: 20, fontWeight: '900' },
  identityCopy: { flex: 1 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden', borderRadius: radii.pill, backgroundColor: colors.violetStrong, color: colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  identityTitle: { marginTop: spacing.sm, color: colors.text, fontSize: 21, fontWeight: '900' },
  identityBody: { marginTop: spacing.xs, color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 18 },
  balanceCard: { minHeight: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  cardLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  balance: { marginTop: spacing.xs, color: colors.text, fontSize: 32, fontWeight: '900' },
  sectionTitle: { marginTop: spacing.md, color: colors.text, fontSize: fontSizes.label, fontWeight: '900' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { width: '48%', minWidth: 130, flexGrow: 1, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontSize: 19, fontWeight: '900' },
  statValueAccent: { color: colors.emerald },
  statLabel: { marginTop: spacing.xs, color: colors.textMuted, fontSize: fontSizes.caption },
  bestPull: { padding: spacing.md, borderRadius: radii.md, backgroundColor: '#2A2037', borderWidth: 1, borderColor: '#F5C451' }, bestPullName: { marginTop: spacing.xs, color: '#F5C451', fontSize: 20, fontWeight: '900' }, shareButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, paddingHorizontal: spacing.md, minHeight: 38, borderRadius: radii.pill, backgroundColor: colors.violet }, shareText: { color: colors.text, fontWeight: '900', fontSize: fontSizes.caption },
  goalCard: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#3C2A68' }, goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, goalCount: { color: colors.violet, fontWeight: '900' }, goalTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.sm }, goalTrack: { height: 8, overflow: 'hidden', marginTop: spacing.md, borderRadius: radii.pill, backgroundColor: colors.surfaceRaised }, goalFill: { height: '100%', borderRadius: radii.pill, backgroundColor: colors.violet }, goalHint: { color: colors.textMuted, fontSize: fontSizes.caption, marginTop: spacing.sm },
  achievementList: { gap: spacing.sm }, achievement: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, opacity: .7 }, achievementUnlocked: { backgroundColor: '#29201A', borderColor: '#6B5726', opacity: 1 }, achievementTitle: { color: colors.text, fontWeight: '900' }, achievementStatus: { color: colors.textMuted, fontSize: fontSizes.caption, marginTop: 2 },
  detailsCard: { paddingHorizontal: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  detail: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLast: { borderBottomWidth: 0 },
  detailLabel: { color: colors.textMuted, fontSize: fontSizes.body },
  detailValue: { color: colors.text, fontSize: fontSizes.body, fontWeight: '700' },
  notice: { marginTop: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: '#10231D', borderWidth: 1, borderColor: '#1C5B46' },
  noticeTitle: { color: colors.emerald, fontWeight: '900' },
  noticeBody: { marginTop: spacing.xs, color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 18 },
  notificationCard: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, notificationCopy: { paddingRight: 56 }, notificationTitle: { color: colors.text, fontWeight: '900' }, notificationBody: { color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 18, marginTop: spacing.xs }, notificationSwitch: { position: 'absolute', right: spacing.md, top: spacing.md, width: 44, height: 26, padding: 3, borderRadius: radii.pill, backgroundColor: colors.surfaceRaised }, notificationSwitchEnabled: { backgroundColor: colors.violet }, notificationKnob: { width: 20, height: 20, borderRadius: radii.pill, backgroundColor: colors.textMuted }, notificationKnobEnabled: { alignSelf: 'flex-end', backgroundColor: colors.text }, notificationMessage: { color: colors.emerald, fontSize: fontSizes.caption, marginTop: spacing.md },
  resetCard: { marginTop: spacing.sm, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  resetTitle: { color: colors.text, fontWeight: '900' },
  resetBody: { marginTop: spacing.xs, color: colors.textMuted, fontSize: fontSizes.caption, lineHeight: 18 },
  resetWarning: { marginTop: spacing.sm, color: colors.danger, fontSize: fontSizes.caption, fontWeight: '800' },
  resetButton: { minHeight: 48, marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: radii.md, borderWidth: 1, borderColor: colors.danger },
  resetButtonConfirm: { backgroundColor: colors.danger },
  resetButtonText: { color: colors.danger, fontWeight: '900' },
  resetButtonTextConfirm: { color: colors.text },
});
