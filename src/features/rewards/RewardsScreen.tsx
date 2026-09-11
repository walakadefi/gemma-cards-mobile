import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppHeader } from '../../components/AppHeader';
import { AppScreen } from '../../components/AppScreen';
import { colors, radii, spacing } from '../../theme/tokens';
import { rewardPeriods } from './rewardPeriods';

type Period = 'daily' | 'weekly';
const key = (period: Period) => `@gemma/reward-preview/${period}`;

export function RewardsScreen() {
  const [now, setNow] = useState(() => new Date());
  const [claims, setClaims] = useState<Partial<Record<Period, string>>>({});
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<Period | null>(null);
  const [message, setMessage] = useState('');
  const periods = rewardPeriods(now);
  useEffect(() => {
    let active = true;
    Promise.all([AsyncStorage.getItem(key('daily')), AsyncStorage.getItem(key('weekly'))])
      .then(([daily, weekly]) => { if (active) { setClaims({ daily: daily ?? undefined, weekly: weekly ?? undefined }); setReady(true); } })
      .catch(() => { if (active) setMessage('Could not load saved claims. Reopen Rewards to try again.'); });
    const timer = setInterval(() => setNow(new Date()), 1000);
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') setNow(new Date()); });
    return () => { active = false; clearInterval(timer); subscription.remove(); };
  }, []);
  async function claim(period: Period) {
    const current = rewardPeriods(new Date())[period];
    if (!ready || busy || claims[period] === current) return;
    setBusy(period);
    try {
      await AsyncStorage.setItem(key(period), current);
      setClaims((previous) => ({ ...previous, [period]: current }));
      setMessage(`${period === 'daily' ? 'Daily' : 'Weekly'} preview claimed. No coins were added.`);
    } catch { setMessage('Could not save this claim. Please try again.'); }
    finally { setBusy(null); setNow(new Date()); }
  }
  return <AppScreen scroll><AppHeader balance={1000} /><View style={styles.content}>
    <Text style={styles.eyebrow}>REWARDS</Text><Text accessibilityRole="header" style={styles.title}>A reason to come back</Text>
    <Text style={styles.body}>Daily and weekly rewards, with one claim in each period.</Text>
    <View style={styles.notice}><Text style={styles.body}>Local claim preview. Live amounts and coin credits require a verified Gemma account.</Text></View>
    {(['daily', 'weekly'] as const).map((period) => {
      const claimed = claims[period] === periods[period];
      return <View key={period} style={styles.card}>
        <Text style={styles.eyebrow}>{period.toUpperCase()}</Text>
        <Text style={styles.heading}>{period === 'daily' ? 'A fresh start, every day' : 'Your weekly bonus'}</Text>
        <Text style={styles.body}>{period === 'daily' ? 'Resets at midnight in Italy.' : 'Resets every Monday at midnight in Italy.'}</Text>
        <Text style={styles.meta}>{period === 'daily' ? 'Day' : 'Week beginning'} · {periods[period]}</Text>
        <Text style={styles.body}>Gemma reveals the current reward range after sign-in.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Claim ${period} preview`} disabled={!ready || claimed || busy !== null} accessibilityState={{ disabled: !ready || claimed || busy !== null }} onPress={() => void claim(period)} style={[styles.button, (!ready || claimed || busy !== null) && styles.disabled]}>
          <Text style={styles.buttonText}>{claimed ? 'Claimed this period' : busy === period ? 'Saving…' : 'Try claim preview'}</Text>
        </Pressable>
      </View>;
    })}
    {message ? <Text accessibilityLiveRegion="polite" style={styles.body}>{message}</Text> : null}
    <Text style={styles.body}>Missed periods do not carry over. Gemma coins are platform credit and cannot be converted to cash.</Text>
    <Pressable accessibilityRole="link" onPress={() => void Linking.openURL('https://www.gemma.cards/rewards')} style={styles.button}><Text style={styles.buttonText}>Rewards on Gemma ↗</Text></Pressable>
  </View></AppScreen>;
}
const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.violet, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900' }, heading: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: spacing.sm },
  body: { color: colors.textMuted, lineHeight: 22 }, meta: { color: colors.emerald, fontSize: 12, marginVertical: spacing.sm },
  notice: { padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceRaised },
  card: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border },
  button: { minHeight: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.violetStrong, borderRadius: radii.md, marginTop: spacing.sm },
  disabled: { backgroundColor: colors.surfaceRaised }, buttonText: { color: colors.text, fontWeight: '800' },
});
