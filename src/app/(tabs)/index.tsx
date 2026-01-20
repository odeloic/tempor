import { ActiveProjectHeader } from "@/components/Timer/ActiveProjectHeader";
import { QuickStartProjectCard } from "@/components/Timer/QuickStartProjectCard";
import { TimerControls } from "@/components/Timer/TimerControls";
import { TimerDisplay } from "@/components/Timer/TimerDisplay";
import { Toast } from "@/components/ui/Toast";
import { useProjects } from "@/hooks/useProjects";
import { useTimer, type SavedSession } from "@/hooks/useTimer";
import { formatDuration } from "@/lib/time";
import { useTheme } from "@/theme/ThemeProvider";
import { fonts, spacing } from "@/theme/tokens";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TimerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { projects, getProject, refresh: refreshProjects } = useProjects();
  const { status, projectId, elapsed, start, pause, resume, stop, discard } =
    useTimer();

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const activeProject = projectId
    ? getProject(Number(projectId)) ?? null
    : null;

  const showSavedToast = useCallback(
    (saved: SavedSession) => {
      const project = getProject(Number(saved.projectId));
      const projectName = project?.name ?? "Previous project";
      const duration = formatDuration(saved.duration);
      setToastMessage(`Saved ${duration} to ${projectName}`);
      setToastVisible(true);
    },
    [getProject]
  );

  const handleProjectSelect = useCallback(
    async (id: number) => {
      const savedSession = await start(String(id));
      if (savedSession) {
        showSavedToast(savedSession);
      }
      // Refresh projects to update the "recently used" sorting
      refreshProjects();
    },
    [start, showSavedToast, refreshProjects]
  );

  const handleStart = useCallback(async () => {
    if (activeProject) {
      const savedSession = await start(String(activeProject.id));
      if (savedSession) {
        showSavedToast(savedSession);
      }
      // Refresh projects to update the "recently used" sorting
      refreshProjects();
    }
  }, [activeProject, start, showSavedToast, refreshProjects]);

  const handleHideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={handleHideToast}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: 120 },
        ]}
      >
        <ActiveProjectHeader project={activeProject} status={status} />

        <View style={styles.timerSection}>
          <TimerDisplay elapsed={elapsed} isPaused={status === "paused"} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    textTransform: "uppercase",
    marginBottom: spacing.md,
  },
  projectList: {
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
});
