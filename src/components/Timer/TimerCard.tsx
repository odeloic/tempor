import { Button } from '@/components/ui/Button';
import { SelectButton } from '@/components/ui/SelectButton';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { type Project } from '@/db/schema';
import { useTimer, type SavedSession } from '@/hooks/useTimer';
import { useTheme } from '@/theme/ThemeProvider';
import { MoreHorizontal, Pause, Play, Plus, Square } from 'lucide-react-native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type TimerCardStatus = 'idle' | 'running' | 'paused' | 'empty';

interface TimerCardProps {
  project: Project | null;
  hasProjects: boolean;
  onSelectProject: () => void;
  onCreateProject: () => void;
  onMore?: () => void;
  onSessionSaved?: (saved: SavedSession) => void;
}

export function TimerCard({
  project,
  hasProjects,
  onSelectProject,
  onCreateProject,
  onMore,
  onSessionSaved,
}: TimerCardProps) {
  const { colors, fonts, spacing, radii, statusColors } = useTheme();
  const { t } = useTranslation();
  const { status, elapsed, start, pause, resume, stop } = useTimer();

  const cardStatus: TimerCardStatus = !hasProjects ? 'empty' : status;

  const statusLabelMap = {
    idle: t('timer.status.idle'),
    running: t('timer.status.tracking'),
    paused: t('timer.status.paused'),
    empty: t('timer.status.ready'),
  } as const;
  const statusLabel = statusLabelMap[cardStatus];
  const statusColor =
    cardStatus === 'running'
      ? statusColors.running
      : cardStatus === 'paused'
        ? statusColors.paused
        : colors.textSecondary;

  const handleStart = useCallback(async () => {
    if (!project) return;
    const saved = await start(String(project.id));
    if (saved) onSessionSaved?.(saved);
  }, [project, start, onSessionSaved]);

  const handleStop = useCallback(async () => {
    const saved = await stop();
    if (saved) onSessionSaved?.(saved);
  }, [stop, onSessionSaved]);

  const handlePause = useCallback(async () => {
    await pause();
  }, [pause]);

  const handleResume = useCallback(async () => {
    await resume();
  }, [resume]);

  const renderProjectInfo = () => (
    <View style={[styles.projectInfo, { gap: spacing.md - 4 }]}>
      <View
        style={[
          styles.projectDot,
          { backgroundColor: project?.color ?? colors.destructive },
        ]}
      />
      <Text
        style={[
          styles.projectName,
          {
            fontFamily: fonts.sansMedium,
            color: colors.textPrimary,
          },
        ]}
        numberOfLines={1}
      >
        {project?.name}
      </Text>
    </View>
  );

  const renderActions = () => (
    <View style={[styles.actions, { gap: spacing.md - 4 }]}>
      <Button
        variant="destructive"
        label={t('timer.controls.stop')}
        icon={Square}
        onPress={handleStop}
        style={styles.flex1}
      />
      {status === 'running' ? (
        <Button
          variant="secondary"
          label={t('timer.controls.pause')}
          icon={Pause}
          onPress={handlePause}
          style={styles.flex1}
        />
      ) : (
        <Button
          variant="secondary"
          label={t('timer.controls.resume')}
          icon={Play}
          onPress={handleResume}
          style={styles.flex1}
        />
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.statusLabel,
            {
              fontFamily: fonts.sansMedium,
              color: statusColor,
            },
          ]}
        >
          {statusLabel}
        </Text>
        <Button variant="ghost" icon={MoreHorizontal} onPress={onMore} />
      </View>

      {/* Timer display */}
      <TimerDisplay
        elapsed={elapsed}
        status={cardStatus === 'empty' ? 'empty' : status}
      />

      {/* Idle: project selector + start button */}
      {cardStatus === 'idle' && (
        <>
          <SelectButton
            label={project?.name ?? ''}
            color={project?.color}
            placeholder={t('timer.selectProject')}
            onPress={onSelectProject}
          />
          <View style={[styles.actions, { gap: spacing.md - 4 }]}>
            <Button
              variant={project ? 'primary' : 'disabled'}
              label={t('timer.controls.start')}
              icon={Play}
              onPress={handleStart}
              disabled={!project}
              style={styles.flex1}
            />
          </View>
        </>
      )}

      {/* Running / Paused: shared project info + action buttons */}
      {(cardStatus === 'running' || cardStatus === 'paused') && (
        <>
          {renderProjectInfo()}
          {renderActions()}
        </>
      )}

      {/* Empty: no projects */}
      {cardStatus === 'empty' && (
        <View style={[styles.emptyContent, { gap: spacing.md, paddingVertical: spacing.lg }]}>
          <View style={[styles.emptyText, { gap: spacing.xs }]}>
            <Text
              style={[
                styles.emptyTitle,
                {
                  fontFamily: fonts.sansSemiBold,
                  color: colors.textPrimary,
                },
              ]}
            >
              {t('timer.noProjectsTitle')}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  fontFamily: fonts.sans,
                  color: colors.textSecondary,
                },
              ]}
            >
              {t('timer.noProjectsSubtitle')}
            </Text>
          </View>
          <Button variant="icon" icon={Plus} onPress={onCreateProject} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 11,
    letterSpacing: 1.65,
  },
  actions: {
    flexDirection: 'row',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  projectName: {
    fontSize: 15,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  flex1: {
    flex: 1,
  },
});
