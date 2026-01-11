import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { useProjects } from '@/hooks/useProjects';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from '@/components/Timer/TimerDisplay';
import { TimerControls } from '@/components/Timer/TimerControls';
import { ActiveProjectHeader } from '@/components/Timer/ActiveProjectHeader';
import { QuickStartProjectCard } from '@/components/Timer/QuickStartProjectCard';

export default function TimerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { projects, getProject } = useProjects();
  const {
    status,
    projectId,
    elapsed,
    start,
    pause,
    resume,
    stop,
    discard,
  } = useTimer();

  const activeProject = projectId ? getProject(Number(projectId)) ?? null : null;

  const handleProjectSelect = (id: number) => {
    start(String(id));
  };

  const handleStart = () => {
    if (activeProject) {
      start(String(activeProject.id));
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: 120 },
      ]}
    >
      <ActiveProjectHeader project={activeProject} status={status} />

      <View style={styles.timerSection}>
        <TimerDisplay elapsed={elapsed} isPaused={status === 'paused'} />
      </View>

      <View style={styles.controlsSection}>
        <TimerControls
          status={status}
          hasProject={activeProject !== null}
          onStart={handleStart}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          onDiscard={discard}
        />
      </View>

      <View style={styles.quickStartSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          QUICK START
        </Text>
        <View style={styles.projectList}>
          {projects.map((project) => (
            <QuickStartProjectCard
              key={project.id}
              project={project}
              isActive={projectId === String(project.id)}
              timerStatus={status}
              onPress={() => handleProjectSelect(project.id)}
            />
          ))}
          {projects.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No projects yet. Create one to get started.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  timerSection: {
    marginBottom: spacing.xxl,
  },
  controlsSection: {
    marginBottom: spacing.xxl + spacing.md,
  },
  quickStartSection: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  projectList: {
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
