import React from 'react';
import { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

export function Screen({ children, style, backgroundColor }: ScreenProps) {
  const { colors } = useTheme();
  const resolvedBackground = backgroundColor ?? colors.background;

  return (
    <View style={[styles.base, { backgroundColor: resolvedBackground }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
