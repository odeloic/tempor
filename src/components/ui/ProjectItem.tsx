import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProjectItemProps {
  name: string;
  color: string;
  subtitle?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function ProjectItem({
  name,
  color,
  subtitle,
  selected = false,
  onPress,
}: ProjectItemProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          gap: spacing.md - 2,
          backgroundColor: selected ? colors.textPrimary : 'transparent',
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

        {subtitle ? (
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
            {subtitle}
          </Text>
        ) : null}
      </View>
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
