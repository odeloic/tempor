import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
  title: string;
  stats: {
    value: string;
    label: string;
  }[];
}

export function StatsCard({ title, stats }: StatsCardProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md + 4,
          gap: spacing.md,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.textSecondary,
            fontFamily: fonts.sansMedium,
          },
        ]}
      >
        {title}
      </Text>
      <View style={[styles.statsRow, { gap: spacing.md }]}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.stat, { gap: spacing.xs }]}>
            <Text
              style={[
                styles.value,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.sansSemiBold,
                },
              ]}
            >
              {stat.value}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.sansMedium,
                },
              ]}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
  },
  title: {
    fontSize: 11,
    letterSpacing: 1.65,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  value: {
    fontSize: 24,
  },
  label: {
    fontSize: 13,
  },
});
