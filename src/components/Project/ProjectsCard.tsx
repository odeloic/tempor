import { ProjectItem } from '@/components/ui/ProjectItem';
import { type Project } from '@/db/schema';
import { useTheme } from '@/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProjectsCardProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onViewAll?: () => void;
}

export function ProjectsCard({
  projects,
  onSelectProject,
  onViewAll,
}: ProjectsCardProps) {
  const { colors, fonts, spacing, radii } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.md + 4,
          gap: spacing.md - 4,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerLabel,
            {
              fontFamily: fonts.sansMedium,
              color: colors.textSecondary,
            },
          ]}
        >
          {t('projects.recentSessions')}
        </Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text
            style={[
              styles.viewAll,
              {
                fontFamily: fonts.sansSemiBold,
                color: colors.textPrimary,
              },
            ]}
          >
            {t('projects.viewAll')}
          </Text>
        </Pressable>
      </View>

      {/* Project list */}
      <View style={[styles.list, { gap: spacing.sm }]}>
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onPress={() => onSelectProject?.(project)}
          />
        ))}
      </View>
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
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.65,
  },
  viewAll: {
    fontSize: 13,
  },
  list: {},
});
