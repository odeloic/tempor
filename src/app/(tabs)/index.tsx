import { selectedProjectIdAtom } from "@/atoms/ui";
import { ProjectsCard } from "@/components/Project/ProjectsCard";
import { TimerCard } from "@/components/Timer/TimerCard";
import { AppScrollView } from "@/components/ui/AppScrollView";
import { Screen } from "@/components/ui/Screen";
import { ScreenSection } from "@/components/ui/ScreenSection";
import { StatsCard } from "@/components/ui/StatsCard";
import { Toast } from "@/components/ui/Toast";
import { type Project } from "@/db/schema";
import { useProjects } from "@/hooks/useProjects";
import { useTimeEntries } from "@/hooks/useTimeEntries";
import { useTimer, type SavedSession } from "@/hooks/useTimer";
import { scale } from "@/lib/scale";
import { formatDuration } from "@/lib/time";

import { endOfDay, startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TimerScreen() {

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { projects, getProject } = useProjects();
  const { status, projectId } = useTimer();

  const todayRange = useMemo(() => {
    const now = new Date();
    return { start: startOfDay(now), end: endOfDay(now) };
  }, []);
  const { entries: todayEntries, totalDuration: todayDuration } =
    useTimeEntries({ dateRange: todayRange });

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useAtom(
    selectedProjectIdAtom,
  );

  const activeProject = projectId
    ? (getProject(Number(projectId)) ?? null)
    : null;

  const selectedProject = selectedProjectId
    ? (getProject(selectedProjectId) ?? null)
    : null;

  const displayProject = status !== "idle" ? activeProject : selectedProject;

  useEffect(() => {
    if (status !== "idle") setSelectedProjectId(null);
  }, [status, setSelectedProjectId]);

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

  const handleHideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const aTime = a.lastUsedAt?.getTime() ?? 0;
        const bTime = b.lastUsedAt?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 2);
  }, [projects]);

  const handleSelectProject = useCallback(
    (project: Project) => {
      setSelectedProjectId(project.id);
    },
    [setSelectedProjectId],
  );

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
          paddingTop: insets.top,
          paddingBottom: 120,
          gap: scale(10),
        }}
      >
        <ScreenSection>
          <TimerCard
            project={displayProject}
            hasProjects={projects.length > 0}
            onSelectProject={() => router.push("/project/select")}
            onCreateProject={() => router.push("/project/new")}
            onSessionSaved={showSavedToast}
          />
        </ScreenSection>
        <ScreenSection>
          <StatsCard
            title={t("timer.today")}
            stats={[
              {
                value: formatDuration(todayDuration),
                label: t("timer.totalTime"),
              },
              {
                value: String(todayEntries.length),
                label: t("timer.sessions"),
              },
            ]}
          />
        </ScreenSection>
        {projects.length > 0 && (
          <ScreenSection>
            <ProjectsCard
              projects={recentProjects}
              onSelectProject={handleSelectProject}
              onViewAll={() => router.push("/project/select")}
            />
          </ScreenSection>
        )}
      </AppScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
