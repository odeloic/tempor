import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fonts, radii, spacing } from '@/theme/tokens';
import { formatDuration } from '@/lib/time';

type TotalHoursCardProps = {
  totalSeconds: number;
};

export function TotalHoursCard({ totalSeconds }: TotalHoursCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {t('history.totalHours')}
      </Text>
      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {formatDuration(totalSeconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingHorizontal: 20,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.sans,
  },
  value: {
    fontSize: 20,
    fontFamily: fonts.mono,
  },
});
