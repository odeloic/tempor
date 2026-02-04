import { useTheme } from '@/theme/ThemeProvider';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fonts } from '@/theme/tokens';
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
          <View style={styles.projectInfo}>
            <Text style={[styles.projectName, { color: colors.textPrimary }]}>
              {project.name}
            </Text>
            {project.client && (
              <Text style={[styles.clientName, { color: colors.textSecondary }]}>
                {project.client}
              </Text>
            )}
          </View>
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
    marginBottom: 48,
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.65,
    lineHeight: 16.5,
    marginBottom: 8,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  projectInfo: {
    gap: 2,
  },
  projectName: {
    fontSize: 20,
    fontFamily: fonts.sansSemiBold,
    lineHeight: 30,
  },
  clientName: {
    fontSize: 14,
    fontFamily: fonts.sans,
  },
  placeholder: {
    fontSize: 20,
    fontFamily: fonts.sansMedium,
    lineHeight: 30,
  },
});
