import { useTheme } from '@/theme/ThemeProvider';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, type ViewStyle, type TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'disabled' | 'icon' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  variant = 'primary',
  label,
  icon: Icon,
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors, fonts, radii } = useTheme();

  const isIconOnly = variant === 'icon' || variant === 'ghost';
  const resolvedVariant = disabled ? 'disabled' : variant;

  const containerStyle = getContainerStyle(resolvedVariant, colors, radii);
  const labelStyle = getLabelStyle(resolvedVariant, colors, fonts);
  const iconColor = getIconColor(resolvedVariant, colors);
  const iconSize = getIconSize(resolvedVariant);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || resolvedVariant === 'disabled'}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && styles.pressed,
        style,
      ]}
    >
      {Icon && (
        <Icon
          size={iconSize}
          color={iconColor}
          strokeWidth={2}
        />
      )}
      {!isIconOnly && label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

function getContainerStyle(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
  radii: ReturnType<typeof useTheme>['radii'],
): ViewStyle {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.textPrimary,
        borderRadius: radii.md,
        height: 56,
        paddingHorizontal: 24,
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        borderRadius: radii.md,
        height: 56,
        paddingHorizontal: 24,
        borderWidth: 1.5,
        borderColor: colors.border,
      };
    case 'destructive':
      return {
        backgroundColor: 'transparent',
        borderRadius: radii.md,
        height: 56,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'disabled':
      return {
        backgroundColor: colors.border,
        borderRadius: radii.md,
        height: 56,
        paddingHorizontal: 24,
      };
    case 'icon':
      return {
        backgroundColor: colors.textPrimary,
        borderRadius: 10,
        height: 40,
        width: 40,
      };
    case 'ghost':
      return {
        backgroundColor: colors.background,
        borderRadius: radii.lg,
        height: 32,
        width: 32,
      };
  }
}

function getLabelStyle(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['fonts'],
): TextStyle {
  const base: TextStyle = {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    lineHeight: 15 * 1.5,
    textAlign: 'center',
  };

  switch (variant) {
    case 'primary':
      return { ...base, color: colors.background };
    case 'secondary':
      return { ...base, color: colors.textPrimary };
    case 'destructive':
      return { ...base, color: colors.destructive };
    case 'disabled':
      return { ...base, color: colors.textSecondary };
    default:
      return base;
  }
}

function getIconColor(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  switch (variant) {
    case 'primary':
    case 'icon':
      return colors.background;
    case 'secondary':
      return colors.textPrimary;
    case 'destructive':
      return colors.destructive;
    case 'disabled':
      return colors.textSecondary;
    case 'ghost':
      return colors.textSecondary;
    default:
      return colors.textPrimary;
  }
}

function getIconSize(variant: ButtonVariant): number {
  switch (variant) {
    case 'icon':
      return 20;
    case 'ghost':
      return 16;
    default:
      return 18;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    // Static label styles are applied inline via getLabelStyle
  },
});
