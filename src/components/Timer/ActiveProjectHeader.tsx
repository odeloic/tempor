import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { spacing, fonts } from '@/theme/tokens';
import { type Project } from '@/db/schema';

type TimerStatus = 'idle' | 'running' | 'paused';

type ActiveProjectHeaderProps = {
  project: Project | null;
  status: TimerStatus;
};

export function ActiveProjectHeader({ project, status }: ActiveProjectHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const STATUS_LABELS: Record<TimerStatus, string> = {
    running: t('timer.status.tracking'),
    paused: t('timer.status.paused'),
    idle: t('timer.status.ready'),
  };
  const statusLabel = STATUS_LABELS[status];

  return (
    <View style={styles.container}>
      <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
        {statusLabel.toUpperCase()}
      </Text>
      {project ? (
        <View style={styles.projectRow}>
          <View
            style={[styles.colorDot, { backgroundColor: project.color }]}
          />
          <Text style={[styles.projectName, { color: colors.textPrimary }]}>
            {project.name}
          </Text>
        </View>
      ) : (
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          {t('timer.selectProject')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  projectName: {
    fontSize: 20,
    fontFamily: fonts.sansSemiBold,
  },
  placeholder: {
    fontSize: 20,
    fontFamily: fonts.sansMedium,
  },
});
