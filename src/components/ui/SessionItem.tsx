import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SessionItemProps {
  projectName: string;
  projectColor: string;
  duration: string;
  selected?: boolean;
  onPress?: () => void;
}

export function SessionItem({
  projectName,
  projectColor,
  duration,
  selected = false,
  onPress,
}: SessionItemProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  const textColor = selected ? colors.background : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: selected ? colors.textPrimary : colors.surface,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md - 2,
          gap: spacing.md - spacing.xs,
          opacity: pressed ? 0.8 : 1,
          borderColor: colors.border,
          borderWidth: selected ? 0 : 0.5,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: projectColor },
        ]}
      />

      <Text
        style={[
          styles.projectName,
          {
            fontFamily: fonts.sansMedium,
            color: textColor,
          },
        ]}
        numberOfLines={1}
      >
        {projectName}
      </Text>

      <View style={styles.spacer} />

      <Text
        style={[
          styles.duration,
          {
            fontFamily: fonts.sansSemiBold,
            color: textColor,
          },
        ]}
      >
        {duration}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  projectName: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
  },
  spacer: {
    flex: 1,
  },
  duration: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
  },
});
