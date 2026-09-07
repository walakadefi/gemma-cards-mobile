import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSizes, radii, spacing } from '../theme/tokens';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function FilterChip({ label, selected, onPress, accessibilityLabel }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selectedChip: { borderColor: colors.violet, backgroundColor: colors.violet },
  label: { color: colors.textMuted, fontSize: fontSizes.body, fontWeight: '700' },
  selectedLabel: { color: colors.text },
});
