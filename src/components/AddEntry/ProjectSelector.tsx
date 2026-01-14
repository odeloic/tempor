import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type Project } from '@/db/schema';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type ProjectSelectorProps = {
  projects: Project[];
  selectedId: number | null;
  onSelect: (projectId: number) => void;
};

export function ProjectSelector({
  projects,
  selectedId,
  onSelect,
}: ProjectSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        PROJECT
      </Text>
      <View style={styles.list}>
        {projects.map((project) => {
          const isSelected = selectedId === project.id;
          return (
            <Pressable
              key={project.id}
              onPress={() => onSelect(project.id)}
              style={({ pressed }) => [
                styles.projectItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.textPrimary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                style={[styles.colorDot, { backgroundColor: project.color }]}
              />
              <Text style={[styles.projectName, { color: colors.textPrimary }]}>
                {project.name}
              </Text>
            </Pressable>
          );
        })}
        {projects.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No projects. Create one first.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  list: {
    gap: 6,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansMedium,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
