import { useTheme } from '@/theme/ThemeProvider';
import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SelectButtonProps {
  label: string;
  color?: string;
  onPress: () => void;
  placeholder?: string;
}

export function SelectButton({
  label,
  color,
  onPress,
  placeholder,
}: SelectButtonProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  const hasLabel = label.length > 0;
  const displayText = hasLabel ? label : placeholder;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.md,
          paddingHorizontal: spacing.md,
          gap: spacing.md - spacing.xs,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {color ? (
        <View
          style={[
            styles.dot,
            { backgroundColor: color },
          ]}
        />
      ) : null}

      <Text
        style={[
          styles.label,
          {
            fontFamily: fonts.sansMedium,
            color: hasLabel ? colors.textPrimary : colors.textSecondary,
          },
        ]}
        numberOfLines={1}
      >
        {displayText}
      </Text>

      <View style={styles.spacer} />

      <ChevronDown size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  label: {
    fontSize: 15,
    lineHeight: 15 * 1.5,
  },
  spacer: {
    flex: 1,
  },
});
