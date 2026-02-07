import { type ReactNode } from 'react';
import { type Project } from '@/db/schema';
import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProjectItemProps {
  project: Project;
  variant?: 'default' | 'card';
  selected?: boolean;
  rightIcon?: ReactNode;
  onPress?: () => void;
}

export function ProjectItem({
  project,
  variant = 'default',
  selected = false,
  rightIcon,
  onPress,
}: ProjectItemProps) {
  const { name, color, client } = project;
  const { colors, fonts, spacing, radii } = useTheme();
  const isCard = variant === 'card';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderRadius: isCard ? radii.lg : radii.md,
          paddingHorizontal: isCard ? spacing.lg - 6 : spacing.md,
          gap: spacing.md - 2,
          backgroundColor: selected
            ? colors.textPrimary
            : isCard
              ? colors.surface
              : 'transparent',
          borderWidth: isCard ? 1 : 0,
          borderColor: isCard ? colors.border : 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: color },
        ]}
      />

      <View style={[styles.info, { gap: 2 }]}>
        <Text
          style={[
            styles.name,
            {
              fontFamily: selected ? fonts.sansSemiBold : fonts.sansMedium,
              color: selected ? colors.background : colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>

        {client ? (
          <Text
            style={[
              styles.subtitle,
              {
                fontFamily: fonts.sans,
                color: colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {client}
          </Text>
        ) : null}
      </View>

      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    lineHeight: 15 * 1.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 13 * 1.5,
  },
});
