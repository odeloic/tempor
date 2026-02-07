import { selectedProjectIdAtom } from '@/atoms/ui';
import { ProjectBottomSheet } from '@/components/Project/ProjectBottomSheet';
import { Screen } from '@/components/ui/Screen';
import { type Project } from '@/db/schema';
import { useProjects } from '@/hooks/useProjects';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export default function SelectProjectModal() {
  const router = useRouter();
  const { colors } = useTheme();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useAtom(selectedProjectIdAtom);

  const handleSelectProject = useCallback(
    (project: Project) => {
      setSelectedProjectId(project.id);
      router.back();
    },
    [setSelectedProjectId, router],
  );

  const handleCreateProject = useCallback(() => {
    router.back();
    router.push('/project/new');
  }, [router]);

  const handleDismiss = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Screen backgroundColor={colors.surface}>
      <ProjectBottomSheet
        projects={projects}
        selectedProjectId={selectedProjectId ?? undefined}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDismiss={handleDismiss}
      />
    </Screen>
  );
}
