import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import { fonts, spacing } from '@/theme/tokens';

type EmptyStateProps = {
  hasFilters: boolean;
};

export function EmptyState({ hasFilters }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {hasFilters
          ? 'No entries match your filters'
          : 'No time entries yet'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.sans,
  },
});
