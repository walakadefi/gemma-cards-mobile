import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, radii, spacing } from '../theme/tokens';

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ eyebrow, title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" accessibilityHint="This is a demo action" onPress={onAction} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  eyebrow: { color: colors.violet, fontSize: fontSizes.caption, fontWeight: '800', letterSpacing: 1.3, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: fontSizes.title, fontWeight: '800', textAlign: 'center', marginBottom: spacing.sm },
  body: { color: colors.textMuted, fontSize: fontSizes.body, lineHeight: 22, textAlign: 'center', maxWidth: 360 },
  action: { minHeight: 44, justifyContent: 'center', marginTop: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.violet },
  actionText: { color: colors.text, fontWeight: '800', fontSize: fontSizes.body },
});
