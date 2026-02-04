import { ActiveProjectHeader } from "@/components/Timer/ActiveProjectHeader";
import { QuickStartProjectCard } from "@/components/Timer/QuickStartProjectCard";
import { TimerControls } from "@/components/Timer/TimerControls";
import { TimerDisplay } from "@/components/Timer/TimerDisplay";
import { Toast } from "@/components/ui/Toast";
import { AppScrollView } from "@/components/ui/AppScrollView";
import { Screen } from "@/components/ui/Screen";
import { ScreenSection } from "@/components/ui/ScreenSection";
import { useProjects } from "@/hooks/useProjects";
import { useTimer, type SavedSession } from "@/hooks/useTimer";
import { formatDuration } from "@/lib/time";
import { useTheme } from "@/theme/ThemeProvider";
import { fonts, spacing } from "@/theme/tokens";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TimerScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { projects, getProject } = useProjects();
  const { status, projectId, elapsed, start, stop, discard } = useTimer();

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const activeProject = projectId
    ? (getProject(Number(projectId)) ?? null)
    : null;

  /**
   * FIXME: Wouldn't this be something like a hook useToast that can be reused
   * anywhere within the app? I imagine this would be better suited for different use cases
   * Saving a project, Saving a new time entry
   * Also different states: Error, Success, Warning
   */
  const showSavedToast = useCallback(
    (saved: SavedSession) => {
      const project = getProject(Number(saved.projectId));
      const projectName = project?.name ?? "Previous project";
      const duration = formatDuration(saved.duration);
      setToastMessage(
        t("timer.savedToast", { duration, project: projectName }),
      );
      setToastVisible(true);
    },
    [getProject, t],
  );

  // FIXME: Not every time i select a project this toast shows up
  const handleProjectSelect = useCallback(
    async (id: number) => {
      const savedSession = await start(String(id));
      if (savedSession) {
        showSavedToast(savedSession);
      }
    },
    [start, showSavedToast],
  );

  const handleStart = useCallback(async () => {
    if (activeProject) {
      const savedSession = await start(String(activeProject.id));
      if (savedSession) {
        showSavedToast(savedSession);
      }
    }
  }, [activeProject, start, showSavedToast]);

  const handleStop = useCallback(async () => {
    const savedSession = await stop();
    if (savedSession) {
      showSavedToast(savedSession);
    }
  }, [stop, showSavedToast]);

  const handleHideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <Screen>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={handleHideToast}
      />
      <AppScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: 120,
        }}
      >
        <ScreenSection>
          <ActiveProjectHeader project={activeProject} status={status} />

          <View style={styles.timerSection}>
            <TimerDisplay elapsed={elapsed} isPaused={status === "paused"} />
          </View>

          <View style={styles.controlsSection}>
            {/** FIXME: As far as i know */}
            <TimerControls
              status={status}
              hasProject={activeProject !== null}
              onStart={handleStart}
              onStop={handleStop}
              onDiscard={discard}
            />
          </View>

          <View style={styles.quickStartSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {t("timer.quickStart")}
            </Text>
            <View style={styles.projectList}>
              {/**
               * FIXME: Now this is a component that is being re-used in multiple places
               * Timer screen, when creating an entry, when editing an entry, etc...
               * Need to be refactored and re-designed to support multiple projects,
               * or even maybe add a quick add
               */}
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
                  {t("timer.noProjects")}
                </Text>
              )}
            </View>
          </View>
        </ScreenSection>
      </AppScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
    letterSpacing: 1.65,
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
