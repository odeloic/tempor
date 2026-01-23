import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';
import type { Project } from '@/db/schema';

interface Props {
  project: Project;
  onPress: () => void;
}

export function ProjectCard({ project, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.colorIndicator, { backgroundColor: project.color }]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {project.name}
        </Text>
        {project.client && (
          <Text style={[styles.client, { color: colors.textSecondary }]}>
            {project.client}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.lg - 4,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 14,
  },
  colorIndicator: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
  },
  client: {
    fontSize: 13,
    fontFamily: fonts.sans,
  },
});