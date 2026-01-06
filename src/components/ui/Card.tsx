import { useTheme } from '@/theme/ThemeProvider';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  const { colors, spacing, radii } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: spacing.md,
          borderRadius: radii.lg,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});