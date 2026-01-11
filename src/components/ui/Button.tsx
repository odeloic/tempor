import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  const { colors, spacing, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.textPrimary,
          padding: spacing.md,
          borderRadius: radii.md,
        },
      ]}
    >
      <Text style={{ color: colors.background }}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
});