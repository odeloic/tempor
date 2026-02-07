import { ProjectFilterChip } from '@/components/History/ProjectFilterChip';
import { type Project } from '@/db/schema';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

interface ProjectsFilterProps {
  projects: Project[];
  selectedProjectId: number | null;
  onSelectProject: (projectId: number | null) => void;
}

export function ProjectsFilter({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectsFilterProps) {
  const { spacing } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { gap: spacing.sm }]}
    >
      <ProjectFilterChip
        label={t('history.allProjects')}
        isSelected={selectedProjectId === null}
        onPress={() => onSelectProject(null)}
      />
      {projects.map((project) => (
        <ProjectFilterChip
          key={project.id}
          project={project}
          isSelected={selectedProjectId === project.id}
          onPress={() => onSelectProject(project.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
