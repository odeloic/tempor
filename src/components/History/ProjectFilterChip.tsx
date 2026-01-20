import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, spacing } from '@/theme/tokens';
import { type Project } from '@/db/schema';

type ProjectFilterChipProps = {
  project?: Project;
  isSelected: boolean;
  onPress: () => void;
  label?: string;
};

export function ProjectFilterChip({
  project,
  isSelected,
  onPress,
  label,
}: ProjectFilterChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: isSelected ? colors.textPrimary : 'transparent',
          borderColor: isSelected ? 'transparent' : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {project && (
        <View style={[styles.colorDot, { backgroundColor: project.color }]} />
      )}
      <Text
        style={[
          styles.label,
          { color: isSelected ? colors.background : colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {label ?? project?.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
  },
});
