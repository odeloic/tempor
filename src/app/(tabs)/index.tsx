import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import { useProjects } from '@/hooks/useProjects';

export default function TimerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { projects } = useProjects();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: 120 },
      ]}
    >
      {/* Timer placeholder */}
      <Text style={[styles.timerPlaceholder, { color: colors.textSecondary }]}>
        Timer coming soon...
      </Text>

      {/* Quick Start Projects */}
      <View style={styles.quickStartSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          QUICK START
        </Text>
        <View style={styles.projectList}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              style={({ pressed }) => [
                styles.quickStartCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
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
  timerPlaceholder: {
    fontSize: 16,
    fontFamily: fonts.sans,
    textAlign: 'center',
    marginBottom: spacing.xxl,
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
    gap: 8,
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.md,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 14,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  projectName: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.sans,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});