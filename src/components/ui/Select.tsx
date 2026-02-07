import { useTheme } from '@/theme/ThemeProvider';
import { ChevronDown, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SelectProps {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: LucideIcon;
  onPress: () => void;
}

export function Select({
  label,
  value,
  placeholder = 'Select option',
  icon: Icon,
  onPress,
}: SelectProps) {
  const { colors, fonts, spacing, radii } = useTheme();

  const displayText = value ?? placeholder;
  const hasValue = value !== undefined && value.length > 0;

  return (
    <View style={[styles.wrapper, { gap: spacing.sm + 2 }]}>
      <Text
        style={[
          styles.label,
          {
            fontFamily: fonts.sansMedium,
            color: colors.textSecondary,
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
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
        {Icon ? (
          <Icon size={18} color={colors.textSecondary} />
        ) : null}

        <Text
          style={[
            styles.value,
            {
              fontFamily: fonts.sansMedium,
              color: hasValue ? colors.textPrimary : colors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        <View style={styles.spacer} />

        <ChevronDown size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.65,
    lineHeight: 11 * 1.5,
  },
  button: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  value: {
    fontSize: 15,
    lineHeight: 15 * 1.5,
  },
  spacer: {
    flex: 1,
  },
});
