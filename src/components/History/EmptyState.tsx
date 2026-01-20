import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fonts, spacing } from '@/theme/tokens';

type EmptyStateProps = {
  hasFilters: boolean;
};

export function EmptyState({ hasFilters }: EmptyStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {hasFilters
          ? t('history.noEntriesFiltered')
          : t('history.noEntries')}
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
