import { useTheme } from '@/theme/ThemeProvider';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

interface TabBarItemProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
}

export function TabBarItem({
  icon: Icon,
  label,
  selected,
  onPress,
  onLongPress,
  accessibilityLabel,
}: TabBarItemProps) {
  const { colors, fonts, radii } = useTheme();

  const contentColor = selected ? colors.background : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          backgroundColor: selected ? colors.textPrimary : 'transparent',
          borderRadius: radii.md,
        },
      ]}
    >
      <Icon size={20} color={contentColor} strokeWidth={1.67} />
      <Text
        style={[
          styles.label,
          {
            color: contentColor,
            fontFamily: fonts.sansMedium,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 59,
    paddingVertical: 10,
    gap: 4,
  },
  label: {
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },
});
