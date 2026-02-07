import { Button } from '@/components/ui/Button';
import { ProjectItem } from '@/components/ui/ProjectItem';
import { type Project } from '@/db/schema';
import { useTheme } from '@/theme/ThemeProvider';
import { Plus, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ProjectBottomSheetProps {
  projects: Project[];
  selectedProjectId?: number;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onDismiss: () => void;
}

export function ProjectBottomSheet({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onDismiss,
}: ProjectBottomSheetProps) {
  const { colors, fonts, spacing } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
      ]}
    >
      {/* Handle bar */}
      <View style={styles.handleContainer}>
        <View
          style={[
            styles.handle,
            { backgroundColor: colors.border, borderRadius: 3 },
          ]}
        />
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Text
          style={[
            styles.title,
            {
              fontFamily: fonts.sansSemiBold,
              color: colors.textPrimary,
            },
          ]}
        >
          {t('projects.selectProject')}
        </Text>
        <Button variant="ghost" icon={X} onPress={onDismiss} />
      </View>

      {/* Project list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
        ]}
      >
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            selected={project.id === selectedProjectId}
            onPress={() => onSelectProject(project)}
          />
        ))}
      </ScrollView>

      {/* Create new project button — pinned at bottom */}
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        <Button
          variant="primary"
          label={t('projects.createNewProject')}
          icon={Plus}
          onPress={onCreateProject}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  handleContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 5,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    lineHeight: 17 * 1.4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 4,
    paddingTop: 8,
  },
});
